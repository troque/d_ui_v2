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

export default function TipoExpedienteMensajesForm() {

    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [countTextArea, setCountTextArea] = useState(0);
    const [getRepuestaMensajeTipoExpedienten, setRepuestaMensajeTipoExpedienten] = useState(false);
    

    // Constantes para cargar los valores
    const [getMensajeTipoExpediente, setMensajeTipoExpediente] = useState("");
    const [getValueTipoExpediente, setArrayTipoExpediente] = useState([]);
    const [getTipoExpediente, setTipoExpediente] = useState([]);

    // Constantes para los subtipos del expediente
    const [getHabilitarSubTipoExpediente, setHabilitarSubTipoExpediente] = useState(null);

    const [getValueSubTipoExpediente, setArraySubTipoExpediente] = useState([]);
    const [getSubTipoExpediente, setSubTipoExpediente] = useState([]);
    const [getArrayEstados, setArrayEstados] = useState([]);

    const [getMensajeErrorTipoExpediente, setMensajeErrorTipoExpediente] = useState("");
    const [getMensajeErrorSubTipoExpediente, setMensajeErrorSubTipoExpediente] = useState("");
    const [getMensajeErrorEstado, setMensajeErrorEstado] = useState("");

    const [getTipoExpedienteNombre, setTipoExpedienteNombre] = useState("");
    const [getTipoSubExpedienteNombre, setTipoSubExpedienteNombre] = useState("");

    const getListaEstados =
        [
            { value: '1', label: 'ACTIVO' },
            { value: '0', label: 'INACTIVO' }
        ];

    const location = useLocation();
    const { from } = location.state;

    useEffect(() => {
        async function fetchData() {
            console.log("Daticos", from)
            // Se habilita el cargando
            window.showSpinner(true);

            // Se carga la api de parametros permitidos
            obtenerParametros();

            if (from != null) {

                setTipoExpedienteNombre(from.attributes.tipo_expediente.nombre)
                setTipoSubExpedienteNombre(from.attributes.id_sub_tipo_expediente)

                // Se carga el mensaje y la longitud del mensaje
                setMensajeTipoExpediente(from.attributes.mensaje);

                if(from.attributes.mensaje){
                    setRepuestaMensajeTipoExpedienten(true)
                }

                setCountTextArea(from.attributes.mensaje.length);

                // Se carga el tipo de expediente
                cargarTiposExpedientes();
                setArrayTipoExpediente({ label: from.attributes.tipo_expediente.nombre, value: from.attributes.tipo_expediente.id });

                // Se valida que el tipo de expediente este dentro de los que llevan sub tipo de expediente
                const arrayValidarTipoExpedientes = [1, 3, 4];
                const valorValidar = parseInt(from.attributes.tipo_expediente.id);

                // Se valida que exista dentro del que lleva sub tipo de expediente
                if (arrayValidarTipoExpedientes.includes(valorValidar)) {

                    // Se habilita el sub tipo de expediente
                    setHabilitarSubTipoExpediente(true);

                    // Se carga cuando es Derecho de peticion
                    if (valorValidar == 1) {

                        // Se cargan los datos del derecho de peticion
                        getApiTipoDerechoPeticion();

                        // Se carga el sub tipo de expediente
                        if (from.attributes.id_sub_tipo_expediente == "Copias") {
                            setArraySubTipoExpediente({ label: from.attributes.id_sub_tipo_expediente, value: 1 })
                        } else if (from.attributes.id_sub_tipo_expediente == "General") {
                            setArraySubTipoExpediente({ label: from.attributes.id_sub_tipo_expediente, value: 2 })
                        } else if (from.attributes.id_sub_tipo_expediente == "Alerta control político") {
                            setArraySubTipoExpediente({ label: from.attributes.id_sub_tipo_expediente, value: 3 })
                        }
                    }

                    // Se carga cuando es Tipo Queja
                    else if (valorValidar == 3) {

                        // Se cargan los datos de tipo queja
                        getApiTipoQueja();

                        // Se carga el sub tipo de expediente
                        if (from.attributes.id_sub_tipo_expediente == "Externa") {
                            setArraySubTipoExpediente({ label: from.attributes.id_sub_tipo_expediente, value: 1 })
                        } else if (from.attributes.id_sub_tipo_expediente == "Interna") {
                            setArraySubTipoExpediente({ label: from.attributes.id_sub_tipo_expediente, value: 2 })
                        }
                    }

                    // Se carga cuando es Tutela
                    else if (valorValidar == 4) {

                        // Se cargan los datos de tipo queja
                        getApiTipoTutela();

                        // Se carga el sub tipo de expediente
                        if (from.attributes.id_sub_tipo_expediente == "días") {
                            setArraySubTipoExpediente({ label: from.attributes.id_sub_tipo_expediente, value: 1 })
                        } else if (from.attributes.id_sub_tipo_expediente == "horas") {
                            setArraySubTipoExpediente({ label: from.attributes.id_sub_tipo_expediente, value: 2 })
                        }
                    }
                }

                // Se carga el estado
                if (from.attributes.estado == 1) {
                    setArrayEstados({ label: 'ACTIVO', value: from.attributes.estado });
                } else {
                    setArrayEstados({ label: 'INACTIVO', value: from.attributes.estado });
                }

                // Se deshabilita el cargando
                window.showSpinner(false);
            } else {

                // Se carga los tipos de expediente por mensajes
                cargarTipoExpedienteMensajes();
            }
        }
        fetchData();
    }, []);

    const cargarTiposExpedientes = () => {

        // Se inicializa el trycatch en caso de error de la api
        try {

            // Se inicializa el array general
            var arrayGeneral = [];

            // Buscamos los valores del array de los tipos de expedientes
            GenericApi.getGeneric("mas-tipo-expediente").then(
                datos => {

                    // Se valida que no haya ningun error
                    if (!datos.error) {

                        // Se valida que el array tenga mas de 0 elementos
                        if (datos["data"].length > 0) {

                            // Se recorre el array de los tipo de expediente
                            for (let index = 0; index < datos.data.length; index++) {

                                // Se captura el valor por posicion
                                const element = datos.data[index];

                                // Se añade al array general
                                arrayGeneral.push({ label: element.attributes.nombre, value: element.id })
                            }

                            // Se añade el array general al array de los tipos de expedientes
                            setTipoExpediente(arrayGeneral);
                        }
                    } else {
                        setModalState({ title: "Tipo expedientes", message: datos.error.toString(), show: true, redirect: '/TipoExpedientesMensajes', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de traer los tipos de derecho de peticion
    const getApiTipoDerechoPeticion = () => {
        GenericApi.getGeneric("lista-tipo-derecho-peticion/" + 1).then(
            datos => {

                // Se valida que no haya error en la API
                if (!datos.error) {

                    // Se inicializa las variables
                    let arrayGeneral = [];
                    let datosArray = datos.data;

                    // Se recorre el array de los sub tipo de expediente derecho de peticion
                    for (let index = 0; index < datosArray.length; index++) {

                        // Se captura el valor por posicion
                        const element = datosArray[index];

                        // Se añade al array general
                        arrayGeneral.push({ label: element.attributes.nombre, value: element.id })
                    }

                    // Se añade el array general al array de los tipos de expedientes
                    setSubTipoExpediente(arrayGeneral);

                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: datos.error.toString(), show: true, redirect: '/TipoExpedienteMensajes', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de traer los tipos de queja
    const getApiTipoQueja = () => {
        GenericApi.getGeneric("lista-tipo-queja").then(
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se inicializa las variables
                    let arrayGeneral = [];
                    let datosArray = datos.data;

                    // Se recorre el array de los sub tipo de expediente derecho de peticion
                    for (let index = 0; index < datosArray.length; index++) {

                        // Se captura el valor por posicion
                        const element = datosArray[index];

                        // Se añade al array general
                        arrayGeneral.push({ label: element.attributes.nombre, value: element.id })
                    }

                    // Se añade el array general al array de los tipos de expedientes
                    setSubTipoExpediente(arrayGeneral);
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de traer los tipos de tutela
    const getApiTipoTutela = () => {
        GenericApi.getGeneric("lista-terminos-respuesta/" + 1).then(
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se inicializa las variables
                    let arrayGeneral = [];
                    let datosArray = datos.data;

                    // Se recorre el array de los sub tipo de expediente derecho de peticion
                    for (let index = 0; index < datosArray.length; index++) {

                        // Se captura el valor por posicion
                        const element = datosArray[index];

                        // Se añade al array general
                        arrayGeneral.push({ label: element.attributes.nombre, value: element.id })
                    }

                    // Se añade el array general al array de los tipos de expedientes
                    setSubTipoExpediente(arrayGeneral);
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: datos.error.toString(), show: true, redirect: '/ClasificacionRadicadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const cargarTipoExpedienteMensajes = () => {

        // Se deshabilita el cargando
        window.showSpinner(false);

        // Se carga el metodo para cargar los tipos de expediente
        cargarTiposExpedientes();
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
                        setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const enviarDatos = (valores) => {

        // Se inicializa el array
        let data;

        // Se valida que se haya seleccionado un tipo de expediente
        if (!getValueTipoExpediente.value) {

            // Se redeclara el mensaje
            setMensajeErrorTipoExpediente(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);
            return false;
        } else if (getValueTipoExpediente.value) {

            // Se redeclara el mensaje en null
            setMensajeErrorTipoExpediente(null);

            // Se inicializa el array
            const arrayTiposExpedienteValidos = [1, 3, 4];
            const numeroValidar = parseInt(getValueTipoExpediente.value);

            // Se valida que este dentro de los que llevan sub tipo de expediente
            if (arrayTiposExpedienteValidos.includes(numeroValidar)) {

                // Se valida que se haya seleccionado un sub tipo de expediente
                if (getValueSubTipoExpediente.value) {

                    // Se redeclara el mensaje
                    setMensajeErrorSubTipoExpediente(null);

                    // Se valida que se haya seleccionado el estado
                    if (getArrayEstados.value) {

                        // Se redeclara el mensaje
                        setMensajeErrorEstado(null);

                        // Se inicializa el array a enviar por post
                        data = {
                            "data": {
                                "type": "mas_tipo_expediente_mensajes",
                                "attributes": {
                                    "mensaje": getMensajeTipoExpediente,
                                    "id_tipo_expediente": getValueTipoExpediente.value,
                                    "id_sub_tipo_expediente": getValueSubTipoExpediente.value,
                                    "tipo_expediente_nombre": getTipoExpedienteNombre,
                                    "sub_tipo_expediente_nombre": getTipoSubExpedienteNombre,
                                    "estado": getArrayEstados.value
                                }
                            }
                        }

                    } else {

                        // Se redeclara el mensaje
                        setMensajeErrorEstado(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);
                        return false;
                    }
                } else {

                    // Se redeclara el mensaje del sub tipo de expediente
                    setMensajeErrorSubTipoExpediente(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);
                    return false;
                }
            } else {

                // Se valida que se haya seleccionado el estado
                if (getArrayEstados.value) {

                    // Se redeclara el mensaje
                    setMensajeErrorEstado(null);

                    // Se inicializa el array a enviar por post
                    data = {
                        "data": {
                            "type": "mas_tipo_expediente_mensajes",
                            "attributes": {
                                "mensaje": getMensajeTipoExpediente,
                                "id_tipo_expediente": getValueTipoExpediente.value,
                                "tipo_expediente_nombre": getTipoExpedienteNombre,
                                "estado": getArrayEstados.value
                            }
                        }
                    }

                } else {

                    // Se redeclara el mensaje
                    setMensajeErrorEstado(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);
                    return false;
                }
            }
        }

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa la API
        GenericApi.addGeneric('mas_tipo_expediente_mensajes', data).then(
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/TipoExpedienteMensajes', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    const actualizarDatos = (valores) => {

        // Se inicializa el valor del id
        const id = from.id;

        // Se inicializa el array
        let data;

        // Se inicializa el array a enviar por post
        data = {
            "data": {
                "type": "mas_tipo_expediente_mensajes",
                "attributes": {
                    "mensaje": getMensajeTipoExpediente,
                    "id_tipo_expediente": getValueTipoExpediente.value,
                    "id_sub_tipo_expediente": getValueSubTipoExpediente.value,
                    "tipo_expediente_nombre": getTipoExpedienteNombre,
                    "sub_tipo_expediente_nombre": getTipoSubExpedienteNombre,
                    "estado": getArrayEstados.value
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        GenericApi.updateGeneric('mas_tipo_expediente_mensajes', id, data).then(
            datos => {

                // Se deshabilita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/TipoExpedienteMensajes', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    const changeMensajeTipoExpediente = (e) => {
        if (
                e.target.value === '' || 
                (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && e.target.value.length <= 4000)
            ) 
        {
            setMensajeTipoExpediente(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaMensajeTipoExpedienten(true);
        }
    }

    const selectChangeTipoExpediente = (v) => {
        setArraySubTipoExpediente([])
        setTipoExpedienteNombre(v.label)
        console.log(v.value)
        // Se valida en accion deberia tomar en caso que tenga from y solo se actualize o no tenga y se tenga que crear
        if (from == null) {

            // Se carga el tipo de expediente en el array del select
            setArrayTipoExpediente(v);

            // Se carga el sub tipo de expediente dependendiendo del tipo de expediente
            if (v.value == "1") { // Derecho de peticion

                // Se cargan los datos del derecho de peticion
                getApiTipoDerechoPeticion();

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(true);
            } else if (v.value == "2") { // Poder referente

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(null);
            } else if (v.value == "3") { // Queja

                // Se cargan los datos del tipo de queja
                getApiTipoQueja();

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(true);
            } else if (v.value == "4") { // Tutela

                // Se cargan los datos del tipo de tutela
                getApiTipoTutela();

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(true);
            }
            else if (v.value == "5") {  // Proceso Disciplinario
                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(null);
            }
        } else if (v != null) {

            // Se carga el tipo de expediente en el array del select
            setArrayTipoExpediente(v);

            // Se carga el sub tipo de expediente dependendiendo del tipo de expediente
            if (v.value == "1") { // Derecho de peticion

                // Se cargan los datos del derecho de peticion
                getApiTipoDerechoPeticion();

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(true);
            } else if (v.value == "2") { // Poder referente

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(null);
            } else if (v.value == "3") { // Queja

                // Se cargan los datos del tipo de queja
                getApiTipoQueja();

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(true);
            } else if (v.value == "4") { // Tutela

                // Se cargan los datos del tipo de tutela
                getApiTipoTutela();

                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(true);
            }
            else if (v.value == "5") { // Proceso Disciplinario
                // Se habilita que se muestre el select del subtipo
                setHabilitarSubTipoExpediente(null);
            }
        } else {
            // setErrorEtapa('Campo requerido');
        }
    }

    const selectChangeSubTipoExpediente = (v) => {

        // Se carga el tipo de expediente en el array del select
        setArraySubTipoExpediente(v);        
        setTipoSubExpedienteNombre(v.label)
    }

    const selectChangeEstados = (v) => {

        // Se carga el tipo de estado en el array del select
        setArrayEstados(v);
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

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    mensaje: '',
                }}
                enableReinitialize
                validate={(valores) => {

                    // Se inicializa el array
                    let errores = {};

                    if(getRepuestaMensajeTipoExpedienten == false){
                        errores.mensaje = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    if (from != null) {

                        // Se valida que tenga valores
                        if (!getMensajeTipoExpediente) {
                            errores.mensaje = global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION;
                        }

                        // Se valida que tenga el minimo de caracteres ingresados
                        else if (getMensajeTipoExpediente.length <= getMinimoTextArea) {
                            errores.mensaje = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres';
                        }

                        // Se valida que exista
                        if (getMensajeTipoExpediente) {

                            // Se valida que contenga caracteres invalidos
                            if (containsSpecialChars(getMensajeTipoExpediente)) {
                                errores.mensaje = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                            }
                        }

                    } else {

                        // Se valida que tenga el minimo de caracteres ingresados
                        if (countTextArea > getMaximoTextArea) {
                            errores.mensaje = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                        }
                        else if (countTextArea <= getMinimoTextArea) {
                            errores.mensaje = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres';
                        }

                        // Se valida que exista
                        if (valores.mensaje) {

                            // Se valida que contenga caracteres invalidos
                            if (containsSpecialChars(valores.mensaje)) {
                                errores.mensaje = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                            }
                        }
                    }

                    // Se retorna los errores
                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {

                    if (from != null) {
                        actualizarDatos(valores);
                    } else {
                        enviarDatos(valores);
                    }
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="block block-rounded">
                            <div className="block block-themed">
                                <div className="col-md-12">
                                    <div className="block-content">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-alt push">
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/TipoExpedienteMensajes`}> <small>Lista de mensajes</small></Link></li>
                                                <li className="breadcrumb-item"> <small>{from != null ? 'Actualizar' : 'Crear'} configuración de mensajes por tipo de expediente</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: CONFIGURACIÓN DE MENSAJES EN TIPOS DE EXPEDIENTE</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row">

                                        <div className="col-md-12">
                                            <div className="form-group">
                                                {/* <i className="fa fa-check text-success fa-2x mr-3"></i> */}
                                                <label htmlFor="mensaje">DESCRIPCIÓN DEL MENSAJE</label>
                                                <Field as="textarea"
                                                    className="form-control mt-2"
                                                    id="mensaje"
                                                    name="mensaje"
                                                    rows="6"
                                                    placeholder="Información para su solicitud...."
                                                    maxLength={getMaximoTextArea}
                                                    minLength={getMinimoTextArea}
                                                    value={getMensajeTipoExpediente}
                                                    onChange={changeMensajeTipoExpediente}
                                                ></Field>
                                                <div className="text-right">
                                                    <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                </div>
                                                <ErrorMessage name="mensaje" component={() => (<span className="text-danger">{errors.mensaje}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group text-uppercase">
                                                <label htmlFor="tipo_expediente">TIPO DE EXPEDIENTE<span className="text-danger">*</span></label>
                                                {(getValueTipoExpediente) ?
                                                    <Select
                                                        id='tipo_expediente'
                                                        name='tipo_expediente'
                                                        isMulti={false}
                                                        value={getValueTipoExpediente}
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getTipoExpediente.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeTipoExpediente(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorTipoExpediente ?
                                                    <span className="text-danger">{getMensajeErrorTipoExpediente}</span>
                                                    : null}
                                            </div>
                                        </div>

                                        {getHabilitarSubTipoExpediente != null
                                            ?
                                            <div className="col-md-3">
                                                <div className="form-group text-uppercase">
                                                    <label htmlFor="sub_tipo_expediente">SUB TIPO DE EXPEDIENTE<span className="text-danger">*</span></label>
                                                    {(getValueSubTipoExpediente) ?
                                                        <Select
                                                            id='sub_tipo_expediente'
                                                            name='sub_tipo_expediente'
                                                            isMulti={false}
                                                            value={getValueSubTipoExpediente}
                                                            placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                            noOptionsMessage={() => "Sin datos"}
                                                            options={getSubTipoExpediente.map(e =>
                                                                ({ label: e.label, value: e.value })
                                                            )}
                                                            onChange={(e) => selectChangeSubTipoExpediente(e)}
                                                        />
                                                        : null}
                                                    {getMensajeErrorSubTipoExpediente ?
                                                        <span className="text-danger">{getMensajeErrorSubTipoExpediente}</span>
                                                        : null}
                                                </div>
                                            </div>
                                            : null}

                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="estado">ESTADO <span className="text-danger">*</span></label>
                                                {(getArrayEstados) ?
                                                    <Select
                                                        id='estado'
                                                        name='estado'
                                                        isMulti={false}
                                                        value={getArrayEstados}
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListaEstados.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeEstados(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorEstado ?
                                                    <span className="text-danger">{getMensajeErrorEstado}</span>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary" >
                                    {from != null ? global.Constants.BOTON_NOMBRE.ACTUALIZAR : global.Constants.BOTON_NOMBRE.REGISTRAR}
                                </button>
                                <Link to={'/TipoExpedienteMensajes'} className="font-size-h5 font-w600" >
                                    <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

