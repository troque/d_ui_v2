import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getUser } from '../../../components/Utils/Common';
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';

function AntecedentesForm() {

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getDescripcion, setDescripcion] = useState('');
    const [getRepuestaDescripcion, setRepuestaDescripcion] = useState(false);
    
    const location = useLocation()
    const { from } = location.state;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let dependencia = from.dependencia;

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setNombreUsuario(getUser().nombre);
            nombreProceso();
            
        }
        fetchData();
    }, []);


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
            GenericApi.getByDataGeneric("parametro/parametro-nombre",data).then(
                datos => {

                    if (!datos.error) {

                        if (datos["data"].length > 0) {

                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ))
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ))
                            window.showSpinner(false);

                        }
                    } else {
                        setModalState({ title:  getNombreProceso+" :: ANTECEDENTES", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', from: {from}, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);
        let data;

        data = {
            "data": {
                "type": 'antecedente',
                "attributes": {
                    "antecedentes": 3,
                    "descripcion": getDescripcion,
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "fecha_registro": Date.now(),
                    "created_user": getNombreUsuario,
                    "id_dependencia": dependencia ? dependencia : "",
                }
            }
        }

        GenericApi.addGeneric("antecedentes",data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso+" :: ANTECEDENTES", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/AntecedentesLista', from: {from}, alert: global.Constants.TIPO_ALERTA.EXITO});
                }
                else {
                    setModalState({ title: getNombreProceso+" :: ANTECEDENTES", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: {from}, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);

            }
        )
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

    return (
        <>
             {<Spinner />}        
            {<ModalGen data={getModalState} />}
          
            <Formik
                initialValues={{
                    descripcion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                   
                    if (countTextArea > getMaximoTextArea) {
                        errores.descripcion = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARACTERES';
                    }
                    if (countTextArea < getMinimoTextArea) {
                        errores.descripcion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES';
                    }
                    if(getRepuestaDescripcion == false){
                        errores.descripcion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>

                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/AntecedentesLista/`} state={{ from: from }}><small>Lista de antecedentes</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Crear antecedente</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso} :: <strong>CREACIÓN DE ANTECEDENTE</strong></h3>
                            </div>

                            <div className="block-content">
                                <div className='text-right'>

                                    <Link to={`/AntecedentesLista/`} title='Regresar a lista de Antecedentes' state={{ from: from }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="descripcion">DESCRIPCIÓN <span className="text-danger">*</span></label>
                                        <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4"
                                            placeholder="ESCRIBA EN ESTE ESPACIO LOS ANTECEDENTES" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getDescripcion} onChange={changeDescripcion}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name="descripcion" component={() => (<span className="text-danger">{errors.descripcion}</span>)} />
                                    </div>
                                </div>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>

                                <Link to={`/AntecedentesLista/`} state={{ from: from }}>
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


export default AntecedentesForm;