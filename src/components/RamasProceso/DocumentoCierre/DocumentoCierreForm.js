import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from "react-router";
import { Link } from 'react-router-dom';
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import InfoExitoApi from '../../Utils/InfoExitoApi';
import ParametrosMasApi from '../../Api/Services/ParametrosMasApi';
import InfoExitoApiCustom from '../../Utils/InfoExitoApiCustom';
import Spinner from '../../Utils/Spinner';
import { getUser } from '../../../components/Utils/Common';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';

function DocumentoCierreForm() {

    const location = useLocation()
    const { from, disable } = location.state
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);
    const [respuestaSoporteRadicado, setRespuestaSoporteRadicado] = useState(false);
    const [soporteRadicadoLista, setSoporteRadicadoLista] = useState();
    const [inputListArchivos, setInputListArchivos] = useState([{ folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    const [getListaCompulsaCopias, setListaCompulsaCopias] = useState([]);
    const [getDocumentoCierreLista, setDocumentoCierreLista] = useState({ data: [], links: [], meta: [] });
    const [getFormatosApi, setFormatosApi] = useState();
    const [getListNombresArchivos, setListNombresArchivos] = useState({ attributes: null });
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0);
    const [getRadicadoExpediente, setRadicadoExpediente] = useState();
    const [getSoporteSeleccionado, setSoporteSeleccionado] = useState('');
    const [getListaDetalleCambios, setListaDetalleCambios] = useState({ data: [], links: [], meta: [] });
    const [getDocumentoCierreSinDocumentos, setDocumentoCierreSinDocumentos] = useState(false);
    const [getRemisorioExterno, setRemisorioExterno] = useState(false);
    const [getDocumentoCierre, setDocumentoCierre] = useState(false);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getEstadoRequiereDocumentos, setEstadoRequiereDocumentos] = useState(false);
    const [getCompulsaCopias, setCompulsaCopias] = useState(false);
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getHabilitarRegistro, setHabilitarRegistro] = useState(true);    
    const [getSubirSirius, setSubirSirius] = useState(false)

    let radicado = from.radicado;
    let id_etapa = from.id_etapa;
    let id_fase = from.id_fase;
    let vigencia = from.vigencia;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;


    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setNombreUsuario(getUser().nombre);
            nombreProceso();

        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre.toUpperCase());
                    getInfoProcesoDisciplinario();
                }
            }
        )
    }

    function getInfoProcesoDisciplinario() {
        GenericApi.getGeneric('proceso-diciplinario/' + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    if (datos.data.attributes.tipo_evaluacion.id == global.Constants.TIPOS_EVALUACION.REMISORIO_EXTERNO) {
                        setRemisorioExterno(true);
                    }
                    getDocumentosRadicadosEtapaFase()
                }
                else {
                    setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        );
    }

    function getDocumentosRadicadosEtapaFase() {
        GenericApi.getGeneric('documento-cierre/get-documentos-radicados-etapa-fase/' + procesoDisciplinarioId + '/' + global.Constants.ETAPAS.EVALUACION + '/' + global.Constants.FASES.DOCUMENTO_CIERRE).then(
            datos => {
                if (!datos.error) {
                    if (datos.data?.type == "documento_cierre") {
                        setDocumentoCierreSinDocumentos(true);
                        // console.log("Datosssss", datos);
                        setDocumentoCierre(datos.data);
                    }
                    else {
                        setDocumentoCierreSinDocumentos(false);
                        setDocumentoCierreLista(datos);
                        if (datos?.data[0]?.attributes?.documento_cierre) {
                            setDocumentoCierre(datos.data[0].attributes.documento_cierre);
                        }
                    }
                    getNombresDocumentacionSiriusByIdProDisciplinario();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        );
    }

    function getNombresDocumentacionSiriusByIdProDisciplinario() {
        DocumentoSiriusApi.getNombresDocumentacionSiriusByIdProDisciplinario(procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListNombresArchivos(datos);
                    getFormatos();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        );
    }

    function getFormatos() {
        ParametrosMasApi.getFormatos().then(
            datos => {
                if (!datos.error) {
                    setFormatosApi(datos.data);
                    obtenerParametros();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    const obtenerParametros = () => {
        try {
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
                        estadoPreguntas();
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }

                }
            )
        } catch (error) {
            // console.log(error);
        }
    }


    const estadoPreguntas = () => {

        GenericApi.getGeneric("estado-preguntas").then(
            datos => {
                if (!datos.error) {
                    console.log(datos);
                    setEstadoRequiereDocumentos(datos.data[0].attributes.preguntas_documento_cierre);
                    setCompulsaCopias(datos.data[0].attributes.compulsan_copias);
                }
                else {

                }
                window.showSpinner(false);
            }
        )
    }

    /*Funciones*/
    // handle input change
    const handleInputChangeFolios = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputListArchivos];
        list[index][name] = value;
        setInputListArchivos(list);
    };

    const handleInputChangeArchivos = (e, index) => {

        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);
            const resultado = getFormatosApi.filter(datos => datos.attributes.nombre == extension);

            if (extension.toUpperCase() === 'PDF') {
                const list = [...inputListArchivos];
                list[index][name] = files[0];
                if (files[0]) {
                    list[index][name] = files[0];
                }
                else {
                    list[index][name] = '';
                    list[index].filebase64 = '';
                    list[index].size = 0;
                    list[index].id_mas_formato = null;
                    setInputListArchivos(list);
                }
                //Conversion a Base64
                Array.from(e.target.files).forEach(archivo => {
                    var reader = new FileReader();
                    reader.readAsDataURL(archivo);
                    reader.onload = function () {
                        var arrayAuxiliar = [];
                        var base64 = reader.result;
                        arrayAuxiliar = base64.split(',');
                        list[index].filebase64 = arrayAuxiliar[1];
                        list[index].id_mas_formato = resultado[0].id;
                        setInputListArchivos(list);
                    }
                })
                obtenerPesoTotalArchivos(list);
                compararNombresArchivos(list);
                setHabilitarRegistro(true)
            }
            else {
                const list = [...inputListArchivos];
                list[index][name] = files[0];
                list[index].filebase64 = '';
                list[index].size = 0;
                list[index].id_mas_formato = null;
                setInputListArchivos(list);
                const mensajeModalFormato = 'El archivo seleccionado no tiene un formato permitido';
                setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: mensajeModalFormato.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                window.showModal(1)
                setHabilitarRegistro(false)
            }
        }
        else {
            const list = [...inputListArchivos];
            list[index][name] = '';
            list[index].filebase64 = '';
            list[index].size = 0;
            list[index].id_mas_formato = null;
            setInputListArchivos(list);
            obtenerPesoTotalArchivos(list);
            compararNombresArchivos(list);
        }

    }

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputListArchivos];
        list.splice(index, 1);
        setInputListArchivos(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputListArchivos([...inputListArchivos, { folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    };

    const handleOnSubmit = (valores) => {

        window.showSpinner(true);

        let band = false;

        // VALIDA QUE NO EXISTA EL NOMBRE REPÉTIDO EN EL SISTEMA
        let nombre = "";
        let existe = false;
        if (valores.requiere_documento == 'true') {
            if (getListNombresArchivos?.data && getListNombresArchivos?.data.length > 0) {
                for (let i = 0; i < inputListArchivos.length; i++) {

                    let nombre_servidor = getListNombresArchivos.data.find(dato => dato.attributes.nombre_archivo == inputListArchivos[i].archivo.name);

                    if (nombre_servidor) {
                        nombre = nombre_servidor.attributes.nombre_archivo;
                        existe = true;
                        band = true;
                    }

                    if (existe) {
                        const mensajeError = "El nombre del archivo '" + nombre + "', ya es utilizado por otro documento registrado en el sistema, por favor elimine el archivo y vuelva a subirlo con un nombre distinto";
                        setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: mensajeError.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                        i = inputListArchivos.length + 1;
                    }
                }
            }
        }

        // VALIDA QUE NO EXISTAN ARCHIVOS CON EL MISMO NOMBRE
        /*if (valores.requiere_documento == 'true') {
            for (let i = 0; i < inputListArchivos.length - 1; i++) {
                for (let j = i + 1; j < inputListArchivos.length; j++) {
                    if (inputListArchivos[i].archivo.name === inputListArchivos[j].archivo.name) {
                        setErrorApi("No puede registrar archivos con el mismo nombre.")
                        window.showModal(1)
                        band = true;
                    }
                }
            }
        }*/

        // VALIDA QUE NO SE PUEDAN SUBIR FORMATOS NO PERMITIDOS
        if (valores.requiere_documento == 'true') {
            for (let i = 0; i < inputListArchivos.length; i++) {
                const extension = getFileExtension(inputListArchivos[i].archivo.name);
                const resultado = getFormatosApi.filter(datos => datos.attributes.nombre == extension);
                if (resultado.length <= 0) {
                    const mensajeModalResultado = "Uno de los documentos adjuntados no tiene un formato correspondiente";
                    setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: mensajeModalResultado.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    band = true;
                }
            }
        }

        if (getPesoTotalArchivos > 15000000) {
            const mensajePeso = 'El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro.';
            setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: mensajePeso.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
            band = true;
        }

        const attributes = [];

        if (band === false) {
            if (valores.requiere_documento == 'true') {

                // PASO 1. VALIDAR CON SIRIUS
                // PASO 1.1 LOGIN Y RADICACION

                for (let i = 0; i < inputListArchivos.length; i++) {
                    // PASO 2. GUARDAR EN BASE DE DATOS
                    if (inputListArchivos[i].folios !== null || inputListArchivos[i].folios !== '') {

                        attributes.push({
                            "id_proceso_disciplinario": procesoDisciplinarioId,
                            "id_etapa": global.Constants.ETAPAS.EVALUACION,
                            "id_fase": global.Constants.FASES.DOCUMENTO_CIERRE,
                            "nombre_archivo": inputListArchivos[i].archivo.name,
                            "estado": "1",
                            "num_folios": inputListArchivos[i].folios,
                            "num_radicado": radicado,
                            "vigencia": vigencia,
                            "extension": getFileExtension(inputListArchivos[i].archivo.name),
                            "peso": inputListArchivos[i].archivo.size,
                            "created_user": nombreUsuario,
                            "descripcion": valores.descripcion_documento,
                            "es_compulsa": false,
                            "file64": inputListArchivos[i].filebase64,
                            "id_mas_formato": inputListArchivos[i].id_mas_formato,
                            "es_soporte": false, //ESTABA TRUE
                            "seguimiento": getRemisorioExterno ? (valores.requiere_seguimiento == 'true' ? true : false) : null,
                            "descripcion_seguimiento": valores.descripcion_seguimiento,
                            "subir_sirius": getSubirSirius
                        });

                    }
                }
            }
            if (valores.requiere_compulsa == 'true') {

                for (let i = 0; i < getListaCompulsaCopias.length; i++) {

                    let extension = getListaCompulsaCopias[i].nombreDocumento.split('.');

                    attributes.push({
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_etapa": global.Constants.ETAPAS.EVALUACION,
                        "id_fase": global.Constants.FASES.DOCUMENTO_CIERRE,
                        "nombre_archivo": getListaCompulsaCopias[i].nombreDocumento,
                        "estado": "1",
                        "num_folios": getListaCompulsaCopias[i].attributes.num_folios,
                        "num_radicado": radicado,
                        "vigencia": vigencia,
                        "extension": extension[extension.length - 1],
                        "peso": getListaCompulsaCopias[i].attributes.peso,
                        "created_user": nombreUsuario,
                        "descripcion": valores.descripcion_compulsa,
                        "es_compulsa": true,
                        "id_proceso_disciplinario_compulsa": getListaCompulsaCopias[i].attributes.id_proceso_disciplinario,
                        "radicado_compulsa": getListaCompulsaCopias[i].attributes.num_radicado,
                        "vigencia_compulsa": valores.vigencia,
                        "file64": "false",
                        "id_mas_formato": getListaCompulsaCopias[i].attributes.id_mas_formato,
                        "es_soporte": false, //ESTABA TRUE
                        "path": getListaCompulsaCopias[i].attributes.path,
                        "id_documento_sirius_compulsa": getListaCompulsaCopias[i].id,
                        "documento_vacio": false,
                        "sirius_track_id": valores.radicado_sirius,
                        "sirius_ecm_id": getListaCompulsaCopias[i].idDocumento,
                        "seguimiento": getRemisorioExterno ? (valores.requiere_seguimiento == 'true' ? true : false) : null,
                        "descripcion_seguimiento": valores.descripcion_seguimiento,
                    });
                }

            }

            if (valores.requiere_documento == 'false' && valores.requiere_compulsa == 'false') {
                attributes.push({
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": global.Constants.ETAPAS.EVALUACION,
                    "id_fase": global.Constants.FASES.DOCUMENTO_CIERRE,
                    "url_archivo": "documento_cierre",
                    "nombre_archivo": "documento_cierre",
                    "estado": "1",
                    "num_folios": 0,
                    "num_radicado": radicado,
                    "vigencia": vigencia,
                    "extension": "documento_cierre",
                    "peso": "documento_cierre",
                    "created_user": nombreUsuario,
                    "descripcion": "documento_cierre",
                    "es_compulsa": true,
                    "id_proceso_disciplinario_compulsa": "documento_cierre",
                    "radicado_compulsa": "documento_cierre",
                    "vigencia_compulsa": "documento_cierre",
                    "file64": "false",
                    "id_mas_formato": "documento_cierre",
                    "es_soporte": true,
                    "path": "documento_cierre",
                    "id_documento_sirius_compulsa": "documento_cierre",
                    "sirius_track_id": "documento_cierre",
                    "sirius_ecm_id": "documento_cierre",
                    "documento_vacio": true,
                    "seguimiento": getRemisorioExterno ? (valores.requiere_seguimiento == 'true' ? true : false) : null,
                    "descripcion_seguimiento": valores.descripcion_seguimiento,
                });
            }

            const data = {
                "data": {
                    "type": "documento_sirius",
                    "attributes": attributes
                }
            }

            DocumentoSiriusApi.addDocumentoSirius(data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        }

    }

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function compararNombresArchivos(list) {
        if (getListNombresArchivos?.data.length > 0) {
            let existe = false;
            let nombre = "";
            list.forEach(
                (archivo, index) => {

                    let nombre_servidor = getListNombresArchivos.data.find(dato => dato.attributes.nombre_archivo == archivo.archivo.name);

                    if (nombre_servidor) {
                        nombre = nombre_servidor.attributes.nombre_archivo;
                        existe = true;
                        return
                    }

                }
            );

            if (existe) {
                const mensajeErrorModal = "El nombre del archivo '" + nombre + "', ya es utilizado por otro documento registrado en el sistema, por favor elimine el archivo y vuelva a subirlo con un nombre distinto";
                setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: mensajeErrorModal.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                window.showModal(1)
            }
        }
    }

    function obtenerPesoTotalArchivos(list) {
        let peso = 0;
        list.forEach(
            (archivo, index) => {
                if (archivo.archivo.size) {
                    peso += archivo.archivo.size;
                }
            }
        )

        if (peso > 15000000) {
            const mensajePesoModal = "El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro.";
            setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: mensajePesoModal.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
            window.showModal(1);
        }

        setPesoTotalArchivos(peso);
    }

    function formatBytes(bytes, decimals = 3) {
        if (bytes === undefined) return '0 Bytes';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function handleListCompulsa(documento, position, value) {
        if (value) {
            setListaCompulsaCopias([...getListaCompulsaCopias, documento]);
        }
        else {
            let lista_aux = getListaCompulsaCopias;
            lista_aux = lista_aux.filter(data => data.id != documento.id);
            setListaCompulsaCopias(lista_aux);
        }
    }

    const handleClicArchivo = (documento_sirius, es_compulsa) => {
        try {
            window.showSpinner(true);
            // console.log('Validacion: ', documento_sirius.idDocumento);

            let id_documento_sirius = null;
            let extension = null;
            let radicado_archivo = radicado;
            let vigencia_archivo = vigencia;
            let consulta_sirius = false;
            let version_label = null;
            let nombre_documento = '';

            /*if(getRadicadoExpediente){
                radicado_archivo = getRadicadoExpediente;
                es_compulsa = false;
            }*/

            if (documento_sirius.idDocumento) {
                id_documento_sirius = documento_sirius.idDocumento;
                version_label = documento_sirius.versionLabel;
                consulta_sirius = true;
                nombre_documento = documento_sirius.nombreDocumento
            }
            else {
                id_documento_sirius = documento_sirius.id;
                nombre_documento = documento_sirius.attributes.nombre_archivo;
                extension = documento_sirius.attributes.extension
            }

            const data = {
                "data": {
                    "type": "documento_sirius",
                    "attributes": {
                        "radicado": radicado_archivo,
                        "vigencia": vigencia_archivo,
                        "id_documento_sirius": id_documento_sirius,
                        "extension": extension,
                        "es_compulsa": es_compulsa,
                        "consulta_sirius": consulta_sirius,
                        "versionLabel": version_label
                    }
                }
            }

            DocumentoSiriusApi.getDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento, extension);
                        window.showSpinner(false);
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        // console.log("Datos que recibo", contentType, base64Data, fileName, extension);
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    function buscarExpediente(radicado_sirius) {
        setRadicadoExpediente(radicado_sirius);
        window.showSpinner(true);
        setRespuestaSoporteRadicado(false)
        DocumentoSiriusApi.getDocumentacionSiriusByRadicadoSirius(radicado_sirius).then(
            datos => {
                if (!datos.error) {
                    // console.log("Esperando respuesta", datos);
                    setSoporteRadicadoLista(datos);
                    setRespuestaSoporteRadicado(true);
                    window.showModal(6);
                }
                else {
                    setModalState({ title: getNombreProceso + " :: DOCUMENTO CIERRE", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }

    const cargarDetalleCambiosEstado = (documento) => {

        // console.log('log-proceso-disciplinario/get-log-proceso', documento);
        setSoporteSeleccionado(documento);
        GenericApi.getByIdGeneric('log-proceso-disciplinario/get-log-proceso', documento.id).then(
            datos => !datos.error ? (setListaDetalleCambios(datos)) : (window.showModal(1)));
    }

    /*Componentes */
    const componentForm = () => {
        return (
            <Formik
                initialValues={{
                    descripcion_documento: '',
                    descripcion_compulsa: '',
                    descripcion_seguimiento: '',
                    requiere_documento: 'false',
                    requiere_compulsa: 'false',
                    requiere_seguimiento: 'false',
                    radicado_sirius: ''
                }}
                enableReinitialize
                validate={(valores) => {

                    let errores = {}
                    setCountTextArea(valores.descripcion_documento.length);
                    if (valores.requiere_compulsa == 'true') {
                        if (!valores.radicado_sirius) {
                            errores.radicado_sirius = 'Campo obligatorio'
                        }
                    }

                    if (valores.descripcion_seguimiento) {
                        if (valores.descripcion_seguimiento.length < getMinimoTextArea) {
                            errores.descripcion_seguimiento = 'Debe ingresar mínimo ' + getMinimoTextArea + ' caracteres'
                        }

                        if (containsSpecialChars(valores.descripcion_seguimiento)) {
                            errores.descripcion_seguimiento = 'Tiene caracteres inválidos'
                        }

                    }

                    if (valores.descripcion_documento) {
                        if (valores.descripcion_documento.length < getMinimoTextArea) {
                            errores.descripcion_documento = 'Debe ingresar mínimo ' + getMinimoTextArea + ' caracteres'
                        }

                        if (containsSpecialChars(valores.descripcion_documento)) {
                            errores.descripcion_documento = 'Tiene caracteres inválidos'
                        }

                    }

                    if (valores.descripcion_compulsa) {
                        if (valores.descripcion_compulsa.length < getMinimoTextArea) {
                            errores.descripcion_compulsa = 'Debe ingresar mínimo ' + getMinimoTextArea + ' caracteres'
                        }
                        if (containsSpecialChars(valores.descripcion_compulsa)) {
                            errores.descripcion_compulsa = 'Tiene caracteres inválidos'
                        }

                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    handleOnSubmit(valores);
                }}>
                {({ errors, values }) => (
                    <Form>
                        {
                            getRemisorioExterno
                                ?
                                <>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <div className="form-group text-center">
                                                <label className="d-block">REQUIERE SEGUIMIENTO?</label>
                                                <div className="custom-control custom-radio custom-control-inline custom-control-lg">
                                                    <Field type="radio" className="custom-control-input" id="requiere_seguimiento1" name="requiere_seguimiento" value="true" />
                                                    <label className="custom-control-label" htmlFor="requiere_seguimiento1">SI</label>
                                                </div>
                                                <div className="custom-control custom-radio custom-control-inline custom-control-lg">
                                                    <Field type="radio" className="custom-control-input" id="requiere_seguimiento2" name="requiere_seguimiento" value="false" />
                                                    <label className="custom-control-label" htmlFor="requiere_seguimiento2">NO</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            {
                                                values.requiere_seguimiento == 'true'
                                                    ?
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <div className="form-group">
                                                                <Field as="textarea" className="form-control" id="descripcion_seguimiento" name="descripcion_seguimiento" rows="4" placeholder="Descripción del seguimiento" required
                                                                    maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                                <div className="text-right">
                                                                    <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                                </div>
                                                                <ErrorMessage name='descripcion_seguimiento' component={() => (<span className='text-danger'>{errors.descripcion_seguimiento}</span>)} />
                                                            </div>
                                                        </div>
                                                    </div> : null
                                            }
                                        </div>
                                    </div>
                                </> : null
                        }
                        {getEstadoRequiereDocumentos == 1 ?
                            <>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className="form-group text-center">
                                            <label className="d-block">¿REQUIERE DOCUMENTO?</label>
                                            <div className="custom-control custom-radio custom-control-inline custom-control-lg">
                                                <Field type="radio" className="custom-control-input" id="requiere_documento1" name="requiere_documento" value="true" />
                                                <label className="custom-control-label" htmlFor="requiere_documento1">SI</label>
                                            </div>
                                            <div className="custom-control custom-radio custom-control-inline custom-control-lg">
                                                <Field type="radio" className="custom-control-input" id="requiere_documento2" name="requiere_documento" value="false" />
                                                <label className="custom-control-label" htmlFor="requiere_documento2">NO</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        {
                                            values.requiere_documento == 'true'
                                            ?                                            
                                                <div className='row'>
                                                    <div className='col-md-12'>
                                                        <div className="custom-control custom-switch custom-control-lg mb-2 text-center">
                                                            <input defaultChecked={getSubirSirius} type="checkbox" onChange={e => setSubirSirius(e.target.checked)} className="custom-control-input" id="subirSirius" name="subirSirius"/>
                                                            <label className="custom-control-label" htmlFor="subirSirius">¿SUBIR DOCUMENTACIÓN A SIRIUS?</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            :
                                                null
                                        }
                                        {
                                            values.requiere_documento == 'true'
                                                ?
                                                (
                                                    inputListArchivos.map((x, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <div className='row'>
                                                                    <div className='col-md-12'>
                                                                        <div className='row'>
                                                                            <div className='col-md-6'>
                                                                                <input className='form-control' name="folios" placeholder="No de folios" value={x.folios} onChange={e => handleInputChangeFolios(e, i)} required />
                                                                            </div>
                                                                            <div className='col-md-6'>
                                                                                <label className="custom-file-label" htmlFor="example-file-input-custom" data-toggle="custom-file-input">{x.archivo.name}</label>
                                                                                <input className="custom-file-input" data-toggle="custom-file-input" type="file" name="archivo" onChange={e => handleInputChangeArchivos(e, i)} required />
                                                                                <label>PESO DEL ARCHIVO: {formatBytes(x.archivo.size)}</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <br></br>
                                                                <div className='row'>
                                                                    <div className='col-md-12'>
                                                                        <div className="form-group">
                                                                            <Field as="textarea" className="form-control" id="descripcion_documento" name="descripcion_documento" rows="4" placeholder="Descripción de los soportes" required
                                                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                                            <div className="text-right">
                                                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                                            </div>
                                                                            <ErrorMessage name='descripcion_documento' component={() => (<span className='text-danger'>{errors.descripcion_documento}</span>)} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : null}
                                    </div>
                                </div>
                            </> : null}

                        {getCompulsaCopias == 1 ?
                            <>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className="form-group text-center">
                                            <label className="d-block">¿SE COMPULSAN COPIAS?</label>
                                            <div className="custom-control custom-radio custom-control-inline custom-control-lg">
                                                <Field type="radio" className="custom-control-input" id="compulsa_copias1" name="requiere_compulsa" value="true" />
                                                <label className="custom-control-label" htmlFor="compulsa_copias1" name="compulsa_copias">SI</label>
                                            </div>
                                            <div className="custom-control custom-radio custom-control-inline custom-control-lg">
                                                <Field type="radio" className="custom-control-input" id="compulsa_copias2" name="requiere_compulsa" value="false" />
                                                <label className="custom-control-label" htmlFor="compulsa_copias2">NO</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {values.requiere_compulsa == 'true' ?
                                    (
                                        <>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <label htmlFor="radicado_sirius">N° RADICADO SIRIUS</label>
                                                        <Field className="form-control" id="radicado_sirius" name="radicado_sirius" placeholder="No radicado SIRIUS"></Field>
                                                        <ErrorMessage name="radicado_sirius" component={() => (<span className="text-danger">{errors.radicado_sirius}</span>)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-12'>
                                                    <div className='text-right'>
                                                        <button type="button" className="btn btn-rounded btn-primary" onClick={() => buscarExpediente(values.radicado_sirius)} disabled={!values.radicado_sirius}><i className="fa fa-fw fa-search"></i> BUSCAR</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <br></br>
                                            {
                                                respuestaSoporteRadicado ?
                                                    (
                                                        soporteRadicadoLista?.documentoDTOList.length > 0
                                                            ?
                                                            (
                                                                true//soporteRadicadoLista.data[0].attributes.id_proceso_disciplinario != procesoDisciplinarioId
                                                                    ?
                                                                    (
                                                                        <>
                                                                            <div className='row'>
                                                                                <div className='col-md-12'>
                                                                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th width="10%" className="text-center">N°.</th>
                                                                                                <th width="40%">FECHA DE REGISTRO</th>
                                                                                                <th width="25%">DOCUMENTO</th>
                                                                                                <th width="25%">ACCIONES</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            { cargarTabla() }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                            <br></br>
                                                                            <div className='row'>
                                                                                <div className='col-md-12'>
                                                                                    <div className="form-group">
                                                                                        <Field as="textarea" className="form-control" id="descripcion_compulsa" name="descripcion_compulsa" rows="4"
                                                                                            placeholder="Descripción de los soportes" required maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                                                        <div className="text-right">
                                                                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                                                        </div>
                                                                                        <ErrorMessage name='descripcion_compulsa' component={() => (<span className='text-danger'>{errors.descripcion_compulsa}</span>)} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                    :
                                                                    (
                                                                        <div className="alert alert-danger alert-dismissable text-center" role="alert">
                                                                            <h3 className="alert-heading font-size-h4 my-2">ALERTA</h3>
                                                                            <p className="mb-0"> NO SE PUEDEN CONSULTAR LOS DOCUMENTOS ANEXOS DE ESTE MISMO PROCESO DISCIPLONARIO</p>
                                                                        </div>
                                                                    )
                                                            )
                                                            :
                                                            (
                                                                <div className="alert alert-danger alert-dismissable text-center" role="alert">
                                                                    <h3 className="alert-heading font-size-h4 my-2">ALERTA</h3>
                                                                    <p className="mb-0"> EL EXPEDIENTE CONSULTADO NO TIENE ANEXOS</p>
                                                                </div>
                                                            )
                                                    )
                                                    :
                                                    null
                                            }
                                        </>
                                    )
                                    :
                                    null
                                }
                            </>
                            : null}
                        {getEstadoRequiereDocumentos == 1 || getCompulsaCopias == 1 ?
                            <>
                                <div className='row'>
                                    <div className="col-md-12 text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary" disabled={(values.requiere_compulsa == 'true' && getListaCompulsaCopias.length <= 0) || getHabilitarRegistro == false}> REGISTRAR</button>
                                        <Link to={`/RamasProceso/`} state={{ from: from }}>
                                            <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                        </Link>
                                    </div>
                                </div>
                                <br></br>
                            </> : null
                        }
                    </Form>
                )}
            </Formik>
        )
    }

    const componentModalListaDetalleCambios = () => {
        return (
            <div className="modal fade" id={'modal-consultar-detalle'} tabIndex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document" >
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">DETALLE DEL CAMBIO EN DOCUMENTO CIERRE</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content" style={{ 'height': '300px', 'overflow': 'scroll', 'display': 'block' }}>
                                Observaciones: {getSoporteSeleccionado ? getSoporteSeleccionado.attributes.descripcion : ""}<br /><br />
                            </div>
                            {
                                (getListaDetalleCambios.data.length > 0) ? (
                                    <div>
                                        <div className="block-content">
                                            <spam className="block-title">Historial de cambios en documento cierre</spam>
                                        </div>

                                        <div className="block-content" style={{ 'height': '300px', 'overflow': 'scroll', 'display': 'block' }}>
                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                <thead>
                                                    <tr>
                                                        <th>Usuario Registra</th>
                                                        <th>Dependencia</th>
                                                        <th>Descripción</th>
                                                        <th>Fecha</th>
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
                                <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const componentRegistro = () => {
        return (
            <>
                <div className="col-md-12 text-uppercase">
                    <div className="alert alert-warning alert-dismissable" role="alert">
                        <h3 className="alert-heading font-size-h4 my-2">Alerta</h3>
                        <p className="mb-0"> Para cualquier archivo que requiera adjuntar valide previamente lo siguiente: </p>
                        <p className="mb-0">
                            NO puede superar QUINCE (15) Mb de peso/tamaño.
                            Tipo/Formato permitido: PDF
                        </p>
                        <p className="mb-0">
                            El nombre del archivo debe ser de máximo 40 caracteres.
                        </p>
                    </div>
                </div>
                <div className="col-md-12">
                    {componentForm()}
                </div>
            </>
        )
    }

    const componentLista = () => {
        return (
            <>
                {
                    (
                        getDocumentoCierreLista.data.filter(datos => datos.attributes.compulsa == '1') > 0 &&
                        getDocumentoCierreLista.data.filter(datos => datos.attributes.compulsa == '0') > 0
                    )
                        ?
                        null
                        :
                        (
                            getDocumentoCierreLista.data.filter(datos => datos.attributes.compulsa == '1') <= 0
                        )
                            ?
                            <div className="col-md-12 text-center alert alert-warning alert-dismissable">
                                <label>NO SE REALIZÓ PROCESO DE COMPULSA DE DATOS PARA ESTE EXPEDIENTE</label>
                            </div>
                            :
                            (
                                getDocumentoCierreLista.data.filter(datos => datos.attributes.compulsa == '0') <= 0
                            )
                                ?
                                <div className="col-md-12 text-center alert alert-warning alert-dismissable">
                                    <label>NO SE REALIZÓ PROCESO DE ADJUNTAR DOCUMENTO PARA ESTE EXPEDIENTE</label>
                                </div>
                                :
                                null

                }
                {
                    (
                        getDocumentoCierre?.seguimiento == null || getDocumentoCierre?.seguimiento == '1'
                    )
                        ?
                        null
                        :
                        <div className="col-md-12 text-center alert alert-warning alert-dismissable">
                            <label>NO SE REALIZÓ PROCESO DE SEGUIMIENTO PARA ESTE EXPEDIENTE</label>
                        </div>
                }
                <div className="col-md-12">
                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                        <thead>
                            <tr>
                                <th className="text-center">NO.</th>
                                <th>FECHA DE REGISTRO</th>
                                <th>ARCHIVO</th>
                                <th>INFORMACIÓN</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargarTablaDocumentoCierre()}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + hours + ':' + minutes + ':' + date.getSeconds() + ' ' + ampm;
        return strTime;
    }

    const cargarTabla = () => {
        return (
            soporteRadicadoLista.documentoDTOList.map((documento_sirius, i) => {
                let date = new Date(documento_sirius.fechaCreacion)

                let fechaCreacion = formatAMPM(date);
                return (
                    <tr key={documento_sirius.id}>
                        <td className="text-center">{i + 1}</td>
                        <td>{fechaCreacion}</td>
                        <td className='text-center'>
                            <button type='button' title='Descargar documento' className='btn btn-primary' onClick={() => handleClicArchivo(documento_sirius, true)}><i className="fas fa-download"></i></button>
                        </td>
                        <td>
                            <div className="custom-control custom-checkbox mb-1">
                                <input type="checkbox" className="custom-control-input" id={'example-cb-custom' + i} name={'example-cb-custom' + i} onClick={event => handleListCompulsa(documento_sirius, i, event.target.checked)} />
                                <label className="custom-control-label" htmlFor={'example-cb-custom' + i}>COMPULSAR</label>
                            </div>
                        </td>
                    </tr>
                )
            })
        )
    }

    const cargarTablaDocumentoCierre = () => {
        return (
            getDocumentoCierreLista.data.map((documento_sirius, i) => {
                return (
                    <tr key={documento_sirius.id}>
                        <td width="10%" className="text-center">{i + 1}</td>
                        <td width="20%">{documento_sirius.attributes.created_at}</td>
                        <td>
                            {documento_sirius.attributes.nombre_archivo.toUpperCase()}
                        </td>
                        <td>
                            {documento_sirius.attributes.compulsa == '1' ? ('SE REALIZÓ COMPULSA DE DATOS DE RADICACIÓN SIRIUS NO: ' + documento_sirius.attributes.sirius_track_id) : ' SE ADJUNTO'}
                        </td>
                        <td>
                            <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-primary' onClick={() => handleClicArchivo(documento_sirius, documento_sirius.attributes.compulsa == '1' ? true : false)}><i className="fas fa-download"></i></button>
                            <button type='button' title='CONSULTAR DESCRIPCIÓN' className='btn btn-primary' data-toggle="modal" onClick={() => cargarDetalleCambiosEstado(documento_sirius)} data-target={'#modal-consultar-detalle'}><i className="fas fa-search"></i></button>
                            {componentModalListaDetalleCambios()}
                        </td>
                    </tr>
                )
            })
        )
    }

    const componentSinDocumentos = () => {
        if (getDocumentoCierre?.seguimiento == null) {
            return (
                <div className="col-md-12 text-center alert alert-warning alert-dismissable">
                    <label>NO SE ANEXÓ DOCUMENTACIÓN Y NO SE REALIZÓ PROCESO DE COMPULSA DE DATOS PARA ESTE EXPEDIENTE</label>
                </div>
            )
        }
        else if (getDocumentoCierre?.seguimiento == '0') {
            return (
                <div className="col-md-12 text-center alert alert-warning alert-dismissable">
                    <label>NO SE ANEXÓ DOCUMENTACIÓN, NO SE REALIZÓ PROCESO DE COMPULSA DE DATOS Y NO SE REALIZÓ SEGUIMIENTO PARA ESTE EXPEDIENTE</label>
                </div>
            )
        }

        return (
            <div className="col-md-12 text-center alert alert-warning alert-dismissable">
                <label>NO SE ANEXÓ DOCUMENTACIÓN Y NO SE REALIZÓ PROCESO DE COMPULSA DE DATOS PARA ESTE EXPEDIENTE</label>
            </div>
        )
    }

    const componentSeguimiento = () => {
        if (getDocumentoCierre?.seguimiento && getDocumentoCierre?.seguimiento != '0' && from.mismoUsuarioBuscador) {
            return (
                <div className="col-md-12">
                    <label>OBSERVACIONES PARA EL REGISTRO DE SEGUIMIENTO: </label> <p>{getDocumentoCierre?.descripcion_seguimiento}</p>
                </div>
            )
        }
    }

    const listaDetalleCambios = () => {
        if (getListaDetalleCambios.data != null && typeof (getListaDetalleCambios.data) != 'undefined') {
            return (
                getListaDetalleCambios.data.map((cambio, i) => {
                    return (
                        <tr key={cambio.id}>
                            <td>
                                {cambio.attributes.created_user}
                            </td>
                            <td>
                                {cambio.attributes.dependencia_origen ? cambio.attributes.dependencia_origen.nombre : ""}
                            </td>
                            <>
                                {
                                    (cambio.attributes.descripcion.length > global.Constants.TEXT_AREA.CANTIDAD_MINIMA_DESCRIPCION) ? (
                                        <td title={cambio.attributes.descripcion}>
                                            {cambio.attributes.descripcion.substring(0, global.Constants.TEXT_AREA.CANTIDAD_MINIMA_DESCRIPCION)}...
                                        </td>
                                    ) :
                                        (
                                            <td title={cambio.attributes.descripcion}>
                                                {cambio.attributes.descripcion}
                                            </td>
                                        )
                                }
                            </>
                            <td>
                                {cambio.attributes.created_at}
                            </td>
                        </tr>
                    )
                })
            )
        }
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <small>Documento Cierre</small></li>
                    </ol>
                </nav>
            </div>
            <div className='content'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='block block-themed'>
                            <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                <h3 className='block-title'>{getNombreProceso} :: DOCUMENTO CIERRE</h3>
                            </div>
                            <div className='block-content'>
                                <div className='col-md-12 text-right my-2'>
                                    <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>
                                {
                                    getDocumentoCierreSinDocumentos
                                    ?
                                        componentSinDocumentos()
                                    :
                                        (
                                            getDocumentoCierreLista.data.length > 0
                                                ?
                                                componentLista()
                                                :
                                                ((disable != true && from.mismoUsuarioBuscador) ? (
                                                    componentRegistro()
                                                ) : null)
                                        )
                                }
                                {
                                    componentSeguimiento()
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DocumentoCierreForm;