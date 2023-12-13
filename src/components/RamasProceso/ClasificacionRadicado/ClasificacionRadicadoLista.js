import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ClasificacionRadicadoApi from '../../Api/Services/ClasificacionRadicadoApi';
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import CierreEtapaApi from '../../Api/Services/CierreEtapaApi';
import { useLocation } from 'react-router-dom';
import { hasAccess, quitarAcentos } from '../../../components/Utils/Common';
import ListaBotones from '../../Utils/ListaBotones';
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';

function ClasificacionRadicadoLista() {

    const [errorApi, setErrorApi] = useState('');
    const [estadoEtapaCapturaReparto, setEstadoEtapaCapturaReparto] = useState(false);
    const [getEstadoLista, setEstadoLista] = useState('');
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [clasificacionRadicadoLista, setClasificacionRadicadoLista] = useState({ data: [], links: [], meta: [] });
    const [getMostrarBotonAgregar, setMostrarBotonAgregar] = useState(null);
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getQuejaInterna, setQuejaInterna] = useState(false);

    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let vigencia = from.vigencia;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    const idEtapa = parseInt(from.idEtapa);

    const columns = [
        {
            name: 'REGISTRADO POR',
            cell: clasificacion_radicado => <div>
                <strong>USUARIO: </strong>{clasificacion_radicado.attributes.usuario_registra.nombre.toUpperCase() + ' ' + clasificacion_radicado.attributes.usuario_registra.apellido.toUpperCase()}<br />
                <strong>ETAPA: </strong>{clasificacion_radicado.attributes.etapa.nombre}<br />
                <strong>FECHA: </strong>{clasificacion_radicado.attributes.created_at}<br />
                <strong>DEPENDENCIA: </strong>{clasificacion_radicado.attributes.dependencia.nombre}<br />
            </div>,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.etapa.nombre,
            sortable: true,
            width: '350px',
            wrap: true,
        },
        {
            name: 'TIPO DE EXPEDIENTE',
            cell: clasificacion_radicado =>
                <div>
                    {clasificacion_radicado.attributes.expediente.nombre.toUpperCase()} <br />
                    {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) ? clasificacion_radicado.attributes.tipo_derecho_peticion.nombre.toUpperCase() : null}
                    {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.QUEJA) ? clasificacion_radicado.attributes.tipo_queja.nombre.toUpperCase() : null}
                    {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA) && clasificacion_radicado.attributes.id_termino_respuesta === global.Constants.TERMINOS_RESPUESTA.DIAS ? "DIAS" : null}
                    {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA) && clasificacion_radicado.attributes.id_termino_respuesta === global.Constants.TERMINOS_RESPUESTA.HORAS ? "HORAS" : null}
                </div>,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.expediente.nombre,
            sortable: true,
            wrap: true,
        },
        {
            name: 'OBSERVACIONES',
            cell: clasificacion_radicado => 
            <div>  
                {clasificacion_radicado.attributes.observaciones!=null?
                <>  
                    <span data-toggle="modal" data-target={"#q"+clasificacion_radicado.id}>{clasificacion_radicado.attributes.observacion_corta.toUpperCase()}</span>

                    <div className="modal fade" id={"q"+clasificacion_radicado.id} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                            <div className="modal-header block.block-themed">
                                <h5 className="modal-title" id="descriptionModalLabel">{getNombreProceso} :: CLASIFICACIÓN DEL RADICADO</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA) && clasificacion_radicado.attributes.id_termino_respuesta === global.Constants.TERMINOS_RESPUESTA.HORAS ?  "TÉRMINO DE RESPUESTA: "+clasificacion_radicado.attributes.hora_termino + " HORAS" : null}
                                {clasificacion_radicado.attributes.expediente.id === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA) && clasificacion_radicado.attributes.id_termino_respuesta === global.Constants.TERMINOS_RESPUESTA.DIAS ?  "TÉRMINO DE RESPUESTA: "+clasificacion_radicado.attributes.fecha_termino : null}
                                {clasificacion_radicado.attributes.observaciones.toUpperCase()}
                            </div>                  
                            </div>
                        </div>
                    </div>
                </>:null} 
            </div>,
            selector: clasificacion_radicado => clasificacion_radicado.attributes.observaciones,
            sortable: true,
            wrap: true,
            width: '400px'
        },
        {
            name: 'ESTADO',
            selector: clasificacion_radicado => (clasificacion_radicado.attributes.nombre_estado),
            sortable: true,
        },
        {
            name: 'TÉRMINO',
            selector: clasificacion_radicado =>
                clasificacion_radicado.attributes.mensaje_de_terminos != null ? clasificacion_radicado.attributes.mensaje_de_terminos.toUpperCase() : null,
            sortable: true,
            wrap: true,
            width: '400px'
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
        ocultar_agregar: from.idEtapa > 1 ? true : false
    });

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setEstadoLista("Activos")
            cargarClasificaciones(1, paganationPerPages, '1');

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
        }
        fetchData();
    }, []);

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
        console.log(JSON.stringify(data));

        if (hasAccess('CR_ClasificacionRadicado', 'Consultar')) {
            ClasificacionRadicadoApi.getAllClasificacionRadicadoByIdProDisciplinario(data, procesoDisciplinarioId).then(
                datos => {
                    if (!datos.error) {
                        setClasificacionRadicadoLista(datos);
                        //validarTipoProcesoDisciplinario();
                        //validarTipoExpedienteQuejaInterna(datos);
                        validarBotonAgregarClasificacion();
                        if (datos.data.length > 0) {
                            from.subTipoExpediente = datos.data[0]["attributes"];
                        }
                    }
                }
            )
        }
        else {
            window.showSpinner(false)
        }
    }

    // Metodo encargado de validar el tipo de expediente del proceso
    const validarBotonAgregarClasificacion = () => {

        // Se ejecuta la API
        GenericApi.getGeneric("validar-crear-clasificacion/" + procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    if (datos.data.attributes.agregar_clasificacion) {
                        setMostrarBotonAgregar(true);
                    }
                    else {
                        setMostrarBotonAgregar(false);
                    }


                    nombreProceso();
                }
            }
        )

    }




    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    //validarTipoProcesoDisciplinario();
                }

                window.showSpinner(false);
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
            cargarClasificaciones(1, paganationPerPages, childData);
        } catch (error) {

        }

    }

    return (
        <>
            <Spinner />
            <Formik>
                <Form>
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Lista de clasificación del radicado</small></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">{getNombreProceso} :: CLASIFICACIÓN DEL RADICADO :: LISTA DE {getEstadoLista.toUpperCase()}</h3>
                        </div>
                        <div className="block-content">
                            <>
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                        </div>
                                    </div>
                                    {
                                        getMostrarBotonAgregar != null 
                                        ? 
                                            (
                                                <ListaBotones
                                                    getRoutes={getRoutes}
                                                    from={from}
                                                    parentCallback={handleCallback}
                                                    id="botonesNavegacion"
                                                    name="botonesNavegacion" />
                                            ) 
                                        : 
                                            null
                                    }
                                </div>
                                {
                                    (hasAccess('CR_ClasificacionRadicado', 'Consultar')) ? (
                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                            columns={columns}
                                            data={clasificacionRadicadoLista.data.filter((suggestion) => {
                                                if (getSeach === "") {
                                                    return suggestion;
                                                } else if (
                                                    ((quitarAcentos(suggestion.attributes.etapa.nombre) +
                                                        suggestion.attributes.created_at + 
                                                        quitarAcentos(suggestion.attributes.nombre_estado)
                                                        + quitarAcentos(suggestion.attributes.observaciones)
                                                        + quitarAcentos(suggestion.attributes.nombre_completo)
                                                        + quitarAcentos(suggestion.attributes.dependencia.nombre)
                                                        + ((suggestion.attributes.expediente ? quitarAcentos(suggestion.attributes.expediente.nombre) : "") + " " + (suggestion.attributes.tipo_queja ? quitarAcentos(suggestion.attributes.tipo_queja.nombre) : ""))
                                                        + (suggestion.attributes.tipo_derecho_peticion ? quitarAcentos(suggestion.attributes.tipo_derecho_peticion.nombre) : "")
                                                        + (suggestion.attributes.fecha_termino ? suggestion.attributes.fecha_termino : "")
                                                        + (suggestion.attributes.hora_termino ? suggestion.attributes.hora_termino : "")).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))

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
export default ClasificacionRadicadoLista;
