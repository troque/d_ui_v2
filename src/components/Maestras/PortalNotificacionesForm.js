import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Spinner from '../Utils/Spinner';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import '../Utils/Constants';
import ModalGen from '../Utils/Modals/ModalGeneric';
import InfoErrorApi from '../Utils/InfoErrorApi';
import Select from 'react-select';
import DocumentoSiriusApi from '../Api/Services/DocumentoSiriusApi';

function PortalNotificacionesForm() {

    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [countTextArea, setCountTextArea] = useState(0);

    // Constantes para cargar los valores
    const [getNumeroProcesoSinproc, setNumeroProcesoSinproc] = useState("");

    const [getMensajeErrorNumeroProcesoSirius, setMensajeErrorNumeroProcesoSirius] = useState("");
    const [getMensajeErrorVigenciaSirius, setMensajeErrorVigenciaSirius] = useState("");
    const [getMensajeErrorEstado, setMensajeErrorEstado] = useState("");
    const [getMensajeErrorNumeroRadicadoSirius, setMensajeErrorNumeroRadicadoSirius] = useState("");
    const [getMensajeErrorDetalleNotificacion, setMensajeErrorDetalleNotificacion] = useState("");
    const [getMensajeErrorInteresado, setMensajeErrorInteresado] = useState("");

    const [getListaInteresados, setListaInteresados] = useState([]);
    const [getListaActuaciones, setListaActuaciones] = useState([]);
    const [getInteresadoCompleta, setInteresadoCompleta] = useState([]);
    const [getInteresadoSeleccionado, setInteresadoSeleccionado] = useState([]);
    const [getActuacionSeleccionada, setActuacionSeleccionada] = useState([]);
    const [getFechasVigencias, setFechasVigencias] = useState([]);

    const [getTipoDocumentoNumero, setTipoDocumentoNumero] = useState("");
    const [getTipoDocumento, setTipoDocumento] = useState("");
    const [getNumeroDocumento, setNumeroDocumento] = useState("");
    const [getPrimerNombre, setPrimerNombre] = useState("");
    const [getSegundoNombre, setSegundoNombre] = useState("");
    const [getPrimerApellido, setPrimerApellido] = useState("");
    const [getSegundoApellido, setSegundoApellido] = useState("");
    const [getDepartamentoResidencia, setDepartamentoResidencia] = useState("");
    const [getCiudadResidencia, setCiudadResidencia] = useState("");
    const [getDireccionResidencia, setDireccionResidencia] = useState("");
    const [getCorreo, setCorreo] = useState("");
    const [getCelular, setCelular] = useState("");
    const [getAutorizaCorreos, setAutorizaCorreos] = useState("");
    const [getDetalleNotificacion, setDetalleNotificacion] = useState("");
    const [getNumeroRadicadoSirius, setNumeroRadicadoSirius] = useState("");
    const [getFechaVigenciaSinproc, setFechaVigenciaSinproc] = useState("");
    const [getRespuestaVigencias, setRespuestaVigencias] = useState(false);
    const [getVigencias, setVigencias] = useState("");

    const [getCountTextDetalle, setCountTextDetalle] = useState(0);
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0);
    const [inputListArchivos, setInputListArchivos] = useState([{ folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);

    const [getRespuestaProcesoSirius, setRespuestaProcesoSirius] = useState(false);
    const [soporteRadicadoLista, setSoporteRadicadoLista] = useState();
    const [getEncontroDocumentoValido, setEncontroDocumentoValido] = useState(false);

    const [getValueDocumento, setValueDocumento] = useState();
    const [getNombreDocumento, setNombreDocumento] = useState();
    const [getArrayInformacion, setArrayInformacion] = useState([]);

    useEffect(() => {
        async function fetchData() {

            // Se habilita el cargando
            window.showSpinner(true);

            // Se consulta las vigencias
            getApiVigencia();

            // Se carga la api de parametros permitidos
            obtenerParametros();

            // Se carga los tipos de expediente por mensajes
            deshabilitarCargando();
        }
        fetchData();
    }, []);

    // Metodo encargado de cargar el formulario para registrar un parametro
    const deshabilitarCargando = () => {

        // Se deshabilita el cargando
        window.showSpinner(false);
    }

    // Metodo encargado de registrar los valores
    const enviarDatos = (valores) => {

        // Se captura el valor
        const numeroDocumento = getNumeroDocumento;
        const tipoDocumento = getTipoDocumentoNumero;
        const detalleNotificacion = getDetalleNotificacion;
        const numeroProcesoSinproc = getNumeroProcesoSinproc;
        const estado = true;
        const numeroRadicadoSirius = getNumeroRadicadoSirius;
        const encontroDocumentoValido = getEncontroDocumentoValido;
        const interesadoSeleccionado = getInteresadoSeleccionado;
        const actuacionSeleccionada = getActuacionSeleccionada.value;
        const vigencia = getVigencias;
        const correo = getCorreo;
        const primerNombre = getPrimerNombre != "" ? getPrimerNombre + " " : "";
        const segundoNombre = getSegundoNombre != "" ? getSegundoNombre + " " : "";
        const primerApellido = getPrimerApellido != "" ? getPrimerApellido + " " : "";
        const segundoApellido = getSegundoApellido != "" ? getSegundoApellido + " " : "";
        const nombreCompleto = primerNombre + segundoNombre + primerApellido + segundoApellido;
        const autorizaCorreos = getAutorizaCorreos;

        // Se valida que el proceso sinproc sea valido
        if (!getRespuestaProcesoSirius) {

            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Debe diligenciar y validar el número del proceso SINPROC.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que haya un interesado seleccionado
        if (interesadoSeleccionado.length <= 0) {

            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Debe seleccionar al menos un interesado.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que haya un número auto seleccionado
        if(actuacionSeleccionada.length <= 0){
            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Debe seleccionar un número auto.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que contenga minimo 10 caracteres
        if (detalleNotificacion.length <= 10) {

            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'El detalle debe contener minimo 10 caracteres.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que contenga maximo 4000 caracteres
        if (detalleNotificacion.length > 4000) {

            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'El detalle debe contener máximo 4000 caracteres.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que el proceso sinproc sea valido
        if (!encontroDocumentoValido) {

            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Debe diligenciar y validar el número del radicado SIRIUS.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que haya un numero de proceso
        if (numeroRadicadoSirius.length <= 0) {

            // Se setea el valor
            setMensajeErrorNumeroRadicadoSirius('El proceso SIRIUS debe ser mayor a 0.');

            // Se retorna
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorNumeroProcesoSirius('');
        }

        // Se realizan las validaciones de los campos
        if (numeroProcesoSinproc.length <= 0 || numeroDocumento.length <= 0 || tipoDocumento.length <= 0) {

            // Se manda una alerta
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Diligencie la información requerida *', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que el interesado tenga correo electronico 
        if (!correo || correo.length <= 0) {

            // Se manda una alerta
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'El interesado no tiene correo electronico registrado.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida que el interesado tenga correo electronico y haya autorizado correo electronicos
        if (!autorizaCorreos || autorizaCorreos != "SI") {

            // Se manda una alerta
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'El interesado no acepto el envio de correos electronicos.', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa el array
        const data = {
            "data": {
                "type": "portal-notificaciones",
                "attributes": {
                    "numero_documento": numeroDocumento,
                    "tipo_documento": tipoDocumento,
                    "detalle": detalleNotificacion,
                    "radicado": numeroProcesoSinproc,
                    "estado": estado,
                    "numero_radicado_sirius": numeroRadicadoSirius,
                    "correo": correo,
                    "nombreCompleto": nombreCompleto,
                    "id_actuacion": actuacionSeleccionada
                }
            }
        }

        // Se inicializa la API
        GenericApi.addGeneric('portal-notificaciones', data).then(
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se envia el mensaje
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Creado con éxito ', show: true, redirect: '/PortalNotificaciones', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se envia el mensaje
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    // Metodo encargado de validar el maximo de caracteres por input
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

            // Buscamos el parametro
            GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(
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
                    } else {
                        setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de validar el maximo de caracteres por input
    const cargarInteresados = (numeroProcesoSinproc) => {

        // Se inicializa el array
        var dataInteresados = [];

        try {
            const data = {
                "data": {
                    "type": 'interesado',
                    "attributes": {
                        "id_tipo_interesao": "1",
                        "id_tipo_sujeto_procesal": "",
                        "tipo_documento": "4",
                        "numero_documento": "2030405060",
                        "primer_nombre": "ANÓNIMO(A)",
                        "segundo_nombre": "ANÓNIMO(A)",
                        "primer_apellido": "ANÓNIMO(A)",
                        "segundo_apellido": "ANÓNIMO(A)",
                        "id_departamento": "",
                        "id_ciudad": "",
                        "direccion": "ANÓNIMO(A)",
                        "id_localidad": "",
                        "email": "",
                        "telefono_celular": "0",
                        "telefono_fijo": "0",
                        "id_sexo": "",
                        "id_genero": "",
                        "id_orientacion_sexual": "",
                        "cargo": "",
                        "tarjeta_profesional": "",
                        "id_dependencia": "",
                        "id_tipo_entidad": "",
                        "nombre_entidad": "",
                        "id_entidad": "",
                        "id_dependencia_entidad": "",
                        "entidad": "",
                        "id_proceso_disciplinario": "fe3f3ea7-be08-4ac2-9ac2-33949bfd8461",
                        "folio": ""
                    }
                }
            }

            // Buscamos los interesados
            GenericApi.getByDataGeneric("datos-interesado/getDatosInteresados/" + numeroProcesoSinproc + "/" + getVigencias, data).then(

                // Se captura la respuesta en variable
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se setea el array
                        setInteresadoCompleta(datos.data);

                        // Se recorre el array
                        for (let index = 0; index < datos.data.length; index++) {

                            // Se capturan los elementos
                            const element = datos.data[index];

                            // Se capturan los nombres
                            const primerNombre = element.attributes.primer_nombre ? element.attributes.primer_nombre + " " : "";
                            const segundoNombre = element.attributes.segundo_nombre ? element.attributes.segundo_nombre + " " : "";
                            const primerApellido = element.attributes.primer_apellido ? element.attributes.primer_apellido + " " : "";
                            const segundoApellido = element.attributes.segundo_apellido ? element.attributes.segundo_apellido + " " : "";
                            const sujetoProcesal = element?.attributes?.sujeto_procesal_nombre ? ("- " + element.attributes.sujeto_procesal_nombre.toUpperCase()) : "";

                            // Se concadenan los nombres
                            const nombreCompleto = primerNombre + segundoNombre + primerApellido + segundoApellido + sujetoProcesal;

                            // Se setea el valor al array para mostrarlo en el select
                            dataInteresados.push({ label: nombreCompleto, value: element.id })
                        }

                        // Se setea el valor al array para mostrarlo en el select
                        setListaInteresados(dataInteresados);
                    } else {

                        // Se setea en true la respuesta
                        setRespuestaProcesoSirius(false);

                        // Se setea el valor del mensaje para mostrar
                        setModalState({ title: "DADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: datos.mensaje, show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de validar el maximo de caracteres por input
    const cargarActuaciones = (idProcesoDisciplinario) => {

        try {
            // Buscamos los interesados
            GenericApi.getAllGeneric("actuaciones/get-actuaciones-proceso-disciplinario-auto/" + idProcesoDisciplinario).then(

                // Se captura la respuesta en variable
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {
                        // Se setea el valor al array para mostrarlo en el select
                        setListaActuaciones(datos.data)
                    } else {
                        // Se setea el valor del mensaje para mostrar
                        setModalState({ title: "DADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: datos.mensaje, show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de validar que no se ingresen caracteres invalidos
    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    // Metodo encargado de setear el valor del parametro
    const changeNumeroProcesoSinproc = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccentGuion.test(e.target.value) && 
        e.target.value.length <= 50)) {
            setNumeroProcesoSinproc(e.target.value);
        }
    }

    // Metodo encargado de setear el valor del parametro
    const changeNumeroRadicadoSirius = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccentGuion.test(e.target.value) && 
        e.target.value.length <= 50)) {
            setNumeroRadicadoSirius(e.target.value);    
        }
    }

    // Metodo encargado de setear el valor del estado
    const selectChangeInteresado = (v) => {

        // Se carga el tipo de estado en el array del select
        setInteresadoSeleccionado(v);

        // Se busca el valor dentro del array para setear los valores
        const idInteresado = v.value;

        // Se recorre el array
        for (let index = 0; index < getInteresadoCompleta.length; index++) {

            // Se capturan los elementos
            const element = getInteresadoCompleta[index];

            // Se captura la informacion donde coincida con el id
            if (element.id === idInteresado) {

                let tipoDocumentoNombre = element.attributes.tipo_documento == "1" ? "Cédula de Ciudadanía" :
                    element.attributes.tipo_documento == "2" ? "Cédula de Extranjería" :
                        element.attributes.tipo_documento == "3" ? "Pasaporte" : "No informa";
                let tipoDocumentoNumero = element.attributes.tipo_documento;

                // Se setean los valores
                setTipoDocumentoNumero(tipoDocumentoNumero);
                setTipoDocumento(tipoDocumentoNombre);
                setNumeroDocumento(element.attributes.numero_documento);
                setPrimerNombre(element.attributes.primer_nombre);
                setSegundoNombre(element.attributes.segundo_nombre);
                setPrimerApellido(element.attributes.primer_apellido);
                setSegundoApellido(element.attributes.segundo_apellido);
                setDepartamentoResidencia(element.attributes.nombre_departamento);
                setCiudadResidencia(element.attributes.nombre_ciudad);
                setDireccionResidencia(element.attributes.direccion);
                setCorreo(element.attributes.email);
                setCelular(element.attributes.telefono_celular);
                setAutorizaCorreos(element.attributes.autorizar_envio_correo);
            }
        }
    }

    // Metodo encargado de setear el detalle de la notificacion
    const changeDetalleNotificacion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 4000)) {
            setDetalleNotificacion(e.target.value);
            setCountTextDetalle(e.target.value.length);  
        }
    }

    // Metodo encargado de setear el valor del estado
    const selectChangeActuacion = (v) => {
        setActuacionSeleccionada(v);        
    }

    // Metodo encargado de formatear en bytes y sacar el peso del archivo adjunto
    function formatBytes(bytes, decimals = 3) {
        if (bytes === undefined) return '0 Bytes';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Metodo encargado de adjuntar el documento
    const handleInputChangeArchivos = (e, index) => {

        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);

            if (extension == "pdf") {

                const list = [...inputListArchivos];
                list[index][name] = files[0];

                if (files[0]) {
                    list[index][name] = files[0];
                } else {
                    list[index][name] = '';
                    list[index].filebase64 = '';
                    list[index].size = 0;
                    list[index].ext = "";
                    setInputListArchivos(list);
                }

                // Conversion a Base64
                Array.from(e.target.files).forEach(archivo => {
                    var reader = new FileReader();
                    reader.readAsDataURL(archivo);
                    reader.onload = function () {
                        var arrayAuxiliar = [];
                        var base64 = reader.result;
                        arrayAuxiliar = base64.split(',');
                        list[index].filebase64 = arrayAuxiliar[1];
                        list[index].ext = extension;
                        setInputListArchivos(list);
                    }
                })
                obtenerPesoTotalArchivos(list);
            } else {
                const list = [...inputListArchivos];
                list[index][name] = files[0];
                list[index].filebase64 = '';
                list[index].size = 0;
                list[index][name] = '';
                setInputListArchivos(list);
                setErrorApi("El archivo seleccionado no tiene un formato permitido. Debe ser .pdf")
                window.showModal(1)
            }
        } else {
            const list = [...inputListArchivos];
            list[index][name] = '';
            list[index].filebase64 = '';
            list[index].size = 0;
            setInputListArchivos(list);
            obtenerPesoTotalArchivos(list);
        }

    }

    // Metodo encargado de sacar la extension del archivo
    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    // Metodo encargado de obtener el peso del archivo en MB
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
            setErrorApi('El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro, verifique e tamaño y elimine algunos adjuntos.')
            window.showModal(1)
        }

        setPesoTotalArchivos(peso);
    }

    // Metodo encargado de buscar el radicado
    const adjuntarNumeroProcesoSinproc = () => {

        // Se usa el cargando
        window.showSpinner(true);

        setInteresadoSeleccionado([]);

        // Se captura el valor
        const numeroProcesoSinproc = getNumeroProcesoSinproc;
        const vigencia = getVigencias;

        // Se valida que haya un numero de proceso
        if (numeroProcesoSinproc.length <= 0) {

            // Se setea el valor
            setMensajeErrorNumeroProcesoSirius('El número del proceso Sirius debe ser mayor a 0.');

            // Se quita el cargando
            window.showSpinner(false);

            // Se retorna
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorNumeroProcesoSirius('');
        }

        // Se valida que haya un numero de proceso
        if (vigencia.length <= 0) {

            // Se setea el valor
            setMensajeErrorVigenciaSirius('Debé seleccionar una vigencia.');

            // Se quita el cargando
            window.showSpinner(false);

            // Se retorna
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorVigenciaSirius('');
        }

        // Se valida que sea un numero de radicado valido
        const data = {
            "data": {
                "type": "proceso_sinproc",
                "attributes": {
                    "radicado": numeroProcesoSinproc,
                    "id_origen_radicado": 3,
                    "id_tipo_proceso": 0,
                    "vigencia": vigencia,
                }
            }
        }

        // Se consume la API para validar que exista el proceso sinproc
        GenericApi.getByDataGeneric("proceso-diciplinario/validar-sinproc-portal-web", data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea en true la respuesta
                    setRespuestaProcesoSirius(true);

                    // Se setea el valor del mensaje para mostrar
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Consulta exitosa', show: true, alert: global.Constants.TIPO_ALERTA.EXITO });

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se consulta despues de 3 segundos
                    setTimeout(() => {

                        // Se cargan la lista de los interesados
                        cargarInteresados(numeroProcesoSinproc);
                        cargarActuaciones(datos.data.attributes[0].uuid)

                    }, 1000);
                } else {

                    // Se setea en true la respuesta
                    setRespuestaProcesoSirius(false);

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se setea el valor del mensaje para mostrar
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de buscar el radicado
    const adjuntarRadicadoSirius = () => {

        // Se captura el valor
        const numeroRadicadoSirius = getNumeroRadicadoSirius;

        // Se valida que haya un numero de proceso
        if (numeroRadicadoSirius.length <= 0) {

            // Se setea el valor
            setMensajeErrorNumeroRadicadoSirius('El número del radicado Sirius debe ser mayor a 0.');

            // Se retorna
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorNumeroProcesoSirius('');
        }

        // Se inicializa la variable
        let arrayValidar = [];

        // Se usa el cargando
        window.showSpinner(true);

        // Se consume la API para validar que exista el proceso sinproc
        DocumentoSiriusApi.getDocumentacionSiriusByRadicadoSiriusPortal(numeroRadicadoSirius).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se setea el valor del mensaje para mostrar
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: 'Consulta exitosa', show: true, alert: global.Constants.TIPO_ALERTA.EXITO });

                    // Se captura la informacion de array
                    const datosDocumentosSirius = datos.documentoDTOList;

                    // Se valida cuando hay un solo documento y es final
                    if (datosDocumentosSirius.length > 0) {

                        // Se recorre el array
                        for (let index = 0; index < datos.documentoDTOList.length; index++) {

                            // Se captura la informacion
                            const element = datos.documentoDTOList[index];
                            const tipoPadreAdjunto = element.tipoPadreAdjunto;

                            // Se valida cuando el documento pdf es 
                            if (tipoPadreAdjunto == "Principal") {

                                // Se setea el valor en el array
                                arrayValidar.push(element);

                                // Se setea el documento en el input
                                setNombreDocumento(element.nombreDocumento);
                                setValueDocumento(element.nombreDocumento);
                                setEncontroDocumentoValido(true);

                                // Se sale del ciclo
                                break;
                            }
                        }

                        // Se setea el valor en el array
                        setArrayInformacion(arrayValidar);
                    } else {

                        // Se setea el valor del mensaje para mostrar
                        setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: "El número de radicado SIRIUS no tiene un documento principal.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                } else {

                    // Se setea el valor de la lista de documentos
                    setSoporteRadicadoLista(datos);

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se setea el valor del mensaje para mostrar
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de setear el valor de la vigencia
    const handleInputChangeVigencia = (event) => {

        // Se captura la informacion
        const value = event.target.value;

        // Se setea el valor
        setVigencias(value);
    }

    // Metodo encargado de consultar las vigencias
    const getApiVigencia = () => {

        // Se consume la API
        GenericApi.getGeneric("vigencia?estado=1").then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea en true
                    setRespuestaVigencias(true);

                    // Se setean los valores de las fechas
                    setFechasVigencias(datos.data);
                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES", message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }

        )
    }

    // Metodo encargado de listar las vigencias
    const selectVigencias = () => {

        // Se retorna el valor final
        return (

            // Se mapea el array
            getFechasVigencias.map((vigencia, i) => {

                // Se construye cada select y se retorna
                return (
                    <option key={vigencia.id} value={vigencia.vigencia}>{vigencia.attributes.vigencia}</option>
                )
            })
        );
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    getNumeroProcesoSinproc: '',
                }}
                enableReinitialize
                validate={(valores) => {

                }}
                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                }}
            >
                {({ errors }) => (
                    <Form>
                        <div className="block block-rounded block-bordered">
                            <div className="block block-themed">
                                <div className="col-md-12">
                                    <div className="w2d_block let">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-alt push">
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/PortalNotificaciones`}> <small>Portal Web - Notificaciones</small></Link></li>
                                                <li className="breadcrumb-item"> <small>Registrar notificaciones</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: PORTAL WEB :: NOTIFICACIONES</h3>
                                </div>
                                <div className="block-content">

                                    <div className='text-right '>
                                        <Link to={"/PortalNotificaciones"} title='Regresar a lista' >
                                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="numeroProcesoSinproc">NÚMERO DE PROCESO SINPROC<span className="text-danger">*</span></label>
                                                <Field as="input" type="number" className="form-control" id="numeroProcesoSinproc" name="numeroProcesoSinproc" value={getNumeroProcesoSinproc} onChange={changeNumeroProcesoSinproc} autocomplete="off"></Field>
                                                {getMensajeErrorNumeroProcesoSirius ?
                                                    <span className="text-danger">{getMensajeErrorNumeroProcesoSirius}</span>
                                                    : null}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="vigenciaSinproc">VIGENCIA <span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="vigenciaSinproc" name="vigenciaSinproc" value={getVigencias} onChange={handleInputChangeVigencia}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRespuestaVigencias ? selectVigencias() : null}
                                                </Field>
                                                {getMensajeErrorVigenciaSirius ?
                                                    <span className="text-danger">{getMensajeErrorVigenciaSirius}</span>
                                                    : null}
                                            </div>

                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group" style={{ marginTop: '28px' }}>
                                                <button type='button' title='Buscar' className='btn btn-rounded btn-primary' onClick={() => adjuntarNumeroProcesoSinproc()}>
                                                   {global.Constants.BOTON_NOMBRE.BUSCAR}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                {(getListaInteresados && getListaInteresados.length > 0) ?
                                                    <label htmlFor="etapa">INTERESADOS <span className="text-danger">*</span></label>
                                                    : null}
                                                {(getListaInteresados && getListaInteresados.length > 0) ?
                                                    <Select
                                                        id='etapa'
                                                        name='etapa'
                                                        value={getInteresadoSeleccionado}
                                                        placeholder="Seleccionar"
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListaInteresados.map(e =>
                                                            ({ label: e.label, value: e.value }))}
                                                        onChange={(e) => selectChangeInteresado(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorInteresado ?
                                                    <span className="text-danger">{getMensajeErrorInteresado}</span>
                                                    : null}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                {(getListaActuaciones && getListaActuaciones.length > 0) ?
                                                    <label htmlFor="etapa">ACTUACIONES - NÚMERO AUTO <span className="text-danger">*</span></label>
                                                    : null}
                                                {(getListaActuaciones && getListaActuaciones.length > 0) ?
                                                    <Select
                                                        id='actuaciones'
                                                        name='actuaciones'
                                                        value={getActuacionSeleccionada}
                                                        placeholder="Seleccionar"
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListaActuaciones.map(e =>
                                                            ({ label: (e.attributes.auto + " - " + e.attributes.nombre_actuacion + " - " + e.attributes.fecha_actualizacion), value: e.attributes.id_actuacion }))}
                                                        onChange={(e) => selectChangeActuacion(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorInteresado ?
                                                    <span className="text-danger">{getMensajeErrorInteresado}</span>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '18px' }}><b>DATOS DEL INTERESADO SELECCIONADO</b></p>

                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="tipoDocumento">TIPO DE DOCUMENTO</label>
                                                <input type="text" className="form-control" id="tipoDocumento" name="tipoDocumento" value={getTipoDocumento} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="numeroDocumento">NÚMERO DE DOCUMENTO</label>
                                                <input type="text" className="form-control" id="numeroDocumento" name="numeroDocumento" value={getNumeroDocumento} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="primerNombre">PRIMER NOMBRE</label>
                                                <input type="text" className="form-control" id="primerNombre" name="primerNombre" value={getPrimerNombre} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="segundoNombre">SEGUNDO NOMBRE</label>
                                                <input type="text" className="form-control" id="segundoNombre" name="segundoNombre" value={getSegundoNombre} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="primerApellido">PRIMER APELLIDO</label>
                                                <input type="text" className="form-control" id="primerApellido" name="primerApellido" value={getPrimerApellido} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="segundoApellido">SEGUNDO APELLIDO</label>
                                                <input type="text" className="form-control" id="segundoApellido" name="segundoApellido" value={getSegundoApellido} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="departamentoResidencia">DEPARTAMENTO DE RESIDENCIA</label>
                                                <input type="text" className="form-control" id="departamentoResidencia" name="departamentoResidencia" value={getDepartamentoResidencia} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="ciudadResidencia">CIUDAD DE RESIDENCIA</label>
                                                <input type="text" className="form-control" id="ciudadResidencia" name="ciudadResidencia" value={getCiudadResidencia} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="direccionResidencia">DIRECCIÓN DE RESIDENCIA</label>
                                                <input type="text" className="form-control" id="direccionResidencia" name="direccionResidencia" value={getDireccionResidencia} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="correo">CORREO</label>
                                                <input type="text" className="form-control" id="correo" name="correo" value={getCorreo} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="telefonoCelular">TELÉFONO CELULAR</label>
                                                <input type="text" className="form-control" id="telefonoCelular" name="telefonoCelular" value={getCelular} disabled />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="autorizaCorreo">¿AUTORIZA ENVÍO DE CORREO ELECTRÓNICO?</label>
                                                <input type="text" className="form-control" id="autorizaCorreo" name="autorizaCorreo" value={getAutorizaCorreos} disabled />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row' style={{ display: 'block' }} >
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="detalleNotificacion">DETALLE DE NOTIFICACIÓN<span className="text-danger">*</span></label>
                                                <Field as="textarea" className="form-control" id="detalleNotificacion" rows="3" name="detalleNotificacion" placeholder="Describa el detalle...." value={getDetalleNotificacion} onChange={changeDetalleNotificacion}></Field>

                                                <div className="text-right">
                                                    <span className="text-primary">{getCountTextDetalle} / {getMaximoTextArea}</span>
                                                </div>
                                                {getMensajeErrorDetalleNotificacion ?
                                                    <span className="text-danger">{getMensajeErrorDetalleNotificacion}</span>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="numeroRadicadoSirius">NÚMERO DE RADICADO SIRIUS <span className="text-danger">*</span></label>
                                                <Field as="input"
                                                    type="text"
                                                    className="form-control"
                                                    id="numeroRadicadoSirius"
                                                    name="numeroRadicadoSirius"
                                                    value={getNumeroRadicadoSirius}
                                                    onChange={changeNumeroRadicadoSirius}
                                                    autocomplete="off"></Field>
                                                {getMensajeErrorNumeroRadicadoSirius ?
                                                    <span className="text-danger">{getMensajeErrorNumeroRadicadoSirius}</span>
                                                    : null}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group" style={{ marginTop: '28px' }}>
                                                <button type='button' title='Radicado SIRIUS' className='btn btn-rounded btn-primary' onClick={() => adjuntarRadicadoSirius()}>
                                                    ADJUNTAR RADICADO SIRIUS
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="alert alert-success" role="alert">
                                                <p className="mb-0">Tenga en cuenta que para consular y validar el radicado se debe digitar con el mismo formato generado por SIRIUS:</p>
                                                <p className="mb-0"> * 15 caracteres.</p>
                                                <p className="mb-0"> * Incluir los dos (2) guiones "-".</p>
                                                <p className="mb-0">Ej: 2020-EE-0000002, 2020-ER-0000123</p>
                                            </div>
                                        </div>
                                    </div>


                                    {getEncontroDocumentoValido ?
                                        <div className='row'>
                                            <div className="col-md-6">
                                                <label>DOCUMENTO ADJUNTO .pdf</label>
                                                <div className='row'>
                                                    <div className='col-md-10'>
                                                        <input className="form-control" data-toggle="custom-file-input" type="text" name="archivo" disabled value={getValueDocumento} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                </div>
                            </div>

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary" >
                                    {global.Constants.BOTON_NOMBRE.REGISTRAR}
                                </button>
                                <Link to={'/PortalNotificaciones'} className="font-size-h5 font-w600" >
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

export default PortalNotificacionesForm;