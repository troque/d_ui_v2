import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import Spinner from '../Utils/Spinner';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';

function SemaforosLista() {
    const [getSemaforosLista, setSemaforosLista] = useState({ data: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({

        crear_registro: "/semaforos/Add",
        consultar_registros: "/semaforos",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: 'ADMIN_Actuaciones'
    });

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarListaSemaforos(1, paganationPerPages);
        }
        fetchData();
    }, []);

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }

    }

    const columns = [
        {
            name: 'NOMBRE',
            selector: semaforo => (semaforo?.attributes?.nombre?.toUpperCase()),
            wrap: true,
            sortable: true,
            width: '400px'
            //width: '40%'
        },        
        {
            name: 'ETAPA',
            selector: semaforo => (semaforo?.attributes?.etapa?.nombre?.toUpperCase()),
            wrap: true,
            sortable: true,
            width: '300px'
        },
        {
            name: 'EVENTO DEL INICIO',
            selector: semaforo => (semaforo?.attributes?.id_mas_evento_inicio?.nombre?.toUpperCase()),
            wrap: true,
            sortable: true,
            width: '300px'
        },
        {
            name: 'ACTUACIÓN QUE INICIA UN SEMÁFORO',
            selector: semaforo => (semaforo?.attributes?.id_mas_actuacion_inicia != null ? semaforo?.attributes?.id_mas_actuacion_inicia?.nombre_actuacion?.toUpperCase() : ""),
            wrap: true,
            sortable: true,
            width: '300px'
        },
        {
            name: 'GRUPO DE TRABAJO QUE INICIA UN SEMÁFORO',
            selector: semaforo => (semaforo?.attributes?.id_mas_grupo_trabajo_inicia != null ? semaforo?.attributes?.id_mas_grupo_trabajo_inicia?.nombre?.toUpperCase() : ""),
            wrap: true,
            sortable: true,
            width: '300px'
        },
        {
            name: 'NOMBRE DEL CAMPO FECHA',
            selector: semaforo => (semaforo?.attributes?.nombre_campo_fecha?.toUpperCase()),
            sortable: true,
            wrap: true,
            width: '400px'
        },
        {
            name: 'ESTADO',
            selector: semaforo => (semaforo.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
            //width: "10%"
        },
        {
            name: 'CREADO',
            selector: semaforo => (semaforo.attributes.created_at),
            sortable: true,
            width: "10%"
        },
        {
            name: 'ACCIONES',
            cell: semaforo => 
            <div>
                <Link to={`${semaforo.id}`} state={{ from: semaforo }}>
                    <button type="button" className="btn btn btn-primary" title='Editar'>
                        <i className="fa fa-fw fa-edit"></i>
                    </button>
                </Link>
            </div>,
            //width: "10%"
        }
    ];  

    const cargarListaSemaforos = (page, perPage) => {
        GenericApi.getAllGeneric('semaforo').then(
            datos => {
                if (!datos.error) {
                    setSemaforosLista(datos);
                }
                window.showSpinner(false);
            }
        )
    }

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);

    }

    console.log(getSemaforosLista);

    return (
        <div>
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Actuaciones</small></li>
                        <li className="breadcrumb-item"> <small>Semaforización</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: LISTA DE SEMÁFOROS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVOS" : "ACTIVOS"}</h3>
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

                                data={getSemaforosLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        (
                                            (
                                                quitarAcentos(suggestion.attributes.nombre)
                                                + quitarAcentos(suggestion.attributes.nombre_campo_fecha)
                                                + quitarAcentos(suggestion.attributes.id_mas_evento_inicio.nombre)
                                                + (suggestion.attributes.id_mas_actuacion_inicia != null ? quitarAcentos(suggestion.attributes.id_mas_actuacion_inicia.nombre_actuacion) : null)
                                                + (suggestion.attributes.estado == "1" ? 'Activo' : 'Inactivo')

                                            ).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase()))
                                            
                                            && (suggestion.attributes.estado == getEstadoLista))
                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={getSemaforosLista.data.length}
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

export default SemaforosLista;