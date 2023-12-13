import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import Spinner from '../Utils/Spinner';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';

function PortalConfiguracionTipoInteresado() {

    const [getConfiguracionTipoInteresado, setConfiguracionTipoInteresado] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({
        crear_registro: "/PortalConfiguracionTipoInteresado/Add",
        consultar_registros: "/PortalConfiguracionTipoInteresado",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: 'ADMIN_PortalWeb'
    });

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }

    }

    const columns = [
        {
            name: 'TIPO DE INTERESADO',
            selector: portalConfTipoInte => portalConfTipoInte.attributes.nombre_tipo_interesado,
            sortable: true,
        },
        {
            name: 'NOMBRE',
            selector: portalConfTipoInte => portalConfTipoInte.attributes.nombre_tipo_sujeto_procesal,
            sortable: true,
        },
        {
            name: 'VISUALIZAR EN EL PORTAL WEB',
            selector: portalConfTipoInte => portalConfTipoInte.attributes.permiso_consulta == 1 ? 'SI' : 'NO',
            wrap: true,
            sortable: true,
            //width: '350px'
        },
        {
            name: 'ACCIONES',
            cell: row =>
                <div>
                    <Link to={`${row.id}`} state={{ from: row }}>
                        <button type="button" className="btn btn btn-primary" title='Editar'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                    </Link>
                </div>,
        }
    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarConfiguracionTipoInteresado(1, paganationPerPages);
        }
        fetchData();
    }, []);


    const cargarConfiguracionTipoInteresado = (page, perPage) => {

        GenericApi.getAllGeneric('portal-tipo-interesado').then(
            datos => {
                if (!datos.error) {
                    setConfiguracionTipoInteresado(datos);
                    window.showSpinner(false);
                }
                else {
                    window.showModal();
                    window.showSpinner(false);
                }

            }
        )
    }

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarCiudad(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarCiudad(page, newPerPage);

    }

    return (
        <div>
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Portal Web</small></li>
                        <li className="breadcrumb-item"> <small>Tipos de interesado</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: PORTAL WEB :: TIPOS DE INTERESADO</h3>

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
                                data={getConfiguracionTipoInteresado.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.tipo_sujeto_procesal.nombre)
                                            + quitarAcentos(suggestion.attributes.permiso_consulta)
                                            + (suggestion.attributes.estado == "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(getSeach.toLowerCase())
                                            && (suggestion.attributes.estado == getEstadoLista))) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={getConfiguracionTipoInteresado.data.length}
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

export default PortalConfiguracionTipoInteresado;