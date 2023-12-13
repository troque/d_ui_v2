import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import GenericApi from '../Api/Services/GenericApi';
import Spinner from '../Utils/Spinner';
import { Navigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ParametrosMasApi from '../Api/Services/ParametrosMasApi';
import ModalListaVersionesGestorRespuestaAdministracion from '../Utils/Modals/ModalListaVersionesGestorRespuestaAdministracion';
import '../Utils/Constants';

function FuncionarioListaGestorRespuesta() {

    const [getSeach, setSeach] = useState('');
    const [errorApi, setErrorApi] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [getErrorRedirect, setErrorRedirect] = useState(false);

    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    
    const [getListaResultadoEvaluacion, setListaResultadoEvaluacion] = useState([]);
    const [getListaRol, setListaRol] = useState([]);
    const [getListaRolSearch, setListaRolSearch] = useState([]);
    const [getEvaluacion, setEvaluacion] = useState();
    const [getEvaluacionNombre, setEvaluacionNombre] = useState("REALIZANDO");
    const [getFuncionalidadesListModal, setFuncionalidadesListModal] = useState();
    const [getListaTipoExpediente, setListaTipoExpediente] = useState({ data: [] });
    const [getListaTipoDerechoPeticion, setListaTipoDerechoPeticion] = useState({ data: {} });
    const [getSelectedTipoExpediente, setSelectedTipoExpediente] = useState("");
    const [getSelectedDerechoPeticion, setSelectedDerechoPeticion] = useState("");
    const [getSelectedRequiereGestionJuridica, setSelectedRequiereGestionJuridica] = useState("");
    const [getUnicoRol, setUnicoRol] = useState(false);
    const [getSelectedQueja, setSelectedQueja] = useState("");
    const [getListaTiposQueja, setListaTiposQueja] = useState({ data: {} });

    const redirectToRoutes = () => {
        if(getErrorRedirect){
            return <Navigate to={`/`} />;
        }
        else{
            return <Navigate to={`/RolesLista/`} />;
        }
    }

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);     
            obtenerListaExpedientes();

        }
        fetchData();
    }, []);

    let selectChangeTipoExpediente = (e) => {
        setSelectedTipoExpediente(e);
        setSelectedDerechoPeticion("");
        setSelectedRequiereGestionJuridica("");
        setSelectedQueja("");
        setEvaluacion("");
        setListaRol([]);
    }

    let selectChangeDerechoPeticion = (e) => {
        setSelectedDerechoPeticion(e);
        setSelectedRequiereGestionJuridica("");
        setEvaluacion("");
        setListaRol([]);
    }

    let selectChangeRequiereGestionJuridica = (e) => {
        setSelectedRequiereGestionJuridica(e);
        setEvaluacion("");
        setListaRol([]);
    }

    let selectChangeQueja = (e) => {
        setSelectedQueja(e);
        setEvaluacion("");
        setListaRol([]);
    }

    const obtenerListaExpedientes = () => {
        GenericApi.getAllGeneric('mas-tipo-expediente').then(
            datos => {
                if (!datos.error) {
                    setListaTipoExpediente(datos.data);
                    obtenerListaDerechoPeticion();
                }
                else{
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaDerechoPeticion = () => {
        GenericApi.getGeneric("mas-tipo-derecho-peticion").then(
            datos => {
                if (!datos.error) {
                    setListaTipoDerechoPeticion(datos);
                    obtenerListaQueja();
                }                
                else{
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaQueja = () => {
        GenericApi.getGeneric("mas-tipo-queja").then(
            datos => {
                if (!datos.error) {
                    setListaTiposQueja(datos);
                    obtenerListaEvaluacion();
                }
                else{
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaEvaluacion = () => {
        GenericApi.getGeneric("mas-resultado-evaluaciones/evaluaciones").then(
            data => {
                if (!data.error) {
                    setListaResultadoEvaluacion(data["data"])
                    obtenerListaRoles();
                }
                else{
                    setErrorApi(data.error.toString())
                    setErrorRedirect(true)
                    setIsRedirect(true);
                    window.showModal(1)
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerListaRoles = () => {
        GenericApi.getAllGeneric('roles/gestor-respuesta').then(
            datos => {
                if (!datos.error) {
                    if (datos["data"] != "") {
                        setListaRolSearch(datos["data"])
                    }
                    else{
                        setErrorApi(datos.error.toString())
                        setErrorRedirect(true);
                        setIsRedirect(true);
                        window.showModal(1);
                    }
                }
                else {
                    setErrorApi(datos.error.toString())
                    setErrorRedirect(true);
                    setIsRedirect(true);
                    window.showModal(1);
                }
                window.showSpinner(false);
            }
        );
    }

    const agregarUsuario = (valores) => {
        
        let funcionarios = [];

        if(getListaRol.length > 0 && getListaRol[0].id != 0){
            funcionarios = getListaRol;
        }
        setListaRol([]);
        funcionarios.push(
            {
                "id": valores.rol,
                "id_lista_funcionarios": getListaRol.length + "",
                "nombre": valores.nombre ? valores.nombre : getListaRolSearch.find(rol => rol.id == valores.rol).attributes.nombre,
                "orden": getListaRol.length + "",
                "id_evaluacion": getEvaluacion,
                "id_expediente": getSelectedTipoExpediente,
                "id_sub_expediente": getSelectedDerechoPeticion ? getSelectedDerechoPeticion : (getSelectedQueja ? getSelectedQueja : null),
                "id_tercer_expediente": getSelectedRequiereGestionJuridica ? getSelectedRequiereGestionJuridica == 'true' ? 1 : 0 : null,
            }
        )
        setListaRol([...funcionarios]);
        if(funcionarios.length > 1){
            setUnicoRol(false);
        }
        window.showModalAgregarFuncionarioGestorRespuesta(false);
    }

    const eliminarUsuario = (index) => {
        setListaRol(getListaRol.filter((img, i) => i !== index));
    }

    const handleDragEnd = (e) => {
        if (!e.destination) return;
        let tempData = Array.from(getListaRol);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        setListaRol(tempData);
    };

    const showModalConfirmacion = () => {
        window.showModalConfirmacionAdministradorGestorRespuesta();
    }

    const showModalAgregarFuncionario = () => {
        window.showModalAgregarFuncionarioGestorRespuesta(true);
    }

    const showModalListaParametrizadaPrevias = () => {
        window.showModalListaVersionesGestorRespuestaAdminstracion();
    }

    const obtenerListaHistorica = (id_evaluacion, id_expediente, id_sub_expediente, id_tercer_expediente) => {
        GenericApi.getAllGeneric('mas-orden-funcionario/historico/'+id_evaluacion+'/'+id_expediente+'/'+id_sub_expediente+'/'+id_tercer_expediente).then(
            data => {
                if (!data.error) {
                    setFuncionalidadesListModal(data);
                }
                else {
                    setErrorApi(data.error.toString())
                    window.showModal(1)
                    setIsRedirect(true);
                }
            }
        )
    }

    const guardarDatos = () => {
        const attributes = [];

        if(getListaRol.length > 0){
            getListaRol.forEach((funcionario, index) => {
                attributes.push({
                    "id_funcionario": funcionario.id,
                    "orden": (index + 1),
                    "id_evaluacion": funcionario.id_evaluacion,
                    "id_expediente": funcionario.id_expediente,
                    "id_sub_expediente": funcionario.id_sub_expediente,
                    "id_tercer_expediente": funcionario.id_tercer_expediente,
                    "unico_rol": getUnicoRol
                })
            });
        }
        else{
            attributes.push({
                "id_funcionario": 0,
                "orden": 1,
                "id_evaluacion": getEvaluacion,
                "id_expediente": getSelectedTipoExpediente,
                "id_sub_expediente": getSelectedDerechoPeticion ? getSelectedDerechoPeticion : (getSelectedQueja ? getSelectedQueja : null),
                "id_tercer_expediente": getSelectedRequiereGestionJuridica ? getSelectedRequiereGestionJuridica == 'true' ? 1 : 0 : null,
                "unico_rol": getUnicoRol
            });


            const valores = (
                {
                    "rol": 0,
                    "nombre": global.Constants.USUARIO_GESTOR_RESPUESTA,
                    "orden": getListaRol.length + "",
                    "id_evaluacion": getEvaluacion,
                    "id_expediente": getSelectedTipoExpediente,
                    "id_sub_expediente": getSelectedDerechoPeticion ? getSelectedDerechoPeticion : (getSelectedQueja ? getSelectedQueja : null),
                    "id_tercer_expediente": getSelectedRequiereGestionJuridica ? getSelectedRequiereGestionJuridica == 'true' ? 1 : 0 : null,
                }
            )

            agregarUsuario(valores);
        }

        const data = {
            "data": {
                "type": "remision_queja",
                "attributes": attributes
            }
        }

        window.showSpinner(true);

        ParametrosMasApi.addFuncionariosGestorRespuesta(data).then(
            datos => {
                if (!datos.error) {                   
                    window.showModal(2);
                    window.showSpinner(false);
                    if(getListaRol.length > 0){
                        obtenerListaHistorica(getEvaluacion, getListaRol[0]['id_expediente'], getListaRol[0]['id_sub_expediente'], getListaRol[0]['id_tercer_expediente']);
                    }
                    else{
                        obtenerListaHistorica(
                            getEvaluacion, 
                            getSelectedTipoExpediente, 
                            getSelectedDerechoPeticion ? getSelectedDerechoPeticion : (getSelectedQueja ? getSelectedQueja : null), 
                            getSelectedRequiereGestionJuridica ? getSelectedRequiereGestionJuridica == 'true' ? 1 : 0 : null
                        );
                    }
                }
                else {
                    // console.log(datos.error);
                    setErrorApi(datos.error);
                    window.showModal(1);
                    window.showSpinner(false);
                }
            }
        )
    }

    const obtenerDatosLista = (id_evaluacion) => {
        if(id_evaluacion){
            window.showSpinner(true);
            setEvaluacion(id_evaluacion);
            setEvaluacionNombre(getListaResultadoEvaluacion.find(data => data.id == id_evaluacion).attributes.nombre);

            let id_expediente = getSelectedTipoExpediente;
            //let id_sub_expediente = getSelectedDerechoPeticion ? getSelectedDerechoPeticion : (getSelectedQueja ? getSelectedQueja : null);
            let id_sub_expediente = null;
            if(getSelectedDerechoPeticion){
                id_sub_expediente = getSelectedDerechoPeticion;
            }
            else if(getSelectedQueja){
                id_sub_expediente = getSelectedQueja
            }

            let id_tercer_expediente = null;

            if(getSelectedRequiereGestionJuridica){
                id_tercer_expediente = getSelectedRequiereGestionJuridica;
            }


            GenericApi.getAllGeneric('mas-orden-funcionario/lista-roles/'+id_evaluacion+'/'+id_expediente+'/'+id_sub_expediente+'/'+id_tercer_expediente).then(
                datos_funcionarios => {
                    if (!datos_funcionarios.error) {
                        if(datos_funcionarios["data"][0]?.unico_rol == '1'){
                            setUnicoRol(true);
                        }

                        setListaRol(datos_funcionarios["data"]);
                        obtenerListaHistorica(id_evaluacion, id_expediente, id_sub_expediente, id_tercer_expediente);
                    }
                    else {
                        setErrorApi(datos_funcionarios.error.toString())
                        window.showModal(1)
                    }
                    window.showSpinner(false);
                }
            )
        }
    }

    /*
    * Componentes
    */

    const componentAlertConfirmacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-confirmacion-administracion-gestor-respuesta" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">Confirmación de guardado</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <p>¿DESEA MODIFICAR LA LISTA DE ROLES?</p>
                                    <p>RECUERDE QUE LA MODIFICACIÓN DE LA LISTA AFECTARA A LOS NUEVOS PROCESOS DISCIPLINARIOS QUE ESTEN A PUNTO DE REALIZAR LA FASE DE GESTOR RESPUESTA - { getEvaluacionNombre }.</p>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => guardarDatos()}>{global.Constants.BOTON_NOMBRE.AGREGAR}</button>
                                    <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const componentSelectRol = () => {
        return (
            getListaRolSearch.map((rol, i) => {
                return (
                    <option key={rol.id} value={rol.id}>{rol.attributes.nombre.toUpperCase()}</option>
                )
            })
        )
    }

    const componentSelectTipoExpediente = () => {
        return (
            getListaTipoExpediente.map((resultado, i) => {
                return (
                    <option key={resultado.id} value={resultado.id}>{resultado.attributes.nombre}</option>
                )
            })
        )
    }

    //DERECHO DE PETICION
    const componentSelectTipoDerechoPeticion = () => {
        return (
            getListaTipoDerechoPeticion.data.map((derecho_peticion, i) => {
                return (
                    <option key={derecho_peticion.id} value={derecho_peticion.id}>{derecho_peticion.attributes.nombre}</option>
                )
            })
        )
    }

    //TIPOS DE QUEJA
    const componentSelectTiposQueja = () => {
        return (
            getListaTiposQueja.data.map((tipo_queja, i) => {
                return (
                    <option key={tipo_queja.id} value={tipo_queja.id}>{tipo_queja.attributes.nombre}</option>
                )
            })
        )
    }

    //EVALUACION
    const componentSelectResultadoEvaluacion = () => {
        return (
            getListaResultadoEvaluacion.map((resultado, i) => {
                return (
                    <option key={resultado.id} value={resultado.id}>{resultado.attributes.nombre}</option>
                )
            })
        )
    }

    const componentAlertAgregarUsuario = () => {
        return (
            <>
                <Formik
                    initialValues={{
                        rol: '',
                    }}
                    enableReinitialize
                    validate={(valores) => { 
                        let errores = {};

                        if(!valores.rol){
                            errores.rol = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        return errores;
                    }}
                    onSubmit={(valores, {resetForm}) => {
                        agregarUsuario(valores);
                        resetForm();
                    }}
                >
                    {({ errors, values }) => (
                        <Form>
                            <div className="modal fade" id="modal-block-popout-agregar-funcionario-gestor-respuesta" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-popout" role="document">
                                    <div className="modal-content">
                                        <div className="block block-themed block-transparent mb-0 ">
                                            <div className="block-header">
                                                <h3 className="block-title">AGREGAR ROL</h3>
                                                <div className="block-options">
                                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                        <i className="fa fa-fw fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="block-content">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label htmlFor='rol'>ROLES <span className='text-danger'>*</span></label>
                                                        <Field as='select' className='form-control' id='rol' name='rol'>
                                                            <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                                            { getListaRolSearch.length > 0 ? componentSelectRol() : null }
                                                        </Field>
                                                        <ErrorMessage name='rol'component={() => (<span className='text-danger'>{errors.rol}</span>)} />
                                                    </div>
                                                </div>
                                                <br></br>
                                            </div>
                                            <div className="block-content block-content-full text-right bg-light">
                                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.AGREGAR}</button>
                                                <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    const listaSubExpediente = () => {

        // TIPO DE EXPEDIENTE = DERECHO DE PETICION
        if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) {
            return (
                <>
                    <div className='col-md-4'>
                        <div className="form-group">
                            <label htmlFor='evaluacion'>TIPO DE DERECHO DE PETICIÓN<span className='text-danger'>*</span></label>
                            <select className='form-control' id='derecho_peticion' name='derecho_peticion' onChange={e => selectChangeDerechoPeticion(e.target.value)}>
                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                { getListaTipoDerechoPeticion.data.length > 0 ? componentSelectTipoDerechoPeticion() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
        // TIPO DE EXPEDIENTE = PODER REFERENTE A SOLICITUD
        else if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE) {
            
        }
        // TIPO DE EXPEDIENTE = QUEJA
        else if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA || getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PROCESO_DISCIPLINARIO) {
            return (
                <>
                    <div className='col-md-4'>
                        <div className="form-group">
                            <label htmlFor='evaluacion'>TIPO DE { getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA ? 'QUEJA' : 'PROCESO DISCIPLINARIO' }<span className='text-danger'>*</span></label>
                            <select className='form-control' id='queja' name='queja' onChange={e => selectChangeQueja(e.target.value)}>
                                <option value=''>Seleccione el tipo de { getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA ? 'queja' : 'proceso disciplinario' }</option>                                            
                                { getListaTiposQueja.data.length > 0 ? componentSelectTiposQueja() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
        // TIPO DE EXPEDIENTE = TUTELA
        else if (getSelectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.TUTELA) {
            /*return (
                <>
                    <div className='col-md-12'>
                        <div className="form-group">
                            <label htmlFor='evaluacion'>Ingrese Termino de Respuesta <span className='text-danger'>*</span></label>
                            <select className='form-control' id='evaluacion' name='evaluacion' onChange={e => obtenerDatosLista(e.target.value)}>
                                <option value=''>Seleccione el tipo de queja</option>                                            
                                { getListaResultadoEvaluacion.length > 0 ? componentSelectResultadoEvaluacion() : null }
                            </select>
                        </div>
                    </div>
                </>
            )*/
        }
    }

    const listaTercerExpediente = () => {
        
        if (
            getSelectedDerechoPeticion === global.Constants.DERECHOS_PETICION.ALERTA
        ) {
            return (
                <>
                    <div className='col-md-4'>
                        <div className="form-group">
                            <label htmlFor="gestion_juridica">REQUIERE GESTIÓN JURÍDICA<span className="text-danger">*</span></label>
                            <select className="form-control" id="gestion_juridica" name="gestion_juridica" onChange={e => selectChangeRequiereGestionJuridica(e.target.value)}>
                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                <option value="true">SI</option>
                                <option value="false">NO</option>
                            </select>
                        </div>
                    </div>
                </>
            )
        }
    }

    const listaTipoEvaluacion = () => {
        if(
            (
                getSelectedDerechoPeticion == global.Constants.DERECHOS_PETICION.COPIAS
            ) ||
            (
                getSelectedDerechoPeticion == global.Constants.DERECHOS_PETICION.GENERAL
            ) ||
            (
                getSelectedDerechoPeticion == global.Constants.DERECHOS_PETICION.ALERTA &&
                getSelectedRequiereGestionJuridica
            ) ||
            (
                getSelectedQueja
            ) ||
            (
                getSelectedTipoExpediente == global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE
            ) || 
            (
                getSelectedTipoExpediente == global.Constants.TIPOS_EXPEDIENTES.TUTELA
            )
        )
        {
            return (
                <>
                    <div className='col-md-4'>
                        <div className="form-group">
                            <label htmlFor='evaluacion'>TIPO DE EVALUACIÓN<span className='text-danger'>*</span></label>
                            <select className='form-control' id='evaluacion' name='evaluacion' value={getEvaluacion} onChange={e => obtenerDatosLista(e.target.value)}>
                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>                                            
                                { getListaResultadoEvaluacion.length > 0 ? componentSelectResultadoEvaluacion() : null }
                            </select>
                        </div>
                    </div>
                </>
            )
        }
    }

    return (
        <>
            { componentAlertAgregarUsuario()  }
            { componentAlertConfirmacion() }
            { getEvaluacion ? <ModalListaVersionesGestorRespuestaAdministracion object={getEvaluacion} nombre={getEvaluacionNombre} lista={getFuncionalidadesListModal}></ModalListaVersionesGestorRespuestaAdministracion> : null }
            {isRedirect ? redirectToRoutes() : null}
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            <div className="block block-themed">
                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <small>Administración</small></li>
                            <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>
                            <li className="breadcrumb-item"> <small>Fases</small></li>
                            <li className="breadcrumb-item"> <small>Fases etapa evaluación PQR</small></li>
                            <li className="breadcrumb-item"> <small>Fase gestor respuesta etapa evaluación</small></li>
                        </ol>
                    </nav>
                </div>
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: GESTOR RESPUESTA :: CONFIGURACIÓN DE ROLES</h3>

                    <div className='text-right'>
                        {
                            getEvaluacion
                            ?
                                <>
                                    <button type="button" className="btn btn btn-success mr-1 mb-3" data-toggle="tooltip" data-html="true" title="Consultar Listas Previas" onClick={() => showModalListaParametrizadaPrevias()} data-original-title="Consultar Versiones"><span className="fas fa-clipboard"> </span></button>
                                    <button type="button" className="btn btn btn-success mr-1 mb-3" data-toggle="tooltip" data-html="true" title="Registrar" onClick={() => showModalAgregarFuncionario()} data-original-title="Consultar Versiones"><span className="fas fa-plus"> </span></button>
                                </>
                            :
                                null
                        }
                    </div>

                </div>
                
                <div className="block-content">
                    <div className='row'>

                        <div className='col-md-12'>
                            <div className="form-group">
                                <label htmlFor='evaluacion'>TIPO DE EXPEDIENTE<span className='text-danger'>*</span></label>
                                <select className="form-control" id="ingresoTipoExpediente" name="ingresoTipoExpediente"
                                    value={getSelectedTipoExpediente} onChange={e => selectChangeTipoExpediente(e.target.value)}>
                                    <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    { getListaTipoExpediente.length > 0 ? componentSelectTipoExpediente() : null }
                                </select>
                            </div>
                        </div>

                        { listaSubExpediente() }
                        { listaTercerExpediente() }
                        { listaTipoEvaluacion() }
                        {
                            (getListaRol.length >= 0 && getListaRol.length < 2 && getEvaluacion)
                            ?
                            (
                                <>
                                    <div className="col-md-3">
                                        <div className="form-group" title='Esto será aplicado para el usuario que va a iniciar la fase de Gestor Respuesta'>
                                            <input type="checkbox" className="form-check-input" id="usuario_unico" name="usuario_unico" onChange={() => setUnicoRol(!getUnicoRol)} checked={getUnicoRol}/>
                                            <label className="form-check-label" htmlFor="usuario_unico">{ getListaRol.length == 0 || getListaRol[0]?.id == 0 ? '¿EL PROCESO DE APROBAR Y RECIBIR EL EXPEDIENTE LO REALIZARÁ UNICAMENTE UN USUARIO?' : '¿EL PROCESO DE APROBAR El EXPEDIENTE LO REALIZARÁ UNICAMENTE UN USUARIO?' }</label>
                                        </div>
                                    </div>
                                </>
                            )
                            :
                            null
                        }

                    </div>
                </div>
                {
                    getEvaluacion
                    ?
                    (
                        getListaRol.length > 0
                        ?
                            <>
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <DragDropContext onDragEnd={handleDragEnd}>
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase">
                                                    <thead>
                                                        <tr>
                                                            <th width="5%">MOVER</th>
                                                            <th width="5%">NO</th>
                                                            <th width="35%">ROL</th>
                                                            <th width="50%">FUNCIONALIDAD</th>
                                                            <th width="5%">ACCIONES</th>
                                                        </tr>
                                                    </thead>
                                                    <Droppable droppableId="droppable-1">
                                                        {(provider) => (
                                                            <tbody
                                                                ref={provider.innerRef}
                                                                {...provider.droppableProps}
                                                            >
                                                                {getListaRol.map((funcionario, index) => (
                                                                    <Draggable
                                                                        key={index}
                                                                        draggableId={index+""}
                                                                        index={index}
                                                                    >
                                                                        {(provider) => (
                                                                            <tr {...provider.draggableProps} ref={provider.innerRef} key={index}>
                                                                                <td {...provider.dragHandleProps}> <i className="fas fa-hand-paper"></i> </td>
                                                                                <td>{ index + 1 }</td>
                                                                                <td>{ funcionario.nombre ? funcionario.nombre : global.Constants.USUARIO_GESTOR_RESPUESTA }</td>
                                                                                <td>
                                                                                    { 
                                                                                        (
                                                                                            funcionario.nombre == global.Constants.USUARIO_GESTOR_RESPUESTA || 
                                                                                            !funcionario.nombre
                                                                                        )
                                                                                        ?
                                                                                            'APRUEBA O RECHAZA EL EXPEDIENTE y RECIBE EL EXPEDIENTE APROBADO' 
                                                                                        : 
                                                                                        (
                                                                                            index == getListaRol.length-1 
                                                                                            ? 
                                                                                                'RECIBE EL EXPEDIENTE APROBADO' 
                                                                                            : 
                                                                                            (
                                                                                                index == 0
                                                                                                ?
                                                                                                    'SUBE EL DOCUMENTO SI ALGUNO DE LOS ROLES LO RECHAZA (ESTE ROL INTERACTUA UNICAMENTE SI SE RECHAZA EL EXPEDIENTE)'
                                                                                                :
                                                                                                    'APRUEBA O RECHAZA EL EXPEDIENTE'
                                                                                            )                                                                                                
                                                                                        )
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    <button type='button' title='Eliminar Rol' className='btn btn-sm btn-danger' onClick={() => eliminarUsuario(index)}><i className="fas fa-minus-circle"></i></button>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provider.placeholder}
                                                            </tbody>
                                                        )}
                                                    </Droppable>
                                                </table>
                                            </DragDropContext>
                                        </div>
                                    </div>
                                </div>
                            </>
                        :
                        (
                            <>
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <b>Sin información, registrada</b>
                                    </div>
                                </div>
                                <br></br>
                            </>
                        )
                    )                    
                    :
                    null
                }
                {
                    (
                        (
                            getEvaluacion && getUnicoRol && (getListaRol.length == 0 || getListaRol.length == 1)
                        )
                        ||
                        (
                            getEvaluacion && !getUnicoRol && getListaRol.length > 1
                        )
                    )
                    ?
                    (
                        <>
                            
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="block-content block-content-full text-right bg-light">
                                        <button type="button" className="btn btn-rounded btn-primary" data-toggle="tooltip" data-html="true" title="Registrar" onClick={() => showModalConfirmacion()} data-original-title="Consultar Versiones"><span> </span> {global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    :
                    null
                }
            </div>
        </>
    );
}

export default FuncionarioListaGestorRespuesta;
