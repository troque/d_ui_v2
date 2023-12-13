import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';
import ModalInfo from '../Utils/Modals/ModalInformacion';

function DependenciasLista() {
    const [dependenciasLista, setDependenciasLista] = useState({ data: [] });
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({

        crear_registro: "/Dependencia/Add",
        consultar_registros: "/Dependencia",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: 'ADMIN_ProcesoDisciplinario'
    });

    const handleCallback = (childData) => {
        setEstadoLista(childData);
        cargarDependencias(childData);
    }

    const columns = [
        {
            name: 'NOMBRE',
            selector: dependencia => dependencia.attributes.nombre,
            wrap: true,
            sortable: true,
            width: '400px'
        },
        {
            name: 'JEFE DE LA DEPENDENCIA',
            selector: dependencia =>
                <div className='mb-3'>
                    <strong>NOMBRE:</strong> {dependencia.attributes.nombre_usuario_jefe}<br />
                    <strong>EMAIL:</strong> {dependencia.attributes.email_usuario_jefe}<br />                    
                </div>,                
            wrap: true,
            sortable: true,
            width: '500px'
        },
        {
            name: 'PREFIJO',
            selector: dependencia => (dependencia.attributes.prefijo),
            sortable: true,
            //width: "15%"
        },
        {
            name: 'ESTADO',
            selector: dependencia => (dependencia.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
            //width: "15%"
        },
        {
            name: 'ACCIONES',
            //width: "10%",
            cell: row => <div><Link to={`/DependenciaConfiguracion/${row.id}`}>
                <button type="button" className="btn btn btn-primary" title='Editar'>
                    <i className="fa fa-fw fa-edit"></i>
                </button>
            </Link></div>
        }
    ];

    useEffect(() => {
        async function fetchData() {
            cargarDependencias(1);
        }
        fetchData();
    }, []);

    const cargarDependencias = (estado) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('getMasDependenciaOrigen/'+estado).then(
            datos => {
                if (!datos.error) {
                    setDependenciasLista(datos);
                    window.showSpinner(false);
                }
                else{
                    window.showSpinner(false);
                    setModalState({ title: "LISTA DE DEPENDENCIAS :: ERROR", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
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
                        <li className="breadcrumb-item"> <small>Lista de dependencias</small></li>
                    </ol>
                </nav>
            </div>
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINSITRACIÓN :: DEPENDENCIAS REGISTRAS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVAS" : "ACTIVAS"}</h3>
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
                                data={dependenciasLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (

                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre)
                                            + quitarAcentos(suggestion.attributes.nombre_usuario_jefe)
                                            + (suggestion.attributes.dependencia ? quitarAcentos(suggestion.attributes.dependencia.nombre) : '')
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
                                paginationTotalRows={dependenciasLista.data.length}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handlePerRowsChange}
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

export default DependenciasLista;