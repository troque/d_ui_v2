import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import Spinner from '../../Utils/Spinner';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

function EvaluacionFasesDetalle() {

    const [getListaTipoFases, setListaTiposFases] = useState([]);
    const [getListaFases, setListaFases] = useState([]);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreEvaluacion, setNombreEvaluacion] = useState({ data: [], links: [], meta: [] });
    const [getNombreExpediente, setNombreExpediente] = useState({ data: [], links: [], meta: [] });
    const [getNombreSubExpediente, setNombreSubExpediente] = useState({ data: [], links: [], meta: [] });
    const [getExisteEvaluacion, setExisteEvaluacion] = useState(false);
    const [getListaCombinacion, setListaCombinacion] = useState([]);

        const [getFase, setFase] = useState();

    let { id_tipo_expediente, id_sub_tipo_expediente, id_tipo_evaluacion } = useParams();

    useEffect(() => {
        async function fetchData() {
            getListaFasesPorTipoExpediente();
        }
        fetchData();
    }, []);

    let selectChangeFase = (e) => {
        setFase(e);
    }

    const showModalAgregarCombinacionFase = () => {
        window.showModalAgregarEvaluacionSoloFase(true);
    }

    const getListaFasesPorTipoExpediente = () => {
        window.showSpinner(true);
        GenericApi.getGeneric("administracion/evaluacion/lista-expedientes-by-id-tipo-expediente/"+id_tipo_expediente+"/"+id_sub_tipo_expediente+"/"+id_tipo_evaluacion).then(
            datos => {
                if (!datos.error) {
                    setListaFases(datos["data"]);
                    getNombreTipoEvaluacion();
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: FASES ETAPA EVALUACIÓN", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', alert: global.Constants.TIPO_ALERTA.ERROR }); 
                    window.showSpinner(false);
                }
                
            }
        )
    }

    const getNombreTipoEvaluacion = () => {

        GenericApi.getGeneric("administracion/nombre-evaluacion/"+id_tipo_evaluacion).then(
            datos => {
                if (!datos.error) {
                    setNombreEvaluacion(datos.data[0].attributes.nombre);
                    getNombreTipoExpediente();                    
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: FASES ETAPA EVALUACIÓN", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', alert: global.Constants.TIPO_ALERTA.ERROR }); 
                    window.showSpinner(false);
                }
            }
        )
    }

    const getNombreTipoExpediente = () => {

        GenericApi.getGeneric("administracion/nombre-expediente/"+id_tipo_expediente).then(
            datos => {
                if (!datos.error) {
                    setNombreExpediente(datos.data[0].attributes.nombre);
                    getNombreTipoSubExpediente()
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: FASES ETAPA EVALUACIÓN", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', alert: global.Constants.TIPO_ALERTA.ERROR }); 
                    window.showSpinner(false);
                }
                
            }
        )
    }

    const getNombreTipoSubExpediente = () => {

        GenericApi.getGeneric("administracion/nombre-sub-tipo-expediente/"+id_tipo_expediente+"/"+id_sub_tipo_expediente).then(
            datos => {
                if (!datos.error) {
                    setNombreSubExpediente(datos.data[0].attributes.nombre);
                    setExisteEvaluacion(true);
                    obtenerListaFases();
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: FASES ETAPA EVALUACIÓN", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', alert: global.Constants.TIPO_ALERTA.ERROR }); 
                }
                window.showSpinner(false);
            }
        )
    }

     //Fases
     const obtenerListaFases = () => {
        GenericApi.getAllGeneric('mas-fase-estado/'+global.Constants.ETAPAS.EVALUACION).then(
            datos => {
                if (!datos.error) {
                    setListaTiposFases(datos["data"]);
                    window.showSpinner(false);
                }
                else {
                    window.showModal();
                    window.showSpinner(false);
                }

            }
        )
    }


    const handleDragEnd = (e) => {
        if (!e.destination) return;
        let tempData = Array.from(getListaFases);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        setListaFases(tempData);
    };

    const eliminarFase = (index) => {
        setListaFases(getListaFases.filter((img, i) => i !== index));
    }

    const agregarFase = (index) => {

        let fase = [];

        if(getListaFases.length > 0 && getListaFases[0].id != 0){
            fase = getListaFases;
        }


        setListaFases([]);
        fase.push(
           {
            'type': 'evaluacion_tipo_expediente',
            'attributes':
            {
                'id_fase_actual': index, 
                'nombre_fase_actual': index,
                'id_fase_antecesora': 44,                  
                'nombre_fase_antecesora': index,
            }}
        )
        
        setListaFases([...fase]);

       
        console.log(getListaFases);
    }


    const enviarDatos = () => {
        
        const attributes = [];

        if(getListaFases.length > 0){
            getListaFases.forEach((fase, index) => {
                attributes.push({
                    "id_fase_actual": fase.attributes.id_fase_actual, 
                    "orden": (index + 1),                  
                    "id_tipo_evaluacion": id_tipo_evaluacion,
                    "id_tipo_expediente": id_tipo_expediente,
                    "id_sub_tipo_expediente": id_sub_tipo_expediente,
                })
            });
        }

        const data = {
            "data": {
                "type": "evaluacion_fase",
                "attributes": attributes
            }
        }

        GenericApi.addGeneric("administracion/evaluacion/update-fases",data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: FASES ETAPA EVALUACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/EvaluacionFasesLista',  alert: global.Constants.TIPO_ALERTA.EXITO});
                    window.showSpinner(false);

                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: FASES ETAPA EVALUACIÓN", message: datos.error.toString(), show: true, redirect: '/EvaluacionFasesLista/1/1/6',  alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                    
                }
            }
        )
 
        //console.log("Estoy dentro de mover datos");
        //console.log(attributes);

    }

    const agregarCombinacion = () => {
        
        let combinacion = [];

        combinacion = getListaFases;

        setListaCombinacion([]);

        console.log(combinacion[combinacion.length-1].attributes.id_fase_actual);

        combinacion.push(
            {
                "type": 'evaluacion_tipo_expediente',
                "attributes": {
                    "id_fase_actual": getFase,
                    "id_fase_antecesora": combinacion[combinacion.length-1].attributes.id_fase_actual,
                    "nombre_fase_actual": getListaTipoFases.find(data => data.id == getFase).attributes.nombre,
                    "nombre_fase_antecesora": combinacion[combinacion.length-1].attributes.nombre_fase_actual
                }
            }
        )

        setListaFases([...combinacion]);

        window.showModalAgregarEvaluacionSoloFase(false);

    }

    const componentSelectFase = () => {
        return (
            getListaTipoFases.map((fase, i) => {
                if(!getListaFases.find(data => data.attributes.id_fase_actual == fase.id)){
                    return (
                        <option key={fase.id} value={fase.id}>{fase.attributes.nombre}</option>
                    )
                }
            })
        )
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
                                                            <label htmlFor='fase'>FASE<span className='text-danger'>*</span></label>
                                                            <select className='form-control' id='fase' name='fase' onChange={e => selectChangeFase(e.target.value)}>
                                                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                { getListaFases.length > 0 ? componentSelectFase() : null }
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
  
    return (
        <>
            {<Spinner/>}
            {<ModalGen data={getModalState} />}
            { componentAlertAgregarFase() }
            <Formik
                initialValues={{
                    descripcion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                  
                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                    //(valores);
                }}
            >

                {({ errors }) => (
                    <Form>
                       <div className="w2d_block">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/EvaluacionFasesLista/`}><small>Configuración de fases de la etapa evaluación</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Lista de fases</small></li>
                                </ol>
                            </nav>
                        </div> 

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">ADMINISTRACIÓN :: CONFIGURACIÓN DE FASES DE LA ETAPA EVALUACIÓN PQR</h3>
                            </div>

                            <div className="block-content">
    
                                <div className='text-right'>
                                    <button type="button" className="btn btn-primary" data-toggle="tooltip" data-html="true" title="Registrar" onClick={() => showModalAgregarCombinacionFase()} data-original-title="Consultar Versiones"><span className="fas fa-plus"> </span></button>

                                    <Link to={'/EvaluacionFasesLista'} title='Regresar'>
                                        <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                    </Link>                                            
                                   
                                </div>

                                <div className='row'>

                                    {
                                        getExisteEvaluacion
                                            ?
                                        <div className='block-content'>

                                            <div className="col-md-12">

                                                <div className="alert alert-primary" role="alert">
                                                    <p className="mb-0"><strong>TIPO DE EVALUACIÓN: </strong> {getNombreEvaluacion}</p>
                                                    <p className="mb-0"><strong>TIPO DE EXPEDIENTE: </strong> {getNombreExpediente} - {getNombreSubExpediente}</p> 
                                                </div>

                                            </div>
                                        </div>                                    
                                        :
                                        null
                                    }
                                </div>

                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className="form-group ">

                                        <DragDropContext onDragEnd={handleDragEnd}>

                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                <thead>
                                                    <tr>
                                                        <th width="10%">MOVER</th>
                                                        <th width="10%">No</th>
                                                        <th width="70%">FASE</th>
                                                        <th width="10%">ACCIONES</th>
                                                    </tr>
                                                </thead>

                                                <Droppable droppableId="droppable-1">
                                                   {(provider) => (
                                                        <tbody className="text-capitalize" ref={provider.innerRef} {...provider.droppableProps}>

                                                            {getListaFases.map((linea, index) => (

                                                                <Draggable 
                                                                        key={index} 
                                                                        draggableId={index+""} 
                                                                        index={index}>
                                                                    {(provider) => (
                                                                    <tr {...provider.draggableProps} ref={provider.innerRef} key={index}>
                                                                        <td  {...provider.dragHandleProps}> <i className="fas fa-hand-paper"></i> </td>
                                                                        <td>{ index + 1 }</td>
                                                                        <td>{ linea.attributes.nombre_fase_actual}</td>
                                                                        <td>
                                                                            { getListaFases.length > 1 ? <button type='button' title='Eliminar Rol' className='btn btn-sm btn-danger' onClick={() => eliminarFase(index)}><i className="fas fa-minus-circle"></i></button> : null }
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                                </Draggable>
                                                            
                                                            ))}
                                                            
                                                        </tbody>
                                                     )}
                                                </Droppable>

                                            </table>
                                        </DragDropContext>
                                            

                                        </div>
                                    </div>

                                    <div className="col-md-12 block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => enviarDatos()}>{global.Constants.BOTON_NOMBRE.ACTUALIZAR}</button>
                                    <Link to={'/EvaluacionFasesLista'} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
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


export default EvaluacionFasesDetalle;