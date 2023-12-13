import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../../Utils/InfoErrorApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';
import { useLocation } from 'react-router-dom';
import { quitarAcentos } from '../../Utils/Common';

function ActuacionesInactivar() {

    // Constantes generales
    const [errorApi, setErrorApi] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [getActuacionesActivasListaSearch, setActuacionesActivasListaSearch] = useState({ data: [], links: [], meta: [] });
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('');
    const [getElementArray, setElementArray] = useState([]);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getCountCantidad, setCountCantidad] = useState(0);
    const [getMuestraBotonFechaParaSemaforo, setMuestraBotonFechaParaSemaforo] = useState(false);
    const [getidMasActuacion, setidMasActuacion] = useState();

    // Se capturan los parametros de la clase
    const location = useLocation()
    const { MuestraFechaSemaforo , from, selected_id_etapa, nombre, uuid_actuacion, tipoActuacion, estadoActualActuacion, actuacionIdMaestra } = location.state

    // Variables del proceso disciplinario
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let idEtapa = from.idEtapa >= 3 ? from.idEtapa : 3;
    let estado = 1;

    console.log("actuacionIdMaestra ActuacionesInactivar -> ", actuacionIdMaestra);

    // Constantes de rutas
    const [getRoutes, setRoutes] = useState({
        crear_registro: "/ActuacionesForm/",
        consultar_registros: "/ActuacionesLista/",
        ver_detalle: "/ActuacionesVer/" + procesoDisciplinarioId + "/" + selected_id_etapa + "/" + estado,
        muestra_atras: true,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        selected_id_etapa: selected_id_etapa,
        muestra_inactivos: true,
    });

    // Constantes de las columnas
    const columns = [
        {
            name: 'DETALLE ACTUACIÓN',
            cell: actuaciones =>
                <div id={actuaciones.actuacion.uuid}>
                    <div>
                        <strong>NOMBRE:</strong> {actuaciones.actuacion.attributes.nombre_actuacion.toUpperCase()}<br />
                    </div>
                    <div>
                        <strong>ETAPA:</strong> {actuaciones.actuacion.attributes.etapa.nombre.toUpperCase()}<br />
                    </div>
                    <div>
                        <strong>ESTADO ACTUAL:</strong> {actuaciones.actuacion.attributes.nombre_estado_actuacion.toUpperCase()}<br />
                    </div>
                </div>,
            selector: actuaciones => actuaciones.actuacion.attributes.created_at.toUpperCase(),
            sortable: true,
            width: "30%"
        },
        {
            name: 'INFORMACIÓN DE REGISTRO',
            cell: actuaciones =>
                <div>
                    <div>
                        <strong>USUARIO:</strong> {actuaciones.actuacion.attributes.usuario.nombre.toUpperCase() + " " + actuaciones.actuacion.attributes.usuario.apellido.toUpperCase() + " (" + actuaciones.actuacion.attributes.id_dependencia.nombre.toUpperCase() + ")"}<br />
                    </div>
                    <div>
                        <strong>FECHA:</strong> {actuaciones.actuacion.attributes.created_at.toUpperCase()}<br />
                    </div>
                </div>,
            width: "25%"
        },
        {
            name: 'INFORMACIÓN APROBACIÓN/RECHAZO',
            cell: actuaciones =>
                actuaciones.detalleAprobacion != null ? (
                    <div>
                        <div>
                            <strong>USUARIO:</strong> {actuaciones.detalleAprobacion.attributes.usuario.nombre.toUpperCase() + " " + actuaciones.detalleAprobacion.attributes.usuario.apellido.toUpperCase() + " (" + actuaciones.detalleAprobacion.attributes.id_dependencia.nombre.toUpperCase() + ")"}<br />
                        </div>
                        <div>
                            <strong>FECHA:</strong> {actuaciones.detalleAprobacion.attributes.created_at.toUpperCase()}<br />
                        </div>
                        <div className="mb-3">
                            <strong>N° DE AUTO:</strong> {actuaciones.actuacion.attributes.auto ? actuaciones.actuacion.attributes.auto.toUpperCase() : "-"}<br />
                        </div>
                    </div>
                ) : null,
            width: "25%"
        },
        {
            name: 'ESTADO',
            cell: actuaciones => actuaciones.actuacion.attributes.estado == "0" ? "INACTIVO" : "ACTIVO",
            selector: actuaciones => actuaciones.actuacion.attributes.estado == "0" ? "INACTIVO" : "ACTIVO",
            width: "7%"
        },
    ];

    const redirectToRoutes = () => {
        return <Navigate to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }} />;
    }

    useEffect(() => {
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se setea el id de la actuacion
            setidMasActuacion(actuacionIdMaestra);

            // Se consume la API
            GenericApi.getGeneric('semaforo').then(

                // Se inicializa la variable de respuesta
                datosSemaforo => {

                    // Se valida que no haya error
                    if (!datosSemaforo.error) {

                        // Se recorre el array
                        datosSemaforo.data.forEach(element => {

                            // Se valida que haya una actuación que inicie el proceso
                            if (element.attributes.id_mas_actuacion_inicia != null) {

                                // Se valida que haya una actuación que inicie el proceso y sea igual a la actuacion actual
                                if (element.attributes.id_mas_actuacion_inicia.id == actuacionIdMaestra
                                    && element?.attributes?.id_mas_evento_inicio?.id == 3) {

                                    // Se setea el boton en true
                                    setMuestraBotonFechaParaSemaforo(true);
                                }
                            }
                        });

                        // Se quita el cargando
                        window.showSpinner(false);
                    }
                }
            )

            setEstadoLista("Activos");
            cargarActuacionesActivas(1, paganationPerPages, global.Constants.ESTADOS.ACTIVO);
        }
        fetchData();
    }, []);

    const cargarActuacionesActivas = (page, perPage, estado) => {

        // Se consume la API
        GenericApi.getGeneric('actuaciones/get-actuaciones-active/' + estado + '/' + procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se valida que haya informacion
                    if (datos["data"] != "") {

                        // Se setean los datos
                        setActuacionesActivasListaSearch(datos)
                    }

                    // Se quita el cargando
                    window.showSpinner(false);
                } else {

                    // Se setea el modal de error
                    setErrorApi(datos.error.toString());

                    // Se muestra el modal
                    window.showModal(1)

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    const handlePageChange = page => {
        setPageActual(page);
        cargarActuacionesActivas(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
        cargarActuacionesActivas(page, newPerPage);
    }

    const handleChangeCheck = ({ selectedRows }) => {

        // Se setea en 0 la cantidad de actuaciones checkeadas para resetear el valor del boton
        setCountCantidad(0);

        // Se valida que haya seleccionado por lo menos un dato
        if (selectedRows) {

            // Se añade al array de los elementos seleccionados
            setElementArray([...selectedRows]);
        }

        // Se setea la cantidad de actuaciones checkeadas
        setCountCantidad(selectedRows.length);
    };

    const inactivarActuaciones = () => {

        // Se activa el loading
        window.showSpinner(true);

        // Se valida cuando sea continuar el valor
        if (getCountCantidad == 0) {

            // Se inactiva el loading
            window.showSpinner(false);

            if(MuestraFechaSemaforo){
                // Se muestra el modal para redirigir a las transacciones
                setModalState({
                    title: "SINPROC NO " + from.radicado + " :: ACTUACIONES INACTIVAR",
                    message: "REDIRIGIENDO AL SIGUIENTE PASO ...",
                    show: true,
                    redirect: '/SeleccionDeFechaParaSemaforo',
                    from: { from: from, selected_id_etapa: selected_id_etapa, id: uuid_actuacion, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra },
                    alert: global.Constants.TIPO_ALERTA.EXITO
                });
            }else{
                setModalState({
                    title: "SINPROC NO " + from.radicado + " :: ACTUACIONES INACTIVAR",
                    message: "REDIRIGIENDO AL SIGUIENTE PASO ...",
                    show: true,
                    redirect: '/Transacciones',
                    from: { from: from, selected_id_etapa: selected_id_etapa, id_actuacion: getidMasActuacion },
                    alert: global.Constants.TIPO_ALERTA.EXITO
                });
            }
            

            // Se retorna en falso
            return;
        }

        // Se inicializa el array de informacion
        let data = {
            "data": {
                "type": "actuaciones/actuaciones-inactivar",
                "attributes": {
                    "id_actuacion": "1",
                    "usuario_accion": "1",
                    "id_estado_actuacion": "1",
                    "documento_ruta": "1",
                    "estado": "1",
                    "uuid_proceso_disciplinario": "1",
                    "id_etapa": "1",
                    "id_proceso_disciplinario": "1",
                    "data": getElementArray
                }
            }
        }

        // Se consume la API
        GenericApi.addGeneric('actuaciones/actuaciones-inactivar', data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se valida el mensaje de respuesta
                    const mensaje = datos.OK == 1 ? "ACTUACIONES INACTIVADAS CON ÉXITO" : "HUBO UN ERROR AL TRATAR DE INACTIVAR LAS ACTUACIONES";

                    // Se valida que la respuesta sea ok
                    if (datos.OK == 1) {

                        // Se valida que haya semaforos activos
                        if (getMuestraBotonFechaParaSemaforo) {

                            // Se setea el modal
                            setModalState({
                                title: "SINPROC NO " + from.radicado + " :: ACTUACIONES INACTIVAR",
                                message: mensaje,
                                show: true,
                                redirect: '/SeleccionDeFechaParaSemaforo',
                                from: { from: from, selected_id_etapa: selected_id_etapa, id: uuid_actuacion, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra },
                                alert: global.Constants.TIPO_ALERTA.EXITO
                            });
                        } else {

                            // Se setea el modal
                            setModalState({
                                title: "SINPROC NO " + from.radicado + " :: ACTUACIONES INACTIVAR",
                                message: mensaje,
                                show: true,
                                redirect: '/Transacciones',
                                from: { from: from, selected_id_etapa: selected_id_etapa, id_actuacion: getidMasActuacion },
                                alert: global.Constants.TIPO_ALERTA.EXITO
                            });
                        }
                    } else {

                        // Se setea el modal
                        setModalState({ title: "SINPROC NO " + from.radicado + " :: ACTUACIONES INACTIVAR", message: datos.error.toString(), show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            }
        )
    }

    return (
        <>
            {isRedirect ? redirectToRoutes() : null}
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}

            <Formik>
                <Form>
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Actuaciones Inactivar</small></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">SINPROC NO {radicado} :: <strong>LISTA DE ACTUACIONES A INACTIVAR</strong></h3>
                        </div>
                        <div className="block-content">
                            <div className='row'>
                                <div className='col-md-3'>
                                    <div className="form-group ">
                                        <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                                    </div>
                                </div>
                                {/* <ListaBotones getRoutes={getRoutes} from={from} mostrarBotonAgregar={getMostrarBotonAgregar != null ? getMostrarBotonAgregar : validacionDeBotonAgregar()} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" /> */}
                            </div>
                            <div className="row">
                                <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                    columns={columns}
                                    data={getActuacionesActivasListaSearch.data.filter((suggestion) => {
                                        if (getSeach === "") {
                                            return suggestion;
                                        } else if (
                                            ((quitarAcentos(suggestion.actuacion.attributes.nombre_actuacion) +
                                                quitarAcentos(suggestion.actuacion.attributes.etapa.nombre) +
                                                quitarAcentos(suggestion.actuacion.attributes.nombre_estado_actuacion) +
                                                quitarAcentos(suggestion.actuacion.attributes.auto)
                                            ).toLowerCase().includes(getSeach.toLowerCase()))
                                        ) {
                                            return suggestion;
                                        }
                                    })}
                                    perPage={perPage}
                                    page={pageActual}
                                    pagination
                                    noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                    paginationTotalRows={getActuacionesActivasListaSearch.length}
                                    onChangePage={handlePageChange}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    defaultSortFieldId="Nombre"
                                    striped
                                    paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                    defaultSortAsc={false}
                                    selectableRows
                                    onSelectedRowsChange={handleChangeCheck}
                                />
                            </div>
                            <div className="block-content block-content-full text-right">
                                <button type="button" className="btn btn-rounded btn-primary" onClick={inactivarActuaciones}><i className="fas fa-save"></i> {getCountCantidad > 0 ? "INACTIVAR" : "CONTINUAR"}</button>
                                <Link to={`/MisPendientes/`}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );
}

export default ActuacionesInactivar;