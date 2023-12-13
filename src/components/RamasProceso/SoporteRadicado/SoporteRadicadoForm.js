import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import InfoExitoApi from '../../Utils/InfoExitoApi';
import { Link } from "react-router-dom";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import { Navigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import { getUser } from '../../../components/Utils/Common';
import ParametrosMasApi from '../../Api/Services/ParametrosMasApi';
import InfoExitoApiTextsCustom from '../../Utils/InfoExitoApiTextsCustom';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';

function SoporteRadicadoForm() {

    const [errorApi, setErrorApi] = useState('');
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;

    let id_etapa = from.id_etapa;
    let id_fase = from.id_fase;
    let es_soporte = from.es_soporte;
    const [getHabilitarBoton, setHabilitarBoton] = useState(false);

    const { control, fileInput, handleSubmit } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'folios',
    });

    const [isRedirect, setIsRedirect] = useState(false);
    const [getErrorRedirect, setErrorRedirect] = useState(false);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [getFormatosApi, setFormatosApi] = useState();
    const [getFaseApi, setFaseApi] = useState({ attributes: null });
    const [exitoApiTextsCustom, setExitoApiTextsCustom] = useState({ titulo: null, cuerpo: null, boton: null });
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0);
    const [getListNombresArchivos, setListNombresArchivos] = useState({ attributes: null });

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getDescripcion, setDescripcion] = useState('');
    const [getRepuestaDescripcion, setRepuestaDescripcion] = useState(false);
    const [getSubirSirius, setSubirSirius] = useState(false)

    // Metodo principal de la clase
    useEffect(() => {

        // Metodo encargado de cargar la informacion principal de la clase
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se llama el metodo
            getActivarFaseSoportesRadicado();
        }

        // Se llama el metodo
        fetchData();
    }, []);

    // Metodo encargado de activar las fases de soporte del radicado
    const getActivarFaseSoportesRadicado = () => {

        // Se consume la API
        GenericApi.getGeneric('activar-soporte-radicado/' + procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida cuando hay error
                if (datos.error) {

                    // Se setea el modal
                    setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/SoporteRadicadoLista/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                
                    window.showSpinner(false);

                } else {

                    // Se setea el nombre del usuario logeado
                    setNombreUsuario(getUser().nombre);

                    // Se cargan los documentos
                    getNombresDocumentos();
                }

            }
        )
    }

    // Metodo encargado de cargar los documentos del proceso disciplinario
    const getNombresDocumentos = () => {

        // Se consume la API
        DocumentoSiriusApi.getNombresDocumentacionSiriusByIdProDisciplinario(procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea los nombres de los documentos
                    setListNombresArchivos(datos);

                    // Se llama el metodo de fases
                    getFase();
                } else {
                    setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/SoporteRadicadoLista/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar las fases
    const getFase = () => {

        // Se consume la API
        ParametrosMasApi.getFaseById(id_fase).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea los valores
                    setFaseApi(datos.data);

                    // Se llama el metodo de formatos
                    getFormatos();
                } else {

                    // Se setea el modal
                    setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/SoporteRadicadoLista/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar los formatos
    const getFormatos = () => {

        // Se consume la API
        ParametrosMasApi.getFormatos().then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea los valores
                    setFormatosApi(datos.data);

                    // Se llama el metodo de parametros
                    obtenerParametros();
                } else {

                    // Se setea el modal
                    setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/SoporteRadicadoLista/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }


    // Metodo encargado de traer los parametros del sistema
    const obtenerParametros = () => {

        // Se usa el trycatch
        try {

            // Se inicializa la variable con la data
            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            // Se consume la API
            ParametrosMasApi.getParametroPorNombre(data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida cuando no hay error
                    if (!datos.error) {

                        // Se valida que haya informacion
                        if (datos["data"].length > 0) {

                            // Se busca y filta el valor minimo de caracteres
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (

                                // Se busca y filta el valor minimo de caracteres
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ))

                            // Se busca y filta el valor maximo de caracteres
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (

                                // Se busca y filta el valor maximo de caracteres
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ))
                        }

                        // Se llama el metodo de los procesos
                        nombreProceso();
                    } else {

                        // Se setea el modal de error
                        setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: datos.error.toString(), show: true, redirect: '/SoporteRadicadoLista/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de cargar los nombres de los procesos
    const nombreProceso = () => {

        // Se consume la API
        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida cuando no hay error
                if (!datos.error) {

                    // Se setea la data
                    setNombreProceso(datos.data.attributes.nombre);
                }

                // Se quita el cargando
                window.showSpinner(false);
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

    const [inputListArchivos, setInputListArchivos] = useState([{ folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);

    /*Funciones*/
    // handle input change
    const handleInputChangeFolios = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputListArchivos];
        list[index][name] = value;
        setInputListArchivos(list);
    };

    function primerArchivoPdf(list) {
        if(list[0].archivo.name){
            const extensionList = getFileExtension(list[0].archivo.name);
    
            if (extensionList != 'pdf') {
                setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: 'EL PRIMER ARCHIVO SELECCIONADO DEBE SER .PDF', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                window.showModal(1)
                setHabilitarBoton(false);
            }
            else {
                setHabilitarBoton(true);
            }
        }
        else{
            setHabilitarBoton(false);
        }
    }

    const handleInputChangeArchivos = (e, index) => {

        console.log("Entre qui")
        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);
            const resultado = getFormatosApi.filter(datos => datos.attributes.nombre == extension);


            if (resultado.length > 0) {
                const list = [...inputListArchivos];

                list[index][name] = files[0];

                primerArchivoPdf(list);

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
            } else {
                // Se setea el mensaje de error
                setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJE_ERROR.ERROR_FORMATO_DOCUMENTO, show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna en false
                return false;
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
    const handleRemoveClick = (index) => {
        const list = [...inputListArchivos];
        list.splice(index, 1);
        console.log("Datos eliminados", list)
        setInputListArchivos(list);
        obtenerPesoTotalArchivos(list);
        primerArchivoPdf(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputListArchivos([...inputListArchivos, { folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    };

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function compararNombresArchivos(list) {
        let existe = false;
        let nombre = "";
        if (getListNombresArchivos.data.length > 0) {
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
                setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJE_ERROR.ERROR_NOMBRE_DOCUMENTO + " - " + nombre, show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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
            setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJE_ERROR.ERROR_PESO_DOCUMENTO, show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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
        return Math.round(parseFloat((bytes / Math.pow(k, i)).toFixed(dm), 1)) + ' ' + sizes[i];
    }

    // Metodo encargado de enviar los valores
    const handleOnSubmit = (valores) => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializa la variable en false
        let band = false;

        // Se recorre la el array en posicion i
        for (let i = 0; i < inputListArchivos.length - 1; i++) {

            // Se recorre la el array en posicion j
            for (let j = i + 1; j < inputListArchivos.length; j++) {

                // Se validan que no existan archivos con el mismo nombre
                if (inputListArchivos[i].archivo.name === inputListArchivos[j].archivo.name) {
                    setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJE_ERROR.ERROR_NOMBRE_DOCUMENTO, show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    band = true;
                }
            }
        }

        // Se valida que no exista nombre repertido en el sistema
        let nombre = "";
        let existe = false;

        // Se valida que haya un listado de nombres en el array
        if (getListNombresArchivos.data.length > 0) {

            // Se recorre el array en i
            for (let i = 0; i < inputListArchivos.length; i++) {

                // Se captura el nombres del documento y
                let nombre_servidor = getListNombresArchivos.data.find(dato =>

                    // Se retorna el listado de nombre del archivo
                    dato.attributes.nombre_archivo == inputListArchivos[i].archivo.name
                );

                // Se valida que si existe
                if (nombre_servidor) {

                    // Se setea los valores
                    nombre = nombre_servidor.attributes.nombre_archivo;
                    existe = true;
                    band = true;
                }

                // Se valida que si existe
                if (existe) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se setea el mensaje de error
                    setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJE_ERROR.ERROR_FORMATO_NOMBRE_DOCUMENTO + " " + nombre, show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se suma una a la longitud de i
                    i = inputListArchivos.length + 1;
                }
            }
        }

        // Se recorre el array de archivos
        for (let i = 0; i < inputListArchivos.length; i++) {

            // Se consultan las extensiones por cada archivo
            const extension = getFileExtension(inputListArchivos[i].archivo.name);

            // Se recorre el array de las extensiones permitidas y se filtra por la extension de archivo
            const resultado = getFormatosApi.filter(datos =>
                datos.attributes.nombre == extension
            );

            // Se valida que la extension sea valida
            if (resultado.length <= 0) {

                // Se quita el cargando
                window.showSpinner(false);

                // Se setea el modal de error
                setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJE_ERROR.ERROR_FORMATO_DOCUMENTO, show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se redeclara la variable
                band = true;
            }
        }

        // Se valida que peso de todos los archivos sea mayor a 15MB
        if (getPesoTotalArchivos > 15000000) {

            // Se quita el cargando
            window.showSpinner(false);

            // Se setea el mensaje de error
            setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJE_ERROR.ERROR_FORMATO_PESO_DOCUMENTO, show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se muestra el modal
            window.showModal(1);

            // Se redeclara la variable
            band = true;
        }

        // Se realiza que si el formulario es correcto
        if (band === false) {

            // Paso 1: Validar con SIRIUS
            // Paso 1.1: Login y Radicación

            // Se inicializa el array
            const attributes = [];

            // Se recorre el listado de archivos
            for (let i = 0; i < inputListArchivos.length; i++) {

                // Se valida que hayan numeros de folios
                if (inputListArchivos[i].folios !== null || inputListArchivos[i].folios !== '') {

                    // Se añade los valores en el array de datos
                    attributes.push({
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_etapa": from.id_etapa,
                        "id_fase": from.id_fase,
                        "nombre_archivo": inputListArchivos[i].archivo.name,
                        "file64": inputListArchivos[i].filebase64,
                        "estado": "1",
                        "num_folios": inputListArchivos[i].folios,
                        "num_radicado": radicado,
                        "vigencia": vigencia,
                        "extension": getFileExtension(inputListArchivos[i].archivo.name),
                        "peso": inputListArchivos[i].archivo.size,
                        "created_user": getNombreUsuario,
                        "descripcion": getDescripcion,
                        "id_mas_formato": inputListArchivos[i].id_mas_formato,
                        "es_compulsa": false,
                        "es_soporte": es_soporte,
                        "subir_sirius": getSubirSirius
                    });

                }
            }

            // Se inicializa la variable con la informacion
            const data = {
                "data": {
                    "type": "documento_sirius",
                    "attributes": attributes
                }
            }

            // Se consume la API
            DocumentoSiriusApi.addDocumentoSirius(data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se setea el mensaje
                        setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/SoporteRadicadoLista/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    } else {

                        // Se setea el mensaje de error
                        setModalState({ title: "SINPROC No " + radicado + " :: SOPORTES DEL RADICADO", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        }
    }

    const changeDescripcion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setDescripcion(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaDescripcion(true);
        }
    }

    /*Componentes*/
    const componentFormSoporte = () => {
        return (
            <Formik
                initialValues={{
                    descripcion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}

                    if (!getRepuestaDescripcion) {
                        errores.descripcion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }
                    if (countTextArea > getMaximoTextArea) {
                        errores.descripcion = 'Debe ingresar maximo ' + getMaximoTextArea + ' caracteres';
                    }
                    if (countTextArea < getMinimoTextArea) {
                        errores.descripcion = 'Debe ingresar mínimo ' + getMinimoTextArea + ' caracteres'
                    }
                    if(getRepuestaDescripcion == false){
                        errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    handleOnSubmit(valores);
                }}>
                {({ errors }) => (
                    <Form>
                        {
                            inputListArchivos.map((x, i) => {
                                return (
                                    <div className="box" key={i}>
                                        <ul>
                                            <div className='row'>
                                                <div className='col-md-9'>
                                                    <div className='row'>
                                                        <div className='col-md-5'>
                                                            <input className='form-control' name="folios" type="number" min="1" placeholder="No. de folios" value={x.folios} onChange={e => handleInputChangeFolios(e, i)} required />
                                                            <div>
                                                                <label>NÚMERO DE FOLIOS <span className="text-danger">*</span></label>
                                                            </div>
                                                        </div>

                                                        <div className='col-md-6'>
                                                            <label className="custom-file-label" htmlFor="example-file-input-custom" data-toggle="custom-file-input">{x.archivo.name}</label>
                                                            <input className="custom-file-input" data-toggle="custom-file-input" type="file" name="archivo" onClick={(e) => (e.target.value = null)} onChange={e => handleInputChangeArchivos(e, i)} required={x.filebase64 == ""} />
                                                            <label>DOCUMENTO: {formatBytes(x.archivo.size)} <span className="text-danger">*</span></label>
                                                        </div>
                                                        {
                                                            inputListArchivos.length !== 1 ?
                                                                (
                                                                    <div className="col-md-2">
                                                                        <button type="button" className="btn btn-rounded btn-outline-primary" onClick={() => handleRemoveClick(i)}><i className="fas fa-trash-alt col"></i></button>
                                                                    </div>
                                                                ) : null
                                                        }

                                                    </div>
                                                </div>
                                                <div className='col-md-3'>
                                                    <div className='row'>
                                                        {
                                                            inputListArchivos.length - 1 === i ?
                                                                (
                                                                    <div className="col-md-12">
                                                                        <button type="button" className="btn btn-rounded btn-primary" onClick={() => handleAddClick()}> <i className="fas fa-plus"></i> AGREGAR</button>
                                                                    </div>
                                                                ) : null
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                );
                            })
                        }
                        <div className='row'>
                            <div className="col-md-9" style={{ paddingLeft: "55px" }}>
                                <label htmlFor="descripcion">DESCRIPCIÓN <span className="text-danger">*</span></label>
                                <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="Descripción de los soportes" required
                                    maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getDescripcion} onChange={changeDescripcion}></Field>
                                <div className="text-right">
                                    <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                </div>
                                <ErrorMessage name='descripcion' component={() => (<span className='text-danger'>{errors.descripcion}</span>)} />
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-md-12 text-right">
                                {
                                    getHabilitarBoton
                                    ?
                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    :
                                        null
                                }

                                <Link to={`/RamasProceso/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                                <br />
                                <br />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
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
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/SoporteRadicadoLista/`} state={{ from: from }}><small>Lista Soportes Radicado</small></Link></li>
                        <li className="breadcrumb-item"> <small>Crear soporte del radicado</small></li>
                    </ol>
                </nav>
            </div>
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title"> {getNombreProceso.toUpperCase()} :: ADJUNTAR DOCUMENTO FASE {getFaseApi.attributes != null ? getFaseApi.attributes.nombre : null} </h3>
                </div>
                <div className="block-content">
                    <div className='text-right mb-2'>
                        <Link to={`/SoporteRadicadoLista/`} title='Regresar a lista de Soportes' state={{ from: from }}>
                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                        </Link>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-warning alert-dismissable" role="alert">
                                <h3 className="alert-heading font-size-h4 my-2">INFORMACIÓN</h3>
                                <p>PARA CUALQUIER DOCUMENTO QUE REQUIERA ADJUNTAR VALIDE PREVIAMENTE LO SIGUIENTE: </p>
                                <p className="mb-0"><strong>1.</strong> SE RECOMIENDA QUE EL NOMBRE DEL ARCHIVO LLVE LA SIGUIENTE ESTRUCTURA EJM: 2022-ER-0000018-1, 2022-EE-0000018-2</p>
                                <p className="mb-0"><strong>2.</strong> NO PUEDE SUPERAR QUINCE (15) Mb DE PESO / TAMAÑO.</p>
                                <p className="mb-0"><strong>3.</strong> EL NOMBRE DEL DOCUMENTO DEBE SER MÁXIMO DE 40 CARÁCTERES.</p>
                                <p className="mb-0"><strong>4.</strong> FORMATOS PERMITIDOS:
                                    <span className="ml-1">
                                        {getFormatosApi ? (getFormatosApi.map((suggestion) => {
                                            if (suggestion.attributes.estado == true)
                                                return suggestion.attributes.nombre;
                                        })).join(' - ') : null}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className="custom-control custom-switch custom-control-lg mb-2 text-center">
                                <input defaultChecked={getSubirSirius} type="checkbox" onChange={e => setSubirSirius(e.target.checked)} className="custom-control-input" id="subirSirius" name="subirSirius"/>
                                <label className="custom-control-label" htmlFor="subirSirius">¿SUBIR DOCUMENTACIÓN A SIRIUS?</label>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div>
                        {componentFormSoporte()}
                    </div>
                </div>
            </div>
        </>
    );
}
export default SoporteRadicadoForm;
