import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import GenericApi from '../../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import { getUser } from '../../../components/Utils/Common';

function SolicitudDeAnulacion() {

    const [getUsuarioNombre, setUsuarioNombre] = useState("");
    const [getUsuarioApellido, setUsuarioApellido] = useState("");
    const [getUsuarioName, setUsuarioName] = useState("");
    const [getUsuarioDependenciaNombre, setUsuarioDependenciaNombre] = useState("");

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getIdDependenciaAtiendaAnulaciones, setIdDependenciaAtiendaAnulaciones] = useState(0);
    const [getNameUsuario, setNameUsuario] = useState("");
    const [getIdActuacion, setIdActuacion] = useState("");
    const [getNombreUsuario, setNombreUsuario] = useState("");
    const location = useLocation()
    const { from, selected_id_etapa, id, nombre, estadoActualActuacion, activacion } = location.state;
    const [getRoutes, setRoutes] = useState({
        ver_detalle: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"
    });
    const [getEnviarDatos, setEnviarDatos] = useState()
    const [getNombreProceso, setNombreProceso] = useState('')

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso()
            setNombreUsuario(getUser().nombre);
            obtenerParametros();
            IdDependenciaAceptaSolicitudesDeAnulacion();
            obtenerTodosLosDatosDeLaActuacion();
        }
        fetchData();
    }, []);

    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
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
                        setModalState({ title: "ANTECEDENTES", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const IdDependenciaAceptaSolicitudesDeAnulacion = () => {
        const data = {
            "data": {
                "type": "mas_parametro",
                "attributes": {
                    "nombre": "id_dependencia_que_atiende_solicitud_de_anulacion"
                }
            }
        }

        //buscamos el parametro
        GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(
            datos => {

                if (!datos.error) {
                    setIdDependenciaAtiendaAnulaciones(datos.data[0].attributes.valor);
                    IdUsuarioJefeDependencia(datos.data[0].attributes.valor);
                } else {
                    // Aqui tengo que colocar algun mensaje de que no existe una dependencia asignada 
                    // para atender las solicitudes de anulacion
                }
            }
        )
    }

    const IdUsuarioJefeDependencia = (id) => {
        GenericApi.getByIdGeneric("mas-dependencia-origen", id).then(
            datos => {
                if (!datos.error) {
                    consultarUsuario(datos.data.attributes.id_usuario_jefe);
                } else {

                }

            }
        )
    }

    const consultarUsuario = (id) => {
        GenericApi.getByIdGeneric("usuario", id).then(
            datos => {
                if (!datos.error) {
                    GenericApi.getAllGeneric('proceso-diciplinario/usuario-habilitado-transacciones/' + from.procesoDisciplinarioId + '/' + id).then(
                        datos_respuesta => {
                            if(!datos_respuesta.error){
                                setNameUsuario(datos.data.attributes.name);
                                datosDelUsuarioARemitir(datos.data.attributes.name);
                            }
                            else {

                                let mensaje = []

                                mensaje[0] = "EL USUARIO JEFE NO ESTÁ HABILITADO PARA RECIBIR ESTE PROCESO POR ALGUNA DE LAS SIGUIENTES RAZONES:"
                                mensaje[1] = "1.   EL USUARIO SE ENCUENTRA INACTIVO."
                                mensaje[2] = "2.   EL USUARIO NO ESTÁ HABILITADO PARA RECIBIR PROCESOS."
                                mensaje[3] = "3.   EL USUARIO NO ESTÁ HABILITADO PARA RECIBOS PROCESOS DISCIPLINARIOS."
                                
                                setModalState({
                                    title: "SINPROC N° " + from.radicado.toUpperCase() + " :: ENVIAR SOLICITUD DE " + (activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'),
                                    message: mensaje,
                                    show: true,
                                    redirect: '/MisPendientes',
                                    alert: global.Constants.TIPO_ALERTA.ERROR
                                });
                            }
                            window.showSpinner(false);
                        }
                    )                    
                }
            }
        )
    }

    const enviarDatos = () => {
        
        let valores = getEnviarDatos;

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializa la data
        let data = {
            "data": {
                "type": "transacciones",
                "attributes": {
                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                    "id_dependencia_origen": getIdDependenciaAtiendaAnulaciones,
                    "usuario_a_remitir": getNameUsuario,
                    "descripcion_a_remitir": valores.informacion,
                    "id_etapa": 3
                }
            }
        }

        // Se consume la API
        GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no hay error
                if (!datos.error) {

                    // Se llama el metodo
                    guardarTrazabilidadActuaciones();
                }

            }
        )
    }

    const guardarTrazabilidadActuaciones = () => {

        // Se inicializa la data
        let data = {
            "data": {
                "type": "trazabilidad-actuaciones",
                "attributes": {
                    "uuid_actuacion": id,
                    "id_estado_actuacion": (activacion ? global.Constants.ESTADO_ACTUACION.SOLICITUD_ACTIVACION : global.Constants.ESTADO_ACTUACION.SOLICITUD_INACTIVACION),
                    "observacion": "Solicitud de " + (activacion ? 'activación' : 'inactivación'),
                    "estado": 1,
                    "envia_correo": 1,
                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                    "activacion": activacion
                }
            }
        }

        // Se consume la API
        GenericApi.addGeneric('trazabilidad-actuaciones', data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no hay error
                if (!datos.error) {

                    // Se cambia el estado
                    cambiarEstadoEnActuaciones();

                    // Se quita el cargando
                    window.showSpinner(false);

                    // constante
                    const menasjeModal = 'EL PROCESO CON RADICADO: ' + from.radicado.toUpperCase() + ' es enviado por Solicitud de ' + (activacion ? 'activación' : 'inactivación') + ' al usuario: ' + getUsuarioNombre.toUpperCase() + ' ' + getUsuarioApellido.toUpperCase() + ' (' + getUsuarioName.toUpperCase() + ')  de la dependencia: ' + getUsuarioDependenciaNombre.toUpperCase() + '';

                    // Se setea el modal
                    setModalState({
                        title: "SINPROC N° " + from.radicado.toUpperCase() + " :: ENVIAR SOLICITUD DE " + (activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'),
                        message: menasjeModal.toUpperCase(),
                        show: true,
                        redirect: '/MisPendientes',
                        alert: global.Constants.TIPO_ALERTA.EXITO
                    });
                } else {

                    // Se setea el modal
                    setModalState({
                        title: "SINPROC N° " + from.radicado.toUpperCase() + " :: ENVIAR SOLICITUD DE " + (activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'),
                        message: datos.error.toString(),
                        show: true,
                        redirect: '/MisPendientes',
                        alert: global.Constants.TIPO_ALERTA.ERROR
                    });
                }
            }
        )
    }

    const cambiarEstadoEnActuaciones = () => {

        // Se inicializa la data
        let data = {
            "data": {
                "type": "actuaciones",
                "attributes": {
                    "id_actuacion": getIdActuacion,
                    "usuario_accion": getNombreUsuario,
                    "id_estado_actuacion": (activacion ? global.Constants.ESTADO_ACTUACION.SOLICITUD_ACTIVACION : global.Constants.ESTADO_ACTUACION.SOLICITUD_INACTIVACION),
                    "estado": 1,
                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                    "id_etapa": selected_id_etapa
                }
            }
        }

        // Se consume la API
        GenericApi.updateGeneric("actuaciones", id, data);
    }

    const obtenerTodosLosDatosDeLaActuacion = () => {

        // Se consume la API
        GenericApi.getGeneric("actuaciones/" + id).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya errores
                if (!datos.error) {

                    // Se setean los valores
                    setIdActuacion(datos.data.attributes.id_actuacion);
                }
            }
        )
    }

    const datosDelUsuarioARemitir = (name) => {
        GenericApi.getGeneric('usuario/get-usuario-por-name/' + name).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya errores
                if (!datos.error) {

                    // Se setean los valores
                    setUsuarioNombre(datos.data[0].attributes.nombre);
                    setUsuarioApellido(datos.data[0].attributes.apellido);
                    setUsuarioName(datos.data[0].attributes.name);
                    setUsuarioDependenciaNombre(datos.data[0].attributes.dependencia.nombre);
                }
            }
        )
    }

    const showModalAnulacion = () => {
        window.showConfirmacionAnulacionActuacion(true)
    }

    /*Modal: mensaje de confirmación para realizar el cambio de etapa */
    const componentAlertConfirmacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-confirmacion-anulacion-actuacion" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout" role="document">
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
                                        activacion
                                        ?
                                            <p>¿ESTÁ SEGURO QUE DESEA SOLICITAR ACTIVAR ESTA ACTUACIÓN?</p>
                                        :
                                            <p>¿ESTÁ SEGURO QUE DESEA SOLICITAR INACTIVAR ESTA ACTUACIÓN?</p>
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
            { componentAlertConfirmacion() }
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    setCountTextArea(valores.informacion.length);
                    let errores = {}
                    if (!valores.informacion) {
                        errores.informacion = 'Debe ingresar un valor';
                    }
                    else if (valores.informacion.length <= getMinimoTextArea) {
                        errores.informacion = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres';
                    }
                    if (valores.informacion) {
                        if (containsSpecialChars(valores.informacion))
                            errores.informacion = 'Tiene caracteres inválidos';
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>Actuaciones</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion }}><small>Actuación {nombre.toLowerCase()}</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Solicitar {activacion ? 'Activación' : 'Inactivación'}</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">ACTUACIÓN {nombre.toUpperCase()} :: SOLICITUD DE {activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'} </h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="informacion">MOTIVO PORQUÉ SE SOLICITA {activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'} <span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder={activacion ? 'INFORMACIÓN PARA SU SOLICITUD DE ACTIVACIÓN....' : 'INFORMACIÓN PARA SU SOLICITUD DE INACTIVACIÓN....'}
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary" >ACEPTAR</button>
                                    <Link to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion }} className="font-size-h5 font-w600" >
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

export default SolicitudDeAnulacion;