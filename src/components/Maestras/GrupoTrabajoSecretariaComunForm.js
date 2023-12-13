import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Spinner from '../Utils/Spinner';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import '../Utils/Constants';
import ModalGen from '../Utils/Modals/ModalGeneric';

export default function GrupoTrabajoSecretariaComunForm() {

    const [getNombreGrupo, setNombreGrupo] = useState("");
    const [getRespuestaNombreGrupo, setRespuestaNombreGrupo] = useState(false);
    const [getEstado, setEstado] = useState("");
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    
    const location = useLocation();
    const { from } = location.state;

    useEffect(() => {
        async function fetchData() {
            if (from != null) {
                window.showSpinner(true);
                setNombreGrupo(from.attributes.nombre);
                setEstado(from.attributes.estado);
                window.showSpinner(false);
            }
        }
        fetchData();
    }, []);

    const enviarDatos = (valores) => {
        window.showSpinner(true);
        let data = {
            "data": {
                "type": "mas_grupo_trabajo",
                "attributes": {
                    "nombre": getNombreGrupo,
                    "estado": getEstado
                }
            }
        }
        if(from != null){
            GenericApi.updateGeneric('mas_grupo_trabajo', from.id ,data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: "ADMINISTRACIÓN :: GRUPO DE TRABAJO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/GrupoTrabajoSecretariaComun', alert: global.Constants.TIPO_ALERTA.EXITO });
                    }else {
                        setModalState({ title: "ADMINISTRACIÓN :: GRUPO DE TRABAJO", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        }else{
            GenericApi.addGeneric('mas_grupo_trabajo', data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: "ADMINISTRACIÓN :: GRUPO DE TRABAJO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/GrupoTrabajoSecretariaComun', alert: global.Constants.TIPO_ALERTA.EXITO });
                    }else {
                        setModalState({ title: "ADMINISTRACIÓN :: GRUPO DE TRABAJO", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        }
    }

    const changeNombreGrupo = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreGrupo(e.target.value);
            setRespuestaNombreGrupo(true);
        }
    }

    const selectChangeEstado = (e) => {
        setEstado(e.target.value);
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    nombreGrupo: '',
                    estado: '',
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    
                    if(getRespuestaNombreGrupo == false){
                        errores.nombreGrupo = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    if (getNombreGrupo == "") {
                        errores.nombreGrupo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (getEstado == "") {
                        errores.estado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    return errores;
                }}
                onSubmit={() => {
                    enviarDatos();
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div>

                            <div className="w2d_block let">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb breadcrumb-alt push">
                                        <li className="breadcrumb-item"> <small>Administración</small></li>
                                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/GrupoTrabajoSecretariaComun`}> <small>Lista de grupos</small></Link></li>
                                        <li className="breadcrumb-item"> <small>Crear grupo de trabajo</small></li>
                                    </ol>
                                </nav>
                            </div>

                            <div className="block block-themed">                              
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: GRUPOS DE TRABAJO</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="form-group">
                                                <label htmlFor="nombreGrupo">NOMBRE <span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreGrupo" name="nombreGrupo" value={getNombreGrupo} onChange={changeNombreGrupo} autocomplete="off"></Field>
                                                <ErrorMessage name="nombreGrupo" component={() => (<span className="text-danger">{errors.nombreGrupo}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="estado">ESTADO <span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="estado" name="estado" value={getEstado} onChange={selectChangeEstado}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="1">ACTIVO</option>
                                                    <option value="0">INACTIVO</option>
                                                </Field>
                                                <ErrorMessage name="estado" component={() => (<span className="text-danger">{errors.estado}</span>)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary" >
                                    {from != null ? global.Constants.BOTON_NOMBRE.ACTUALIZAR : global.Constants.BOTON_NOMBRE.REGISTRAR}
                                </button>
                                <Link to={'/GrupoTrabajoSecretariaComun'} className="font-size-h5 font-w600" >
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

