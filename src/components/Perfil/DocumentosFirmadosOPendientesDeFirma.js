
import React, { useEffect , useState } from "react";
import Spinner from '../Utils/Spinner';
import { Link } from "react-router-dom";
import { getUser , quitarAcentos } from '../Utils/Common';
import GenericApi from '../Api/Services/GenericApi';
import '../Utils/Constants';
import ModalGen from '../Utils/Modals/ModalGeneric';
import InfoErrorApi from '../Utils/InfoErrorApi';
import DataTable from 'react-data-table-component';
import { Field, Form, Formik } from 'formik';

function DocumentosFirmadosOPendientesDeFirma() {

    const [getListaFirmasMecanicas, setListaFirmasMecanicas] = useState({ data: [], links: [], meta: [] }); 
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [errorApi, setErrorApi] = useState('');
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(process.env.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);


    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            getDocumentos(); 
        }
        fetchData();
    }, []);

    
    const getDocumentos = () => {
        GenericApi.getGeneric('actuaciones/get-documentos-pendientes-de-firma/' + getUser().id).then(
            datos => {
    
                if (!datos.error) {
                    if (datos.data.length > 0) {
                        setListaFirmasMecanicas(datos);
                    }
                }
                window.showSpinner(false);
            }
        )
    }

    const handleDownloadArchivo = (uuid_actuacion) => {
        try {
            window.showSpinner(true);
             // Buscamos el detalle de los documentos
            GenericApi.getGeneric("archivo-actuaciones/get-archivo-actuaciones-by-uuid/" + uuid_actuacion).then(
                datos => {
                    if (!datos.error) {
                        if (datos.data.length > 0) {
                            handleDownloadArchivo2(datos.data[0]);
                        }
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    const handleDownloadArchivo2 = (getArchivosListaSearch) => {
        try {
            GenericApi.getGeneric("archivo-actuaciones/get-documento/" + getArchivosListaSearch.attributes.id + "/" + getArchivosListaSearch.attributes.extension).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, getArchivosListaSearch.attributes.nombre_archivo);
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const columns = [
        {
            name: 'PROCESO DISCIPLINARIO',
            cell: documento =>
                <div>
                    <strong>RADICADO: </strong>{documento.attributes.radicado} - {documento.attributes.vigencia}<br/>                
                    <strong>FECHA: </strong>{documento.attributes.fecha_creacion}<br/>
                </div>
            ,
            selector: documento => documento.attributes.radicado,
            sortable: true,
        },

        {
            name: 'ACTUACIÓN',
            cell: documento =>
                <div>
                    <strong>NOMBRE: </strong>{documento.attributes.nombre_actuacion.toUpperCase()}<br/>  
                    <strong>ETAPA: </strong>{documento.attributes.etapa.toUpperCase()}<br/>  
                </div>
            ,
            selector: documento => documento.attributes.nombre_actuacion,
            sortable: true,
        },

        {
            name: 'USUARIO QUE SOLICITA LA FIRMA',
            cell: documento =>
                <div>
                   {documento.attributes.usuario_solicita_firma.toUpperCase()}<br/>
                </div>
            ,
            selector: documento => documento.attributes.usuario_solicita_firma,
            sortable: true,
        },

        {
            name: 'TIPO DE FIRMA',
            cell: documento =>
                <div>
                   {documento.attributes.tipo_firma.toUpperCase()}<br/>
                </div>
            ,
            selector: documento => documento.attributes.tipo_firma,
            sortable: true,
        },
    
        {
            name: 'ACCIONES',
            width: "15%",
            cell: documento => (
                <>
                <button type='button' title={documento.attributes.documento_ruta? documento.attributes.documento_ruta.slice(19) : null} className='btn btn-sm btn-primary' onClick={() => handleDownloadArchivo(documento.attributes.id_actuacion)}><i className="fas fa-download"></i> </button>
                <Link className="btn btn-sm btn-primary" to="/FirmaActuaciones" state={{FirmaActuacion: documento }}>
                    <span className="nav-main-link-name">FIRMAR</span>
                </Link>    
                </>              
                )
        }
    ];

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            {<InfoErrorApi error={errorApi} />}
            <Formik>
                <Form>
                    <div className="w2d_block">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"><Link underline="hover" className="text-dark" to={`/Perfil`}><small>Perfil</small></Link></li>
                                <li className="breadcrumb-item"><small> Documentos pendientes de firma</small></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="row">
                        <div className="col-md-12"> 
                            <div className="block block-themed">
                                <div className="block-header">
                                    <h3 className="block-title">DOCUMENTOS PENDIENTE DE FIRMA</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row">
                                        <div className='col-md-3'>
                                            <div className="form-group ">
                                                <Field type="text" id="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} name="search" className="form-control border border-success" placeholder="Buscar" />
                                            </div>
                                        </div>                                        
                                    </div>
                                    <div className="row">
                                        <div className='col-md-12 mt-2 mb-2'>
                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columns}
                                                data={getListaFirmasMecanicas.data.filter((suggestion) => {
                                                    // console.log(getListaFirmasMecanicas);
                                                    if (getSeach === "") {
                                                        return suggestion;
                                                    } else if (

                                                        ((quitarAcentos(suggestion.attributes.radicado)
                                                        + quitarAcentos(suggestion.attributes.vigencia) 
                                                        + quitarAcentos(suggestion.attributes.fecha_creacion) 
                                                        + quitarAcentos(suggestion.attributes.usuario_solicita_firma)                                                         
                                                        ).toLowerCase().includes(getSeach.toLowerCase()))

                                                    ) {
                                                        return suggestion;
                                                    }
                                                })}
                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                                paginationTotalRows={getListaFirmasMecanicas.data.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </div>
                </Form>
            </Formik>
        </>
    )

}

export default DocumentosFirmadosOPendientesDeFirma;