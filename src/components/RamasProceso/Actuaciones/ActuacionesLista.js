import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../../Utils/InfoErrorApi';
import InfoExitoApi from '../../Utils/InfoExitoApi';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import ListaBotones from '../../Utils/ListaBotones';
import '../../Utils/Constants';
import { useLocation } from 'react-router-dom';
import { quitarAcentos, hasAccess, getUser } from '../../Utils/Common';

function ActuacionesLista() {

    const [errorApi, setErrorApi] = useState('');
    const [getEstadoLista, setEstadoLista] = useState('');
    const [getNombreEtapaSeleccionada, setNombreEtapaSeleccionada] = useState('');

    const location = useLocation()
    const { from, selected_id_etapa, disable } = location.state

    //Variables parametrizadas para la clase 
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getRutaParametrizada, setRutaParametrizada] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [getActuacionesListaSearch, setActuacionesListaSearch] = useState({ data: [], links: [], meta: [] });
    const [getActuacionesMigradasListaSearch, setActuacionesMigradasListaSearch] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoBoton, setEstadoBoton] = useState();
    const [getConsultarBoton, setConsultarBoton] = useState(false);

    let estado = 1;

    const [getRoutes, setRoutes] = useState({
        crear_registro: "/ActuacionesForm/",
        consultar_registros: "/ActuacionesLista/",
        ver_detalle: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/" + estado,
        muestra_atras: true,
        id_etapa: from.idEtapa,
        selected_id_etapa: selected_id_etapa,
        muestra_inactivos: true,
        modulo: "Actuaciones",
        funcionalidad_crear: "Crear",
        funcionalidad_consultar: "Consultar",
        ocultar_agregar: false
    });

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setEstadoLista("Activos");
            nombreProceso();
            // cargarUsuarioComisionado();
            // cargarFuncionarioAsignado();
        }
        fetchData();
    }, []);

    /**
     * LLAMADO DE FUNCIONES AL SERVIDOR
    */

    //Obtener el nombre del proceso
    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    obtenerDatosDeLaEtapaSeleccionada();
                    // validarPermisosCrearActuaciones();
                    // cargarActuacionesMigradas();
                }
            }
        )
    }

    const obtenerDatosDeLaEtapaSeleccionada = () => {
        GenericApi.getGeneric('mas-etapa/' + selected_id_etapa).then(
            datos => {
                if (!datos.error) {
                    setNombreEtapaSeleccionada(datos.data.attributes.nombre);
                    cargarActuaciones(1, paganationPerPages, global.Constants.ESTADOS.ACTIVO);
                }
            }
        )
    }

    // Metodo encargado de cargar las actuaciones por estado activo o inactivo
    const cargarActuaciones = (page, perPage, estado) => {

        // Se activa el cargando
        window.showSpinner(true);
        // Se consume la API
        GenericApi.getGeneric('actuaciones/get-actuaciones-discipl-etapa-documento-final/' + from.procesoDisciplinarioId + '/' + selected_id_etapa + '/' + estado).then(
            // Se inicializa la variable de respuesta
            datos => {
                // Se valida que no haya error
                if (!datos.error) {                    
                    // // Se setean los datos
                    setActuacionesListaSearch(datos)
                    cargarBotonHabilitado()

                    // // Se valida que haya data
                    // if (datos["data"] != "") {

                    //     // Se obtiene los datos de la ultima actuacion y se setea
                    //     obtenerLaUltimaActuacion(datos.data[0].attributes.actuacion.attributes.id_estado_actuacion, datos.data[0].attributes.actuacion.attributes.id_actuacion);
                    // } else {
                    //     // Se realiza la validacion para el boton de agregar con usuario comisionado
                    //     validacionDeBotonAgregar(0, 0, 0);
                    // }
                } else {
                    // Se setea el error
                    setErrorApi(datos.error.toString());
                    // Se muestra el modal
                    window.showModal(1);
                }
            }
        )
    }

    // Metodo encargado de cargar las actuaciones por estado activo o inactivo
    const cargarBotonHabilitado = () => {
        // Se activa el cargando
        window.showSpinner(true);
        // Se consume la API
        GenericApi.getGeneric('actuaciones/actuacion-boton-agregar-actuacion-habilitado/' + from.procesoDisciplinarioId).then(
            // Se inicializa la variable de respuesta
            datos => {
                // Se valida que no haya error
                if (!datos.error) {                    
                    // Se setean los datos
                    getRoutes.ocultar_agregar = datos.ocultar_boton
                    if(datos.crear_comisorio){
                        setRutaParametrizada('Comisorio')
                    }
                    else{
                        setRutaParametrizada('Actuación')
                    }
                    setRoutes(getRoutes)
                    setEstadoBoton(datos)
                    setConsultarBoton(true)
                    cargarActuacionesMigradas()
                } else {
                    // Se setea el error
                    setErrorApi(datos.error.toString());
                    // Se muestra el modal
                    window.showModal(1);
                }
            }
        )
    }

    const cargarActuacionesMigradas = () => {
        // Se activa el cargando
        window.showSpinner(true);
        // Se consume la API
        GenericApi.getGeneric('actuaciones/get-actuaciones-migradas/' + from.procesoDisciplinarioId).then(
            // Se inicializa la variable de respuesta
            datos => {
                // Se valida que no haya error
                if (!datos.error) {                    
                    // Se setean los datos
                    setActuacionesMigradasListaSearch(datos)
                } else {
                    // Se setea el error
                    setErrorApi(datos.error.toString());
                    // Se muestra el modal
                    window.showModal(1);
                }                
                window.showSpinner(false);
            }
        )
    }

    /**
     * LLAMADO DE FUNCIONES DE LA CLASE
     */
    const handleCallback = (childData) => {
        try {
            console.log(childData);
            setEstadoLista(childData == global.Constants.ESTADOS.INACTIVO ? "Inactivos" : "Activos");
            cargarActuaciones(1, paganationPerPages, childData);
        } catch (error) {

        }
    }

    const handlePageChange = page => {
        // Se usa el cargando
        window.showSpinner(true);
        // Se setea la pagina
        setPageActual(page);
        // Se cargan las actuaciones
        cargarActuaciones(page, perPage , getEstadoLista === "Inactivos" ? 0 : 1);
        // Se quita el cargando
        window.showSpinner(false);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        // Se usa el cargando
        setPerPage(newPerPage);
        // Se setea la pagina
        setPageActual(page);
        // Se cargan las actuaciones
        cargarActuaciones(page, newPerPage , getEstadoLista === "Inactivos" ? 0 : 1);
        // Se quita el cargando
        window.showSpinner(false);
    }

    const handleClicArchivo = (id_documento, extension, nombre_documento) => {
        // Se usa el cargando
        window.showSpinner(true);
        try {
            // Se consume la API
            GenericApi.getGeneric("archivo-actuaciones/get-documento/" + id_documento + "/" + extension).then(
                // Se inicializa la variable de respuesta
                datos => {
                    // Se valida que no haya error
                    if (!datos.error) {
                        // Se manda al metodo para generar el pdf
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento);
                    } else {
                        // Se quita el cargando
                        window.showSpinner(false);
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName) {
        // Se inicializan las constantes del documento en base 64
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        // Se crear el open file en una new tab
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        // Se quita el cargando
        window.showSpinner(false);
    }

    const columns = [
        {
            name: 'ACTUACIÓN',
            cell: actuaciones =>
                <div className="mt-2 mb-2 d-none d-sm-table-cell">
                    {actuaciones.attributes.actuacion.attributes.nombre_actuacion.toUpperCase()} <br />
                    {
                        actuaciones.attributes.actuacion.attributes.estado == "0" ?
                            <><small><strong>FECHA INACTIVACIÓN:</strong> {actuaciones.attributes.actuacion.attributes.updated_at}</small><br /></>
                            : null
                    }
                </div >
            ,
            selector: actuaciones => actuaciones.attributes.nombre_actuacion,
            sortable: true,
            width: "25%"
        },
        {
            name: 'INFORMACIÓN DE REGISTRO',
            cell: actuaciones =>
                <div className="mt-2 mb-2 d-none d-sm-table-cell">
                    <div className='row'>
                        <div className="col-10">
                            <small><strong>USUARIO:</strong> {actuaciones.attributes.actuacion.attributes.usuario.nombre + " " + actuaciones.attributes.actuacion.attributes.usuario.apellido + " (" + actuaciones.attributes.actuacion.attributes.id_dependencia.nombre + ")"}</small><br />
                            <small><strong>FECHA DE REGISTRO:</strong> {actuaciones.attributes.actuacion.attributes.fecha_registro}</small><br />
                            <small><strong>FECHA DE ACTUALIZACIÓN:</strong> {actuaciones.attributes.actuacion.attributes.updated_at}</small><br />
                        </div>
                    </div>
                </div>,
            selector: actuaciones => actuaciones.attributes.actuacion.attributes.created_user,
            sortable: true,
            width: "23%"
        },
        {
            name: 'INFORMACIÓN APROBACIÓN/RECHAZO',
            cell: actuaciones =>
                actuaciones.attributes.UsuarioAprobacion != null ? (
                    < div className="mt-2 mb-2 d-none d-sm-table-cell" >
                        <div className='row'>
                            <div className="col-10">
                                <small><strong>USUARIO:</strong> {actuaciones.attributes.UsuarioAprobacion.attributes.usuario.nombre + " " + actuaciones.attributes.UsuarioAprobacion.attributes.usuario.apellido}</small><br />
                                <small><strong>FECHA DE REGISTRO:</strong> {actuaciones.attributes.UsuarioAprobacion.attributes.created_at}</small><br />
                                <small><strong>N° DE AUTO:</strong> {actuaciones.attributes.actuacion.attributes.auto ? actuaciones.attributes.actuacion.attributes.auto : "SIN NÚMERO DE AUTO"}</small><br />
                            </div>
                        </div>
                    </div >
                ) : null,
            selector: actuaciones => actuaciones.attributes.actuacion.attributes.usuario_accion,
            sortable: true,
            width: "23%"
        },
        {
            name: 'ESTADO',
            cell: actuaciones => actuaciones.attributes.actuacion.attributes.nombre_estado_actuacion.toUpperCase(),
            selector: actuaciones => actuaciones.attributes.actuacion.attributes.nombre_estado_actuacion.toUpperCase(),
            sortable: true,
            width: "10%"
        },
        {
            name: 'N° AUTO',
            cell: actuaciones =>
                actuaciones.attributes.ArchivoFinalPdf != null ? (
                    <div className='row'>
                        <div className='col-4'>
                            <div className='row'>
                                <div className='col-4'>
                                    <button type='button' title={actuaciones.attributes.actuacion.attributes.auto} onClick={() => handleClicArchivo(actuaciones.attributes.ArchivoFinalPdf.id, actuaciones.attributes.ArchivoFinalPdf.attributes.extension, actuaciones.attributes.ArchivoFinalPdf.attributes.nombre_archivo)} className='btn btn-sm btn-primary' data-toggle="modal"><i className="fas fa-download"></i></button>
                                </div>
                            </div >
                        </div>
                    </div>
                ) : null
            ,
            sortable: true,
            width: "8%"
        },
        {
            name: 'DETALLE',
            cell: actuaciones =>
                <div>
                    <Link to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: actuaciones.attributes.actuacion.id, nombre: actuaciones.attributes.actuacion.attributes.nombre_actuacion, estadoActualActuacion: actuaciones.attributes.actuacion.attributes.nombre_estado_actuacion, tipoActuacion: actuaciones.attributes.actuacion.attributes.tipo_actuacion, disable: disable, actuacionIdMaestra: actuaciones.attributes.actuacion.attributes.mas_actuacion.id }} >
                        <button type='button' title='Ver actuación' className='btn btn-sm btn-primary' data-toggle="modal" ><i className="fas fa-search"></i></button>
                    </Link>
                    {
                        actuaciones?.attributes?.actuacion?.attributes?.mas_actuacion?.visible == 1 
                        ? 
                            <i className="fas fa-solid fa-eye" title='Visible en el portal'></i>
                        : 
                        null
                    }
                </div >,
            width: "8%"
        }
    ];

    const columns_actuaciones_migradas = [
        {
            name: 'ACTUACIÓN',
            cell: actuaciones =>
                <div className="mt-4 mb-4 d-none d-sm-table-cell">
                    {actuaciones.attributes.actuacion.nombre_actuacion.toUpperCase()} <br />
                </div >
            ,
            selector: actuaciones => actuaciones.attributes.nombre_actuacion,
            sortable: true,
            width: "30%"
        },
        {
            name: 'INFORMACIÓN DE REGISTRO',
            cell: actuaciones =>
                <div className="mt-4 mb-4 d-none d-sm-table-cell">
                    <div className='row'>
                        <div className="col-10">
                            <small><strong>USUARIO:</strong> {actuaciones.attributes.usuario.nombre + " " + actuaciones.attributes.usuario.apellido + " (" + actuaciones.attributes.dependencia.nombre + ")"}</small><br />
                            <small><strong>FECHA DE REGISTRO:</strong> {actuaciones.attributes.fecha}</small><br />
                        </div>
                    </div>
                </div>,
            selector: actuaciones => actuaciones.attributes.actuacion.created_user,
            sortable: true,
            width: "30%"
        },
        {
            name: 'ESTADO',
            cell: actuaciones => actuaciones.attributes.estado.nombre.toUpperCase(),
            selector: actuaciones => actuaciones.attributes.estado.nombre.toUpperCase(),
            sortable: true,
            width: "20%"
        },
        {
            name: 'N° AUTO',
            cell: actuaciones =>
                actuaciones.attributes.archivo_pdf != null ? (
                    <div className='row'>
                        <div className='col-4'>
                            <div className='row'>
                                <div className='col-4'>
                                    <button type='button' title={actuaciones.attributes.auto} onClick={() => handleClicArchivo(actuaciones.attributes.archivo_pdf.uuid, actuaciones.attributes.archivo_pdf.extension, actuaciones.attributes.archivo_pdf.nombre_archivo)} className='btn btn-sm btn-primary' data-toggle="modal"><i className="fas fa-download"></i></button>
                                </div>
                            </div >
                        </div>
                    </div>
                ) : null
            ,
            sortable: true,
            width: "20%"
        }
    ];
    
    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            <Formik>
                <Form>
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Actuaciones</small></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="block block-themed">
                        <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                            <h3 className="block-title">{ getNombreProceso.toUpperCase() } :: <strong>CONSULTAR LISTA DE ACTUACIONES { getEstadoLista.toUpperCase() } DE { getNombreEtapaSeleccionada.toUpperCase() }</strong></h3>
                        </div>
                        <div className="block-content">
                            <div className='row'>
                                <div className='col-md-3'>
                                    <div className="form-group ">
                                        <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                                    </div>
                                </div>
                                <div className='col-md-3 mb-2'>
                                    {
                                        from.mismoUsuarioBuscador
                                        ?
                                            <Link to="/Transacciones" state={{ from: from, selected_id_etapa: selected_id_etapa }}>
                                                <button type="button" className="btn btn-rounded btn-primary w-100" ><i className="fa fa-arrow-right"></i> TRANSACCIONES</button>
                                            </Link>
                                        :
                                            null
                                    }
                                </div>
                                {
                                    getConsultarBoton
                                    ?
                                        <ListaBotones
                                            getRoutes={getRoutes}
                                            from={from}
                                            rutaParametrizada={getRutaParametrizada}
                                            parentCallback={handleCallback}
                                            id="botonesNavegacion"
                                            name="botonesNavegacion" />
                                    :
                                        null
                                }
                                    
                            </div>
                            {
                                getEstadoBoton?.mensaje
                                ?
                                    <div className="block block-themed">
                                        <div className="block-content alert-warning">
                                            <ul className="list-group push">
                                                <li className="list-group-item">
                                                    { getEstadoBoton.mensaje }<br></br>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                :
                                    null
                            }
                            <div className="row">
                                <div className="col-sm-12">
                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                        columns={columns}
                                        data={getActuacionesListaSearch.data.filter((suggestion) => {
                                            if (getSeach === "") {
                                                return suggestion;
                                            } else if (
                                                ((quitarAcentos(suggestion.attributes.nombre_actuacion)
                                                    + quitarAcentos(suggestion.attributes.created_user) + quitarAcentos(suggestion.attributes.usuario_accion) +
                                                    quitarAcentos(suggestion.attributes.nombre_estado_actuacion) + quitarAcentos(suggestion.attributes.auto)
                                                ).toLowerCase().includes(getSeach.toLowerCase()))
                                            ) {
                                                return suggestion;
                                            }
                                        })}
                                        perPage={perPage}
                                        page={pageActual}
                                        pagination
                                        noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                        paginationTotalRows={getActuacionesListaSearch.length}
                                        onChangePage={handlePageChange}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        defaultSortFieldId="Nombre"
                                        striped
                                        paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                        defaultSortAsc={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        getActuacionesMigradasListaSearch.data.length > 0
                        ?
                            <div className="block block-themed">
                                <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                    <h3 className="block-title">{getNombreProceso.toUpperCase()} :: <strong>CONSULTAR LISTA DE ACTUACIONES {getEstadoLista.toUpperCase()} DE {getNombreEtapaSeleccionada.toUpperCase()} QUE PROVIENEN DE MIGRACIÓN</strong></h3>
                                </div>
                                <div className="block-content">
                                    <div className='row'>
                                        <div className='col-md-3'>
                                            <div className="form-group ">
                                                <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                                            </div>
                                        </div>                                  
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columns_actuaciones_migradas}
                                                data={getActuacionesMigradasListaSearch.data.filter((suggestion) => {
                                                    if (getSeach === "") {
                                                        return suggestion;
                                                    } else if (
                                                        ((quitarAcentos(suggestion.attributes.nombre_actuacion)
                                                            + quitarAcentos(suggestion.attributes.created_user) + quitarAcentos(suggestion.attributes.usuario_accion) +
                                                            quitarAcentos(suggestion.attributes.nombre_estado_actuacion) + quitarAcentos(suggestion.attributes.auto)
                                                        ).toLowerCase().includes(getSeach.toLowerCase()))
                                                    ) {
                                                        return suggestion;
                                                    }
                                                })}
                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                                paginationTotalRows={getActuacionesMigradasListaSearch.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                defaultSortFieldId="Nombre"
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                                defaultSortAsc={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        :
                            null
                    }
                </Form>
            </Formik>
        </>
    );
    
}

export default ActuacionesLista;