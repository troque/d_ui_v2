import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import Spinner from '../Utils/Spinner';
import '../Utils/Constants';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import GenericApi from './../Api/Services/GenericApi';
import ModalGen from '../Utils/Modals/ModalGeneric';
import { quitarAcentos } from '../Utils/Common';

function LogConsultas() {

    const location = useLocation()
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [listaLogConsultas, setListaLogConsultas] = useState({ data: [], links: [], meta: [] });

    const columns = [
        {
            name: 'FECHA',
            selector: log => log.attributes.created_at,
            sortable: true,
            width: "20%"
        },
        {
            name: 'SINPROC',
            selector: log => log.attributes.id_proceso_disciplinario ? log.attributes.id_proceso_disciplinario.radicado : "",
            sortable: true,
            width: "10%"
        },
        {
            name: 'USUARIO',
            selector: log => (log.attributes.id_usuario.nombre +" "+log.attributes.id_usuario.apellido+" ("+log.attributes.id_usuario.name+") "),
            sortable: true,
            width: "30%"
        },
        {
            name: 'FILTROS USADOS',
            selector: log => log.attributes.filtros ? (
                <div className="mt-2 mb-2 d-none d-sm-table-cell">
                    <div className='row'>
                        <div className="col-12">
                            {log.attributes.filtros.n_expediente ? <small><strong>N° Expediente:</strong> {log.attributes.filtros.n_expediente} </small> : ""}
                            {log.attributes.filtros.n_expediente ? <br /> : ""}

                            {log.attributes.filtros.Vigencia ? <small><strong>Vigencia:</strong> {log.attributes.filtros.Vigencia} </small> : ""}
                            {log.attributes.filtros.Vigencia ? <br /> : ""}

                            {log.attributes.filtros.estado_del_expediente ? <small><strong>Estado del expediente:</strong> {log.attributes.filtros.estado_del_expediente} </small> : ""}
                            {log.attributes.filtros.estado_del_expediente ? <br /> : ""}

                            {log.attributes.filtros.ubicacion_del_expediente ? <small><strong>Ubicacion del expediente:</strong> {log.attributes.filtros.ubicacion_del_expediente} </small> : ""}
                            {log.attributes.filtros.ubicacion_del_expediente ? <br /> : ""}

                            {log.attributes.filtros.nombre_disciplinado ? <small><strong>Nombre disciplinado:</strong> {log.attributes.filtros.nombre_disciplinado} </small> : ""}
                            {log.attributes.filtros.nombre_disciplinado ? <br /> : ""}

                            {log.attributes.filtros.identificacion_disciplinado ? <small><strong>Identificacion disciplinado:</strong> {log.attributes.filtros.identificacion_disciplinado} </small> : ""}
                            {log.attributes.filtros.identificacion_disciplinado ? <br /> : ""}

                            {log.attributes.filtros.asunto_del_expediente ? <small><strong>Asunto del expediente:</strong> {log.attributes.filtros.asunto_del_expediente} </small> : ""}
                            {log.attributes.filtros.asunto_del_expediente ? <br /> : ""}

                            {log.attributes.filtros.sector ? <small><strong>Sector:</strong> {log.attributes.filtros.sector} </small> : ""}
                            {log.attributes.filtros.sector ? <br /> : ""}

                            {log.attributes.filtros.nombre_entidad ? <small><strong>Nombre entidad:</strong> {log.attributes.filtros.nombre_entidad} </small> : ""}
                            {log.attributes.filtros.nombre_entidad ? <br /> : ""}

                            {log.attributes.filtros.nombre_quejoso ? <small><strong>Nombre quejoso:</strong> {log.attributes.filtros.nombre_quejoso} </small> : ""}
                            {log.attributes.filtros.nombre_quejoso ? <br /> : ""}

                            {log.attributes.filtros.identificacion_quejoso ? <small><strong>Identificacion quejoso:</strong> {log.attributes.filtros.identificacion_quejoso} </small> : ""}
                            {log.attributes.filtros.identificacion_quejoso ? <br /> : ""}

                            {log.attributes.filtros.tipo_quejoso ? <small><strong>Tipo quejoso:</strong> {log.attributes.filtros.tipo_quejoso} </small> : ""}
                            {log.attributes.filtros.tipo_quejoso ? <br /> : ""}

                            {log.attributes.filtros.etapa_del_expediente ? <small><strong>Etapa del expediente:</strong> {log.attributes.filtros.etapa_del_expediente} </small> : ""}
                            {log.attributes.filtros.etapa_del_expediente ? <br /> : ""}

                            {log.attributes.filtros.delegada ? <small><strong>Delegada:</strong> {log.attributes.filtros.delegada} </small> : ""}
                            {log.attributes.filtros.delegada ? <br /> : ""}
                            
                        </div>
                    </div>
                </div>
            ) : null
            ,

            sortable: true,
            width: "30%"
        },
        {
            name: 'RESULTADOS',
            selector: log => (log.attributes.resultados_busqueda),
            sortable: true,
            width: "10%"
        }
    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarLogCosultas(1, paganationPerPages);
        }
        fetchData();
    }, []);

    const cargarLogCosultas = (page, perPage) => {

        GenericApi.getGeneric('log-consultas').then(

            datos => {
                if (!datos.error) {
                    // console.log(datos);
                    setListaLogConsultas(datos);
                    window.showSpinner(false);
                }
                else {
                    setModalState({ title: "Mis pendientes", message: datos.error.toString(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.ERROR});
                    window.showSpinner(false);
                }

            }
        )

        
    }

    const enviarDatos = (valores) => {

        
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
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    rango: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {

                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>

                        <div className="col-md-12">
                            <div className="block-content">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb breadcrumb-alt push">
                                        <li className="breadcrumb-item"> <small>Administrador</small></li>
                                        <li className="breadcrumb-item"> <small>Otros</small></li>
                                        <li className="breadcrumb-item"> <small>Log de consultas</small></li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        
                        <div className="block block-themed">

                            <div className="block-header">
                                <h3 className="block-title">ADMINISTRACIÓN :: LOG DE REGISTRO DE CONSULTAS</h3>
                            </div>

                            <div className="block-content block-content-full">
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className="form-group ">
                                            <label htmlFor='search'>Buscar: </label>
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="block-content block-content-full">
                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                            columns={columns}

                                            data={listaLogConsultas.data.filter((suggestion) => {
                                                if (getSeach === "") {
                                                    return suggestion;
                                                } else if (

                                                    ((quitarAcentos(suggestion.attributes.id_usuario.nombre) + quitarAcentos(suggestion.attributes.id_usuario.apellido) + 
                                                        quitarAcentos(suggestion.attributes.id_usuario.name) + (suggestion.attributes.id_proceso_disciplinario? quitarAcentos(suggestion.attributes.id_proceso_disciplinario.radicado) : "" )+ 
                                                        quitarAcentos(suggestion.attributes.filtros.n_expediente) + quitarAcentos(suggestion.attributes.filtros.Vigencia) +
                                                        quitarAcentos(suggestion.attributes.filtros.estado_del_expediente) + quitarAcentos(suggestion.attributes.filtros.ubicacion_del_expediente) +
                                                        quitarAcentos(suggestion.attributes.filtros.nombre_disciplinado) + quitarAcentos(suggestion.attributes.filtros.identificacion_disciplinado) +
                                                        quitarAcentos(suggestion.attributes.filtros.asunto_del_expediente) + quitarAcentos(suggestion.attributes.filtros.sector) +
                                                        quitarAcentos(suggestion.attributes.filtros.nombre_entidad) + quitarAcentos(suggestion.attributes.filtros.nombre_quejoso) +
                                                        quitarAcentos(suggestion.attributes.filtros.identificacion_quejoso) + quitarAcentos(suggestion.attributes.filtros.tipo_quejoso) +
                                                        quitarAcentos(suggestion.attributes.filtros.etapa_del_expediente) + quitarAcentos(suggestion.attributes.filtros.delegada) +
                                                        quitarAcentos(suggestion.attributes.resultados_busqueda) + quitarAcentos(suggestion.attributes.created_at)).toLowerCase().includes(getSeach.toLowerCase()))

                                                ) {
                                                    return suggestion;
                                                }
                                            })}
                                            perPage={perPage}
                                            page={pageActual}
                                            pagination
                                            noDataComponent="Sin datos"
                                            paginationTotalRows={listaLogConsultas.data.length}
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
                )}
            </Formik>
        </>
    )

}

export default LogConsultas;