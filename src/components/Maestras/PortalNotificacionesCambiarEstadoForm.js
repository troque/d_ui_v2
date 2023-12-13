import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Spinner from '../Utils/Spinner';
import ModalGen from '../Utils/Modals/ModalGeneric';
import GenericApi from '../Api/Services/GenericApi';

function PortalNotificacionesCambiarEstadoForm() {

    const [countTextArea, setCountTextArea] = useState(0);
    const [nombreUsuario, setNombreUsuario] = useState("");

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    let { idNotificacion } = useParams();

    const [getLogNotificacion, setLogNotificacion] = useState({ data: [], links: [], meta: [] });
    const [getRtaInfoNotificacion, setRtaInfoNotificacion] = useState(false);
    const [getEstadoNotificacion, setEstadoNotificacion] = useState(true);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getDescripcion, setDescripcion] = useState('');
    const [getRepuestaDescripcion, setRepuestaDescripcion] = useState(false);
    
    const location = useLocation()
    const { getActuacionConFirmas, from, selected_id_etapa, id, nombre, estadoActualActuacion, titulo, valor, solicitante, tipoActuacion, nombreTipoActuacion, actuacionIdMaestra, detalles_actuacion, disable } = location.state
    const [getRoutes, setRoutes] = useState({})


    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);
            GenericApi.getByIdGeneric("portal-notificaciones", idNotificacion).then(
                datos => {
                    if (!datos.error) {

                        if (datos.data.attributes.estado == true) {
                            setEstadoNotificacion(false);
                        }
                        setLogNotificacion(datos);
                        setRtaInfoNotificacion(true);                        
                        nombreProceso(datos.data.attributes.uuid_proceso_disciplinario.uuid)
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: NOTIFICACIÓN", message: datos.error.toString(), show: true, redirect: '/PortalNotificaciones', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }

                }
            )
        }

        if(from){
            setRoutes({ver_detalle: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"})
        }        
        fetchData();
    }, []);

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

            // buscamos el parametro
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
                        setModalState({ title: getNombreProceso + " :: NOTIFICACIÓN", message: datos.error.toString(), show: true, redirect: '/PortalNotificaciones', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }


    const nombreProceso = (idProcesoDisciplinario) => {

        GenericApi.getByIdGeneric("nombre-proceso", idProcesoDisciplinario).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }                
                obtenerParametros();
            }
        )
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);

        const data = {
            "data": {
                "type": 'portal-notificaciones',
                "attributes": {
                    "id_notificacion": idNotificacion,
                    "descripcion": getDescripcion,
                    "estado": getEstadoNotificacion,
                }
            }
        }

        GenericApi.getByDataGeneric("actualizar-estado-portal-notificaciones", data).then(
            datos => {
                if (!datos.error) {
                    if(from)
                    {
                        setModalState({ title: getNombreProceso + " :: NOTIFICACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: getRoutes.ver_detalle, from: {from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra}, alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else{
                        setModalState({ title: getNombreProceso + " :: NOTIFICACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/PortalNotificaciones', alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    window.showSpinner(false);

                }
                else {
                    if(from){                        
                        setModalState({ title: getNombreProceso + " :: NOTIFICACIÓN", message: datos.error.toString(), show: true, redirect: getRoutes.ver_detalle, from: {from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra}, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    else{
                        setModalState({ title: getNombreProceso + " :: NOTIFICACIÓN", message: datos.error.toString(), show: true, redirect: '/PortalNotificaciones', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            }
        )
    }

    const CargarInfoNotificacion = () => {

        if (getLogNotificacion.data != null && typeof (getLogNotificacion.data) != 'undefined') {
            return (
                <tr>
                    <td style={{ width: "20%" }}>
                        <strong>FUNCIONARIO: </strong>{getLogNotificacion.data.attributes.logs[0].nombre_completo.toLocaleUpperCase()}<br />
                        <strong>FECHA: </strong>{getLogNotificacion.data.attributes.logs[0].fecha_creado}
                    </td>
                    <td style={{ width: "20%" }}>{getLogNotificacion.data.attributes.logs[0].nombre_dependencia}</td>
                    <td style={{ width: "60%" }} data-toggle="popover" data-placement="top" title={getLogNotificacion.data.attributes.logs[0].descripcion}>{getLogNotificacion.data.attributes.logs[0].descripcion_corta.toUpperCase()}</td>
                </tr>
            )
        }
    }

    const changeDescripcion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setDescripcion(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaDescripcion(true);
        }
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    descripcion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    
                    if (countTextArea > getMaximoTextArea) {
                        errores.descripcion = 'Debe ingresar máximo ' + getMaximoTextArea + ' carácteres';
                    }
                    if (countTextArea < getMinimoTextArea) {
                        errores.descripcion = 'Debe ingresar mínimo ' + getMinimoTextArea + ' carácteres'
                    }
                    if(getRepuestaDescripcion == false){
                        errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
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
                                    {
                                        from
                                        ?
                                            <>
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`}><small>Ramas del proceso</small></Link></li>
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>Actuaciones</small></Link></li>
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra,  }}><small>Actuación {nombre}</small></Link></li>
                                                <li className="breadcrumb-item"> <small>Cambiar estado de notificación</small></li>
                                            </>
                                        :
                                            <>
                                                <li className="breadcrumb-item"> <small>Administración</small></li>
                                                <li className="breadcrumb-item"> <small>Portal Web</small></li>
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/PortalNotificaciones`}><small>Notificaciones</small></Link></li>
                                                <li className="breadcrumb-item"> <small>Cambiar estado de notificación</small></li>
                                            </>
                                    }
                                </ol>
                            </nav>
                        </div>


                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title"> {getNombreProceso} :: <strong>{getEstadoNotificacion ? 'ACTIVA' : 'INACTIVA'} NOTIFICACIÓN</strong></h3>
                            </div>
                            <div className="block-content">
                                <div className='col-md-12'>
                                    {
                                        getLogNotificacion?.data?.attributes?.logs?.length > 0
                                        ?
                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full table-responsive-md">
                                                <thead>
                                                    <tr>
                                                        <th>REGISTRADO POR</th>
                                                        <th>DEPENDENCIA</th>
                                                        <th>DESCRIPCIÓN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getRtaInfoNotificacion ? CargarInfoNotificacion() : null}
                                                </tbody>
                                            </table>
                                        :
                                            null
                                    }
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="descripcion">MOTIVO POR EL QUE {getEstadoNotificacion ? 'ACTIVA' : 'INACTIVA'} LA NOTIFICACIÓN <span className="text-danger">*</span></label>
                                        <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="ESCRIBA EN ESTE ESPACIO LA OBSERVACIÓN"
                                            maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getDescripcion} onChange={changeDescripcion}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name="descripcion" component={() => (<span className="text-danger">{errors.descripcion}</span>)} />
                                    </div>
                                </div>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>                                
                                {
                                    from
                                    ?
                                        <Link to={getRoutes.ver_detalle}>
                                            <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                        </Link>
                                    :
                                        <Link to={`/PortalNotificaciones/`}>
                                            <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                        </Link>
                                }
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>
    );
}


export default PortalNotificacionesCambiarEstadoForm;