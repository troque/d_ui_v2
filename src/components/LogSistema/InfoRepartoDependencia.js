import React, { useEffect, useState } from 'react';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import '../Utils/Constants';
import DataTable from 'react-data-table-component';
import { quitarAcentos } from '../Utils/Common';
import { Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import Spinner from '../Utils/Spinner';


function InfoRepartoDependencia() {

    const [getRtaReparto, setRtaReparto] = useState(false);
    const [getListaReparto, setListaReparto] = useState({ data: [], links: [], meta: [] });
    const [getSearch, setSearch] = useState('');
    const paganationPerPages = process.env.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(process.env.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);

    const [getTotalCasos, setTotalCasos] = useState();
    const [getTotalActivos, setTotalActivos] = useState();
    const [getTotalInactivos, setTotalInactivos] = useState();
    const [getTotalArchivados, setTotalArchivados] = useState();

    const columns = [
        {
            name: 'NOMBRE',
            cell: item => <div>
                {item.attributes.nombre_funcionario}</div>,
            selector: item => item.attributes.nombre_funcionario,
            wrap: true,
            sortable: true,
            width: '200px'
        },

        {
            name: 'DEPEDENCIA',
            cell: item => <div>
                {item.attributes.dependencia}</div>,
            selector: item => item.attributes.dependencia,
            wrap: true,
            sortable: true,
            width: '200px'
        },

        {
            name: 'NUM. CASOS',
            cell: item => <div>
                {item.attributes.num_casos_total}</div>,
            selector: item => item.attributes.num_casos_total,
            wrap: true,
            sortable: true,
            width: '150px'
        },

        {
            name: 'HABILITADO PARA RECIBIR PROCESOS',
            cell: item => <div>
                {item.attributes.habilitado}</div>,
            selector: item => item.attributes.habilitado,
            wrap: true,
            sortable: true,
            width: '300px'
        },

        {
            name: 'ESTADO',
            cell: item => <div>
                {item.attributes.estado}</div>,
            selector: item => item.attributes.estado,
            sortable: true,
        },

        {
            name: 'DERECHOS DE PETICIÓN',
            cell: item => <div>
                {item.attributes.derechos_peticion}</div>,
            selector: item => item.attributes.derechos_peticion,
            wrap: true,
            sortable: true,
            width: '200px'
        },

        {
            name: 'PODER PREFERENTE',
            cell: item => <div>
                {item.attributes.poder_preferente}</div>,
            selector: item => item.attributes.poder_preferente,
            wrap: true,
            sortable: true,
            width: '200px'
        },

        {
            name: 'QUEJA',
            cell: item => <div>
                {item.attributes.queja}</div>,
            selector: item => item.attributes.queja,
            wrap: true,
            sortable: true,
            width: '200px'
        },

        {
            name: 'TUTELA',
            cell: item => <div>
                {item.attributes.tutela}</div>,
            selector: item => item.attributes.tutela,
            wrap: true,
            sortable: true,
            width: '200px'
        },

        {
            name: 'ACCIONES',
            cell: item => <div className='row'>               
                <Link to={`/InfoDetalleUsuario/${item.attributes.usuario}`}>
                    <button type="button" className="btn btn btn-primary" title='Consultar'><i className="fa fa-search"></i></button>
                </Link>               
            </div>
        }
      
    ];

    useEffect(() => {
        async function fetchData() {
            casosAsignados();
        }
        fetchData();
    }, []);

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    const casosAsignados = () => {

        window.showSpinner(true);

        const data = {
            "data": {
                "type": "log_proceso_disciplinario",
                "attributes": {
                    "": "",
                }
            }
        }

        GenericApi.getByDataGeneric('log-proceso-disciplinario/get-casos-por-usuario', data).then(
            datos => {
                if (!datos.error) {
                    console.log(datos);
                    setListaReparto(datos);
                    setRtaReparto(true);
                    totalCasos();

                }
                else {
                    window.showSpinner(false);
                }
            }
        )
    }

    const totalCasos = () => {

        const data = {
            "data": {
                "type": "log_proceso_disciplinario",
                "attributes": {
                    "": "",
                }
            }
        }

        GenericApi.getByDataGeneric('log-proceso-disciplinario/get-reparto-casos', data).then(

            datos => {
                if (!datos.error) {
                    setTotalCasos(datos.data.total);
                    setTotalActivos(datos.data.activos);
                    setTotalInactivos(datos.data.cerrados);
                    setTotalArchivados(datos.data.archivados);  
                    window.showSpinner(false);  
                }else{
                    window.showSpinner(false);
                }
            }
        )
    }

    return (
        <>
            {<Spinner />}
            <div className="block block-themed">

                <div className="col-md-12">
                    <div className="block-content">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">  
                                <li className="breadcrumb-item"> <small>Informe general</small></li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="block-header">
                    <h3 className="block-title"><strong>ADMINISTRACIÓN :: INFORME GENERAL</strong></h3>
                </div>

                <div className="block-content">

                    <div className="row">

                        <div className="col-md-6 col-xl-3">
                            <div  className="block block-rounded block-link-shadow bg-primary">
                                <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                    <div>
                                        <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                    </div>
                                    <div className="ml-3 text-right">
                                        <p className="text-white font-size-h3 font-w300 mb-0">
                                        {getTotalCasos}
                                        </p>
                                        <p className="text-white-75 mb-0">
                                            TOTAL DE CASOS
                                        </p>
                                    </div>
                                </div>
                            </div >
                        </div>

                        <div className="col-md-6 col-xl-3">
                            <div  className="block block-rounded block-link-shadow bg-primary">
                                <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                    <div>
                                        <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                    </div>
                                    <div className="ml-3 text-right">
                                        <p className="text-white font-size-h3 font-w300 mb-0">
                                            {getTotalActivos}
                                        </p>
                                        <p className="text-white-75 mb-0">
                                            CASOS ABIERTOS
                                        </p>
                                    </div>
                                </div>
                            </div >
                        </div>

                        <div className="col-md-6 col-xl-3">
                            <div  className="block block-rounded block-link-shadow bg-primary">
                                <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                    <div>
                                        <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                    </div>
                                    <div className="ml-3 text-right">
                                        <p className="text-white font-size-h3 font-w300 mb-0">
                                            {getTotalInactivos}
                                        </p>
                                        <p className="text-white-75 mb-0">
                                            CASOS CERRADOS
                                        </p>
                                    </div>
                                </div>
                            </div >
                        </div>

                        <div className="col-md-6 col-xl-3">
                            <div  className="block block-rounded block-link-shadow bg-primary">
                                <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                    <div>
                                        <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                    </div>
                                    <div className="ml-3 text-right">
                                        <p className="text-white font-size-h3 font-w300 mb-0">
                                            {getTotalArchivados}
                                        </p>
                                        <p className="text-white-75 mb-0">
                                            CASOS ARCHIVADOS
                                        </p>
                                    </div>
                                </div>
                            </div >
                        </div>

                    </div>

                    <Formik>
                        <Form>
                            <div className='col-md-3'>
                                <div className="form-group ">
                                    <Field type="text" id="search" value={getSearch} onChange={e => setSearch(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} name="search" className="form-control border border-success" placeholder="Buscar" />
                                </div>
                            </div>

                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                columns={columns}
                                data={getListaReparto.data.filter((suggestion) => {
                                    if (getSearch === "") {
                                        return suggestion;
                                    } else if (

                                        (
                                            (
                                                quitarAcentos(suggestion.attributes.nombre_funcionario)
                                                + quitarAcentos(suggestion.attributes.usuario) 
                                                + quitarAcentos(suggestion.attributes.dependencia) 
                                                + quitarAcentos(suggestion.attributes.derechos_peticion) 
                                                + quitarAcentos(suggestion.attributes.estado) 
                                                + quitarAcentos(suggestion.attributes.num_casos_total) 
                                                + quitarAcentos(suggestion.attributes.habilitado)
                                                + quitarAcentos(suggestion.attributes.poder_preferente)
                                                + quitarAcentos(suggestion.attributes.queja)
                                                + quitarAcentos(suggestion.attributes.tutela)
                                            ).toLowerCase().includes(quitarAcentos(getSearch.toLowerCase()))
                                        )

                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                paginationTotalRows={getListaReparto.data.length}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handlePerRowsChange}
                                striped
                                paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                defaultSortAsc={false}
                            />
                            
                        </Form>
                    </Formik>
                </div>      
            </div>
        </>
    )

}

export default InfoRepartoDependencia;