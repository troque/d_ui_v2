import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import Spinner from '../Utils/Spinner';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import ModalInfo from '../Utils/Modals/ModalInformacion';

function PortalNotificacionesLista() {

    // Se inicializan las variables
    const [getPortalNotificacionesLista, setPortalNotificacionesLista] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });

    
    const [getRadicado, setRadicado] = useState('');
    const [getVigencia, setVigencia] = useState('');
    const [getResultadoNotificacionesLista, setResultadoNotificacionesLista] = useState(false);

    // Se inicializan las rutas
    const [getRoutes, setRoutes] = useState({
        crear_registro: "/PortalNotificaciones/Add",
        consultar_registros: "/PortalNotificaciones",
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_activos: true,
        muestra_inactivos: true,
        muestra_atras: false,
        ocultar_agregar: true,
        modulo: 'ADMIN_PortalWeb'
    });

    // Metodo encargado de mostrar la lista inactiva
    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }

    }

    // Columnas de la tabla
    const columns = [
        {
            name: 'FECHA',
            selector: p => p.attributes.informacionPortalNotificaciones.attributes.fecha_registro ? p.attributes.informacionPortalNotificaciones.attributes.fecha_registro : "",
            wrap: true,
            sortable: true,
            width: '200px'
        },
        {
            name: 'INTERESADO',
            selector: p =>informacionInteresado(p),
            wrap: true,
            sortable: true,
            width: '400px'
        },
        {
            name: 'PROCESO',
            selector: p =><div>
                <strong>RADICADO:</strong> {p.attributes.informacionProcesoDisciplinario.attributes.radicado ? p.attributes.informacionProcesoDisciplinario.attributes.radicado : "-"}<br />
                <strong>VIGENCIA:</strong> {p.attributes.informacionProcesoDisciplinario.attributes.vigencia ? p.attributes.informacionProcesoDisciplinario.attributes.vigencia : "-"}<br />
            </div>,
            wrap: true,
            sortable: true,
            width: '400px'
        },
        {
            name: 'NOTIFICACIÓN',
            selector: p =>informacionNotificacion(p),
            wrap: true,
            sortable: true,
            width: '600px'
        },
        {
            name: 'DOCUMENTO',
            selector: p =>
                <div>
                    <button type='button'
                        title="Descargar documento"
                        onClick={() => handleClicArchivo(p.attributes.informacionDocumentosPortalWeb.uuid)}
                        className='btn btn-sm btn-primary'
                        data-toggle="modal"><i className="fas fa-download"></i>
                    </button>
                </div>
            ,
            wrap: true,
            sortable: true,
            width: '200px'
        },
        {
            name: 'ACCIONES',
            selector: p =>
                <div>
                    {
                        (p.attributes.informacionPortalNotificaciones.attributes.estado == 0) ? (
                            <Link to={`/PortalNotificacionesCambiarEstadoForm/${p.attributes.informacionPortalNotificaciones.id}`} state={{ getActuacionConFirmas: null, from: null, selected_id_etapa: null, id: null, nombre: null, estadoActualActuacion: null, titulo: null, valor: null, solicitante: null, tipoActuacion: null, nombreTipoActuacion: null, actuacionIdMaestra: null, detalles_actuacion: null, disable: null }}>
                                <button type='button' title='Activar Antecedente' className='btn btn-sm btn-success' data-toggle="modal" data-target={'#modal-cambiar-estado'}><i className="fas fa-plus-circle"></i></button>
                            </Link>
                        ) : null
                    }

                    {
                        (p.attributes.informacionPortalNotificaciones.attributes.estado == 1) ? (
                            <Link to={`/PortalNotificacionesCambiarEstadoForm/${p.attributes.informacionPortalNotificaciones.id}`} state={{ getActuacionConFirmas: null, from: null, selected_id_etapa: null, id: null, nombre: null, estadoActualActuacion: null, titulo: null, valor: null, solicitante: null, tipoActuacion: null, nombreTipoActuacion: null, actuacionIdMaestra: null, detalles_actuacion: null, disable: null }}>
                                <button type='button' title='Inactivar Antecedente' className='btn btn-sm btn-danger'><i className="fas fa-minus-circle"></i></button>
                            </Link>


                        ) : null
                    }
                </div>
            ,
            wrap: true,
            sortable: true,
            width: '200px'
        },
    ];

    // Metodo encargado de buscar el documento de la notificacion
    const handleClicArchivo = (uuidNotificacion) => {

        // Se utiliza un trycacht para capturar el error
        try {

            // Se inicializa el cargando
            window.showSpinner(true);

            // Se genera la peticion para descargar el archivo
            GenericApi.getGeneric("portal-notificaciones/get-documento/" + uuidNotificacion).then(

                // Se inicializa la variable
                datos => {

                    // Se captura la informacion
                    let nombre_documento = datos.nombre_documento;

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se manda al conversor de B64
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento);
                    } else {

                        // Se envia el mensaje
                        setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
                    }

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            // Se imprime el error
            console.error(error);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    // Metodo encargado de generar la informacion del interesado
    const informacionInteresado = (p) => {

        // Se inicializa en una constante la informacion en HTML
        const div =
            <div className='mb-3'>
                <strong>N° DOCUMENTO:</strong> {p.attributes.informacionDatosInteresados.attributes.numero_documento ? p.attributes.informacionDatosInteresados.attributes.numero_documento : "-"}<br />
                <strong>TIPO DE DOCUMENTO:</strong> {(p.attributes.informacionDatosInteresados.attributes.tipo_documento == 1 ? "CÉDULA DE CIUDADANÍA" :
                    p.attributes.informacionDatosInteresados.attributes.tipo_documento == 2 ? "CÉDULA DE EXTRANJERÍA" :
                        p.attributes.informacionDatosInteresados.attributes.tipo_documento == 3 ? "PASAPORTE" : "NO INFORMA")}<br />
                <strong>NOMBRE:</strong> {p.attributes.informacionDatosInteresados.attributes.primer_nombre + " " +
                    p.attributes.informacionDatosInteresados.attributes.segundo_nombre + " " +
                    p.attributes.informacionDatosInteresados.attributes.primer_apellido + " " +
                    p.attributes.informacionDatosInteresados.attributes.segundo_apellido}
                <br />
            </div>;

        // Se retorna la constante HTML
        return div;
    }

    // Metodo encargado de generar la informacion de la notificación
    const informacionNotificacion = (p) => {

        // Se inicializa en una constante la informacion en HTML
        const div =
            <div className='mb-3 text-uppercase'>
                <strong>DETALLE DE LA NOTIFICACIÓN: </strong>
                {p.attributes.informacionPortalNotificaciones.attributes.detalle_incompleto ?
                    p.attributes.informacionPortalNotificaciones.attributes.detalle_incompleto + "... " : "-"}

                {p.attributes.informacionPortalNotificaciones.attributes.detalle ?
                    <button type="button"
                        data-toggle="popover"
                        data-placement="top"
                        data-tooltip-suffix="Sales"
                        data-detalle={p.attributes.informacionPortalNotificaciones.attributes.detalle}
                        title="Ver detalle"
                        className="btn btn-sm btn-light mr-2"
                        onClick={() => verDetalle(p.attributes.informacionPortalNotificaciones.attributes.detalle)}>
                        <span className="fa fa-search" />
                    </button>
                    : ""}
                < br />
                <strong>USUARIO QUE ENVÍA:</strong> {p.attributes.informacionPortalNotificaciones.attributes.usuario_envia ? p.attributes.informacionPortalNotificaciones.attributes.usuario_envia : "-"}<br />
                <strong>INFORMACIÓN DEL PROCESO DISCIPLINARIO:</strong> {p.attributes.informacionAntecedentes.attributes.descripcion ? p.attributes.informacionAntecedentes.attributes.descripcion : "-"}<br />
                <strong>TIPO DE PROCESO:</strong> {p.attributes.informacionProcesoDisciplinario.attributes.nombre_tipo_proceso ? p.attributes.informacionProcesoDisciplinario.attributes.nombre_tipo_proceso : ""}<br />
                <strong>FECHA DE REGISTRO:</strong> {p.attributes.informacionProcesoDisciplinario.attributes.fecha_registro ? p.attributes.informacionProcesoDisciplinario.attributes.fecha_registro : ""} <br />
                <strong>ACTUACIÓN:</strong> {p.attributes.informacionPortalNotificaciones.attributes.actuacion.length > 0 ? (p.attributes.informacionPortalNotificaciones.attributes.actuacion[0].nombre_actuacion + " - " + p.attributes.informacionPortalNotificaciones.attributes.actuacion[0].auto) : ""} <br />
            </div >;

        // Se retorna la constante HTML
        return div;
    }

    // Metodo encargado de realizar la primera peticion del formulario
    useEffect(() => {

        async function fetchData() {

            // Se activa el cargando
            //window.showSpinner(true);

            // Se carga la informacion del portal de notificaciones
            //cargarPortalLog(1, paganationPerPages);
        }
        fetchData();
    }, []);

    // Metodo encargado de ver el detalle de la notificacion
    const verDetalle = (detalle) => {

        // Se abre el modal
        setModalState({ title: "Detalle notificación", message: detalle, show: true });
    }

    // Metodo encargado de cargar la informacion del portal
    /*const cargarPortalLog = (page, perPage) => {

        // Se inicializa la API
        GenericApi.getGeneric('portal-notificaciones').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea la informacion
                    setPortalNotificacionesLista(datos);

                    // Se inactiva el cargando
                    window.showSpinner(false);
                } else {

                    // Se setea la informacion
                    window.showModal();

                    // Se inactiva el cargando
                    window.showSpinner(false);
                }
            }
        )
    }*/

    // Metodo encargado de setear el valor de la pagina
    const handlePageChange = page => {
        setPageActual(page);
    }

    // Metodo encargado de ver la informacion cada vez que se cambia
    const handlePerRowsChange = async (newPerPage, page) => {

        // Se setean los valores
        setPerPage(newPerPage);
        setPageActual(page);
    }

    const buscarNotificaciones = () => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('portal-notificaciones-proceso/'+getRadicado+'/'+getVigencia).then(
            datos => {
                if (!datos.error) {
                    setResultadoNotificacionesLista(true)
                    setPortalNotificacionesLista(datos)
                } else {
                    window.showModal();
                    setResultadoNotificacionesLista(false)
                }
                window.showSpinner(false);
            }
        )
    }

    return (
        <div>
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Portal Web</small></li>
                        <li className="breadcrumb-item"> <small>Notificaciones</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            {< ModalInfo data={getModalState} />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES</h3>
                </div>
                <div className="block-content">
                    <div className='col-md text-right ms-auto'>
                        <Link to='/PortalNotificaciones/Add'>
                            <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus"></i> </button>
                        </Link>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="descripcion">RADICADO <span className="text-danger">*</span></label>
                                <input type="text" id="radicado" name="radicado" onChange={e => setRadicado(e.target.value)} className="form-control border border-success" placeholder="Radicado" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="descripcion">VIGENCIA <span className="text-danger">*</span></label>
                                <input type="text" id="vigencia" name="vigencia" onChange={e => setVigencia(e.target.value)} className="form-control border border-success" placeholder="Vigencia" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <br></br>
                                <button type="button" className="btn btn-primary" onClick={() => buscarNotificaciones()} disabled={!getRadicado || !getVigencia}>
                                    <i className="fa fa-fw fa-search"></i> BUSCAR
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        getResultadoNotificacionesLista
                        ?
                            (
                                getPortalNotificacionesLista.data.length > 0
                                ?
                                    <>
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
                                                    data={getPortalNotificacionesLista.data.filter((suggestion) => {
                                                        if (getSeach === "") {
                                                            if (suggestion.attributes.informacionPortalNotificaciones.attributes.estado == getEstadoLista) {
                                                                return suggestion;
                                                            }
                                                        } else if (
                                                            ((suggestion.id
                                                                + quitarAcentos(suggestion.attributes.informacionPortalNotificaciones.attributes.fecha_registro)
                                                                + quitarAcentos(suggestion.attributes.informacionDatosInteresados.attributes.numero_documento)
                                                                + quitarAcentos(suggestion.attributes.informacionDatosInteresados.attributes.primer_nombre)
                                                                + quitarAcentos(suggestion.attributes.informacionDatosInteresados.attributes.segundo_nombre)
                                                                + quitarAcentos(suggestion.attributes.informacionDatosInteresados.attributes.primer_apellido)
                                                                + quitarAcentos(suggestion.attributes.informacionDatosInteresados.attributes.segundo_apellido)
                                                                + quitarAcentos(suggestion.attributes.informacionPortalNotificaciones.attributes.detalle)
                                                                + quitarAcentos(suggestion.attributes.informacionPortalNotificaciones.attributes.usuario_envia)
                                                                + quitarAcentos(suggestion.attributes.informacionAntecedentes.attributes.descripcion)
                                                                + quitarAcentos(suggestion.attributes.informacionProcesoDisciplinario.attributes.vigencia)
                                                                + quitarAcentos(suggestion.attributes.informacionProcesoDisciplinario.attributes.nombre_tipo_proceso)
                                                                + quitarAcentos(suggestion.attributes.informacionProcesoDisciplinario.attributes.fecha_registro)
                                                                + (suggestion.attributes.informacionPortalNotificaciones.attributes.estado == "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase()))
                                                                && (suggestion.attributes.informacionPortalNotificaciones.attributes.estado == getEstadoLista))
                                                        ) {
                                                            return suggestion;
                                                        }
                                                    })}
                                                    perPage={perPage}
                                                    page={pageActual}
                                                    pagination
                                                    noDataComponent="Sin datos"
                                                    paginationTotalRows={getPortalNotificacionesLista.data.length}
                                                    onChangePage={handlePageChange}
                                                    onChangeRowsPerPage={handlePerRowsChange}
                                                    defaultSortFieldId="Nombre"
                                                    striped
                                                    paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                    defaultSortAsc={false}
                                                />

                                            </div>
                                        </div>
                                    </>
                                : 
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <p className='text-center'><label>NO SE ENCONTRARON DATOS</label></p>
                                        </div>
                                    </div>
                            )
                           
                        :
                            null
                    }                    
                </div>
            </div>
        </div>
    )
}

export default PortalNotificacionesLista;