import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ClasificacionRadicadoApi from '../../Api/Services/ClasificacionRadicadoApi';
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import CierreEtapaApi from '../../Api/Services/CierreEtapaApi';
import { useLocation } from 'react-router-dom'
import { hasAccess } from '../../../components/Utils/Common';
import ListaBotones from '../../Utils/ListaBotones';
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';

function RequerimientoJuzgadoLista() {


    const [errorApi, setErrorApi] = useState('');
    const [estadoEtapaCapturaReparto, setEstadoEtapaCapturaReparto] = useState(false);
    const [getEstadoLista, setEstadoLista] = useState('');
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [clasificacionRadicadoLista, setClasificacionRadicadoLista] = useState({ data: [], links: [], meta: [] });
    const [getNombreProceso, setNombreProceso] = useState('');
    
    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;


    const columns = [
        {
            name: 'Etapa',
            cell: clasificacion_radicado => clasificacion_radicado.attributes.etapa.nombre,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.etapa.nombre,
            sortable: true
        },

        {
            name: 'Definición ',
            cell: clasificacion_radicado => <div> 
                {clasificacion_radicado.attributes.expediente.nombre} <br/>
                {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) ? clasificacion_radicado.attributes.tipo_derecho_peticion.nombre : null}
                {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.QUEJA) ? clasificacion_radicado.attributes.tipo_queja.nombre : null} 
                {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA) ? clasificacion_radicado.attributes.fecha_termino : null}
                <br />{clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA) ? " (" + ((clasificacion_radicado.attributes.hora_termino)!=null?(clasificacion_radicado.attributes.hora_termino)
                :("0")) + ") horas" : null}</div>,

            selector: clasificacion_radicado => clasificacion_radicado.attributes.expediente.nombre,
            sortable: true,
            width: "20%"
        },

        {
            name: 'Descripción',
            cell: clasificacion_radicado => <div title={clasificacion_radicado.attributes.observaciones}>{clasificacion_radicado.attributes.observaciones?
                (clasificacion_radicado.attributes.observaciones.length > global.Constants.TEXT_AREA.CANTIDAD_MINIMA_DESCRIPCION 
                    ? clasificacion_radicado.attributes.observaciones.substring(0, global.Constants.TEXT_AREA.CANTIDAD_MINIMA_DESCRIPCION)+"...":clasificacion_radicado.attributes.observaciones):""}</div>,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.expediente.nombre,
            sortable: true,
            width: "20%"
        },

        {
            name: 'Registrado por',
            cell: clasificacion_radicado => clasificacion_radicado.attributes.nombre_completo,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.nombre_completo,
            sortable: true
        },
        {
            name: 'Fecha de registro',
            selector: clasificacion_radicado => clasificacion_radicado.attributes.created_at,
            sortable: true,
            width: "20%"
        },
        {
            name: 'Estado',
            selector: clasificacion_radicado => (clasificacion_radicado.attributes.estado == "1" ? 'Activo' : 'Inactivo'),
            sortable: true,
        },
        {
            name: 'Termino',
            selector: clasificacion_radicado => 'Ver Normatividad',
            sortable: true,
        },
    ];


    const [getRoutes, setRoutes] = useState({
        id_etapa: from.idEtapa,
        id_fase: global.Constants.FASES.CLASIFICACION,
        crear_registro: "/ClasificacionRadicadoForm",
        consultar_registros: "/ClasificacionRadicadoLista",
        adjuntar_documento: "/SoporteRadicadoForm",
        repositorio_documentos: "/SoporteRadicadoLista",
        modulo: "CR_ClasificacionRadicado",
        funcionalidad_crear: "Crear",
        funcionalidad_consultar: "Consultar",
        muestra_atras: true,
        muestra_inactivos: true,
    });

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setEstadoLista("Activos")
            nombreProceso();
            

            // VALIDA CIERRE DE ETAPA EVALUACION
            const dataCierreEtapa = {

                "data": {
                    "type": "cerrar_etapa",
                    "attributes": {
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_etapa": global.Constants.ETAPAS.CAPTURA_REPARTO,
                        "id_delegada": "id_delegada",
                        "id_funcionario": "id_funcionario"
                    }
                }
            }

            CierreEtapaApi.getCierreEtapaByIdProcesoDisciplinario(dataCierreEtapa).then(
                datos => {
                    if (!datos.error) {
                        if (datos["data"].length > 0) {
                            setEstadoEtapaCapturaReparto(true);
                        }
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                }
            )
        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso",from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    cargarClasificaciones(1, paganationPerPages, '1');
                }
            }
        )
    }

    const cargarClasificaciones = (page, perPage, estado) => {

        const data = {
            "data": {
                "type": "clasificacion_radicado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": global.Constants.ETAPAS.CAPTURA_REPARTO,
                    "id_tipo_expediente": "1",
                    "estado": estado,
                    'per_page': perPage,
                    'current_page': page
                }
            }
        }
        
        if (hasAccess('CR_ClasificacionRadicado', 'Consultar')) {
            ClasificacionRadicadoApi.getAllClasificacionRadicadoByIdProDisciplinario(data, procesoDisciplinarioId).then(
                datos => {
                    if (!datos.error) {
                        setClasificacionRadicadoLista(datos)

                        if (datos.data.length > 0) {
                            from.subTipoExpediente = datos.data[0]["attributes"];
                        }
                        window.showSpinner(false);
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showSpinner(false);
                        window.showModal()
                    }
                }
            )
        }
        else {
            window.showSpinner(false)
        }
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
            cargarClasificaciones(1, paganationPerPages, childData);
        } catch (error) {

        }

    }

    return (
        <>
            <Spinner />
            <Formik>
                <Form>
                    <div className="col-md-12">
                        <div className="block block-rounded block-bordered">
                            <div className="block-content">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb breadcrumb-alt push">
                                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                        <li className="breadcrumb-item"> <small>Clasificacion Radicado Lista</small></li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title"> {getNombreProceso} :: <strong>Consultar lista de Clasificación del radicado {getEstadoLista}</strong></h3>
                        </div>

                        <div className="block-content">
                            <>


                                <div className='row'>

                                    <div className='col-md-3'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                        </div>
                                    </div>

                                    <ListaBotones getRoutes={getRoutes} from={from} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />

                                </div>



                                {
                                    (hasAccess('CR_ClasificacionRadicado', 'Consultar')) ? (

                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                            columns={columns}
                                            data={clasificacionRadicadoLista.data.filter((suggestion) => {
                                                if (getSeach === "") {
                                                    return suggestion;
                                                } else if (

                                                    (( suggestion.attributes.etapa.nombre +
                                                        suggestion.attributes.created_at + suggestion.attributes.estado
                                                        + suggestion.attributes.observaciones
                                                        + suggestion.attributes.nombre_completo
                                                        + ((suggestion.attributes.expediente ? suggestion.attributes.expediente.nombre : "") + " " + (suggestion.attributes.tipo_queja ? suggestion.attributes.tipo_queja.nombre : ""))
                                                        + (suggestion.attributes.tipo_derecho_peticion ? suggestion.attributes.tipo_derecho_peticion.nombre : "")
                                                        + (suggestion.attributes.fecha_termino ? suggestion.attributes.fecha_termino : "")
                                                        + (suggestion.attributes.hora_termino ? suggestion.attributes.hora_termino : "")).toLowerCase().includes(getSeach.toLowerCase()))

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
export default RequerimientoJuzgadoLista;
