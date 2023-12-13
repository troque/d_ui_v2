import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ParametrosMasApi from "./../../Api/Services/ParametrosMasApi";
import Spinner from '../../Utils/Spinner';
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/es';

import GenericApi from '../../Api/Services/GenericApi';
import DatePerson from '../../DatePerson/DatePerson';

function RegistroSeguimientoForm() {

    const location = useLocation();
    const { from, disable } = location.state;

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);

    const [getResultDiasNoLaborales, setResultDiasNoLaborales] = useState([]);
    const [getAnosAtrasInvalidos, setAnosAtrasInvalidos] = useState(1);
    const [getListaDocumentos, setListaDocumentos] = useState();

    const [getFechaIngresoSeguimiento, setFechaIngresoSeguimiento] = useState(null);

    const [getFinalizarSeguimiento, setFinalizarSeguimiento] = useState(false);
    const [getRegistrosSeguimientos, setRegistrosSeguimientos] = useState();
    const [getSeguimientoFinalizado, setSeguimientoFinalizado] = useState(false);

    const [getNombreProceso, setNombreProceso] = useState('');

    useEffect(() => {
        async function fetchData() {
            await getRegistroSeguimiento();
            await nombreProceso();
        }
        fetchData();
    }, []);

    const getRegistroSeguimiento = () => {

        window.showSpinner(true);

        GenericApi.getAllGeneric('registro-seguimiento/' + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setRegistrosSeguimientos(datos);
                    if (datos.data.length > 0) {
                        if (datos.data[0].attributes.finalizado == '1') {
                            setSeguimientoFinalizado(true);
                        }
                    }
                    cargarDocumentos(datos);
                }
                else {
                    setModalState({ title: getNombreProceso + " :: REGISTRO DE SEGUIMIENTO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    const cargarDocumentos = (listaDocumentosRegistrados) => {
        GenericApi.getAllGeneric('documento-sirius/get-nombres-documentos-radicados/' + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaDocumentos(datos);
                    const documentos = [];

                    datos.data.forEach(documento => {
                        let documento_encontrado = listaDocumentosRegistrados.data.find(registrado => registrado.attributes?.documento_sirius?.nombre_archivo == documento.attributes.nombre_archivo);

                        if (!documento_encontrado) {
                            documentos.push(documento)
                        }
                    });
                    const data = {
                        data: documentos
                    }

                    setListaDocumentos(data);

                    getDiasNoLaborales();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: REGISTRO DE SEGUIMIENTO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    function getDiasNoLaborales() {
        setResultDiasNoLaborales([]);
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
                    obtenerParametros();
                } else {
                    setModalState({ title: getNombreProceso + " :: REGISTRO DE SEGUIMIENTO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }


    
    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso",procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    obtenerParametros();
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
                        setModalState({ title: getNombreProceso + " :: REGISTRO DE SEGUIMIENTO", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const handleOnSubmit = (valores) => {

        window.showSpinner(true);

        const data = {
            "data": {
                "type": "registro_seguimiento",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_documento_sirius": valores.id_documento_sirius,
                    "descripcion": valores.descripcion,
                    "fecha_registro": getFechaIngresoSeguimiento,
                    "finalizado": getFinalizarSeguimiento
                }
            }
        }

        GenericApi.addGeneric('registro-seguimiento', data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso + " :: REGISTRO DE SEGUIMIENTO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: getNombreProceso + " :: REGISTRO DE SEGUIMIENTO", message: datos.error.toString(), show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.ERROR });
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
                        setModalState({ title: getNombreProceso + " :: REGISTRO DE SEGUIMIENTO", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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
        // console.log("Datos que recibo", contentType, base64Data, fileName, extension);
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const handleCallbackFechaSeguimiento = (childData) => {
        try {
            setFechaIngresoSeguimiento(childData)
        } catch (error) {

        }
    }


    const showModalListaRegistroSeguimiento = () => {
        window.showModalConsultarRegistroSeguimiento();
    }

    const componentForm = () => {
        return (
            <Formik
                initialValues={{
                    descripcion: '',
                    fechaIngresoSeguimiento: getFechaIngresoSeguimiento,
                    id_documento_sirius: ''
                }}
                validate={(valores) => {

                    let errores = {}

                    if (!valores.fechaIngresoSeguimiento && !getFechaIngresoSeguimiento) {
                        errores.fechaIngresoSeguimiento = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    if (!valores.descripcion) {
                        errores.descripcion =  global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    setCountTextArea(valores.descripcion.length);

                    if (valores.descripcion && valores.descripcion.length < getMinimoTextArea) {
                        errores.descripcion = 'DEBE TENER MÍNIMO ' + getMinimoTextArea + ' CARACTERES'
                    }

                    if (valores.descripcion) {
                        if (containsSpecialChars(valores.descripcion))
                            errores.descripcion = 'TIENE CARACTERES INVALIDOS'
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
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor='fechaIngresoSeguimiento'>FECHA DE INGRESO DE SEGUIMIENTO <span className="text-danger">*</span></label>
                                        <DatePerson resultDiasNoLaborales={getResultDiasNoLaborales} getAnosAtrasInvalidos={getAnosAtrasInvalidos}
                                            parentCallback={handleCallbackFechaSeguimiento} id="fechaIngresoSeguimiento" name="fechaIngresoSeguimiento"
                                            bloqueaDiasFuturos={true} />
                                        <ErrorMessage name="fechaIngresoSeguimiento" component={() => (<span className="text-danger">{errors.fechaIngresoSeguimiento}</span>)} />
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <label htmlFor="id_documento_sirius">DOCUMENTO</label>
                                        <Field as='select' className='form-control' id='id_documento_sirius' name='id_documento_sirius'>
                                            <option value=''>Seleccione un documento</option>
                                            {
                                                getListaDocumentos?.data.map((documento, i) => {
                                                    return (
                                                        <option key={documento.id} value={documento.id}>{documento.attributes.nombre_archivo} | {documento.attributes.sirius_track_id}</option>
                                                    )
                                                })
                                            }
                                        </Field>
                                        <ErrorMessage name="id_documento_sirius" component={() => (<span className="text-danger">{errors.id_documento_sirius}</span>)} />
                                    </div>
                                </div>
                            </div>

                            <br></br>

                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="descripcion">OBSERVACIONES <span className="text-danger">*</span></label>
                                        <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="Observaciones para el seguimiento" required
                                            maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name='descripcion' component={() => (<span className='text-danger'>{errors.descripcion}</span>)} />
                                    </div>
                                </div>
                            </div>

                            <br></br>

                            <div className='row'>
                                <div className='col-md-12 text-center'>
                                    <div className="form-group">
                                        {
                                            <input type="checkbox" className="form-check-input" id="cierre_informacion_cierre" name="cierre_informacion_cierre" onChange={() => setFinalizarSeguimiento(!getFinalizarSeguimiento)} />

                                        }
                                        <label className="form-check-label" htmlFor="usuario_unico">¿CON LA INFORMACIÓN REGISTRADA DESDEA FINALIZAR EL SEGUIMIENTO?</label>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className="col-md-12 text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">{getFinalizarSeguimiento ? ' REGISTRAR Y FINALIZAR SEGUIMIENTO' : ' REGISTRAR SEGUIMIENTO'}</button>
                                    <Link to={`/RamasProceso/`} state={{ from: from }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
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

    function listRegistroSeguimiento() {
        return (
            getRegistrosSeguimientos?.data.map((seguimiento, i) => {
                return (
                    <tr className='text-uppercase'>
                        <td>{seguimiento.attributes.registrado_por}</td>
                        <td>{seguimiento.attributes.fecha_creacion}</td>
                        <td>{seguimiento.attributes.observaciones}</td>
                        <td>{
                            seguimiento.attributes.documento_sirius
                                ?
                                <div className='col-md-2'>
                                    <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo(seguimiento.attributes.documento_sirius, false)}><i className="fas fa-download"></i></button>
                                </div>
                                :
                                null
                            }
                        </td>
                    </tr>
                )
            })
        )
    }


    function modalListRegistroSeguimiento() {
        return (
            <div className="modal fade" id="modal-consultar-registro-seguimiento" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-popout" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">{getNombreProceso} :: HISTÓRICO DE SEGUIMIENTO</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">
                                <table className="table table-vcenter">

                                    <thead>
                                        <tr>
                                            <th>REGISTRADO POR:</th>
                                            <th>FECHA DE SEGUIMIENTO</th>
                                            <th>OBSERVACIONES</th>                                         
                                            <th>DOCUMENTO</th>                                          
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {listRegistroSeguimiento()}
                                    </tbody>

                                </table>    
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-sm btn-primary" data-dismiss="modal">{'CERRAR'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {<ModalGen data={getModalState} />}
            {modalListRegistroSeguimiento()}
            {<Spinner />}
        
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <small>Registro de seguimiento</small></li>
                    </ol>
                </nav>
            </div>

            <div className='content'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='block block-themed'>
                            <div className='block-header'>
                                <h3 className='block-title'>{getNombreProceso} :: REGISTRO DE SEGUIMIENTO</h3>
                                <div className='text-right'>
                                    {
                                        getRegistrosSeguimientos && !getSeguimientoFinalizado
                                            ?
                                            <>
                                                <button type="button" className="btn btn btn-success mr-1 mb-3" data-toggle="tooltip" data-html="true" title="Consultar Listas Previas" onClick={(e) => showModalListaRegistroSeguimiento()} data-original-title="Consultar Versiones"><span className="fas fa-clipboard"> </span></button>
                                            </>
                                            :
                                            null
                                    }
                                </div>

                            </div>
                            <div className='block-content'>
                                <div className='col-md-12 text-right my-2'>

                                    <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>

                                </div>
                                {
                                    getSeguimientoFinalizado
                                    ?
                                        <table className="table table-vcenter">
                                            <thead>
                                                <tr>
                                                    <th>REGISTRADO POR:</th>
                                                    <th>FECHA DE SEGUIMIENTO</th>
                                                    <th>OBSERVACIONES</th>
                                                    <th>DOCUMENTO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listRegistroSeguimiento()}
                                            </tbody>
                                        </table>
                                    :
                                        (from.mismoUsuarioBuscador ? componentForm() : null)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}

export default RegistroSeguimientoForm;
