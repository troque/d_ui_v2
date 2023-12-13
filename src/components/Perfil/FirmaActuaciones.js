
import React, { useEffect, useState } from "react";
import Spinner from '../Utils/Spinner';
import { useLocation, Link } from "react-router-dom";
import { getUser } from '../../components/Utils/Common';
import GenericApi from '../Api/Services/GenericApi';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import InfoErrorApi from '../Utils/InfoErrorApi';
import ModalGen from '../Utils/Modals/ModalGeneric';


function FirmaActuaciones() {

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [errorApi, setErrorApi] = useState('');
    const [getPassword, setPassword] = useState("");

    const location = useLocation()
    const { FirmaActuacion } = location.state;

    useEffect(() => {
        async function fetchData() {
            //window.showSpinner(true);
            // console.log(FirmaActuacion);
        }
        fetchData();
    }, []);

    const handleClicFirmarActuacion = () => {

        // Se ejecuta el cargando
        window.showSpinner(true);

        // Se inicializa el array a enviar
        let data = {
            "data": {
                "type": "Agregar Usuario",
                "attributes": {
                    "estado": global.Constants.ESTADO_FIRMA_MECANICA.FIRMADO,
                    "id_actuacion": FirmaActuacion.attributes.id_actuacion,
                    "ruta_image": FirmaActuacion.attributes.firma_mecanica,
                    "nombre_documento": FirmaActuacion.attributes.documento_ruta,
                    "tipo_firma": FirmaActuacion.attributes.id_tipo_firma,
                    "id_user": getUser().id,
                    "password": getPassword,
                }
            }
        }

        // Se inicializa la API a consumir
        GenericApi.updateGeneric("actuaciones/set-firmas", FirmaActuacion.id, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se ejecuta el modal de exito
                    setModalState({
                        title: "FIRMA DE DOCUMENTOS",
                        message: "DOCUMENTO FIRMADO CON ÉXITO", show: true,
                        redirect: '/DocumentosFirmadosOPendientesDeFirma/',
                        alert: global.Constants.TIPO_ALERTA.EXITO
                    });

                } else if (datos.error) {

                    // Se ejecuta el modal de error
                    setModalState({
                        title: "FIRMA DE DOCUMENTOS",
                        message: datos.error,
                        show: true,
                        alert: global.Constants.TIPO_ALERTA.ERROR
                    });
                }

                // Se quita el cargando
                window.showSpinner(false);
            }
        )
       
    }

    const changePassword = (e) => {
        setPassword(e.target.value);
    }


    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            {<InfoErrorApi error={errorApi} />}
            <Formik
                initialValues={{
                    password: ''
                }}
                enableReinitialize
                validate={(valores) => {

                    let errores = {}                   
  
                    if(getPassword == false){
                        errores.password = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    return errores
                }}

                onSubmit={(valores, { resetForm }) => {
                    handleClicFirmarActuacion();
                }}

               
            >
            {({ errors }) => (
                <Form>
                    <div className="w2d_block">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"><Link underline="hover" className="text-dark" to={`/Perfil`}><small>Perfil</small></Link></li>
                                <li className="breadcrumb-item"><Link underline="hover" className="text-dark" to={`/DocumentosFirmadosOPendientesDeFirma`}><small>Documentos firmados y/o pendientes de firma</small></Link></li>
                                <li className="breadcrumb-item"><small>Firmas</small></li>
                            </ol>
                        </nav>
                    </div>

                    <div className="block block-rounded block-bordered">
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">SINPROC {FirmaActuacion.attributes.radicado} - {FirmaActuacion.attributes.vigencia} :: FIRMA DE ACTUACIÓN {FirmaActuacion.attributes.nombre_actuacion.toUpperCase()}</h3>
                            </div>

                            <div className="block-content">
                                <div className='text-right mb-2'>
                                    <Link to={`/DocumentosFirmadosOPendientesDeFirma/`} title='Regresar al perfil'>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i></button>
                                    </Link>
                                </div>

                                <div className='row'> 

                                    <div className="col-md-12">
                                        <div className="alert alert-warning" role="alert">
                                            <strong>NOTA: </strong>RECUERDE QUE AL DAR CLICK EN EL BOTÓN ACEPTAR, SU FIRMA QUEDARÁ REGISTRADA EN EL DOCUMENTO.
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="contraseña">INGRESE LA CONTRASEÑA QUE TIENE REGISTRADA PARA INCLUIR SU FIRMA<span className="text-danger">*</span></label>
                                            <Field as="input" type="password" className="form-control" id="password" name="password" value={getPassword} onChange={changePassword}></Field>
                                            <ErrorMessage name="password" component={() => (<span className="text-danger">{errors.password}</span>)} />
                                        </div>
                                    </div>

                                    <div className="block-content text-right">
                                        <button type="submit" className="btn btn-rounded btn-primary" >{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                                        <Link to={`/DocumentosFirmadosOPendientesDeFirma/`} >
                                            <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Form>
            )}
            </Formik>
        </>
    )

}

export default FirmaActuaciones;