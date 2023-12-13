import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import GenericApi from '../../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import { getUser } from '../../../components/Utils/Common';
import '../../Utils/Constants';

function AceptaRechazaAnulacion() {

    const [getUsuarioNombre, setUsuarioNombre] = useState("");
    const [getUsuarioApellido, setUsuarioApellido] = useState("");
    const [getUsuarioName, setUsuarioName] = useState("");
    const [getUsuarioDependenciaNombre, setUsuarioDependenciaNombre] = useState("");

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [getIdActuacion, setIdActuacion] = useState("");
    const [getIdDependenciaSolicitante, setIdDependenciaSolicitante] = useState("");
    const location = useLocation()
    const { from, selected_id_etapa, id, nombre, estadoActualActuacion, boton, solicitante, actuacionIdMaestra, activacion } = location.state;
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getInformacion, setInformacion] = useState('');
    const [getRepuestaInformacion, setRepuestaInformacion] = useState(false);
    
    const [getEnviarDatos, setEnviarDatos] = useState()

    const [getRoutes, setRoutes] = useState({
        ver_detalle: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"
    });

    useEffect(() => {
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se setea el nombre
            setNombreUsuario(getUser().nombre);

            // Se llama el metodo
            nombreProceso();

            // Se quita el cargando
            window.showSpinner(false);
        }
        fetchData();
    }, []);

    console.log("actuacionIdMaestra AceptaRechazaAnulacion -> ", actuacionIdMaestra);
    console.log("boton -> ", boton);

    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    obtenerParametros();
                    obtenerDatosUsuarioSolicitante();
                    obtenerTodosLosDatosDeLaActuacion();
                }
            }
        )
    }

    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

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
            GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(
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
                        setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const enviarDatos = () => {
        
        let valores = getEnviarDatos;

        window.showSpinner(true);
        let data = {
            "data": {
                "type": "transacciones",
                "attributes": {
                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                    "id_dependencia_origen": getIdDependenciaSolicitante,
                    "usuario_a_remitir": solicitante,
                    "descripcion_a_remitir": getInformacion,
                    "id_etapa": 3
                }
            }
        }

        GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(
            datos => {
                if (!datos.error) {
                    guardarTrazabilidadActuaciones();

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Constante de mensaje
                    const mensajeModalExito = 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + getUsuarioNombre + ' ' + getUsuarioApellido + ' (' + getUsuarioName + ')  de la dependencia: ' + getUsuarioDependenciaNombre + '';

                    // Se setea el modal
                    setModalState({ title: "SINPROC N° " + from.radicado + " :: ENVIAR AL SOLICITANTE DE " + (activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'), message: mensajeModalExito.toUpperCase(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea el modal
                    setModalState({ title: "SINPROC N° " + from.radicado + " :: ENVIAR AL SOLICITANTE DE " + (activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'), message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const obtenerDatosUsuarioSolicitante = () => {
        //buscamos el parametro
        GenericApi.getGeneric("usuario/get-usuario-por-name/" + solicitante).then(
            datos => {

                if (!datos.error) {

                    if (datos["data"].length > 0) {
                        setIdDependenciaSolicitante(datos.data[0].attributes.id_dependencia);
                        datosDelUsuarioARemitir(datos.data[0].attributes.name);
                    }
                } else {

                }
            }
        )
    }

    const guardarTrazabilidadActuaciones = () => {
        let data;
        if (boton == "Acepta") {
            cambiarEstadoDeActuacionAInactivo();
            data = {
                "data": {
                    "type": "trazabilidad-actuaciones",
                    "attributes": {
                        "uuid_actuacion": id,
                        "id_estado_actuacion": activacion ? global.Constants.ESTADO_ACTUACION.SOLICITUD_ACTIVACION_ACEPTADA : global.Constants.ESTADO_ACTUACION.SOLICITUD_INACTIVACION_ACEPTADA,
                        "observacion": "Solicitud de anulación aprobada",
                        "estado": 1,
                        "activacion": activacion
                    }
                }
            }

        } else {
            cambiarEstadoDeActuacionAInactivo();
            data = {
                "data": {
                    "type": "trazabilidad-actuaciones",
                    "attributes": {
                        "uuid_actuacion": id,
                        "id_estado_actuacion": activacion ? global.Constants.ESTADO_ACTUACION.SOLICITUD_ACTIVACION_RECHAZADA : global.Constants.ESTADO_ACTUACION.SOLICITUD_INACTIVACION_RECHAZADA,
                        "observacion": "Solicitud de anulación rechazada",
                        "estado": 1,
                        "activacion": activacion
                    }
                }
            }

        }


        GenericApi.addGeneric('trazabilidad-actuaciones', data);
    }

    const cambiarEstadoDeActuacionAInactivo = () => {
        let data;
        if (boton == "Acepta") {

            data = {
                "data": {
                    "type": "actuaciones",
                    "attributes": {
                        "id_actuacion": getIdActuacion,
                        "usuario_accion": getNombreUsuario,
                        "id_estado_actuacion": (activacion ? global.Constants.ESTADO_ACTUACION.SOLICITUD_ACTIVACION_ACEPTADA : global.Constants.ESTADO_ACTUACION.SOLICITUD_INACTIVACION_ACEPTADA),
                        "documento_ruta": null,
                        "estado": activacion ? 1 : 0,
                        "fileBase64": null,
                        "nombre_archivo": null,
                        "ext": null,
                        "peso": null,
                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                        "id_etapa": selected_id_etapa
                    }
                }
            }

        } else {
            data = {
                "data": {
                    "type": "actuaciones",
                    "attributes": {
                        "id_actuacion": getIdActuacion,
                        "usuario_accion": getNombreUsuario,
                        "id_estado_actuacion": (activacion ? global.Constants.ESTADO_ACTUACION.SOLICITUD_ACTIVACION_RECHAZADA : global.Constants.ESTADO_ACTUACION.SOLICITUD_INACTIVACION_RECHAZADA),
                        "documento_ruta": null,
                        "estado": activacion ? 0 : 1,
                        "fileBase64": null,
                        "nombre_archivo": null,
                        "ext": null,
                        "peso": null,
                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                        "id_etapa": selected_id_etapa
                    }
                }
            }

        }
        GenericApi.updateGeneric("actuaciones", id, data);


    }

    const obtenerTodosLosDatosDeLaActuacion = () => {
        GenericApi.getGeneric("actuaciones/" + id).then(
            datos => {

                if (!datos.error) {
                    setIdActuacion(datos.data.attributes.id_actuacion);
                } else {

                }
            }
        )
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
                else {

                }
            }
        )
    }

    const changeInformacion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setInformacion(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaInformacion(true);
        }
    }

    const showModalAnulacion = () => {
        window.showConfirmacionAprovacionRechazoAnulacionActuacion(true)
    }

    /*Modal: mensaje de confirmación para realizar el cambio de etapa */
    const componentAlertConfirmacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-confirmacion-aprobacion-rechazo-anulacion-actuacion" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout modal-lg" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">CONFIRMACIÓN  - { getNombreProceso }</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    {
                                        boton == "Acepta" 
                                        ?
                                            <p>¿ESTÁ SEGURO QUE DESEA APROBAR SOLICITUD DE { activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN' } DE ESTA ACTUACIÓN?</p>
                                        :
                                            <p>¿ESTÁ SEGURO QUE DESEA RECHAZAR SOLICITUD DE { activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN' } DE ESTA ACTUACIÓN?</p>
                                    }
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => enviarDatos()}>{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                                    <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal" onClick={() => setEnviarDatos(null)}>{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {<Spinner />}
            { componentAlertConfirmacion() }
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    
                    let errores = {}
                    
                    if (!getInformacion) {
                        errores.informacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }
                    if (countTextArea > getMaximoTextArea) {
                        errores.informacion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES';
                    }
                    if (countTextArea < getMinimoTextArea) {
                        errores.informacion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES';
                    }
                    if(getRepuestaInformacion === false){
                        errores.informacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    setEnviarDatos(valores)
                    showModalAnulacion()
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>Actuaciones</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion }}><small>Actuación {nombre}</small></Link></li>
                                    <li className="breadcrumb-item"> <small>{boton == "Acepta" ? "Aceptar" : "Rechazar"} {(activacion ? 'Activación' : 'Inactivación')}</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">ACTUACIONES {nombre.toUpperCase()} :: {boton.toUpperCase()} SOLICITUD DE {(activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN')} </h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="informacion">COMENTARIOS DE {boton == "Acepta" ? "APROBACIÓN" : "RECHAZO"} A LA SOLICITUD DE {(activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN')} <span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6"
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getInformacion} onChange={changeInformacion}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary" >{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    <Link to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, actuacionIdMaestra: actuacionIdMaestra }} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
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

export default AceptaRechazaAnulacion;