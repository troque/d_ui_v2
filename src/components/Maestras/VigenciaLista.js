import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import Spinner from '../Utils/Spinner';
import ModalInfo from '../Utils/Modals/ModalInformacion';

function VigenciaLista() {
    const [vigenciaLista, setVigenciaLista] = useState({ data: [] });
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });
    const [getEstadoLista, setEstadoLista] = useState('1');
    
    const [getRoutes] = useState({

        crear_registro: "/Vigencia/Add",
        consultar_registros: "/Vigencia",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        ocultar_agregar: false,
        modulo: 'ADMIN_ProcesoDisciplinario'
    });

    const handleCallback = (childData) => {
        setEstadoLista(childData);
        cargarVigencias(childData);
    }

    const columns = [
        {
            name: 'VIGENCIA',
            selector: vigencia => vigencia.attributes.vigencia,
            sortable: true,
            width: "80%"
        },
        {
            name: 'ESTADO',
            selector: vigencia => (vigencia.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
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

    useEffect(() => {
        async function fetchData() {
            cargarVigencias(1);
        }
        fetchData();
    }, []);

    const cargarVigencias = (estado) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('getVigencias/'+estado).then(
            datos => {
                if (!datos.error) {
                    setVigenciaLista(datos);
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
            
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>   
                        <li className="breadcrumb-item"> <small>Vigencias</small></li>
                    </ol>
                </nav>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">Vigencias registradas {getEstadoLista === global.Constants.ESTADOS.INACTIVO ? "Inactivas" : "Activas"}</h3>
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

                                data={vigenciaLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if(suggestion.attributes.estado === getEstadoLista){
                                            return suggestion;
                                        }
                                    } else if (

                                        ((suggestion.id
                                            + suggestion.attributes.vigencia
                                            + (suggestion.attributes.estado === "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(getSeach.toLowerCase())
                                            && (suggestion.attributes.estado === getEstadoLista))

                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={vigenciaLista.data.length}
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

export default VigenciaLista;