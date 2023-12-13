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
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getListaDocumentos, setListaDocumentos] = useState({ data: [], links: [], meta: [] });

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const columns = [

        {
            name: 'ETAPA',
            selector: log =>
                <div>
                    <strong>ETAPA: </strong>{log.attributes.etapa.nombre}<br />
                    <strong>FECHA: </strong>{log.attributes.created_at}<br />
                </div>,
            sortable: true,
        },
        {
            name: 'FUNCIONARIO QUE REGISTRO EL PROCESO',
            cell: log => <div>
                <strong>FUNCIONARIO: </strong>{log.attributes.funcionario_registra.nombre.toUpperCase()} {log.attributes.funcionario_registra.apellido.toUpperCase()}<br />
                <strong>DEPENDENCIA: </strong>{log.attributes.dependencia_origen.nombre}
                </div>,
            sortable: true,
            selector: log => log.attributes.funcionario_registra.name,
        },
        {
            name: 'FUNCIONARIO ACTUAL',
            cell: log => <div>
                <strong>FUNCIONARIO: </strong> {log.attributes.funcionario_asignado != null ? log.attributes.funcionario_asignado.nombre.toUpperCase() : null} {log.attributes.funcionario_asignado != null ? log.attributes.funcionario_asignado.apellido.toUpperCase() : null}<br />
                <strong>DEPENDENCIA: </strong>{log.attributes.funcionario_asignado != null ? log.attributes.dependencia_origen.nombre : null}</div>,
            sortable: true,
            selector: log => log.attributes.funcionario_registra.name,
        },


        {
            name: 'ESTADO DEL TRAMITE',
            cell: log => 
                <div title={log.attributes.descripcion}>
                    <span className="nav-main-link-badge badge badge-pill badge-success"> {log.attributes.tipo_trasaccion != null ? log.attributes.tipo_trasaccion.nombre.toUpperCase() : null}</span>&nbsp;
                    <span className="nav-main-link-badge badge badge-pill badge-success"> {log.attributes.tipo_trasaccion != null ? log.attributes.estado_etapa.nombre : null}</span><br />
                    {log.attributes.descripcion_corta}
                </div>,
            sortable: true,    
            selector: log => log.attributes.descripcion,            
        },
    ];

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
    }

    useEffect(() => {
        async function fetchData() {
            cargarLogProcesoDisciplinario(1, paganationPerPages, "1")
        }
        fetchData();
    }, []);

    const cargarLogProcesoDisciplinario = (page, perPage, estado) => {

        const data = {
            "data": {
                "type": "log_etapa",
                "attributes": {
                    "descripcion": "descripcion",
                    "id_etapa": "fecha_registro",
                    "id_fase": "id_dependencia",
                    "id_proceso_disciplinario": "id_proceso_disciplinario",
                    "id_tipo_log": "id_tipo_log",
                    "id_estado": "id_estado",
                    "created_user": "created_user",
                    "id_dependencia_origen": "id_dependencia_origen",
                    'per_page': perPage,
                    'current_page': page
                }
            }
        }

        GenericApi.getByDataGeneric('log-proceso-disciplinario/get-log-etapa/' + procesoDisciplinarioId, data).then(
            datos => {
                if (!datos.error) {
                    setLogLista(datos);
                    setRespuestaLog(true);
                } else {
                    window.showModal(1);
                }
            }
        )

    }


    const documentosAsociados = (data) => {

        //window.showSpinner(true);

        // console.log("data.data.id -> ", data.data.id);

        GenericApi.getByDataGeneric('log-proceso-disciplinario/get-documentos/' + data.data.id, data).then(
            datos => {
                if (!datos.error) {
                    try {
                        if (datos.data.length > 0) {
                            setListaDocumentos(datos);
                        }
                    } catch (error) {
                        setListaDocumentos(null);
                    }
                } else {
                    setModalState({ title: "Log del proceso disciplinario", message: datos.error.toString(), show: true, redirect: '/LogProcesoDisciplinario', from: { from } });
                }
                // window.showSpinner(false);
            }
        )



        return (
            <>
                <ModalGen data={getModalState} />

                <br />
                <div className="block block-rounded">
                    <div className="block-header block-header-default">
                        <h3 style={{ fontSize: '18px' }} >DOCUMENTOS ANEXOS</h3>
                    </div>
                    <div className="block-content">

                        <table className="table table-bordered table-vcenter">
                            <thead>
                                <tr>
                                    <th>FECHA</th>
                                    <th>ETAPA</th>
                                    <th>FASE</th>
                                    <th>RESGITRADO POR</th>
                                    <th>DESCRIPCIÓN</th>
                                    <th>DESCARGAR DOCUMENTO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableDocumentos()}
                            </tbody>
                        </table>

                    </div>
                </div>
            </>
        )

    }


    const tableDocumentos = () => {

        // console.log("getListaDocumentos -> ", getListaDocumentos);

        return (
            getListaDocumentos.data.map((aux, i) => {
                return (
                    <tr key={aux.id}>
                        <td>{aux.attributes.created_at}</td>
                        <td>{aux.attributes.etapa.nombre}</td>
                        <td>{aux.attributes.fase.nombre}</td>
                        <td>{aux.attributes.nombre_completo}</td>
                        <td>{aux.attributes.descripcion}</td>
                        <td>{aux.attributes.nombre_archivo}</td>
                        <td>
                            <button type='button' title='Descargar documento' className='btn btn-sm btn-primary'
                                onClick={() => handleClicArchivo(aux)}><i className="fas fa-download"></i>
                            </button>
                        </td>
                    </tr>
                )
            })
        )
    }


    function downloadBase64File(contentType, base64Data, fileName, extension) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName + "." + extension;
        downloadLink.click();
    }

    const handleClicArchivo = (documento_sirius) => {
        try {
            let nombre_documento = documento_sirius.id;
            let extension = documento_sirius.attributes.extension;
            let es_compulsa = false;

            if (documento_sirius.attributes.compulsa) {
                es_compulsa = true;
            }

            const data = {
                "data": {
                    "type": "documeto_sirius",
                    "attributes": {
                        "radicado": radicado,
                        "vigencia": vigencia,
                        "id_documento_sirius": nombre_documento,
                        "extension": extension,
                        "es_compulsa": es_compulsa
                    }
                }
            }

            DocumentoSiriusApi.getDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        //console.log(datos.content_type);
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento, extension);
                    } else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    };


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

                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title">LOG PROCESO DISCIPLINARIO :: {radicado} - {vigencia} </h3>
                    </div>
                    <div className="block-content">
                        <div className='row'>
                            <div className='col-md-3'>
                                <div className="form-group ">
                                    <Field type="text" id="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} name="search" className="form-control border border-success" placeholder="Buscar" />
                                </div>
                            </div>
                            <div  className='col-md-9 text-right'>
                                <Link to={`/MisPendientes/`} title='Regresar a mis pendientes' state={{ from: from }}>
                                    <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                </Link>
                            </div>
                        </div>

                        <div className='col-md-12'>
                            <div className='col-md-12 mt-2 mb-2'>
                                <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                    columns={columns}
                                    data={getLogLista.data.filter((suggestion) => {
                                        if (getSeach === "") {
                                            return suggestion;
                                        } else if (

                                            (( quitarAcentos(suggestion.attributes.descripcion)
                                                + quitarAcentos(suggestion.attributes.nombre_completo) + quitarAcentos(suggestion.attributes.nombre_dependencia) +
                                                quitarAcentos(suggestion.attributes.fecha_creado) + quitarAcentos(suggestion.attributes.etapa.nombre) +
                                                quitarAcentos(suggestion.attributes.funcionario_registra.nombre) + quitarAcentos(suggestion.attributes.funcionario_registra.apellido) +
                                                quitarAcentos(suggestion.attributes.funcionario_asignado.nombre) + quitarAcentos(suggestion.attributes.funcionario_asignado.apellido) +
                                                quitarAcentos(suggestion.attributes.estado) + quitarAcentos(suggestion.attributes.fecha_registro)).toLowerCase().includes(getSeach.toLowerCase()))

                                        ) {
                                            return suggestion;
                                        }
                                    })}
                                    perPage={perPage}
                                    page={pageActual}
                                    pagination
                                    noDataComponent="Sin datos"
                                    paginationTotalRows={getLogLista.data.length}
                                    onChangePage={handlePageChange}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    defaultSortFieldId="Nombre"
                                    striped
                                    paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                    defaultSortAsc={false}
                                    expandableRows expandableRowsComponent={documentosAsociados}
                                />
                            </div>

                        </div>
                    </div>
                </div>
                </>
            </Formik>
        </>
    );
}

export default LogProcesoDisciplinario;