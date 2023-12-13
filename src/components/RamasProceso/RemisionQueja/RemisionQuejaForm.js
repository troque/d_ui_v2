import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import RemisionQuejaApi from '../../Api/Services/RemisionQuejaApi';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import { Navigate, useParams } from "react-router";
import { Link, useLocation } from 'react-router-dom';
import ParametrosMasApi from "./../../Api/Services/ParametrosMasApi";
import InfoExitoApiCustom from '../../Utils/InfoExitoApiCustom';
import InfoExitoApiTextsCustom from '../../Utils/InfoExitoApiTextsCustom';
import GenericApi from '../../Api/Services/GenericApi';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import Spinner from '../../Utils/Spinner';
function RemisionQuejaForm() {

    const [errorVariablesApi, setErrorVariablesApi] = useState({});
    const [respuestaVariablesApi, setRespuestaVariablesApi] = useState(false);
    const [expedienteApi, setExpedienteApi] = useState([]);
    const [respuestaExpedienteApi, setRespuestaExpedienteApi] = useState(false);
    const [datosFormExpediente, setDatosFormExpediente] = useState();
    const [respuestaDependenciaOrigen, setRespuestaDependenciaOrigen] = useState(false);
    const [listaDependenciaOrigen, setListaDependenciaOrigen] = useState({ data: {} });
    const [getRemisionQueja, setRemisionQueja] = useState({});
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getDependenciaConsultada, setDependenciaConsultada] = useState('');
    

    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let tipoEvaluacion = from.tipoEvaluacion;
    let tipoEvaluacionNombre = from.tipoEvaluacionNombre;
    let fase = 'Remision queja incorporacion'; /*Este dato se establece para obtener la información necesaria del API teniendo en cuenta la fase*/

    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);
            nombreProceso();
        }

        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso",from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    cargarDatosRemisionQueja();
                }
                else{
                    setModalState({  title: getNombreProceso + " :: REMISIÓN QUEJA", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    function cargarDatosRemisionQueja() {
       
        RemisionQuejaApi.getRemisionQueja(procesoDisciplinarioId).then( 
            datos => {
                if (!datos.error) {
                    if (datos.data.attributes) {
                        setRemisionQueja(datos);
                        window.showSpinner(false);
                    }
                    else {
                        if (tipoEvaluacion == 3) { //INCORPORACION
                            cargarDependenciaApi(global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_INCORPORACION);
                        }
                        else if (tipoEvaluacion == 5) { //REMISORIO INTERNO
                            cargarDependenciaApi(global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_REMISORIO_INTERNO);
                        }
                        else {
                            window.showSpinner(false);
                        }
                    }
                }
                else {
                    setModalState({ title: getNombreProceso + " :: REMISIÓN QUEJA", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }

    function cargarDependenciaApi(accesoDependencia) {
        //GenericApi.getByIdGeneric('mas-dependencia-filtrado', accesoDependencia).then(
        GenericApi.getByIdGeneric('mas-dependencia-filtrado-remision-queja', accesoDependencia).then(
            datos => {
                if (!datos.error) {
                    setListaDependenciaOrigen(datos);
                    setRespuestaDependenciaOrigen(true)
                }
                else {
                    setModalState({ title: getNombreProceso + " :: REMISIÓN QUEJA", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        );
    }

    const validarDatos = (datos) => {

        window.showSpinner(true);

        setDatosFormExpediente(datos);

        const data = {
            "data": {
                "type": "remision_queja",
                "attributes": {
                    "consulta": true,
                    "id_dependencia_destino": datos.dependencia,
                    "expediente": datos.expediente,
                    "vigencia": datos.vigencia,
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_tipo_evaluacion": tipoEvaluacion
                }
            }
        }

        GenericApi.getByDataGeneric('remision-queja/validacion-expediente',data).then(
            datos => {
                if (!datos.error) {
                    setExpedienteApi(datos.data);
                    setRespuestaVariablesApi(false);
                    setRespuestaExpedienteApi(true);
                }
                else {

                    setRespuestaExpedienteApi(false);
                    setRespuestaVariablesApi(false);

                    if (datos.variables) {
                        setErrorVariablesApi(datos);
                        setRespuestaVariablesApi(true);
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: REMISIÓN QUEJA", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
                window.showSpinner(false);
            }
        )
    }

    const guardarDatos = (valores) => {

        window.showSpinner(true);

        let data;

        if (tipoEvaluacion == 1) {//EVALUACION COMISORIO EJE

            data = {
                "data": {
                    "type": "remision_queja",
                    "attributes": {
                        "consulta": false,
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_tipo_evaluacion": tipoEvaluacion,
                        "id_tipo_dependencia_acceso": global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_COMISORIO_EJE,
                        "id_dependencia_destino": null
                    }
                }
            }

        }
        else if (tipoEvaluacion == 3) {

            data = {
                "data": {
                    "type": "remision_queja",
                    "attributes": {
                        "consulta": false,
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_tipo_evaluacion": tipoEvaluacion,
                        "id_tipo_dependencia_acceso": global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_INCORPORACION,
                        "id_dependencia_destino": datosFormExpediente.dependencia,
                        "expediente": datosFormExpediente.expediente,
                        "vigencia": datosFormExpediente.vigencia,
                        "id_proceso_disciplinario_expediente": expedienteApi.id,
                        "version": 305
                    }
                }
            }

        }
        else if (tipoEvaluacion == 5) {
            data = {
                "data": {
                    "type": "remision_queja",
                    "attributes": {
                        "consulta": false,
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_tipo_evaluacion": tipoEvaluacion,
                        "id_tipo_dependencia_acceso": global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_REMISORIO_INTERNO,
                        "id_dependencia_destino": valores.dependencia
                    }
                }
            }
        }

        RemisionQuejaApi.addIncorporacionExpediente(data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso + " :: REMISIÓN QUEJA", message: 'EL PROCESO DISCIPLINARIO SERÁ ASIGNADO A ' + datos.data.attributes.usuario_jefe_destino.nombre.toUpperCase() + ' DE LA DEPENDENCIA DE ' + datos.data.attributes.dependencia_destino.nombre.toUpperCase() + ' CUANDO SE CIERRE LA ETAPA ', show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: getNombreProceso + " :: REMISIÓN QUEJA", message: datos.error.toString().toUpperCase(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )

    }

    /*
    * Componentes
    */

    const componentSelectDependenciaOrigen = () => {
        return (
            listaDependenciaOrigen.data.map((dependencia, i) => {
                return (
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                )
            })
        )
    }

    const componentComisorioEjeForm = () => {
        return (
            <>
                <Formik
                    initialValues={{
                        dependencia: '',
                        expediente: '',
                        vigencia: ''
                    }}
                    enableReinitialize
                    validate={(valores) => {
                        let errores = {};
                        return errores;
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        guardarDatos();
                    }}>
                    {({ errors }) => (
                        <Form>
                            <div className='row'>
                                <div className='block-content block-content-full text-center'>
                                    <button type='submit' className='btn btn-rounded btn-primary'>
                                        <i className='fa fa-bezier-curve'></i> ASIGNACIÓN ALEATORIA
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    const componentIncorporacionForm = () => {
        return (
            <>
                <Formik
                    initialValues={{
                        dependencia: '',
                        expediente: '',
                        vigencia: ''
                    }}
                    enableReinitialize
                    validate={(valores) => {
                        let errores = {};

                        if (!valores.dependencia) {
                            errores.dependencia = 'DEBE SELECCIONAR LA DEPENDENCIA';
                        }

                        if (!valores.expediente) {
                            errores.expediente = 'DEBE DIGITAR EL NÚMERO DE EXPEDIENTE';
                        }

                        if (!valores.vigencia) {
                            errores.vigencia = 'DEBE DIGITAR LA VIGENCIA';
                        }

                        return errores;
                    }}
                    onSubmit={(valores, { resetForm }) => {                        
                        setDependenciaConsultada(
                            listaDependenciaOrigen.data.map((dependencia, i) => {
                                console.log(dependencia.id + " === " + valores.dependencia, dependencia.id  ===  valores.dependencia);
                                if(dependencia.id === valores.dependencia){
                                    return dependencia.attributes.nombre
                                }
                            })
                        );
                        validarDatos(valores);
                    }}>
                    {({ errors }) => (
                        <Form>
                            <div className='row'>

                                <div className='col-md-12 mt-3'>
                                    <label className="text-uppercase" htmlFor='dependencia'>DEPENDENCIA <span className='text-danger'>*</span></label>
                                    <Field as='select' className='form-control' id='dependencia' name='dependencia'>
                                        <option value=''>Seleccione la dependencia</option>
                                        {respuestaDependenciaOrigen ? componentSelectDependenciaOrigen() : null}
                                    </Field>
                                    <ErrorMessage name='dependencia' component={() => (<span className='text-danger'>{errors.dependencia}</span>)} />
                                </div>

                                <div className='col-md-6 mt-3'>
                                    <label className="text-uppercase" htmlFor='expediente'>No. DE EXPEDIENTE <span className='text-danger'>*</span></label>
                                    <Field className='form-control' id='expediente' name='expediente'></Field>
                                    <ErrorMessage name='expediente' component={() => (<span className='text-danger'>{errors.expediente}</span>)} />
                                </div>

                                <div className='col-md-6 mt-3'>
                                    <label className="text-uppercase" htmlFor='vigencia'>VIGENCIA DEL EXPEDIENTE <span className='text-danger'>*</span></label>
                                    <Field className='form-control' id='vigencia' name='vigencia'></Field>
                                    <ErrorMessage name='vigencia' component={() => (<span className='text-danger'>{errors.vigencia}</span>)} />
                                </div>

                                <div className='block-content block-content-full text-right'>
                                    <button type='submit' className='btn btn-rounded btn-outline-primary text-uppercase'>
                                        <i className='fa fa-fw fa-search'></i> VALIDAR EXPEDIENTE
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    const componentRemisorioInternoForm = () => {
        return (
            <>
                <Formik
                    initialValues={{
                        dependencia: '',
                        expediente: '',
                        vigencia: ''
                    }}
                    enableReinitialize
                    validate={(valores) => {
                        let errores = {};

                        if (!valores.dependencia) {
                            errores.dependencia = 'DEBE SELECCIONAR UNA DEPENDENCIA';
                        }

                        return errores;
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        guardarDatos(valores);
                    }}>
                    {({ errors }) => (
                        <Form>
                            <div className='row'>

                                <div className='col-md-12'>
                                    <label className="text-uppercase" htmlFor='dependencia'>DEPENDENCIA <span className='text-danger'>*</span></label>
                                    <Field as='select' className='form-control' id='dependencia' name='dependencia'>
                                        <option value=''>Seleccione la dependencia</option>
                                        {respuestaDependenciaOrigen ? componentSelectDependenciaOrigen() : null}
                                    </Field>
                                    <ErrorMessage name='dependencia' component={() => (<span className='text-danger'>{errors.dependencia}</span>)} />
                                </div>

                                <div className='block-content block-content-full text-right'>
                                    <button type='submit' className='btn btn-rounded btn-primary'>
                                        {global.Constants.BOTON_NOMBRE.REGISTRAR}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    const componentErrorIncorporacion = () => {
        return (
            <>
                <div className='row text-uppercase'>
                    <div className='col-md-12'>
                        <div className='alert alert-danger' role='alert'>
                            <p className='mb-0 text-center'><b>INCONSISTENCIA EN LOS DATOS INGRESADOS</b></p>
                            <p className='mb-0'>
                                { errorVariablesApi.error } 
                                <br></br>
                                SI POSTERIOR A LA REVISIÓN DE LOS DATOS DEL EXPEDIENTE A INCORPORAR PERSISTE EL PRESENTE MENSAJE, POR FAVOR CONTACTE A LA DIRECCIÓN TIC E INFORME LA PRESENTE ALERTA.</p><br></br>
                            <b>* DEPENDENCIA: </b>{errorVariablesApi.variables.dependencia ? getDependenciaConsultada : null}<br></br>
                            <b>* RADICADO: </b>{errorVariablesApi.variables.expediente ? errorVariablesApi.variables.expediente : null}<br></br>
                            <b>* VIGENCIA: </b>{errorVariablesApi.variables.vigencia ? errorVariablesApi.variables.vigencia : null}<br></br>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const formularioEvaluacion = () => {

        if (tipoEvaluacion == 1) {
            return componentComisorioEjeForm();
        }
        else if (tipoEvaluacion == 3) {
            return (
                <>
                    {componentIncorporacionForm()}
                    {respuestaVariablesApi ? componentErrorIncorporacion() : null}
                    {respuestaExpedienteApi ? componentInformeExpendiente() : null}
                </>
            )
        }
        else if (tipoEvaluacion == 5) {
            return componentRemisorioInternoForm();
        }

    }

    const componentInformeExpendiente = () => {

        return (
            <>
                <div className='row text-uppercase'>
                    <div className='col-md-12 text-center'>
                        <label>DATOS DEL EXPEDIENTE A INCORPORAR</label>
                    </div>

                    <div className='col-md-12'>
                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                            <tbody>
                                <tr>
                                    <th>DATOS CONSULTADOS</th>
                                    <td>RADICADO {datosFormExpediente.expediente} - VIGENCIA {datosFormExpediente.vigencia}</td>
                                </tr>
                                <tr>
                                    <th>HECHOS</th>
                                    <td>
                                        FECHA RADICACIÓN: {expedienteApi?.attributes?.fecha_registro}<br></br>
                                        ANEXOS: {expedienteApi?.attributes?.anexos}<br></br>
                                        ASUNTO: {expedienteApi?.attributes?.antecedente?.descripcion}<br></br>
                                        OBSERVACIONES: {expedienteApi?.attributes?.usuario?.nombre + " " + expedienteApi?.attributes?.usuario?.apellido}
                                    </td>
                                </tr>
                                <tr>
                                    <th>DEPENDENCIA ACTUAL</th>
                                    <td>{expedienteApi?.attributes?.dependencia_duena?.nombre ? expedienteApi?.attributes?.dependencia_actual?.nombre : 'SIN INFORMACIÓN'}</td>
                                </tr>
                                <tr>
                                    <th>DEPENDENCIA DUEÑA</th>
                                    <td>{expedienteApi?.attributes?.dependencia_duena?.nombre ? expedienteApi?.attributes?.dependencia_duena?.nombre : 'SIN INFORMACIÓN'}</td>
                                </tr>
                                <tr>
                                    <th>ETAPA ACTUAL</th>
                                    <td>{expedienteApi?.attributes?.nombre_etapa ? expedienteApi?.attributes?.nombre_etapa : null}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {
                        (!!expedienteApi?.attributes?.dependencia_duena?.id && !!datosFormExpediente.dependencia && parseInt(expedienteApi?.attributes?.dependencia_duena?.id) == parseInt(datosFormExpediente.dependencia)) ?
                            (
                                <div className='col-md-12 text-uppercase'>
                                    <div className='block-content block-content-full text-center'>
                                        <button onClick={() => guardarDatos()} className='btn btn-rounded btn-primary'>
                                            <i className='fa fa-fw fa-save'></i> GUARDAR Y ASIGNAR
                                        </button>
                                    </div>
                                </div>
                            ) :
                            (
                                <div className='col-md-12 text-uppercase'>
                                    <div className='alert alert-danger' role='alert'>
                                        <p className='mb-0 text-center'><b>ATENCIÓN</b></p>
                                        <p className='mb-0 text-center'> LA DEPENDENCIA SELECCIONADA <b>NO</b> CORRESPONDE CON LA DEPENDENCIA ACTUAL DEL EXPEDIENTE.</p>
                                    </div>
                                </div>
                            )
                    }

                </div>
            </>
        );
    }

    const componentInformacion = () => {
        return (
            <>
                <div className='content text-uppercase'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='block block-themed'>

                                <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                    <h3 className='block-title'>{getNombreProceso} ::: REMISIÓN QUEJA</h3>
                                </div>

                                <div className='col-md-12 text-right my-2'>

                                    <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>

                                </div>

                                <div className='block-content'>
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                        <tbody>
                                            <tr>
                                                <th width="20%">EVALUACIÓN DE LA QUEJA</th>
                                                <td>{getRemisionQueja?.data?.attributes?.evaluacion}</td>
                                            </tr>
                                            <tr>
                                                <th>FECHA REGISTRO</th>
                                                <td>{getRemisionQueja?.data?.attributes?.fecha_creacion}</td>
                                            </tr>
                                            <tr>
                                                <th>ASIGNADA A LA DELEGADA</th>
                                                <td>{getRemisionQueja?.data?.attributes?.dependencia_destino?.nombre}</td>
                                            </tr>
                                            <tr>
                                                <th>ASIGNADA A</th>
                                                <td>
                                                    {
                                                        getRemisionQueja?.data?.attributes?.usuario_jefe_destino.estado
                                                            ?
                                                            getRemisionQueja?.data?.attributes?.usuario_jefe_destino.nombre
                                                            :
                                                            <span className='text-danger'>{getRemisionQueja?.data?.attributes?.usuario_jefe_destino.nombre}</span>
                                                    }
                                                </td>
                                            </tr>
                                            {
                                                getRemisionQueja?.data?.attributes?.incorporacion
                                                    ?
                                                    (
                                                        <tr>
                                                            <th>EXPEDIENTE A INCORPORAR</th>
                                                            <td>{getRemisionQueja?.data?.attributes?.incorporacion?.expediente + ' - ' + getRemisionQueja?.data?.attributes?.incorporacion?.vigencia_expediente}</td>
                                                        </tr>
                                                    )
                                                    :
                                                    null
                                            }
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </>
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
                        <li className="breadcrumb-item"> <small>Remisión Queja</small></li>
                    </ol>
                </nav>
            </div>

            {
                getRemisionQueja?.data
                    ?
                    componentInformacion()
                    :
                    (
                        <div className='content'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='block block-themed'>
                                        <div className='block-header'>
                                            <h3 className='block-title'>{getNombreProceso} ::: REMISIÓN QUEJA</h3>
                                        </div>

                                        <div className='col-md-12 text-right my-2'>

                                            <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from }}>
                                                <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                            </Link>

                                        </div>

                                        
                                        <div className='col-md-12'>
                                            <div className='alert alert-primary' role='alert'>
                                                <p className='mb-0'> ATENCIÓN: </p>
                                                <p className='mb-0'> POR PARÁMETROS DEL SISTEMA, PARA UNA QUEJA CLASIFICADA EN LA ETAPA DE EVALUACIÓN COMO: <b><u>{tipoEvaluacionNombre}</u></b>; SE DEBE SELECCIONAR LA DEPENDENCIA DEL EJE DE POTESTAD DISCIPLINARIA QUE CONTINUARÁ CON EL TRÁMITE DEL EXPEDIENTE.</p>
                                            </div>
                                        </div>

                                        <div className='block-content'>
                                            {from.mismoUsuarioBuscador ? formularioEvaluacion() : null}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

            }
        </>
    );

}

export default RemisionQuejaForm;