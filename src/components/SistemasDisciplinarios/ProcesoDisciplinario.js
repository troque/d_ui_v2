import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DatePerson from "../DatePerson/DatePerson";
import Spinner from '../Utils/Spinner';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/es';
import GenericApi from '../Api/Services/GenericApi';
import '../Utils/Constants';
import { getUser } from '../../components/Utils/Common';
import Select from 'react-select';

import ModalGen from '../Utils/Modals/ModalGeneric';
import '../Utils/Constants';

function ProcesoDisciplinario() {

    const [respuestaOrigenRadicado, setRespuestaOrigenRadicado] = useState(false);
    const [respuestaTipoProceso, setRespuestaTipoProceso] = useState(false);
    const [respuestaDependenciaOrigen, setDependenciaOrigen] = useState(false);
    const [listaOrigenRadicado, setListaOrigenRadicado] = useState({ data: {} });
    const [listaTipoProceso, setListaTipoProceso] = useState({ data: {} });
    const [listaDependenciaOrigen, setListaDependenciaOrigen] = useState({ data: {} });
    const [selectedTipoIngreso, setSelectedTipoIngreso] = useState("");
    const [countTextArea, setCountTextArea] = useState(0);
    const [countTextAreaObservacion, setCountTextAreaObservacion] = useState(0);
    const [validacionExitosa, setValidacionExitosa] = useState(false);
    const [radicacionSirius, setRadicacionSirius] = useState({ data: {} });
    const [radicacionDesglose, setRadicacionDesglose] = useState({ data: {} });
    const [radicacionSinproc, setRadicacionSinproc] = useState({ data: {} });
    const [datosFormSiriusConsulta, setDatosFormSiriusConsulta] = useState({});
    const [datosFormDesgloseConsulta, setDatosFormDesgloseConsulta] = useState({});
    const [datosFormSinprocConsulta, setDatosFormSinprocConsulta] = useState({});
    const [datosFormPoderPreferenteConsulta, setDatosFormPoderPreferenteConsulta] = useState({});
    const [errorApi, setErrorApi] = useState('');


    const [exitoApiCustom, setExitoApiCustom] = useState('');
    const [getTipoProceso, setTipoProceso] = useState('');

    const [isRedirect, setIsRedirect] = useState(false);
    const [resultDiasNoLaborales, setResultDiasNoLaborales] = useState([]);

    const [getAnosAtrasInvalidos, setAnosAtrasInvalidos] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const [listaVigenciaSinproc, setListaVigenciaSinproc] = useState({ data: {} });
    const [respuestaVigenciaSinproc, setRespuestaVigenciaSinproc] = useState(false);

    const [listaVigenciaDesglose, setListaVigenciaDesglose] = useState({ data: {} });
    const [respuestaVigenciaDesglose, setRespuestaVigenciaDesglose] = useState(false);


    const [listaVigenciaAutoDesglose, setListaVigenciaAutoDesglose] = useState({ data: {} });
    const [respuestaVigenciaAutoDesglose, setRespuestaVigenciaAutoDesglose] = useState(false);

    // disable the list of custom dates

    const [fechaDependenciaDesglose, setFechaDependenciaDesglose] = useState(null);
    const [fechaDependenciaSinproc, setFechaDependenciaSinproc] = useState(null);
    const [fechaDependenciaSirius, setFechaDependenciaSirius] = useState(null);
    const [fechaAutoaDesglose, setFechaAutoaDesglose] = useState(null);
    const [fechaRadicadoCordis, setFechaRadicadoCordis] = useState(null);

    const [getFechaVigenciaDesglose, setFechaVigenciaDesglose] = useState("");
    const [getFechaVigenciaAutoDesglose, setFechaVigenciaAutoDesglose] = useState("");
    const [getFechaVigenciaSinproc, setFechaVigenciaSinproc] = useState("");

    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [getListaEtapaActivaPoderPreferente, setListaEtapaActivaPoderPreferente] = useState({ data: {} });
    const [getRespuestaEtapaActivaPoderPreferente, setRespuestaEtapaActivaPoderPreferente] = useState(false);

    const [getTipoEtapaPoderReferente, setTipoEtapaPoderReferente] = useState(false);

    const [getCantidadDeHijos, setCantidadDeHijos] = useState(0);
    const [getListaDatosHijos, setListaDatosHijos] = useState({ data: {} });
    const [getListaDependenciaOrigenDesglose, setListaDependenciaOrigenDesglose] = useState([]);
    const [getDependenciaOrigenDesglose, setDependenciaOrigenDesglose] = useState({ data: {} });
    const [getQuedoListoLaLista, setQuedoListoLaLista] = useState(false);
    const [getPadreConincide, setPadreConincide] = useState(false);

    const [valueSirius, setValueSirius] = useState('');
    const [error, setError] = useState('');
    const [repuestaSiriusExitosa, setRepuestaSiriusExitosa] = useState(false);

    const [valueSinproc, setValueSinproc] = useState('');
    const [repuestaSinprocExitosa, setRepuestaSinprocExitosa] = useState(false);


    let fase = 'Inicio proceso disciplinario';

    useEffect(() => {
        async function fetchData() {
            setNombreUsuario(getUser().nombre);
            getApiMasOrigenRadicado();
            setResultDiasNoLaborales([]);
        }
        fetchData();
    }, []);

    const getApiMasOrigenRadicado = () => {
        window.showSpinner(true);
        GenericApi.getGeneric("mas-origen-radicado").then(
            datos => {
                if (!datos.error) {
                    setListaOrigenRadicado(datos);
                    setRespuestaOrigenRadicado(true);
                    getApiMasTipoProceso();
                }
                else {
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const getApiMasTipoProceso = () => {
        GenericApi.getGeneric("mas-tipo-proceso-activos").then(
            datos => {
                if (!datos.error) {
                    setListaTipoProceso(datos);
                    setRespuestaTipoProceso(true);
                    getApiMasDependenciaFiltrado();
                }
                else {
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const getApiMasDependenciaFiltrado = () => {
        //ParametrosMasApi.getDependenciaOrigeByFase(fase).then(
        //en la tabla MAS_DEPENDENCIA_ACCESO el 2 corresponde a Creacion Proceso
        GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_INCORPORACION).then(
            datos => {
                if (!datos.error) {
                    setListaDependenciaOrigen(datos);
                    setDependenciaOrigen(true)
                    getApiVigencia();
                }
                else {
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const getMasDependenciaDesglose = (IdDependenciaOrigenPadre) => {
        GenericApi.getGeneric('dependencias-eje-disciplinario').then(
            datos => {
                if (!datos.error) {
                    datos.data.forEach(element => {
                        if (element.id == IdDependenciaOrigenPadre) {
                            getListaDependenciaOrigenDesglose.unshift({ value: element.id, label: element.attributes.nombre });
                            setDependenciaOrigenDesglose(element.id);
                            setPadreConincide(true)
                        } else {
                            getListaDependenciaOrigenDesglose.push({ value: element.id, label: element.attributes.nombre });
                        }
                    });
                    setQuedoListoLaLista(true);
                    getListaDependenciaOrigenDesglose.unshift({ value: "", label: "Seleccione..." });
                }
                else {
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const getApiVigencia = () => {
        GenericApi.getGeneric("vigencia?estado=1").then(
            //ParametrosMasApi.getAllVigencias().then(
            datos => {

                if (!datos.error) {

                    var result = datos.data.filter(
                        vigencia => (vigencia.attributes.vigencia).includes(new Date().getFullYear())
                    );

                    if (result.length > 0) {
                        var fechaActual = new Date().getFullYear();
                        setFechaVigenciaDesglose(fechaActual);
                        setFechaVigenciaAutoDesglose(fechaActual);
                        setFechaVigenciaSinproc(fechaActual);
                        //setFechaVigenciaSinprocSegunda(fechaActual);
                    }

                    setListaVigenciaSinproc(datos);
                    setRespuestaVigenciaSinproc(true);
                    setListaVigenciaDesglose(datos);
                    setRespuestaVigenciaDesglose(true);
                    setListaVigenciaAutoDesglose(datos);
                    setRespuestaVigenciaAutoDesglose(true);


                    getApiDiasNoLaborales();

                }
                else {
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }

        )
    }

    const getApiDiasNoLaborales = () => {
        //ParametrosMasApi.getAllDiasNoLaborales().then(
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

                    //obtenemos los parametros
                    obtenerParametros();

                } else {
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }

        )
    }

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
                //ParametrosMasApi.getParametroPorNombre(data).then(
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
                        etapasPoderPreferente();
                    } else {
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                        window.showSpinner(false);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const etapasPoderPreferente = () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("etapas/poder-preferente").then(
                //ParametrosMasApi.getParametroPorNombre(data).then(
                datos => {

                    if (!datos.error) {
                        setListaEtapaActivaPoderPreferente(datos);
                        setRespuestaEtapaActivaPoderPreferente(true);

                    } else {
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }



    let selectChangeTipoEtapaPoderPreferente = (e) => {
        setTipoEtapaPoderReferente(e);
    }

    let selectChangeProcesoDisciplinario = (e) => {
        setCountTextArea(0);
        setSelectedTipoIngreso(e);
    }

    const selectVigenciaSinproc = () => {
        return (
            listaVigenciaSinproc.data.map((vigencia, i) => {
                return (
                    <option key={vigencia.id} value={vigencia.vigencia}>{vigencia.attributes.vigencia}</option>
                )
            })
        )
    }

    const selectVigenciaDesglose = () => {
        return (


            listaVigenciaDesglose.data.map((vigencia, i) => {
                return (
                    <option key={vigencia.id} value={vigencia.vigencia}>{vigencia.attributes.vigencia}</option>
                )
            })
        )
    }

    const selectVigenciaAutoDesglose = () => {
        return (
            listaVigenciaAutoDesglose.data.map((vigencia, i) => {
                return (
                    <option key={vigencia.id} value={vigencia.vigencia}>{vigencia.attributes.vigencia}</option>
                )
            })
        )
    }

    const consultarRadicado = (datos) => {
        window.showSpinner(true);
        let tipoProceso = listaTipoProceso.data.filter(
            proceso => (proceso.id).includes(selectedTipoIngreso)
        );

        if (tipoProceso.length > 0) {
            setTipoProceso(tipoProceso[0].attributes.nombre);
        }

        if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.SIRIUS) {
            setDatosFormSiriusConsulta(datos);

            const data = {
                "data": {
                    "type": "proceso_sirius",
                    "attributes": {
                        "radicado": valueSirius,
                        "id_origen_radicado": datos.origenRadicado,
                        "id_tipo_proceso": selectedTipoIngreso,
                    }
                }
            }

            //console.log(JSON.stringify(data));
            GenericApi.getByDataGeneric("proceso-diciplinario/validar-sirius", data).then(
                datos => {
                    if (!datos.error) {
                        setCountTextArea(datos.data.attributes.antecedente ? datos.data.attributes.antecedente.length : 0)
                        setRadicacionSirius(datos)
                        setValidacionExitosa(true)
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: 'CONSULTA EXITOSA', show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.EXITO });
                        window.showSpinner(false);
                    }
                    else {
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                        window.showSpinner(false);
                    }

                }
            )
        }

        else if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.DESGLOSE) {
            setDatosFormDesgloseConsulta(datos);
            const data = {
                "data": {
                    "type": "proceso_desgloce",
                    "attributes": {
                        "radicado": valueSinproc,
                        "id_tipo_proceso": selectedTipoIngreso,
                        "vigencia": datos.vigenciaDesglose ? datos.vigenciaDesglose : getFechaVigenciaDesglose,
                    }
                }
            }

            GenericApi.getByDataGeneric("proceso-diciplinario/validar-desglose", data).then(
                datos => {
                    if (!datos.error) {
                        GenericApi.getByIdGeneric("contador_desglose", data.data.attributes.radicado).then(
                            datos => {
                                if (!datos.error) {
                                    setCantidadDeHijos(datos);
                                    if (datos >= 1) {
                                        GenericApi.getByIdGeneric("getinfohijos", data.data.attributes.radicado).then(
                                            datosHijos => {
                                                if (!datosHijos.error) {
                                                    setListaDatosHijos(datosHijos);
                                                }
                                            }
                                        )
                                    }
                                }
                            }
                        )
                        setCountTextArea(datos.data.attributes.antecedente ? datos.data.attributes.antecedente.length : 0);
                        setRadicacionDesglose(datos);
                        setValidacionExitosa(true);
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: 'CONSULTA EXITOSA', show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.EXITO });
                        window.showSpinner(false);
                        getMasDependenciaDesglose(datos.data.attributes.dependenciaOrigen);
                    }
                    else {
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                        window.showSpinner(false);
                    }

                }
            )

            //tipoEvaluacion
        }

        else if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.SINPROC) {
            setDatosFormSinprocConsulta(datos);

            const data = {
                "data": {
                    "type": "proceso_sinproc",
                    "attributes": {
                        "radicado": valueSinproc,
                        "id_origen_radicado": selectedTipoIngreso,
                        "id_tipo_proceso": 0,
                        "vigencia": datos.vigenciaSinproc ? datos.vigenciaSinproc : getFechaVigenciaSinproc
                    }
                }
            }
            GenericApi.getByDataGeneric("proceso-diciplinario/validar-sinproc", data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: 'CONSULTA EXITOSA', show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.EXITO });
                        //window.showModal(4)
                        setCountTextArea(datos.data.attributes.antecedente ? datos.data.attributes.antecedente.length : 0)
                        setRadicacionSinproc(datos)
                        setValidacionExitosa(true)
                        window.showSpinner(false);
                    }
                    else {
                        window.showSpinner(false);
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                        // window.showSpinner(false);
                    }

                }
            )
        }

        else if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.PODER_PREFERENTE) {

            setDatosFormPoderPreferenteConsulta(datos);

            const data = {
                "data": {
                    "type": "proceso_preferente",
                    "attributes": {
                        "radicado": valueSinproc,
                        "id_origen_radicado": selectedTipoIngreso,
                        "id_tipo_proceso": 0,
                        "vigencia": datos.vigenciaSinproc ? datos.vigenciaSinproc : getFechaVigenciaSinproc
                    }
                }
            }
            GenericApi.getByDataGeneric("proceso-diciplinario/validar-poder-preferente", data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: 'CONSULTA EXITOSA', show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.EXITO });
                        //window.showModal(4)
                        setCountTextArea(datos.data.attributes.antecedente ? datos.data.attributes.antecedente.length : 0)
                        setRadicacionSinproc(datos)
                        setValidacionExitosa(true)
                        window.showSpinner(false);
                    }
                    else {
                        window.showSpinner(false);
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }

                }
            )
        }
    }


    const enviarDatos = (datos) => {
        window.showSpinner(true);
        let data;



        if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.SIRIUS) {

            data = {
                "data": {
                    "type": "proceso_disciplinario",
                    "attributes": {
                        "radicado": valueSirius,
                        "id_origen_radicado": datosFormSiriusConsulta.origenRadicado,
                        "id_tipo_proceso": selectedTipoIngreso,
                        "antecedente": datos.antecedenteSirius,
                        "fecha_ingreso": datos.fechaDependencia ? datos.fechaDependencia : fechaDependenciaSirius,
                        "radicado_entidad": datos.radicadoSirius,
                        "id_etapa": 1,
                    }
                }
            }


        }

        else if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.DESGLOSE) {

            const vRadi = new Date(fechaDependenciaDesglose.toString());
            let vigenciaRadicado = vRadi.getFullYear();

            let cantidad = parseInt(getCantidadDeHijos, 10)+1;

            data = {
                "data": {
                    "type": "proceso_disciplinario",
                    "attributes": {
                        "radicado": valueSinproc+"-"+cantidad,
                        "id_origen_radicado": datosFormDesgloseConsulta.origenRadicado,
                        "id_tipo_proceso": selectedTipoIngreso,
                        "antecedente": datos.antecedentesDesglose,
                        "fecha_ingreso": datos.fechaIngresoDesglose ? datos.fechaIngresoDesglose : fechaDependenciaDesglose,
                        "numero_auto": datos.numAutoDesglose,
                        "fecha_auto_desglose": datos.fechaAutoDesglose ? datos.fechaAutoDesglose : fechaAutoaDesglose,
                        //"id_dependencia_origen": getDependenciaOrigenDesglose,
                        //"id_dependencia_duena": getDependenciaOrigenDesglose,
                        "id_dependencia_origen": datos.dependenciaOrigenDesglose,
                        "id_dependencia_duena": datos.dependenciaOrigenDesglose,
                        "observacion_mesa_trabajo": datosFormDesgloseConsulta.mesaTrabajo,
                        "vigencia": vigenciaRadicado.toString(),
                        "vigencia_origen": vigenciaRadicado.toString(),
                        "id_etapa": 1,
                        "created_user": getNombreUsuario,
                        "radicado_padre": valueSinproc,
                        "vigencia_padre": datosFormDesgloseConsulta.vigenciaDesglose ? datosFormDesgloseConsulta.vigenciaDesglose : getFechaVigenciaDesglose,                        
                    }
                }
            }
        }

        else if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.SINPROC) {
            data = {
                "data": {
                    "type": "proceso_disciplinario",
                    "attributes": {
                        "radicado": valueSinproc,
                        "id_origen_radicado": datosFormSinprocConsulta.origenRadicado,
                        "id_tipo_proceso": selectedTipoIngreso,
                        "antecedente": datos.antecedenteSinproc,
                        "fecha_ingreso": datos.fechaIngresoSinproc ? datos.fechaIngresoSinproc : fechaDependenciaSinproc,
                        "vigencia": getFechaVigenciaSinproc,
                        "vigencia_origen": getFechaVigenciaSinproc,
                        "id_etapa": 1,
                        "created_user": getNombreUsuario,
                    }
                }
            }
        }

        else if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.PODER_PREFERENTE) {

            data = {
                "data": {
                    "type": "proceso_disciplinario",
                    "attributes": {
                        "radicado": valueSinproc,
                        "id_origen_radicado": datosFormPoderPreferenteConsulta.origenRadicado,
                        "id_tipo_proceso": selectedTipoIngreso,
                        "antecedente": datos.antecedenteSinproc,
                        "fecha_ingreso": datos.fechaIngresoSinproc ? datos.fechaIngresoSinproc : fechaDependenciaSinproc,
                        "vigencia": getFechaVigenciaSinproc,
                        "id_etapa": 1,
                        "created_user": getNombreUsuario,
                        "entidad_involucrada": datos.idEntidadInvolucrada,
                        "dependencia_cargo": datos.idDependeciaCargo,
                        "id_etapa_asignada": datos.etapaProcesoPreferente,
                    }
                }
            }
        }

        // Se consume la API de proceso disciplinario de desglose
        GenericApi.addGeneric("proceso-diciplinario", data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se valida que el tipo de ingreso sea un desglose
                    if (selectedTipoIngreso == global.Constants.TIPO_INGRESO.DESGLOSE) {

                        // Se inicializa el array de datos
                        let dataClasificacion = {
                            "data": {
                                "type": "clasificacion_radicado",
                                "attributes": {
                                    "id_proceso_disciplinario": datos.data.id,
                                    "id_etapa": radicacionDesglose.data.attributes.clasificacion.id_etapa,
                                    "id_tipo_expediente": global.Constants.TIPOS_EXPEDIENTES.PROCESO_DISCIPLINARIO,
                                    "observaciones": radicacionDesglose.data.attributes.clasificacion.observaciones,
                                    "id_tipo_queja": global.Constants.TIPO_QUEJA.EXTERNA,
                                    "id_termino_respuesta": radicacionDesglose.data.attributes.clasificacion.id_termino_respuesta,
                                    "fecha_termino": radicacionDesglose.data.attributes.clasificacion.fecha_termino,
                                    "hora_termino": radicacionDesglose.data.attributes.clasificacion.hora_termino,
                                    "gestion_juridica": radicacionDesglose.data.attributes.clasificacion.gestion_juridica,
                                    "estado": true,
                                    "id_estado_reparto": radicacionDesglose.data.attributes.clasificacion.id_estado_reparto,
                                    "id_tipo_derecho_peticion": radicacionDesglose.data.attributes.clasificacion.id_tipo_derecho_peticion,
                                    "oficina_control_interno": radicacionDesglose.data.attributes.clasificacion.oficina_control_interno,
                                    "created_user": getUser().nombre,
                                    "reclasificacion": radicacionDesglose.data.attributes.clasificacion.reclasificacion,
                                }
                            }
                        }

                        // Se consume la API para crear una clasificacion de radicado
                        GenericApi.addGeneric("clasificacion-radicado", dataClasificacion).then();
                    }

                    GenericApi.getByIdGeneric('get-semaforo-evento', 1).then(
                        datosSemaforo => {
                            if (!datosSemaforo.error) {
                                datosSemaforo.data.forEach(element => {
                                    if (element.attributes.id_mas_evento_inicio.id == 1) {
                                        let date = new Date();
                                        let datapdxsemaforo = {
                                            "data": {
                                                "type": "pdxsemaforo",
                                                "attributes": {
                                                    "id_semaforo": element.id,
                                                    "id_proceso_disciplinario": datos.data.id,
                                                    "id_actuacion": "",
                                                    "fecha_inicio": date.toLocaleDateString('zh-Hans-CN'),
                                                    "estado": 1,
                                                }
                                            }
                                        }
                                        GenericApi.addGeneric('pdxsemaforo', datapdxsemaforo)
                                    }
                                });
                            } else {
                                setModalState({ title: "PROCESO DISCIPLINARIO", message: "ERROR CON LA SEMAFORIZACIÓN", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                            }
                        }
                    )

                    setModalState({ title: "PROCESO DISCIPLINARIO", message: "PROCESO REGISTRADO CON NÚMERO No " + datos["data"]["attributes"]["radicado"] + ".", show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se ejecuta el modal de error
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: 'ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                }

                // Se deshabilita el cargando
                window.showSpinner(false);
            }
        )
    }

    /*
    * Componentes
    */

    const selectOrigenRadicado = () => {
        return (
            listaOrigenRadicado.data.map((origen, i) => {
                return (
                    <option key={origen.id} value={origen.id}>{origen.attributes.nombre}</option>
                )
            })
        )
    }

    const selectTipoProceso = () => {
        return (
            listaTipoProceso.data.map((proceso, i) => {
                return (
                    <option key={proceso.id} value={proceso.id}>{proceso.attributes.nombre}</option>
                )
            })
        )
    }


    const selectEtapaPoderPreferente = () => {
        return (
            getListaEtapaActivaPoderPreferente.data.map((etapa, i) => {
                return (
                    <option key={etapa.id} value={etapa.id}>{etapa.attributes.nombre}</option>
                )
            })
        )
    }

    const selectDependenciaOrigen = () => {
        return (
            getListaDependenciaOrigenDesglose.data.map((dependencia, i) => {
                return (
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                )

            })
        )
    }



    /**
     * VALIDACIÓN DEL FORMATO DE UN CÓDIGO SIRIUS
     */
    const validate = (event) => {
        if (event.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccentGuion.test(event.target.value) && 
        event.target.value.length <= 15)) {
            setValueSirius(event.target.value);
            setRepuestaSiriusExitosa(true);
        }else{
            setError('El formato debe ser: AAAA-LL-NNNNNN (A=año, L=letra, N=número)');
        }
    };

    /**
     * VALIDACIÓN DEL FORMATO DE UN CÓDIGO SINPROC
     * Este valdiación aplica para Desglose y poder preferente
     */
    const handleChangeSinproc = (event) => {
        
        if (event.target.value === '' || (/^\d+$/.test(event.target.value) && event.target.value.length <= 7)) {
            setValueSinproc(event.target.value);
            setRepuestaSinprocExitosa(true);
        }

    }
 

    const componentSirius = (paso) => {
        if (paso === 1) {
            return (
                <>
                    <Formik
                        initialValues={{
                            codigoSirius: valueSirius,
                            origenRadicado: ''
                        }}
                        validate={(valores) => {
                            let errores = {}

                            if(repuestaSiriusExitosa == false){
                                errores.codigoSirius = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_SIRIUS
                            }

                            if(valueSirius == null || valueSirius == ''){
                                errores.codigoSirius = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.origenRadicado) {
                                errores.origenRadicado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            consultarRadicado(valores)
                        }}>
                        {({ errors }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="codigoSirius">SIRIUS<span className="text-danger">*</span></label>
                                            <Field as="input" className="form-control" id="codigoSirius" name="codigoSirius" placeholder="SIRUS" value={valueSirius} onChange={validate} autocomplete="off"/>
                                            <ErrorMessage name="codigoSirius" component={() => (<span className="text-danger">{errors.codigoSirius}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="origenRadicado">ORIGEN DEL RADICADO<span className="text-danger">*</span></label>
                                            <Field as="select" className="form-control" id="origenRadicado" name="origenRadicado">
                                                <option key="0" value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                {respuestaOrigenRadicado ? selectOrigenRadicado() : null}
                                            </Field>
                                            <ErrorMessage name="origenRadicado" component={() => (<span className="text-danger">{errors.origenRadicado}</span>)} />
                                        </div>
                                    </div>
                                    <div className="block-content block-content-full">
                                        <div className="alert alert-success" role="alert">
                                            <p className="mb-0">TENGA EN CUENTA QUE PARA CONSULTAR Y VALIDAR UN RADICADO SIRIUS SE DEBE CUMPLIR CON EL SIGUIENTE FORMATO</p>
                                            <p className="mb-0"> 1. DEBE TENER 15 CARÁCTERES.</p>
                                            <p className="mb-0"> 2. INCLUIR LOS DOS (2) GUIONES "-".</p>
                                            <p className="mb-0"> 3. EJEMPLO: 2020-EE-0000002, 2020-ER-0000123</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.CONSULTAR}</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
        else {
            return (
                <>
                    <Formik
                        initialValues={{
                            antecedenteSirius: (radicacionSirius.data?.attributes?.antecedente ? radicacionSirius.data.attributes.antecedente : ''),
                            radicadoSirius: '',
                            fechaRadicadoCordis: (radicacionSirius.data?.attributes?.fecha_cordis ? radicacionSirius.data.attributes.fecha_cordis : ''),
                            fechaDependencia: '',
                            origenRadicado: (radicacionSirius.data?.attributes?.id_origen_radicado ? radicacionSirius.data.attributes.id_origen_radicado : ''),
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            setCountTextArea(valores.antecedenteSirius.length)
                            let errores = {}

                            if (!valores.antecedenteSirius) {
                                errores.antecedenteSirius = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            else if (valores.antecedenteSirius.length <= getMinimoTextArea) {
                                errores.antecedenteSirius = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES + getMinimoTextArea 
                            }

                            if (!valores.radicadoSirius) {   
                                errores.radicadoSirius = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.fechaRadicadoCordis && !fechaRadicadoCordis) {
                                errores.fechaRadicadoCordis = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.fechaDependencia && !fechaDependenciaSirius) {
                                errores.fechaDependencia = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }


                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores)
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="text-center">
                                            <label>RADICADO No.: <span className="text-danger">{datosFormSiriusConsulta.codigoSirius}</span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="antecedenteSirius">ANTECEDENTES <span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="antecedenteSirius" name="antecedenteSirius" rows="6"
                                                placeholder="Antecedentes...." maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="antecedenteSirius" component={() => (<span className="text-danger">{errors.antecedenteSirius}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor='fechaRadicadoCordis'>FECHA DE RADICADO <span className="text-danger">*</span></label>
                                            <p>{radicacionSirius.data.attributes.fecha_cordis}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="radicadoSirius">No. DE RADICADO DE LA ENTIDAD <span className="text-danger">*</span></label>
                                            <Field type="text" id="radicadoSirius" name="radicadoSirius" className="form-control" placeholder="No. Radicado Entidad" />
                                            <ErrorMessage name="radicadoSirius" component={() => (<span className="text-danger">{errors.radicadoSirius}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='fechaDependencia'>FECHA DE INGRESO A LA DEPENDENCIA <span className="text-danger">*</span></label>
                                            {/*<DatePicker id="fechaDependencia" locale='es' name="fechaDependencia" dateFormat="DD/MM/YYYY" closeOnSelect={true} placeholder="dd/mm/yyyy" onChange={(date) => setFechaDependenciaSirius(date)} timeFormat={false} isValidDate={disableCustomDt} />*/}
                                            <DatePerson resultDiasNoLaborales={resultDiasNoLaborales} getAnosAtrasInvalidos={getAnosAtrasInvalidos}
                                                parentCallback={handleCallbackFechaDependenciaSirius} id="fechaDependencia" name="fechaDependencia"
                                                bloqueaDiasFuturos={true} />
                                            <ErrorMessage name="fechaDependencia" component={() => (<span className="text-danger">{errors.fechaDependencia}</span>)} />
                                        </div>
                                    </div>

                                    <div className="block-content block-content-full text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
    };

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if (name == "vigenciaDesglose") {
            setFechaVigenciaDesglose(value);
        }
        if (name == "vigenciaAutoDesglose") {
            setFechaVigenciaAutoDesglose(value);
        }
        if (name == "vigenciaSinproc") {
            setFechaVigenciaSinproc(value);
        }

        /*if (name == "vigenciaSinprocSegunda") {
            setFechaVigenciaSinprocSegunda(value);
        }*/

    }
    const selectChangeDependenciaOrigen = (v) => {
        setDependenciaOrigenDesglose(v.value);
    }

    const componentDesglose = (paso) => {
        if (paso === 1) {
            return (
                <>
                    <Formik
                        initialValues={{
                            codigoDesglose: '',
                            vigenciaDesglose: '',
                        }}
                        validate={(valores) => {
                            let errores = {}

                            if(repuestaSinprocExitosa == false){
                                errores.codigoDesglose = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_SINPROC
                            }

                            if(valueSinproc == null || valueSinproc == ''){
                                errores.codigoDesglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                        
                            if (!valores.vigenciaDesglose && !getFechaVigenciaDesglose) {
                                errores.vigenciaDesglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            consultarRadicado(valores)
                        }}>
                        {({ errors }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="codigoDesglose">No. SINPROC <span className="text-danger">*</span></label>
                                            <Field as="input" className="form-control" type="text" id="codigoDesglose" name="codigoDesglose" placeholder="Desglose" value={valueSinproc} onChange={handleChangeSinproc} autocomplete="off"/>
                                            <ErrorMessage name="codigoDesglose" component={() => (<span className="text-danger">{errors.codigoDesglose}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-8">

                                        <div className="form-group">
                                            <label htmlFor="vigenciaDesglose">VIGENCIA <span className="text-danger">*</span></label>
                                            <Field value={getFechaVigenciaDesglose} onChange={handleInputChange} as="select" className="form-control" id="vigenciaDesglose" name="vigenciaDesglose">
                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                {respuestaVigenciaDesglose ? selectVigenciaDesglose() : null}
                                            </Field>
                                            <ErrorMessage name="vigenciaDesglose" component={() => (<span className="text-danger">{errors.vigenciaDesglose}</span>)} />
                                        </div>

                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.CONSULTAR}</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
        else {
            return (
                <>
                    <Formik
                        initialValues={{
                            antecedentesDesglose: (radicacionDesglose.data?.attributes?.antecedente ? radicacionDesglose.data.attributes.antecedente : ''),
                            fechaIngresoDesglose: '',
                            fechaAutoDesglose: (radicacionDesglose.data?.attributes?.desglose?.created_at ? radicacionDesglose.data?.attributes?.desglose?.created_at : ''),
                            numAutoDesglose: (radicacionDesglose.data?.attributes?.desglose?.auto ? radicacionDesglose.data?.attributes?.desglose?.auto : ''),
                            dependenciaOrigenDesglose: (radicacionDesglose.data?.attributes?.desglose?.id_dependencia ? radicacionDesglose.data?.attributes?.desglose?.id_dependencia : '')
                        }}
                        enableReinitialize
                        validate={(valores) => {

                            setCountTextArea(valores.antecedentesDesglose.length)
                            let errores = {}

                            let fechaAuto = new Date(radicacionDesglose.data?.attributes?.desglose?.created_at);
                            let fechaRadi = new Date(fechaDependenciaDesglose);

                            if (fechaRadi.getTime() > fechaAuto.getTime()) {
                                errores.fechaIngresoDesglose = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_FECHA_INGRESO_DESGLOSE
                                errores.fechaAutoDesglose = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_FECHA_AUTO_DESGLOSE
                            }

                            if (!valores.antecedentesDesglose) {
                                errores.antecedentesDesglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            else if (valores.antecedentesDesglose.length <= getMinimoTextArea) {
                                errores.antecedentesDesglose = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES + getMinimoTextArea
                            }

                            if (!fechaDependenciaDesglose) {
                                errores.fechaIngresoDesglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.fechaAutoDesglose) {
                                errores.fechaAutoDesglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.numAutoDesglose) {
                                errores.numAutoDesglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            // else if (valores.numAutoDesglose.length < 4) {
                            //     errores.numAutoDesglose = 'Debe ingresar almenos 4 caracteres del número de auto'
                            // }
                            // else if (valores.numAutoDesglose.length > 11) {
                            //     errores.numAutoDesglose = 'Debe ingresar menos de 11 caracteres del número de auto'
                            // }

                            if (!getDependenciaOrigenDesglose) {
                                errores.dependenciaOrigenDesglose = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            console.log(errores);

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores)
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                {console.log(getDependenciaOrigenDesglose)}
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="text-center">
                                            <label>SINPROC No.: {valueSinproc}<span className="text-danger"></span></label>
                                            <div className="block-content block-content-full">
                                                <div className="alert alert-success" role="alert">
                                                    <p className="mb-0">{radicacionDesglose.data?.attributes?.antecedente}</p>
                                                </div>
                                            </div>
                                            {
                                                getCantidadDeHijos >= 1 ? (
                                                    <label>EL NÚMERO SINPROC INGRESADO [{valueSinproc}] TIENE ASOCIADO(S) {getCantidadDeHijos} DESGLOSE(S)</label>
                                                )
                                                    : (
                                                        <label>EL NÚMERO SINPROC INGRESADO [{valueSinproc}] NO TIENE ASOCIADO NINGÚN DESGLOSE</label>
                                                    )
                                            }
                                        </div>
                                    </div>

                                    {getCantidadDeHijos >= 1 ? (

                                        <div className="col-sm-12">
                                            <table className='table table-bordered table-striped table-vcenter js-dataTable-full'>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '10%' }}>SINPROC</th>
                                                        <th style={{ width: '40%' }}>ANTECENDENTE</th>
                                                        <th style={{ width: '20%' }}>FECHA REGISTRO</th>
                                                        <th style={{ width: '15%' }}>REGISTRO POR</th>
                                                        <th style={{ width: '15%' }}>DEPENDENCIA SOLICITANTE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        getListaDatosHijos.data.length != undefined ?
                                                            InfoHijos()
                                                            :
                                                            null
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : null}

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="antecedentesDesglose">ANTECEDENTE DEL DESGLOSE<span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="antecedentesDesglose" name="antecedentesDesglose" rows="6" placeholder="Antecedentes...."
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="antecedentesDesglose" component={() => (<span className="text-danger">{errors.antecedentesDesglose}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='fechaIngresoDesglose'>FECHA DE INGRESO A LA DEPENDENCIA<span className="text-danger">*</span></label>
                                            {/*<DatePicker id="fechaIngresoDesglose" locale='es' name="fechaIngresoDesglose" dateFormat="DD/MM/YYYY" closeOnSelect={true} placeholder="dd/mm/yyyy" onChange={(date) => setFechaDependenciaDesglose(date)} timeFormat={false} isValidDate={disableCustomDt} />*/}
                                            <DatePerson resultDiasNoLaborales={resultDiasNoLaborales} dateFormat="MM/DD/YYYY" getAnosAtrasInvalidos={getAnosAtrasInvalidos}
                                                parentCallback={handleCallbackFechaIngresoDesglose} id="fechaIngresoDesglose" name="fechaIngresoDesglose"
                                                bloqueaDiasFuturos={true} />
                                            <ErrorMessage name="fechaIngresoDesglose" component={() => (<span className="text-danger">{errors.fechaIngresoDesglose}</span>)} />

                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='fechaAutoDesglose'>FECHA DEL AUTO DEL DESGLOSE<span className="text-danger">*</span></label>
                                            {/*<DatePicker id="fechaAutoDesglose" locale='es' name="fechaAutoDesglose" dateFormat="DD/MM/YYYY" closeOnSelect={true} placeholder="dd/mm/yyyy" onChange={(date) => setFechaAutoaDesglose(date)} timeFormat={false} isValidDate={disableCustomDt} />*/}
                                            {/* <DatePerson resultDiasNoLaborales={resultDiasNoLaborales} getAnosAtrasInvalidos={getAnosAtrasInvalidos}
                                                parentCallback={handleCallbackFechaAutoDesglose} id="fechaAutoDesglose" name="fechaAutoDesglose"
                                                bloqueaDiasFuturos={true} />
                                            <ErrorMessage name="fechaAutoDesglose" component={() => (<span className="text-danger">{errors.fechaAutoDesglose}</span>)} /> */}
                                            <Field as="input" type="date" autoComplete="off" timeFormat={false} className="form-control" id="fechaAutoDesglose" autocomplete="off"
                                                name="fechaAutoDesglose" readOnly ></Field>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='numAutoDesglose'>No. DE AUTO<span className="text-danger">*</span></label>
                                            <Field type="text" id="numAutoDesglose" name="numAutoDesglose" minLength="4" maxLength="8" className="form-control" readOnly/>
                                            {/* <ErrorMessage name="numAutoDesglose" component={() => (<span className="text-danger">{errors.numAutoDesglose}</span>)} /> */}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="dependenciaOrigenDesglose">DEPENDENCIA ORIGEN <span className="text-danger">*</span></label>
                                            <Field as="select" className="form-control" id="dependenciaOrigenDesglose" name="dependenciaOrigenDesglose" readOnly>
                                                <option value={radicacionDesglose.data?.attributes?.desglose?.id_dependencia}>{ radicacionDesglose.data?.attributes?.desglose?.nombre_dependencia }</option>
                                            </Field>
                                            {/* {console.log(getListaDependenciaOrigenDesglose)} */}
                                            {/* {getListaDependenciaOrigenDesglose[0] != undefined && getQuedoListoLaLista ? (
                                                <Select
                                                    placeholder="Selecione..."
                                                    value={getListaDependenciaOrigenDesglose.value}
                                                    options={getListaDependenciaOrigenDesglose}
                                                    defaultValue={getPadreConincide? getListaDependenciaOrigenDesglose[0] : null}
                                                    onChange={(e) => selectChangeDependenciaOrigen(e)}
                                                />
                                            ) : null}
                                            <ErrorMessage name="dependenciaOrigenDesglose" component={() => (<span className="text-danger">{errors.dependenciaOrigenDesglose}</span>)} /> */}
                                        </div>
                                    </div>
                                    <div className="block-content block-content-full text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
    };

    const InfoHijos = () => {
        return (
            getListaDatosHijos.data.map((hijo, i) => {
                return (
                    <tr>
                        <td>{hijo.attributes.radicado}</td>
                        <td>{hijo.attributes.antecedente}</td>
                        <td>{hijo.attributes.fecha_registro}</td>
                        <td>{hijo.attributes.registrado_por}</td>
                        <td>{hijo.attributes.dependencia_solicitante}</td>
                    </tr>
                )
            })
        )
    }

    const componentSinproc = (paso) => {
        if (paso === 1) {
            return (
                <>
                    <Formik
                        initialValues={{
                            codigoSinproc: valueSinproc,
                            vigenciaSinproc: ''
                        }}

                        validate={(valores) => {
                            let errores = {}

                            if(repuestaSinprocExitosa == false){
                                errores.codigoSinproc = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_SINPROC
                            }

                            if(valueSinproc == null || valueSinproc == ''){
                                errores.codigoSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.vigenciaSinproc && !getFechaVigenciaSinproc) {
                                errores.vigenciaSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            consultarRadicado(valores)
                        }}>
                        {({ errors }) => (
                            <Form>
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="codigoSinproc">No SINPROC <span className="text-danger">*</span></label>
                                            <Field as="input" className="form-control" type="text" id="codigoSinproc" name="codigoSinproc" autocomplete="off" placeholder="SINPROC" value={valueSinproc} onChange={handleChangeSinproc}/>
                                            <ErrorMessage name="codigoSinproc" component={() => (<span className="text-danger">{errors.codigoSinproc}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="vigenciaSinproc">VIGENCIA <span className="text-danger">*</span></label>
                                            <Field value={getFechaVigenciaSinproc} onChange={handleInputChange} as="select" className="form-control" id="vigenciaSinproc" name="vigenciaSinproc">
                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                {respuestaVigenciaAutoDesglose ? selectVigenciaAutoDesglose() : null}
                                            </Field>
                                            <ErrorMessage name="vigenciaSinproc" component={() => (<span className="text-danger">{errors.vigenciaSinproc}</span>)} />
                                        </div>

                                    </div>

                                </div>

                                <div className="row">
                                    <div className="block-content block-content-full text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.CONSULTAR}</button>
                                    </div>

                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
        else {
            return (
                <>
                    <Formik
                        initialValues={{
                            antecedenteSinproc: (radicacionSinproc.data?.attributes?.antecedente ? radicacionSinproc.data.attributes.antecedente : ''),
                            fechaIngresoSinproc: '',
                            vigenciaSinproc: ''
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            setCountTextArea(valores.antecedenteSinproc.length)


                            let errores = {}


                            if (!valores.antecedenteSinproc) {
                                errores.antecedenteSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            else if (valores.antecedenteSinproc.length <= getMinimoTextArea) {
                                errores.antecedenteSinproc = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES + getMinimoTextArea
                            }


                            if (!valores.fechaIngresoSinproc && !fechaDependenciaSinproc) {

                                errores.fechaIngresoSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.vigenciaSinproc && !getFechaVigenciaSinproc) {
                                errores.vigenciaSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores)
                            //resetForm();
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="text-center">
                                            <label>SINPROC No.: <span className="text-danger">{valueSinproc}</span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="antecedenteSinproc">ANTECEDENTE<span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="antecedenteSinproc" name="antecedenteSinproc" rows="6" placeholder="Antecedentes...."
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="antecedenteSinproc" component={() => (<span className="text-danger">{errors.antecedenteSinproc}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor='fechaIngresoSinproc'>FECHA DE INGRESO A LA DEPENDENCIA<span className="text-danger">*</span></label>
                                            {/*<DatePicker id="fechaIngresoSinproc" locale='es' name="fechaIngresoSinproc" dateFormat="DD/MM/YYYY" closeOnSelect={true} placeholder="dd/mm/yyyy" onChange={(date) => setFechaDependenciaSinproc(date)} timeFormat={false} isValidDate={disableCustomDt} />*/}
                                            <DatePerson resultDiasNoLaborales={resultDiasNoLaborales} getAnosAtrasInvalidos={getAnosAtrasInvalidos}
                                                parentCallback={handleCallbackFechaDependenciaSinproc} id="fechaIngresoSinproc" name="fechaIngresoSinproc"
                                                bloqueaDiasFuturos={true} />
                                            <ErrorMessage name="fechaIngresoSinproc" component={() => (<span className="text-danger">{errors.fechaIngresoSinproc}</span>)} />
                                        </div>
                                    </div>


                                    <div className="block-content block-content-full text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
    };

    const componentPoderPreferente = (paso) => {
        if (paso === 1) {
            return (
                <>
                    <Formik
                        initialValues={{
                            codigoSinproc: valueSinproc,
                            vigenciaSinproc: ''
                        }}

                        validate={(valores) => {
                            let errores = {}

                            if(repuestaSinprocExitosa == false){
                                errores.codigoSinproc = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_SINPROC
                            }

                            if(valueSinproc == null || valueSinproc == ''){
                                errores.codigoSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            
                            if (!valores.vigenciaSinproc && !getFechaVigenciaSinproc) {
                                errores.vigenciaSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            consultarRadicado(valores)
                        }}>
                        {({ errors }) => (
                            <Form>
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="codigoSinproc">No SINPROC<span className="text-danger">*</span></label>
                                            <Field as="input" className="form-control" type="text" id="codigoSinproc" name="codigoSinproc" placeholder="SINPROC" autocomplete="off" value={valueSinproc} onChange={handleChangeSinproc} />
                                            <ErrorMessage name="codigoSinproc" component={() => (<span className="text-danger">{errors.codigoSinproc}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="vigenciaSinproc">VIGENCIA<span className="text-danger">*</span></label>
                                            <Field value={getFechaVigenciaSinproc} onChange={handleInputChange} as="select" className="form-control" id="vigenciaSinproc" name="vigenciaSinproc">
                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                {respuestaVigenciaAutoDesglose ? selectVigenciaAutoDesglose() : null}
                                            </Field>
                                            <ErrorMessage name="vigenciaSinproc" component={() => (<span className="text-danger">{errors.vigenciaSinproc}</span>)} />
                                        </div>

                                    </div>

                                </div>

                                <div className="row">
                                    <div className="block-content block-content-full text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.CONSULTAR}</button>
                                    </div>

                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
        else {
            return (
                <>
                    <Formik
                        initialValues={{
                            antecedenteSinproc: (radicacionSinproc.data?.attributes?.antecedente ? radicacionSinproc.data.attributes.antecedente : ''),
                            fechaIngresoSinproc: '',
                            vigenciaSinproc: '',
                            idEntidadInvolucrada: (radicacionSinproc.data?.attributes?.entidad_involucrada ? radicacionSinproc.data.attributes.entidad_involucrada : ''),
                            idDependeciaCargo: (radicacionSinproc.data?.attributes?.dependencia_cargo ? radicacionSinproc.data.attributes.dependencia_cargo : ''),
                            etapaProcesoPreferente: getTipoEtapaPoderReferente
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            setCountTextArea(valores.antecedenteSinproc.length)

                            let errores = {}

                            if (!valores.antecedenteSinproc) {
                                errores.antecedenteSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            else if (valores.antecedenteSinproc.length <= getMinimoTextArea) {                                
                                errores.antecedenteSinproc =  global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES + getMinimoTextArea
                            }

                            if (!valores.fechaIngresoSinproc && !fechaDependenciaSinproc) {
                                errores.fechaIngresoSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (!valores.vigenciaSinproc && !getFechaVigenciaSinproc) {
                                errores.vigenciaSinproc = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores)
                            //resetForm();
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="text-center">
                                            <label>SINPROC No.: <span className="text-danger">{valueSinproc}</span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="antecedenteSinproc">ANTECEDENTE<span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="antecedenteSinproc" name="antecedenteSinproc" rows="6" placeholder="Antecedentes...."
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="antecedenteSinproc" component={() => (<span className="text-danger">{errors.antecedenteSinproc}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='fechaIngresoSinproc'>FECHA DE INGRESO A LA DEPENDENCIA<span className="text-danger">*</span></label>
                                            <DatePerson resultDiasNoLaborales={resultDiasNoLaborales} getAnosAtrasInvalidos={getAnosAtrasInvalidos}
                                                parentCallback={handleCallbackFechaDependenciaSinproc} id="fechaIngresoSinproc" name="fechaIngresoSinproc"
                                                bloqueaDiasFuturos={true} />
                                            <ErrorMessage name="fechaIngresoSinproc" component={() => (<span className="text-danger">{errors.fechaIngresoSinproc}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='entidadInvolucrada'>ENTIDAD INVOLUCRADA</label>
                                            <p>{radicacionSinproc.data.attributes.nombre_entidad_involucrada}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>DEPENDENCIA A CARGO</label><br />
                                            <p>{radicacionSinproc.data.attributes.nombre_dependencia_cargo}</p>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor='fechaIngresoSinproc'>EN CUAL ETAPA DEL PROCESO SE RECIBE EL EXPEDIENTE<span className="text-danger">*</span></label>
                                            <select className="form-control" id="etapaProcesoPreferente" name="etapaProcesoPreferente"
                                                value={getTipoEtapaPoderReferente} onChange={e => selectChangeTipoEtapaPoderPreferente(e.target.value)}>
                                                <option value="">Por favor seleccione</option>
                                                {getRespuestaEtapaActivaPoderPreferente ? selectEtapaPoderPreferente() : null}
                                            </select>

                                        </div>
                                    </div>

                                    <div className="block-content block-content-full text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary"> {global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }
    };


    const handleCallbackFechaAutoDesglose = (childData) => {
        try {
            setFechaAutoaDesglose(childData)
        } catch (error) {

        }

    }

    const handleCallbackFechaRadicadoCordis = (childData) => {
        try {
            setFechaRadicadoCordis(childData)
        } catch (error) {

        }

    }

    const handleCallbackFechaIngresoDesglose = (childData) => {
        try {
            setFechaDependenciaDesglose(childData)
        } catch (error) {

        }

    }


    const handleCallbackFechaDependenciaSirius = (childData) => {
        try {
            setFechaDependenciaSirius(childData)
        } catch (error) {

        }

    }

    const handleCallbackFechaDependenciaSinproc = (childData) => {
        try {
            setFechaDependenciaSinproc(childData)
        } catch (error) {

        }

    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}

            <div className="row">
                <div className="col-md-12">

                    <div className="w2d_block">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ProcesoDisciplinario`}><small>Proceso Disciplinario</small></Link></li>
                            </ol>
                        </nav>
                    </div>

                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">INICIO DE PROCESO :: PASO 1 :: VALIDAR FORMA DE INGRESO</h3>
                        </div>
                        <div className="block-content">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="ingresoProcesoDisciplinario">INGRESO POR<span className="text-danger">*</span></label>
                                        <select className="form-control" id="ingresoProcesoDisciplinario" name="ingresoProcesoDisciplinario" value={selectedTipoIngreso}
                                            onChange={e => selectChangeProcesoDisciplinario(e.target.value)}>
                                            <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                            {respuestaTipoProceso ? selectTipoProceso() : null}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/*SIRIUS*/}
                            {selectedTipoIngreso === '1' ? componentSirius(1) : ''}
                            {/*DESGLOSE*/}
                            {selectedTipoIngreso === '2' ? componentDesglose(1) : ''}
                            {/*SINPROC*/}
                            {selectedTipoIngreso === '3' ? componentSinproc(1) : ''}
                            {/*PODER PREFERENTE*/}
                            {selectedTipoIngreso === '4' ? componentPoderPreferente(1) : ''}
                        </div>
                    </div>
                </div>
                {
                    validacionExitosa ?
                        <div className="col-md-12">
                            <div className="block block-themed">
                                <div className="block-header">
                                    <h3 className="block-title">INICIO DE PROCESO :: PASO 2 :: REGISTRO DE LA INFORMACIÓN DE INGRESO</h3>
                                </div>
                                <div className="block-content">
                                    {/*SIRIUS*/}
                                    {selectedTipoIngreso === '1' ? componentSirius(2) : null}
                                    {/*DESGLOSE*/}
                                    {selectedTipoIngreso === '2' ? componentDesglose(2) : null}
                                    {/*SINPROC*/}
                                    {selectedTipoIngreso === '3' ? componentSinproc(2) : null}
                                    {/*PODER PREFERENTE*/}
                                    {selectedTipoIngreso === '4' ? componentPoderPreferente(2) : ''}
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>

        </>
    )

}

export default ProcesoDisciplinario;