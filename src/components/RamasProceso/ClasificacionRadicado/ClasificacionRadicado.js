import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/es';
import { getUser } from '../../../components/Utils/Common';
import { useLocation } from 'react-router-dom'
import DatePerson from "../../DatePerson/DatePerson";
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';

function ClasificacionRadicado(props) {

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [listaTipoExpediente, setListaTipoExpediente] = useState({ data: {} });

    const [respuestaTipoExpediente, setRespuestaTipoExpediente] = useState(false);
    const [selectedTipoExpediente, setSelectedTipoExpediente] = useState("");

    const [countTextArea, setCountTextArea] = useState(0);

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const [listaTipoDerechoPeticion, setListaDerechoPeticion] = useState({ data: {} });
    const [selectedTipoDerechoPeticion, setSelectedDerechoPeticion] = useState("");
    const [respuestaTipoDerechoPeticion, setRespuestaDerechoPeticion] = useState(false);

    const [listaTerminosRespuesta, setListaTerminosRespuesta] = useState({ data: {} });
    const [selectedTerminosRespuesta, setSelectedTerminosRespuesta] = useState("");
    const [respuestaTerminosRespuesta, setRespuestaTerminosRespuesta] = useState(false);

    const [listaTiposQueja, setListaTiposQueja] = useState({ data: {} });
    const [respuestaTiposQueja, setRespuestaTiposQueja] = useState(false);

    const [fechaTermino, setFechaTermino] = useState(null);
    const [resultDiasNoLaborales, setResultDiasNoLaborales] = useState([]);

    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [getAnosAtrasInvalidos, setAnosAtrasInvalidos] = useState(0);

    const [getMensajeAlerta, setMensajeAlerta] = useState("");

    const [getNombreProceso, setNombreProceso] = useState('');
    const [getHorasTermino, setHorasTermino] = useState('');
    const [getObservaciones, setObservaciones] = useState('');
    const [getRepuestaObservaciones, setRepuestaObservaciones] = useState(false);

    const location = useLocation();
    const { from } = location.state;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    /**
     * Funcion principal
     */
    useEffect(() => {
        async function fetchData() {
            setNombreUsuario(getUser().nombre);
            getApiTipoExpediente();
            nombreProceso();

        }
        fetchData();
    }, []);


    const getApiTipoExpediente = () => {
        window.showSpinner(true);
        GenericApi.getGeneric("proceso-disciplinario/tipo-expdiente/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaTipoExpediente(datos);
                    setRespuestaTipoExpediente(true);
                    getApiTipoDerechoPeticion();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const getApiTipoDerechoPeticion = () => {
        GenericApi.getGeneric("lista-tipo-derecho-peticion/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaDerechoPeticion(datos);
                    setRespuestaDerechoPeticion(true);
                    getApiTerminosRespuesta();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const getApiTerminosRespuesta = () => {
        GenericApi.getGeneric("lista-terminos-respuesta/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaTerminosRespuesta(datos);
                    setRespuestaTerminosRespuesta(true);
                    getApiTipoQueja();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const getApiTipoQueja = () => {
        GenericApi.getGeneric("lista-tipo-queja/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaTiposQueja(datos);
                    setRespuestaTiposQueja(true);
                    getApiDiasNoLaborales();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const getApiDiasNoLaborales = () => {
        GenericApi.getGeneric("dias-no-laborales?estado=1").then(
            datos => {
                if (!datos.error) {
                    var data = [];
                    for (var i in datos.data) {
                        var date = datos.data[i]["attributes"]["fecha"].split(' ')[0];
                        var result = new Date(date);
                        result.setDate(result.getDate() + 1);
                        data.push(i, date);
                    }

                    setResultDiasNoLaborales(data);
                    obtenerParametros();
                } else {
                    setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }

            }
        )
    }

    /**
     * Funcion que obtiene información de las parámetricas.
     * Ejm: número máximo y mínimo de caracteres 
     */
    const obtenerParametros = () => {
        try {

            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "limite_años_calendario|minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            //buscamos el parametro
            GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(
                datos => {

                    if (!datos.error) {

                        if (datos["data"].length > 0) {

                            datos["data"].filter(data => data["attributes"]["nombre"].includes('limite_años_calendario')).map(filteredName => (
                                setAnosAtrasInvalidos(filteredName["attributes"]["valor"])
                            ))
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ))
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ))

                        }
                        window.showSpinner(false);
                    } else {
                        window.showSpinner(false);
                        setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    
                }
            )
        } catch (error) {
            // console.log(error);
            window.showSpinner(false);
        }
    }

    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }
            }
        )
    }

    let selectChangeTipoExpediente = (e) => {
        setCountTextArea(0)
        setSelectedTipoExpediente(e);
    }

    let selectChangeTipoDerechoPeticion = (tipo_expediente, e) => {
        setCountTextArea(0)
        setSelectedDerechoPeticion(e);

        // Se valida que el valor sea diferente de null
        if (e != "") {

            // Se consume la api del mensaje
            getApiMasTipoMensajesExpedientes(tipo_expediente, e);
        }
    }

    let selectChangeTerminoRespuesta = (e) => {
        setSelectedTerminosRespuesta(e);
    }

    const selectTipoExpediente = () => {
        return (
            listaTipoExpediente.data.map((expediente, i) => {
                return (
                    <option key={expediente.id} value={expediente.id}>{expediente.attributes.nombre}</option>
                )
            })
        )
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

    const enviarDatos = (datos) => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializa la variable
        let data;

        // Se redeclara la data a enviar
        data = {
            "data": {
                "type": "clasificacion_radicado",
                "attributes": {
                    "id_proceso_disciplinario": props.getParametros.id_proceso_disciplinario,
                    "id_etapa": props.getParametros.id_etapa,
                    "id_tipo_expediente": selectedTipoExpediente,
                    "observaciones": (getObservaciones != null ? getObservaciones : null),
                    "id_tipo_queja": datos.tipo_queja,
                    "id_termino_respuesta": selectedTerminosRespuesta,
                    "fecha_termino": (fechaTermino != null ? fechaTermino : null),
                    "hora_termino": (getHorasTermino != null ? getHorasTermino : null),
                    "gestion_juridica": (datos.gestion_juridica === 'true' ? true : false),
                    "estado": true,
                    "id_estado_reparto": 2,
                    "id_tipo_derecho_peticion": datos.tipo_derecho_peticion,
                    "oficina_control_interno": false,
                    "created_user": getNombreUsuario,
                    "reclasificacion": props.getParametros.reclasificacion,
                }
            }
        }

        // Se consume la API
        GenericApi.addGeneric("clasificacion-radicado", data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se le da estilo al boton del radicado
                    from.cambiaColorClasificacionRadicado = "btn btn-sm btn-success w2d_btn-large mr-1 mb-3 text-left";

                    // Se valida que el tipo de clasificacion del from sea igual a el tipo de clasificacion de validar
                    if (props.getParametros.tipo_clasificacion === global.Constants.TIPO_CLASIFICACION.VALIDAR_CLASIFICACION) {

                        // Se valida que nombre del funcionario sea igual al del usuario logeado
                        if (datos.data.attributes.funcionario_actual.name === getNombreUsuario) {

                            // Se setea el mensaje
                            setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: "EL PROCESO DISCIPLINARIO SE ASIGNA A: " + datos.data.attributes.funcionario_actual.nombre.toUpperCase() + " " + datos.data.attributes.funcionario_actual.apellido.toUpperCase(), show: true, redirect: '/RamasProceso', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                        } else {

                            // Se setea el mensaje
                            setModalState({ title: getNombreProceso + " :: RE-CLASIFICACIÓN DEL RADICADO", message: "EL PROCESO DISCIPLINARIO SE ASIGNA A: " + datos.data.attributes.funcionario_actual.nombre.toUpperCase() + " " + datos.data.attributes.funcionario_actual.apellido.toUpperCase(), show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                        }
                    } else if (props.getParametros.tipo_clasificacion === global.Constants.TIPO_CLASIFICACION.CLASIFICACION) {

                        // Se setea el mensaje
                        setModalState({ title: getNombreProceso + " ::  CLASIFICACIÓN DEL RADICADO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                } else {

                    // Se setea el mensaje
                    setModalState({ title: getNombreProceso + " ::  CLASIFICACIÓN DEL RADICADO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const handleCallbackFechaTermino = (childData) => {
        try {
            setFechaTermino(childData)
        } catch (error) {

        }
    }

    // COMPOENENTE TIPO EXPEDIENTE
    const componenteTipoExpediente = (tipo_expediente) => {

        // TIPO DE EXPEDIENTE = DERECHO DE PETICION
        if (tipo_expediente === global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) {
            return (
                <>
                    <div className="form-group">
                        <label htmlFor="ingresoDerechoPeticion">TIPO DE DERECHO DE PETICIÓN<span className="text-danger">*</span></label>
                        <select className="form-control" id="ingresoDerechoPeticion" name="ingresoDerechoPeticion"
                            value={selectedTipoDerechoPeticion} onChange={e => selectChangeTipoDerechoPeticion(tipo_expediente, e.target.value)}>
                            <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                            {respuestaTipoDerechoPeticion ? selectTipoDerechoPeticion() : null}
                        </select>
                    </div>
                    {/* Se ejecuta el componente */}
                    {componenteTipoDerechoPeticion(tipo_expediente, selectedTipoDerechoPeticion)}
                </>
            );
        }

        // TIPO DE EXPEDIENTE = PODER REFERENTE A SOLICITUD
        else if (tipo_expediente === global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE) {
            return (
                <>
                    <Formik
                        initialValues={{
                            tipo_queja: global.Constants.TIPO_QUEJA.EXTERNA,
                            observaciones: 'NO APLICA',
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
                        <Form>
                            <div className="block-content block-content-full text-right">
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                <Link to={`/ClasificacionRadicadoLista/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </Form>
                    </Formik>
                </>
            );
        }

        // TIPO DE EXPEDIENTE = QUEJA
        else if (tipo_expediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA) {
            return (
                <>
                    <Formik
                        initialValues={{
                            tipo_queja: '',
                            observaciones: 'NO APLICA',
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            let errores = {}
                            if (!valores.tipo_queja) {
                                errores.tipo_queja = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}
                    >
                        <Form>
                            <div className="form-group">
                                <label htmlFor="tipo_queja">TIPO DE QUEJA<span className="text-danger">*</span></label>
                                <Field as="select" className="form-control" id="tipo_queja" name="tipo_queja">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {respuestaTiposQueja ? selectTiposQueja() : null}
                                </Field>
                            </div>
                            <div className="block-content block-content-full text-right">
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                <Link to={`/ClasificacionRadicadoLista/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </Form>
                    </Formik>
                </>
            );
        }

        // TIPO DE EXPEDIENTE = TUTELA
        else if (tipo_expediente === global.Constants.TIPOS_EXPEDIENTES.TUTELA) {
            return (
                <>
                    <label htmlFor="ingresoTipoRtaTutela">TÉRMINO DE RESPUESTA<span className="text-danger">*</span></label>
                    <select className="form-control" id="termino_rta" name="termino_rta"
                        value={selectedTerminosRespuesta}
                        onChange={e => selectChangeTerminoRespuesta(e.target.value)}>
                        <option value="{selectedTerminosRespuesta}">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                        {respuestaTerminosRespuesta ? selectTerminosRespuesta() : null}
                    </select>

                    {/*DIAS TERMINO*/}
                    {selectedTerminosRespuesta === global.Constants.TERMINOS_RESPUESTA.DIAS ? componenteTerminosRespuesta(global.Constants.TERMINOS_RESPUESTA.DIAS) : ''}

                    {/*HORAS TERMINO*/}
                    {selectedTerminosRespuesta === global.Constants.TERMINOS_RESPUESTA.HORAS ? componenteTerminosRespuesta(global.Constants.TERMINOS_RESPUESTA.HORAS) : ''}
                </>
            );
        }
    };

    // Metodo encargado de cargar el mensaje por el tipo de expediente
    const getApiMasTipoMensajesExpedientes = (idTipoExpediente, idSubTipoExpediente) => {

        // Se inicializa la API
        GenericApi.getGeneric("mas_tipo_expediente_mensajes/" + idTipoExpediente + "/" + idSubTipoExpediente).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se captura la informacion en la posicion 0
                    let data = datos.data[0];

                    // Se setea el mensaje 
                    setMensajeAlerta(data.attributes.mensaje);
                } else {

                    // Se setea el modal
                    setModalState({ title: getNombreProceso + " :: CLASIFICACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const changeObservaciones = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setObservaciones(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaObservaciones(true);
        }
    }

    // COMOPNENTE TIPO DERECHO DE PETICION
    const componenteTipoDerechoPeticion = (tipoExpediente, tipo_derecho_peticion) => {

        // TIPO DE EXPDIENTE = DERECHO DE PETICION =  COPIAS
        if (tipo_derecho_peticion === global.Constants.DERECHOS_PETICION.COPIAS) {
            return (
                <>
                    <Formik
                        initialValues={{
                            observaciones: '',
                            gestion_juridica: false,
                            tipo_derecho_peticion: tipo_derecho_peticion,
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            let errores = {}

                            if (!getObservaciones) {
                                errores.observaciones = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (countTextArea > getMaximoTextArea) {
                                errores.descripcion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES';
                            }
                            if (countTextArea < getMinimoTextArea) {
                                errores.descripcion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES';
                            }
                            if(getRepuestaObservaciones == false){
                                errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                            }

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="form-group">
                                    <div className="alert alert-warning alert-dismissable" role="alert">
                                        <p className="mb-0">{getMensajeAlerta}</p>
                                    </div>
                                    <div className="form-group">
                                        <label>OBSERVACIONES <span className="text-danger">*</span></label>
                                        
                                        <Field as="textarea" className="form-control" id="observaciones" name="observaciones" rows="4"
                                            placeholder="Escriba en este espacio las observaciones" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getObservaciones} onChange={changeObservaciones}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name="observaciones" component={() => (<span className="text-danger">{errors.observaciones}</span>)} />
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    <Link to={`/ClasificacionRadicadoLista/`} state={{ from: from }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }

        // TIPO DE EXPDIENTE = DERECHO DE PETICION =  GENERAL
        else if (tipo_derecho_peticion === global.Constants.DERECHOS_PETICION.GENERAL) {
            return (
                <>
                    <Formik
                        initialValues={{
                            observaciones: '',
                            gestion_juridica: false,
                            tipo_derecho_peticion: tipo_derecho_peticion,
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            let errores = {}

                            if (!getObservaciones) {
                                errores.observaciones = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (countTextArea > getMaximoTextArea) {
                                errores.descripcion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES';
                            }
                            if (countTextArea < getMinimoTextArea) {
                                errores.descripcion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES';
                            }
                            if(getRepuestaObservaciones == false){
                                errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                            }

                            return errores

                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="form-group">
                                    <div className="alert alert-warning alert-dismissable" role="alert">
                                        <h3 className="alert-heading font-size-h4 my-2">ALERTA</h3>
                                        <p className="mb-0">{getMensajeAlerta}</p>
                                    </div>
                                    <label>OBSERVACIONES</label>  <span className="text-danger">*</span>
                                    <Field as="textarea" className="form-control" id="observaciones" name="observaciones" rows="4"
                                         placeholder="Escriba en este espacio las observaciones" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getObservaciones} onChange={changeObservaciones}></Field>
                                    <div className="text-right">
                                        <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                    </div>
                                    <ErrorMessage name="observaciones" component={() => (<span className="text-danger">{errors.observaciones}</span>)} />
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    <Link to={`/ClasificacionRadicadoLista/`} state={{ from: from }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }

        // TIPO DE EXPDIENTE = DERECHO DE PETICION =  ALERTA CONTROL POLITICO
        else if (tipo_derecho_peticion === global.Constants.DERECHOS_PETICION.ALERTA) {
            return (
                <>
                    <Formik
                        initialValues={{
                            observaciones: '',
                            gestion_juridica: '',
                            tipo_derecho_peticion: tipo_derecho_peticion,
                        }}
                        enableReinitialize

                        validate={(valores) => {
                            let errores = {}

                            if (!getObservaciones) {
                                errores.observaciones = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (countTextArea > getMaximoTextArea) {
                                errores.descripcion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES';
                            }
                            if (countTextArea < getMinimoTextArea) {
                                errores.descripcion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES';
                            }
                            if(getRepuestaObservaciones == false){
                                errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                            }
                            if (!valores.gestion_juridica) {
                                errores.gestion_juridica = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="form-group">
                                    <div className="alert alert-warning alert-dismissable" role="alert">
                                        <p className="mb-0">{getMensajeAlerta}</p>
                                    </div>
                                    <label htmlFor="ingresoTipoExpediente">REQUIERE GESTIÓN JURÍDICA<span className="text-danger">*</span></label>
                                    <Field as="select" className="form-control" id="gestion_juridica" name="gestion_juridica">
                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        <option value="true">SI</option>
                                        <option value="false">NO</option>
                                    </Field>
                                    <br />
                                    <label>OBSERVACIONES</label>  <span className="text-danger">*</span>
                                    <Field as="textarea" className="form-control" id="observaciones" name="observaciones" rows="4"
                                        placeholder="Escriba en este espacio las observaciones" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getObservaciones} onChange={changeObservaciones}></Field>
                                    <div className="text-right">
                                        <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                    </div>
                                    <ErrorMessage name="observaciones" component={() => (<span className="text-danger">{errors.observaciones}</span>)} />
                                    <div className="block-content block-content-full text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                        <Link to={`/ClasificacionRadicadoLista/`} state={{ from: from }}>
                                            <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                        </Link>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
    };

    const changeHorasTermino = (e) => {
        if (e.target.value === '' || global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(e.target.value)) {
            setHorasTermino(e.target.value);
        }
    }

    // COMPONENTE TERMINOS DE RESPUESTA -- TIPO EXPEDIENTE TUTELA
    const componenteTerminosRespuesta = (termino_respuesta) => {

        // TERMINO TUTELA = DIAS      
        if (termino_respuesta === global.Constants.TERMINOS_RESPUESTA.DIAS) {
            return (
                <>
                    <Formik
                        initialValues={{
                            termino_rta: termino_respuesta,
                            horasTermino: null,
                            fechaTermino: fechaTermino
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            let errors = {}

                            if (!valores.fechaTermino && !fechaTermino) {
                                errors.fechaTermino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                            }
                            if (valores.fechaTermino) {
                                if (!global.Constants.CARACTERES_ESPECIALES.formatDateYMDWithGuiones.test(valores.fechaTermino)){
                                    errors.fechaTermino = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS
                                }
                            }

                            return errors
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}
                    >
                        {({ errors }) => (
                        <Form>
                            <div className="form-group mt-3">
                                <label>FECHA PARA TÉRMINO</label>  <span className="text-danger">*</span>
                                {/*<DatePicker id="fechaTermino" locale='es' name="fechaTermino" dateFormat="DD/MM/YYYY" closeOnSelect={true} placeholder="dd/mm/yyyy" onChange={(date) => setFechaTermino(date)} timeFormat={false} isValidDate={disableCustomDt} />*/}
                                <DatePerson resultDiasNoLaborales={resultDiasNoLaborales} getAnosAtrasInvalidos={getAnosAtrasInvalidos} parentCallback={handleCallbackFechaTermino} id="fechaTermino" name="fechaTermino" />
                                <ErrorMessage name="fechaTermino" component={() => (<span className="text-danger">{errors.fechaTermino}</span>)} />
                            </div>
                            <div className="block-content block-content-full text-right">
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                <Link to={`/ClasificacionRadicadoLista/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </Form>
                        )}
                    </Formik>
                </>

            )
        }

        // TERMINO TUTELA = HORAS     
        else if (termino_respuesta === global.Constants.TERMINOS_RESPUESTA.HORAS) {

            return (
                <>
                    <Formik
                        initialValues={{
                            termino_rta: termino_respuesta,
                            horasTermino: '',
                            fechaTermino: new Date(),
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            let errores = {}
                            if (!getHorasTermino) {
                                errores.horasTermino = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                            }
                            if (getHorasTermino > 23) {
                                errores.horasTermino = 'EL MAXIMO DE HORAS ES DE 23';
                            }
                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="form-group mt-3">
                                    <label>HORAS PARA TÉRMINO</label>  <span className="text-danger">*</span>
                                    <Field type="number" min="1" max='23' id="horasTermino" name="horasTermino" className="form-control" placeholder="" value={getHorasTermino} onChange={changeHorasTermino}/>
                                    <ErrorMessage name="horasTermino" component={() => (<span className="text-danger">{errors.horasTermino}</span>)} />
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    <Link to={`/ClasificacionRadicadoLista/`} state={{ from: from }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            )
        }
    };


    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}

            <div className="block-content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor="ingresoTipoExpediente">TIPO DE EXPEDIENTE<span className="text-danger">*</span></label>
                            <select className="form-control" id="ingresoTipoExpediente" name="ingresoTipoExpediente"
                                value={selectedTipoExpediente} onChange={e => selectChangeTipoExpediente(e.target.value)}>
                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                {respuestaTipoExpediente ? selectTipoExpediente() : null}
                            </select>
                        </div>
                    </div>
                </div>

                {/*DERECHO DE PETICION*/}
                {selectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION) : ''}

                {/*PODER REFERENTE A SOLIICTUD*/}
                {selectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.PODER_REFERENTE) : ''}

                {/*QUEJA*/}
                {selectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.QUEJA ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.QUEJA) : ''}

                {/*TUTELA*/}
                {selectedTipoExpediente === global.Constants.TIPOS_EXPEDIENTES.TUTELA ? componenteTipoExpediente(global.Constants.TIPOS_EXPEDIENTES.TUTELA) : ''}
            </div>
        </>
    );
}

export default ClasificacionRadicado;