import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import '../../Utils/Constants';
import { Link } from "react-router-dom";

function EvaluacionFasesAdd() {

    const [errorApi, setErrorApi] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [getErrorRedirect, setErrorRedirect] = useState(false);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [getListaFases, setListaFases] = useState([]);
    const [getListaResultadoEvaluacion, setListaResultadoEvaluacion] = useState([]);
    const [getListaTipoExpediente, setListaTipoExpediente] = useState({ data: [] });
    const [getListaTipoDerechoPeticion, setListaTipoDerechoPeticion] = useState({ data: {} });
    const [getSelectedTipoExpediente, setSelectedTipoExpediente] = useState("");
    const [getSelectedDerechoPeticion, setSelectedDerechoPeticion] = useState("");
    const [getSelectedRequiereGestionJuridica, setSelectedRequiereGestionJuridica] = useState("");
    const [getListaTiposQueja, setListaTiposQueja] = useState({ data: {} });
    const [getListaTerminosRespuesta, setListaTerminosRespuesta] = useState({ data: {} });
    
    const [getListaCombinacion, setListaCombinacion] = useState([]);

    const [getSelectedQueja, setSelectedQueja] = useState("");
    const [getSelectedTutela, setSelectedTutela] = useState("");
    const [getEvaluacion, setEvaluacion] = useState();
    const [getFase, setFase] = useState();

    useEffect(() => {
        async function fetchData() {
            obtenerListaExpedientes();
        }
        fetchData();
    }, []);


    let selectChangeTipoExpediente = (e) => {
        setSelectedTipoExpediente(e);
        setSelectedDerechoPeticion("");
        setSelectedRequiereGestionJuridica("");
        setSelectedQueja("");
        setEvaluacion("");
        setFase("");
    }

    let selectChangeDerechoPeticion = (e) => {
        setSelectedDerechoPeticion(e);
        setSelectedRequiereGestionJuridica("");
        setEvaluacion("");
        setFase("");
    }

    let selectChangeRequiereGestionJuridica = (e) => {
        setSelectedRequiereGestionJuridica(e);
        setEvaluacion("");
        setFase("");
    }

    let selectChangeQueja = (e) => {
        setSelectedQueja(e);
        setEvaluacion("");
        setFase("");
    }

    let selectChangeTutela = (e) => {
        setSelectedTutela(e);
        setEvaluacion("");
        setFase("");
    }

    let selectChangeTipoEvaluacion = (e) => {
        setEvaluacion(e);
        setFase("");
    }

    let selectChangeFase = (e) => {
        setFase(e);
    }

    const obtenerListaExpedientes = () => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('mas-tipo-expediente').then(
            datos => {
                if (!datos.error) {
                    setListaTipoExpediente(datos.data);
                    obtenerListaDerechoPeticion();
                }
                else{
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaDerechoPeticion = () => {
        GenericApi.getGeneric("mas-tipo-derecho-peticion").then(
            datos => {
                if (!datos.error) {
                    setListaTipoDerechoPeticion(datos);
                    obtenerListaQueja();
                }                
                else{
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaQueja = () => {
        GenericApi.getGeneric("mas-tipo-queja").then(
            datos => {
                if (!datos.error) {
                    setListaTiposQueja(datos);
                    obtenerListaEvaluacion();
                }
                else{
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaEvaluacion = () => {
        GenericApi.getGeneric("mas-resultado-evaluaciones/evaluaciones").then(
            data => {
                if (!data.error) {
                    setListaResultadoEvaluacion(data["data"])                    
                    obtenerListaTerminosRespuesta();
                }
                else{
                    setErrorApi(data.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaTerminosRespuesta = () => {
        GenericApi.getGeneric("mas-termino-respuesta").then(
            datos => {
                if (!datos.error) {
                    setListaTerminosRespuesta(datos);
                    obtenerListaFases();
                }
                else {
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    //Fases
    const obtenerListaFases = () => {
        GenericApi.getAllGeneric('mas-fase-estado/'+global.Constants.ETAPAS.EVALUACION).then(
            datos => {
                if (!datos.error) {
                    setListaFases(datos["data"]);
                    window.showSpinner(false);
                }
                else {
                    window.showModal();
                    window.showSpinner(false);
                }

            }
        )
    }

    const showModalAgregarCombinacion = () => {
        window.showModalAgregarEvaluacionFase(true);
    }
    
    const showModalAgregarCombinacionFase = () => {
        window.showModalAgregarEvaluacionSoloFase(true);
    }

    const componentSelectFase = (validarRepetido) => {
        if(validarRepetido){
            return (
                getListaFases.map((fase, i) => {
                    if(!getListaCombinacion.find(data => data.id_fase_actual == fase.id)){
                        return (
                            <option key={fase.id} value={fase.id}>{fase.attributes.nombre}</option>
                        )
                    }
                })
            )
        }
        else{
            return (
                getListaFases.map((fase, i) => {
                    return (
                        <option key={fase.id} value={fase.id}>{fase.attributes.nombre}</option>
                    )
                })
            )
        }
    }

    //TIPO DE EXPEDIENTE
    const componentSelectTipoExpediente = () => {
        return (
            getListaTipoExpediente.map((resultado, i) => {
                return (
                    <option key={resultado.id} value={resultado.id}>{resultado.attributes.nombre}</option>
                )
            })
        )
    }

    //DERECHO DE PETICION
    const componentSelectTipoDerechoPeticion = () => {
        return (
            getListaTipoDerechoPeticion.data.map((derecho_peticion, i) => {
                return (
                    <option key={derecho_peticion.id} value={derecho_peticion.id}>{derecho_peticion.attributes.nombre}</option>
                )
            })
        )
    }

    //TIPOS DE QUEJA
    const componentSelectTiposQueja = () => {
        return (
            getListaTiposQueja.data.map((tipo_queja, i) => {
                if(getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE && global.Constants.TIPO_QUEJA.EXTERNA == tipo_queja.id){
                    return (
                        <option key={tipo_queja.id} value={tipo_queja.id}>{tipo_queja.attributes.nombre}</option>
                    )
                }
                else if(getSelectedTipoExpediente !== global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE){
                    return(
                        <option key={tipo_queja.id} value={tipo_queja.id}>{tipo_queja.attributes.nombre}</option>
                    )
                }
            })
        )
    }


    //EVALUACION
    const componentSelectResultadoEvaluacion = () => {
        return (
            getListaResultadoEvaluacion.map((resultado, i) => {
                return (
                    <option key={resultado.id} value={resultado.id}>{resultado.attributes.nombre}</option>
                )
            })
        )
    }

    //TERMINO RESPUESTA
    const selectTerminosRespuesta = () => {
        return (
            getListaTerminosRespuesta.data.map((termino_respuesta, i) => {
                return (
                    <option key={termino_respuesta.id} value={termino_respuesta.id}>{termino_respuesta.attributes.nombre}</option>
                )
            })
        )
    }

    const listaSubExpediente = () => {

        // TIPO DE EXPEDIENTE = DERECHO DE PETICION
        if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) {
            return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor='sub_expediente'>TIPO DE DERECHO DE PETICIÓN<span className='text-danger'>*</span></label>
                            <select className='form-control' id='sub_expediente' name='sub_expediente' onChange={e => selectChangeDerechoPeticion(e.target.value)}>
                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                { getListaTipoDerechoPeticion.data.length > 0 ? componentSelectTipoDerechoPeticion() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
        // TIPO DE EXPEDIENTE = PODER REFERENTE A SOLICITUD
        else if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE) {
            return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor='sub_expediente'>TIPO DE { getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA ? 'QUEJA' : (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE ? 'PODER PREFERENTE A SOLICITUD' : 'PROCESO DISCIPLINARIO') } <span className='text-danger'>*</span></label>
                            <select className='form-control' id='sub_expediente' name='sub_expediente' onChange={e => selectChangeQueja(e.target.value)}>
                                {
                                    getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA
                                    ?
                                        <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    :
                                    (
                                        getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE
                                        ?
                                            <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        :
                                            <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    )
                                }                                       
                                { getListaTiposQueja.data.length > 0 ? componentSelectTiposQueja() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
        // TIPO DE EXPEDIENTE = QUEJA
        else if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA || getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PROCESO_DISCIPLINARIO) {
            return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor='sub_expediente'>TIPO DE { getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA ? 'QUEJA' : 'PROCESO DISCIPLINARIO' } <span className='text-danger'>*</span></label>
                            <select className='form-control' id='sub_expediente' name='sub_expediente' onChange={e => selectChangeQueja(e.target.value)}>
                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                { getListaTiposQueja.data.length > 0 ? componentSelectTiposQueja() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
        // TIPO DE EXPEDIENTE = TUTELA
        else if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.TUTELA) {
            return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor='sub_expediente'>INGRESE TÉRMINO DE RESPUESTA<span className='text-danger'>*</span></label>
                            <select className='form-control' id='sub_expediente' name='sub_expediente' onChange={e => selectChangeTutela(e.target.value)}>
                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                { getListaTerminosRespuesta.data.length > 0 ? selectTerminosRespuesta() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
    }

    const listaTercerExpediente = () => {
        
        if (
            getSelectedDerechoPeticion === global.Constants.DERECHOS_PETICION.ALERTA
        ) {
            return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor="tercer_expediente">REQUIERE GESTIÓN JURÍDICA<span className="text-danger">*</span></label>
                            <select className="form-control" id="tercer_expediente" name="tercer_expediente" onChange={e => selectChangeRequiereGestionJuridica(e.target.value)}>
                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                <option value="true">SI</option>
                                <option value="false">NO</option>
                            </select>
                        </div>
                    </div>
                </>
            )
        }
    }

    const listaTipoEvaluacion = () => {
        if(
            (
                getSelectedDerechoPeticion == global.Constants.DERECHOS_PETICION.COPIAS
            ) ||
            (
                getSelectedDerechoPeticion == global.Constants.DERECHOS_PETICION.GENERAL
            ) ||
            (
                getSelectedDerechoPeticion == global.Constants.DERECHOS_PETICION.ALERTA &&
                getSelectedRequiereGestionJuridica
            ) ||
            (
                getSelectedQueja
            ) ||
            (
                getSelectedTipoExpediente == global.Constants.TIPOS_EXPEDIENTES.TUTELA
            )
        )
        {
            return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor='evaluacion'>TIPO DE EVALUACIÓN<span className='text-danger'>*</span></label>
                            <select className='form-control' id='evaluacion' name='evaluacion' value={getEvaluacion} onChange={e => selectChangeTipoEvaluacion(e.target.value)}>
                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                { getListaResultadoEvaluacion.length > 0 ? componentSelectResultadoEvaluacion() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
    }

    const listaFase = () => {
        if(getEvaluacion)
        {
            return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor='fase'>FASE<span className='text-danger'>*</span></label>
                            <select className='form-control' id='fase' name='fase' onChange={e => selectChangeFase(e.target.value)}>
                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                { getListaFases.length > 0 ? componentSelectFase(false) : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
    }

    const agregarCombinacion = (valores) => {
        
        let combinacion = [];

        if(getListaCombinacion.length > 0 && getListaCombinacion[0].id != 0){
            combinacion = getListaCombinacion;
        }

        setListaCombinacion([]);

        if(combinacion.length == 0){
            console.log(getListaTipoDerechoPeticion, getSelectedDerechoPeticion);
            combinacion.push(
                {
                    "id": getListaCombinacion.length > 0 ? combinacion[combinacion.length-1].id + 1 : 1,
                    "orden": 0,
                    "id_resultado_evaluacion": getEvaluacion,
                    "nombre_evaluacion": getListaResultadoEvaluacion.find(data => data.id == getEvaluacion).attributes.nombre,
                    "id_tipo_expediente": getSelectedTipoExpediente,
                    "nombre_expediente": getListaTipoExpediente.find(data => data.id == getSelectedTipoExpediente).attributes.nombre,
                    "id_sub_tipo_expediente": getSelectedDerechoPeticion ? getSelectedDerechoPeticion : (getSelectedQueja ? getSelectedQueja : getSelectedTutela ? getSelectedTutela : null),
                    "nombre_sub_expediente": getSelectedDerechoPeticion ? (getListaTipoDerechoPeticion.data.find(data => data.id == getSelectedDerechoPeticion).attributes.nombre) : (getSelectedQueja ? getListaTiposQueja.data.find(data => data.id == getSelectedQueja).attributes.nombre : (getSelectedTutela ? getListaTerminosRespuesta.data.find(data => data.id == getSelectedTutela).attributes.nombre : null)),
                    "id_tercer_expediente": getSelectedRequiereGestionJuridica ? getSelectedRequiereGestionJuridica == 'true' ? 1 : 0 : null,
                    "nombre_tercer_expediente": getSelectedRequiereGestionJuridica ? (getSelectedRequiereGestionJuridica == 'true' ? 'Si' : 'No') : null,
                    "id_fase_actual": getFase,
                    "nombre_fase": getListaFases.find(data => data.id == getFase).attributes.nombre,
                    "id_fase_antecesora": global.Constants.FASES.CIERRE_CAPTURA_REPARTO
                }
            )
        }
        else{
            combinacion.push(
                {
                    "id": combinacion[combinacion.length-1].id + 1,
                    "orden": combinacion.length + 1,
                    "id_resultado_evaluacion": combinacion[0].id_resultado_evaluacion,
                    "nombre_evaluacion": combinacion[0].nombre_evaluacion,
                    "id_tipo_expediente": combinacion[0].id_tipo_expediente,
                    "nombre_expediente": combinacion[0].nombre_expediente,
                    "id_sub_tipo_expediente": combinacion[0].id_sub_tipo_expediente,
                    "nombre_sub_expediente": combinacion[0].nombre_sub_expediente,
                    "id_tercer_expediente": combinacion[0].id_tercer_expediente,
                    "nombre_tercer_expediente": combinacion[0].nombre_tercer_expediente,
                    "id_fase_actual": getFase,
                    "nombre_fase": getListaFases.find(data => data.id == getFase).attributes.nombre,
                    "id_fase_antecesora": combinacion[combinacion.length-1].id_fase_actual
                }
            )
        }

        setListaCombinacion([...combinacion]);

        if(combinacion.length == 1){
            window.showModalAgregarEvaluacionFase(false);
        }
        else{
            window.showModalAgregarEvaluacionSoloFase(false);
        }
    }

    const componentAlertAgregarEvaluacion = () => {
        return (
            <>
                <Formik
                    initialValues={{
                        // ingresoTipoExpediente: getSelectedTipoExpediente,
                        // sub_expediente: '',
                        // tercer_expediente: '',
                        // evaluacion: '',
                        // fase: ''
                    }}
                    enableReinitialize
                    validate={(valores) => { 
                        let errores = {};

                        // if(!valores.rol){
                        //     errores.rol = 'Debe seleccionar la funcionalidad';
                        // }

                        return errores;
                    }}
                    onSubmit={(valores, {resetForm}) => {
                        agregarCombinacion(valores);
                        resetForm();
                    }}
                >
                    {({ errors, values }) => (
                        <Form>
                            <div className="modal fade" id="modal-block-popout-agregar-evaluacion-fase" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-popout" role="document">
                                    <div className="modal-content">
                                        <div className="block block-themed block-transparent mb-0 ">
                                            <div className="block-header">
                                                <h3 className="block-title">ADMINISTRACIÓN :: AGREGAR COMBINACIÓN</h3>
                                                <div className="block-options">
                                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                        <i className="fa fa-fw fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="block-content">
                                                <div className="row">
                                                    <div className='col-md-12'>
                                                        <div className="form-group">
                                                            <label htmlFor='ingresoTipoExpediente'>TIPO DE EXPEDIENTE<span className='text-danger'>*</span></label>
                                                            <select className="form-control" id="ingresoTipoExpediente" name="ingresoTipoExpediente"
                                                                value={getSelectedTipoExpediente} onChange={e => selectChangeTipoExpediente(e.target.value)}>
                                                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                { getListaTipoExpediente.length > 0 ? componentSelectTipoExpediente() : null }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    { listaSubExpediente() }
                                                </div>
                                                <div className="row">
                                                    { listaTercerExpediente() }
                                                </div>
                                                <div className="row">
                                                    { listaTipoEvaluacion() }
                                                </div>
                                                <div className="row">
                                                    { listaFase() }
                                                </div>
                                                <br></br>
                                            </div>
                                            <div className="block-content block-content-full text-right bg-light">
                                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.AGREGAR}</button>
                                                <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
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

    const componentAlertAgregarFase = () => {
        return (
            <>
                <Formik
                    initialValues={{
                        fase: ''
                    }}
                    enableReinitialize
                    validate={(valores) => { 
                        let errores = {};

                        // if(!valores.rol){
                        //     errores.rol = 'Debe seleccionar la funcionalidad';
                        // }

                        return errores;
                    }}
                    onSubmit={(valores, {resetForm}) => {
                        agregarCombinacion(valores);
                        resetForm();
                    }}
                >
                    {({ errors, values }) => (
                        <Form>
                            <div className="modal fade" id="modal-block-popout-agregar-evaluacion-solo-fase" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-popout" role="document">
                                    <div className="modal-content">
                                        <div className="block block-themed block-transparent mb-0 ">
                                            <div className="block-header">
                                                <h3 className="block-title">Agregar combinación</h3>
                                                <div className="block-options">
                                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                        <i className="fa fa-fw fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="block-content">
                                                <div className="row">
                                                    <div className='col-md-12'>
                                                        <div className="form-group">
                                                            <label htmlFor='fase'>FASE<span className='text-danger'>*</span></label>
                                                            <select className='form-control' id='fase' name='fase' onChange={e => selectChangeFase(e.target.value)}>
                                                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                { getListaFases.length > 0 ? componentSelectFase(true) : null }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br></br>
                                            </div>
                                            <div className="block-content block-content-full text-right bg-light">
                                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.AGREGAR}</button>
                                                <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
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

    const eliminarCombinacion = (index) => {
        setListaCombinacion(getListaCombinacion.filter((img, i) => i !== index));
        if(getListaCombinacion.length >= 0){
            setSelectedTipoExpediente("");
            setSelectedDerechoPeticion("");
            setSelectedRequiereGestionJuridica("");
            setSelectedQueja("");
            setEvaluacion("");
            setFase("");
        }
    }

    const handleDragEnd = (e) => {
        if (!e.destination) return;
        let tempData = Array.from(getListaCombinacion);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        setListaCombinacion(tempData);
    };

    const guardarDatos = () => {

        const attributes = [];

        getListaCombinacion.forEach((combinacion, index) => {
            attributes.push({
                "id": combinacion.id,
                "orden": index + 1,
                "id_resultado_evaluacion": combinacion.id_resultado_evaluacion,
                "nombre_evaluacion": combinacion.nombre_evaluacion,
                "id_tipo_expediente": combinacion.id_tipo_expediente,
                "nombre_expediente": combinacion.nombre_expediente,
                "id_sub_tipo_expediente": combinacion.id_sub_tipo_expediente,
                "nombre_sub_expediente": combinacion.nombre_sub_expediente,
                "id_tercer_expediente": combinacion.id_tercer_expediente,
                "nombre_tercer_expediente": combinacion.nombre_tercer_expediente,
                "id_fase_actual": combinacion.id_fase_actual,
                "nombre_fase": combinacion.nombre_fase,
                "id_fase_antecesora": combinacion.id_fase_antecesora
            })
        });

        const data = {
            "data": {
                "type": "evaluacion_fase",
                "attributes": attributes
            }
        }

        window.showSpinner(true);

        GenericApi.addGeneric('guardar-fases-evaluacion-lista', data).then(
            datos => {
                if (!datos.error) {                   
                    setModalState({ title: "ADMINISTRACIÓN :: FASES ETAPA EVALUACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/EvaluacionFasesLista',  alert: global.Constants.TIPO_ALERTA.EXITO});
                    window.showSpinner(false);
                }
                else {
                    // console.log(datos.error);
                    setErrorApi(datos.error);
                    window.showModal(1);
                    window.showSpinner(false);
                }
            }
        )
    }

    return (
        <>
            {<ModalGen data={getModalState} />}
            { <Spinner/> }
            { componentAlertAgregarEvaluacion() }
            { componentAlertAgregarFase() }

            <div className="block block-themed">
                <div className="block-content">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/EvaluacionFasesLista/`}><small>Configuración de fases de la etapa evaluación</small></Link></li>
                        </ol>
                    </nav>
                </div>
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: CONFIGURACIÓN DE FASES DE LA ETAPA EVALUACIÓN PQR</h3>
                    <div className='text-right'>
                        <button type="button" className="btn btn btn-success mr-1 mb-3" data-toggle="tooltip" data-html="true" title="Registrar" onClick={() => (getListaCombinacion.length > 0 ? showModalAgregarCombinacionFase() : showModalAgregarCombinacion())} data-original-title="Consultar Versiones"><span className="fas fa-plus"> </span></button>
                    </div>
                </div>
                <div className='block-content'>
                    <div className='row'>
                        <div className='col-md-12'>
                            {
                                getListaCombinacion.length > 0
                                    ?
                                        <>
                                            <div className='block-content'>
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                    <thead>
                                                        <tr>
                                                            <th width="25">Tipo de Expediente: </th>
                                                            <td width="25%">{ getListaCombinacion[0].nombre_expediente } { getListaCombinacion[0].nombre_sub_expediente ? ' - ' + getListaCombinacion[0].nombre_sub_expediente : null }</td>
                                                            <th width="25%">Tipo de Evaluación: </th>
                                                            <td width="25%">{ getListaCombinacion[0].nombre_evaluacion }</td>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>

                                            <div className="block-content">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <DragDropContext onDragEnd={handleDragEnd}>
                                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                <thead>
                                                                    <tr>
                                                                        <th width="5%">Mover</th>
                                                                        <th width="5%">No</th>
                                                                        <th width="35%">Fase Actual</th>
                                                                        <th width="50%">Acciones</th>
                                                                    </tr>
                                                                </thead>
                                                                <Droppable droppableId="droppable-1">
                                                                    {(provider) => (
                                                                        <tbody
                                                                            ref={provider.innerRef}
                                                                            {...provider.droppableProps}
                                                                        >
                                                                            {getListaCombinacion.map((combinacion, index) => (
                                                                                <Draggable
                                                                                    key={index}
                                                                                    draggableId={index+""}
                                                                                    index={index}
                                                                                >
                                                                                    {(provider) => (
                                                                                        <tr {...provider.draggableProps} ref={provider.innerRef} key={index}>
                                                                                            <td {...provider.dragHandleProps}> <i className="fas fa-hand-paper"></i> </td>
                                                                                            <td>{ index + 1 }</td>
                                                                                            <td>{ combinacion.nombre_fase }</td>
                                                                                            <td>
                                                                                                <button type='button' title='Eliminar Combinación' className='btn btn-sm btn-danger' onClick={() => eliminarCombinacion(index)}><i className="fas fa-minus-circle"></i></button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}
                                                                                </Draggable>
                                                                            ))}
                                                                            {provider.placeholder}
                                                                        </tbody>
                                                                    )}
                                                                </Droppable>
                                                            </table>
                                                        </DragDropContext>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <button type="button" className="btn btn-rounded btn-primary" data-toggle="tooltip" data-html="true" title="Registrar" onClick={() => guardarDatos()}><span> </span> Registrar</button>
                                                </div>
                                            </div>
                                        </>
                                    :
                                    (
                                        <>
                                            <div className="row">
                                                <div className="col-md-12 text-center">
                                                    <b>Sin información, registrada</b>
                                                </div>
                                            </div>
                                            <br></br>
                                        </>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EvaluacionFasesAdd;