import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoExitoApi from '../../Utils/InfoExitoApi';
import ModalDatosInteresado from '../../Utils/Modals/ModalDatosInteresado';
import Spinner from '../../Utils/Spinner';
import { useLocation } from 'react-router-dom'
import { hasAccess } from '../../../components/Utils/Common';
import ListaBotones from '../../Utils/ListaBotones';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';
import { quitarAcentos } from '../../../components/Utils/Common';

function DatosInteresadoLista() {


    const [getRoutes, setRoutes] = useState({
        id_etapa: global.Constants.ETAPAS.CAPTURA_REPARTO,
        id_fase: global.Constants.FASES.INTERESADO,
        crear_registro: "/DatosInteresadoForm",
        consultar_registros: "/DatosInteresadoLista",
        adjuntar_documento: "/SoporteRadicadoForm",
        repositorio_documentos: "/SoporteRadicadoLista",
        modulo: "CR_Interesado",
        muestra_atras: true,
        muestra_inactivos: true,
        ocultar_agregar: hasAccess('CR_Interesado', 'Crear') ? false : true
    });

    const [estadoEtapaCapturaReparto, setEstadoEtapaCapturaReparto] = useState(false);
    const [getEstadoLista, setEstadoLista] = useState('');
    const [datosInteresado, setDatosInteresado] = useState({});
    const [getListaDetalleCambios, setListaDetalleCambios] = useState({ data: [], links: [], meta: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [datosInteresadoListaSearch, setDatosInteresadoListaSearch] = useState({ data: [], links: [], meta: [] });
    const [getSeach, setSeach] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    const [getNombreProceso, setNombreProceso] = useState('');


    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setEstadoLista("Activos");
            nombreProceso();

        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    cargarDatosInteresados(1, paganationPerPages, global.Constants.ESTADOS.ACTIVO);
                }
                else{
                    window.showSpinner(false);
                }
            }
        )
    }


    const columns = [
        {
            name: 'REGISTRADO POR',
            selector: datosInteresado => <div>
                <strong>USUARIO: </strong>{datosInteresado.attributes.nombre_completo.toUpperCase()}<br />
                <strong>ETAPA: </strong>{datosInteresado.attributes.etapa.nombre.toUpperCase()}<br />
                <strong>FECHA: </strong>{datosInteresado.attributes.created_at}<br />
                <strong>DEPENDENCIA: </strong>{datosInteresado.attributes.dependencia.nombre}<br />
            </div>,
            sortable: true,
            wrap: true,
            width: "400px"
        },
        {
            name: 'TIPO INTERESADO',
            cell: datosInteresado => 
            <div>
                { datosInteresado.attributes.nombre_tipo_interesado.toUpperCase() } { datosInteresado.attributes.id_tipo_entidad ? (datosInteresado.attributes.id_tipo_entidad == global.Constants.ENTIDAD.PUBLICA ? 'PUBLICA' : 'PRIVADA') : '' }
            </div>,
            selector: datosInteresado => datosInteresado.attributes.primer_apellido + datosInteresado.attributes.segundo_apellido + datosInteresado.attributes.primer_nombre + datosInteresado.attributes.segundo_nombre,
            sortable: true,
            wrap: true,
            width: "150px"            
        },
        {
            name: 'INTERESADO',
            cell: datosInteresado => 
            <div>
                {datosInteresado.attributes.primer_nombre ? datosInteresado.attributes.primer_nombre.toUpperCase()+' ' :'ANÓNIMO(A) '} 
                {datosInteresado.attributes.segundo_nombre ? datosInteresado.attributes.segundo_nombre.toUpperCase()+' ' :null}
                {datosInteresado.attributes.primer_apellido ? datosInteresado.attributes.primer_apellido.toUpperCase()+' ' :'ANÓNIMO(A)'}
                {datosInteresado.attributes.segundo_apellido ? datosInteresado.attributes.segundo_apellido.toUpperCase()+' '  : null}<br/>
                {datosInteresado.attributes.numero_documento !== '2030405060'?<><strong>DOCUMENTO: </strong>{datosInteresado.attributes.numero_documento}</>:''}<br/>
                {datosInteresado.attributes.sujeto_procesal_nombre!==''?<><strong>SUJETO PROCESAL: </strong>{datosInteresado.attributes.sujeto_procesal_nombre.toUpperCase()}</>:''}
            </div>,
            selector: datosInteresado => datosInteresado.attributes.primer_apellido + datosInteresado.attributes.segundo_apellido + datosInteresado.attributes.primer_nombre + datosInteresado.attributes.segundo_nombre,
            sortable: true,
            wrap: true,
            width: "350px"
        },
        {
            name: 'ENTIDAD',
            cell: datosInteresado => <div>{datosInteresado.attributes.nombre_entidad}</div>,
            selector: datosInteresado => (datosInteresado.attributes.nombre_entidad),
            sortable: true,
            width: "350px"
        },
        {
            name: 'ESTADO',
            selector: datosInteresado => (datosInteresado.attributes.nombre_estado),
            sortable: true,
            width: "150px"
        },
        {
            name: 'ACCIONES',
            cell: datosInteresado => <div className='row'>
                <div className='col-4'>
                    <button type='button' className='btn btn-sm btn-primary' onClick={() => showModal(datosInteresado.id)}><span className="fas fa-search"></span></button>

                </div>
                <div className='col'>
                    {
                        (hasAccess('CR_Interesado', 'Inactivar') && from.mismoUsuarioBuscador) ? (
                            <div>

                                {
                                    (datosInteresado.attributes.estado == global.Constants.ESTADOS.INACTIVO) ? (
                                        <Link to={`/DatosInteresadoCambiarEstadoForm/${datosInteresado.id}`} state={{ from: from }}>
                                            <button type='button' title='Activar Datos Interesado' className='btn btn-sm btn-success' data-toggle="modal" data-target={'#modal-cambiar-estado'}><i className="fas fa-plus-circle"></i></button>
                                        </Link>
                                    ) : null
                                }

                                {
                                    (datosInteresado.attributes.estado == global.Constants.ESTADOS.ACTIVO && (datosInteresadoListaSearch.data.length > 1 || pageActual > 1)) ? (
                                        <Link to={`/DatosInteresadoCambiarEstadoForm/${datosInteresado.id}`} state={{ from: from }}>
                                            <button type='button' title='Inactivar Datos' className='btn btn-sm btn-danger'><i className="fas fa-minus-circle"></i></button>
                                        </Link>
                                    ) : null
                                }

                            </div>
                        ) : null
                    }
                </div>
            </div>
            , width: "150px"
        }
    ];


    const validaCierre = () => {
        // VALIDA CIERRE DE ETAPA CAPTURA Y REPARTO
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

        GenericApi.getByDataGeneric("cierre-etapa/get-cierre-etapa", dataCierreEtapa).then(
            datos => {
                if (!datos.error) {
                    if (datos["data"].length > 0) {
                        setEstadoEtapaCapturaReparto(true);
                    }
                }
                else {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: DATOS DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/DatosInteresadoLista', from: { from } });
                }
                window.showSpinner(false);
            }
        )
    }

    const showModal = (id) => {
        window.showSpinner(true);
        //buscamos el detalle

        GenericApi.getGeneric("datos-interesado/datos-interesado-id/" + id).then(
            datos => {
                if (!datos.error) {

                    if (datos["data"].length > 0) {

                        setDatosInteresado(datos["data"][0]["attributes"]);
                        window.showModalDatosInteresado(datos["data"][0]["attributes"]);
                        cargarHistorialCambios(id);
                        //buscamos las modificaciones sobre le registro
                    }
                }
                else {
                    cargarHistorialCambios(id);
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: DATOS DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/DatosInteresadoLista', from: { from } });
                }
            }

        )
    }


    const cargarHistorialCambios = (id) => {
        GenericApi.getByIdGeneric('log-proceso-disciplinario/get-log-proceso', id).then(
            datos2 => {
                // console.log(JSON.stringify(datos2));
                if (!datos2.error) {
                    setListaDetalleCambios(datos2);
                    window.showSpinner(false)
                } else {
                    window.showSpinner(false)
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: DATOS DEL INTERESADO", message: datos2.error.toString(), show: true, redirect: '/DatosInteresadoLista', from: { from } });
                }
            }
        );
    }

    const cargarDatosInteresados = (page, perPage, estado) => {

        const data = {
            "data": {
                "type": "interesado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "tipo_documento": "1",
                    "numero_documento": "1",
                    "primer_nombre": "1",
                    "segundo_nombre": "1",
                    "primer_apellido": "1",
                    "segundo_apellido": "1",
                    "estado": estado,
                    'per_page': perPage,
                    'current_page': page
                }
            }
        }

        if (hasAccess('CR_Interesado', 'Consultar')) {

            GenericApi.getByDataGeneric('datos-interesado/datos-interesado/' + procesoDisciplinarioId, data).then(
                datos => {
                    if (!datos.error) {
                        setDatosInteresadoListaSearch(datos);
                        validaCierre();
                    } else {
                        setModalState({ title: getNombreProceso.toUpperCase() + " :: DATOS DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/DatosInteresadoLista', from: { from } });
                        validaCierre();
                    }
                }
            )
        }
        else {
            window.showSpinner(false)
        }

    }

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarDatosInteresados(page, perPage, (getEstadoLista == "Inactivos" ? '0' : "1"));
    }

    const handlePerRowsChange = async (newPerPage, page) => {

        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarDatosInteresados(page, newPerPage, (getEstadoLista == "Inactivos" ? '0' : "1"));

    }


    const handleCallback = (childData) => {
        try {
            window.showSpinner(true);
            setEstadoLista(childData == global.Constants.ESTADOS.INACTIVO ? "Inactivos" : "Activos")
            cargarDatosInteresados(1, paganationPerPages, childData);
        } catch (error) {

        }

    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            {<InfoExitoApi />}



            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <small>Lista de datos del interesado</small></li>
                    </ol>
                </nav>
            </div>




            {<ModalDatosInteresado datosInteresado={datosInteresado} getListaDetalleCambios={getListaDetalleCambios} proceso = {getNombreProceso}/>}
            {<ModalGen data={getModalState} />}
            {<InfoExitoApi />}
            <Formik>
                <Form>

                    <div className="block block-themed">

                        <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                            <h3 className="block-title"> {getNombreProceso.toUpperCase()} :: <strong>DATOS DEL INTERESADO {getEstadoLista.toUpperCase()}</strong></h3>
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
                                    <ListaBotones getRoutes={getRoutes} from={from} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />

                                </div>


                                {
                                    (hasAccess('CR_Interesado', 'Consultar')) ? (
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className='table-responsive-md'>



                                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                        columns={columns}
                                                        data={datosInteresadoListaSearch.data.filter((suggestion) => {
                                                            if (getSeach === "") {
                                                                return suggestion;
                                                            } else if (

                                                                ((quitarAcentos(suggestion.attributes.primer_apellido) +
                                                                    quitarAcentos(suggestion.attributes.segundo_apellido) + 
                                                                    quitarAcentos(suggestion.attributes.primer_nombre) +
                                                                    quitarAcentos(suggestion.attributes.segundo_nombre) + 
                                                                    quitarAcentos(suggestion.attributes.nombre_entidad)+
                                                                    suggestion.attributes.created_at + 
                                                                    quitarAcentos(suggestion.attributes.nombre_completo) + 
                                                                    quitarAcentos(suggestion.attributes.etapa.nombre) + 
                                                                    quitarAcentos(suggestion.attributes.numero_documento)+
                                                                    quitarAcentos(suggestion.attributes.sujeto_procesal_nombre)+
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
                                                        paginationTotalRows={datosInteresadoListaSearch.data.length}
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
export default DatosInteresadoLista;
