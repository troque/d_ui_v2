import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';
import { getUser } from '../../Utils/Common';
import ClasificacionRadicadoApi from '../../Api/Services/ClasificacionRadicadoApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { Link } from "react-router-dom";

function EnviaraAlguienDeMiDependencia() {

    const [getUsuarioSleccionado, setUsuarioSleccionado] = useState("");
    const [getListaUusariosDependencia, setListaUusariosDependencia] = useState({ data: [], links: [], meta: [] });
    const [getUsuarioNombre, setUsuarioNombre] = useState("");
    const [getUsuarioApellido, setUsuarioApellido] = useState("");
    const [getUsuarioName, setUsuarioName] = useState("");
    const [getUsuarioDependenciaNombre, setUsuarioDependenciaNombre] = useState("");
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');

    const location = useLocation();
    const { from } = location.state;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    // Constante de modal general
    const getMensajeTituloModal = from.nombreProcesoTransacciones && from.nombreProcesoTransacciones.length > 0 ? from.nombreProcesoTransacciones : "";

    /**
     * Funcion principal
     */
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();
        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    obtenerParametros();
                    cargarUsuariosDependencia();
                }
            }
        )
    }


    // Funcion que nos ayuda a ver si existen caracteres especiales en el textarea de -Informacion para su remisión-
    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }


    const enviarDatos = (valores) => {

        // Se captura el id de la dependencia del usuario
        const iduserdependencia = getUser().id_dependencia;

        // Se inicializa el cargando
        window.showSpinner(true);

        // Se inicializa la variable de respuesta
        let data;

        // Se redeclara los datos
        data = {
            "data": {
                "type": "transacciones",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_dependencia_origen": iduserdependencia,
                    "usuario_a_remitir": getUsuarioSleccionado,
                    "descripcion_a_remitir": valores.informacion,
                    "id_etapa": 3
                }
            }
        };

        // Se consume la API
        GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(

            // Se inicializa la variable de respuesta
            datos => {

                /// Se valida que no haya error
                if (!datos.error) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Constante del mensaje de la modal
                    const mensajeModal = 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + getUsuarioNombre + ' ' + getUsuarioApellido + ' (' + getUsuarioName + ')  de la dependencia: ' + getUsuarioDependenciaNombre + '';

                    // Se setea el modal
                    setModalState({ title: getMensajeTituloModal.toUpperCase(), message: mensajeModal.toUpperCase(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea el modal
                    setModalState({ title: getMensajeTituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name == "usuario") {
            setUsuarioSleccionado(value);
            datosDelUsuarioARemitir(value)
        }
    }

    const datosDelUsuarioARemitir = (name) => {
        GenericApi.getGeneric('usuario/get-usuario-por-name/' + name).then(
            datos => {
                if (!datos.error) {
                    // console.log(datos);
                    setUsuarioNombre(datos.data[0].attributes.nombre);
                    setUsuarioApellido(datos.data[0].attributes.apellido);
                    setUsuarioName(datos.data[0].attributes.name);
                    setUsuarioDependenciaNombre(datos.data[0].attributes.dependencia.nombre);
                }
            }
        )
    }

    // Obtenemos la lista de usuarios de la misma dependencia
    const listaUsuariosPorDependencia = () => {
        return (
            getListaUusariosDependencia.data.map((usuario, i) => {
                if (getUser().nombre != usuario.attributes.name) {
                    return (
                        <option key={usuario.id} value={usuario.attributes.name}>{usuario.attributes.nombre} {usuario.attributes.name}</option>
                    )
                }

            })
        )
    }

    // consultamos la cantidad maxima de caracteres para el textarea
    const obtenerParametros = () => {
        try {
            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            //buscamos el parametro
            GenericApi.getByDataGeneric('parametro/parametro-nombre', data).then(
                datos => {
                    if (!datos.error) {
                        if (datos["data"].length > 0) {
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ))
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ))
                        }
                    } else {
                        window.showModal(1);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }


    const cargarUsuariosDependencia = () => {

        // Se captura el id de la dependencia del usuario
        const iduserdependencia = getUser().id_dependencia;

        // Se consume la API
        GenericApi.getAllGeneric("usuario/get-todos-usuarios-dependencia-actuaciones/" + iduserdependencia + "/" + procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Constante de mensaje
                    const mensajeGeneralModal = "No hay usuarios con permisos en la dependencia para asignar el proceso";

                    // Se setea la lista de usuarios
                    setListaUusariosDependencia(datos);

                    // Se valida que haya informacion o si solo está el usuario actual muestra alerta 
                    if (datos.data.length == 0 || (datos.data.length == 1 && getUser().nombre == datos.data[0].attributes.name)) {

                        // Se setea el modal
                        setModalState({ title: getMensajeTituloModal.toUpperCase(), message: mensajeGeneralModal.toUpperCase(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                } else {

                    // Se setea el modal
                    setModalState({ title: getMensajeTituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        );
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: '',
                    usuario: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    setCountTextArea(valores.informacion.length)
                    let errores = {}
                    if (getUsuarioSleccionado == undefined || getUsuarioSleccionado == "")
                        errores.usuario = 'Debe seleccionar un usuario'

                    if (!valores.informacion) {
                        errores.informacion = 'Debe ingresar un valor'
                    }
                    else if (valores.informacion.length <= getMinimoTextArea) {
                        errores.informacion = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres'
                    }
                    if (valores.informacion) {
                        if (containsSpecialChars(valores.informacion))
                            errores.informacion = 'Tiene caracteres inválidos'
                    }

                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                }}
            >
                {({ errors }) => (
                    <Form>
                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Enviar a alguien de mi dependencia</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso.toUpperCase()} <strong> :: ENVIAR A ALGUIEN DE MI DEPENDENCIA</strong></h3>
                            </div>
                            <div className="block-content">

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="dependenciaDestino">SELECCIONE EL USUARIO AL QUE SE ENVIARÁ EL PROCESO PARA SU GESTIÓN {getUsuarioSleccionado.toUpperCase()} <span className="text-danger">*</span></label>
                                            <Field value={getUsuarioSleccionado} onChange={handleInputChange} as="select" className="form-control" id="usuario" name="usuario">
                                                <option value="">Por favor seleccione</option>
                                                {listaUsuariosPorDependencia()}
                                            </Field>
                                            <ErrorMessage name="usuario" component={() => (<span className="text-danger">{errors.usuario}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="informacion">OBSERVACIONES <span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder="Información para su remisión...."
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">ENVIAR</button>
                                    <Link to={'/Transacciones'} state={{ from: from }} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary" >CANCELAR</button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>
    );
}

export default EnviaraAlguienDeMiDependencia;