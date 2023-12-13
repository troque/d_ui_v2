import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import { Link, useLocation } from 'react-router-dom';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/es';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';


function TipoConductaForm() {

    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    const [getListaTipoConducta, setListaTipoConducta] = useState({ data: {} });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);



    useEffect(() => {
        async function fetchData() {
            cargarTiposConducta();
        }
        fetchData();
    }, []);


    const cargarTiposConducta = () => {
        GenericApi.getGeneric("lista-tipo-conducta/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaTipoConducta(datos)
                    obtenerParametros();

                }
                else {
                    setModalState({ title: "SINPROCNo " + radicado + " :: Evaluación del radicado", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
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
                        setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
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

    const componentSelectTipoConducta = () => {
        return (
            getListaTipoConducta.data.map((conducta, i) => {
                return (
                    <option key={conducta.id} value={conducta.id}>{conducta.attributes.nombre}</option>
                )
            })
        )
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);

        const data = {
            "data": {
                "type": 'tipo_conducta_proceso_disciplinario',
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "estado": true,
                    "id_tipo_conducta": datos.tipoConducta,
                    "descripcion": datos.descripcion,
                }
            }
        }
        // console.log(JSON.stringify(data));

        GenericApi.addGeneric('tipo-conducta', data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "SINPROC No. " + radicado + " :: Tipo de conducta", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/TipoConductaProcesoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "SINPROC No. " + radicado + " :: Tipo de conducta", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }


    return (

        <>
            {<ModalGen data={getModalState} />}
            <Spinner />

            <Formik
                initialValues={{
                    tipoConducta: '',
                    descripcion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {};
                    setCountTextArea(valores.descripcion.length)

                    if (!valores.tipoConducta) {
                        errores.tipoConducta = 'Debe ingresar tipo de conducta'
                    }

                    if (!valores.descripcion) {
                        errores.descripcion = 'Debe ingresar un descripcion'
                    }

                    else if (valores.descripcion.length < getMinimoTextArea) {
                        errores.descripcion = 'Debe ingresar mínimo ' + getMinimoTextArea + ' caracteres'
                    }
                    else if (valores.descripcion.length > getMaximoTextArea) {
                        errores.descripcion = 'Debe ingresar mínimo ' + getMaximoTextArea + ' caracteres'
                    }

                    if (valores.descripcion) {
                        if (containsSpecialChars(valores.descripcion))
                            errores.descripcion = 'Tiene caracteres inválidos'
                    }

                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                }}>

                {({ errors }) => (
                    <Form>

                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" aria-current="page" to={`/TipoConductaProcesoLista/`} state={{ from: from }}><small>Lista de tipos de conducta</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Nuevo Tipo de conducta</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title"> SINPROC No {radicado} :: <strong>Crear Tipo de conducta</strong></h3>
                            </div>

                            <div className="block-content">
                                <div className='col-md-12'>
                                    <label htmlFor='tipoConducta'>Tipo de Conducta <span className='text-danger'>*</span></label>
                                    <Field as='select' className='form-control' id='tipoConducta' name='tipoConducta'>
                                        <option value=''>Por favor seleccione</option>
                                        {getListaTipoConducta.data.length > 0 ? componentSelectTipoConducta() : null}

                                    </Field>
                                    <ErrorMessage name='tipoConducta' component={() => (<span className='text-danger'>{errors.tipoConducta}</span>)} />
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="descripcion">Descripción <span className="text-danger">*</span></label>
                                        <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4"
                                            placeholder="Descripción del tipo de conducta" maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name="descripcion" component={() => (<span className="text-danger">{errors.descripcion}</span>)} />
                                    </div>
                                </div>

                            </div>

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary"> Registrar</button>

                                <Link to={`/TipoConductaProcesoLista/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary"> Cancelar</button>
                                </Link>
                            </div>

                        </div>
                    </Form>
                )}
            </Formik>

        </>
    );

}
export default TipoConductaForm;
