import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import GenericApi from '../../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';


function ActuacionesAprobacionRechazar() {
    
    const location = useLocation()
    const { getActuacionConFirmas, from, selected_id_etapa, id, nombre, estadoActualActuacion, titulo, valor, solicitante, tipoActuacion, nombreTipoActuacion, actuacionIdMaestra, detalles_actuacion, disable } = location.state
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false })

    //Variables parametrizadas para la clase  
    const [getNombreProceso, setNombreProceso] = useState('')
    const [getActuacionCierraProceso, setActuacionCierraProceso] = useState("")
    const [getDespuesAprobacionListarActuacion, setDespuesAprobacionListarActuacion] = useState("")
    const [getMinimoTextArea, setMinimoTextArea] = useState(0)
    const [getMaximoTextArea, setMaximoTextArea] = useState(0)
    const [getIdDependenciaSolicitante, setIdDependenciaSolicitante] = useState("")
    const [getUsuario, setUsuario] = useState({data:[]})
    const [getRoutes] = useState({ver_detalle: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"})
    const [getEnviarDatos, setEnviarDatos] = useState()



    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true)
            nombreProceso()
        }
        fetchData()
    }, [])


    /**
     * LLAMADO DE FUNCIONES AL SERVIDOR
    */

    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                    obtenerMasActuacion()
                }
                else{                    
                    window.showSpinner(false)
                }
            }
        )
    }

    const obtenerMasActuacion = () => {

        // Se consume la API
        GenericApi.getByIdGeneric('mas_actuaciones', actuacionIdMaestra).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {
                    // Se setean los datos
                    setActuacionCierraProceso(datos.data.attributes.cierra_proceso)
                    setDespuesAprobacionListarActuacion(datos.data.attributes.despues_aprobacion_listar_actuacion)
                    obtenerParametros()
                }
                else{                    
                    window.showSpinner(false)
                }
            }
        )
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

            // Buscamos el parametro
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

                            obtenerDatosUsuarioSolicitante()

                        }
                    } else {
                        setModalState({ title: "ACTUACIONES :: ", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR })
                        window.showSpinner(false)
                    }
                }
            )
        } catch (error) {
            // console.log(error)
        }
    }

    const obtenerDatosUsuarioSolicitante = () => {

        // Buscamos el parametro
        GenericApi.getGeneric("usuario/get-usuario-por-name/" + solicitante).then(
            datos => {
                if (!datos.error) {
                    if (datos["data"].length > 0) {
                        setIdDependenciaSolicitante(datos.data[0].attributes.id_dependencia)
                        datosDelUsuarioARemitir(datos.data[0].attributes.name)
                    }
                    else{                        
                        window.showSpinner(false)
                    }
                }
                else{
                    window.showSpinner(false)
                }
            }
        )
    }

    const datosDelUsuarioARemitir = (name) => {
        window.showSpinner(true)
        GenericApi.getGeneric('usuario/get-usuario-por-name/' + name).then(
            datos => {
                if (!datos.error) {
                    setUsuario(datos)
                } else {

                }
                window.showSpinner(false)
            }
        )
    }

    // Metodo encargado de aprobar o rechazar la actuacion
    const enviarDatos = () => {

        let valores = getEnviarDatos;

        // Se inicializa el array con la informacion
        let data = {
            "data": {
                "type": "trazabilidad-actuaciones",
                "attributes": {
                    "uuid_actuacion": id,
                    "id_estado_actuacion": valor == 1 ? 1 : 2,
                    "observacion": valores.informacion,
                    "estado": 1,
                    "envia_correo": 1,
                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                    "id_mas_actuacion": actuacionIdMaestra,
                    "id_etapa": selected_id_etapa,
                    "validar_semaforos": true,
                    "rechazo": valor === 1 ? false : true
                }
            }
        }
        
        window.showSpinner(true)

        // Se consume la API para aprobar o rechazar actuaciones
        GenericApi.addGeneric('trazabilidad-actuaciones', data).then(
            // Se inicializa la variable de respuesta
            datos => {
                // Se valida que no haya error
                let tituloModal = getNombreProceso + " :: ACTUACIONES APROBAR/RECHAZAR"
                if (!datos.error) {
                    // Se inicializan las variables
                    let validacion = (valor == 1 ? 'APROBADA' : 'RECHAZADA');
                    let mensaje = 'LA ACTUACIÓN ' + nombre + ' HA SIDO ' + validacion + ' CON ÉXITO.';
                    // Se valida cuando se aprueba
                    if (valor == 1) {
                        // Se valida cuando la actuacion tiene firmas
                        if (getActuacionConFirmas >= 1) {
                            // Se genera el modal y su redireccion
                            setModalState({
                                title: tituloModal, message: mensaje,
                                show: true,
                                redirect: '/ActuacionesSigueImpedimentos',
                                from: {
                                    getActuacionCierraProceso: getActuacionCierraProceso,
                                    getDespuesAprobacionListarActuacion: getDespuesAprobacionListarActuacion,
                                    from: from,
                                    selected_id_etapa: selected_id_etapa,
                                    nombre: nombre,
                                    uuid_actuacion: id,
                                    nombre: nombre,
                                    estadoActualActuacion: estadoActualActuacion,
                                    tipoActuacion: tipoActuacion,
                                    actuacionIdMaestra: actuacionIdMaestra
                                },
                                alert: global.Constants.TIPO_ALERTA.EXITO
                            });

                            // Se valida cuando la actuacion no tiene firmas
                        } else if (getActuacionConFirmas < 1) {
                            // Se genera el modal y su redireccion
                            setModalState({
                                title: tituloModal, message: mensaje,
                                show: true,
                                redirect: '/ActuacionesCargarArchivoDefinitivo',
                                from: {
                                    getActuacionCierraProceso: getActuacionCierraProceso,
                                    getDespuesAprobacionListarActuacion: getDespuesAprobacionListarActuacion,
                                    from: from,
                                    selected_id_etapa: selected_id_etapa,
                                    nombre: nombre,
                                    uuid_actuacion: id,
                                    estadoActualActuacion: estadoActualActuacion,
                                    tipoActuacion: tipoActuacion,
                                    actuacionIdMaestra: actuacionIdMaestra
                                }, alert: global.Constants.TIPO_ALERTA.EXITO
                            });
                        } else {
                            // Se genera el modal y su redireccion
                            setModalState({
                                title: tituloModal,
                                message: mensaje + " ERROR EN LA CANTIDAD DE FIRMAS",
                                show: true,
                                alert: global.Constants.TIPO_ALERTA.ERROR
                            });
                        }
                    } else {
                        // Se valida cuando la actuacion es un impedimento o comisorio
                        if (tipoActuacion == 1 || tipoActuacion == 2) {
                            // Se genera el modal y su redireccion
                            setModalState({
                                title: tituloModal,
                                message: mensaje,
                                show: true,
                                redirect: '/Transacciones',
                                from: { from: from, selected_id_etapa: selected_id_etapa },
                                alert: global.Constants.TIPO_ALERTA.EXITO
                            });
                        } else {
                            // Se setea el modal
                            if(datos?.mensaje.length <= 0){
                                setModalState({ 
                                    title: tituloModal, 
                                    message: mensaje + ' EL PROCESO CON RADICADO: ' + from.radicado + ' FUE ASIGNADO AL USUARIO: ' + datos?.usuario?.attributes?.funcionario_actual?.nombre.toUpperCase() + ' ' + datos?.usuario?.attributes?.funcionario_actual?.apellido.toUpperCase() + ' (' + datos?.usuario?.attributes?.funcionario_actual?.name.toUpperCase() + ')  de la dependencia: ' + datos?.usuario?.attributes?.funcionario_actual?.dependencia?.nombre + '', 
                                    show: true, 
                                    redirect: '/MisPendientes',
                                    alert: global.Constants.TIPO_ALERTA.EXITO 
                                });
                            }
                            else{
                                setModalState({ title: tituloModal, message: datos?.mensaje, show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                            }
                        }
                    }
                } else {
                    // Se inicializa el modal
                    setModalState({ title: tituloModal, message: datos.error, show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                // Se quita el cargando
                window.showSpinner(false);
            }
        )
    }
    
    const showModalAprobacion = () => {
        window.showConfirmacionAprobacionActuacion(true)
    }

    /*Modal: mensaje de confirmación para realizar el cambio de etapa */
    const componentAlertConfirmacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-confirmacion-aprobacion-actuacion" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout modal-lg" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">CONFIRMACIÓN - { "SINPROC N° " + getNombreProceso }</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    {
                                        getDespuesAprobacionListarActuacion.toString() !== "0"
                                        ?
                                            <p>¿ESTÁ SEGURO QUE DESEA EJECUTAR UNA ACTUACIÓN DE ANULACIÓN? ESTÁ ACTUACIÓN FUE CREADA POR { detalles_actuacion?.nombre_usuario?.toUpperCase() } { detalles_actuacion?.apellido_usuario?.toUpperCase() } DE LA DEPENDENCIA { detalles_actuacion?.nombre_dependencia?.toUpperCase() }.</p>
                                        :
                                            (
                                                valor == 1
                                                ?
                                                    <p>LA ACTUACIÓN FUE CREADA POR { detalles_actuacion?.nombre_usuario?.toUpperCase() } { detalles_actuacion?.apellido_usuario?.toUpperCase() } DE LA DEPENDENCIA { detalles_actuacion?.nombre_dependencia?.toUpperCase() }.</p>
                                                :
                                                    <p>¿ESTÁ SEGURO QUE DESEA RECHAZAR ESTA ACTUACIÓN? ESTÁ ACTUACIÓN FUE CREADA POR { detalles_actuacion?.nombre_usuario?.toUpperCase() } { detalles_actuacion?.apellido_usuario?.toUpperCase() } DE LA DEPENDENCIA { detalles_actuacion?.nombre_dependencia?.toUpperCase() }.</p>
                                            )
                                    }
                                    <p>¿DESEA CONTINUAR CON ESTA ACCIÓN?</p>
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
            { componentAlertConfirmacion() }
            { <Spinner /> }
            { <ModalGen data={getModalState} /> }
            <Formik
                initialValues={{
                    informacion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}

                    if (!valores.informacion) {
                        errores.informacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }
                    else{
                        if(!global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(valores.informacion)){
                            errores.informacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS
                        }
                        else if (valores.informacion.length > getMaximoTextArea) {
                            errores.informacion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES'
                        }
                        else if (valores.informacion.length < getMinimoTextArea) {
                            errores.informacion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES'
                        }
                    }

                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {
                    //enviarDatos(valores)
                    setEnviarDatos(valores)
                    showModalAprobacion()
                }}
            >

                {({ errors, values }) => (
                    <Form>
                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>Actuaciones</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra,  }}><small>Actuación {nombre}</small></Link></li>
                                    <li className="breadcrumb-item"> <small>{nombreTipoActuacion} Aprobar/Rechazar</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso.toUpperCase()} {nombreTipoActuacion} :: {titulo.toUpperCase()} </h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12 mt-2">
                                        <div className="form-group">
                                            <label htmlFor="informacion">MOTIVO POR EL QUE SE SOLICITA {valor == 1 ? "LA APROBACIÓN" : "EL RECHAZO"} <span className="text-danger mt-2">*</span></label>
                                            <Field as="textarea" className="form-control mt-2" id="informacion" name="informacion" rows="6" placeholder="Información para su solicitud...."
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{values.informacion.length} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary" >{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    <Link to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>
    )

}

export default ActuacionesAprobacionRechazar