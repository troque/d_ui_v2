import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ParametrosMasApi from "./../../Api/Services/ParametrosMasApi";
import Spinner from '../../Utils/Spinner';
import { getUser } from '../../../components/Utils/Common';
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import GestorRespuestaApi from '../../Api/Services/GestorRespuestaApi';
import '../../Utils/Constants';
import ModalListaVersionesGestorRespuesta from '../../Utils/Modals/ModalListaVersionesGestorRespuesta';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import { input } from 'rhfa-emergency-styles';
function GestorRespuestaForm() {

    const location = useLocation();
    const { from, disable } = location.state;

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;
    let tipoEvaluacion = from.tipoEvaluacion;
    let tipoEvaluacionNombre = from.tipoEvaluacionNombre

    const [getNombreUsuario, setNombreUsuario] = useState("");
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

    const [getSubirSirius, setSubirSirius] = useState(false);

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
                    getGestorRespuesta();
                }
            }
        )
    }

    function getGestorRespuesta() {
        GestorRespuestaApi.getGestorRespuestaByProcesoDisciplinario(procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setGestorRespuestaApi(datos);
                    if(datos?.data[0]?.attributes?.subir_sirius == '1'){
                        setSubirSirius(true)
                    }
                    obtenerNombresDocumentosExistentes();
                }
                else {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: datos.error.toString().toUpperCase(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        );
    }

    function obtenerNombresDocumentosExistentes() {
        DocumentoSiriusApi.getNombresDocumentacionSiriusByIdProDisciplinario(procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListNombresArchivos(datos)
                    obtenerFormatos();
                }
                else {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: datos.error.toString().toUpperCase(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
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
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: datos.error.toString().toUpperCase(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
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
                        setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: datos.error.toString().toUpperCase(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    /*Funciones*/
    const handleOnSubmit = (valores) => {

        let id_funcionalidad;
        let id_dependencia_origen;
        let id_funcionario_asignado;

        if (valores.aprobacion == 'true') {
            id_funcionalidad = getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.id_funcionario;
            id_dependencia_origen = getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.id_dependencia_origen;
            id_funcionario_asignado = getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.id_funcionario_asignado;
        }
        else {
            if (getGestorRespuestaApi?.data[0]?.attributes?.clasificacion_expediente?.expediente?.id == global.Constants.TIPOS_EXPEDIENTES.TUTELA) {
                if (getUsuarioEnvioExpediente) {
                    id_funcionalidad = getUsuarioEnvioExpediente.id_funcionario;
                    id_dependencia_origen = getUsuarioEnvioExpediente.id_dependencia_origen;
                    id_funcionario_asignado = getUsuarioEnvioExpediente.id_funcionario_asignado;
                }
                else {
                    id_funcionalidad = getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.id_funcionario;
                    id_dependencia_origen = getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.id_dependencia_origen;
                    id_funcionario_asignado = getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.id_funcionario_asignado;
                }
            }
            else {
                id_funcionalidad = getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.id_funcionario;
                id_dependencia_origen = getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.id_dependencia_origen;
                id_funcionario_asignado = getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.id_funcionario_asignado;
            }
        }

        const data = {
            "data": {
                "type": "documento_sirius",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "aprobado": valores.aprobacion == 'true' ? 1 : 0,
                    "descripcion": valores.descripcion,
                    "version": getGestorRespuestaApi.data[0].attributes.version,
                    "nuevo_documento": false,
                    "id_etapa": from.id_etapa,
                    "id_fase": from.id_fase,
                    "reparto": {
                        "id_funcionalidad": id_funcionalidad,
                        "id_dependencia_origen": id_dependencia_origen,
                        "id_funcionario_asignado": id_funcionario_asignado
                    },
                    "id_tipo_evaluacion": tipoEvaluacion ? tipoEvaluacion : global.Constants.TIPOS_EVALUACION.SIN_EVALUACION,
                    "subir_sirius": getSubirSirius
                }
            }
        }


        window.showSpinner(true);
        GestorRespuestaApi.addGestorRespuesta(data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: 'EL PROCESO DISCIPLINARIO ES ASIGNADO A ' + datos.data?.attributes?.rol_seleccionado?.nombre_completo.toUpperCase()  + ' DE LA DEPENDENCIA DE ' + getUser().nombre_dependencia.nombre, show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: datos.error.toString().toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )

    }

    const handleClicArchivo = (documento_sirius) => {
        try {
            window.showSpinner(true);
            let nombre_documento = documento_sirius.nombre_archivo;
            let extension = documento_sirius.extension;
            let es_compulsa = false;

            const data = {
                "data": {
                    "type": "documeto_sirius",
                    "attributes": {
                        "radicado": radicado,
                        "vigencia": vigencia,
                        "id_documento_sirius": documento_sirius.uuid,
                        "extension": extension,
                        "es_compulsa": es_compulsa
                    }
                }
            }

            DocumentoSiriusApi.getDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento, extension);
                    }
                    else {
                        setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: datos.error.toString().toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const componentListaDocumentos = () => {
        return (
            <>
                <table className="table table-bordered table-striped table-vcenter" style={{ 'width': 'auto' }}>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>DOCUMENTOS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getGestorRespuestaApi.data[0].attributes.documento_sirius.map((documento, i) => {
                                // Se retorna cada columna con su información
                                return (
                                    <tr key={documento.uuid}>
                                        <td>{ i + 1 }</td>
                                        <td className='text-center'>
                                            <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-primary' onClick={() => handleClicArchivo(documento)}><i className="fas fa-download"></i></button>
                                        </td>                         
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </>
        )
    }

    const componentRegistro = () => {
        return (
            <>
                {
                    getGestorRespuestaApi?.data.length > 0
                        ?
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-content">
                                <div className='row'>
                                    <div className="col-md-12">
                                        <div className='row'>
                                            <div className="col-md-4">
                                                <label>VERSIÓN: </label> {getGestorRespuestaApi.data[0].attributes.version}
                                            </div>
                                            <div className="col-md-4">
                                                <label>FECHA: </label> {getGestorRespuestaApi.data[0].attributes.fecha}
                                            </div>
                                            <div className="col-md-4">
                                                <label>CONCEPTO: </label> {getGestorRespuestaApi.data[0].attributes.aprobado == 1 ? 'APROBADO' : 'RECHAZADO'}
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-12">
                                                <label>POR: </label> {getGestorRespuestaApi.data[0].attributes.usuario}
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-12" data-toggle="modal" data-target={"#q2"+getGestorRespuestaApi.data[0].id}>
                                                <div className='text-uppercase'>
                                                    <label>OBSERVACIÓN: </label> {getGestorRespuestaApi.data[0].attributes.descripcion_corta}
                                                </div>
                                                <div className="modal fade" id={"q2"+getGestorRespuestaApi.data[0].id} tabIndex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-xl" role="document">
                                                        <div className="modal-content">
                                                            <div className="modal-header block.block-themed">
                                                                <h5 className="modal-title" id="descriptionModalLabel">{getNombreProceso} : {radicado} - {vigencia} :: ÚLTIMO ANTECEDENTE </h5>
                                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                            <div className="modal-body">
                                                                {getGestorRespuestaApi.data[0].attributes.descripcion}                              
                                                            </div>                  
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content-heading"></div>               
                                        <div className='row'>
                                            <div className="col-md-12">
                                                <label>ARCHIVOS: </label><br></br>
                                                { componentListaDocumentos() }
                                            </div>
                                        </div>
                                        <div className="content-heading"></div> 
                                        {
                                            getGestorRespuestaApi?.data[0]?.attributes?.evaluaciones.length > 0
                                                ?
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <label>EVALUACIÓN INICIAL: </label> {getGestorRespuestaApi?.data[0]?.attributes?.evaluaciones[0]?.nombre.toUpperCase()}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>EVALUACIÓN FINAL: </label> {getGestorRespuestaApi?.data[0]?.attributes?.evaluaciones[1]?.nombre.toUpperCase()}
                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
                <div className="col-md-12">
                    <div className="alert alert-warning alert-dismissable" role="alert">
                        <h3 className="alert-heading font-size-h4 my-2">ALERTA</h3>
                        <p className="mb-0"> PARA CUALQUIER ARCHIVO QUE REQUIERA ADJUNTAR VALIDE PREVIAMENTE LO SIGUIENTE: </p>
                        <p className="mb-0">
                            NO PUEDE SUPERAR (15) MB DE PESO/TAMAÑO.
                            TIPO/FORMATO PERMITIDO: PDF
                            {/*getFormatosApi ? (getFormatosApi.map((suggestion) => {
                                if (suggestion.attributes.estado == true)
                                    return suggestion.attributes.nombre;

                            })).join(' - '):null*/}
                        </p>
                        <p className="mb-0">
                            EL NOMBRE DEL ARCHIVO DEBE SER MÁXIMO 40 CARACTERES
                        </p>
                    </div>
                </div>
                <div className="col-md-12">
                    {componentForm()}
                </div>
            </>
        )
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
                        errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES+' '+ getMinimoTextArea
                    }


                    if (valores.descripcion) {
                        if (containsSpecialChars(valores.descripcion))
                            errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    handleOnSubmitDocument(valores);
                }}>
                {({ errors, values }) => (
                    <Form>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className="custom-control custom-switch custom-control-lg mb-2 text-center">
                                    <input type="checkbox" onChange={e => setSubirSirius(e.target.checked)} className="custom-control-input" id="subirSirius" name="subirSirius"/>
                                    <label className="custom-control-label" htmlFor="subirSirius">¿SUBIR DOCUMENTACIÓN A SIRIUS?</label>
                                </div>
                            </div>
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
                                                                    <input className="custom-file-input" data-toggle="custom-file-input" type="file" name="archivo" onClick={(e) => (e.target.value = null)}  onChange={e => handleInputChangeArchivos(e, i)} required={x.filebase64 == ""} />
                                                                    <label>PESO DEL ARCHIVO: {formatBytes(x.archivo.size)}</label>
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
                                {
                                    getHabilitarRegistrar
                                    ?
                                        <button type="submit" className="btn btn-rounded btn-primary">REGISTRAR</button>
                                    :
                                        null
                                }
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

    const validacionAprobacion = (aprobacion) => {
        if (aprobacion == "true") {
            if (getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.estado != true) {
                if (getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.ultimo_usuario != true) {
                    setHabilitarRegistrar(false);
                }
            }
            else {
                setHabilitarRegistrar(true);
            }
        }
        else if (aprobacion == "false") {
            if (getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.nombre_completo || getUsuarioEnvioExpediente) {
                setHabilitarRegistrar(true);
            }
            else {
                setHabilitarRegistrar(false);
            }
        }
    }

    const handleChangeUsuarioTutela = (nombreUsuario) => {
        let rol_anterior = getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior.find(dato => dato.nombre_funcionario == nombreUsuario);
        if (nombreUsuario) {
            setHabilitarRegistrar(true);
        }
        else {
            setHabilitarRegistrar(false);
        }
        setUsuarioEnvioExpediente(rol_anterior);
    }

    const componentAprobacion = () => {
        return (
            <>
                <div className='row'>
                    <div className="col-md-12">
                        <div className='row'>
                            <div className="col-md-4">
                                <label>VERSIÓN: </label> {getGestorRespuestaApi.data[0].attributes.version}
                            </div>
                            <div className="col-md-4">
                                <label>FECHA: </label> {getGestorRespuestaApi.data[0].attributes.fecha}
                            </div>
                            <div className="col-md-4">
                                <label>CONCEPTO: </label>
                                {
                                    (getGestorRespuestaApi.data.length > 1)
                                        ?
                                        (
                                            (
                                                getGestorRespuestaApi.data[0].attributes.version != getGestorRespuestaApi.data[1].attributes.version
                                            )
                                                ?
                                                ' PENDIENTE DE APROBACIÓN'
                                                :
                                                (getGestorRespuestaApi.data[0].attributes.aprobado == 1 ? ' APROBADO' : ' RECHAZADO')
                                        )
                                        :
                                        (
                                            getGestorRespuestaApi?.data[0]?.attributes?.proceso_finalizado == true
                                                ?
                                                ' APROBADO'
                                                :
                                                ' PENDIENTE DE APROBACIÓN'
                                        )
                                }
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-12">
                                <label>POR: </label> {getGestorRespuestaApi.data[0].attributes.usuario}
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-12" data-toggle="modal" data-target={"#q"+getGestorRespuestaApi.data[0].id}>
                                <div className='text-uppercase'>
                                    <label>OBSERVACIÓN: </label> {getGestorRespuestaApi.data[0].attributes.descripcion_corta}
                                </div>
                                <div className="modal fade" id={"q"+getGestorRespuestaApi.data[0].id} tabIndex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-xl" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header block.block-themed">
                                                <h5 className="modal-title" id="descriptionModalLabel">{getNombreProceso} : {radicado} - {vigencia} :: ÚLTIMO ANTECEDENTE </h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                {getGestorRespuestaApi.data[0].attributes.descripcion}                              
                                            </div>                  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>         
                        <div className="content-heading"></div>               
                        <div className='row'>
                            <div className="col-md-6">
                                <label>ARCHIVOS: </label><br></br>
                                { componentListaDocumentos() }
                            </div>
                        </div>
                        {
                            getGestorRespuestaApi?.data[0]?.attributes?.evaluaciones.length > 0
                            ?
                            <>
                                <div className="content-heading"></div>
                                <div className='row'>
                                    <div className="col-md-6 text-center">
                                        <label>EVALUACIÓN INICIAL: </label> {getGestorRespuestaApi?.data[0]?.attributes?.evaluaciones[0]?.nombre.toUpperCase()}
                                    </div>
                                    <div className="col-md-6 text-center">
                                        <label>EVALUACIÓN FINAL: </label> {getGestorRespuestaApi?.data[0]?.attributes?.evaluaciones[1]?.nombre.toUpperCase()}
                                    </div>
                                </div>
                            </>
                                :
                                null
                        }
                    </div>
                </div>
                <div className="content-heading"></div>
                <div className='row'>
                    <div className="col-md-6 text-center">
                        <p>TIPO DE EXPEDIENTE: <b>
                            {getGestorRespuestaApi?.data[0]?.attributes?.clasificacion_expediente?.expediente?.nombre.toUpperCase()}
                            {getGestorRespuestaApi?.data[0]?.attributes?.tipo_expediente?.nombre ? ' - ' + getGestorRespuestaApi?.data[0]?.attributes?.tipo_expediente?.sub_nombre.toUpperCase() : null}
                            {
                                getGestorRespuestaApi?.data[0]?.attributes?.tipo_expediente?.id_tipo_expediente
                                    ?
                                    (
                                        getGestorRespuestaApi?.data[0]?.attributes?.tipo_expediente?.sub_tipo_expediente_id == global.Constants.DERECHOS_PETICION.ALERTA
                                            ?
                                            getGestorRespuestaApi?.data[0]?.attributes?.tipo_expediente?.id_tercer_expediente == '1' ? ' - SI REQUIERE GESTIÓN JURIDICA' : ' - NO REQUIERE GESTIÓN JURIDICA'
                                            :
                                            null
                                    )
                                    :
                                    null
                            }
                        </b>
                        </p>
                    </div>
                    {
                        tipoEvaluacionNombre
                            ?
                            <div className="col-md-6 text-center">
                                <p>EVALUACIÓN: <b>{tipoEvaluacionNombre}</b></p>
                            </div>
                            :
                            null
                    }
                </div>
                <div className="content-heading"></div>
                {
                    getGestorRespuestaApi?.data[0]?.attributes?.proceso_finalizado == false && from.mismoUsuarioBuscador
                        ?
                        (
                            <>
                                <div>
                                    <div>
                                        <Formik
                                            initialValues={{
                                                aprobacion: '',
                                                descripcion: ''
                                            }}
                                            enableReinitialize
                                            validate={(valores) => {

                                                let errores = {}
                                                setCountTextArea(valores.descripcion.length);

                                                if (!valores.aprobacion) {
                                                    errores.aprobacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                                                }
                                                else {
                                                    validacionAprobacion(valores.aprobacion);
                                                }

                                                if (valores.descripcion) {
                                                    if (valores.descripcion.length < getMinimoTextArea) {
                                                        errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES + getMinimoTextArea;
                                                    }
                                                }

                                                if (valores.descripcion) {
                                                    if (containsSpecialChars(valores.descripcion))
                                                        errores.descripcion = 'Tiene caracteres inválidos'
                                                }

                                                return errores;
                                            }}
                                            onSubmit={(valores, { resetForm }) => {
                                                handleOnSubmit(valores);
                                            }}>
                                            {({ errors, values }) => (
                                                <Form>
                                                    {
                                                        values.aprobacion
                                                            ?
                                                            (
                                                                values.aprobacion == 'true'
                                                                    ?
                                                                    <>
                                                                        { /*MUESTE LA INFORMACION SI LA APROBACION ES ACEPTADA*/}
                                                                        <div className='row'>
                                                                            <div className="col-md-12">
                                                                                <div className="alert alert-warning alert-dismissable" role="alert">
                                                                                    <div className='row'>
                                                                                        <div className="col-md-6 text-center text-uppercase">
                                                                                            MI ROL: <b>{getGestorRespuestaApi?.data[0]?.attributes?.rol_actual.roles.toUpperCase()}</b>
                                                                                        </div>
                                                                                        <div className="col-md-6 text-center text-uppercase">
                                                                                            {
                                                                                                getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.estado == true
                                                                                                    ?
                                                                                                    <>
                                                                                                        SIGUIENTE ROL: <b>{getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.funcionario.toUpperCase()}</b><br></br>
                                                                                                        POR: <b>{getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.nombre_completo.toUpperCase()}</b><br></br>
                                                                                                    </>
                                                                                                    :
                                                                                                    <>
                                                                                                        SIGUIENTE ROL: <b>
                                                                                                            {
                                                                                                                getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.ultimo_usuario == true
                                                                                                                    ?
                                                                                                                    getGestorRespuestaApi?.data[0]?.attributes?.rol_actual.roles.toUpperCase()
                                                                                                                    :
                                                                                                                    getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.error.toUpperCase()
                                                                                                            }
                                                                                                        </b>
                                                                                                        <br></br>
                                                                                                        POR: <b>
                                                                                                            {
                                                                                                                getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.ultimo_usuario == true
                                                                                                                    ?
                                                                                                                    getGestorRespuestaApi?.data[0]?.attributes?.rol_actual?.nombre_completo.toUpperCase()
                                                                                                                    :
                                                                                                                    getGestorRespuestaApi?.data[0]?.attributes?.rol_siguiente?.error.toUpperCase()
                                                                                                            }
                                                                                                        </b>
                                                                                                        <br></br>
                                                                                                    </>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        { /*MUESTE LA INFORMACION SI LA APROBACION ES RECHAZADA*/}
                                                                        <div className='row'>
                                                                            <div className="col-md-12">
                                                                                <div className="alert alert-danger alert-dismissable" role="alert">
                                                                                    <div className='row'>
                                                                                        <div className="col-md-3 text-center text-uppercase">
                                                                                            MI ROL: <b>{getGestorRespuestaApi?.data[0]?.attributes?.rol_actual.roles}</b>
                                                                                        </div>
                                                                                        {
                                                                                            getGestorRespuestaApi?.data[0]?.attributes?.clasificacion_expediente?.expediente?.id == global.Constants.TIPOS_EXPEDIENTES.TUTELA && getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.length
                                                                                                ?
                                                                                                <div className="col-md-9 text-center text-uppercase">
                                                                                                    <p>
                                                                                                        EL USUARIO QUE REGISTRÓ LA VERSIÓN DEL DOCUMENTO QUE SE ESTÁ GESTIONANDO: PERSONERO DELEGADO <b>{getGestorRespuestaApi?.data[0]?.attributes?.rol_previo?.nombre}</b>; TIENE LA(S) SIGUIENTES(S) NOVEDAD(ES):
                                                                                                    </p>
                                                                                                    <p>
                                                                                                        {getGestorRespuestaApi?.data[0]?.attributes?.rol_previo?.lista_errores}
                                                                                                    </p>
                                                                                                    {
                                                                                                        getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior.length > 0
                                                                                                            ?
                                                                                                            <>
                                                                                                                <select className='form-control' id='funcionario_tutela' name='funcionario_tutela' onChange={e => handleChangeUsuarioTutela(e.target.value)} required>
                                                                                                                    <option value=''>Seleccione un usuario</option>
                                                                                                                    {
                                                                                                                        getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior.map((rol, i) => {
                                                                                                                            return (
                                                                                                                                <option key={rol.nombre_funcionario} value={rol.nombre_funcionario}>{rol.nombre_completo + ' ' + rol.apellido_completo}</option>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                </select>
                                                                                                            </>
                                                                                                            :
                                                                                                            getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.error
                                                                                                    }
                                                                                                </div>
                                                                                                :
                                                                                                <div className="col-md-6 text-center">
                                                                                                    PARA: <b>
                                                                                                        {
                                                                                                            getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.nombre_completo
                                                                                                                ?
                                                                                                                getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.nombre_completo
                                                                                                                :
                                                                                                                getGestorRespuestaApi?.data[0]?.attributes?.rol_anterior?.error
                                                                                                        }
                                                                                                    </b>
                                                                                                </div>
                                                                                        }
                                                                                        <br></br>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                            )
                                                            :
                                                            null
                                                    }
                                                    <div className='row'>                                                        
                                                        <div className='col-md-12'>
                                                            <div className="custom-control custom-switch custom-control-lg mb-2 text-center">
                                                                <input type="checkbox" checked={getSubirSirius} onChange={e => setSubirSirius(e.target.checked)} className="custom-control-input" id="subirSirius" name="subirSirius"/>
                                                                <label className="custom-control-label" htmlFor="subirSirius">¿SUBIR DOCUMENTACIÓN A SIRIUS?</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label htmlFor='aprobacion'>CONCEPTO DEL DOCUMENTO<span className='text-danger'>*</span></label>
                                                                <Field as="select" className='form-control' id='aprobacion' name='aprobacion' required>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    <option value="true">APROBAR</option>
                                                                    <option value="false">RECHAZAR</option>
                                                                </Field>
                                                                <ErrorMessage name='aprobacion' component={() => (<span className='text-danger'>{errors.aprobacion}</span>)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <div className="form-group">
                                                                <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="Detalle del concepto del documento" required
                                                                    maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                                <div className="text-right">
                                                                    <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                                </div>
                                                                <ErrorMessage name='descripcion' component={() => (<span className='text-danger'>{errors.descripcion}</span>)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className="col-md-12 text-right">
                                                            {
                                                                getHabilitarRegistrar
                                                                    ?
                                                                    <button type="submit" className="btn btn-rounded btn-primary">REGISTRAR</button>
                                                                    :
                                                                    null
                                                            }
                                                            <Link to={`/RamasProceso/`} state={{ from: from }}>
                                                                <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <br></br>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </>
                        )
                        :
                        null
                }
            </>
        );
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
            // const resultado = getFormatosApi.filter(datos => datos.attributes.nombre == extension);
            if (extension.toUpperCase() === 'PDF') {
                setHabilitarRegistrar(true)
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
                        list[index].id_mas_formato = 3;
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
                setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: 'LOS ARCHIVOS ADJUNTOS DEBE SER .PDF', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                window.showModal(1)
                setHabilitarRegistrar(false)
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
        obtenerPesoTotalArchivos(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputListArchivos([...inputListArchivos, { folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    };

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
                let mensajeExisteModal = "El nombre del archivo '" + nombre + "', ya es utilizado por otro documento registrado en el sistema, por favor elimine el archivo y vuelva a subirlo con un nombre distinto";
                setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: mensajeExisteModal.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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
            let mensajePeso = 'El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro.';
            setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: mensajePeso.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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

    const handleOnSubmitDocument = (valores) => {

        let band = false;

        // VALIDA QUE NO EXISTA EL NOMBRE REPÉTIDO EN EL SISTEMA
        let nombre = "";
        let existe = false;
        if (getListNombresArchivos?.attributes && getListNombresArchivos?.data.length > 0) {
            for (let i = 0; i < inputListArchivos.length; i++) {

                let nombre_servidor = getListNombresArchivos.data.find(dato => dato.attributes.nombre_archivo == inputListArchivos[i].archivo.name);

                if (nombre_servidor) {
                    nombre = nombre_servidor.attributes.nombre_archivo;
                    existe = true;
                    band = true;
                }

                if (existe) {
                    let mensajeModal = "El nombre del archivo '" + nombre + "', ya es utilizado por otro documento registrado en el sistema, por favor elimine el archivo y vuelva a subirlo con un nombre distinto";
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: mensajeModal.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showModal(1)
                    i = inputListArchivos.length + 1;
                }
            }
        }

        // VALIDA QUE NO SE PUEDAN SUBIR FORMATOS NO PERMITIDOS
        for (let i = 0; i < inputListArchivos.length; i++) {
            const extension = getFileExtension(inputListArchivos[i].archivo.name);
            const resultado = getFormatosApi.filter(datos => datos.attributes.nombre == extension);

            if (resultado.length <= 0) {
                let mensajeNoValido = 'Uno de los documentos adjuntados no tiene un formato correspondiente';
                setModalState({ title: "SINPROC NO " + radicado + " :: GESTOR RESPUESTA", message: mensajeNoValido.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                band = true;
            }
        }

        if (getPesoTotalArchivos > 15000000) {
            const pesoTotal = 'El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro.';
            setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: pesoTotal.toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
            band = true;
        }

        if (band === false) {

            // PASO 1. VALIDAR CON SIRIUS
            // PASO 1.1 LOGIN Y RADICACION

            // Se inicializa el array
            const attributes = [];

            // PASO 2. GUARDAR EN BASE DE DATOS
            inputListArchivos.forEach(archivo => {                
                attributes.push({
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": from.id_etapa,
                    "id_fase": from.id_fase,
                    "nombre_archivo": archivo.archivo.name,
                    "estado": "1",
                    "num_folios": archivo.folios,
                    "num_radicado": radicado,
                    "vigencia": vigencia,
                    "extension": getFileExtension(archivo.archivo.name),
                    "peso": archivo.archivo.size,
                    "created_user": getNombreUsuario,
                    "id_mas_formato": archivo.id_mas_formato,
                    "es_compulsa": false,
                    "es_soporte": false,
                    "aprobado": false,
                    "descripcion": valores.descripcion,
                    "version": 1,
                    "nuevo_documento": true,
                    "file64": archivo.filebase64,
                    "id_tipo_evaluacion": tipoEvaluacion ? tipoEvaluacion : global.Constants.TIPOS_EVALUACION.SIN_EVALUACION,
                    "subir_sirius": getSubirSirius
                })
            });

            // Se inicializa la variable con la informacion
            const data = {
                "data": {
                    "type": "documento_sirius",
                    "attributes": attributes
                }
            }

            window.showSpinner(true);

            GestorRespuestaApi.addGestorRespuestaDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        if (datos?.data?.attributes?.usuario_actual) {//ES UN CASO DE EXITO, PERO COLOCANDO FALSO, PERMITE REDIRIGR A LA 'RAMA DEL PROCESO' EN LUGAR DE 'MIS PENDIENTES'
                            setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: 'EL PROCESO DISCIPLINARIO ES ASIGNADO A ' + datos?.data?.attributes?.rol_siguiente?.nombre_completo.toUpperCase()  + ' DE LA DEPENDENCIA DE ' + getUser().nombre_dependencia.nombre, show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                        }
                        else {
                            setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: 'EL PROCESO DISCIPLINARIO ES ASIGNADO A ' + datos?.data?.attributes?.rol_siguiente?.nombre_completo.toUpperCase()  + ' DE LA DEPENDENCIA DE ' + getUser().nombre_dependencia.nombre, show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                        }
                    }
                    else {
                        setModalState({ title: getNombreProceso.toUpperCase() + " :: GESTOR RESPUESTA", message: datos.error.toString().toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )

        }
    }

    const showModal = () => {
        window.showModalListaVersionesGestorRespuesta();
    }

    /*
    * FUNIONES TEMPORALES -- CONSTRUIR COMPONENTE
    */

    return (
        <>
            {<ModalGen data={getModalState} />}
            {<ModalListaVersionesGestorRespuesta object={getGestorRespuestaApi} nombreProceso={getNombreProceso} />}
            {<Spinner />}


            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <small>Gestor Respuesta</small></li>
                    </ol>
                </nav>
            </div>


            <div className='content'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='block block-themed'>
                            <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                <h3 className='block-title'>{getNombreProceso} ::: GESTOR RESPUESTA</h3>
                                {
                                    (getGestorRespuestaApi?.data && getGestorRespuestaApi?.data.length > 0)
                                        ?
                                        <>
                                            <button type="button" className="btn btn-primary mr-2" data-toggle="tooltip" data-html="true" title="Consultar Versiones" onClick={() => showModal()} data-original-title="Consultar Versiones"><span className="fas fa-clipboard"> </span></button>
                                            {getGestorRespuestaApi?.data[0]?.attributes.grupo ? <label>GRUPO: {getGestorRespuestaApi?.data[0]?.attributes.grupo}</label> : null}
                                        </>
                                        :
                                        null
                                }
                            </div>
                            <div className='block-content'>
                                <div className='col-md-12 text-right my-2'>
                                    <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>
                                {
                                    (getGestorRespuestaApi?.data && getGestorRespuestaApi?.data.length > 0) ?
                                        (
                                            getGestorRespuestaApi?.data[0]?.attributes?.aprobado == "1" ||
                                            getGestorRespuestaApi?.data[0]?.attributes?.version != getGestorRespuestaApi?.data[1]?.attributes?.version
                                        ) ?
                                            componentAprobacion()
                                        :
                                            <>{ from.mismoUsuarioBuscador ? componentRegistro() : null }</>
                                    :
                                        <>{ from.mismoUsuarioBuscador ? componentRegistro() : null }</>
                                        
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default GestorRespuestaForm;
