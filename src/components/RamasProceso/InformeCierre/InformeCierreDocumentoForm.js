import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router";
import { Link, useLocation } from 'react-router-dom';
import ParametrosMasApi from "./../../Api/Services/ParametrosMasApi";
import InfoExitoApiTextsCustom from '../../Utils/InfoExitoApiTextsCustom';
import Spinner from '../../Utils/Spinner';
import { getUser } from '../../../components/Utils/Common';
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import GestorRespuestaApi from '../../Api/Services/GestorRespuestaApi';
import '../../Utils/Constants';
import ModalListaVersionesGestorRespuesta from '../../Utils/Modals/ModalListaVersionesGestorRespuesta';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { set } from 'react-hook-form';
import GenericApi from '../../Api/Services/GenericApi';

function InformeCierreDocumentoForm() {

    const location = useLocation();
    const { from, disable } = location.state;

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;
    let tipoEvaluacion = from.tipoEvaluacion;
    let tipoEvaluacionNombre = from.tipoEvaluacionNombre

    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [exitoApiTextsCustom, setExitoApiTextsCustom] = useState({ titulo: null, cuerpo: null, boton: null });
    const [inputListArchivos, setInputListArchivos] = useState([{ folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getFormatosApi, setFormatosApi] = useState();

    const [getGestorRespuestaApi, setGestorRespuestaApi] = useState();
    const [getListNombresArchivos, setListNombresArchivos] = useState({ attributes: null });
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0);
    const [getHabilitarRegistrar, setHabilitarRegistrar] = useState(true);

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [getUsuarioEnvioExpediente, setUsuarioEnvioExpediente] = useState();
    const [getNombreProceso, setNombreProceso] = useState('');

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
                    setNombreProceso(datos.data.attributes.nombre);
                    obtenerNombresDocumentosExistentes();
                }
            }
        )
    }

    function obtenerNombresDocumentosExistentes() {
        DocumentoSiriusApi.getNombresDocumentacionSiriusByIdProDisciplinario(procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListNombresArchivos(datos)
                    obtenerFormatos();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: Información Cierre", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        );
    }

    function obtenerFormatos() {
        ParametrosMasApi.getFormatos().then(
            datos => {
                if (!datos.error) {
                    setFormatosApi(datos.data);
                    obtenerParametros();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: Información Cierre", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        );
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

    /*Llamadas API*/
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
                    } else {
                        setModalState({ title: getNombreProceso + " :: Información Cierre", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    /*Componentes */
    const componentForm = () => {
        return (
            <Formik
                initialValues={{
                    descripcion: '',
                }}
                enableReinitialize
                validate={(valores) => {

                    let errores = {}
                    setCountTextArea(valores.descripcion.length);

                    if (valores.descripcion && valores.descripcion.length < getMinimoTextArea) {
                        errores.descripcion = 'DEBE INGRESA MÍNIMO ' + getMinimoTextArea + ' CARACTERES'
                    }


                    if (valores.descripcion) {
                        if (containsSpecialChars(valores.descripcion))
                            errores.descripcion = 'CARACTERES INVÁLIDOS'
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    handleOnSubmit(valores);
                }}>
                {({ errors, values }) => (
                    <Form>
                        <div className='row'>
                            <div className='col-md-12'>
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
                                                                </div>

                                                                <div className='col-md-5'>
                                                                    <label className="custom-file-label" htmlFor="example-file-input-custom" data-toggle="custom-file-input">{x.archivo.name}</label>
                                                                    <input className="custom-file-input" data-toggle="custom-file-input" type="file" name="archivo" onChange={e => handleInputChangeArchivos(e, i)} required={x.filebase64 == ""} />
                                                                    <label>PESO DEL ARCHIVO: {formatBytes(x.archivo.size)}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ul>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-md-9" style={{ paddingLeft: "55px" }}>
                                <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="Descripción de los soportes" required
                                    maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                <div className="text-right">
                                    <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                </div>
                                <ErrorMessage name='descripcion' component={() => (<span className='text-danger'>{errors.descripcion}</span>)} />
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-md-12 text-right">
                                <button type="submit" className="btn btn-rounded btn-primary">REGISTRAR</button>
                                <Link to={`/RamasProceso/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                </Link>
                            </div>
                        </div>
                        <br></br>
                    </Form>
                )}
            </Formik>
        )
    }

    function primerArchivoPdf(list) {
        const extensionList = getFileExtension(list[0].archivo.name);

        if (extensionList != 'pdf') {
            setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: 'EL PRIMER DOCUMENTO DEBE SER .pdf', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
            window.showModal(1)
            setHabilitarRegistrar(false);
        }
        else {
            setHabilitarRegistrar(true);
        }
    }

    /*
    * FUNIONES TEMPORALES -- CONSTRUIR COMPONENTE
    */
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
            }
            else {
                const list = [...inputListArchivos];
                list[index][name] = files[0];
                list[index].filebase64 = '';
                list[index].size = 0;
                list[index].id_mas_formato = null;
                setInputListArchivos(list);
                setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: 'EL ARCHIVO NO TIENE UN FORMATO PERMITIDO', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                window.showModal(1)
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
                setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: "EL NOMBRE DEL DOCUMENTO '" + nombre + "', YA ES UTILIZADO POR OTRO DOCUMENTO REGISTRADO EN EL SISTEMA, POR FAVOR ELIMINE EL ARCHIVO Y VUELVA A SUBIRLO CON UN NOMBRE DISTINTO", show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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
            setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: 'EL PESO /TAMAÑO DE TODOS LOS ADJUNTOS SUPERAN LOS 15 MB PERMITIDOS PARA EL REGISTRO.', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
            window.showModal(1)
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
        //return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        return Math.round(parseFloat((bytes / Math.pow(k, i)).toFixed(dm), 1)) + ' ' + sizes[i];
    }

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
                        setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: "EL NOMBRE DEL ARCHIVO '" + nombre + "', YA ES UTILIZADO POR OTRO DOCUMENTO REGISTRADO EN EL SISTEMA, POR FAVOR ELIMINE EL ARCHIVO Y VUELVA A SUBIRLO CON UN NOMBRE DISTINTO", show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                        i = inputListArchivos.length + 1;
                    }
                }
            }
        }

        // VALIDA QUE NO SE PUEDAN SUBIR FORMATOS NO PERMITIDOS
        if (valores.requiere_documento == 'true') {
            for (let i = 0; i < inputListArchivos.length; i++) {
                const extension = getFileExtension(inputListArchivos[i].archivo.name);
                const resultado = getFormatosApi.filter(datos => datos.attributes.nombre == extension);

                if (resultado.length <= 0) {
                    setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: "EL ARCHIVO NO TIENE UN FORMATO PERMITIDO", show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    band = true;
                }
            }
        }

        if (getPesoTotalArchivos > 15000000) {
            setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: 'EL PESO /TAMAÑO DE TODOS LOS ADJUNTOS SUPERAN LOS 15 MB PERMITIDOS PARA EL REGISTRO.', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

            band = true;
        }

        const attributes = [];

        if (band === false) {

            // PASO 1. VALIDAR CON SIRIUS
            // PASO 1.1 LOGIN Y RADICACION

            for (let i = 0; i < inputListArchivos.length; i++) {
                // PASO 2. GUARDAR EN BASE DE DATOS
                if (inputListArchivos[i].folios !== null || inputListArchivos[i].folios !== '') {

                    attributes.push({
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_etapa": global.Constants.ETAPAS.EVALUACION,
                        "id_fase": global.Constants.FASES.INFORME_CIERRE,
                        "nombre_archivo": inputListArchivos[i].archivo.name,
                        "estado": "1",
                        "num_folios": inputListArchivos[i].folios,
                        "num_radicado": radicado,
                        "vigencia": vigencia,
                        "extension": getFileExtension(inputListArchivos[i].archivo.name),
                        "peso": inputListArchivos[i].archivo.size,
                        "descripcion": valores.descripcion,
                        "es_compulsa": false,
                        "file64": inputListArchivos[i].filebase64,
                        "id_mas_formato": inputListArchivos[i].id_mas_formato,
                        "es_soporte": false //ESTABA TRUE
                    });

                }
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
                        setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: INFORME CIERRE", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        }

    }

    /*
    * FUNIONES TEMPORALES -- CONSTRUIR COMPONENTE
    */

    return (
        <>
            {<ModalGen data={getModalState} />}
            {<Spinner />}
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <small>Información Cierre</small></li>
                    </ol>
                </nav>
            </div>
            <div className='content'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='block block-themed'>
                            <div className='block-header'>
                                <h3 className='block-title'>{getNombreProceso} ::: INFORMACIÓN CIERRE</h3>
                            </div>
                            <div className='block-content'>
                                <div className='col-md-12 text-right my-2'>
                                    <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>
                                <div className="col-md-12 text-uppercase">
                                    <div className="alert alert-warning alert-dismissable" role="alert">
                                        <h3 className="alert-heading font-size-h4 my-2">Alerta</h3>
                                        <p className="mb-0 "> Para cualquier archivo que requiera adjuntar valide previamente lo siguiente: </p>
                                        <p className="mb-0">
                                            NO puede superar QUINCE (15) Mb de peso/tamaño.
                                            Tipo/Formato permitido: pdf
                                            {/*getFormatosApi ? (getFormatosApi.map((suggestion) => {
                                                if (suggestion.attributes.estado == true)
                                                    return suggestion.attributes.nombre;

                                            })).join(' - '):null*/}
                                        </p>
                                        <p className="mb-0">
                                            El nombre del archivo debe ser de máximo 40 caracteres.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    {componentForm()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default InformeCierreDocumentoForm;
