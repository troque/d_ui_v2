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

function MisPendientes() {

    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
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
                    "usuario_actual": nombreUsuario
                }
            }
        }
        console.log("DATA: " + JSON.stringify(data));
        GenericApi.getByDataGeneric('mis-pendientes-filter', data).then(

            datos => {
                if (!datos.error) {
                    console.log(datos);
                    setListaPendientes(datos);
                    setCasosActivos(datos.data.length);
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
        //window.showSpinner(true);
        setPageActual(page);
        //cargarPendientes(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarPendientes(page, newPerPage);
    }

    const enviarDatos = () => {

        window.showSpinner(true);
        setListaPendientes({ data: [], links: [], meta: [] });
        var result = new Date();
        result.setDate(result.getDate() - selectedRango);
        let day = ("0" + result.getDate()).slice(-2);  //get day with slice to have double digit day
        let month = ("0" + (result.getMonth() + 1)).slice(-2); //get your zero in front of single month digits so you have 2 digit months
        let date = result.getFullYear() + '-' + month + '-' + day;
        setFechaFiltro(date);

        const data = {
            "data": {
                "type": "pendientes",
                "attributes": {
                    "fecha": (selectedRango != global.Constants.RANGOS.TODOS) ? date : '',
                    'per_page': paganationPerPages,
                    'current_page': '1',
                    "usuario_actual": nombreUsuario
                }
            }
        }

        GenericApi.getByDataGeneric("mis-pendientes-filter", data).then(
            datos => {
                if (!datos.error) {
                    setListaPendientes(datos)
                }
                else {
                    setModalState({ title: "Mis pendientes", message: datos.error.toString(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
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
                                <label><i className="fas fa-user-clock"></i> MIS CASOS ACTIVOS: {casosActivos}</label>
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
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

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

export default MisPendientes;