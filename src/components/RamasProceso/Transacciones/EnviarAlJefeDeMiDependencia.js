import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';
import { getUser } from '../../Utils/Common';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { Link } from "react-router-dom";


function EnviaraAlJefeDeMiDependencia() {

    const [getUsuarioSleccionado, setUsuarioSleccionado] = useState("");
    const [getNombreUsuarioSeleccionado, setNombreUsuarioSeleccionado] = useState("");
    const [getIdDependenciaSeleccionada, setIdDependenciaSeleccionada] = useState("");

    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const location = useLocation();
    const { from } = location.state;

    let procesoDisciplinarioId = from.procesoDisciplinarioId;


    /**
     * Funcion principal
     */
    useEffect(() => {
        async function fetchData() {
            // VALIDA SI ES JEFE
            jefeDependencia();
            obtenerParametros();
        }
        fetchData();
    }, []);


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
    // Enviamos el proceso al jefe de la dependencia
    const enviarDatos = (valores) => {
        //const iduserdependencia = getUser().id_dependencia;
        window.showSpinner(true);
        let data;

        data = {

            "data": {
                "type": "transacciones",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_dependencia_origen": getIdDependenciaSeleccionada,
                    "usuario_a_remitir": getUsuarioSleccionado,
                    "descripcion_a_remitir": valores.informacion,
                    "id_etapa": 3
                }
            }
        }
        GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "SINPROC NO " + from.radicado + " :: ENVIAR AL JEFE DE LA DEPENDENCIA", message: 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + getNombreUsuarioSeleccionado, show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "SINPROC NO " + from.radicado + " :: ENVIAR AL JEFE DE LA DEPENDENCIA", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
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


    /**
     * Se consulta si el usuario que se encuentra en sesión es jefe de la dependencia
     */
    const jefeDependencia = () => {
        window.showSpinner(true);
        const data = {
            "data": {
                "type": "usuario",
                "attributes": {
                    "": ""
                }
            }
        }

        GenericApi.getByDataGeneric("usuario/get-jefe-de-mi-dependencia", data).then(
            datos => {
                window.showSpinner(false);
                if (!datos.error) {

                    GenericApi.getAllGeneric('proceso-diciplinario/usuario-habilitado-transacciones/' + procesoDisciplinarioId + '/' + datos.data.id).then(
                        datos_respuesta => {
                            if (!datos_respuesta.error) {
                                if (datos_respuesta) {
                                    setUsuarioSleccionado(datos.data.attributes.name);
                                    setNombreUsuarioSeleccionado(`${datos.data.attributes.nombre} ${datos.data.attributes.apellido} (${datos.data.attributes.name}) Jefe de la dependencia: ${datos.data.attributes.dependencia.nombre}`)
                                    setIdDependenciaSeleccionada(datos.data.attributes.dependencia.id);
                                    if (datos.data.attributes.name == getUser().nombre && datos.data.attributes.dependencia.id == getUser().id_dependencia)
                                        setModalState({ title: "SINPROC NO " + from.radicado + " :: ENVIAR AL JEFE DE LA DEPENDENCIA", message: '¡Su usuario está configurado como el jefe de la dependencia!', show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                                
                                }
                                else{
                                    const mensajeModal = 'EL USUARIO ' + datos.data.attributes.nombre.toUpperCase() + ' ' + datos.data.attributes.apellido.toUpperCase() + ' NO TIENE PERMISO(S) HABILITADO(S) PARA RECIBIR EL PROCESO DISCIPLINARIO.';
                                    setModalState({ title: "SINPROC NO " + from.radicado + " :: ENVIAR AL JEFE DE LA DEPENDENCIA", message: mensajeModal.toUpperCase(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                                }
                            }
                            else {
                                setModalState({ title: "SINPROC NO " + from.radicado + " :: ENVIAR AL JEFE DE LA DEPENDENCIA", message: datos_respuesta.error.toUpperCase(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                            }
                        }
                    )                    
                }
                else {
                    setModalState({ title: "SINPROC NO " + from.radicado + " :: ENVIAR AL JEFE DE LA DEPENDENCIA", message: datos.error, show: true, redirect: '/Transacciones', alert: global.Constants.TIPO_ALERTA.ERROR, from: { from } });
                    setUsuarioSleccionado(datos.error);
                }
            }
        )
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    setCountTextArea(valores.informacion.length)
                    let errores = {}


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
                                    <li className="breadcrumb-item"> <small>Enviar al jefe de la dependencia</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">SINPROC NO {from.radicado} <strong> VIGENCIA: {from.vigencia} :: ENVIAR AL JEFE DE LA DEPENDENCIA</strong></h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="dependenciaDestino">SE ENVIARÁ AL USUARIO: </label> {getNombreUsuarioSeleccionado}
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
                                    <button type="submit" className="btn btn-rounded btn-primary">REMITIR</button>
                                    <Link to={'/Transacciones'} state={{ from: from }} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
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


export default EnviaraAlJefeDeMiDependencia;