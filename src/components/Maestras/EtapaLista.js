import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';
import ModalInfo from '../Utils/Modals/ModalInformacion';

function EtapaLista() {
    const [getEtapaLista, setEtapaLista] = useState({ data: [] });
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({
        crear_registro: "/Etapa/Add",
        consultar_registros: "/Etapa",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
    });

    const handleCallback = (childData) => {
        setEstadoLista(childData);
        cargarEtapas(childData);
    }

    const columns = [
        {
            name: 'NOMBRE',
            selector: etapa => etapa.attributes.nombre,
            sortable: true,
            width: "40%"
        },
        {
            name: 'ESTADO',
            selector: etapa => (etapa.attributes.estado == global.Constants.ESTADOS.ACTIVO ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
        },
        {
            name: 'ACCIONES',


            cell: row => <div><Link to={`/Etapa/${row.id}`}>
                <button type="button" className="btn btn btn-primary" title='Editar'>
                    <i className="fa fa-fw fa-edit"></i>
                </button>
            </Link></div>
        }
    ];

    useEffect(() => {
        async function fetchData() {
            cargarEtapas(1);
        }
        fetchData();
    }, []);

    const cargarEtapas = (estado) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('getMasEtapa/'+estado).then(
            datos => {
                if (!datos.error) {
                    setEtapaLista(datos);
                    window.showSpinner(false);
                }
                else{
                    window.showSpinner(false);
                    setModalState({ title: "LISTA DE VIGENCIAS :: ERROR", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
                }
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

    return (
        <div>

            <Spinner />
            <ModalInfo data={getModalState} />

            <div className="block block-themed">
                <div className="col-md-12">
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <small>Administración</small></li>
                                <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>
                                <li className="breadcrumb-item"> <small>Lista de etapas</small></li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: ETAPAS REGISTRADAS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVAS" : "ACTIVAS"}</h3>
                </div>
                <div className="block-content">
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className="form-group ">
                                <input type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                            </div>
                        </div>

                        <ListaBotones getRoutes={getRoutes} parentCallback={handleCallback}  mostrarBotonAgregar={false} id="botonesNavegacion" name="botonesNavegacion" />
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                columns={columns}
                                data={getEtapaLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if(suggestion.attributes.estado == getEstadoLista){
                                            return suggestion;
                                        }
                                    } else if (

                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre)
                                            + (quitarAcentos(suggestion.attributes.tipo_proceso.nombre))
                                            + (suggestion.attributes.estado == global.Constants.ESTADOS.ACTIVO ? 'Activo' : 'Inactivo')).toLowerCase().includes(getSeach.toLowerCase())
                                            && (suggestion.attributes.estado == getEstadoLista))

                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                paginationTotalRows={getEtapaLista.data.length}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handlePerRowsChange}
                                striped
                                paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                defaultSortAsc={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EtapaLista;