import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import EntidadInvestigadoApi from "../../Api/Services/EntidadInvestigadoApi";
import ClasificacionRadicadoApi from "../../Api/Services/ClasificacionRadicadoApi";
import { Navigate } from "react-router-dom";
import CierreEtapaApi from '../../Api/Services/CierreEtapaApi';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import { hasAccess } from '../../../components/Utils/Common';
import ListaBotones from '../../Utils/ListaBotones';
import GenericApi from './../../Api/Services/GenericApi';
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';
import { quitarAcentos } from '../../../components/Utils/Common';

import ModalGen from '../../Utils/Modals/ModalGeneric';

function EntidadInvestigadoLista() {

    const [errorApi, setErrorApi] = useState('');
    const [estadoEtapaCapturaReparto, setEstadoEtapaCapturaReparto] = useState(false);
    const [getEstadoLista, setEstadoLista] = useState('');
    const [getListaDetalleCambios, setListaDetalleCambios] = useState({ data: [], links: [], meta: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [entidadInvestigadoLista, setEntidadInvestigadoLista] = useState({ data: [], links: [], meta: [] });
    const [getEntidadSeleccionado, setEntidadSeleccionado] = useState('');
    const [getClasificacionRadicado, setClasificacionRadicado] = useState({ data: [], links: [], meta: [] });
    const [getValidar, setValidar] = useState(null);
    const [getMostrarBotonAgregar, setMostrarBotonAgregar] = useState(null);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getQuejaInterna, setQuejaInterna] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');

    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let vigencia = from.vigencia;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    //let quejaInterna = from.quejaInterna;

    let numeroLlamados = 0;
    let numeroTotalLlamados = 5;

    const columns = [
        {
            name: 'REGISTRADO POR',

            cell: entidad =>
                <div className='text-uppercase'>
                    <strong>USUARIO:</strong> {entidad.attributes.nombre_completo}<br />
                    <strong>ETAPA:</strong> {entidad.attributes.nombre_etapa}<br />
                    <strong>FECHA:</strong> {entidad.attributes.created_at}<br />
                    <strong>DEPENDENCIA:</strong> {entidad.attributes.usuario}
                </div>,

            selector: entidad => entidad.attributes.nombre_completo,
            sortable: true,
            width: "35%"
        },

        {
            name: 'DESCRIPCIÓN',
            selector: entidad => entidad.attributes.created_at,
            cell: entidad =>
                <div  className='text-uppercase'>
                    <strong>NOMBRE DEL INVESTIGADO:</strong> {entidad.attributes.nombre_investigado}<br />
                    <strong>CARGO DEL INVESTIGADO:</strong> {entidad.attributes.cargo}<br />
                    <strong>ENTIDAD:</strong> {entidad.attributes.nombre_entidad}<br />
                    <strong>SECTOR:</strong> {entidad.attributes.nombre_sector}<br />
                    <strong>OBSERVACIONES:</strong> <span data-toggle="modal" data-target={"#q"+entidad.id}>{entidad.attributes.observacion_corta}</span> <br />
                    
                    <div className="modal fade" id={"q"+entidad.id} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                            <div className="modal-header block.block-themed">
                                <h5 className="modal-title" id="descriptionModalLabel">{getNombreProceso} :: ENTIDAD DEL INVESTIGADO</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                   {entidad.attributes.observaciones}
                            </div>                  
                            </div>
                        </div>
                    </div>
                    
                </div>
            ,
            sortable: true,
            width: "40%"

        },
        {
            name: 'ESTADO',
            selector: entidad => entidad.attributes.created_at,
            cell: entidad =>
                <div>
                    {entidad.attributes.nombre_estado}<br />
                    {
                        (entidad.attributes.observaciones_estado) ? (
                            <small><strong>JUSTIFICACIÓN DEL CAMBIO DE ESTADO:</strong> {entidad.attributes.observaciones_estado}<br /></small>
                        ) : null
                    }
                </div>,
            sortable: true,
            width: "10%"

        },

        {
            name: 'ACCIONES',
            cell: entidad =>
                <div className='row'>
                    <div className='col-4'>
                        <button type='button' title='Ver detalle Entidad del Investigado' className='btn btn-sm btn-success' data-toggle="modal" onClick={() => cargarDetalleCambiosEstado(entidad)} data-target={'#modal-consultar-detalle'}><i className="fas fa-search"></i></button>
                    </div>
                    <div className='col'>

                        {
                            (hasAccess('CR_EntidadInvestigado', 'Inactivar') && from.mismoUsuarioBuscador) ? (
                                <div>
                                    {
                                        (entidad.attributes.estado == global.Constants.ESTADOS.INACTIVO) ? (
                                            <Link to={`/EntidadInvestigadoCambiarEstadoForm/${entidad.id}`} state={{ from: from, disable: disable }}>
                                                <button type='button' title='Activar Entidad' className='btn btn-sm btn-success' data-toggle="modal" data-target={'#modal-cambiar-estado'}><i className="fas fa-plus-circle"></i></button>
                                            </Link>
                                        ) : null
                                    }

                                    {
                                        (entidad.attributes.estado == global.Constants.ESTADOS.ACTIVO && (entidadInvestigadoLista.data.length > 1 || pageActual > 1)) ? (
                                            <Link to={`/EntidadInvestigadoCambiarEstadoForm/${entidad.id}`} state={{ from: from, disable: disable }}>
                                                <button type='button' title='Inactivar Entidad' className='btn btn-sm btn-danger'><i className="fas fa-minus-circle"></i></button>
                                            </Link>
                                        ) : null
                                    }

                                    <div className="modal fade" id={'modal-consultar-detalle'} tabindex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                                        <div className="modal-dialog modal-xl" role="document" >
                                            <div className="modal-content">
                                                <div className="block block-themed block-transparent mb-0">
                                                    <div className="block-header bg-primary-dark">
                                                        <h3 className="block-title">ENTIDAD DEL INVESTIGADO :: HISTORICO DEL CAMBIO</h3>
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
                                                                    <spam className="block-title">HISTORIAL DE CAMBIOS DEL INVESTIGADO</spam>
                                                                </div>

                                                                <div className="block-content" style={{ 'height': '600px', 'overflow': 'scroll', 'display': 'block' }}>
                                                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full ">
                                                                        <thead>
                                                                            <tr>
                                                                                <th width="30%">REGISTRADO POR</th>
                                                                                <th>DESCRIPCIÓN</th>
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
                                                        <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.CERRAR}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        (getValidar) ? (
                                            <Link to={`/EntidadInvestigadoQuejaInterna`} state={{ from: from }}>
                                                <div className='col-2'>
                                                    <button type='button' title='Validar preguntas' className='btn btn-sm btn-primary' ><i className="fas fa-edit"></i></button>
                                                </div>
                                            </Link>
                                        ) : null
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            , width: "15%"
        }
    ];

    const [getRoutes, setRoutes] = useState({
        id_etapa: 1,
        id_fase: global.Constants.FASES.ENTIDAD_INVESTIGADO,
        crear_registro: "/EntidadInvestigadoForm",
        consultar_registros: "/EntidadInvestigadoLista",
        adjuntar_documento: "/SoporteRadicadoForm",
        repositorio_documentos: "/SoporteRadicadoLista",
        modulo: "CR_EntidadInvestigado",
        muestra_atras: true,
        muestra_inactivos: true,
    });

    useEffect(() => {
        async function fetchData() {

            // Se habilita el cargando
            window.showSpinner(true);

            // Se setea el valor de la lista a activos
            setEstadoLista("Activos");

            // Se cargan los datos del investigado
            cargarDatosInvestigado(1, paganationPerPages, global.Constants.ESTADOS.ACTIVO);

            // Se setean los valores del array
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

            // Se consume la API
            GenericApi.getByDataGeneric('cierre-etapa/get-cierre-etapa', dataCierreEtapa).then(

                // Se inicializa la variable de la peticion
                datos => {

                    validacionSpinner()

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se valida que haya una longitud
                        if (datos["data"].length > 0) {

                            // Se setea el valor en true
                            setEstadoEtapaCapturaReparto(true);
                        }
                    } else {

                        // Se setea el valor del modal
                        setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO ", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )


        }
        fetchData();
    }, []);

    // Funcion para validar y detener el spinner
    const validacionSpinner = () => {
        numeroLlamados++
        if(numeroLlamados >= numeroTotalLlamados){
            window.showSpinner(false);
        }
    }


    const listaDetalleCambios = () => {
        if (getListaDetalleCambios.data != null && typeof (getListaDetalleCambios.data) != 'undefined') {
            return (

                getListaDetalleCambios.data.map((cambio, i) => {
                    return (
                        <tr key={cambio.id}>
                            <td>
                                <strong>FUNCIONARIO: </strong>{cambio.attributes.funcionario_registra ? cambio.attributes.funcionario_registra.nombre.toUpperCase() + ' ' + cambio.attributes.funcionario_registra.apellido.toUpperCase() : ""}<br/>
                                <strong>DEPENDENCIA: </strong>{cambio.attributes.dep_funcionario_registra ? cambio.attributes.dep_funcionario_registra.nombre : ""}<br/>
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

    const cargarDetalleCambiosEstado = (entidad) => {
        setEntidadSeleccionado(entidad)
        window.showSpinner(true);
        GenericApi.getByIdGeneric('log-proceso-disciplinario/get-log-proceso', entidad.id).then(
            datos => {
                if (!datos.error) {
                    setListaDetalleCambios(datos)
                }
                else {
                    window.showModal(1)
                }
                window.showSpinner(false);
            }
        );
    }

    const cargarDatosInvestigado = (page, perPage, estado) => {

        const data = {
            "data": {
                "type": "entidad_investigado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": "1",
                    "requiere_registro": true,
                    "estado": estado,
                    'per_page': perPage,
                    'current_page': page
                }
            }
        }

        if (hasAccess('CR_EntidadInvestigado', 'Consultar')) {

            //GenericApi.getByDataGeneric('entidad-investigado/get-entidad-investigado/'.procesoDisciplinarioId, data).then(
            EntidadInvestigadoApi.getAllEntidadInvestigadoByIdProDisciplinario(data, procesoDisciplinarioId).then(
                datos => {

                    validacionSpinner()

                    if (!datos.error) {

                        setEntidadInvestigadoLista(datos)

                        if (datos) {
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


                            ClasificacionRadicadoApi.getAllClasificacionRadicadoByIdProDisciplinario(data, procesoDisciplinarioId).then(
                                datosClasificacion => {

                                    validacionSpinner()

                                    if (!datosClasificacion.error) {

                                        if (datosClasificacion.data.length > 0) {

                                            let datosClas = datosClasificacion.data[0]["attributes"];
                                            var datosProcesoDisciplinario;

                                            if (datosClas) {
                                                from.subTipoExpediente = datosClasificacion.data[0]["attributes"];

                                                if (datosClas["expediente"]) {
                                                    let tipoExpediente = datosClas["expediente"]["id"];

                                                    if (datosClas["tipo_queja"]) {
                                                        let tipoQueja = datosClas["tipo_queja"]["id"];

                                                        if (tipoExpediente == 3 && tipoQueja == 2) {

                                                            if (datosClas["proceso_disciplinario"]) {

                                                                let dependenciaUsuario = datosClas["proceso_disciplinario"]["id_dependencia"];

                                                                if (dependenciaUsuario == 418) {

                                                                    setMostrarBotonAgregar(false);
                                                                    from.quejaInterna = true;
                                                                    from.datosQuejaInterna = datos.data[0];
                                                                    from.datosQuejaInterna.codigoPostal = "110311";
                                                                    from.datosQuejaInterna.correo = "PENDIENTE";
                                                                    from.datosQuejaInterna.telefono = "3820450";
                                                                    from.datosQuejaInterna.direccion = "CRA. 7 # 21-24";
                                                                    from.datosQuejaInterna.paginaWeb = "HTTPS://WWW.PERSONERIABOGOTA.GOV.CO";
                                                                    setValidar(true);
                                                                }
                                                            }
                                                        }
                                                    }

                                                }

                                                // if ()
                                            }

                                            setClasificacionRadicado(datosClasificacion);
                                        }
                                    } else {
                                        setErrorApi(datosClasificacion.error.toString())
                                        window.showModal()
                                    }
                                }
                            )

                        }

                        validarTipoExpedienteQuejaInterna();

                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal();
                    }

                }
            )
        }
        else {
            window.showSpinner(false)
        }
    }


    const validarTipoExpedienteQuejaInterna = () => {

        GenericApi.getGeneric("validar-tipo-expediente-queja-interna/" + procesoDisciplinarioId).then(
            datos => {

                validacionSpinner()

                if (!datos.error) {
                    if (datos.data.attributes.queja_interna) {
                        setMostrarBotonAgregar(false);
                    }
                    else {
                        setMostrarBotonAgregar(true);
                    }

                    nombreProceso();
                }
            }
        )
    }


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {

                validacionSpinner()

                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }
                window.showSpinner(false);
            }
        )
    }

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarDatosInvestigado(page, perPage, (getEstadoLista == "Inactivos" ? '0' : "1"));
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarDatosInvestigado(page, newPerPage, (getEstadoLista == "Inactivos" ? '0' : "1"));

    }

    const handleCallback = (childData) => {
        try {
            window.showSpinner(true)
            setEstadoLista(childData == global.Constants.ESTADOS.INACTIVO ? "Inactivos" : "Activos")
            cargarDatosInvestigado(1, paganationPerPages, childData);
        } catch (error) {

        }

    }


    return (
        <>

            {<Spinner />}
            <Formik>
                <Form>

                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Lista de entidades del investigado</small></li>
                            </ol>
                        </nav>
                    </div>

                    <div className="block block-themed">
                        <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                            <h3 className="block-title">{getNombreProceso} :: ENTIDAD DEL INVESTIGADO <strong> {getEstadoLista.toUpperCase()}</strong></h3>
                        </div>

                        <div className="block-content">
                            <>

                                <div className='row'>

                                    <div className='col-md-3'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                        </div>
                                    </div>

                                    {/*ListaBotones(getRoutes)*/}
                                    {getMostrarBotonAgregar != null ? (
                                        <ListaBotones getRoutes={getRoutes} from={from} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />
                                    ) : null}


                                </div>


                                {
                                    (hasAccess('CR_EntidadInvestigado', 'Consultar')) ? (
                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                            columns={columns}
                                            data={entidadInvestigadoLista.data.filter((suggestion) => {
                                                if (getSeach === "") {
                                                    return suggestion;
                                                } else if (
                                                    ((suggestion.attributes.created_at +
                                                        quitarAcentos(suggestion.attributes.nombre_investigado) +
                                                        quitarAcentos(suggestion.attributes.cargo) +
                                                        quitarAcentos(suggestion.attributes.observaciones) +
                                                        quitarAcentos(suggestion.attributes.nombre_entidad) + 
                                                        quitarAcentos(suggestion.attributes.nombre_sector) + 
                                                        quitarAcentos(suggestion.attributes.usuario) +
                                                        quitarAcentos(suggestion.attributes.nombre_estado)
                                                        ).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))
                                                ) {
                                                    return suggestion;
                                                }
                                            })}
                                            perPage={perPage}
                                            page={pageActual}
                                            pagination
                                            noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                            paginationTotalRows={entidadInvestigadoLista.data.length}
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
export default EntidadInvestigadoLista;
