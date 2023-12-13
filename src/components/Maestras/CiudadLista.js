import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';
import ModalInfo from '../Utils/Modals/ModalInformacion';

function CiudadLista() {
    const [ciudadLista, setCiudadLista] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });
    const [getRoutes, setRoutes] = useState({

        crear_registro: "/Ciudad/Add",
        consultar_registros: "/CiudadsLista",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: "ADMIN_Otros",
    });

    const handleCallback = (childData) => {
        setEstadoLista(childData);
        cargarCiudad(childData);
    }

    const columns = [
        {
            name: 'CIUDAD',
            selector: ciudad => ciudad.attributes.nombre,
            sortable: true,
            width: "30%"
        },
        {
            name: 'DEPARTAMENTO',
            selector: ciudad => ciudad.attributes.nombre_departamento,
            sortable: true,
            width: "30%"
        },
        {
            name: 'CÓDIGO DANE', selector: ciudad => ciudad.attributes.codigo_dane,
            sortable: true,
            width: "15%"
        },
        {
            name: 'ESTADO',
            selector: ciudad => (ciudad.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
            width: "15%"
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
            cargarCiudad(1);
        }
        fetchData();
    }, []);


    const cargarCiudad = (estado) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('getCiudad/'+estado).then(
            datos => {
                if (!datos.error) {
                    setCiudadLista(datos);
                    window.showSpinner(false);
                }
                else {
                    window.showSpinner(false);
                    setModalState({ title: "LISTA DE CIUDADES :: ERROR", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
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

            <div className="col-md-12">
                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <small>Administrador</small></li>
                            <li className="breadcrumb-item"> <small>Otros</small></li>
                            <li className="breadcrumb-item"> <small>Localización</small></li>
                            <li className="breadcrumb-item"> <small>Ciudades</small></li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: CIUDADES {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVAS" : "ACTIVAS"}</h3>

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
                                data={ciudadLista.data.filter((suggestion) => {
                                    if (getSeach === "") {

                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }

                                    } else if (
                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre)
                                            + quitarAcentos(suggestion.attributes.departamento.nombre)
                                            + suggestion.attributes.codigo_dane
                                            + (suggestion.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO')).toLowerCase().includes(getSeach.toLowerCase())
                                            && (suggestion.attributes.estado == getEstadoLista))) {
                                        return suggestion;
                                    }
                                })}

                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={ciudadLista.data.length}
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

export default CiudadLista;