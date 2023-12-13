import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import ListaBotones from '../../Utils/ListaBotones';
import { hasAccess } from '../../../components/Utils/Common';
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';

import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import { quitarAcentos } from '../../Utils/Common';

function AntecedentesLista() {

    const location = useLocation()
    const { from , disable } = location.state
    let radicado = from.radicado;
    let vigencia = from.vigencia;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let id_etapa = from.idEtapa;
    const paganationPerPages = process.env.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(process.env.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [errorApi, setErrorApi] = useState('');
    const [getSeach, setSeach] = useState('');

    const [getRoutes, setRoutes] = useState({
        id_etapa: id_etapa,
        id_fase: global.Constants.FASES.ANTECEDENTES,
        crear_registro: "/AntencentesForm",
        consultar_registros: "/AntencentesLista",
        adjuntar_documento: "/SoporteRadicadoForm",
        repositorio_documentos: "/SoporteRadicadoLista",
        modulo: "CR_Antecedente",
        funcionalidad_crear: "Crear",
        funcionalidad_consultar: "Consultar",
        funcionalidad_inactivar: "Inactivar",
        muestra_atras: true,
        muestra_inactivos: true,
    });

    const [getEstadoLista, setEstadoLista] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getAntecedentesLista, setAntecedentesLista] = useState({ data: [], links: [], meta: [] });
    const [getListaDetalleCambios, setListaDetalleCambios] = useState({ data: [], links: [], meta: [] });


    const columns = [
        {
            name: 'REGISTRADO POR:',

            cell: antecedente => <div>
                <strong>USUARIO: </strong>{antecedente.attributes.nombre_completo.toUpperCase()}<br/>
                <strong>ETAPA: </strong>{antecedente.attributes.etapa.nombre}<br/>
                <strong>FECHA: </strong>{antecedente.attributes.fecha_creado}<br/>
                <strong>DEPENDENCIA: </strong>{antecedente.attributes.nombre_dependencia}<br/></div>,
            selector: antecedente => antecedente.attributes.nombre_completo,
            sortable: true,
            width: "25%"
        },
        {
            name: 'DESCRIPCIÓN',

            cell: antecedente =>
                <div>
                    <span data-toggle="modal" data-target={"#q"+antecedente.id}>{antecedente.attributes.descripcion_corta.toUpperCase()}</span>
                    
                    <div className="modal fade" id={"q"+antecedente.id} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                            <div className="modal-header block.block-themed">
                                <h5 className="modal-title" id="descriptionModalLabel">{radicado} - {vigencia}:: ANTECEDENTE</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                 {antecedente.attributes.descripcion.toUpperCase()}
                            </div>                  
                            </div>
                        </div>
                    </div>
                </div>,

            selector: antecedente => antecedente.attributes.descripcion,
            sortable: true,
            width: "50%",
        },
        {
            name: 'ESTADO',
            selector: antecedente => (antecedente.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
            width: "10%",
        },
        {
            name: 'ACCIONES',
            width: "15%",

            cell: antecedente => <div className='row'>
                <div className='col-4'>
                    <button type='button' title='CONSULTAR ANTECEDENTE' className='btn btn-sm btn-primary inline' onClick={() => cargarDetalleCambiosEstado(antecedente)}><i className="fas fa-search"></i></button>
                </div>
                <div className='col'>
                    {
                        (hasAccess('CR_Antecedente', 'Inactivar') && from.mismoUsuarioBuscador) ? (
                            <div>

                                {
                                    (antecedente.attributes.estado == 0) ? (
                                        <Link to={`/AntecedentesCambiarEstadoForm/${antecedente.id}`} state={{ from: from , disable: disable }}>
                                            <button type='button' title='Activar Antecedente' className='btn btn-sm btn-success' data-toggle="modal" data-target={'#modal-cambiar-estado'}><i className="fas fa-plus-circle"></i></button>
                                        </Link>
                                    ) : null
                                }

                                {
                                    (antecedente.attributes.estado == 1 && (getAntecedentesLista.data.length > 1 || pageActual > 1)) ? (
                                        <Link to={`/AntecedentesCambiarEstadoForm/${antecedente.id}`} state={{ from: from , disable: disable }}>
                                            <button type='button' title='Inactivar Antecedente' className='btn btn-sm btn-danger'><i className="fas fa-minus-circle"></i></button>
                                        </Link>


                                    ) : null
                                }                                
                            </div>
                        ) : null
                    }
                </div>
            </div>
        }
    ];


    useEffect(() => {

        async function fetchData() {

            setEstadoLista("Activos");
            cargarAntecedentes(1, paganationPerPages, "1");
        }
        fetchData();
    }, []);


    const cargarAntecedentes = (page, perPage, estado) => {
        window.showSpinner(true)
        const data = {
            "data": {
                "type": 'antecedente',
                "attributes": {
                    "antecedentes": "antecedentes",
                    "descripcion": "descripcion",
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "fecha_registro": Date.now(),
                    "id_dependencia": -1,
                    "estado": estado,
                    'per_page': perPage,
                    'current_page': page
                }
            }
        }

        if (hasAccess('CR_Antecedente', 'Consultar')) {

            GenericApi.getByDataGeneric('antecedentes/get-antecedentes/' + procesoDisciplinarioId, data).then(
                datos => {
                    if (!datos.error) {

                        setAntecedentesLista(datos);
                        nombreProceso();

                        try {
                            if (datos.data.length > 0) {
                                from.antecedente = datos.data[0].attributes.descripcion;
                            }
                        } catch (error) {
                        }
                    }
                    else {
                        setModalState({ title:  getNombreProceso+" :: ANTECEDENTES", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: {from} });
                    }
                }
            )
        }
        else {
            window.showSpinner(false)
        }
    }

    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso",procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }
                window.showSpinner(false);
            }
        )
    }

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    const cargarDetalleCambiosEstado = (antecedente) => {

        window.showSpinner(true)
        GenericApi.getByIdGeneric('log-proceso-disciplinario/get-log-proceso', antecedente.id).then(
            datos => {
                if(!datos.error){
                    setListaDetalleCambios(datos)
                    showModalAntecedenteDetalle()
                }
                else{
                    setModalState({ title: getNombreProceso+" :: DETALLE DEL ANTECEDENTE ", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: {from},  })
                }
                window.showSpinner(false)
            }
        );
    }

    const listaDetalleCambios = () => {
        if (getListaDetalleCambios.data != null && typeof (getListaDetalleCambios.data) != 'undefined') {
            return (

                getListaDetalleCambios.data.map((cambio, i) => {
                    return (
                        <tr key={cambio.id}>
                            <td>
                                <strong>FUNCIONARIO:</strong>{cambio.attributes.funcionario_registra ? cambio.attributes.funcionario_registra.nombre.toUpperCase() + ' ' + cambio.attributes.funcionario_registra.apellido.toUpperCase() : ""} <br/>
                                <strong>DEPENDENCIA:</strong> {cambio.attributes.dependencia_origen ? cambio.attributes.dependencia_origen.nombre.toUpperCase() : ""}<br/>
                                <strong>FECHA:</strong> {cambio.attributes.created_at}
                            </td>

                            <td title={cambio.attributes.descripcion} style={{border: '0px' , width:'70%'}}>
                                {cambio.attributes.descripcion.toUpperCase()}
                            </td>
                        </tr>
                    )
                })
            )
        }
    }

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData == global.Constants.ESTADOS.INACTIVO ? "Inactivos" : "Activos")
            cargarAntecedentes(1, paganationPerPages, childData);
        } catch (error) {

        }

    }

    const showModalAntecedenteDetalle = () => {
        window.showModalDetalleListaAntecendente(true);
    }

    const componentAntecedenteDetalle = () => {
        return (
            <>
                <div className="modal fade" id="modal-consultar-detalle" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="block-content" style={{ 'height': '900px', 'overflow': 'scroll', 'display': 'block' }}>
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">{getNombreProceso} :: DETALLE DEL ANTECEDENTE</h3>
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
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                    <thead>
                                                        <tr>
                                                            <th>REGISTRO</th>
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
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.CERRAR}</button>
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
        {<ModalGen data={getModalState} />}
        { componentAntecedenteDetalle() }

            <Formik>
                <Form>

                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from , disable: disable }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Antecedentes</small></li>
                            </ol>
                        </nav>
                    </div>

                    <div className="block block-themed">
                        <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                            <h3 className="block-title">{getNombreProceso} :: <strong> ANTECEDENTES {getEstadoLista.toUpperCase()}</strong></h3>
                        </div>
                        <div className="block-content">
                            <>

                                <div className='row'>

                                    <div className='col-md-3'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} name="search" className="form-control border border-success" placeholder="Buscar" />
                                        </div>
                                    </div>

                                    {/*ListaBotones(getRoutes)*/}
                                    <ListaBotones getRoutes={getRoutes} from={from} disable={disable} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />


                                </div>


                                {
                                    (hasAccess('CR_Antecedente', 'Consultar')) ? (
                                        <div className='col-md-12 mt-2 mb-2'>
                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columns}
                                                data={getAntecedentesLista.data.filter((suggestion) => {
                                                    if (getSeach === "") {
                                                        return suggestion;
                                                    } else if (

                                                        ((quitarAcentos(suggestion.attributes.descripcion)
                                                            + quitarAcentos(suggestion.attributes.nombre_completo) + quitarAcentos(suggestion.attributes.nombre_dependencia) +
                                                            quitarAcentos(suggestion.attributes.fecha_creado) + quitarAcentos(suggestion.attributes.etapa.nombre) +
                                                            (suggestion.attributes.estado == global.Constants.ESTADOS.ACTIVO ? 'Activo' : 'Inactivo') + suggestion.attributes.fecha_registro +
                                                            quitarAcentos(suggestion.attributes.descripcion)).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))

                                                    ) {
                                                        return suggestion;
                                                    }
                                                })}
                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                                paginationTotalRows={getAntecedentesLista.data.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                            />
                                        </div>
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


export default AntecedentesLista;