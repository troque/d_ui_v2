import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../Spinner';

function ModalActuaciones(props) {

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);

    useEffect(() => {
        async function fetchData() {
            obtenerParametros();
        }
        fetchData();
    }, []);

    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
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
            GenericApi.getByDataGeneric('parametro/parametro-nombre', data).then(
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
                        window.showModal(1);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const enviarDatos = (valores) => {

        window.showSpinner(true);

        let data;

        data = {
            "data": {
                "type": "proceso_disciplinario",
                "attributes": {
                    "comentarios": valores.informacion,
                    "id_actuacion": props.id_actuacion
                }
            }
        }

        // console.log("info enviada -> ", JSON.stringify(data));

        GenericApi.updateGeneric('proceso-diciplinario', props.object.id, data).then(
            datos => {
                if (!datos.error) {

                    window.location.reload();
                    window.showModal(2)
                    //setIsRedirect(true);
                }
                else {
                    //console.log("hay error");
                    console.log(datos.error);
                    window.showModal(1)
                }
                window.showSpinner(false);
            }
        )
    }

    return (
        <>
            <Formik
                initialValues={{
                    informacion: '',
                }}
                enableReinitialize
                validate={(valores) => {

                    setCountTextArea(valores.informacion.length)

                    let errores = {}

                    if (!valores.informacion) {
                        errores.informacion = 'Debe ingresar un valor'
                    } else if (valores.informacion.length <= getMinimoTextArea) {
                        errores.informacion = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres'
                    }

                    if (valores.informacion) {
                        if (containsSpecialChars(valores.informacion)) {
                            errores.informacion = 'Tiene caracteres inválidos'
                        }
                    }

                    return errores
                }}

                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="modal fade" id="modal-block-popout-actuaciones" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-popout" role="document">
                                <div className="modal-content">
                                    <div className="block block-themed block-transparent mb-0">
                                        <div className="block-header bg-primary-dark">
                                            <h3 className="block-title">Confirmar</h3>
                                            <div className="block-options">
                                                <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                    <i className="fa fa-fw fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '25px' }} className="form-group text-center">
                                            <p>{props.accionActuacion}</p>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="4"
                                                    placeholder="ESCRIBA EN ESTE ESPACIO LOS COMENTARIOS DE LA ACTUACIÓN" ></Field>
                                                <div className="text-right">
                                                    <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                </div>
                                                <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                            </div>
                                        </div>
                                        <div className="block-content">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group text-center">
                                                        <button type="submit" className="btn btn-rounded btn-primary">Si</button>
                                                        <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default ModalActuaciones;
