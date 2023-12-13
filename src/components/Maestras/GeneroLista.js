import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import DataTable from 'react-data-table-component';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';
import ModalInfo from '../Utils/Modals/ModalInformacion';


function GeneroLista() {
    const [generoLista, setGeneroLista] = useState({ data: [] });
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });
    const [getRoutes, setRoutes] = useState({

        crear_registro: "/Genero/Add",
        consultar_registros: "/Genero",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: "ADMIN_Otros",
    });

    const handleCallback = (childData) => {
        setEstadoLista(childData);
        cargarGeneroLista(childData);
    }

    const columns = [
        {
            name: 'NOMBRE',
            selector: genero => genero.attributes.nombre,
            sortable: true,
            width: "80%"
        },
        {
            name: 'ESTADO',
            selector: genero => (genero.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
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
            cargarGeneroLista(1);
        }
        fetchData();
    }, []);

    const cargarGeneroLista = (estado) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('getGenero/'+estado).then(
            datos => {
                if (!datos.error) {
                    setGeneroLista(datos);
                    window.showSpinner(false);
                }
                else{
                    window.showSpinner(false);
                    setModalState({ title: "LISTA DE GENEROS :: ERROR", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
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
                        <li className="breadcrumb-item"> <small>Otros</small></li>
                        <li className="breadcrumb-item"> <small>Género / Sexo</small></li>
                        <li className="breadcrumb-item"> <small>Género</small></li>
                    </ol>
                </nav>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: GÉNEROS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVOS" : "ACTIVOS"}</h3>

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
                                data={generoLista.data.filter((suggestion) => {
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
                                paginationTotalRows={generoLista.data.length}
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

export default GeneroLista;