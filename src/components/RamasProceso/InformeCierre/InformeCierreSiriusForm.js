import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ParametrosMasApi from "./../../Api/Services/ParametrosMasApi";
import Spinner from '../../Utils/Spinner';
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';

function InformeCierreSiriusForm() {

    const location = useLocation();
    const { from, disable } = location.state;

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [getInformeCierre, setInformeCierre] = useState({});
    const [getInformeCierreSirius, setInformeCierreSirius] = useState(false);

    const [getRespuestaSoporteRadicadoSirius, setRespuestaSoporteRadicadoSirius] = useState(false);
    const [getSoporteRadicadoListaSirius, setSoporteRadicadoListaSirius] = useState();
    const [getSoporteRadicadoLista, setSoporteRadicadoLista] = useState();

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getFormatosApi, setFormatosApi] = useState();
    const [getDescripcionLarga, setDescripcionLarga] = useState();

    const [getArchivarTutela, setArchivarTutela] = useState(false);
    const [getNombreProceso, setNombreProceso] = useState('');

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();
        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    getInfoInformeCierre();
                }
            }
        )
    }

    function getInfoInformeCierre() {
        GenericApi.getGeneric("informe-cierre/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    if (datos.data != "") {
                        setInformeCierre(datos);
                        setInformeCierreSirius(true);
                    }
                    getInfoInformeCierreRespuesta();
                } else {
                    setModalState({ title: getNombreProceso + " :: INFORMACIÓN CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    function getInfoInformeCierreRespuesta() {
        GenericApi.getGeneric("documento-sirius/get-documentos-radicados-etapa-fase/" + procesoDisciplinarioId + '/' + global.Constants.ETAPAS.EVALUACION + '/' + global.Constants.FASES.INFORME_CIERRE).then(
            datos => {
                if (!datos.error) {
                    if (datos.data != "") {
                        setSoporteRadicadoLista(datos);
                    }
                    obtenerParametros();
                } else {
                    setModalState({ title: getNombreProceso + " :: INFORMACIÓN CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
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
                        setModalState({ title: getNombreProceso + " :: INFORMACIÓN CIERRE", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    const handleOnSubmit = (valores) => {

        window.showSpinner(true);
        console.log(valores.documento_sirius, valores);
        let documento_sirius = getSoporteRadicadoListaSirius?.documentoDTOList.find(documento => documento.idDocumento == valores.documento_sirius);

        const data = {
            "data": {
                "type": "informe_cierre",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": global.Constants.ETAPAS.EVALUACION,
                    "id_fase": global.Constants.FASES.INFORME_CIERRE,
                    "radicado_sirius": valores.radicado_sirius,
                    "documento_sirius": valores.documento_sirius,
                    "descripcion": valores.descripcion,
                    "nombre_archivo": documento_sirius.nombreDocumento,
                    "numero_folios": 1,
                    "radicado": radicado,
                }
            }
        }

        GenericApi.addGeneric('informe-cierre', data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso + " :: INFORMACIÓN CIERRE", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: getNombreProceso + " :: INFORMACIÓN CIERRE", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )

    }

    function buscarExpediente(radicado_sirius) {
        window.showSpinner(true);
        setRespuestaSoporteRadicadoSirius(false)
        DocumentoSiriusApi.getDocumentacionSiriusByRadicadoSirius(radicado_sirius).then(
            datos => {
                if (!datos.error) {
                    console.log("Datos consultados", datos);
                    setSoporteRadicadoListaSirius(datos);
                    setRespuestaSoporteRadicadoSirius(true);
                    window.showModal(6);
                }
                else {
                    setModalState({ title: getNombreProceso + " ::  INFORMACIÓN CIERRE", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
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

    const handleClicArchivo = (documento_sirius, es_compulsa) => {
        try {
            window.showSpinner(true);

            let id_documento_sirius = null;
            let extension = null;
            let radicado_archivo = radicado;
            //let vigencia_archivo = vigencia;
            let consulta_sirius = false;
            let version_label = null;
            let nombre_documento = '';


            id_documento_sirius = documento_sirius?.id ? documento_sirius?.id : documento_sirius?.uuid;
            nombre_documento = documento_sirius?.attributes?.nombre_archivo ? documento_sirius.attributes.nombre_archivo : documento_sirius.nombre_archivo;
            extension = documento_sirius?.attributes?.extension ? documento_sirius.attributes.extension : documento_sirius.extension

            const data = {
                "data": {
                    "type": "documento_sirius",
                    "attributes": {
                        "radicado": radicado_archivo,
                        "vigencia": null,
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
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: INFORMACIÓN CIERRE", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
            window.showSpinner(false);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        console.log("Datos que recibo", contentType, base64Data, fileName, extension);
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const componentForm = () => {
        return (
            <Formik
                initialValues={{
                    descripcion: '',
                    radicado_sirius: '',
                    documento_sirius: ''
                }}
                enableReinitialize
                validate={(valores) => {

                    let errores = {}

                    if (!valores.radicado_sirius) {
                        errores.radicado_sirius = errores.folio = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (!valores.documento_sirius) {
                        errores.documento_sirius = errores.folio = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (!valores.descripcion) {
                        errores.descripcion = errores.folio = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    setCountTextArea(valores.descripcion.length);

                    if (valores.descripcion && valores.descripcion.length < getMinimoTextArea) {
                        errores.descripcion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES'
                    }

                    if (valores.descripcion) {
                        if (containsSpecialChars(valores.descripcion))
                            errores.descripcion = errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    handleOnSubmit(valores);
                }}
            >
                {({ errors, values }) => (
                    <Form>
                        <>
                            <div className='row'>
                                <div className="col-md-12 text-center alert alert-success">
                                    LA INFORMACIÓN REFERENTE AL CIERRE DEL PROCESO AÚN NO HA SIDO REGISTRADA
                                </div>
                            </div>

                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="descripcion">OBSERVACIONES</label>
                                        <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="Observaciones para el cierre del proceso" required
                                            maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name='descripcion' component={() => (<span className='text-danger'>{errors.descripcion}</span>)} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className="col-md-12 alert alert-warning alert-dismissable text-uppercase">
                                    <strong className="alert-heading font-size-h4 my-2">Advertencia</strong>
                                    <p className="mb-0"> El número de radicado SIRIUS que se va asociar a este expediente, debe tener las siguientes condiciones:</p>
                                    <ul>
                                        <li>Debe existir en el sistema de gestión documental de SIRIUS.</li>
                                        <li>Debe ser unico y no debe haber sido utilizado en otro expediente.</li>
                                        <li>Debe tener documentos anexos.</li>
                                    </ul>
                                </div>
                            </div>


                            <div className='row'>

                                <div className='col-md-7'>
                                    <div className="form-group">
                                        <label htmlFor="radicado_sirius">No. RADICADO SIRIUS</label>
                                        <div className="input-group">
                                            <Field type="text" className="form-control form-control-alt" id="radicado_sirius" name="radicado_sirius" placeholder="No radicado SIRIUS"></Field>
                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-rounded btn-primary" disabled={values.radicado_sirius ? false : true} onClick={() => buscarExpediente(values.radicado_sirius)}>
                                                    BUSCAR
                                                </button>
                                            </div>
                                        </div>
                                        <ErrorMessage name="radicado_sirius" component={() => (<span className="text-danger">{errors.radicado_sirius}</span>)} />
                                    </div>
                                </div>

                                {/*<div className='col-md-5'>
                                    <div className="form-group">
                                        <label htmlFor="radicado_sirius">No radicado SIRIUS</label>
                                        <Field className="form-control" id="radicado_sirius" name="radicado_sirius" placeholder="No radicado SIRIUS"></Field>
                                        <ErrorMessage name="radicado_sirius" component={() => (<span className="text-danger">{errors.radicado_sirius}</span>)} />
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className='text-right'>
                                        <button type="button" className="btn btn-primary" onClick={() => buscarExpediente(values.radicado_sirius)}><i className="fa fa-fw fa-search"></i></button>
                                    </div>
                </div>*/}

                                {
                                    getRespuestaSoporteRadicadoSirius
                                        ?
                                        <div className='col-md-5'>
                                            <div className="form-group">
                                                <label htmlFor="documento_sirius">DOCUMENTOS SIRIUS</label>
                                                <Field as='select' className='form-control' id='documento_sirius' name='documento_sirius' required>
                                                    <option value=''>Seleccione un documento</option>
                                                    {
                                                        getSoporteRadicadoListaSirius?.documentoDTOList.map((documento, i) => {
                                                            return (
                                                                <option key={documento.idDocumento} value={documento.idDocumento}>{documento.nombreDocumento}</option>
                                                            )
                                                        })
                                                    }
                                                </Field>
                                                <ErrorMessage name="documento_sirius" component={() => (<span className="text-danger">{errors.documento_sirius}</span>)} />
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </div>


                            <div className='row'>
                                <div className="col-md-12 text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">ASOCIAR</button>
                                    <Link to={`/RamasProceso/`} state={{ from: from }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                    </Link>
                                </div>
                            </div>
                            <br></br>

                        </>
                    </Form>

                )}
            </Formik>
        )
    }

    const componentDocumentoRegistrado = () => {
        return (
            <>
                <div className='row text-uppercase'>
                    <div className="col-md-4">
                        <b>Fecha de cierre: </b> {getInformeCierre?.data[0]?.attributes?.fecha_creacion}
                    </div>
                    <div className="col-md-4">
                        <b>SIRIUS: </b> {getInformeCierre?.data[0]?.attributes?.radicado_sirius}
                    </div>
                    <div className="col-md-4">
                        <button type='button' title='Descargar documento' className='btn btn-primary' onClick={() => handleClicArchivo(getInformeCierre?.data[0]?.attributes?.documento_soportes, false)}><i className="fas fa-download"></i></button>
                    </div>
                </div>
                <div className='row text-uppercase'>
                    <div className="col-md-12">
                        <b>Observación de Cierre: </b> {getInformeCierre?.data[0]?.attributes?.observaciones}
                    </div>
                    <div className="col-md-12">
                        <b>Cerrado por: </b> {getInformeCierre?.data[0]?.attributes?.registrado_por}
                    </div>
                    <div className="col-md-12">
                        <b>Cerrado en: </b> {getInformeCierre?.data[0]?.attributes?.dependencia?.nombre}
                    </div>
                </div>
                <br></br>
                {
                    getInformeCierre?.data[getInformeCierre?.data.length - 1]?.attributes?.finalizado == '0' && from.mismoUsuarioBuscador
                        ?
                        <div className='row'>
                            <div className="col-md-12 text-right">
                                <Link to={`/InformeCierreDocumentoForm/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-primary">REGISTRAR RESPUESTA</button>
                                </Link>
                            </div>
                        </div>
                        :
                        null
                }
                <br></br>
            </>
        )
    }

    const cargarTablaInformacionCierre = () => {
        return (
            getSoporteRadicadoLista.data.map((documento_sirius, i) => {
                return (
                    i > 0
                        ?
                        <tr key={documento_sirius.id}>
                            <td width="10%" className="text-center">{i}</td>
                            <td width="20%">{documento_sirius.attributes.created_at}</td>
                            <td>
                                {documento_sirius.attributes.descripcion_corta}
                            </td>
                            <td>
                                {documento_sirius.attributes.nombre_completo}
                            </td>
                            <td>
                                <button type='button' title='Descargar documento' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo(documento_sirius, false)}><i className="fas fa-download"></i></button>
                                <button type='button' title='Consultar Descripcion' className='btn btn-sm btn-primary' data-toggle="modal" data-target={'#modal-consultar-detalle'} onClick={() => setDescripcionLarga(documento_sirius.attributes.descripcion)}><i className="fas fa-search"></i></button>
                                {componentModalListaDetalleCambios()}
                            </td>
                        </tr>
                        :
                        null
                )
            })
        )
    }

    const componentModalListaDetalleCambios = () => {
        return (
            <div className="modal fade" id={'modal-consultar-detalle'} tabIndex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document" >
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">DETALLE DEL CAMBIO EN INFORMACIÓN CIERRE</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content" style={{ 'height': '300px', 'overflow': 'scroll', 'display': 'block' }}>
                                Observaciones: {getDescripcionLarga}<br /><br />
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const componentListDocumentosAnexos = () => {
        return (
            <>
                <div className='row'>
                    <div className="col-md-12">
                        <b>Otros documentos asociados al cierre del expediente</b>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-12">
                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                            <thead>
                                <tr>
                                    <th className="text-center">No.</th>
                                    <th>Fecha de registro</th>
                                    <th>Observación</th>
                                    <th>Registrado por</th>
                                    <th>Archivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargarTablaInformacionCierre()}
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    getInformeCierre?.data[getInformeCierre?.data.length - 1]?.attributes?.finalizado == '0' && getInformeCierre?.data[getInformeCierre?.data.length - 1]?.attributes?.tipo_expediente.id_tipo_expediente == global.Constants.TIPOS_EXPEDIENTES.TUTELA && from.mismoUsuarioBuscador
                        ?
                        <div className='row'>
                            <div className='col-md-12 text-center'>
                                <div className="form-group text-uppercase">
                                    <input type="checkbox" className="form-check-input" id="cierre_informacion_cierre" name="cierre_informacion_cierre" onChange={() => setArchivarTutela(!getArchivarTutela)} checked={getArchivarTutela} />
                                    <label className="form-check-label" htmlFor="usuario_unico">¿Con la información registrada se puede proceder archivar este expediente?</label>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }


                {
                    getArchivarTutela
                        ?
                        <div className='row'>
                            <div className="col-md-12 text-right text-uppercase">
                                <button onClick={() => archivarExpediente()} className="btn btn-rounded btn-primary"> <i className="fas fa-save"></i> ARCHIVAR PROCESO DISCIPLINARIO</button>
                            </div>
                        </div>
                        :
                        null
                }

                <br></br>

            </>
        )
    }

    function archivarExpediente() {
        window.showSpinner(true);
        GenericApi.getGeneric('informe-cierre/archivar/' + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "SINPROC No " + radicado + " :: Informe Cierre", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "SINPROC No " + radicado + " :: Informe Cierre", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
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
                        <li className="breadcrumb-item"> <small>Informe Cierre</small></li>
                    </ol>
                </nav>
            </div>


            <div className='content'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='block block-themed'>
                            <div className='block-header'>
                                <h3 className='block-title'>{getNombreProceso} ::: INFORME CIERRE</h3>
                            </div>
                            <div className='block-content'>
                                <div className='col-md-12 text-right my-2'>

                                    <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>

                                </div>
                                {
                                    getInformeCierreSirius
                                        ?
                                        componentDocumentoRegistrado()
                                        :
                                        (from.mismoUsuarioBuscador ? componentForm() : null)
                                }
                                {
                                    getInformeCierreSirius && getSoporteRadicadoLista && getSoporteRadicadoLista?.data.length > 1
                                        ?
                                        componentListDocumentosAnexos()
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}

export default InformeCierreSiriusForm;
