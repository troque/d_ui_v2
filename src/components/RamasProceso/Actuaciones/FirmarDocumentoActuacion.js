import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { getUser } from '../../Utils/Common';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import { Link } from "react-router-dom";
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import ActuacionParametrosPlantillaForm from '../Herramientas/ActuacionParametrosPlantillaForm';
import Spinner from '../../Utils/Spinner';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function FirmarDocumentoActuacion() {

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [errorApi, setErrorApi] = useState('');
    const [getPassword, setPassword] = useState("");


    const location = useLocation()
    const { from, FirmaActuacion, nombreActuacion, estadoActualActuacion, tipoActuacion, actuacionIdMaestra, id_etapa } = location.state;

    console.log("actuacionIdMaestra FirmarDocumentoActuacion ->", actuacionIdMaestra);
    console.log("FirmaActuacion -> ", FirmaActuacion)

    useEffect(() => {
        async function fetchData() {
            // window.showSpinner(true);
            // console.log(FirmaActuacion);
        }
        fetchData();
    }, []);

    const handleClicFirmarActuacion = () => {

        // Se ejecuta el cargando
        window.showSpinner(true);

        // Se valida que sea la misma contraseña que se esta escribiendo
        //if (FirmaActuacion.usuario_password_firma_mecanica == getContraseña) {

            // Se inicializa el array a enviar
            let data = {
                "data": {
                    "type": "Agregar Usuario",
                    "attributes": {
                        "estado": global.Constants.ESTADO_FIRMA_MECANICA.FIRMADO,
                        "ruta_image": FirmaActuacion.usuario_firma_mecanica,
                        "nombre_documento": FirmaActuacion.actuacion_documento_ruta,
                        "id_actuacion": FirmaActuacion.id_actuacion,
                        "tipo_firma": FirmaActuacion.tipo_firma_id,
                        "id_user": FirmaActuacion.usuario_id,
                        "password": getPassword,
                    }
                }
            }

            // Se inicializa la API a consumir
            GenericApi.updateGeneric("actuaciones/set-firmas", FirmaActuacion.id, data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se ejecuta el modal de exito
                        setModalState({
                            title: "ACTUACIONES :: FIRMA DE DOCUMENTOS",
                            message: "DOCUMENTO FIRMADO CON ÉXITO", show: true,
                            redirect: '/ActuacionesVer/' + from.proceso_disciplinario + '/' + id_etapa + '/1',
                            from: {
                                from: from,
                                selected_id_etapa: id_etapa,
                                id: FirmaActuacion.id_actuacion,
                                nombre: nombreActuacion,
                                estadoActualActuacion: estadoActualActuacion,
                                tipoActuacion: tipoActuacion,
                                actuacionIdMaestra: actuacionIdMaestra
                            },
                            alert: global.Constants.TIPO_ALERTA.EXITO
                        });

                    } else if (datos.error) {

                        // Se ejecuta el modal de error
                        setModalState({
                            title: "ACTUACIONES :: FIRMA DE DOCUMENTOS",
                            message: datos.error,
                            show: true,
                            alert: global.Constants.TIPO_ALERTA.ERROR
                        });
                    }
                }
            )
        /*} else {

            // Se quita el cargando
            window.showSpinner(false);

            // Se ejecuta el modal
            setModalState({
                title: "ACTUACIONES :: FIRMA DE DOCUMENTOS",
                message: "CONTRASEÑA INCORRECTA",
                show: true,
                alert: global.Constants.TIPO_ALERTA.ERROR
            });

            // Se retorna
            return false;
        }*/
    }

    const changePassword = (e) => {
        setPassword(e.target.value);
    }

    return (
        <>
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            {<Spinner />}
            <Formik
                initialValues={{

                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}                   
  
                    if(getPassword == false){
                        errores.password = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    return errores

                }}
                onSubmit={() => {
                    handleClicFirmarActuacion();
                }}
            >
                {({ errors }) => (
                    <Form>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title"><strong>FIRMA DE ACTUACIÓN</strong></h3>
                            </div>
                            <div className="block-content">
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            USUARIO: {FirmaActuacion.usuario_name}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            TIPO DE FIRMA: { FirmaActuacion.tipo_firma_nombre }
                                            {/* {FirmaActuacion.tipo_firma_nombre.toUpperCase() === (global.Constants.TIPOS_FIRMA_MECANICA.PRINCIPAL ? "PRINCIPAL" : null)}
                                            {FirmaActuacion.tipo_firma_nombre.toUpperCase() === (global.Constants.TIPOS_FIRMA_MECANICA.FIRMO ? "FIRMÓ" : null)}
                                            {FirmaActuacion.tipo_firma_nombre.toUpperCase() === (global.Constants.TIPOS_FIRMA_MECANICA.ELABORO ? "ELABORÓ" : null)} */}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="contraseña">CONTRASEÑA DE FIRMADO <span className="text-danger">*</span></label>
                                            <Field as="input" type="password" className="form-control" id="contraseña" name="contraseña" value={getPassword} onChange={changePassword} autocomplete="off"></Field>
                                            <ErrorMessage name="contraseña" component={() => (<span className="text-danger">{errors.contraseña}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            * AL FIRMAR SE INCLUIRA SU FIRMA MECÁNICA {nombreActuacion} {FirmaActuacion.actuacion_auto}
                                        </div>
                                    </div>
                                    <div className="block-content mb-4">
                                        <button type="submit" className="btn btn-rounded btn-primary">FIRMAR</button>
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

export default FirmarDocumentoActuacion;