import React, { useEffect, useState, } from 'react';
import { ErrorMessage, Form, Field, Formik } from 'formik';
import { Link } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import DataTable from 'react-data-table-component';
import { Navigate } from "react-router-dom";
import GenericApi from './../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { useParams } from "react-router";
import { useLocation } from 'react-router-dom'
import '../../Utils/Constants';
import { getUser, quitarAcentos } from '../../Utils/Common';

function CasosActivos() {

    const containerStyle = {
        position: 'relative',
        display: 'block',
        userSelect: 'none',
        border: 'none',
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        padding: '8px',
        cursor: 'pointer',
        transition: '0.4s',
        color: 'rgba(0, 0, 0, 0.54)',
        fill: 'rgba(0, 0, 0, 0.54)',
        backgroundColor: 'transparent',
    };

    const location = useLocation()
    const { data } = location.state
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [getListaPendientes, setListaPendientes] = useState({ data: {} });
    const [getUsuarioSeleccionado, setUsuarioSeleccionado] = useState();
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [getSelectedData, setSelectedData] = useState([]);
    const [getNombre, setNombre] = useState('');
    const [getApellido, setApellido] = useState('');
    const [getListaUsuarios, setListaUsuarios] = useState({ data: {} });
    const [getRespuestaUsuarios, setRespuestaUsuarios] = useState(false);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    let { usuario } = useParams();
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getTotalPaginas, setTotalPaginas] = useState(0);
    const [getTotalRegistros, setTotalRegistros] = useState(0);

    const columns = [
        {
            name: 'SINPROC',
            selector: pendiente => pendiente.attributes.radicado,
            sortable: true,
            width: "20%"
        },

        {
            name: 'FECHA DE VIGENCIA',
            selector: pendiente => (pendiente.attributes.vigencia),
            sortable: true,
            width: "20%"
        },
        {
            name: 'FECHA DE REGISTRO',
            selector: pendiente => (pendiente.attributes.created_at),
            sortable: true,
            width: "20%"
        },

        {
            name: 'TIPO EXPEDIENTE',

            cell: pendiente => <div>
                {(
                    pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '1' && pendiente.attributes.tipo_expediente.id_tipo_derecho_peticion === '1' ? 'DERECHO PETICIÓN COPIAS' : null ||
                        pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '1' && pendiente.attributes.tipo_expediente.id_tipo_derecho_peticion === '2' ? 'DERECHO PETICIÓN GENERAL' : null ||
                            pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '1' && pendiente.attributes.tipo_expediente.id_tipo_derecho_peticion === '3' ? 'DERECHO PETICIÓN ALERTA CONTROL POLÍTICO' : null ||
                                pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '2' && pendiente.attributes.tipo_expediente.id_tipo_queja === '1' ? 'PODER REFERENTE A SOLICITUD EXTERNA' : null ||
                                    pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '3' && pendiente.attributes.tipo_expediente.id_tipo_queja === '1' ? 'QUEJA EXTERNA' : null ||
                                        pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '3' && pendiente.attributes.tipo_expediente.id_tipo_queja === '2' ? 'QUEJA INTERNA' : null ||
                                            pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '4' && pendiente.attributes.tipo_expediente.id_termino_respuesta === '1' ? 'TUTELA DÍAS' : null ||
                                                pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '4' && pendiente.attributes.tipo_expediente.id_termino_respuesta === '2' ? 'TUTELA HORAS' : null ||
                                                    pendiente.attributes.tipo_expediente != null && pendiente.attributes.tipo_expediente.id_tipo_expediente === '5' ? 'PROCESO DISCIPLINARIO' : null ||
                                                        pendiente.attributes.tipo_expediente == null ? 'Sin Clasificación' : null
                )}
            </div>,
            selector: pendiente => (pendiente.attributes.tipo_expediente == null ? null : pendiente.attributes.tipo_expediente.id_tipo_expediente),
            sortable: true,
            width: "20%"
        }


    ];
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarPendientes(1, paganationPerPages)
        }
        fetchData();
    }, []);

    /**
     * LLAMADO DE FUNCIONES AL SERVIDOR
    */

    //Obtener la información de una actuacion
    const obtenerUsuarios = () => {
        GenericApi.getGeneric('usuario/get-all-usuarios-dependencia/' + getUser().id_dependencia).then(
            datos => {
                if (!datos.error) {
                    // setListaUsuarios(datos.data.filter(dato => dato.id !== data.id))
                    setListaUsuarios(datos)
                    setListaUsuarios(prevState => ({
                        ...prevState,
                        data: prevState.data.filter(dato => dato.id !== data.id)
                      }));
                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: TRASLADO DE CASOS", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false)
            }
        )
    }


    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombre") {
            setNombre(value);
        }
        if (name == "apellido") {
            setApellido(value);
        }

    }

    const cargarPendientes = (page, perPage) => {

        const data = {
            "data": {
                "type": "pendietes",
                "attributes": {
                    "fecha": '',
                    'per_page': perPage,
                    'current_page': page,
                    "usuario_actual": usuario
                }
            }
        }
        GenericApi.getByDataGeneric('mis-pendientes-filter-actual', data).then(
            datos => {
                if (!datos.error) {
                    setListaPendientes(datos)
                    if(datos.data.length > 0){
                        setTotalPaginas(datos?.TotalPaginas)
                        setTotalRegistros(datos?.TotalRegistros)
                    }
                    obtenerUsuarios()                    
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: TRASLADO DE CASOS", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }

            }
        )

    }

    const enviarDatos = (datos) => {

    }

    const handlePageChange = page => {
        window.showSpinner(true);
        setPageActual(page);
        cargarPendientes(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        cargarPendientes(page, newPerPage);
    }

    const handleChange = (state) => {
        setSelectedData(state.selectedRows);
    };


    const buscarUsuario = () => {
        window.showSpinner(true);

        try {

            if (getApellido || getNombre) {
                let data;

                data = {

                    "data": {
                        "type": "user",
                        "attributes": {
                            "nombre": getNombre ? getNombre : '',
                            "apellido": getApellido ? getApellido : '',
                            "id_dependencia": getUser().id_dependencia
                        }
                    }
                }

                GenericApi.getByDataGeneric('usuario/usuario-filter', data).then(
                    datos => {

                        if (!datos.error) {
                            setListaUsuarios(datos);
                            setRespuestaUsuarios(true);
                        }

                        window.showSpinner(false);
                    }
                )
            }


        } catch (ex) {
            console.error("Ocurrio este error " + ex);
            inicilizarDatos();
        }


    }

    const inicilizarDatos = () => {
        setNombre("");
        setApellido("");
    }

    const listarCoincidencias = () => {


        if (getListaUsuarios != null && typeof (getListaUsuarios) != 'undefined') {
            return (

                getListaUsuarios.data.map((usuario, i) => {
                    if(data.id !== usuario.id){
                        return (
                                <tr key={usuario.id}>
                                    <td>{usuario.attributes.nombre.toUpperCase()}</td>
                                    <td>{usuario.attributes.apellido.toUpperCase()}</td>
                                    <td>{usuario.attributes.email.toUpperCase()}</td>
                                    <td>{usuario.attributes.dependencia.nombre.toUpperCase()}</td>

                                    <td>  <Link to={`/CasosActivos/${usuario.attributes.name}`}>
                                        <button type='button' data-dismiss="modal" className='btn btn-rounded btn-primary' onClick={() => seleccionarUsuario(usuario.attributes)}>SELECCIONAR</button>
                                    </Link></td>
                                </tr >
                        )
                    }
                })
            )
        }


    }

    const seleccionarUsuario = (e) => {
        setUsuarioSeleccionado(e);
    }


    const onConfirm = () => {

        try {
            window.showSpinner(true);

            // if (getApellido || getNombre) {

                let data;
                data = {

                    "data": {
                        "type": "proceso_disciplinario",
                        "attributes": {
                            "usuario_a_remitir": getUsuarioSeleccionado ? getUsuarioSeleccionado.name : '',
                            "lista_procesos":

                                getSelectedData.map((suggestion) => {
                                    return suggestion["id"];
                                })

                        }
                    }
                }

                GenericApi.getByDataGeneric('proceso-diciplinario/traslado-masivo', data).then(
                    datos => {

                        if (!datos.error) {
                            window.showSpinner(false);
                            setModalState({ title: "ADMINISTRACIÓN :: TRASLADO DE CASOS", message: "Se ha"+(getSelectedData.length > 1 ? "n" : "") +" reasignado "+getSelectedData.length + " " + (getSelectedData.length > 1 ? "casos" : "caso") + ' al usuario ' + getUsuarioSeleccionado.nombre + ' ' + getUsuarioSeleccionado.apellido +' exitosamente.', show: true, redirect: '/TrasladoProcesos', alert: global.Constants.TIPO_ALERTA.EXITO });
                        }
                        else {
                            window.showSpinner(false);
                            setModalState({ title: "ADMINISTRACIÓN :: TRASLADO DE CASOS", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                        }
                    }
                )
            // }


        } catch (ex) {
            console.error("Ocurrio este error " + ex);
            inicilizarDatos();
        }
    }

    const onClicAsociarCasos = () => {
        window.showModalAsociarCasos(true);
    }
  
    const componentAsociarCasosConfirmacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-asociar-casos" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">CONFIRMACIÓN DE ASIGNACIÓN DE CASOS</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <p>¿ESTÁ SEGURO QUE DESEA REASIGNAR { getSelectedData.length + " " + (getSelectedData.length > 1 ? "CASOS" : "CASO") } AL USUARIO { getUsuarioSeleccionado?.name ? getUsuarioSeleccionado.nombre.toUpperCase() + " " + getUsuarioSeleccionado.apellido.toUpperCase() : null } ?</p>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => onConfirm()}>{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                                    <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {<Spinner />}

            { componentAsociarCasosConfirmacion() }
            {<ModalGen data={getModalState} />}

            <Formik
                initialValues={{

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

                        <>
                        <div className="block block-themed">

                            <div className="block-header">
                                <h3 className="block-title">ADMINISTRACIÓN :: TRASLADO DE PROCESOS</h3>
                            </div>

                            <div className='text-right w2d-enter'>
                                <Link to={`/TrasladoProcesos/`} title='Regresar a buscar usuario'>
                                    <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                </Link>
                            </div>

                            {
                                (getListaPendientes.data.length > 0) ?
                                    (
                                        
                                            <div className="block-content block-content-full">
                                                <div className="block-content block-content-full border border-success mt-1">

                                                    <div className="row">
                                                        <div className="col-md-12 text-center mb-3">
                                                            <h4>USUARIO ORIGEN SELECCIONADO</h4>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <strong>NOMBRE</strong> : {data.attributes.nombre.toUpperCase()}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <strong>APELLIDO</strong> : {data.attributes.apellido.toUpperCase()}
                                                        </div>

                                                    </div>
                                                    <div className="row">

                                                        <div className="col-md-6">
                                                            <strong>CORREO</strong> : {data.attributes.email.toUpperCase()}
                                                        </div>
                                                        <div className="col-md-6">
                                                            <strong>DEPENDENCIA ORIGEN</strong> : {data.attributes.dependencia.nombre.toUpperCase()}
                                                        </div>
                                                    </div>


                                                </div>
                                                <hr />
                                                <div className="row mt-3">
                                                    <div className="col-md-12 text-center mb-3">
                                                        <label>PASO 2. SELECCIONA LOS CASOS QUE DESEA REASINGAR</label>
                                                    </div>

                                                </div>
                                                <div className='col-md-12'>
                                                    <div className="form-group ">
                                                        <Field type="text" id="search" name="search" onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                                    </div>
                                                </div>

                                                {
                                                    (getListaPendientes.data.length > 0) ? (                                                        
                                                    <div class="casosActivosTabla">
                                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase"
                                                            columns={columns}
                                                            data={getListaPendientes.data.filter((suggestion) => {
                                                                if (getSeach === "") {
                                                                    return suggestion;
                                                                } else if (

                                                                    ((suggestion.attributes.radicado
                                                                        + (suggestion.attributes.created_at)
                                                                        + (suggestion.attributes.vigencia) +
                                                                        quitarAcentos(suggestion.attributes.nombre_tipo_expediente)).toLowerCase().includes(getSeach.toLowerCase()))

                                                                ) {
                                                                    return suggestion;
                                                                }
                                                            })}
                                                            perPage={perPage}
                                                            page={pageActual}
                                                            selectableRows={true}
                                                            onSelectedRowsChange={handleChange}
                                                            sele
                                                            pagination
                                                            noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                                            paginationTotalRows={getListaPendientes.data.length}
                                                            onChangePage={handlePageChange}
                                                            onChangeRowsPerPage={handlePerRowsChange}
                                                            defaultSortFieldId="Nombre"
                                                            striped
                                                            paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                                            defaultSortAsc={false}
                                                            paginationComponent={() => (
                                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }} class="sc-ezOQGI hoQsHK">
                                                                    <span style={{  paddingTop: "9px" }}> { ((pageActual-1) * paganationPerPages) + 1 } - { ((pageActual-1) * paganationPerPages) + getListaPendientes.data.length } de {getTotalRegistros}</span>
                                                                    <button id="pagination-first-page" type="button" aria-label="First Page" aria-disabled="true" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                                        onClick={() => handlePageChange(1)}
                                                                        disabled={pageActual === 1}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                                            <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path>
                                                                            <path fill="none" d="M24 24H0V0h24v24z"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <button id="pagination-previous-page" type="button" aria-label="Previous Page" aria-disabled="true" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                                        onClick={() => handlePageChange(pageActual - 1)}
                                                                        disabled={pageActual === 1}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                                                                            <path d="M0 0h24v24H0z" fill="none"></path>
                                                                        </svg>
                                                                    </button>                                             
                                                                    <button id="pagination-next-page" type="button" aria-label="Next Page" aria-disabled="false" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                                        onClick={() => handlePageChange(pageActual + 1)}
                                                                        disabled={getTotalPaginas === pageActual}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                                                                            <path d="M0 0h24v24H0z" fill="none"></path>
                                                                        </svg>
                                                                    </button>
                                                                    <button id="pagination-last-page" type="button" aria-label="Last Page" aria-disabled="false" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                                        onClick={() => handlePageChange(getTotalPaginas)}
                                                                        disabled={getTotalPaginas === pageActual}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                                            <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path>
                                                                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    ) : null

                                                }
                                                <div className='col-md-12 text-right'>
                                                    <label className='mx-4 text-success'>CASOS SELECCIONADOS: {getSelectedData.length}</label>
                                                    <button disabled={getSelectedData.length == 0} type='button' data-toggle="modal" className='btn btn-rounded btn-primary' data-target={'#modal-consultar-usuario'}>ASIGNAR A...</button>
                                                </div>
                                                <hr />
                                                <div className='mt-3'>
                                                    <>
                                                        {
                                                            (getUsuarioSeleccionado) ? (
                                                                <div className="block-content block-content-full border border-success mt-1">
                                                                    <div className="row">
                                                                        <div className="col-md-12 text-center mb-3">
                                                                            <label className='mx-4 text-success'>CASOS SELECCIONADOS:{getSelectedData.length}</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12 text-center mb-3">
                                                                            <h4>USUARIO DESTINO SELECCIONADO</h4>
                                                                        </div>

                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <strong>NOMBRE</strong> : {getUsuarioSeleccionado.nombre.toUpperCase()}
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <strong>APELLIDO</strong> : {getUsuarioSeleccionado.apellido.toUpperCase()}
                                                                        </div>

                                                                    </div>
                                                                    <div className="row">

                                                                        <div className="col-md-6">
                                                                            <strong>CORREO</strong> : {getUsuarioSeleccionado.email.toUpperCase()}
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <strong>DEPENDECIA DESTINO</strong> : {getUsuarioSeleccionado.dependencia.nombre.toUpperCase()}
                                                                        </div>
                                                                    </div>

                                                                    <div className='col-md-12 text-center mt-3'>
                                                                        <button disabled={getSelectedData.length == 0} type='button' className='btn btn btn-primary' onClick={() => onClicAsociarCasos()}>ASOCIAR CASOS</button>
                                                                    </div>

                                                                </div>
                                                            ) : null
                                                        }
                                                    </>
                                                </div>

                                                <div className="modal fade" id={'modal-consultar-usuario'} tabIndex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                                                    <div className="modal-dialog modal-lg" role="document" >
                                                        <div className="modal-content">
                                                            <div className="block block-themed block-transparent mb-0">
                                                                <div className="block-header bg-primary-dark">
                                                                    <h3 className="block-title">SELECCIONAR UN USUARIO PARA ASIGNARLE LOS CASOS</h3>
                                                                    <div className="block-options">
                                                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                                            <i className="fa fa-fw fa-times"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="block-content block-content-full text-center">
                                                                    {
                                                                        getListaUsuarios.data.length > 0
                                                                        ? 
                                                                            <div className="row" >
                                                                                <div className="col-md-12" style={{ 'height': '400px', 'overflow': 'scroll', 'display': 'block' }}>
                                                                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>NOMBRE</th>
                                                                                                <th>APELLIDO</th>
                                                                                                <th>EMAIL</th>
                                                                                                <th>DEPENDENCIA</th>
                                                                                                <th>SELECCIONAR</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody >
                                                                                            { listarCoincidencias() }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        : 
                                                                            <label className="text-danger">NO SE ENCONTRARON USUARIOS HABILITADOS O ASIGNADOS A LA DEPENDENCIA { getUser().nombre_dependencia.nombre }</label>
                                                                    }

                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                    ) : (
                                        <div>
                                            
                                            <div className="">
                                                <div className="row text-center w2d-enter">
                                                    <div className="col-md-12">
                                                        <div className="alert alert-primary" role="alert">
                                                            <p className="mb-0"><strong>EL USUARIO NO CUENTA CON CASOS ACTIVOS</strong></p>                                                           
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            }
                            </div>
                        </>

                    </Form>
                )}
            </Formik>
        </>
    )

}

export default CasosActivos;