import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import GenericApi from '../Api/Services/GenericApi';
import Spinner from '../Utils/Spinner';
import { Navigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';

function UsuarioLista() {

    const [errorApi, setErrorApi] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [getUsuarioListaSearch, setUsuarioListaSearch] = useState({ data: [], links: [], meta: [] });
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes] = useState({
        crear_registro: "/Usuario/Add",
        consultar_registros: "/Usuario",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        modulo: 'ADMIN_Perfiles'
    });


    const handleCallback = (childData) => {
        setEstadoLista(childData);
        cargarUsuarios(childData);
    }

    const columns = [
        {
            name: 'NOMBRE',
            cell: usuario => <div>{(usuario.attributes.nombre ? usuario.attributes.nombre : "") + ' ' + (usuario.attributes.apellido ? usuario.attributes.apellido : "")}</div>,
            selector: usuario => usuario.attributes.nombre,
            sortable: true,
            width: '350px'
        },
        /*{
            name: 'USUARIO',
            selector: usuario => usuario.attributes.name,
            wrap: true,
            sortable: true,
        },*/
        {
            name: 'CORREO',
            selector: usuario => usuario.attributes.email,
            wrap: true,
            sortable: true,
            width: '350px'
        },
        {
            name: 'DEPENDENCIA',
            selector: usuario => usuario.attributes.nombre_dependencia,
            wrap: true,
            sortable: true,
            width: '400px'

        },
        {
            name: 'ESTADO',
            selector: usuario => usuario.attributes.nombre_estado,
            wrap: true,
            sortable: true,
        },
        {
            name: 'ACCIONES',
            cell: row => <div><Link to={`${row.id}`}>
                <button type="button" className="btn btn btn-primary" title='Editar'>
                    <i className="fa fa-fw fa-edit"></i>
                </button>
            </Link></div>


        }
    ];

    const redirectToRoutes = () => {
        return <Navigate to={`/UsuarioLista/`} />;
    }

    useEffect(() => {
        async function fetchData() {
            cargarUsuarios(1);
        }
        fetchData();
    }, []);

    const cargarUsuarios = (estado) => {
        window.showSpinner(true);
        //cargamos todos los usuarios
        GenericApi.getAllGeneric('getUsarios/'+estado).then(
            datos => {
                if (!datos.error) {
                    setUsuarioListaSearch(datos)
                    window.showSpinner(false);
                }
                else {
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                    window.showSpinner(false);
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
        <>
            {isRedirect ? redirectToRoutes() : null}
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            <Formik>
                <Form>
                    <div className="block block-themed">
                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <small>Administración</small></li>                       
                                    <li className="breadcrumb-item"> <small>Perfiles</small></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Usuario`}><small>Lista de Usuarios</small></Link></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block-header">
                            <h3 className="block-title">ADMINISTRACIÓN :: LISTA DE USUARIOS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVOS" : "ACTIVOS"}</h3>
                        </div>
                        <div className="block-content">
                            <div className='row'>
                                <div className='col-md-3'>
                                    <div className="form-group ">
                                        <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                                    </div>
                                </div>
                                <ListaBotones getRoutes={getRoutes} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                        columns={columns}
                                        data={getUsuarioListaSearch.data.filter((suggestion) => {
                                            if (getSeach === "") {
                                                if (suggestion.attributes.estado == getEstadoLista) {
                                                    return suggestion;
                                                }
                                            } else if (
                                                ((suggestion.attributes.nombre ? quitarAcentos(suggestion.attributes.nombre) : null
                                                    + quitarAcentos(suggestion.attributes.apellido)
                                                    + suggestion.attributes.apellido ? quitarAcentos(suggestion.attributes.name) : null
                                                        + suggestion.attributes.email ? quitarAcentos(suggestion.attributes.email) : null
                                                        + (suggestion.attributes.dependencia ? quitarAcentos(suggestion.attributes.dependencia.nombre) : '')
                                                + (suggestion.attributes.estado == '0' ? 'Inactivo' : 'Activo')).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase()))
                                                    && (suggestion.attributes.estado == getEstadoLista))
                                            ) {
                                                return suggestion;
                                            }
                                        })}
                                        perPage={perPage}
                                        page={pageActual}
                                        pagination
                                        noDataComponent="Sin datos"
                                        paginationTotalRows={getUsuarioListaSearch.data.length}
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
                </Form>
            </Formik>
        </>
    );
}
export default UsuarioLista;
