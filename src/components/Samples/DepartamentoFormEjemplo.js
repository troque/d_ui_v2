import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import ApiSamples from "./../Api/Services/SamplesApi";

function DepartamentoFormEjemplo() {

    const [departamento, setDepartamento] = useState({ data: {} });

    let { departamentoId } = useParams();

    useEffect(() => {
        async function fetchData() {
            if (departamentoId) {
                ApiSamples.getDepartamento(departamentoId).then(
                    datos => {
                        if (!datos.error) {
                            establecerCampos(datos)
                        }
                        else {
                            window.showModal(1)
                        }
                    }
                )
            }
        }
        // console.log("Antes:", departamento);
        fetchData();
    }, []);

    function establecerCampos(datos) {
        setDepartamento(datos);
    }

    const enviarDatos = (datos) => {
        const data = {
            "data": {
                "type": departamento.data.type,
                "attributes": {
                    "nombre": datos.nombre,
                    "codigo_dane": datos.dane
                }
            }
        }
        if (departamentoId) {
            ApiSamples.updateDepartamento(departamentoId, data).then(
                datos => {
                    if (!datos.error) {
                        establecerCampos(datos)
                        window.showModal(2)
                    }
                    else {
                        window.showModal(1)
                    }
                }
            )
        }
        else {
            data.data.type = "departmentos"
            ApiSamples.addDepartamento(data).then(
                datos => {
                    if (!datos.error) {
                        establecerCampos(datos)
                        window.showModal(2)
                    }
                    else {
                        window.showModal(1)
                    }
                }
            )
        }
    }

    return (
        <div>
            {<InfoErrorApi />}
            {<InfoExitoApi />}
            <Formik
                initialValues={{
                    nombre: (departamento.data?.attributes?.nombre ? departamento.data.attributes.nombre : ''),
                    dane: (departamento.data?.attributes?.codigo_dane ? departamento.data.attributes.codigo_dane : '')
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    if (!valores.nombre) {
                        errores.nombre = 'Debe ingresar un nombre'
                    }

                    if (!valores.dane) {
                        errores.dane = 'Debe ingresar un código DANE'
                    }
                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {
                    // console.log(valores.nombre);
                    // console.log(valores.dane);
                    enviarDatos(valores);
                    resetForm();
                }}>
                {({ errors }) => (
                    <Form>
                        <div className="block block-rounded block-bordered">
                            <div className="block-header block-header-default">
                                <h3 className="block-title">Registro Departamento</h3>
                            </div>
                            <div className="block-content">
                                <div className="row justify-content-center py-sm-3 py-md-5">
                                    <div className="col-sm-10 col-md-8">
                                        <div className="form-group">
                                            <label>Código Dane</label>
                                            <Field type="text" id="dane" name="dane" className="form-control" placeholder="Código DANE" />
                                            <ErrorMessage name="dane" component={() => (<span className="text-danger">{errors.dane}</span>)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <Field type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre" />
                                            <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block-content block-content-full block-content-sm bg-body-light text-right">
                                <button type="submit" className="btn btn-sm btn-success">
                                    <i className="fa fa-check"></i> {departamentoId ? 'Actualizar' : 'Registrar'}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )

}

export default DepartamentoFormEjemplo;