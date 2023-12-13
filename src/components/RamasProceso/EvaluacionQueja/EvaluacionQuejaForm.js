import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import Spinner from '../../Utils/Spinner';
import ParametrosMasApi from '../../Api/Services/ParametrosMasApi';
import { Link, useLocation } from 'react-router-dom';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/es';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import DataTable from 'react-data-table-component';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import InfoExitoCierreEtapa from '../../Utils/InfoExitoCierreEtapa';
import RemisionQuejaApi from '../../Api/Services/RemisionQuejaApi';
import { getUser, hasAccess } from '../../../components/Utils/Common';
import Select from 'react-select';

function EvaluacionQuejaForm() {

    const [getListaTipoConducta, setListaTipoConducta] = useState({ data: {} });
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const location = useLocation();
    const [perPage, setPerPage] = useState(process.env.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSelectedConcepto, setSelectedConcepto] = useState("");
    const [getDatosEvaluacion, setDatosEvaluacion] = useState({ data: [], links: [], meta: [] });
    const [getListaResultadoEvaluacion, setListaResultadoEvaluacion] = useState({ data: {} });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getTipoProcesoDisciplinario, setTipoProcesoDisciplinario] = useState({ data: [] });
    const [getEstadoEvaluacion, setEstadoEvaluacion] = useState({ data: [] });
    const [getActivarTipoConducta, setActivarTipoConducta] = useState(false);
    const [getEsJefe, setEsJefe] = useState(false);
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getJustificacion, setJustificacion] = useState('');
    const [getRepuestaJustificacion, setRepuestaJustificacion] = useState(false);
    const [getDetalEvaluacion, setDetalEvaluacion] = useState('');
    const [getRepuestaDetalEvaluacion, setRepuestaDetalEvaluacion] = useState(false);
    const [getTipoConducta, setTipoConducta] = useState();
    

    const [expedienteApi, setExpedienteApi] = useState([]);
    const [getIdProcesoDisciplinarioPadre, setIdProcesoDisciplinarioPadre] = useState("");

    const { from } = location.state;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let radicado = from.radicado;
    let vigencia = from.vigencia;

    const columns = [
        {
            name: 'REGISTRADO POR',
            cell: evaluacion => <div>
                <strong>USUARIO: </strong>{evaluacion.attributes.nombre_completo.toUpperCase()}<br />
                <strong>ETAPA: </strong>{evaluacion.attributes.nombre_etapa.toUpperCase()}<br />
                <strong>FECHA: </strong>{evaluacion.attributes.created_at}<br />
                <strong>TIPO DE CONDUCTA: </strong>{evaluacion.attributes.tipo_conducta.nombre.toUpperCase()}<br />
                <strong>RESULTADO DE LA EVALUACIÓN: </strong>{evaluacion.attributes.resultado_evaluacion.nombre.toUpperCase()}<br /></div>,
            sortable: true,
            width: "40%",
        },
        {
            name: 'OBSERVACIONES',
            cell: evaluacion =>
            <div>
                <span data-toggle="modal" data-target={"#q"+evaluacion.id}>{evaluacion.attributes.justificacion_corta.toUpperCase()}</span>
                
                <div className="modal fade" id={"q"+evaluacion.id} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                        <div className="modal-header block.block-themed">
                            <h5 className="modal-title" id="descriptionModalLabel">{radicado} - {vigencia}:: EVALUACIÓN DEL RADICADO</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {evaluacion.attributes.justificacion.toUpperCase()}
                        </div>                  
                        </div>
                    </div>
                </div>
            </div>,

            sortable: true,
            width: "45%",
        },
        {
            name: 'NOTICIA PRIORIZADA',
            cell: evaluacion => (evaluacion.attributes.noticia_priorizada == '1' ? 'SI' : 'NO'),
            selector: evaluacion => (evaluacion.attributes.noticia_priorizada == '1' ? 'SI' : 'NO'),
            sortable: true,
            width: "15%",
        },
    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();

            if (from.idTipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE) {
                GenericApi.getByIdGeneric("proceso_radicado", from.radicadoPadre).then(
                    datos => {
                        if (!datos.error) {
                            setIdProcesoDisciplinarioPadre(datos.data.id);
                        }
                    }
                )
            }
        }
        fetchData();
    }, []);


    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    cargarEvaluacion();
                }
            }
        )
    }

    const cargarEvaluacion = () => {
        //buscar si ya tiene una evaluacion
        GenericApi.getAllGeneric('evaluacion-por-proceso/' + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setDatosEvaluacion(datos);
                    cargarTiposConducta();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: EVALUACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const cargarTiposConducta = () => {
        GenericApi.getGeneric("lista-tipo-conducta/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaTipoConducta(datos)
                    cargarParametrico()
                }
                else {
                    setModalState({ title: getNombreProceso + " :: EVALUACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const cargarParametrico = () => {

        const data = {
            "data": {
                "type": 'mas_parametro',
                "attributes": {
                    "nombre": "minimo_caracteres_textarea|maximo_caracteres_textarea"
                }
            }
        }

        //buscamos el parametro
        ParametrosMasApi.getParametroPorNombre(data).then(
            datos => {
                if (!datos.error) {
                    if (datos["data"].length > 0) {

                        datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (
                            setMinimoTextArea(filteredName["attributes"]["valor"])
                        ))
                        datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (
                            setMaximoTextArea(filteredName["attributes"]["valor"])
                        ))

                    }
                    cargarTipoEvaluacion();
                } else {
                    setModalState({ title: getNombreProceso + " :: EVALUACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const cargarTipoEvaluacion = () => {
        GenericApi.getGeneric("lista-tipo-evaluacion/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaResultadoEvaluacion(datos)
                    cargarTipoProcesoDisciplinario();
                }
                else {
                    setModalState({ title: "SINPROC No " + radicado + " :: EVALUACIÓN DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const cargarTipoProcesoDisciplinario = () => {

        GenericApi.getGeneric("proceso-diciplinario/tipo-proceso-disciplinario/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setTipoProcesoDisciplinario(datos.data.attributes.id_tipo_proceso);
                    cargarEstadoEvaluacion();
                }
            }
        )
    }

    const cargarEstadoEvaluacion = () => {
        GenericApi.getGeneric("evaluacion/get-estado-evaluacion/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setEstadoEvaluacion(datos.data.attributes.estado_evaluacion);
                    validarEstadoTipoConducta();
                }
            }
        )
    }

    const validarEstadoTipoConducta = () => {

        GenericApi.getGeneric("activar-reclasificacion-tipo-conducta/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setActivarTipoConducta(datos.data.attributes.activar_funcionalidad);
                    validarSiEsJefe();
                }
            }
        )
    }

    const validarSiEsJefe = () => {

        GenericApi.getGeneric("validar-si-es-jefe").then(
            datos => {
                if (!datos.error) {
                    setEsJefe(datos.data.attributes.es_jefe);
                    console.log("Es jefe: " + getEsJefe);
                }
                window.showSpinner(false);
            }
        )
    }

    const componentSelectTipoConducta = () => {
        return (
            getListaTipoConducta.data.map((conducta, i) => {
                return (
                    <option key={conducta.id} value={conducta.id}>{conducta.attributes.nombre}</option>
                )
            })
        )
    }

    //
    const componentSelectResultadoEvaluacion = () => {
        return (
            getListaResultadoEvaluacion.data.map((resultado, i) => {
                return (
                    <option key={resultado.id} value={resultado.id}>{resultado.attributes.nombre}</option>
                )
            })
        )
    }

    //
    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    const handlePageChange = page => {

        // window.showSpinner(true);
        setPageActual(page);
        //cargarAntecedentes(page, perPage, (getEstadoLista == "Inactivos" ? '0' : "1"));
    }

    const handlePerRowsChange = async (newPerPage, page) => {

        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarAntecedentes(page, newPerPage, (getEstadoLista == "Inactivos" ? '0' : "1"));
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);

        const data = {
            "data": {
                "type": 'evaluacion',
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "noticia_priorizada": datos.NoticiaPrio,
                    "justificacion": getJustificacion,
                    "estado": global.Constants.ESTADOS_EVALUACION.REGISTRADO,
                    "resultado_evaluacion": datos.ResulEvaluacion,
                    "tipo_conducta": getTipoConducta,
                    "estado_evaluacion": true,
                    "reclasificacion": (getEsJefe && (getEstadoEvaluacion == global.Constants.ESTADOS_EVALUACION.APROBADO_POR_JEFE) && hasAccess('EI_Evaluacion', 'Crear')) ? true : false
                }
            }
        }

        // Constante del titulo del mensaje
        const titulModal = getNombreProceso + " :: EVALUACIÓN DEL RADICADO";

        if (getTipoProcesoDisciplinario == global.Constants.TIPO_INGRESO.PODER_PREFERENTE) {
            GenericApi.addGeneric('evaluacion', data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: titulModal.toUpperCase(), message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else {
                        setModalState({ title: titulModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } else {
            GenericApi.addGeneric('evaluacion', data).then(
                datos => {
                    if (!datos.error) {
                        if (datos.usuario_remitido) {
                            const usuarioRemitidoModal = 'El proceso disciplinario es asignado a ' + datos.usuario_remitido;
                            setModalState({ title: titulModal.toUpperCase(), message: usuarioRemitidoModal.toUpperCase(), show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                        } else {
                            const mensajeErrorModal = 'En estos momentos no es posible traer la información.';
                            setModalState({ title: titulModal.toUpperCase(), message: mensajeErrorModal.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                        }
                    } else {
                        setModalState({ title: titulModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        }
    }

    const changeJustificacion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setJustificacion(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaJustificacion(true);
        }
    }

    const changeDetalEvaluacion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setDetalEvaluacion(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaDetalEvaluacion(true);
        }
    }

    // Metodo encargado de cambiar la actuacion seleccionada
    const selectChangeTipoProceso = (id) => {

        // Se usa el cargando
        setTipoConducta(id)
    }

    const componentEvaluacionForm = () => {
        return (
            <>
                <Formik
                    initialValues={{
                        ResulEvaluacion: '',
                        NoticiaPrio: '',
                        tipoConducta: '',
                        Justificacion: ''
                    }}
                    validate={(valores) => {
                        let errores = {};
                        
                        if (!valores.ResulEvaluacion) {
                            errores.ResulEvaluacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (!valores.NoticiaPrio) {
                            errores.NoticiaPrio = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (!getTipoConducta) {
                            errores.tipoConducta = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (!getJustificacion) {
                            errores.Justificacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }
                        if (countTextArea > getMaximoTextArea) {
                            errores.Justificacion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES';
                        }
                        if (countTextArea < getMinimoTextArea) {
                            errores.Justificacion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES';
                        }
                        if(getRepuestaJustificacion == false){
                            errores.Justificacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                        }

                        return errores
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        enviarDatos(valores);
                    }}>
                    {({ errors }) => (
                        <Form>
                            <div className='row'>
                                {getEsJefe && (getEstadoEvaluacion == global.Constants.ESTADOS_EVALUACION.APROBADO_POR_JEFE || getEstadoEvaluacion == global.Constants.ESTADOS_EVALUACION.RECHAZADO_POR_JEFE) ?
                                    <div className='col-md-12'>
                                        <div className="alert alert-warning" role="alert">
                                            <strong>RECLASIFICACIÓN DE LA EVALUACIÓN</strong><br /><br />
                                            RECUERDE QUE UNA VEZ REALICE LA RECLASIFICACIÓN DEBERÁ INICIAR NUEVAMENTE EL PROCESO CON LAS FASES SUB SECUENTES DE LA ETAPA DE EVALUACIÓN.
                                        </div>
                                    </div>
                                    :
                                    <div className='col-md-12'>
                                        <div className='block-content block-content-full'>
                                            <div className='alert alert-success' role='alert'>
                                                <p className='mb-0'>PARA CONTINUAR CON LA GESTIÓN DE LA PRESENTE QUEJA,
                                                    EL RESULTADO DE LA EVALUACIÓN INDICADO POR USTED DEBERÁ SER PREVIAMENTE APROBADO Y AVALADO POR EL JEFE DE LA DEPENDENCIA.
                                                    POR LO ANTERIOR AL REGISTRAR LA INFORMACIÓN DEL PRESENTE FORMULARIO, EL SINPROC LE SERÁ REMITIDO AUTOMÁTICAMENTE A DICHO FUNCIONARIO(A). </p>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className='col-md-6 mt-3'>
                                    <label htmlFor='ResulEvaluacion'>RESULTADO DE LA EVALUACIÓN<span className='text-danger'></span></label>
                                    <Field as='select' className='form-control' id='ResulEvaluacion' name='ResulEvaluacion'>
                                        <option>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        {getListaResultadoEvaluacion.data.length > 0 ? componentSelectResultadoEvaluacion() : null}
                                    </Field>
                                    <ErrorMessage name='ResulEvaluacion' component={() => (<span className='text-danger'>{errors.ResulEvaluacion}</span>)} />
                                </div>

                                <div className='col-md-6 mt-3'>
                                    <label htmlFor='NoticiaPrio'>NOTICIA PRIORIZADA<span className='text-danger'></span></label>
                                    <Field as='select' className='form-control' id='NoticiaPrio' name='NoticiaPrio'>
                                        <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        <option value='1'>SI</option>
                                        <option value='2'>NO</option>

                                    </Field>
                                    <ErrorMessage name='NoticiaPrio' component={() => (<span className='text-danger'>{errors.NoticiaPrio}</span>)} />
                                </div>
                                <div className='col-md-12 mt-3'>
                                    <label htmlFor='tipoConducta'>TIPO DE CONDUCTA<span className='text-danger'></span></label>
                                    {/* <Field as='select' className='form-control' id='tipoConducta' name='tipoConducta'>
                                        <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        {getListaTipoConducta.data.length > 0 ? componentSelectTipoConducta() : null}
                                    </Field> */}
                                    {
                                        getListaTipoConducta.data && getListaTipoConducta.data.length > 0 
                                        ?
                                            <Select
                                                id='tipoConducta' name='tipoConducta'
                                                placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                noOptionsMessage={() => "Sin datos"}
                                                options={getListaTipoConducta.data.map(e =>
                                                    ({ label: e.attributes.nombre, value: e.id })
                                                )}
                                                onChange={(e) => selectChangeTipoProceso(e.value)}
                                            /> 
                                        : 
                                            null
                                    }
                                    <ErrorMessage name='tipoConducta' component={() => (<span className='text-danger'>{errors.tipoConducta}</span>)} />
                                </div>
                                <div className='col-md-12 mt-3'>
                                    <label htmlFor='Justificacion'>JUSTIFICACIÓN Y OBSERVACIÓN DE LA EVALUACIÓN SELECCIONADA *</label>
                                    <Field as="textarea" className="form-control" id="Justificacion" name="Justificacion" rows="4"
                                        placeholder="ESCRIBA EN ESTE ESPACIO LAS OBSERVACIONES" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getJustificacion} onChange={changeJustificacion}></Field>
                                    <div className="text-right">
                                        <span className="text-primary"> {countTextArea} / {getMaximoTextArea} </span>
                                    </div>
                                    <ErrorMessage name="Justificacion" component={() => (<span className="text-danger">{errors.Justificacion}</span>)} />
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">REGISTRAR</button>
                                    <Link to={`/RamasProceso/`} state={{ from: from }} >
                                        <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                    </Link>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    const enviarDatosEvalucion = (datosParam) => {
        window.showSpinner(true);
        const data = {
            "data": {
                "type": 'evaluacion',
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "estado": getSelectedConcepto,
                    "resultado_evaluacion": getSelectedConcepto === '3' ? datosParam.ReclasiEvaluacion : '',
                    "justificacion": getDetalEvaluacion,
                    "id_dependencia": getUser().id_dependencia
                }
            }
        }

        // Constante de titulo de la modal
        const tituloModal = getNombreProceso + " :: Evaluación del radicado";

        GenericApi.addGeneric('evaluacion-crear', data).then(
            datos => {
                if (!datos.error) {

                    if (datos.usuario_remitido) {
                        if (from.idTipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE) {
                            GenericApi.getByIdGeneric("remision-queja", getIdProcesoDisciplinarioPadre).then(
                                datosRemision => {
                                    if (!datosRemision.error) {
                                        let data;
                                        if (datosRemision.data.attributes.Idevaluacion == 1) {

                                            data = {
                                                "data": {
                                                    "type": "remision_queja",
                                                    "attributes": {
                                                        "consulta": false,
                                                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                                        "id_tipo_evaluacion": datosRemision.data.attributes.Idevaluacion,
                                                        "id_tipo_dependencia_acceso": global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_COMISORIO_EJE,
                                                        "vigencia": from.vigencia,
                                                    }
                                                }
                                            }
                                        } else if (datosRemision.data.attributes.Idevaluacion == 3) {
                                            data = {
                                                "data": {
                                                    "type": "remision_queja",
                                                    "attributes": {
                                                        "consulta": false,
                                                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                                        "id_tipo_evaluacion": datosRemision.data.attributes.Idevaluacion,
                                                        "id_tipo_dependencia_acceso": global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_INCORPORACION,
                                                        "id_proceso_disciplinario_expediente": expedienteApi.id,
                                                        "vigencia": from.vigencia,
                                                    }
                                                }
                                            }
                                        } else if (datosRemision.data.attributes.Idevaluacion == 5) {
                                            data = {
                                                "data": {
                                                    "type": "remision_queja",
                                                    "attributes": {
                                                        "consulta": false,
                                                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                                        "id_tipo_evaluacion": datosRemision.data.attributes.Idevaluacion,
                                                        "id_tipo_dependencia_acceso": global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_REMISORIO_INTERNO,
                                                        "vigencia": from.vigencia,
                                                    }
                                                }
                                            }
                                        }

                                        RemisionQuejaApi.addIncorporacionExpediente(data).then(
                                            datosSubidos => {
                                                if (!datosSubidos.error) {
                                                    console.log(datosSubidos);
                                                } else {
                                                    setModalState({ title: "Error", message: "HA OCURRIDO UN ERROR AL INTENTAR TRAER POR DEFAULT LA REMISIÓN QUEJA", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                        const mensajeExito = 'EL PROCESO DISCIPLINARIO ES ASIGNADO A ' + datos.usuario_remitido;
                        setModalState({ title: tituloModal.toUpperCase(), message: mensajeExito.toUpperCase(), show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    } else {

                        const mensajeError = 'EN ESTOS MOMENTOS NO ES POSIBLE TRAER LA INFORMACIÓN.';
                        setModalState({ title: tituloModal.toUpperCase(), message: mensajeError.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                } else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }

    const handleInputChange = (event) => {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "ConcepEvaluacion") {

            setSelectedConcepto(value);
        }
    }

    const componentEvaluacionAprobacionForm = () => {
        return (
            <>
                {<InfoExitoCierreEtapa success='' />}
                <Formik
                    initialValues={{
                        ConcepEvaluacion: '',
                        ReclasiEvaluacion: '',
                        DetalEvaluacion: ''
                    }}
                    validate={(valores) => {
                        let errores = {};
                        
                        if (!getSelectedConcepto) {
                            errores.ConcepEvaluacion = 'DEBE INGRESAR EL CONCEPTO'
                        }
                        else {
                            if (getSelectedConcepto == '3' && !valores.ReclasiEvaluacion) {
                                errores.ReclasiEvaluacion = 'DEBE INGRESAR UN RESULTADO DE EVALUACIÓN'
                            }
                        }
                        
                        if (!getDetalEvaluacion) {
                            errores.DetalEvaluacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }
                        if (countTextArea > getMaximoTextArea) {
                            errores.DetalEvaluacion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARÁCTERES';
                        }
                        if (countTextArea < getMinimoTextArea) {
                            errores.DetalEvaluacion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARÁCTERES';
                        }
                        if(getRepuestaDetalEvaluacion == false){
                            errores.DetalEvaluacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                        }

                        return errores

                    }}
                    onSubmit={(valores, { resetForm }) => {
                        enviarDatosEvalucion(valores);
                    }}>
                    {({ errors }) => (
                        <Form>
                            <div className='row'>
                                <div className='col-md-12 '>
                                    <>
                                        {
                                            (getDatosEvaluacion.data.length == 1) ?
                                                (
                                                    <div className='row'>
                                                        <div className='col-md-5'>
                                                            <label htmlFor='ConcepEvaluacion'>CONCEPTO DE LA EVALUACIÓN<span className='text-danger'></span></label>
                                                            <Field as='select' className='form-control' id='ConcepEvaluacion' name='ConcepEvaluacion'
                                                                value={getSelectedConcepto} onChange={handleInputChange}>
                                                                <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                <option value='2'>APROBAR</option>
                                                                <option value='3'>RECHAZAR</option>
                                                            </Field>
                                                            <ErrorMessage name='ConcepEvaluacion' component={() => (<span className='text-danger'>{errors.ConcepEvaluacion}</span>)} />
                                                        </div>
                                                        <>
                                                            {
                                                                (getSelectedConcepto == '2') ? (
                                                                    <div className='col-6 text-center mt-4 text-success '>
                                                                        SE CONFIRMA EVALUACIÓN: <br /><strong>{getDatosEvaluacion.data[0]?.attributes?.resultado_evaluacion?.nombre.toUpperCase()}</strong>
                                                                    </div>
                                                                ) : null
                                                            }
                                                            {
                                                                (getSelectedConcepto == '3') ? (
                                                                    <div className='col-md-6'>
                                                                        <label htmlFor='ReclasiEvaluacion'>RECLASIFICAR EL RESULTADO DE EVALUACIÓN A: <span className='text-danger'></span></label>
                                                                        <Field as='select' className='form-control' id='ReclasiEvaluacion' name='ReclasiEvaluacion'>
                                                                            <option value=''>{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                            {getListaResultadoEvaluacion.data.length > 0 ? componentSelectResultadoEvaluacion() : null}
                                                                        </Field>
                                                                        <ErrorMessage name='ReclasiEvaluacion' component={() => (<span className='text-danger'>{errors.ReclasiEvaluacion}</span>)} />
                                                                    </div>
                                                                ) : null
                                                            }
                                                        </>
                                                        <div className='col-md-12 mt-2'>
                                                            <label htmlFor='DetalEvaluacion'>DETALLE DEL CONCEPTO DE LA EVALUACIÓN<span className='text-danger'></span></label>
                                                            <Field as="textarea" className="form-control" id="DetalEvaluacion" name="DetalEvaluacion" rows="4"
                                                                placeholder="ESCRIBA EN ESTE ESPACIO LAS OBSERVACIONES" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getDetalEvaluacion} onChange={changeDetalEvaluacion}></Field>
                                                            <div className="text-right">
                                                                <span className="text-primary"> {countTextArea} / {getMaximoTextArea} </span>
                                                            </div>
                                                            <ErrorMessage name='DetalEvaluacion' component={() => (<span className='text-danger'>{errors.DetalEvaluacion}</span>)} />
                                                        </div>
                                                        <div className='block-content block-content-full text-right'>
                                                            <button type='submit' className='btn btn-rounded btn-primary'>REGISTRAR</button>
                                                        </div>
                                                    </div>
                                                ) : null
                                        }
                                    </>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    return (
        <>
            {<ModalGen data={getModalState} />}
            {<Spinner />}

            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }} ><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <small>Evaluación</small></li>
                    </ol>
                </nav>
            </div>
            {
                
                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title">{getNombreProceso} :: <strong>EVALUACIÓN DEL RADICADO</strong></h3>
                    </div>
                    <div className='block block-themed'>
                        <div className='col-md-12 text-right mt-2'>
                            <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from }}>
                                <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                            </Link>
                            {getActivarTipoConducta ?
                                <Link to={'/TipoConductaProcesoLista/'} title='Tipos de conducta registrados' state={{ from: from }}>
                                    <button type="button" className="btn btn-success"> TIPOS DE CONDUCTA</button>
                                </Link> : null
                            }
                        </div>
                        <div className='block-content'>
                            <>
                                {
                                    (getEstadoEvaluacion != null && hasAccess('EI_Evaluacion', 'Consultar') ?
                                        <div className='col-md-12 mt-2 mb-2'>
                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columns}
                                                data={getDatosEvaluacion.data}
                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                                paginationTotalRows={getDatosEvaluacion.data.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                            />
                                        </div>
                                        : null)
                                }
                                {
                                    from.mismoUsuarioBuscador
                                    ?
                                    <>
                                        {getEstadoEvaluacion == 0 && hasAccess('EI_Evaluacion', 'Crear') ? componentEvaluacionForm() : null}
                                        {getEstadoEvaluacion == global.Constants.ESTADOS_EVALUACION.REGISTRADO  && hasAccess('EI_Evaluacion', 'Crear') ? componentEvaluacionAprobacionForm() : null}
                                        {getEsJefe && (getEstadoEvaluacion == global.Constants.ESTADOS_EVALUACION.APROBADO_POR_JEFE || getEstadoEvaluacion == global.Constants.ESTADOS_EVALUACION.RECHAZADO_POR_JEFE)  && hasAccess('EI_Evaluacion', 'Crear') ?
                                            componentEvaluacionForm() : null
                                        }
                                    </>
                                    :
                                    null
                                }
                            </>
                        </div>
                    </div>
                </div>
               
            }

        </>
    );
}
export default EvaluacionQuejaForm;
