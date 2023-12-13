import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import 'moment/locale/es';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import Spinner from '../Utils/Spinner';
import GenericApi from '../Api/Services/GenericApi.js'
import ValidarUserUrl from '../Api/Services/ValidarUserUrl';
import InfoConfirmarAccion from '../Utils/InfoConfirmarAccion';
import { ErrorMessage, Field, Form, Formik, replace } from 'formik';
import ModalAceptarActualizar from '../Utils/Modals/ModalAceptarActualizar';

function ConsecutivoActuacionesLista() {

    // Metodo encargado de validar si el usuario actual tiene permiso a la url
    const isUnauthorized = ValidarUserUrl.validarUserUrl(window.location.pathname);

    // Constantes generales del sistema
    const [ConsecutivoActuacionesLista, setConsecutivoActuacionesLista] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getRtaInfoTrue, setRtaInfoTrue] = useState(false);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    // Constantes de paginación
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);

    // Elemento seleccionado
    const [getElementArray, setElementArray] = useState([]);

    // Constantes de rutas
    const [getRoutes, setRoutes] = useState({
        crear_registro: "/ConsecutivoActuaciones/Add",
        consultar_registros: "/ConsecutivoActuaciones",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        mostrarBotonAgregar: true,
        modulo: 'ADMIN_Actuaciones'
    });

    // Metodo encargado de reversar la pagina
    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData);
        } catch (error) {

        }
    }

    // Columnas de la tabla
    const columns = [
        {
            name: 'VIGENCIA',
            selector: ConsecutivoDesglose => ConsecutivoDesglose.attributes.id_vigencia.vigencia,
            sortable: true,
        },
        {
            name: 'CONSECUTIVO',
            selector: ConsecutivoDesglose => ConsecutivoDesglose.attributes.consecutivo,
            sortable: true,
        },
        {
            name: 'ESTADO',
            selector: ConsecutivoDesglose => (ConsecutivoDesglose.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
        },
        {
            name: 'ACCIONES',
            cell: row =>
                <div>
                    <Link to={`/ConsecutivoActuaciones/${row.id}`} state={{ from: row }}>
                        <button type="button" className="btn btn btn-primary" title='EDITAR'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                    </Link>
                </div>,
            width: "10%"
        }
    ];

    useEffect(() => {

        // Metodo principal de la clase
        async function fetchData() {

            // Se valida si el tipo de usuario es valido para consumir los servicios y no ralentizar la pagina
            if (isUnauthorized) {

                // Se habilita el cargando
                window.showSpinner(true);

                // Se llama el metodo para listar los datos
                cargarConsecutivoActuaciones(1, paganationPerPages);
            }
        }

        // Se llama el metodo
        fetchData();
    }, []);

    // Metodo encargado de cargar los consecutivos
    const cargarConsecutivoActuaciones = (page, perPage) => {

        // Se consume la API
        GenericApi.getAllGeneric('mas-consecutivo-actuaciones').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los datos
                    setConsecutivoActuacionesLista(datos);

                    // Se utiliza el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar la pagina anterior
    const handlePageChange = page => {

        // Pagina actual
        setPageActual(page);
    }

    // Metodo encargado de cargar la pagina siguiente
    const handlePerRowsChange = async (newPerPage, page) => {

        // Se setea la siguiente pagina
        setPerPage(newPerPage);
        setPageActual(page);
    }

    // const handleChangeCheck = ({ selectedRows }) => {

    //     // Se valida que haya seleccionado por lo menos un dato
    //     if (selectedRows.length > 0) {

    //         // Se muestra el modal numero 9 que es el de confirmar acción
    //         window.showModal(9);

    //         // Se añade al array de los elementos seleccionados
    //         setElementArray([selectedRows[0]]);
    //     }
    // };

    // Constante para deshabilitar el estado del activo
    // const rowDisabledCriteria = data => data.attributes.estado == "1";

    // Metodo encargado de habilitar el consecutivo para las actuaciones
    // function actualizarConsecutivo(e, accion) {

    //     // Se valida el tipo de accion haya sido un click para impedir hackeos desde la web
    //     if (e.type == "click") {

    //         // Se activa el cargando
    //         window.showSpinner(true);

    //         // Se valida que la accion sea valida
    //         if (accion) {

    //             // Se inicializa la data a enviar
    //             const data = {
    //                 "data": {
    //                     "type": 'mas-consecutivo-actuaciones',
    //                     "attributes": {
    //                         "id_vigencia": getElementArray[0].attributes.id_vigencia.id,
    //                         "consecutivo": getElementArray[0].attributes.consecutivo,
    //                         "estado": true,
    //                     }
    //                 }
    //             };

    //             console.log("get -> ", getElementArray[0]);

    //             // Se consume la API
    //             GenericApi.updateGeneric("mas-consecutivo-actuaciones", getElementArray[0].id, data).then(

    //                 // Se inicializa la variable de respuesta
    //                 datos => {

    //                     // Se quita el cargando
    //                     window.showSpinner(false);

    //                     // Se valida que no haya error
    //                     if (!datos.error) {

    //                         // Se setea el modal
    //                         setModalState({ title: "CONSECUTIVO ACTUACIONES :: ACTIVAR CONSECUTIVO ANUAL", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
    //                     } else {

    //                         // Se setea el modal
    //                         setModalState({ title: "CONSECUTIVO ACTUACIONES :: ACTIVAR CONSECUTIVO ANUAL", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
    //                     }

    //                 }
    //             )
    //         }
    //     }
    // }

    if (!isUnauthorized) {
        return (
            <div className="ml-4 mt-4 mb-4" style={{ textAlign: "center" }}>
                <a>
                    <img src={process.env.PUBLIC_URL + "/assets/images/not-access.png"} alt="NOT AUTHORIZED" height="40px" />
                </a>
                <b className='ml-2' style={{ fontSize: "16px" }}>
                    <span>NO AUTORIZADO</span>
                </b>
            </div>
        )
    } else {
        return (
            <>
                {<Spinner />}
                {/* {<InfoConfirmarAccion mensaje={'¿DESEA HABILITAR ESTE CONSECUTIVO PARA EL AÑO ACTUAL?'} function={e => actualizarConsecutivo(e, true)} />}
                {<ModalAceptarActualizar data={getModalState} />} */}
                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <small>Administración</small></li>
                            <li className="breadcrumb-item"> <small>Actuaciones</small></li>
                            <li className="breadcrumb-item"> <small>Lista de consecutivo de actuaciones</small></li>
                        </ol>
                    </nav>
                </div>
                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title">LISTADO DE CONSECUTIVOS</h3>
                    </div>
                    <div className="block-content">
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
                                    data={ConsecutivoActuacionesLista.data.filter((suggestion) => {
                                        if (getSeach === "") {
                                            if (suggestion.attributes.estado == getEstadoLista) {
                                                return suggestion;
                                            }
                                        } else if (((suggestion.id +
                                            suggestion.attributes.id_vigencia.id +
                                            suggestion.attributes.consecutivo).toLowerCase().includes(getSeach.toLowerCase()) &&
                                            (suggestion.attributes.estado == getEstadoLista))) {

                                            // Se retorna el dato de busqueda encontrado
                                            return suggestion;
                                        }
                                    })}
                                    perPage={perPage}
                                    page={pageActual}
                                    pagination
                                    noDataComponent="Sin datos"
                                    paginationTotalRows={ConsecutivoActuacionesLista.data.length}
                                    onChangePage={handlePageChange}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    defaultSortFieldId="Vigencia"
                                    striped
                                    paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                    defaultSortAsc={false}
                                    // selectableRowsNoSelectAll
                                    // selectableRows
                                    // onSelectedRowsChange={handleChangeCheck}
                                    // selectableRowDisabled={rowDisabledCriteria}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default ConsecutivoActuacionesLista;