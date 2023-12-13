import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ClasificacionRadicadoApi from '../../Api/Services/ClasificacionRadicadoApi';
import { Navigate } from "react-router-dom";
import CierreEtapaApi from '../../Api/Services/CierreEtapaApi';
import { useLocation } from 'react-router-dom'
import { hasAccess } from '../../../components/Utils/Common';
import ListaBotones from '../../Utils/ListaBotones';
import DataTable from 'react-data-table-component';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import ParametroModel from '../../Models/ParametroModel';
import { quitarAcentos } from '../../Utils/Common';

function EvaluacionFasesLista() {

    const [errorApi, setErrorApi] = useState('');
    const [estadoEtapaCapturaReparto, setEstadoEtapaCapturaReparto] = useState(false);
    const [getEstadoLista, setEstadoLista] = useState('');
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [clasificacionRadicadoLista, setClasificacionRadicadoLista] = useState({ data: [], links: [], meta: [] });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
 
    const columns = [

        {
            name: 'TIPO DE EVALUACIÓN',
            cell: clasificacion_radicado => <div>
                {clasificacion_radicado.attributes.nombre_resultado_evaluacion}<br/>
            </div>,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.nombre_resultado_evaluacion,
            sortable: true,
            width: "40%"
        },

        {
            name: 'TIPO DE EXPEDIENTE',
            cell: clasificacion_radicado => <div>
                {clasificacion_radicado.attributes.nombre_tipo_expediente+' '+clasificacion_radicado.attributes.nombre_sub_tipo_expediente}<br/>
            </div>,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.nombre_tipo_expediente,
            sortable: true,
            width: "40%"
        },

        {
            name: 'ACCIONES',
            cell: row => <div>
                <Link to={`${row.attributes.id_tipo_expediente}/${row.attributes.id_sub_tipo_expediente}/${row.attributes.id_resultado_evaluacion}`}>
                    <button type="button" className="btn btn btn-primary" title='Editar'>
                        <i className="fa fa-fw fa-edit"></i>
                    </button>
                </Link>
                <button type="button" className="btn btn btn-primary" title='Eliminar' onClick={() => getEliminarEvaluacionFases(row.attributes.id_tipo_expediente, row.attributes.id_sub_tipo_expediente, row.attributes.id_resultado_evaluacion)}>
                    <i className="fa fa-fw fa-trash"></i>
                </button>
            </div>,
            width: "20%"

        }
    
    ];


    const [getRoutes, setRoutes] = useState({
        id_fase: global.Constants.FASES.CLASIFICACION,
        crear_registro: "/EvaluacionFasesAdd",
        consultar_registros: "/EvaluacionFasesLista",
        muestra_activos: true,
        muestra_inactivos: true,
        muestra_atras: false,
        ocultar_agregar: false
    });

    useEffect(() => {
        async function fetchData() {
            getListaExpedientes();
        }
        fetchData();
    }, []);


    const getListaExpedientes = () => {
        window.showSpinner(true);
        GenericApi.getGeneric("administracion/evaluacion/lista-expedientes").then(
            datos => {
                if (!datos.error) {
                    setClasificacionRadicadoLista(datos);
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE FASES ETAPA EVALUACIÓN PQR", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', alert: global.Constants.TIPO_ALERTA.ERROR }); 
                }
                window.showSpinner(false);
            }
        )
    }

    const getEliminarEvaluacionFases = ($idTipoExpediente, $idSubExpediente, $idEvaluacion) => {
        window.showSpinner(true);
        GenericApi.getGeneric("eliminar-fases-evaluacion-lista/"+$idTipoExpediente+'/'+$idSubExpediente+'/'+$idEvaluacion).then(
            datos => {
                if (!datos.error) {
                    setClasificacionRadicadoLista({ data: [], links: [], meta: [] });
                    getListaExpedientes();
                }
                else {
                    setModalState({ title: "ADMINITRACIÓN :: CONFIGURACIÓN DE FASES ETAPA EVALUACIÓN PQR", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', alert: global.Constants.TIPO_ALERTA.ERROR }); 
                    window.showSpinner(false);
                }
            }
        )
    }

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarClasificaciones(page, perPage, (getEstadoLista == "Inactivos" ? '0' : "1"));
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarClasificaciones(page, newPerPage, (getEstadoLista == "Inactivos" ? '0' : "1"));

    }

    const handleCallback = (childData) => {
        try {
            window.showSpinner(true);
            setEstadoLista(childData == global.Constants.ESTADOS.INACTIVO ? "Inactivos" : "Activos")
            //cargarClasificaciones(1, paganationPerPages, childData);
        } catch (error) {

        }

    }

    return (
        <>
            <Spinner />
            <Formik>
                <Form>
                    
                        <div className="w2d_block">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <small>Administración</small></li>
                                    <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>
                                    <li className="breadcrumb-item"> <small>Fases</small></li>
                                    <li className="breadcrumb-item"> <small>Fases etapa evaluación PQR</small></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/EvaluacionFasesLista/`}><small>Configuración de fases de la etapa evaluación PQR</small></Link></li>
                                </ol>
                            </nav>
                        </div> 
                    
                        

                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">ADMINISTRACIÓN :: CONFIGURACIÓN DE FASES DE LA ETAPA EVALUACIÓN PQR</h3>
                        </div>

                        <div className="block-content">
                            <>
                                <div className='row'>

                                    <div className='col-md-3'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                        </div>
                                    </div>

                                    <ListaBotones getRoutes={getRoutes} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />

                                </div>

                                {
                                    (hasAccess('CR_ClasificacionRadicado', 'Consultar')) ? (

                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                            columns={columns}
                                            data={clasificacionRadicadoLista.data.filter((suggestion) => {
                                                if (getSeach === "") {
                                                    return suggestion;
                                                } else if (

                                                    (( quitarAcentos(suggestion.attributes.nombre_tipo_expediente) +
                                                        quitarAcentos(suggestion.attributes.nombre_sub_tipo_expediente) + 
                                                            quitarAcentos(suggestion.attributes.nombre_resultado_evaluacion)
                                                        ).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))

                                                ) {
                                                    return suggestion;
                                                }
                                            })}
                                            perPage={perPage}
                                            page={pageActual}
                                            pagination
                                            noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                            paginationTotalRows={clasificacionRadicadoLista.data.length}
                                            onChangePage={handlePageChange}
                                            onChangeRowsPerPage={handlePerRowsChange}
                                            defaultSortFieldId="Nombre"
                                            striped
                                            paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                            defaultSortAsc={false}
                                        />
                                    ) : null
                                }
                            </>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );


}
export default EvaluacionFasesLista;
