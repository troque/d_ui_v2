import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import GenericApi from '../Api/Services/GenericApi';
import Spinner from '../Utils/Spinner';
import { Navigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';

function RolesLista() {

    const [getSeach, setSeach] = useState('');
    const [errorApi, setErrorApi] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);

    const [getRolesListaSearch, setRolesListaSearch] = useState({ data: [], links: [], meta: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);

    const columns = [
        {
            name: 'NOMBRE',
            selector: ciudad => ciudad.attributes.nombre.toUpperCase(),
            sortable: true,
            width: "90%"
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

    const redirectToRoutes = () => {
        return <Navigate to={`/RolesLista/`} />;
    }

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);

            cargarRoles(1, paganationPerPages);


        }
        fetchData();
    }, []);

    const cargarRoles = (page, perPage) => {
        //cargamos todos los roles
        //GenericApi.getAllGeneric('role/role-paginate' + '/' + page + '/' + perPage).then(
        GenericApi.getAllGeneric('role').then(
            datos => {

                if (!datos.error) {
                    if (datos["data"] != "") {
                        setRolesListaSearch(datos)
                        window.showSpinner(false);
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                        window.showSpinner(false);

                    }
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
        //window.showSpinner(true);
        setPageActual(page);
        //cargarRoles(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarRoles(page, newPerPage);

    }


    return (
        <>
            {isRedirect ? redirectToRoutes() : null}
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            <Formik>
                <Form>
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <small>Administración</small></li>
                                <li className="breadcrumb-item"> <small>Perfiles</small></li>
                                <li className="breadcrumb-item"> <small>Lista de roles</small></li>
                            </ol>
                        </nav>
                    </div>

                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">ADMINISTRACIÓN :: ROLES REGISTRADOS</h3>


                        </div>

                        <div className="block-content">

                            <div className='row'>

                                <div className='col-md-3'>
                                    <div className="form-group ">
                                        <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                    </div>
                                </div>

                                <div className='col-md-9 text-right'>
                                    <Link to={`/Rol/Add`} >
                                        <button type="button" className="btn btn btn-primary mr-1 mb-3"><i className="fas fa-plus"></i></button>
                                    </Link>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">

                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                        columns={columns}
                                        data={getRolesListaSearch.data.filter((suggestion) => {
                                            if (getSeach === "") {
                                                return suggestion;
                                            } else if (

                                                ((quitarAcentos(suggestion.attributes.nombre)
                                                    + (suggestion.attributes.dependencia ? quitarAcentos(suggestion.attributes.dependencia.nombre) : '')
                                                    + (suggestion.attributes.estado == '0' ? 'Inactivo' : 'Activo')).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))
                                            ) {
                                                return suggestion;
                                            }
                                        })}
                                        perPage={perPage}
                                        page={pageActual}
                                        pagination
                                        noDataComponent="Sin datos"
                                        paginationTotalRows={getRolesListaSearch.data.length}
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
export default RolesLista;
