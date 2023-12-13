import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import DataTable from 'react-data-table-component';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';

function EstadoProcesoDiciplinarioLista() {
    const [EstadoProcesoDiciplinarioLista, setEstadoProcesoDiciplinarioLista] = useState({ data: [] });
    const [EstadoProcesoDiciplinarioListaTotal, setEstadoProcesoDiciplinarioListaTotal] = useState({ data: [], links: [], meta: [] });
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    
    const [getRoutes, setRoutes] = useState({

        crear_registro: "/EstadoProcesoDiciplinario/Add",
        consultar_registros: "/EstadoProcesoDiciplinario",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
    });

    const handleCallback = (childData) => {
        try {
       
            setEstadoLista(childData)
        } catch (error) {

        }

    }

    const columns = [
        {
            name: 'NOMBRE',
            selector: EstadoProcesoDiciplinario => EstadoProcesoDiciplinario.attributes.nombre.toUpperCase(),
            sortable: true,
            width: "30%"
        },
        {
            name: 'ESTADO',
            selector: EstadoProcesoDiciplinario => (EstadoProcesoDiciplinario.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
        },
        {
            name: 'ACCIONES',


            cell: row => <div><Link to={`${row.id}`}>
                <button type="button" className="btn btn btn-primary" title='Editar'>
                    <i className="fa fa-fw fa-edit"></i>
                </button>
            </Link></div>
        }
    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            GenericApi.getAllGeneric('mas-estado-proceso-disciplinario').then(
                datos => {
                    if (!datos.error) {
                        setEstadoProcesoDiciplinarioLista(datos);                        
                    }
                    else{
                        window.showModal()
                    }
                    window.showSpinner(false);
                }
            )
        }
        fetchData();
    }, []);

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarFormatos(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        // window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //  cargarFormatos(page, newPerPage);

    }

    return (
        <div>
            {<InfoErrorApi />}
            {<Spinner />}

            <div className="block block-themed">
                <div className="col-md-12">
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <small>Administrador</small></li>
                                <li className="breadcrumb-item"> <small>Otros</small></li>
                                <li className="breadcrumb-item"> <small>Estado de procesos disciplinarios</small></li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="block-header">
                    <h3 className="block-title">ADMINSITRACIÓN :: ESTADO DE PROCESOS DISCIPLINARIOS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? " INACTIVOS" : " ACTIVOS"}</h3>

                </div>
                <div className="block-content">
                    <div className='row'>
                        <div className='col-md-3'>
                        <div className="form-group ">
                                <input type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                            </div>
                        </div>
                        <ListaBotones getRoutes={getRoutes} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />

                    </div>
                    <div className="row">
                        <div className="col-sm-12">

                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                columns={columns}
                                data={EstadoProcesoDiciplinarioLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (

                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre)
                                            + (suggestion.attributes.estado == "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase()))
                                            && (suggestion.attributes.estado == getEstadoLista))

                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={EstadoProcesoDiciplinarioLista.data.length}
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
        </div>
    )
}

export default EstadoProcesoDiciplinarioLista;