import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';
import ModalInfo from '../Utils/Modals/ModalInformacion';

function OrigenRadicadoLista() {
    const [origenRadicadoListaLista, setOrigenRadicadoListaLista] = useState({ data: [] });
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });
    const [getRoutes, setRoutes] = useState({

        crear_registro: "/OrigenRadicado/Add",
        consultar_registros: "/OrigenRadicado",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
    });

    const handleCallback = (childData) => {
        setEstadoLista(childData);
        cargarOrigenRadicadoListaLista(childData);
    }

    const columns = [
        {
            name: 'NOMBRE',
            selector: origen => origen.attributes.nombre,
            sortable: true,
            width: "80%"
        },
        {
            name: 'ESTADO',
            selector: origen => (origen.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
            width: "10%"
        },
        {
            name: 'ACCIONES',
            cell: row => <div><Link to={`${row.id}`}>
                <button type="button" className="btn btn btn-primary" title='Editar'>
                    <i className="fa fa-fw fa-edit"></i>
                </button>
            </Link></div>,
            width: "10%"
        }
    ];

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    useEffect(() => {
        async function fetchData() {
            cargarOrigenRadicadoListaLista(1);
        }
        fetchData();
    }, []);

    const cargarOrigenRadicadoListaLista = (estado) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('getMasOrigenRadicado/'+estado).then(
            datos => {
                if (!datos.error) {
                    setOrigenRadicadoListaLista(datos);
                    window.showSpinner(false);
                }
                else{
                    window.showSpinner(false);
                    setModalState({ title: "LISTA DE VIGENCIAS :: ERROR", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
                }
            }
        )
    }

    return (
        <div>

            <Spinner />
            <ModalInfo data={getModalState} />

            <div className="w2d_block">
                <nav aria-label="w2d_block let">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>
                        <li className="breadcrumb-item"> <small>Orígen del radicado</small></li>
                    </ol>
                </nav>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: ORIGENES DEL RADICADO {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVOS" : "ACTIVOS"}</h3>
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

                                data={origenRadicadoListaLista.data.filter((suggestion) => {
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
                                paginationTotalRows={origenRadicadoListaLista.data.length}
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
        </div >
    )
}

export default OrigenRadicadoLista;