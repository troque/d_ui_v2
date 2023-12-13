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

function TipoExpedienteMensajesLista() {

    const [getTipoExpedienteMensajesLista, setTipoExpedienteMensajesLista] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getRoutes, setRoutes] = useState({
        crear_registro: "/TipoExpedienteMensajes/Add",
        consultar_registros: "/TipoExpedienteMensajes",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: 'ADMIN_ProcesoDisciplinario'
    });

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }
    }

    const columns = [
        {
            name: 'TIPO DE EXPEDIENTE',
            selector: tipoExp =>
                <div className='mb-3'>
                    <strong>TIPO DE EXPEDIENTE: </strong>{tipoExp.attributes.tipo_expediente.nombre}<br />
                    <strong>SUB TIPO DE EXPEDIENTE: </strong> {tipoExp.attributes.id_sub_tipo_expediente}<br />
                </div>,
            sortable: true,
            wrap: true,
            width: "400px"
        
        },
        {
            name: 'TEXTO',
            selector: tipoExp => tipoExp.attributes.mensaje,
            sortable: true,
            wrap: true,
            width: "600px"
        },
        {
            name: 'ESTADO',
            selector: tipoExp => (tipoExp.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
        },
        {
            name: 'ACCIONES',
            cell: row =>
                <div>
                    <Link to={`/TipoExpedienteMensajes/${row.id}`} state={{ from: row }}>
                        <button type="button" className="btn btn btn-primary" title='Editar'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                    </Link>
                </div>
        }
    ];

    useEffect(() => {
        async function fetchData() {
            cargarTipoExpedientesMensajes();
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

    const cargarTipoExpedientesMensajes = () => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('mas_tipo_expediente_mensajes').then(
            datos => {
                if (!datos.error) {
                    setTipoExpedienteMensajesLista(datos);
                } else {
                    window.showModal();
                }
                window.showSpinner(false);
            }
        )
    }

    return (
        <div>
            {<InfoErrorApi />}
            {<Spinner />}

            <div className="block block-themed">
                <div className="col-md-12">
                    <div className="bw2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <small>Administrador</small></li>
                                <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>
                                <li className="breadcrumb-item"> <small>Expediente</small></li>
                                <li className="breadcrumb-item"> <small>Mensajes de derecho de petición</small></li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: TIPOS DE MENSAJES POR EXPEDIENTE {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVOS" : "ACTIVOS"}</h3>

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
                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase"
                                columns={columns}
                                data={getTipoExpedienteMensajesLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.mensaje)
                                            + quitarAcentos(suggestion.attributes.tipo_expediente.nombre)
                                            + quitarAcentos(suggestion.attributes.id_sub_tipo_expediente)
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
                                paginationTotalRows={getTipoExpedienteMensajesLista.data.length}
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

export default TipoExpedienteMensajesLista;