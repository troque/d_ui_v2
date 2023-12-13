import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom'
import LogApi from '../Api/Services/LogApi';
import moment from 'moment';
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import GenericApi from '../Api/Services/GenericApi';
import { getUser } from '../../components/Utils/Common';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';

function LogProcesosAsignados() {

    const [errorApi, setErrorApi] = useState('');
    const [getSeach, setSeach] = useState('');

    const [getRespuestaLog, setRespuestaLog] = useState(false);
    const [getLogLista, setLogLista] = useState({ data: [], links: [], meta: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getNombreUsuario, setNombreUsuario] = useState("");


    const columns = [

        {
            name: 'Id',
            selector: log => log.id,
            sortable: true,
            width: "25%"
        },

        {
            name: 'Fecha',
            selector: log => log.attributes.created_at,
            sortable: true,
            width: "20%"
        },

        {
            name: 'Etapa',
            selector: log => log.attributes.etapa.nombre,
            sortable: true,
            width: "20%"
        },

        {
            name: 'Radicado',
            selector: log => (log.proceso_disciplinario == null ? '' : log.proceso_disciplinario.radicado),
            sortable: true,
            width: "20%"
        },
        {
            name: 'Funcionario Asignado',
            selector: log => log.attributes.id_funcionario_asignado,
            sortable: true,
            width: "20%"
        },

    ];

    ///////////////////////////////////////////////////////////
    /////////////////// PARA LA BÚSQUEDA //////////////////////
    ///////////////////////////////////////////////////////////

    const [getLista, setLista] = useState({ data: [], links: [], meta: [] });
    const [getListaTotal, setListaTotal] = useState({ data: [], links: [], meta: [] });

    /* */

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarLogProcesoDisciplinario(page, perPage, '1');
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarLogProcesoDisciplinario(page, newPerPage, '1');

    }


    useEffect(() => {
        async function fetchData() {

            setNombreUsuario(getUser().nombre);

            // console.log("NOMBRE DE USUARIO: "+getUser().nombre);
            cargarProcesosAsignados(1, paganationPerPages, "1");

        }
        fetchData();
    }, []);


    const cargarProcesosAsignados = (page, perPage, estado) => {

        const data = {
            "data": {
                "type": "cierre_etapa",
                "attributes": {
                    "id_proceso_disciplinario": "id_proceso_disciplinario",
                    "id_etapa": "1",
                    "created_user": getUser().nombre,
                    'per_page': perPage,
                    'current_page': page
                }
            }
        }

        GenericApi.getByDataGeneric('cierre-etapa/procesos-diciplinario-asignados/', data).then(
            datos => {
                if (!datos.error) {
                    // console.log(datos);
                    setLogLista(datos);
                    window.showSpinner(false);
                }
                else {
                    window.showSpinner(false);
                    window.showModal(1);
                }
            }
        )
    }


    return (
        <>
            <Formik>
                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title">Log Proceso disciplinario :: </h3>
                    </div>
                    <div className="block-content">

                        <div className='row'>

                            <div className='col-md-3'>
                                <div className="form-group ">
                                    <Field type="text" id="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} name="search" className="form-control border border-success" placeholder="Buscar" />
                                </div>
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

                                            ((quitarAcentos(suggestion.attributes.etapa.nombre)).toLowerCase().includes(getSeach.toLowerCase()))

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
                                />
                            </div>
                           
                        </div>
                    </div>
                </div>
            </Formik>
        </>
    );
}

export default LogProcesosAsignados;