import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Navigate, useParams } from "react-router";
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import CierreEtapaApi from '../../Api/Services/CierreEtapaApi';
import { useLocation } from 'react-router-dom';
import { hasAccess, quitarAcentos } from '../../../components/Utils/Common';
import Spinner from '../../Utils/Spinner';
import ListaBotones from '../../Utils/ListaBotones';
import DataTable from 'react-data-table-component';
import GenericApi from '../../Api/Services/GenericApi';
import '../../Utils/Constants';
import InfoErrorApi from '../../Utils/InfoErrorApi';

function SoporteRadicadoLista() {

    const [getEstadoLista, setEstadoLista] = useState('');
    const [errorApi, setErrorApi] = useState('');
    const [estadoEtapaCapturaReparto, setEstadoEtapaCapturaReparto] = useState(false);
    const [getSeach, setSeach] = useState('');
    const location = useLocation()
    const { from, disable } = location.state;
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;
    let id_etapa = from.id_etapa;
    let id_fase = from.id_fase;
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [soporteRadicadoLista, setSoporteRadicadoLista] = useState({ data: [], links: [], meta: [] });
    const [getListaDetalleCambios, setListaDetalleCambios] = useState({ data: [], links: [], meta: [] });
    const [getSoporteSeleccionado, setSoporteSeleccionado] = useState('');
    const [getNombreProceso, setNombreProceso] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const mensajeDetalle = "Detalle del cambio en el soporte del radicado";

    // Columnas de la tabla
    const columns = [
        {
            name: 'REGISTRADO POR:',
            cell: documento_sirius => 
            <div>
                <strong>FUNCIONARIO: </strong>{documento_sirius.attributes.nombre_completo.toUpperCase()}<br/>
                <strong>DEPENDENCIA: </strong>{documento_sirius.attributes.usuario.toUpperCase()}<br/>
                <strong>ETAPA: </strong>{documento_sirius.attributes.etapa.nombre.toUpperCase()}<br />
                <strong>FASE: </strong>{documento_sirius.attributes.fase.nombre.toUpperCase()}<br />
                <strong>FECHA: </strong>{documento_sirius.attributes.created_at}<br />
            </div>,
            selector: documento_sirius => documento_sirius.attributes.nombre_completo,
            sortable: true,
            wrap: true,
            width: '300px'
        },

        {
            name: 'RADICADO',
            cell: documento_sirius => documento_sirius.attributes.sirius_track_id,
            selector: documento_sirius => documento_sirius.attributes.sirius_track_id,
            sortable: true,
            wrap: true,
            width: '200px'
        },

        {
            name: 'DESCRIPCIÓN',
            cell: documento_sirius =>
                <div>
                    <span data-toggle="modal" data-target={"#q"+documento_sirius.id}>{documento_sirius.attributes.descripcion_corta.toUpperCase()}</span>

                    <div className="modal fade" id={"q"+documento_sirius.id} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                            <div className="modal-header block.block-themed">
                                <h5 className="modal-title" id="descriptionModalLabel">{getNombreProceso} :: SOPORTES DEL RADICADO</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {documento_sirius.attributes.descripcion.toUpperCase()}
                            </div>                  
                            </div>
                        </div>
                    </div>

                  
                </div>,


            selector: documento_sirius => documento_sirius.attributes.descripcion,
            sortable: true,
            wrap: true,
            width: '650px'
        },

        
        {
            name: 'ACCIONES',
            cell: documento_sirius => <div className='row'>
                <div className='col-3'>
                    <button type='button' title='Descargar documento' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo(documento_sirius)}><i className="fas fa-download" data-toggle="tooltip" data-placement="top" title={documento_sirius.attributes.nombre_archivo}></i></button>
                </div>
                <div className='col-3'>
                    <button type='button' title='Consultar Descripcion' className='btn btn-sm btn-primary' data-toggle="modal" onClick={() => cargarDetalleCambiosEstado(documento_sirius)} data-target={'#modal-consultar-detalle'}><i className="fas fa-search"></i></button>
                </div>
                <div className='col'>
                    {
                        (hasAccess('CR_SoporteRadicado', 'Inactivar') && from.mismoUsuarioBuscador) ? (
                            <div>
                                {
                                    (documento_sirius.attributes.estado == global.Constants.ESTADOS.INACTIVO) ? (
                                        <Link to={`/SoporteRadicadoCambiarEstadoForm/${documento_sirius.id}`} state={{ from: from, disable: disable }}>
                                            <button type='button' title='Activar Soporte' className='btn btn-sm btn-success' data-toggle="modal" data-target={'#modal-cambiar-estado'}><i className="fas fa-plus-circle"></i></button>
                                        </Link>
                                    ) : null
                                }
                                {
                                    (documento_sirius.attributes.estado == global.Constants.ESTADOS.ACTIVO && (soporteRadicadoLista.data.length > 1 || pageActual > 1)) ? (
                                        <Link to={`/SoporteRadicadoCambiarEstadoForm/${documento_sirius.id}`} state={{ from: from, disable: disable }}>
                                            <button type='button' title='Inactivar Soporte' className='btn btn-sm btn-danger'><i className="fas fa-minus-circle"></i></button>
                                        </Link>
                                    ) : null
                                }
                                <div className="modal fade" id={'modal-consultar-detalle'} tabIndex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                                    <div className="modal-dialog modal-xl" role="document" >
                                        <div className="modal-content">
                                            <div className="block block-themed block-transparent mb-0">
                                                <div className="block-header bg-primary-dark">
                                                    <h3 className="block-title">{mensajeDetalle.toUpperCase()}</h3>
                                                    <div className="block-options">
                                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                            <i className="fa fa-fw fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                {
                                                    (getListaDetalleCambios.data.length > 0) ? (
                                                        <div>
                                                            <div className="block-content">
                                                                <spam className="block-title">Historial de cambios en el soporte del radicado</spam>
                                                            </div>

                                                            <div className="block-content">
                                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                    <thead>
                                                                        <tr>
                                                                            <th width='30%'>REGISTRADO POR:</th>
                                                                            <th>OBSERVACIONES</th>                                                                       
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {listaDetalleCambios()}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    ) : null
                                                }
                                                <div className="block-content block-content-full text-right bg-light">
                                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal"> {global.Constants.BOTON_NOMBRE.CERRAR} </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </div>,
             width: '300px'
        }
    ];

    const [getRoutes, setRoutes] = useState({
        id_etapa: id_etapa,
        id_fase: global.Constants.FASES.SOPORTE_RADICADO,
        crear_registro: "/SoporteRadicadoForm",
        consultar_registros: "/SoporteRadicadoLista",
        adjuntar_documento: "/SoporteRadicadoForm",
        repositorio_documentos: "/SoporteRadicadoLista",
        modulo: "CR_SoporteRadicado",
        funcionalidad_crear: "Crear",
        funcionalidad_consultar: "Consultar",
        muestra_atras: true,
        muestra_inactivos: true,
    });

    // Constante de redireccionamiento
    const redirectToRoutes = () => {
        return <Navigate to={`/RamasProceso/`} state={{ from: from }} />;
    }

    // Funcion encargada de cargar la informacion de la clase
    useEffect(() => {

        // Se genera el metodo
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se setea el listado de activos
            setEstadoLista("Activos");

            // Se consulta el nombre del proceso
            nombreProceso();
        }

        // Se llama el metodo principal
        fetchData();
    }, []);

    // Metodo encargado de consultar el nombre del proceso
    const nombreProceso = () => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se consume la API
        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se cargan los documentos
                    cargarDocumentos(1, paganationPerPages, '1');

                    // Se setea el nombre del proceso
                    setNombreProceso(datos.data.attributes.nombre);
                }
            }
        )
    }

    // Metodo encargado de cargar los documentos
    const cargarDocumentos = (page, perPage, estado) => {

        // Se usa el cargando
        window.showSpinner(false);

        // Se inicializa la data
        const data = {
            "data": {
                "type": "documento_sirius",
                "attributes": {
                    "id_proceso_disciplinario": "id_proceso_disciplinario",
                    "id_etapa": id_etapa,
                    "id_fase": id_fase,
                    "url_archivo": "url_archivo",
                    "nombre_archivo": "nombre_archivo",
                    "estado": estado,
                    "file64": "file64",
                    "num_folios": "num_folios",
                    "num_radicado": "pendiente",
                    "extension": "doc",
                    "peso": "peso",
                    'per_page': perPage,
                    'current_page': page
                }
            }
        }

        // Se valida que tenga acceso a consultar los soportes del radicado
        if (hasAccess('CR_SoporteRadicado', 'Consultar')) {

            // Se consume la API
            DocumentoSiriusApi.getDocumentacionSiriusByIdProDisciplinario(data, procesoDisciplinarioId, perPage, page, estado, null).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se setean los datos
                        setSoporteRadicadoLista(datos);

                        // Se llama el metodo
                        cierreEtapa();
                    } else {

                        // Se manda el mensaje de error
                        setErrorApi(datos.error.toString())
                        window.showModal(1);
                        setIsRedirect(true);
                    }

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            )
        }
    }

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarDocumentos(page, perPage, (getEstadoLista == "Inactivos" ? '0' : "1"));
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarDocumentos(page, newPerPage, (getEstadoLista == "Inactivos" ? '0' : "1"));

    }

    const cargarDetalleCambiosEstado = (documento) => {

        // console.log('log-proceso-disciplinario/get-log-proceso', documento);
        setSoporteSeleccionado(documento);
        GenericApi.getByIdGeneric('log-proceso-disciplinario/get-log-proceso', documento.id).then(
            datos => !datos.error ? (setListaDetalleCambios(datos)) : (window.showModal(1)));
    }

    // Metodo encargado de cerrar la etapa
    function cierreEtapa() {

        // Se inicializa la variable
        const dataCierreEtapa = {
            "data": {
                "type": "cerrar_etapa",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": id_etapa,
                    "id_delegada": "id_delegada",
                    "id_funcionario": "id_funcionario"
                }
            }
        }

        // Se consume la API
        CierreEtapaApi.getCierreEtapaByIdProcesoDisciplinario(dataCierreEtapa).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se valida que tenga informacion
                    if (datos["data"].length > 0) {

                        // Se setea en true la etapa
                        setEstadoEtapaCapturaReparto(true);
                    }
                } else {

                    // Se setea el mensaje de error
                    setErrorApi(datos.error.toString());

                    // Se muestra el modal de error
                    window.showModal(1);
                }
            }
        )
    }

    const handleClicArchivo = (documento_sirius) => {
        try {
            window.showSpinner(true);
            //console.log("Datos a imprimir", documento_sirius.attributes.nombre_archivo);
            //let nombre_documento = documento_sirius.id;
            let nombre_documento = documento_sirius.attributes.nombre_archivo;
            let extension = documento_sirius.attributes.extension;
            let es_compulsa = false;

            if (documento_sirius.attributes.compulsa == '1') {
                es_compulsa = true;
            }

            const data = {
                "data": {
                    "type": "documeto_sirius",
                    "attributes": {
                        "id_documento_sirius": documento_sirius.id,
                        "extension": extension,
                        "es_compulsa": es_compulsa,
                        "radicado": from.radicado,
                        "vigencia": from.vigencia
                    }
                }
            }

            DocumentoSiriusApi.getDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        //console.log(datos.content_type);
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento, extension);
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
        }
    };

    const handleCallback = (childData) => {
        try {
            window.showSpinner(true);
            setEstadoLista(childData == global.Constants.ESTADOS.INACTIVO ? "Inactivos" : "Activos")
            cargarDocumentos(1, paganationPerPages, childData);
        } catch (error) {
        }
    }

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    // Metodo encargado de listar el detalle del soporte del radicado
    const listaDetalleCambios = () => {

        // Se valida que la informacion sea diferente de null y undefined
        if (getListaDetalleCambios.data != null && typeof (getListaDetalleCambios.data) != 'undefined') {

            // Se retorna
            return (

                // Se recorre la informacion
                getListaDetalleCambios.data.map((cambio, i) => {

                    // Se retorna cada columna con su información
                    return (
                        <tr key={cambio.id}>
                            <td>
                                <strong>FUNCIONARIO: </strong>{cambio.attributes.created_user.toUpperCase()}<br/>
                                <strong>DEPENDENCIA: </strong>{cambio.attributes.dependencia_origen ? cambio.attributes.dependencia_origen.nombre.toUpperCase() : ""}<br/>
                                <strong>FECHA: </strong>{cambio.attributes.created_at}<br/>
                            </td>
                            <td>
                                {cambio.attributes.descripcion.toUpperCase()}
                            </td>                           
                        </tr>
                    )
                })
            )
        }
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {isRedirect ? redirectToRoutes() : null}
            <Formik>
                <Form>
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Lista de soportes del radicado</small></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="block block-themed">
                        <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                            <h3 className="block-title">{getNombreProceso.toUpperCase()} :: <strong>CONSULTAR LISTA SOPORTES DEL RADICADO</strong></h3>
                        </div>
                        <div className="block-content">
                            <>
                                {
                                    (hasAccess('CR_SoporteRadicado', 'Consultar')) ? (
                                        <div className='row'>
                                            <div className='col-md-3'>
                                                <div className="form-group ">
                                                    <Field type="text" id="search" name="search" onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                                                </div>
                                            </div>
                                            <ListaBotones getRoutes={getRoutes} from={from} disable={disable} parentCallback={handleCallback}  mostrarBotonAgregar={hasAccess('CR_SoporteRadicado', 'Crear')} id="botonesNavegacion" name="botonesNavegacion" />
                                        </div>
                                    ) : null
                                }
                                {
                                    (hasAccess('CR_SoporteRadicado', 'Consultar')) ? (
                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                            columns={columns}
                                            data={soporteRadicadoLista.data.filter((suggestion) => {
                                                if (getSeach === "") {
                                                    return suggestion;
                                                } else if (
                                                    (((suggestion.attributes.etapa ? quitarAcentos(suggestion.attributes.etapa.nombre) : "")
                                                        + (suggestion.attributes.fase ? quitarAcentos(suggestion.attributes.fase.nombre) : "")
                                                        + quitarAcentos(suggestion.attributes.nombre_completo)
                                                        + quitarAcentos(suggestion.attributes.nombre_archivo)
                                                        + suggestion.attributes.created_at + suggestion.attributes.id_etapa +
                                                        suggestion.attributes.id_fase).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))
                                                ) {
                                                    return suggestion;
                                                }
                                            })}
                                            perPage={perPage}
                                            page={pageActual}
                                            pagination
                                            noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                            paginationTotalRows={soporteRadicadoLista.data.length}
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
export default SoporteRadicadoLista;