import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';
import ParametrosMasApi from "../../Api/Services/ParametrosMasApi";
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../Spinner';
import { Navigate } from "react-router-dom";
import '../../Utils/Constants';
import ModalAceptarActualizar from '../../Utils/Modals/ModalAceptarActualizar';

function ModalRemitirExpediente(props) {

    const [getListaDependenciaDestino, setListaDependenciaDestino] = useState({ data: {} });
    const [getRespuestaDependenciaDestino, setRespuestaDependenciaDestino] = useState(false);
    
    const [getDependenciaSeleccionada, setDependenciaSeleccionada] = useState("");
    const [getUsuarioSeleccionado, setUsuarioSeleccionado] = useState("");
    const [getListaUsuariosDependencia, setListaUsuariosDependencia] = useState({ data: [], links: [], meta: [] });
    const [errorApi, setErrorApi] = useState('');
    const [getTextoTitulo, setTextoTitulo] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getDependenciaDestino, setDependenciaDestino] = useState('');
    const [getEnviaaJefe, setEnviaaJefe] = useState(false);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getInformacion, setInformacion] = useState("");
    const [getCountInformacion, setCountInformacion] = useState(0);

    // Constante encargado de redirigir
    const redirectToRoutes = () => {
        return <Navigate to={`/MisPendientes/`} />;
    }

    // Metodo principal de la clase
    useEffect(() => {

        // Se define la funcion asyncrona principal
        async function fetchData() {

            // En la tabla MAS_DEPENDENCIA_ACCESO el 1 corresponde a remitir proceso
            GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.REMITIR_PROCESO).then(
                datos => !datos.error ? (setListaDependenciaDestino(datos), setRespuestaDependenciaDestino(true)) : window.showModal(1)
            )

            // Se llama el metodo general para obtener los parametros
            obtenerParametros();
        }

        // Se llama el metodo
        fetchData();
    }, []);

    // Metodo encargado de retornar en blanco los caracteres especiales
    function containsSpecialChars(str) {

        // Se valida que este el parametro dentro de los caracteres especiales
        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {

            // Se valida que se encuentre
            if (str.includes(specialChar)) {

                // Se retorna true
                return true;
            }

            // Se retorna false
            return false;
        });

        // Se retorna el resultado
        return result;
    }

    // Metodo encargado de obtener los parametros generales del sistema
    const obtenerParametros = () => {

        // Se usa el trycatch
        try {

            // Se inicializa el array de informacion
            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            // Se consume la API
            GenericApi.getByDataGeneric('parametro/parametro-nombre', data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se valida que la longitud del array tenga información
                        if (datos["data"].length > 0) {

                            // Se filtra que el array contenga el minimo de caracteres
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (

                                // Se setea el valor minimo del texto
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ))

                            // Se filtra que el array contenga el maximo de caracteres
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (

                                // Se setea el valor maximo del texto
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ))
                        }
                    } else {

                        // Se muestra el modal
                        window.showModal(1);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de listar las dependencias destino
    const selectDependenciaDestino = () => {

        // Se retorna
        return (

            // Se recorre el array de las dependencias
            getListaDependenciaDestino.data.map((dependencia, i) => {

                // Se retorna
                return (

                    // Se retorna cada option con su valor
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                )
            })
        )
    }

    // Metodo encargado de validar al momento de que cambie el select de dependencias
    const selectChangeDependencia = (e) => {

        // Se valida que el valor sea vacio para retornar
        if (e.target.value === "") return;

        // Se setean los valores en vacio
        setDependenciaDestino("");
        setUsuarioSeleccionado("");

        // Se busca el id del usuario en el listado
        const idUusario = getListaDependenciaDestino.data.find((element) => {

            // Se retorna cuando el id sea igual al elemento cambiado
            return element.id === e.target.value;
        });

        // Se valida que haya un usuario
        if (idUusario) {

            // Se valida que exista el nombre del usuario
            if (idUusario.attributes.nombre) {

                // Se setea el nombre de la dependencia destino
                setDependenciaDestino(idUusario.attributes.nombre);
            }
        }

        // Se setea el valor de la dependencia seleccionada
        setDependenciaSeleccionada(e.target.value);

        // Se setea el valor de la lista de usuarios con la dependencia
        setListaUsuariosDependencia({ data: [], links: [], meta: [] });

        // Se valida que la dependencia seleccionado sea igual a la dependencia del usuario actual
        if (e.target.value == getUser()["id_dependencia"]) {

            // Se setea la variable en false
            setEnviaaJefe(false);

            // Se setea el titulo
            setTextoTitulo("Seleccione el usuario al cual desea remitir el proceso");

            // Se cargan los usuarios de la dependencia
            cargarUsuariosDependencia(e.target.value);
        } else {

            // Se setea la variable en false
            setEnviaaJefe(true);

            // Se recorre el array de lista de dependencias destino
            getListaDependenciaDestino.data.find((element) => {

                // Se valida que el id sea igual a la dependencia seleccionada
                if (element.id === e.target.value) {

                    // Se valida que el usuario sea jefe
                    if (element.attributes.nombre_solo_usuario_jefe) {

                        // Se setea el valor del jefe de la dependencia
                        setUsuarioSeleccionado(element.attributes.nombre_solo_usuario_jefe);
                    }
                }
            });

            // Se setea el titulo
            setTextoTitulo("EL EXPEDIENTE SERÁ ENVIADO AL JEFE DE LA DEPENDENCIA:");
        }
    }

    // Metodo encargado de cargar los datos del jefe de la dependencia
    const cargarUsuarioJefe = () => {

        // se recorre y captura el id de la dependencia seleccionada
        const idUsuario = getListaDependenciaDestino.data.find((element) => {

            // Se retorna la elemento
            return element.id === getDependenciaSeleccionada;
        });

        // Se valida que sea diferente de undefined
        if (idUsuario != undefined) {

            // Se valida que tenga un jefe de dependencia
            if (idUsuario.attributes.nombre_usuario_jefe) {

                // Se retorna el HTML
                return (
                    <tr>
                        <td className='bg-success text-white'>
                            <strong>{idUsuario.attributes.nombre_usuario_jefe}</strong>
                        </td>
                    </tr>
                )
            } else {

                // Se retorna el HTML
                return (
                    <tr><td className='bg-warning text-dark text-uppercase'><div ><strong>La dependencia no cuenta con jefe encargado</strong></div></td></tr>
                )
            }
        } else {

            // Se retorna el HTML
            return (
                <tr><td className='bg-warning text-dark text-uppercase'><div ><strong>La dependencia no cuenta con jefe encargado</strong></div></td></tr>
            )
        }
    }


    // Metodo encargado de cargar los usuarios de las dependencias
    const cargarUsuariosDependencia = (e) => {

        // Se usa el trycatch
        try {

            // Se captura la informacion de los usuarios de la dependencia
            let tipoExpediente = props.object.attributes.MisPendientes.attributes.ultima_clasificacion ? props.object.attributes.MisPendientes.attributes.ultima_clasificacion.id_tipo_expediente : "";
            let idTipoqueja = props.object.attributes.MisPendientes.attributes.ultima_clasificacion ? props.object.attributes.MisPendientes.attributes.ultima_clasificacion.id_tipo_queja : "";
            let idTerminoRespuesta = props.object.attributes.MisPendientes.attributes.ultima_clasificacion ? props.object.attributes.MisPendientes.attributes.ultima_clasificacion.id_termino_respuesta : "";
            let idTipoDerechoPeticion = props.object.attributes.MisPendientes.attributes.ultima_clasificacion ? props.object.attributes.MisPendientes.attributes.ultima_clasificacion.id_tipo_derecho_peticion : "";

            // Se concadena la url
            let url = (e + "/" + (idTipoqueja != null ? idTipoqueja : (idTerminoRespuesta != null ? idTerminoRespuesta : (idTipoDerechoPeticion != null ? idTipoDerechoPeticion : "-1"))) + "/" + tipoExpediente)

            // Se valida que haya tipo de expediente
            if (tipoExpediente) {

                // Se usa el cargando
                window.showSpinner(true);

                // Se consume la api
                GenericApi.getByIdGeneric('usuario/get-usuarios-dependencia', url).then(

                    // Se inicializa la variable de respuesta
                    datos => {

                        // Se valida que no haya error
                        if (!datos.error) {

                            // Se valida que haya informacion
                            if (datos["data"] != "") {

                                // Se setean los datos
                                setListaUsuariosDependencia(datos);

                                // Se quita el cargando 
                                window.showSpinner(false);
                            } else {

                                // Se quita el cargando 
                                window.showSpinner(false);
                            }
                        } else {

                            // Se setea el error de la api
                            setErrorApi(datos.error.toString());

                            // Se muestra el modal
                            window.showModal(1);

                            // Se quita el cargando
                            window.showSpinner(false);
                        }
                    }
                )
            }
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de listar los usuarios de las dependencias
    const listaUsuariosDependencia = () => {

        // Se retorna 
        return (

            // Se recorre la lista de usuarios
            getListaUsuariosDependencia.data.map((usuario, i) => {

                // Se valida que tenga reparto habilitado
                if (usuario.attributes.reparto_habilitado) {

                    // Se valida que el valor de reparto habilitado sea true
                    if (usuario.attributes.reparto_habilitado !== "0") {

                        // Se retorna el option
                        return (

                            // Se concadena el option
                            <option className='text-uppercase' key={usuario.id} value={usuario.attributes.name}>{usuario.attributes.nombre} ({usuario.attributes.name})</option>
                        )
                    }
                } else {

                    // Se captura el usuario actual
                    let usuarioActual = (getUser() != null) ? (getUser().nombre) : "SIN ESPECIFICAR"

                    // Se valida que el usuario actual sea diferente al usuario a remitir
                    if (usuarioActual != usuario.attributes.name) {

                        // Se retorna el option
                        return (

                            // Se concadena el option
                            <option className='text-uppercase' key={usuario.id} value={usuario.attributes.name}>{usuario.attributes.nombre} ({usuario.attributes.name})</option>
                        )
                    }
                }
            })
        )
    }

    // Metodo encargado de enviar la informacion al backend
    const enviarDatos = (valores) => {

        // Se cierra el modal principal
        window.hideModalRemitirProceso();

        // Se inicializa el cargando
        window.showSpinner(true);

        // Se inicializa la variable
        let data;

        // Se captura el id del proceso disciplinario
        let idProcesoDisciplinario = props.object.attributes.MisPendientes.id;

        // Se reemplaza la variable
        data = {
            "data": {
                "type": "proceso_disciplinario",
                "attributes": {
                    "id_proceso_disciplinario": idProcesoDisciplinario,
                    "id_dependencia_origen": getDependenciaSeleccionada ? getDependenciaSeleccionada : "",
                    "usuario_a_remitir": getUsuarioSeleccionado ? getUsuarioSeleccionado : "",
                    "descripcion_a_remitir": getInformacion,
                }
            }
        }

        // Se consume la API
        GenericApi.updateGeneric('proceso-diciplinario', props.object.id, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea y muestra la modal
                    setModalState({ title: "REMITIR PROCESO :: RADICADO " + props.object.attributes.MisPendientes.attributes.radicado, message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea y muestra la modal
                    setModalState({ title: "REMITIR PROCESO :: RADICADO " + props.object.attributes.MisPendientes.attributes.radicado, message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

                // Se quita el cargando
                window.showSpinner(false);
            }
        )
    }

    // Metodo encargado de cambiar el valor del input al momento de ejecutar un cambio
    const handleInputChange = (event) => {

        // Se capturan los valores y el tipo de evento
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        // Se valida que sea usuario
        if (name == "usuario") {

            // Se setea el dato
            setUsuarioSeleccionado(value);
        }
    }

    const changeInformacion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setInformacion(e.target.value);
            setCountInformacion(e.target.value.length);
        }
    }

    return (
        <>
            {<Spinner />}
            {isRedirect ? redirectToRoutes() : null}
            {<ModalAceptarActualizar data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: '',
                    dependenciaDestino: '',
                    usuario: ''
                }}
                enableReinitialize
                validate={(valores) => {

                    // Se inicializa el array de errores
                    let errores = {};

                    // Se valida que haya dependencia seleccionada
                    if (!getDependenciaSeleccionada) {

                        // Se coloca el mensaje de error en la dependencia destino
                        errores.dependenciaDestino = 'CAMPO OBLIGATORIO'
                    }

                    // Se valida que no haya informacion
                    if (!getInformacion) {

                        // Se coloca el mensaje de error en la informacion
                        errores.informacion = 'CAMPO OBLIGATORIO'


                        // Se valida que tenga la longitud minima
                    } else if (getInformacion.length <= getMinimoTextArea) {

                        // Se coloca el mensaje de error en la informacion
                        errores.informacion = 'DEBE TERNE AL MENOS ' + getMinimoTextArea + ' CARACTERES'
                    }

                    // Se valida que haya informacion
                    if (getInformacion) {

                        // Se valida que contenga caracteres incorrectos
                        if (containsSpecialChars(getInformacion)) {

                            // Se coloca el mensaje de error a la informacion
                            errores.informacion = 'TIENE CARACTERES INVÁLIDOS'
                        }
                    }

                    // Se valida que haya un usuario seleccionado
                    if (!getUsuarioSeleccionado) {

                        // Se coloca el mensaje de error al usuario
                        errores.usuario = 'CAMPO OBLIGATORIO'
                    }

                    // Se retornan los errores
                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {

                    // Se envia la data al metodo
                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="modal fade" id="modal-block-popout-remitir-proceso" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="block block-themed block-transparent mb-0">
                                        <div className="block-header bg-primary-dark">
                                            <h3 className="block-title">REMITIR EL {(props.object.attributes) ? props.object.attributes.MisPendientes.attributes.nombre_tipo_expediente : ""}: {(props.object.attributes) ? props.object.attributes.MisPendientes.attributes.radicado : ""} VIGENCIA: {(props.object.attributes) ? props.object.attributes.MisPendientes.attributes.vigencia : ""}</h3>
                                            <div className="block-options">
                                                <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                    <i className="fa fa-fw fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="block-content">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="dependenciaDestino">SELECCIONE LA DEPENDENCIA A REMITIR<span className="text-danger">*</span></label>
                                                        <Field as="select" className="form-control" id="dependenciaDestino" name="dependenciaDestino" value={getDependenciaSeleccionada} onChange={selectChangeDependencia}>
                                                            <option value="">Por favor seleccione</option>
                                                            {getRespuestaDependenciaDestino ? selectDependenciaDestino() : null}
                                                        </Field>
                                                        <ErrorMessage name="dependenciaDestino" component={() => (<span className="text-danger">{errors.dependenciaDestino}</span>)} />
                                                    </div>
                                                </div>
                                                {
                                                    (!getEnviaaJefe && getDependenciaSeleccionada != '') ? (
                                                        <div className="col-md-12">
                                                            <label>{getTextoTitulo}</label><br />
                                                            <div className="form-group">
                                                                <Field value={getUsuarioSeleccionado} onChange={handleInputChange} as="select" className="form-control" id="usuario" name="usuario">
                                                                    <option value="">Por favor seleccione</option>
                                                                    {listaUsuariosDependencia()}
                                                                </Field>
                                                                <ErrorMessage name="usuario" component={() => (<span className="text-danger">{errors.usuario}</span>)} />
                                                            </div>
                                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase">
                                                                <thead className='bg-primary text-white'>
                                                                    <tr>
                                                                        <th>DEPENDENCIA ORIGEN</th>
                                                                        <th>DEPENDENCIA DESTINO</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            {
                                                                                (getUser().nombre_dependencia != null) ? (getUser().nombre_dependencia.nombre) : "SIN ESPECIFICAR"
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {getDependenciaDestino ? getDependenciaDestino : "SIN ESPECIFICAR"}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : null
                                                }
                                                {
                                                    (getEnviaaJefe && getDependenciaSeleccionada != '') ? (
                                                        <div className="col-md-12">
                                                            <label>{getTextoTitulo}</label><br />
                                                            <ErrorMessage name="usuarios" component={() => (<span className="text-danger">{errors.usuarios}</span>)} />
                                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase">
                                                                <tbody>
                                                                    {cargarUsuarioJefe()}
                                                                </tbody>
                                                            </table>
                                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Dependencia Origen</th>
                                                                        <th>Dependencia Destino</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            {
                                                                                (getUser().nombre_dependencia != null) ? (getUser().nombre_dependencia.nombre) : "SIN ESPECIFICAR"
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {getDependenciaDestino ? getDependenciaDestino : "SIN ESPECIFICAR"}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : null
                                                }
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="informacion">INFORMACIÓN PARA SU REMISIÓN<span className="text-danger">*</span></label>
                                                        <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder="INFORMACIÓN PARA SU REMISIÓN...."
                                                            maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getInformacion} onChange={changeInformacion}></Field>
                                                        <div className="text-right">
                                                            <span className="text-primary">{getCountInformacion} / {getMaximoTextArea}</span>
                                                        </div>
                                                        <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="block-content block-content-full text-right bg-light">
                                            <button type="submit" className="btn btn-rounded btn-primary" >REMITIR</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default ModalRemitirExpediente;
