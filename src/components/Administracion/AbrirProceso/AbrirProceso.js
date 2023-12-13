import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import 'rhfa-emergency-styles/dist/styles.css'
import Spinner from '../../Utils/Spinner';
import { useParams } from "react-router";
import { Link, } from "react-router-dom";
import ModalGen from '../../Utils/Modals/ModalGeneric';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import GenericApi from '../../Api/Services/GenericApi';
import ParametrosMasApi from '../../Api/Services/ParametrosMasApi';

function AbrirProceso() {

    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getProcesoDisciplinario, setProcesoDisciplinario] = useState();
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getJustificacion, setJustificacion] = useState('');
    const [getRepuestaJustificacion, setRepuestaJustificacion] = useState(false);
    const [countTextArea, setCountTextArea] = useState(0);

    let { id } = useParams();

    useEffect(() => {
        cargarParametrico()
    }, []);

    const cargarParametrico = () => {

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
                    setModalState({ title: "ADMINISTRACIÓN :: ERROR", message: 'OCURRIÓ UN ERROR AL GUARDAR LOS CAMBIOS. '+datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }

    const changeJustificacion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setJustificacion(e.target.value);
            setCountTextArea(e.target.value.length);
            setRepuestaJustificacion(true);
        }
    }

    const enviarDatos = () => {

        window.showSpinner(true);

        let data;

        data = {
            "data": {
                "type": "mas_dependencia_origen",
                "attributes": {
                    "uuid_proceso_disciplinario": getProcesoDisciplinario.id,
                    "id_etapa": getProcesoDisciplinario.attributes.etapa.id,
                    "justificacion": getJustificacion
                }
            }
        }

        GenericApi.getByDataGeneric('activar-proceso', data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: DATOS ACTUALIZADOS CON ÉXITO", message: 'EL PROCESO HA SIDO ACTIVADO CON ÉXITO', show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.EXITO });
                
                } else {
                    setErrorApi();
                    setModalState({ title: "ADMINISTRACIÓN :: ERROR", message: 'OCURRIÓ UN ERROR AL GUARDAR LOS CAMBIOS. '+datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);                
            }
        )
    }

    const cargarInformacionProcesoDisciplinario = (valores) => {

        window.showSpinner(true);

        GenericApi.getGeneric('cambio-etapa/obtener-proceso/'+valores.input_numero_proceso+'/'+valores.input_vigencia).then(
            datos => {
                if (!datos.error) {
                    obtenerEtapas();
                    setProcesoDisciplinario(datos.data);
                } else {
                    setErrorApi();
                    window.showSpinner(false);
                    setModalState({ title: "ADMINISTRACIÓN :: ERROR", message: 'OCURRIÓ UN ERROR AL OBTENER LOS DATOS. '+datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                
            }
        )
    }

    const obtenerEtapas = () => {
        GenericApi.getAllGeneric('mas-etapa-nuevos').then(
            datos => {
                if (!datos.error) {
                    window.showSpinner(false);
                }
            }
        )
    }

    const componentFormularioAbrirProceso = () => {
        return (
            <Formik
                initialValues={{
                    textarea_justificacion: ''
                }}
                enableReinitialize
                validate={(valores) => { 
                    let errores = {};

                    if(!getJustificacion){
                        errores.textarea_justificacion = 'DEBE ESCRIBIR UNA JUSTIFICACIÓN';
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(valores.textarea_justificacion) === false){
                        errores.textarea_justificacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    if (countTextArea > getMaximoTextArea) {
                        errores.textarea_justificacion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES';
                    }
                    if (countTextArea < getMinimoTextArea) {
                        errores.textarea_justificacion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES';
                    }
                    if(getRepuestaJustificacion == false){
                        errores.textarea_justificacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    return errores;
                }}
                onSubmit={(valores, {resetForm}) => {
                    enviarDatos(valores);
                }}
                >
                {({ errors, values }) => (
                    <Form>
                        <div className="row">
                            <div className='col-md-12'>
                                <div className="form-group">
                                    <label htmlFor='textarea_justificacion'>JUSTIFICACIÓN <span className='text-danger'>*</span></label>
                                    <Field as="textarea" className="form-control" id="textarea_justificacion" name="textarea_justificacion" rows="4"
                                        placeholder="ESCRIBA EN ESTE ESPACIO LAS OBSERVACIONES" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getJustificacion} onChange={changeJustificacion}></Field>
                                    <div className="text-right">
                                        <span className="text-primary"> {countTextArea} / {getMaximoTextArea} </span>
                                    </div>
                                    <ErrorMessage name="textarea_justificacion" component={() => (<span className="text-danger">{errors.textarea_justificacion}</span>)} />
                                </div>
                            </div>                            
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.HABILITAR}</button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        )
    } 

    return (

        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            {<InfoErrorApi error={errorApi} />}
            <div className="col-md-12">
                <div className="block block-rounded">
                    <div className="block-content">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <small>Administración</small></li>
                                <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>   
                                <li className="breadcrumb-item"> <small>Abrir un proceso</small></li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: ABRIR UN PROCESO</h3>
                </div>
                <div className='block-content'>
                <Formik
                    initialValues={{
                        input_numero_proceso: '',
                        input_vigencia: ''
                    }}
                    enableReinitialize
                    validate={(valores) => { 
                        let errores = {};

                        if(!valores.input_numero_proceso){
                            errores.input_numero_proceso = 'DEBE ESCRIBIR EL NUMERO DE PROCESO DISCIPLINARIO';
                        }

                        if(!valores.input_vigencia){
                            errores.input_vigencia = 'DEBE ESCRIBIR EL NUMERO DE VIGENCIA';
                        }

                        return errores;
                    }}
                    onSubmit={(valores, {resetForm}) => {
                        cargarInformacionProcesoDisciplinario(valores);
                    }}
                    >
                    {({ errors, values }) => (
                        <Form>
                            <div className="row">
                                <div className='col-md-5'>
                                    <div className="form-group">
                                        <label htmlFor='input_numero_proceso'>N° PROCESO DISCIPLINARIO <span className='text-danger'>*</span></label>
                                        <Field as="input" type='text' className='form-control' id="input_numero_proceso" name="input_numero_proceso" autoComplete="off"></Field>
                                        <ErrorMessage name="input_numero_proceso" component={() => (<span className="text-danger">{errors.input_numero_proceso}</span>)} />
                                    </div>
                                </div>
                                <div className='col-md-5'>
                                    <div className="form-group">
                                        <label htmlFor='input_vigencia'>VIGENCIA <span className='text-danger'>*</span></label>
                                        <Field as="input" type='text' className='form-control' id="input_vigencia" name="input_vigencia" autoComplete="off"></Field>
                                        <ErrorMessage name="input_vigencia" component={() => (<span className="text-danger">{errors.input_vigencia}</span>)} />
                                    </div>
                                </div>
                                <div className='col-md-2'>
                                    <div className="form-group" style={{ paddingTop: "25px" }}>
                                        <button type='submit' className="btn btn-rounded btn-primary" title='CONSULTAR PROCESO DISCIPLINARIO'><i className="fas fa-search"></i></button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
                    {
                        getProcesoDisciplinario
                        ?
                            <>
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                    <thead>
                                        <tr>
                                            <th>PROCESO DISCIPLINARIO</th>
                                            <th>VIGENCIA</th>
                                            <th>EVALUACIÓN</th>
                                            <th>ETAPA ACTUAL</th>
                                            <th>USUARIO ACTUAL</th>
                                            <th>DEPENDENCIA ACTUAL</th>
                                            <th>ESTADO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                { getProcesoDisciplinario.attributes?.radicado.toUpperCase() }
                                            </td>
                                            <td>                                            
                                                { getProcesoDisciplinario.attributes?.vigencia.toUpperCase() }
                                            </td>
                                            <td>                                            
                                                { getProcesoDisciplinario.attributes?.evaluacion?.nombre.toUpperCase() }
                                            </td>
                                            <td>                                            
                                                { getProcesoDisciplinario.attributes?.etapa?.nombre.toUpperCase() }
                                            </td>
                                            <td>                                            
                                                { getProcesoDisciplinario.attributes?.usuario_actual?.nombre.toUpperCase() } { getProcesoDisciplinario.attributes?.usuario_actual?.apellido.toUpperCase() }
                                            </td>
                                            <td>                                            
                                                { getProcesoDisciplinario.attributes?.usuario_actual?.dependencia.toUpperCase() }
                                            </td>
                                            <td>                                            
                                                { getProcesoDisciplinario.attributes?.estado?.nombre.toUpperCase() }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {console.log("Daticos")}
                                {
                                    getProcesoDisciplinario.attributes?.estado?.id == 1
                                    ?  
                                        <p style={{ color: 'red' }} className='text-center'>
                                            <label>EL PROCESO NO PUEDE SER HABILITADO, YA QUE SE ENCUENTRA EN ESTADO ACTIVO</label>
                                        </p>
                                    :
                                        componentFormularioAbrirProceso()
                                }
                            </>
                        :
                            null
                    }
                </div>
            </div>
        </>
    )

}
export default AbrirProceso;