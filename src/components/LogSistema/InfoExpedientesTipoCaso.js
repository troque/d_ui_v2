import React, { useEffect, useState } from 'react';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import '../Utils/Constants';
import DataTable from 'react-data-table-component';
import { quitarAcentos } from '../Utils/Common';
import { Field, Form, Formik } from 'formik';

function InfoExpedientesTipoCaso() {


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
            name: 'Nombre',
            cell: item => <div>
                {item.attributes.nombre_funcionario}</div>,
            selector: item => item.attributes.nombre_funcionario,
            sortable: true,
        },

        {
            name: 'Usuario',
            cell: item => <div>
                {item.attributes.usuario}</div>,
            selector: item => item.attributes.usuario,
            sortable: true,
        },

        {
            name: 'Dependencia',
            cell: item => <div>
                {item.attributes.dependencia}</div>,
            selector: item => item.attributes.dependencia,
            sortable: true,
        },

        {
            name: 'Num. Casos',
            cell: item => <div>
                {item.attributes.num_casos_total}</div>,
            selector: item => item.attributes.num_casos_total,
            sortable: true,
        },

        {
            name: 'Habilitado',
            cell: item => <div>
                {item.attributes.habilitado}</div>,
            selector: item => item.attributes.habilitado,
            sortable: true,
        },

        {
            name: 'Estado',
            cell: item => <div>
                {item.attributes.estado}</div>,
            selector: item => item.attributes.estado,
            sortable: true,
        },

        {
            name: 'Derechos de peticion',
            cell: item => <div>
                {item.attributes.derechos_peticion}</div>,
            selector: item => item.attributes.derechos_peticion,
            sortable: true,
        },

        {
            name: 'Poder preferente',
            cell: item => <div>
                {item.attributes.poder_preferente}</div>,
            selector: item => item.attributes.poder_preferente,
            sortable: true,
        },

        {
            name: 'Queja',
            cell: item => <div>
                {item.attributes.queja}</div>,
            selector: item => item.attributes.queja,
            sortable: true,
        },

        {
            name: 'Tutela',
            cell: item => <div>
                {item.attributes.tutela}</div>,
            selector: item => item.attributes.tutela,
            sortable: true,
        },
      
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

        const data = {
            "data": {
                "type": "log_proceso_disciplinario",
                "attributes": {
                    "": "",
                }
            }
        }
        // console.log("DATA: "+JSON.stringify(data));
        GenericApi.getByDataGeneric('log-proceso-disciplinario/get-casos-por-usuario', data).then(

            datos => {
                if (!datos.error) {
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
                }
                else {
                    //setErrorApi(datos.error.toString())
                    window.showModal()
                    window.showSpinner(false);
                }
                window.showSpinner(false);
            }
        )
    }

    return (

        <div className="block block-themed">
            <div className="block-header">
                <h3 className="block-title"><strong>Informe de procesos asignados</strong></h3>
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
                                    Total de casos
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
                                    Casos Abiertos
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
                                    Casos Cerrados
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
                                    Casos Archivados
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

                        {
                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                            columns={columns}
                            data={getListaReparto.data.filter((suggestion) => {
                                if (getSearch === "") {
                                    return suggestion;
                                } else if (

                                    ((quitarAcentos(suggestion.attributes.nombre_funcionario)
                                        + quitarAcentos(suggestion.attributes.usuario) 
                                        + quitarAcentos(suggestion.attributes.dependencia) 
                                        + quitarAcentos(suggestion.attributes.num_casos_total) 
                                        + quitarAcentos(suggestion.attributes.habilitado) 
                                        
                                        
                                        ))

                                ) {
                                    return suggestion;
                                }
                            })}
                            perPage={perPage}
                            page={pageActual}
                            pagination
                            noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                            paginationTotalRows={getListaReparto.length}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handlePerRowsChange}
                            striped
                            paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                        />
                        }

                    </Form>
                </Formik>
            </div>      
        </div>
    )

}

export default InfoExpedientesTipoCaso;