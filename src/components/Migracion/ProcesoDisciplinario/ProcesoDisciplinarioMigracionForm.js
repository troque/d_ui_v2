import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import { useParams } from "react-router";
import Spinner from '../../Utils/Spinner';
import Center from '../../Utils/Styles/Center.js'
import moment from 'moment';

function ProcesoDisciplinarioMigracionForm() {

    const location = useLocation();

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getProcesoDisciplinario, setProcesoDisciplinario] = useState({ data: [], links: [], meta: [] });
    
    const [tipoProceso, setTipoProceso] = useState('');
    const [getRadicado, setRadicado] = useState('');
    const [getVigencia, setVigencia] = useState('');
    const [etapa, setEtapa] = useState('');
    const [ubicacionExpediente, setUbicacionExpediente] = useState('');
    const [dependenciaOrigen, setDependenciaOrigen] = useState('');
    const [registradoPor, setRegistradoPor] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [estado, setEstado] = useState('');
    const [tipoExpediente, setTipoExpediente] = useState('');
    const [subTipoExpediente, setSubTipoExpediente] = useState('');
    const [evaluacion, setEvaluacion] = useState('');
    const [conducta, setConducta] = useState('');
    const [radicadoPadreDesglose, setRadicadoPadreDesglose] = useState('');
    const [vigenciaPadreDesglose, setVigenciaPadreDesglose] = useState('');
    const [autoDesglose, setAutoDesglose] = useState('');

    const [getListaDependenciasOrigen, setListaDependenciasOrigen] = useState({ data: {} });
    const [existeListaDependenciasOrigen, setExisteListaDependenciasOrigen] = useState(false);

    const [getListaDependenciasDuena, setListaDependenciasDuena] = useState({ data: {} });
    const [existeListaDependenciasDuena, setExisteListaDependenciasDuena] = useState(false);

    const [getListaVigencias, setListaVigencias] = useState({ data: {} });
    const [existeListaVigencias, setExisteListaVigencias] = useState(false);

    const [getListaEtapas, setListaEtapas] = useState({ data: {} });
    const [existeListaEtapas, setExisteListaEtapas] = useState(false);

    const [getListaProcesos, setListaProcesos] = useState({ data: {} });
    const [existeListaProcesos, setExisteListaProcesos] = useState(false);

    const [getListaEstados, setListaEstados] = useState({ data: {} });
    const [existeListaEstados, setExisteListaEstados] = useState(false);

    const [getListaUsuarios, setListaUsuarios] = useState({ data: {} });
    const [existeListaUsuarios, setExisteListaUsuarios] = useState(false);

    const [existeTempPD, setExisteTempPD] = useState(false);

    const [getListaTipoExpediente, setListaTipoExpediente] = useState({ data: {} });
    const [existeListaTipoExpediente, setExisteTipoExpediente] = useState(false);

    const [getListaSubTipoExpediente, setListaSubTipoExpediente] = useState({ data: {} });
    const [existeListaSubTipoExpediente, setExisteSubTipoExpediente] = useState(false);

    const [getListaEvaluacion, setListaEvaluacion] = useState({ data: {} });
    const [existeListaEvaluacion, setExisteListaEvaluacion] = useState(false);

    const [getListaTipoConducta, setListaTipoConducta] = useState({ data: {} });
    const [existeListaTipoConducta, setExisteListaTipoConducta] = useState(false);


    const [listaTipoDerechoPeticion, setListaDerechoPeticion] = useState({ data: {} });
    const [selectedTipoDerechoPeticion, setSelectedDerechoPeticion] = useState("");
    const [respuestaTipoDerechoPeticion, setRespuestaDerechoPeticion] = useState(false);

    const [listaTiposQueja, setListaTiposQueja] = useState({ data: {} });
    const [selectedTiposQueja, setSelectedTiposQueja] = useState("");
    const [respuestaTiposQueja, setRespuestaTiposQueja] = useState(false);

    const [listaTerminosRespuesta, setListaTerminosRespuesta] = useState({ data: {} });
    const [selectedTerminosRespuesta, setSelectedTerminosRespuesta] = useState("");
    const [respuestaTerminosRespuesta, setRespuestaTerminosRespuesta] = useState(false);

    const [getMigrado, setMigrado] = useState(null);



    let {radicado, vigencia} = useParams();

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            listaProcesoDisciplinarioMigracion();
        }
        fetchData();
    }, []);


    const listaProcesoDisciplinarioMigracion = () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("migracion-proceso-disciplinario/"+radicado+"/"+vigencia).then(
                datos => {

                    if (!datos.error) {
                        setProcesoDisciplinario(datos); 
                        setMigrado(datos.data[0].attributes.migrado);

                        dependenciasOrigen();                     
                    } 

                }
            )
        } catch (error) {
           
        }
    }

    const dependenciasOrigen= () => {
        try {

            GenericApi.getGeneric("mas-dependencia-origen").then(
                datos => {

                    if (!datos.error) {
                        setListaDependenciasOrigen(datos);
                        setExisteListaDependenciasOrigen(true);
                        dependenciasDuena();
                    } 
                }
            )
        } catch (error) {
        }
    }

    const dependenciasDuena= () => {
        try {

            GenericApi.getGeneric("dependencias-eje-disciplinario").then(
                datos => {

                    if (!datos.error) {
                        setListaDependenciasDuena(datos);
                        setExisteListaDependenciasDuena(true);
                        usuarios();
                    } 
                }
            )
        } catch (error) {
        }
    }

    const usuarios= () => {
        try {

            GenericApi.getGeneric("usuario").then(
                datos => {

                    if (!datos.error) {
                        setListaUsuarios(datos);
                        setExisteListaUsuarios(true);
                        vigencias();
                    } 
                }
            )
        } catch (error) {
        }
    }

    
    const vigencias= () => {
        try {

            GenericApi.getGeneric("vigencia").then(
                datos => {

                    if (!datos.error) {
                        setListaVigencias(datos);
                        setExisteListaVigencias(true);
                        etapas();
                    } 
                }
            )
        } catch (error) {
        }
    }

    const etapas= () => {
        try {

            GenericApi.getGeneric("mas-etapa").then(
                datos => {

                    if (!datos.error) {
                        setListaEtapas(datos);
                        setExisteListaEtapas(true);
                        tiposProceso();
                    } 
                }
            )
        } catch (error) {
        }
    }


    const tiposProceso = () => {
        GenericApi.getGeneric("mas-tipo-proceso-activos").then(
            datos => {
                if (!datos.error) {
                    setListaProcesos(datos);
                    setExisteListaProcesos(true);  
                    estados();                  
                }

            }
        )
    }

    

    const estados= () => {
        try {

            GenericApi.getGeneric("mas-estado-proceso-disciplinario").then(
                datos => {

                    if (!datos.error) {
                        setListaEstados(datos);
                        setExisteListaEstados(true);
                        tiposExpediente();
                    } 
                }
            )
        } catch (error) {
        }
    }


    const tiposExpediente= () => {
        try {

            GenericApi.getGeneric("mas-tipo-expediente").then(
                datos => {

                    if (!datos.error) {
                        setListaTipoExpediente(datos);
                        setExisteTipoExpediente(true);
                        tiposDerechoPeticion();
                    } 
                }
            )
        } catch (error) {
        }
    }

    const tiposDerechoPeticion = () => {
        try {
            GenericApi.getGeneric("mas-tipo-derecho-peticion").then(
                datos => {
                    if (!datos.error) {
                        setListaDerechoPeticion(datos);
                        setRespuestaDerechoPeticion(true);
                        tiposQueja();    
                    }
                }
            )
        } catch (error) {
        }
    }


    const tiposQueja = () => {
        GenericApi.getGeneric("mas-tipo-queja").then(
            datos => {
                if (!datos.error) {
                    setListaTiposQueja(datos);
                    setRespuestaTiposQueja(true);
                    terminosRespuesta();
                    
                }
            }
        )
    }

    const terminosRespuesta = () => {
        GenericApi.getGeneric("mas-termino-respuesta").then(
            datos => {
                if (!datos.error) {
                    setListaTerminosRespuesta(datos);
                    setRespuestaTerminosRespuesta(true);
                    tiposEvaluacion();  
                }
            }
        )
    }

    const tiposEvaluacion= () => {
        try {

            GenericApi.getGeneric("mas-resultado-evaluacion").then(
                datos => {

                    if (!datos.error) {
                        setListaEvaluacion(datos);
                        setExisteListaEvaluacion(true);
                        tiposConducta();                    
                    } 
                }
            )
        } catch (error) {
        }
    }

    const tiposConducta= () => {
        try {

            GenericApi.getGeneric("mas-tipo-conducta").then(
                datos => {

                    if (!datos.error) {
                        setListaTipoConducta(datos);
                        setExisteListaTipoConducta(true); 
                        getInfoProceso();                   
                    } 
                }
            )
        } catch (error) {
        }
    }



    const getInfoProceso = () => {
        try {

            GenericApi.getGeneric("migrar-proceso-disciplinario/get-proceso/"+radicado+"/"+vigencia).then(
                datos => {

                    if (!datos.error && datos.data.length>0) {

                        setExisteTempPD(true);
                        setRadicado(datos.data[0].attributes.radicado);
                        setVigencia(datos.data[0].attributes.id_vigencia);                        
                        setEtapa(datos.data[0].attributes.etapa.id);                       
                        setDependenciaOrigen(datos.data[0].attributes.dependencia_origen.id);                       
                        setUbicacionExpediente(datos.data[0].attributes.dependencia_duena.id);                        
                        setTipoProceso(datos.data[0].attributes.tipo_proceso.id);
                        setRegistradoPor(datos.data[0].attributes.registrado_por);
                        setFechaRegistro(datos.data[0].attributes.fechaRegistro);
                        setEstado(datos.data[0].attributes.estado);
                        setTipoExpediente(datos.data[0].attributes.id_tipo_expediente);
                        setSubTipoExpediente(datos.data[0].attributes.id_sub_tipo_expediente);
                        setEvaluacion(datos.data[0].attributes.id_tipo_evaluacion);
                        setConducta(datos.data[0].attributes.id_tipo_conducta);
                        setRadicadoPadreDesglose(datos.data[0].attributes.radicado_padre_desglose);
                        setVigenciaPadreDesglose(datos.data[0].attributes.vigencia_padre_desglose);
                        setAutoDesglose(datos.data[0].attributes.auto_desglose);
                       
                    } 
                    window.showSpinner(false);
                }
            )
        } catch (error) {
        }
    }



    


    const listaDependenciasOrigen = () => {
        return (
            getListaDependenciasOrigen.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaDependenciasDuena = () => {
        return (
            getListaDependenciasDuena.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaVigencias = () => {
        return (
            getListaVigencias.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.vigencia}</option>
                )
            })
        )
    }



    const listaUsuarios = () => {
        return (
            getListaUsuarios.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre} {item.attributes.apellido} -- {item.attributes.name}</option>
                )
            })
        )
    }


    const listaEtapas = () => {
        return (
            getListaEtapas.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaProcesos = () => {
        return (
            getListaProcesos.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }


    const listaEstados = () => {
        return (
            getListaEstados.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre.toUpperCase()}</option>
                )
            })
        )
    }


    const listaTiposExpedientes = () => {
        return (
            getListaTipoExpediente.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaSubTipoExpedientes = () => {
        return (
            getListaSubTipoExpediente.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaTiposEvaluacion = () => {
        return (
            getListaEvaluacion.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaTiposConducta = () => {
        return (
            getListaTipoConducta.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }
         
    const handleClick = (event, i) => {

        if(i===1){
            setRadicado(getProcesoDisciplinario.data[0].attributes.radicado);
        }

        else if(i===2){
            setVigencia(getProcesoDisciplinario.data[0].attributes.vigencia);
        }

        else if(i===3){
            setEtapa(getProcesoDisciplinario.data[0].attributes.etapa);
        }

        else if(i===4){
            setDependenciaOrigen(getProcesoDisciplinario.data[0].attributes.dependencia_origen);
        }

        else if(i===5){
            setUbicacionExpediente(getProcesoDisciplinario.data[0].attributes.ubicacion_expediente);
        }

        else if(i===6){
            setTipoProceso("");
        }

        
        else if(i===8){

            const date = getProcesoDisciplinario.data[0].attributes.fechaRegistro;
            const dateFormat = 'MM/DD/YYYY';
            const toDateFormat = moment(new Date(date)).format(dateFormat);

            if(moment(toDateFormat, dateFormat, true).isValid()){
                setFechaRegistro(getProcesoDisciplinario.data[0].attributes.fechaRegistro);
            }
            else{
                setModalState({ title: "Error de formato", message: "No cumple con el formato de fecha.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            }
        }

        else if(i===9){
            setEstado(getProcesoDisciplinario.data[0].attributes.estado);
        }

        else if(i===14){
            setRadicadoPadreDesglose(getProcesoDisciplinario.data[0].attributes.radicado_padre_desglose);
        }

        else if(i===15){
            setVigenciaPadreDesglose(getProcesoDisciplinario.data[0].attributes.vigencia_padre_desglose);
        }

        else if(i===16){
            setAutoDesglose(getProcesoDisciplinario.data[0].attributes.auto_desglose);
        }

        else if(i===17){
            setRegistradoPor(getProcesoDisciplinario.data[0].attributes.responsable_actual);
        }
        
        return true;

    };


    const handleInputChange = (event, i) => {
     
        if(i===1){
            setRadicado(event.currentTarget.value);
        }

        else if(i===2){
            setVigencia(event.currentTarget.value)
        }

        else if(i===3){
            setEtapa(event.currentTarget.value)
        }

        else if(i===4){
            setDependenciaOrigen(event.currentTarget.value)
        }

        else if(i===5){
            setUbicacionExpediente(event.currentTarget.value)
        }

        else if(i===6){
            setTipoProceso(event.currentTarget.value);
        }

        else if(i===7){
            //setRegistradoPor(event.currentTarget.value);
        }

        else if(i===8){
            setFechaRegistro(event.currentTarget.value);
        }

        else if(i===9){
            setEstado(event.currentTarget.value);
        }

        else if(i===10){
            setTipoExpediente(event.currentTarget.value);
        }

        else if(i===11){
            setSubTipoExpediente(event.currentTarget.value);
        }

        else if(i===12){
            setEvaluacion(event.currentTarget.value);
        }

        else if(i===13){
            setConducta(event.currentTarget.value);
        }

        else if(i===14){
            console.log("RADICADO: "+event.currentTarget.value);
            setRadicadoPadreDesglose(event.currentTarget.value);
        }

        else if(i===15){
            console.log("VIGENCIA: "+event.currentTarget.value);
            setVigenciaPadreDesglose(event.currentTarget.value);
        }

        else if(i===16){
            console.log("VIGENCIA: "+event.currentTarget.value);
            setAutoDesglose(event.currentTarget.value);
        }

        else if(i===17){
            console.log("REGISTRADO POR: "+event.currentTarget.value);
            setRegistradoPor(event.currentTarget.value);
        }

        return true;

    }


    const selectTipoDerechoPeticion = () => {
        return (
            listaTipoDerechoPeticion.data.map((derecho_peticion, i) => {

                return (
                    <option key={derecho_peticion.id} value={derecho_peticion.id}>{derecho_peticion.attributes.nombre}</option>
                )
            })
        )
    }

    const selectTerminosRespuesta = () => {
        return (
            listaTerminosRespuesta.data.map((termino_respuesta, i) => {
                return (
                    <option key={termino_respuesta.id} value={termino_respuesta.id}>{termino_respuesta.attributes.nombre}</option>
                )
            })
        )
    }

    const selectTiposQueja = () => {
        return (
            listaTiposQueja.data.map((tipo_queja, i) => {
                return (
                    <option key={tipo_queja.id} value={tipo_queja.id}>{tipo_queja.attributes.nombre}</option>
                )
            })
        )
    }

    // COMPONENTE TIPO EXPEDIENTE
    const componenteTipoExpediente = (tipo_expediente, errors) => {

        // TIPO DE EXPEDIENTE = DERECHO DE PETICION
        if (tipo_expediente === global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) {
            return (
                <>
                    <div className="form-group">
                        <Field as="select" className="form-control" id="ingresoDerechoPeticion" name="ingresoDerechoPeticion" onChange={event => handleInputChange(event, 11)}>
                            <option value={subTipoExpediente}>Por favor seleccione</option>
                            {respuestaTipoDerechoPeticion ? selectTipoDerechoPeticion() : null}
                        </Field>
                        <ErrorMessage name='ingresoDerechoPeticion' component={() => (<span className='text-danger'>{errors.ingresoDerechoPeticion}</span>)} />
                    </div>

                </>
            );
        }

        // TIPO DE EXPEDIENTE = QUEJA
        else if (tipo_expediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA) {
            return (
                <>
                    <Field as="select" className="form-control" id="tipo_queja" name="tipo_queja" onChange={event => handleInputChange(event, 11)}>
                        <option value={subTipoExpediente}>Por favor seleccione</option>
                        {respuestaTiposQueja ? selectTiposQueja() : null}
                    </Field>

                </>
            );
        }


         // TIPO DE EXPEDIENTE = QUEJA
         else if (tipo_expediente === global.Constants.TIPOS_EXPEDIENTES.TUTELA) {
            return (
                <>
                    <Field as="select" className="form-control" id="tipo_tutela" name="tipo_tutela" onChange={event => handleInputChange(event, 11)}>
                        <option value={subTipoExpediente}>Por favor seleccione</option>
                        {respuestaTerminosRespuesta ? selectTerminosRespuesta() : null}
                    </Field>

                </>
            );
        }
    };

    const infoProceso = (errors) => {

        if (getProcesoDisciplinario.data != null && typeof (getProcesoDisciplinario.data) != 'undefined') {
            return (

                getProcesoDisciplinario.data.map((item, i) => {
                    return (
                        <>

                        <div className="col-md-6">
                            <div className="form-group">
                                <h4>ORIGEN</h4>
                                <hr/>
                            </div>
                        </div>   
                            
                        <div className="col-md-6">                            
                            <h4>
                                <small>{existeTempPD?<i className="far fa-dot-circle txt-green"></i>:<i className="far fa-dot-circle txt-red"></i>} </small>
                                DESTINO
                            </h4>
                            <hr/>
                        </div>

                        {/* 1. RADICADO */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="radicado_origen">RADICADO</label>
                                <Field value={item.attributes.radicado} as="input" type="text" autoComplete="off" className="form-control" 
                                id="radicado_origen" name="radicado_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                        </div>    

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="radicado_destino">RADICADO</label>
                                <Field value={item.attributes.radicado} as="input" type="text" autoComplete="off" className="form-control" 
                                id="radicado_origen" name="radicado_origen" disabled={true}></Field>
                            </div>
                        </div>

                        {/* 2. VIGENCIA */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="vigencia_origen">VIGENCIA</label>
                                <Field value={item.attributes.vigencia} as="input" type="text" autoComplete="off" className="form-control" 
                                    id="vigencia_origen" name="vigencia_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                        </div> 

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="vigencia_destino">VIGENCIA</label>
                                <Field value={item.attributes.vigencia} as="input" type="text" autoComplete="off" className="form-control" 
                                    id="vigencia_destino" name="vigencia_destino" disabled={true}></Field>
                            </div>
                        </div> 

                        {/* 6. TIPO DE INGRESO */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_proceso_origen">TIPO DE PROCESO</label>
                                <Field as="input" type="text" autoComplete="off" className="form-control" 
                                id="tipo_proceso_origen" name="tipo_proceso_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_proceso_destino">TIPO DE PROCESO<span className="text-danger">*</span></label>
                                <Field value={tipoProceso} onChange={event => handleInputChange(event, 6)} as="select" className="form-control" 
                                    id="tipo_proceso_destino" name="tipo_proceso_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaProcesos ? listaProcesos() : null}
                                </Field>
                                <ErrorMessage name='tipo_proceso_destino' component={() => (<span className='text-danger'>{errors.tipo_proceso_destino}</span>)} />
                            </div>
                        </div>

                        {/* 14. RADICADO PADRE DESGLOSE  */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="radicado_padre_desglose_origen">RADICADO PADRE DESGLOSE</label>
                                <Field value={item.attributes.radicado_padre_desglose} as="input" type="text" autoComplete="off" className="form-control" 
                                id="radicado_padre_desglose_origen" name="radicado_padre_desglose_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="form-group">
                                {tipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE?
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 14)}><i className="fas fa-angle-double-right"></i></button>
                                    </Center>:null}
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            {tipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE?
                                <div className="form-group">
                                    <label htmlFor="radicado_padre_desglose_destino">RADICADO PADRE DESGLOSE</label>
                                    <Field value={radicadoPadreDesglose} as="input" type="text" autoComplete="off" className="form-control" 
                                        id="radicado_padre_desglose_destino" name="radicado_padre_desglose_destino" onChange={event => handleInputChange(event, 14)}></Field>
                                    <ErrorMessage name='radicado_padre_desglose' component={() => (<span className='text-danger'>{errors.radicado_padre_desglose}</span>)} />
                                </div>:null
                            }
                        </div>

                        {/* 15. VIGENCIA PROCESO PADRE  */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="vigencia_padre_desglose_origen">VIGENCIA PADRE DESGLOSE</label>
                                <Field value={item.attributes.vigencia_padre_desglose} as="input" type="text" autoComplete="off" className="form-control" 
                                id="vigencia_padre_desglose_origen" name="vigencia_padre_desglose_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                           
                        </div>    
                     
                        <div className="col-md-5">     
                                
                            {tipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE?
                                <div className="form-group">
                                    <label htmlFor="vigencia_padre_desglose_destino">VIGENCIA PADRE DESGLOSE<span className="text-danger">*</span></label>
                                    <Field value={vigenciaPadreDesglose} onChange={event => handleInputChange(event, 15)} as="select" className="form-control" 
                                        id="vigencia_padre_desglose_destino" name="vigencia_padre_desglose_destino">
                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        {existeListaVigencias ? listaVigencias() : null}
                                    </Field>
                                    <ErrorMessage name='vigencia_padre_desglose' component={() => (<span className='text-danger'>{errors.vigencia_padre_desglose}</span>)} />
                                </div>:null
                            }
                        </div>

                        {/* 16 RADICADO PADRE DESGLOSE  */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="radicado_auto_desglose">AUTO DESGLOSE</label>
                                <Field value={item.attributes.radicado_padre_desglose} as="input" type="text" autoComplete="off" className="form-control" 
                                id="radicado_auto_desglose" name="radicado_auto_desglose" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="form-group">
                                {tipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE?
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 16)}><i className="fas fa-angle-double-right"></i></button>
                                    </Center>:null}
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            {tipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE?
                                <div className="form-group">
                                    <label htmlFor="radicado_auto_desglose">AUTO DESGLOSE</label>
                                    <Field value={autoDesglose} as="input" type="text" autoComplete="off" className="form-control" 
                                        id="radicado_auto_desglose" name="radicado_auto_desglose" onChange={event => handleInputChange(event, 16)}></Field>
                                    <ErrorMessage name='auto_desglose' component={() => (<span className='text-danger'>{errors.auto_desglose}</span>)} />
                                </div>:null
                            }
                        </div>

                        {/* 3. ETAPA ACTUAL */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="etapa_origen">ETAPA</label>
                                <Field value={item.attributes.etapa} as="input" type="text" autoComplete="off" className="form-control"
                                     id="etapa_origen" name="etapa_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="etapa_destino">ETAPA <span className="text-danger">*</span></label>
                                <Field value={etapa} onChange={event => handleInputChange(event, 3)} as="select" className="form-control" 
                                    id="etapa_destino" name="etapa_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaEtapas ? listaEtapas() : null}
                                </Field>
                                <ErrorMessage name='etapa_destino' component={() => (<span className='text-danger'>{errors.etapa_destino}</span>)} />
                            </div>
                        </div>

                        {/* 4. DEPENDENCIA ORIGEN */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="dependencia_origen">DEPENDENCIA ORIGEN</label>
                                <Field value={item.attributes.dependencia_origen} as="input" type="text" autoComplete="off" className="form-control" 
                                id="dependencia_origen" name="dependencia_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="depedencia_destino">DEPENDENCIA ORIGEN<span className="text-danger">*</span></label>
                                <Field value={dependenciaOrigen} onChange={event => handleInputChange(event, 4)} as="select" className="form-control" 
                                    id="dependencia_destino" name="dependencia_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaDependenciasOrigen ? listaDependenciasOrigen() : null}
                                </Field>
                                <ErrorMessage name='depedencia_destino' component={() => (<span className='text-danger'>{errors.depedencia_destino}</span>)} />
                            </div>
                        </div>

                        {/* 5. DEPENDENCIA DUEÑA DEL PROCESO */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="dependencia_duena_origen">DEPENDENCIA DUEÑA DEL PROCESO</label>
                                <Field value={item.attributes.ubicacion_expediente} as="input" type="text" autoComplete="off" 
                                className="form-control" id="dependencia_duena_origen" name="dependencia_duena_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="dependencia_duena_destino">DEPENDENCIA DUEÑA DEL PROCESO<span className="text-danger">*</span></label>
                                <Field value={ubicacionExpediente} onChange={event => handleInputChange(event, 5)} as="select" className="form-control" 
                                    id="dependencia_duena_destino" name="dependencia_duena_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaDependenciasDuena ? listaDependenciasDuena() : null}
                                </Field>
                                <ErrorMessage name='dependencia_duena_destino' component={() => (<span className='text-danger'>{errors.dependencia_duena_destino}</span>)} />
                            </div>
                        </div>

                        {/* 8. FECHA DE REGISTRO */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="fecha_origen">FECHA DE REGISTRO</label>
                                <Field value={item.attributes.fechaRegistro} as="input" type="text" 
                                autoComplete="off" className="form-control" id="fecha_origen" name="fecha_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  

                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="fecha_destino">FECHA DE REGISTRO<span className="text-danger">*</span></label>
                                <Field value={fechaRegistro} as="input" type="date" autoComplete="off" className="form-control" 
                                id="fecha_destino" name="fecha_destino" onChange={event => handleInputChange(event, 8)}></Field>
                                <ErrorMessage name='fecha_registro' component={() => (<span className='text-danger'>{errors.fecha_registro}</span>)} />
                            </div>
                        </div> 


                        {/* 9. ESTADO */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="estado_origen">ESTADO</label>
                                <Field value={item.attributes.estadoActual} as="input" type="text" 
                                autoComplete="off" className="form-control" id="estado_origen" name="estado_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="estado_destino">ESTADO<span className="text-danger">*</span></label>
                                <Field value={estado} onChange={event => handleInputChange(event, 9)} as="select" className="form-control" 
                                    id="estado_destino" name="estado_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaEstados ? listaEstados() : null}
                                </Field>
                                <ErrorMessage name='estado_destino' component={() => (<span className='text-danger'>{errors.estado_destino}</span>)} />
                            </div>
                        </div>

                        {/* 10. TIPO DE EXPEDIENTE */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_expediente_origen">TIPO DE EXPEDIENTE</label>
                                <Field value={item.attributes.tipoExpediente} as="input" type="text" 
                                autoComplete="off" className="form-control" id="tipo_expediente_origen" name="tipo_expediente_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_expediente_destino">TIPO DE EXPEDIENTE</label>
                                <Field value={tipoExpediente} onChange={event => handleInputChange(event, 10)} as="select" className="form-control" 
                                    id="tipo_expediente_destino" name="tipo_expediente_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaTipoExpediente ? listaTiposExpedientes() : null}
                                </Field>
                                <ErrorMessage name='tipo_expediente_destino' component={() => (<span className='text-danger'>{errors.tipo_expediente_destino}</span>)} />
                            </div>
                        </div>

                        {/* 11. SUB TIPO DE EXPEDIENTE */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="sub_tipo_expediente_origen">SUB TIPO DE EXPEDIENTE</label>
                                <Field  as="input" type="text" 
                                autoComplete="off" className="form-control" id="sub_tipo_expediente_origen" name="sub_tipo_expediente_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="sub_tipo_expediente_destino">SUB TIPO DE EXPEDIENTE</label>
                                {/*DERECHO DE PETICION*/}
                                {tipoExpediente === global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) : ''}
                                {/*QUEJA*/}
                                {tipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.QUEJA) : ''}
                                {/*TUTELA*/}
                                {tipoExpediente === global.Constants.TIPOS_EXPEDIENTES.TUTELA ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.TUTELA) : ''}
                                {/*PROCESO DISCIPLINARIO*/}
                                {tipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PROCESO_DISCIPLINARIO ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.QUEJA) : ''}
                            </div>
                        </div>

                        {/* 12. TIPO DE EVALUACION */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="evaluacion_origen">EVALUACIÓN</label>
                                <Field value={item.attributes.evaluacion} as="input" type="text" 
                                autoComplete="off" className="form-control" id="evaluacion_origen" name="evaluacion_origen" disabled={true}></Field> 
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="evaluacion_destino">EVALUACIÓN</label>
                                <Field value={evaluacion} onChange={event => handleInputChange(event, 12)} as="select" className="form-control" 
                                    id="evaluacion_destino" name="evaluacion_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaEvaluacion ? listaTiposEvaluacion() : null}
                                </Field>
                                <ErrorMessage name='evaluacion_destino' component={() => (<span className='text-danger'>{errors.evaluacion_destino}</span>)} />
                            </div>
                        </div>

                        {/* 13. TIPO DE CONDUCTA */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="conducta_origen">TIPO DE CONDUCTA</label>
                                <Field value="" as="input" type="text" 
                                autoComplete="off" className="form-control" id="conducta_origen" name="conducta_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="conducta_destino">TIPO DE CONDUCTA</label>
                                <Field value={conducta} onChange={event => handleInputChange(event, 13)} as="select" className="form-control" 
                                    id="conducta_destino" name="conducta_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaTipoConducta ? listaTiposConducta() : null}
                                </Field>
                                <ErrorMessage name='conducta_destino' component={() => (<span className='text-danger'>{errors.conducta_destino}</span>)} />
                            </div>
                        </div>


                        {/* 14. USUARIO ASIGNADO */}
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="usuario_origen">USUARIO ASIGNADO</label>
                                <Field value={item.attributes.responsable_actual} as="input" type="text" 
                                autoComplete="off" className="form-control" id="usuario_origen" name="usuario_origen" disabled={true}></Field>
                            </div>
                        </div>    

                        <div className="col-md-2">
                            
                        </div>  

                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="usuario_destino">USUARIO ASIGNADO</label>
                                <Field value={registradoPor} onChange={event => handleInputChange(event, 17)} as="select" className="form-control" 
                                    id="usuario_destino" name="usuario_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaUsuarios ? listaUsuarios() : null}
                                </Field>
                                <ErrorMessage name='usuario_destino' component={() => (<span className='text-danger'>{errors.usuario_destino}</span>)} />
                            </div>
                        </div>
                          
                        </>
                    )
                })
            )
        }
    }

    const enviarDatos = (datos) => {

        window.showSpinner(true);

        let data;

        data = {
            "data": {
                "type": 'migracion',
                "attributes": {
                    "id_temp_proceso_disciplinario":datos.radicado_destino+'-'+datos.vigencia_destino,
                    "radicado": radicado,
                    "vigencia": vigencia,
                    "id_tipo_proceso": datos.tipo_proceso_destino,
                    "id_etapa": datos.etapa_destino,
                    "id_dependencia_origen": datos.depedencia_destino,
                    "id_dependencia_duena": datos.dependencia_duena_destino,
                    "fecha_registro": datos.fecha_registro,
                    "estado": estado,
                    "id_tipo_expediente": datos.tipo_expediente_destino,
                    "id_sub_tipo_expediente": datos.tipo_sub_expediente_destino,
                    "id_tipo_evaluacion": datos.evaluacion_destino,
                    "id_tipo_conducta": datos.conducta_destino,
                    "radicado_padre_desglose": datos.radicado_padre_desglose,
                    "vigencia_padre_desglose": datos.vigencia_padre_desglose,
                    "auto_desglose": datos.auto_desglose,
                    "usuario_actual": datos.usuario_actual,
                }
            }
        }

        console.log(JSON.stringify(data));

        GenericApi.addGeneric("migrar-proceso-disciplinario",data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "PROCESO No "+radicado+" :: MIGRAR PROCESO DISCIPLINARIO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: `/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.EXITO});
                }
                else {
                    setModalState({ title: "PROCESO No "+radicado+" :: MIGRAR PROCESO DISCIPLINARIO", message: datos.error.toString(), show: true, redirect: `/CargarMigracionProcesoDisciplinario/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);

            }
        )
    }

    return (
        <>
            {<Spinner />}   
            {<ModalGen data={getModalState} />}
          
            <Formik
                initialValues={{
                    radicado_destino: getRadicado,
                    vigencia_destino: getVigencia,
                    etapa_destino: etapa,
                    depedencia_destino: dependenciaOrigen,
                    dependencia_duena_destino: ubicacionExpediente,
                    registrado_por: registradoPor,
                    fecha_registro: fechaRegistro,
                    tipo_proceso_destino: tipoProceso,
                    tipo_expediente_destino: tipoExpediente,
                    tipo_sub_expediente_destino: subTipoExpediente,
                    evaluacion_destino: evaluacion,
                    conducta_destino: conducta,
                    radicado_padre_desglose: radicadoPadreDesglose,
                    vigencia_padre_desglose: vigenciaPadreDesglose,
                    auto_desglose: autoDesglose,
                    estado_destino: estado,
                    usuario_actual: registradoPor,
                }}
                enableReinitialize
                validate={(valores) => {
                    
                    let errores = {}

                    if (!valores.etapa_destino) {
                        errores.etapa_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (!valores.depedencia_destino) {
                        errores.depedencia_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (!valores.estado_destino) {
                        errores.estado_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (!valores.fecha_registro) {
                        errores.fecha_registro = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (!valores.tipo_proceso_destino) {
                        errores.tipo_proceso_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    /*if (!valores.usuario_destino) {
                        errores.usuario_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }*/

                    if (valores.tipo_proceso_destino == global.Constants.TIPO_INGRESO.DESGLOSE && !valores.radicado_padre_desglose) {
                        errores.radicado_padre_desglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (valores.tipo_proceso_destino == global.Constants.TIPO_INGRESO.DESGLOSE && !valores.vigencia_padre_desglose) {
                        errores.vigencia_padre_desglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (valores.tipo_proceso_destino == global.Constants.TIPO_INGRESO.DESGLOSE && !valores.auto_desglose) {
                        errores.auto_desglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (valores.etapa_destino > global.Constants.ETAPAS.EVALUACION && !valores.tipo_expediente_destino) {
                        errores.tipo_expediente_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (valores.etapa_destino > global.Constants.ETAPAS.EVALUACION && !valores.evaluacion_destino) {
                        errores.evaluacion_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (valores.etapa_destino > global.Constants.ETAPAS.EVALUACION && !valores.conducta_destino) {
                        errores.conducta_destino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    

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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Buscador`}><small>Buscador</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`}><small>Inicio proceso de migración</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Proceso Disciplinario</small></li>
                                </ol>
                            </nav>
                        </div>
                      
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">PROCESO No. {radicado} - {vigencia} :: DETALLES DEL PROCESO </h3>
                            </div>

                            <div className="block-content">

                                <div className='text-right w2d-enter'>                                
                                    <Link to={`/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`} title='Regresar' >
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>

                                <div className="row">

                                    {infoProceso(errors)}
                                    
                                </div>

                            </div>

                            {getMigrado === true?null:
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                </div>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}


export default ProcesoDisciplinarioMigracionForm;