import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import ParametrosMasApi from '../../Api/Services/ParametrosMasApi';
import { json, Link } from "react-router-dom";
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/es';
import { useLocation } from 'react-router-dom'
import { hasAccess } from '../../../components/Utils/Common';
import ClasificacionRadicado from '../ClasificacionRadicado/ClasificacionRadicado';
import GenericApi from '../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';

function ValidarClasificacionRadicadoForm() {


    const location = useLocation()
    const { from } = location.state
    const [listaTipoRespuesta, setListaTipoRespuesta] = useState({ data: {} });
    const [selectedTipoRespuesta, setSelectedTipoRespuesta] = useState("");
    const [respuestaTipoRespuesta, setRespuestaTipoRespuesta] = useState(false);
    const [getRespuestaValidacionJefe, setRespuestaValidacionJefe] = useState(false);
    const [getClasificacionActiva, setClasificacionActiva] = useState([]);
    const [getRtaJefe, setRtaJefe] = useState(false);
    const [modalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getRtaValidacion, setRtaValidacion] = useState(false);
    const [getEsValidoReclasificar, setEsValidoReclasificar] = useState(false);
    const [getNombreProceso, setNombreProceso] = useState('');

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    let numeroLlamados = 0;
    let numeroTotalLlamados = 5;


    const [getParametros, setParametros] = useState({
        id_proceso_disciplinario: procesoDisciplinarioId,
        id_etapa: 2, // from.idEtapa
        reclasificacion: true,
        route: "/MisPendientes/",
        tipo_clasificacion: global.Constants.TIPO_CLASIFICACION.VALIDAR_CLASIFICACION,
    });




    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);
            // Se valida que la clasificación no haya sido validada.
            nombreProceso();
            ParametrosMasApi.getAllTipoRespuesta().then(
                datos => !datos.error ? (setListaTipoRespuesta(datos), setRespuestaTipoRespuesta(true)) : window.showModal(1)
            )

        }
        fetchData();
    }, []);

    // Funcion para validar y detener el spinner
    const validacionSpinner = () => {
        numeroLlamados++
        if(numeroLlamados >= numeroTotalLlamados){
            window.showSpinner(false);
        }
    }

    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {

                validacionSpinner()

                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    validarClasificacion();
                }
            }
        )
    }


    /**
     * Se consulta si la clasificación ya fue aceptada en la etapa de Evaluación.
     * @returns 
     */
    const validarClasificacion = () => {

        const data = {
            "data": {
                "type": "validacion_clasificado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                }
            }
        }

        return (
            GenericApi.getByDataGeneric("validar-clasificacion/get-validar-clasificado/" + procesoDisciplinarioId, data).then(
                datos => {

                    validacionSpinner()

                    if (!datos.error) {
                        // Si la clasificación fue validada.
                        setRtaValidacion(true)
                        if(datos.data[0].attributes?.proceso_disciplinario?.id_etapa == global.Constants.ETAPAS.EVALUACION || datos.data[0].attributes?.proceso_disciplinario?.id_etapa == global.Constants.ETAPAS.EVALUACION_PD){
                            setEsValidoReclasificar(true) 
                        }
                        //setRespuestaValidacionJefe(true)  
                    }

                    listaReclasificacion();
                    jefeDependencia();
                }
            )
        )
    }

    /**
     * Se trae toda la lista de las reclasificaciones realizadas por el sistema
     */
    const listaReclasificacion = () => {

        GenericApi.getGeneric("clasificacion-radicado/get-reclasificacion/" + procesoDisciplinarioId).then(

            datos => {

                validacionSpinner()

                if (!datos.error) {
                    console.log("clasificacion-radicado/get-reclasificacion/" + procesoDisciplinarioId);
                    console.log(datos.data);
                    setClasificacionRadicadoLista(datos)
                    setRespuestaClasificacionRadicado(true)
                    validacionPorJefe()
                }
                else {
                    setModalState({  title: getNombreProceso + " :: VALIDAR CLASIFICACIÓN", message: datos.error.toString(), show: true, redirect: '/ValidarClasificadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    /**
     * Se consulta si el usuario que se encuentra en sesión es jefe de la dependencia
     */
    const jefeDependencia = () => {

        const data = {
            "data": {
                "type": "usuario",
                "attributes": {
                    "": ""
                }
            }
        }

        GenericApi.getByDataGeneric("usuario/get-jefe-dependencia", data).then(

            datos => {

                validacionSpinner()

                if (!datos.error) {
                    setRtaJefe(true)
                    console.log("ESTE USARIO ES JEFE")
                }
                else {
                    setRtaJefe(false);
                }
                //window.showSpinner(false);
            }

        )
    }


    const validacionPorJefe = () => {

        GenericApi.getGeneric("validar-clasificacion/get-validar-clasificacion-jefe/" + procesoDisciplinarioId).then(

            datos => {

                validacionSpinner()

                if (!datos.error) {
                    setRespuestaValidacionJefe(true)
                    return true;
                }
                else {
                    setRespuestaValidacionJefe(false)
                    return false;
                }
            }
        )
    }


    let selectChangeTipoRespuesta = (e) => {
        setSelectedTipoRespuesta(e);
    }

    const selectTipoRespuesta = () => {
        return (
            listaTipoRespuesta.data.map((tipo_respuesta, i) => {
                return (
                    <>
                        <option key={tipo_respuesta.id} value={tipo_respuesta.id}>{tipo_respuesta.attributes.nombre}</option>
                    </>
                )
            })
        )
    }

    const aceptarClasificacion = () => {

        window.showSpinner(true);

        let data;

        data = {
            "data": {
                "type": "validar_clasificacion",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": 2,
                    "estado": true,
                }
            }
        }

        GenericApi.addGeneric("validar-clasificacion", data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso + " :: VALIDAR CLASIFICACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: getNombreProceso + " :: VALIDAR CLASIFICACIÓN", message: datos.error.toString(), show: true, redirect: '/ValidarClasificadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )

    }

    // COMPONENTE CONFIRMACION TIPO DE CLASIFICADO
    const componenteTipoRespuesta = (tipo_respuesta) => {

        // CONFIRMACION TIPO DE CLASIFICADO = SI
        if (tipo_respuesta === 1) {
            return (
                <>
                    <Formik

                        initialValues={{
                            aceptacion_clasificacion: true,
                        }}
                        enableReinitialize

                        onSubmit={({ resetForm }) => {
                            aceptarClasificacion();
                        }}
                    >

                        <Form>
                            <div className="block-content block-content-full text-right">

                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>

                                <Link to={`/ValidarClasificacionRadicadoLista/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </Form>

                    </Formik>

                </>
            );
        }

        /// CONFIRMACION TIPO DE CLASIFICADO = NO
        else if (tipo_respuesta === 2) {
            return (
                <>
                    <ClasificacionRadicado getParametros={getParametros} id="cr_componente" name="cr_componente" />
                </>
            );
        }
    };


    const [respuestaClasificacionRadicado, setRespuestaClasificacionRadicado] = useState(false);
    const [clasificacionRadicadoLista, setClasificacionRadicadoLista] = useState({ data: [], links: [], meta: [] });

    const listaClasificacionRadicado = () => {

        if (clasificacionRadicadoLista.data != null && typeof (clasificacionRadicadoLista.data) != 'undefined') {
            return (

                clasificacionRadicadoLista.data.map((clasificacion_radicado, i) => {
                    return (
                        cargarTabla(clasificacion_radicado, i)
                    )
                })
            )
        }
        else {
            return (

                clasificacionRadicadoLista.map((clasificacion_radicado, i) => {
                    return (
                        cargarTabla(clasificacion_radicado, i)
                    )
                })
            )
        }

    }

    const cargarTabla = (clasificacion_radicado, i) => {

        return (
            <tr className='text-uppercase'>
                {clasificacion_radicado.attributes.estado === 1 ? (setClasificacionActiva(1)) : null}

                <td>{clasificacion_radicado.attributes.etapa.nombre}</td>
                <td>{clasificacion_radicado.attributes.expediente.nombre}<br />
                    {clasificacion_radicado.attributes.id_tipo_expediente == global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION ? clasificacion_radicado.attributes.tipo_derecho_peticion.nombre: null}
                    {clasificacion_radicado.attributes.id_tipo_expediente == global.Constants.TIPOS_EXPEDIENTES.QUEJA ? clasificacion_radicado.attributes.tipo_queja.nombre : null}
                </td>
                <td>{clasificacion_radicado.attributes.dependencia.nombre}</td>
                <td>{clasificacion_radicado.attributes.usuario_registra.nombre} {clasificacion_radicado.attributes.usuario_registra.apellido}</td>
                <td>{clasificacion_radicado.attributes.estado == 1 ? 'ACTIVO' : 'INACTIVO'}</td>
                <td>{clasificacion_radicado.attributes.created_at}</td>

                {(!getRtaValidacion && getRtaJefe) ? (
                    <td>
                        <Formik
                            initialValues={{
                                uuid: clasificacion_radicado.id,
                                id_clasificacion_radicado: clasificacion_radicado.id,
                                id_proceso_disciplinario: clasificacion_radicado.attributes.id_proceso_disciplinario
                            }}
                            enableReinitialize

                            validate={(valores) => {
                                let errores = {}
                                return errores
                            }}

                            onSubmit={(valores, { resetForm }) => {
                                // console.log(valores);
                                asignarCaso(valores, false);
                            }}>
                            <Form>
                                {
                                    from.mismoUsuarioBuscador
                                    ?
                                        <button type="submit" className="btn btn-primary">{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                                    :
                                        null
                                }
                            </Form>
                        </Formik>
                    </td>) : null
                }
            </tr>
        )
    }


    const asignarCaso = (datos, reparto) => {

        window.showSpinner(true);
        let data;

        data = {
            "data": {
                "type": "clasificacion_radicado",
                "attributes": {
                    "uuid": datos.uuid,
                    "id_proceso_disciplinario": datos.id_proceso_disciplinario,
                    "id_etapa": 2,
                    "id_tipo_expediente": datos.id_tipo_expediente,
                    "observaciones": "",
                    "id_tipo_queja": null,
                    "id_termino_respuesta": null,
                    "fecha_termino": null,
                    "hora_termino": null,
                    "gestion_juridica": false,
                    "estado": true,
                    "id_estado_reparto": null,
                    "id_tipo_derecho_peticion": null,
                    "oficina_control_interno": false,
                    "created_user": datos.funcionario_registra_name,
                    "reclasificacion": null,
                    "reparto": reparto
                }
            }
        }

        GenericApi.addGeneric("clasificacion-radicado/asignar-caso-por-jefe", data).then(

            datos => {
                if (!datos.error) {

                    setModalState({
                        title: getNombreProceso + " :: VALIDAR CLASIFICACIÓN",
                        message: "EL PROCESO DISCIPLINARIO ES ASIGNADO A " + datos.data[0].attributes.nombre_completo_funcionario_actual.toUpperCase(), show: true,
                        redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO
                    });
                }
                else {
                    setModalState({
                        title: getNombreProceso + " :: VALIDAR CLASIFICACIÓN", message: datos.error.toString().toUpperCase(), show: true,
                        redirect: '/ValidarClasificacionRadicadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR
                    });
                }
                window.showSpinner(false);
            }
        )
    }



    return (

        <>
            {<Spinner />}
            <ModalGen data={modalState} />

            <div className="row">


                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from}}><small>Ramas del proceso</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" aria-current="page" to={`/ClasificacionRadicadoLista/`} state={{ from: from }}><small>Validar Clasificación</small></Link></li>
                        </ol>
                    </nav>
                </div>


                <div className="col-md-12">
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title"> {getNombreProceso} :: <strong>VALIDAR CLASIFICACIÓN</strong></h3>
                        </div>

                        <div className="block-content">
                            <div className='col-md-12 text-right my-2'>

                                <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from }}>
                                    <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                </Link>

                            </div>
                            <>

                                {
                                    (hasAccess('EI_ValidarClasificacion', 'Consultar')) ? (

                                        <>
                                            {
                                                (getRespuestaValidacionJefe) ? (

                                                    <div className="alert alert-warning alert-dismissable" role="alert">
                                                        <h3 className="alert-heading font-size-h4 my-2">ALERTA</h3>
                                                        <p className="mb-0">EL PROCESO FUE CLASIFICADO DIRECTAMENTE POR EL JEFE DE LA DEPENDENCIA</p>
                                                    </div>

                                                ) : null
                                            }

                                            <table className="table table-vcenter">
                                                <thead>
                                                    <tr>
                                                        <th>ETAPA</th>
                                                        <th>TIPO DE EXPEDIENTE</th>
                                                        <th>DEPENDENCIA</th>
                                                        <th>REGISTRADO POR</th>
                                                        <th>ESTADO</th>
                                                        <th>FECHA DE REGISTRO</th>
                                                        {(!getRtaValidacion && getRtaJefe) ? (
                                                            <th>ASIGNACIÓN</th>
                                                        ) : null}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {respuestaClasificacionRadicado ? listaClasificacionRadicado() : null}
                                                </tbody>
                                            </table>

                                        </>
                                    ) :
                                    <div className="alert alert-primary alert-dismissable" role="alert">
                                        <span>NO TIENE PERMISOS PARA GESTIONAR ESTA FASE. COMUNÍQUESE CON EL ADMINISTRADOR DEL SISTEMA.</span>
                                    </div>

                                }
                            </>

                            {(!getRtaValidacion && from.mismoUsuarioBuscador) ? (
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="ingresoTipoExpediente">¿CONFIRMA LA CLASIFICACIÓN DEL EXPEDIENTE? <span className="text-danger">*</span></label>
                                                <select className="form-control" id="ingresoTipoExpediente" name="ingresoTipoExpediente"
                                                    value={selectedTipoRespuesta} onChange={e => selectChangeTipoRespuesta(e.target.value)}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {respuestaTipoRespuesta ? selectTipoRespuesta() : null}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/*SI APLICA RECLASIFIFCACION*/}
                                    {selectedTipoRespuesta === '1' ? componenteTipoRespuesta(1) : ''}
                                    {/*NO APLICA RECLASIFIFCACION*/}
                                    {selectedTipoRespuesta === '2' ? componenteTipoRespuesta(2) : ''}
                                </div>) : null
                            }

                            {(getEsValidoReclasificar && getRtaValidacion && getRtaJefe && from.mismoUsuarioBuscador) ? (
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="ingresoTipoExpediente">RECLASIFICAR EXPEDIENTE</label>

                                                <div className="alert alert-warning" role="alert">
                                                    <strong>RECLASIFICACIÓN DEL EXPEDIENTE</strong><br /><br />
                                                        RECUERDE QUE UNA VEZ REALICE LA RECLASIFICACIÓN DEL EXPEDIENTE DEBERÁ INICIAR NUEVAMENTE EL PROCESO EN LAS FASES SUBSECUENTES DE LA ETAPA DE EVALUACIÓN.
                                                </div>
                                                {componenteTipoRespuesta(2)}

                                            </div>
                                        </div>
                                    </div>
                                </div>) : null
                            }

                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}
export default ValidarClasificacionRadicadoForm;
