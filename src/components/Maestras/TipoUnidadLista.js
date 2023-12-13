import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';

function TipoUnidadLista() {

    const [getTipoUnidadLista, setTipoUnidadLista] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getRoutes, setRoutes] = useState({
        crear_registro: "/TipoUnidad/Add",
        consultar_registros: "/TipoUnidad",
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
            selector: tipoUnidad =>
                <div className='mb-3'>
                    {tipoUnidad.attributes.nombre}
                </div>,
            sortable: true,
            width: "25%"
        },
        {
            name: 'INFORMACIÓN GENERAL',
            selector: tipoUnidad =>
                <div className='mb-3'>
                    <strong>DESCRIPCIÓN: </strong> {tipoUnidad.attributes.descripcion_unidad}<br />
                    <strong>CÓDIGO: </strong>{tipoUnidad.attributes.codigo_unidad}<br />
                    <strong>ESTADO: </strong> {validarEstado(tipoUnidad.attributes.estado).toUpperCase()}<br />
                </div>,
            sortable: true,
            width: "30%"
        },
        {
            name: 'INFORMACIÓN DE DEPENDENCIA',
            selector: tipoUnidad =>
                <div className='mb-3'>
                    <strong>NOMBRE: </strong>{tipoUnidad.attributes.dependencia.nombre}<br />
                    <strong>ESTADO: </strong> {validarEstado(tipoUnidad.attributes.dependencia.estado).toUpperCase()}<br />
                </div>,
            sortable: true,
            width: "30%"
        },
        {
            name: 'ACCIONES',
            cell: row =>
                <div>
                    <Link to={`/TipoUnidad/${row.id}`} state={{ from: row }}>
                        <button type="button" className="btn btn btn-primary" title='Editar'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                    </Link>
                </div>
        }
    ];

    useEffect(() => {
        async function fetchData() {
            cargarTipoUnidades();
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

    const cargarTipoUnidades = () => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('mas_tipo_unidad').then(
            datos => {
                if (!datos.error) {
                    setTipoUnidadLista(datos);
                } else {
                    window.showModal();
                }
                window.showSpinner(false);
            }
        )
    }

    const validarEstado = (estado) => {
        // Se valida el tipo de estado
        if (estado == "1") {
            return "Activo";
        } else {
            return "Inactivo";
        }
    }

    return (

        
        <div className="block block-rounded">
            {<InfoErrorApi />}
            {<Spinner />}

            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Carátula</small></li>
                        <li className="breadcrumb-item"> <small>Tipos de unidad</small></li>
                    </ol>
                </nav>
            </div>


            <div className="block block-themed">
                <div className="col-md-12">
                    <div className="block-content">
                       
                    </div>
                </div>
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: CARÁTULAS :: LISTA DE TIPOS DE UNIDAD {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVOS" : "ACTIVOS"}</h3>

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
                                data={getTipoUnidadLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre)
                                            + quitarAcentos(suggestion.attributes.descripcion_unidad)
                                            + quitarAcentos(suggestion.attributes.dependencia.nombre)
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
                                paginationTotalRows={getTipoUnidadLista.data.length}
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

export default TipoUnidadLista;