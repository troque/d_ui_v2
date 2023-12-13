import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import { Link } from "react-router-dom";
import InteresadoEntidadPermitidaApi from '../Api/Services/InteresadoEntidadPermitidaApi';
import Spinner from '../Utils/Spinner';
import { hasAccess } from '../../components/Utils/Common';
import DataTable from 'react-data-table-component';
import GenericApi from '../Api/Services/GenericApi';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';

function EntidadesInteresadoLista() {

    const [errorApi, setErrorApi] = useState('');
    const [entidadesPermitidasLista, setEntidadesPermitidasLista] = useState({ data: [], links: [], meta: [] });
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);

    const columns = [
        {
            name: 'Entidad',
            selector: entidadPerm => entidadPerm.attributes.id_entidad + " " + entidadPerm.attributes.nombre_entidad,
            sortable: true,
            width: "60%"
        },
        {
            name: 'Fecha Registro',
            selector: entidadPerm => entidadPerm.attributes.created_at,
            sortable: true,
            width: "20%"
        },
        {
            name: 'Estado',
            selector: entidadPerm => entidadPerm.attributes.estado == '1' ? 'Activo' : 'Inactivo',
            sortable: true,
            width: "10%"
        },
        {
            name: 'Acciones',


            cell: row => (hasAccess('EI_EntidadesPermitidasInteresado', 'Inactivar')) ? (
                <div>
                    {
                        (row.attributes.estado == 0) ? (
                            <button type='button' title='Activar' onClick={() => enviarDatos(1, row.id)} className='btn btn-sm btn-success'><span className="fas fa-toggle-off"> </span></button>
                        ) : null
                    }

                    {
                        (row.attributes.estado == 1) ? (
                            <button type='button' title='Inacivar' onClick={() => enviarDatos(0, row.id)} className='btn btn-sm btn-danger'><span className="fas fa-toggle-off"> </span></button>
                        ) : null
                    }
                </div>
            ) : null,
            width: "10%"
        }
    ];


    useEffect(() => {
        window.showSpinner(true);
        async function fetchData() {
            cargarEntidadesPermitidas(1, paganationPerPages);

        }
        fetchData();
    }, []);


    const cargarEntidadesPermitidas = (page, perPage) => {

        if (hasAccess('EI_EntidadesPermitidasInteresado', 'Consultar')) {

            //GenericApi.getAllGeneric('mas-entidad-permitida/entidad-permitida-paginate' + '/' + page + '/' + perPage).then(
            GenericApi.getAllGeneric('mas-entidad-permitida').then(
                datos => {
                    if (!datos.error) {
                        setEntidadesPermitidasLista(datos);
                        window.showSpinner(false);
                    }
                    else {
                        window.showSpinner(false);
                        window.showModal(1);

                    }

                }
            )

        }
    }

    const handlePageChange = page => {
        // window.showSpinner(true);
        setPageActual(page);
        //cargarEntidadesPermitidas(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarEntidadesPermitidas(page, newPerPage);
    }


    const enviarDatos = (estado, id) => {

        try {


            //actualizamos el estado
            window.showSpinner(true);
            const data = {

                "data": {
                    "type": "mas_entidad_permitida",
                    "attributes": {
                        "estado": estado
                    }
                }
            }


            InteresadoEntidadPermitidaApi.updateInteresadoEntidadPermitida(data, id).then(
                datos => {

                    if (!datos.error) {
                        cargarEntidadesPermitidas(1, paganationPerPages);
                    }
                    else {
                        //console.log("hay error");
                        // console.log(datos.error);
                        window.showSpinner(false)
                    }
                    //window.showSpinner(false);
                }
            )

        } catch (error) {
            window.showSpinner(false);
        }
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            <Formik>
                <Form>
                    <div className="block block-themed">
                        <div className="block-header">

                            <h3 className="block-title">Entidades permitidas</h3>


                        </div>
                        <div className="block-content">

                            <>
                                {
                                    (hasAccess('EI_EntidadesPermitidasInteresado', 'Consultar')) ? (
                                        <div>
                                            <div className='row'>

                                                <div className='col-md-3'>
                                                    <div className="form-group ">
                                                        <Field type="text" id="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} name="search" className="form-control border border-success" placeholder="Buscar" />

                                                    </div>
                                                </div>

                                                <>
                                                    {
                                                        (hasAccess('EI_EntidadesPermitidasInteresado', 'Crear')) ? (

                                                            <div className='col-md-9 text-right'>
                                                                <Link to={`/EntidadesInteresadoForm/`}>
                                                                    <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus"></i> </button>
                                                                </Link>

                                                            </div>
                                                        ) : null
                                                    }
                                                </>
                                            </div>


                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columns}

                                                data={entidadesPermitidasLista.data.filter((suggestion) => {
                                                    if (getSeach === "") {
                                                        return suggestion;
                                                    } else if (
                                                        ((suggestion.attributes.id_entidad
                                                            + quitarAcentos(suggestion.attributes.nombre_entidad)
                                                            + (suggestion.attributes.created_at)
                                                            + (suggestion.attributes.estado == "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))

                                                    ) {
                                                        return suggestion;
                                                    }
                                                })}

                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent="Sin datos"
                                                paginationTotalRows={entidadesPermitidasLista.data.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                defaultSortFieldId="Nombre"
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                defaultSortAsc={false}
                                            />

                                        </div>

                                    ) : null
                                }
                            </>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    )

}

export default EntidadesInteresadoLista;