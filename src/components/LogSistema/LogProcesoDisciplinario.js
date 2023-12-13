import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import GenericApi from '../Api/Services/GenericApi';
import DocumentoSiriusApi from '../Api/Services/DocumentoSiriusApi';
import '../Utils/Constants';
import Spinner from '../Utils/Spinner';
import { quitarAcentos } from '../Utils/Common';

import ModalGen from '../Utils/Modals/ModalGeneric';

function LogProcesoDisciplinario() {

    const [errorApi, setErrorApi] = useState('');
    const [getSeach, setSeach] = useState('');
    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;

    const [getRespuestaLog, setRespuestaLog] = useState(false);
    const [getLogLista, setLogLista] = useState({ data: [], links: [], meta: [] });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });


    useEffect(() => {
        async function fetchData() {
            cargarLogProcesoDisciplinario()
        }
        fetchData();
    }, []);


    const cargarLogProcesoDisciplinario = () => {

        GenericApi.getGeneric('log-proceso-disciplinario/get-log-etapa/'+procesoDisciplinarioId).then(
            datos =>{
                if (!datos.error) {
                    setLogLista(datos);
                    setRespuestaLog(true);

                    console.log(datos);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "LOG PROCESO DISCIPLINARIO ", message: "OCURRIO UN ERROR AL CARGAR LA INFORMACIÓN DEL LOG.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )

    }

    const handleClicArchivo = (documento_sirius) => {
        if(documento_sirius.uuid_actuacion){
            console.log("Daticos 1")
            descargarDocumentoActuaciones(documento_sirius.uuid, documento_sirius.extension, documento_sirius.nombre_archivo)
        }
        else{
            descargarDocumento(documento_sirius)
            console.log("Daticos 2")
        }
    }

    const descargarDocumento = (documento_sirius) => {
        try {
            window.showSpinner(true);
            let nombre_documento = documento_sirius.nombre_archivo;
            let extension = documento_sirius.extension;
            let es_compulsa = false;

            if (documento_sirius.compulsa == '1') {
                es_compulsa = true;
            }

            const data = {
                "data": {
                    "type": "documeto_sirius",
                    "attributes": {
                        "id_documento_sirius": documento_sirius.uuid,
                        "extension": extension,
                        "es_compulsa": es_compulsa,
                        "radicado": from.radicado,
                        "vigencia": from.vigencia
                    }
                }
            }

            DocumentoSiriusApi.getDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        //console.log(datos.content_type);
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento, extension);
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    const descargarDocumentoActuaciones = (id_documento, extension, nombre_documento) => {

        try {
            window.showSpinner(true)

            // Se genera la peticion para descargar el archivo
            GenericApi.getGeneric("archivo-actuaciones/get-documento/" + id_documento + "/" + extension).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento)
                    } else {
                        setErrorApi(datos.error.toString().toUpperCase())
                        window.showModal(1)
                    }
                    window.showSpinner(false)
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const componentDocumentos = (documentos) => {
        return (
            <>
                {
                    documentos.map((documento, index) => {
                        return (
                            <li class="media py-2">
                                <div class="media-body">
                                <button type='button' title='Descargar documento' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo(documento)}><i className="fas fa-download" data-toggle="tooltip" data-placement="top" title={documento.nombre_archivo}></i></button>
                                { documento.nombre_archivo }
                                </div>
                            </li>
                        )
                    })
                }
            </>
        )
    }

    const DetalleLog = () => {

        if (getLogLista.data != null && typeof (getLogLista.data) != 'undefined') {
            return (

                getLogLista.data.map((log, i) => {
                    return (
                        <li class="timeline-event mb-5 text-uppercase">
                            <div class="timeline-event-icon bg-default">
                                <i className="fas fa-cog"></i>
                            </div>
                            <div class="timeline-event-block block block-rounded block-fx-pop" data-toggle="appear">
                                <div class="block-header block-header-log block-header-default">
                                    <p class="block-title">{log.attributes.nombre_etapa} - {log.attributes.nombre_fase}</p>
                                    <div class="block-options">
                                        <div class="timeline-event-time block-options-item font-size-sm font-w600 text-white">
                                            {log.attributes.fecha_registro}
                                        </div>
                                    </div>
                                </div>
                                <div class="block-content">
                                    <div class="row">
                                        <div class="col-md-8">
                                            <ul class="nav-items push">
                                                <li><span className='txt-green'><strong>{log.attributes.nombre_actividad}</strong></span></li>
                                                <li><span><strong>Registro realizado por: </strong>{log.attributes.nombre_funcionario_registra} de {log.attributes.nombre_dependencia_origen}</span></li>
                                                <li>{log.attributes.tipo_evaluacion!=null?<><strong>Tipo de evaluación: </strong><span>{log.attributes.tipo_evaluacion}</span></>:""}</li>
                                                <li>{log.attributes.observacion_corta!=null?<><span data-toggle="modal" data-target={"#q"+log.id}><strong>OBSERVACIÓN: </strong> {log.attributes.observacion_corta}</span></>:""}</li>
                                                <li>{log.attributes.transferencia!=null?<span className='txt-red'>{log.attributes.transferencia}</span>:""}</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-4">
                                            <ul class="nav-items push">
                                                {componentDocumentos(log.attributes.documentos)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>                      
                    )
                })
            )
        }
    }


    return (
        <>
            <Formik>
                <>
                    <div className="w2d_block">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <small>Log Proceso Disciplinario</small></li>
                            </ol>
                        </nav>
                    </div>
                    <section className="py-5">
                        <ul class="timeline timeline-alt" style={{ margin: '-5px'}}>
                            { DetalleLog() }
                        </ul>
                    </section>
                </>
            </Formik>
        </>
    );
}

export default LogProcesoDisciplinario;