import React, { useEffect, useState, } from 'react';
import { Form, Field, Formik } from 'formik';
import { Link } from 'react-router-dom';
import Spinner from '../Utils/Spinner';
import { ParametroModel } from '../Models/ParametroModel';
import ModalRemitirExpediente from '../Utils/Modals/ModalRemitirExpediente';
import { getUser, hasAccess, quitarAcentos } from '../Utils/Common';
import DataTable from 'react-data-table-component';
import GenericApi from '../Api/Services/GenericApi';
import ModalGen from '../Utils/Modals/ModalGeneric';
import '../Utils/Constants';

function MisPendientes2() {

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

    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    //const paganationPerPages = 3;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    //const [perPage, setPerPage] = useState(3);
    const [pageActual, setPageActual] = useState(1);
    const [listaPendientes, setListaPendientes] = useState({ data: [], links: [], meta: [] });
    const [getSeach, setSeach] = useState('');
    const [selectedRango, setSelectedRango] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [casosActivos, setCasosActivos] = useState(0);
    const [getFechaFiltro, setFechaFiltro] = useState();
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getDatosParaRemitir, setDatosParaRemitir] = useState({});
    const [getColorPrimary, setColorPrimary] = useState("btn btn-sm btn-primary w2d_btn-large mr-1 mb-3 text-left");
    const [getDatosInformacion, setDatosInformacion] = useState({});
    const [getTotalPaginas, setTotalPaginas] = useState(0);
    const [getTotalRegistros, setTotalRegistros] = useState(0);

    const columns = [
        {
            name: 'RADICADO',
            cell: pendiente => <div>{pendiente.attributes.MisPendientes.attributes.radicado}</div>,
            selector: pendiente => pendiente.attributes.MisPendientes.attributes.radicado,
            sortable: true,
            width: "200px"
        },
        {
            name: 'PROCESO',
            cell: pendiente => 
                <div>
                    <small><strong>VIGENCIA:</strong> {pendiente.attributes.MisPendientes.attributes.vigencia}</small><br />
                    <small><strong>ETAPA:</strong> {pendiente.attributes.MisPendientes.attributes.etapa.nombre}</small><br />
                    <small><strong>FECHA DE ACTUALIZACIÓN:</strong> {pendiente.attributes.MisPendientes.attributes.fecha_actualizacion}</small><br />
                    <small><strong>FECHA DE REGISTRO:</strong> {pendiente.attributes.MisPendientes.attributes.created_at}</small><br />
                    <small style={{ color: '#76B947' }}><strong>{pendiente.attributes.Clasificacion.nombre.toUpperCase()} - {pendiente.attributes.MisPendientes.attributes.evaluacion!=null?pendiente.attributes.MisPendientes.attributes.evaluacion.nombre.toUpperCase():null}</strong></small><br />
                    {pendiente.attributes.MisPendientes.attributes.migrado == '1' ? <><small style={{ color: '#E64739' }}><strong>PROCESO MIGRADO</strong></small><br /></> : null }
                </div>,
            selector: pendiente => (pendiente.attributes.MisPendientes.attributes.vigencia),
            sortable: true,
            width: "350px"
        },

        {
            name: 'OBSERVACIONES',
            cell: pendiente => 
            <div>
                
            <span data-toggle="modal" data-target={"#q"+pendiente.attributes.MisPendientes.attributes.radicado}><small>ÚLTIMO ANTECEDENTE</small></span>

                <div className="modal fade" id={"q"+pendiente.attributes.MisPendientes.attributes.radicado} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                        <div className="modal-header block.block-themed">
                            <h5 className="modal-title" id="descriptionModalLabel">{pendiente.attributes.MisPendientes.attributes.radicado} - {pendiente.attributes.MisPendientes.attributes.vigencia} :: ÚLTIMO ANTECEDENTE </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.descripcion.toUpperCase()}                              
                        </div>                  
                        </div>
                    </div>
                </div>
        
        </div>,
            selector: pendiente => (pendiente.attributes.MisPendientes.attributes.vigencia),
            sortable: true,
            width: "200px"
        },

        {
            name: 'DIAS HÁBILES',
            selector: pendiente => (pendiente.attributes.MisPendientes.attributes.dias_habiles),
            sortable: true,
            width: "200px"
        },
        {
            name: 'DIAS CALENDARIO',
            selector: pendiente => (pendiente.attributes.MisPendientes.attributes.dias_calendario),
            sortable: true,
            width: "200px"
        },
        {
            name: 'ACCIONES',
            cell: pendiente =>

                <div>
                    {
                        (hasAccess('MP_Semaforizacion', 'Consultar')) ?(
                        <Link to={`/ListaSemaforos/`} state={{
                                    from: new ParametroModel(pendiente.attributes.MisPendientes.attributes.radicado,
                                        pendiente.attributes.MisPendientes.id,
                                        pendiente.attributes.MisPendientes.attributes.vigencia,
                                        (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.id : ""),
                                        (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.nombre.toUpperCase() : ""),
                                        getColorPrimary,
                                        getColorPrimary,
                                        getColorPrimary,
                                        getColorPrimary,
                                        getColorPrimary,
                                        getColorPrimary,
                                        getColorPrimary,
                                        (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario) ? (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre : "") + ' ' + (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido : "") : "",
                                        pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.descripcion,
                                        pendiente.attributes.MisPendientes.attributes.created_at,
                                        (pendiente.attributes.MisPendientes.attributes.proceso_sinproc ? pendiente.attributes.MisPendientes.attributes.proceso_sinproc.fecha_ingreso
                                            : (pendiente.attributes.MisPendientes.attributes.proceso_sirius ? pendiente.attributes.MisPendientes.attributes.proceso_sirius.fecha_ingreso
                                                : (pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente ? pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente.fecha_ingreso
                                                    : (pendiente.attributes.MisPendientes.attributes.proceso_desglose? pendiente.attributes.MisPendientes.attributes.proceso_desglose.fecha_ingreso:null)))),
                                        (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia) ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia.nombre : "",
                                    )
                                }}>
                            <button type="button" className="btn btn-primary mb-1" data-toggle="tooltip" data-html="true" title="Semaforización" data-original-title="Semaforización"><span className="fas fa-traffic-light"> </span></button>
                        </Link>):null
                    }


                    {
                        (hasAccess('MP_Historial_Expediente', 'Consultar')) ?( 

                        <Link to={`/LogProcesoDisciplinario/`} state={{
                            from: new ParametroModel(pendiente.attributes.MisPendientes.attributes.radicado, pendiente.attributes.MisPendientes.id, pendiente.attributes.MisPendientes.attributes.vigencia,
                                true, getColorPrimary, getColorPrimary, getColorPrimary, getColorPrimary, getColorPrimary)
                            }}>
                            <button type="button" className="btn btn-primary mb-1" data-toggle="tooltip" data-html="true" title="Consultar Historial" data-original-title="Consultar Semáforos"><span className="fas fa-folder-open"> </span></button>
                        </Link>):null
                    }

                    {
                        (hasAccess('MP_RemitirProceso', 'Consultar')) ? (
                            <button type="button" className="btn btn-primary mb-1" data-toggle="tooltip" data-html="true" title="Remitir proceso" onClick={() => showModal(pendiente)} data-original-title="Remitir proceso"><span className="fas fa-file-import"> </span></button>
                        ) : null
                    }

                    {
                        (hasAccess('MP_RamasProceso', 'Consultar')) ? (
                            <Link to={`/RamasProceso/`} state={{
                                from: new ParametroModel(pendiente.attributes.MisPendientes.attributes.radicado,
                                    pendiente.attributes.MisPendientes.id,
                                    pendiente.attributes.MisPendientes.attributes.vigencia,
                                    (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.id : ""),
                                    (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.nombre.toUpperCase() : ""),
                                    getColorPrimary,
                                    getColorPrimary,
                                    getColorPrimary,
                                    getColorPrimary,
                                    getColorPrimary,
                                    getColorPrimary,
                                    getColorPrimary,
                                    (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario) ? (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre : "") + ' ' + (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido : "") : "",
                                    pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.descripcion,
                                    pendiente.attributes.MisPendientes.attributes.created_at,
                                    (pendiente.attributes.MisPendientes.attributes.proceso_sinproc ? pendiente.attributes.MisPendientes.attributes.proceso_sinproc.fecha_ingreso
                                        : (pendiente.attributes.MisPendientes.attributes.proceso_sirius ? pendiente.attributes.MisPendientes.attributes.proceso_sirius.fecha_ingreso
                                            : (pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente ? pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente.fecha_ingreso
                                                : (pendiente.attributes.MisPendientes.attributes.proceso_desglose ? pendiente.attributes.MisPendientes.attributes.proceso_desglose.fecha_ingreso:null)))),
                                    (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia) ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia.nombre : "",
                                )
                            }}>
                                <button type="button" className="btn btn-primary mb-1" data-toggle="tooltip" data-html="true" title="Ver rama del proceso" data-original-title="Ver rama del proceso"><span className="fas fa-code-branch"> </span></button>
                            </Link>
                        ) : null
                    }
                    {(hasAccess('MP_Caratula', 'Consultar')) ?
                        <Link to={`/Caratulas/`} state={{
                            from: new ParametroModel(pendiente.attributes.MisPendientes.attributes.radicado,
                                pendiente.attributes.MisPendientes.id,
                                pendiente.attributes.MisPendientes.attributes.vigencia,
                                (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.id : ""),
                                (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.nombre.toUpperCase() : ""),
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario) ? (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre : "") + ' ' + (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido : "") : "",
                                pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.descripcion,
                                pendiente.attributes.MisPendientes.attributes.created_at,
                                (pendiente.attributes.MisPendientes.attributes.proceso_sinproc ? pendiente.attributes.MisPendientes.attributes.proceso_sinproc.fecha_ingreso
                                    : (pendiente.attributes.MisPendientes.attributes.proceso_sirius ? pendiente.attributes.MisPendientes.attributes.proceso_sirius.fecha_ingreso
                                        : (pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente ? pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente.fecha_ingreso
                                            : (pendiente.attributes.MisPendientes.attributes.proceso_desglose ? pendiente.attributes.MisPendientes.attributes.proceso_desglose.fecha_ingreso:null)))),
                                (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia) ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia.nombre : "",
                            )
                        }}>
                            <button type="button" className="btn btn-primary mb-1" data-toggle="tooltip" data-html="true" title="Imprimir carátula" data-original-title="Imprimir carátula"><span className="fas fa-file-pdf"> </span></button>
                        </Link>
                        : null}
                        {
                            pendiente.attributes.MisPendientes.attributes.etapa.id == global.Constants.ETAPAS.EVALUACION_PD ||
                            pendiente.attributes.MisPendientes.attributes.etapa.id == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR ||
                            pendiente.attributes.MisPendientes.attributes.etapa.id == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA ||
                            pendiente.attributes.MisPendientes.attributes.etapa.id == global.Constants.ETAPAS.CAUSA_JUZGAMIENTO ||
                            pendiente.attributes.MisPendientes.attributes.etapa.id == global.Constants.ETAPAS.PROCESO_VERBAL ||
                            pendiente.attributes.MisPendientes.attributes.etapa.id == global.Constants.ETAPAS.SEGUNDA_INSTANCIA
                            ?
                                <button type="button" className="btn btn-primary mb-1" data-toggle="tooltip" data-html="true" title="Información Adicional" data-original-title="Información Adicional" onClick={() => showModalInformacion(pendiente.attributes.MisPendientes.attributes.ultimo_transpaso)}><span className="fas fa-info"> </span></button>
                            : 
                                null
                        }
                </div>,
            width: "300px"
        }
    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setNombreUsuario(getUser().nombre);
            cargarPendientes(1, paganationPerPages);
        }
        fetchData();
    }, []);

    const cargarPendientes = (page, perPage) => {

        const data = {
            "data": {
                "type": "pendietes",
                "attributes": {
                    "fecha": getFechaFiltro,
                    'per_page': perPage,
                    'current_page': page,
                    "usuario_actual": nombreUsuario,
                    "palabra_buscar": getSeach
                }
            }
        }
        GenericApi.getByDataGeneric('mis-pendientes-filter', data).then(

            datos => {
                if (!datos.error) {
                    setListaPendientes(datos);
                    setCasosActivos(datos.data.length);
                    if(datos.data.length > 0){
                        setTotalPaginas(datos.data[0].attributes.TotalPaginas)
                        setTotalRegistros(datos.data[0].attributes.TotalRegistros)
                    }
                    window.showSpinner(false);
                }
                else {
                    setModalState({ title: "Mis pendientes", message: datos.error.toString(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    //cargamos el modal para remitir proceso
    const showModal = (atributo) => {
        setDatosParaRemitir(atributo);
        window.showModalRemitirProceso(atributo);
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

    const enviarDatos = () => {

        window.showSpinner(true);
        setListaPendientes({ data: [], links: [], meta: [] });
        var result = new Date();
        result.setDate(result.getDate() - selectedRango);
        let day = ("0" + result.getDate()).slice(-2);  //get day with slice to have double digit day
        let month = ("0" + (result.getMonth() + 1)).slice(-2); //get your zero in front of single month digits so you have 2 digit months
        let date = result.getFullYear() + '-' + month + '-' + day;
        
        if(selectedRango != global.Constants.RANGOS.TODOS){
            setFechaFiltro(date);
        }
        else{
            setFechaFiltro();
        }
       
        setPerPage(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
        setPageActual(1);

        const data = {
            "data": {
                "type": "pendientes",
                "attributes": {
                    "fecha": (selectedRango != global.Constants.RANGOS.TODOS) ? date : '',
                    'per_page': global.Constants.DATA_TABLE.PAGINATION_PER_PAGE,
                    'current_page': '1',
                    "usuario_actual": nombreUsuario
                }
            }
        }

        GenericApi.getByDataGeneric('mis-pendientes-filter', data).then(

            datos => {
                if (!datos.error) {
                    setListaPendientes(datos);
                    setCasosActivos(datos.data.length);
                    if(datos.data.length > 0){
                        setTotalPaginas(datos.data[0].attributes.TotalPaginas)
                        setTotalRegistros(datos.data[0].attributes.TotalRegistros)
                    }
                    window.showSpinner(false);
                }
                else {
                    setModalState({ title: "Mis pendientes", message: datos.error.toString(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const showModalInformacion = (datos_informacion) => {
        setDatosInformacion(datos_informacion)
        window.showModalInformacionMisPendientes(true);
    }

    const componentInformacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-informacion-mis-pendientes" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">INFORMACIÓN</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <table className="table table-striped table-vcenter js-dataTable-full">
                                        <tbody>
                                            <tr>
                                                <th>FECHA: </th>
                                                <td>{ getDatosInformacion.fecha_transaccion }</td>
                                                <th>USUARIO: </th>
                                                <td>{ getDatosInformacion.usuario }</td>
                                            </tr>
                                            <tr>
                                                <th colSpan={2}>DEPENDENCIA QUE REMITE:</th>
                                                <td colSpan={2}>{ getDatosInformacion.dependencia_remitente }</td>
                                            </tr> 
                                            <tr>
                                                <td colSpan={4}><label>OBSERVACIONES: </label> { getDatosInformacion.observacion }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => window.showModalInformacionMisPendientes(false)}>{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const buscador = () => {
        window.showSpinner(true);
        cargarPendientes(1, paganationPerPages);
    }


    return (
        <>
            {<Spinner />}
            {<ModalRemitirExpediente object={getDatosParaRemitir} />}
            {<ModalGen data={getModalState} />}
            { componentInformacion() }

            <Formik
                initialValues={{
                    rango: ''
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

                        <div className="w2d_block">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">

                            <div className="block-header">
                                <h3 className="block-title">LISTADO DE PENDIENTES</h3>
                                <label><i className="fas fa-user-clock"></i> MIS CASOS ACTIVOS: {getTotalRegistros}</label>
                            </div>

                            <div className="block-content block-content-full">
                                <div className="row">

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label className="pr-2" htmlFor="rango">FILTRAR POR</label>
                                            <div className="btn-group">
                                                <button type="submit" onClick={() => setSelectedRango(7)} className="btn btn-outline-primary">
                                                    <i className="far fa-calendar-alt"></i> ÚLTIMOS 7 DÍAS
                                                </button>
                                                <button type="submit" onClick={() => setSelectedRango(1)} className="btn btn-outline-primary">
                                                    <i className="far fa-clock"></i> DESDE AYER
                                                </button>
                                                <button type="submit" onClick={() => setSelectedRango(0)} className="btn btn-outline-primary">
                                                    <i className="far fa-hand-point-down"></i> HOY
                                                </button>
                                                <button type="submit" onClick={() => setSelectedRango(global.Constants.RANGOS.TODOS)} className="btn btn-outline-primary">
                                                    <i className="fas fa-redo" ></i> TODO
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className="form-group">
                                            <div class="input-group-append">                                                
                                                <Field type="text" id="search" name="search" initialValues={getSeach} onChange={e => setSeach(e.target.value)} className="form-control border border-success" placeholder="Buscar" />
                                                <div class="input-group-append">
                                                    <button type="button" class="btn btn-primary" onClick={buscador}>Buscar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="block-content block-content-full">
                                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                            columns={columns}
                                            data={listaPendientes.data.filter((suggestion) => {
                                                if (getSeach === "") {
                                                    return suggestion;
                                                } else if (
                                                    ((quitarAcentos(suggestion.attributes.MisPendientes.attributes.estado.nombre) + suggestion.attributes.MisPendientes.attributes.radicado +
                                                        quitarAcentos(suggestion.attributes.MisPendientes.attributes.nombre_tipo_expediente) + suggestion.attributes.MisPendientes.attributes.vigencia +
                                                        suggestion.attributes.MisPendientes.attributes.created_at + suggestion.attributes.MisPendientes.attributes.dias_habiles +
                                                        suggestion.attributes.MisPendientes.attributes.dias_calendario + quitarAcentos(suggestion.attributes.Clasificacion.nombre)).toLowerCase().includes(getSeach.toLowerCase()))
                                                ) {
                                                    return suggestion;
                                                }
                                            })}
                                            perPage={perPage}
                                            page={pageActual}
                                            pagination
                                            noDataComponent="Sin datos"
                                            paginationTotalRows={listaPendientes.data.length}
                                            onChangePage={handlePageChange}
                                            onChangeRowsPerPage={handlePerRowsChange}
                                            defaultSortFieldId="Nombre"
                                            striped
                                            paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                            defaultSortAsc={false}
                                            paginationComponent={() => (
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }} class="sc-ezOQGI hoQsHK">
                                                    <span style={{  paddingTop: "9px" }}> { ((pageActual-1) * paganationPerPages) + 1 } - { ((pageActual-1) * paganationPerPages) + listaPendientes.data.length } de {getTotalRegistros}</span>
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
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )

}

export default MisPendientes2;