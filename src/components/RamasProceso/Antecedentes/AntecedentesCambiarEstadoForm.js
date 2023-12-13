import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import Spinner from '../../Utils/Spinner';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';

function AntecedentesCambiarEstadoForm() {

    const [countTextArea, setCountTextArea] = useState(0);
    const [nombreUsuario, setNombreUsuario] = useState("");

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const location = useLocation()
    const { from, disable } = location.state
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    let { idAntecedente } = useParams();


    const [getAntecedente, setAntecedente] = useState({ data: [], links: [], meta: [] });
    const [getRtaInfoAntecedente, setRtaInfoAntecedente] = useState(false);
    const [getEstadoAntecedente, setEstadoAntecedente] = useState("activa");
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getDescripcion, setDescripcion] = useState('');
    const [getRepuestaDescripcion, setRepuestaDescripcion] = useState(false);


    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);
            setNombreUsuario(getUser().nombre);

            GenericApi.getByIdGeneric("antecedentes", idAntecedente).then(

                datos => {
                    if (!datos.error) {

                        if (datos.data.attributes.estado == true) {
                            setEstadoAntecedente("inactiva");
                        }
                        setAntecedente(datos);
                        setRtaInfoAntecedente(true);
                    }
                    else {
                        setModalState({ title: getNombreProceso + " :: Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                    }

                }
            )
            obtenerParametros();
        }
        fetchData();
    }, []);

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
                            nombreProceso();

                        }
                    } else {
                        setModalState({ title: getNombreProceso + " :: Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }
                window.showSpinner(false);
            }
        )
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);

        const data = {
            "data": {
                "type": 'antecedente',
                "attributes": {
                    "antecedentes": 3,
                    "descripcion": "",
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "update_user": nombreUsuario,
                    "update_at": Date.now(),
                    "estado_observacion": getDescripcion,
                    "estado": global.Constants.ESTADOS.ACTIVO,
                }
            }
        }

        GenericApi.updateGeneric("antecedentes", idAntecedente, data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso + " :: Antecedentes", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    window.showSpinner(false);

                }
                else {
                    setModalState({ title: getNombreProceso + " :: Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);

                }
            }
        )
    }

    const CargarInfoAntecedente = () => {

        if (getAntecedente.data != null && typeof (getAntecedente.data) != 'undefined') {
            return (
                <tr>
                    <td style={{ width: "20%" }}>
                        <strong>FUNCIONARIO: </strong>{getAntecedente.data.attributes.nombre_completo.toLocaleUpperCase()}<br />
                        <strong>ETAPA: </strong>{getAntecedente.data.attributes.etapa.nombre}<br />
                        <strong>FECHA: </strong>{getAntecedente.data.attributes.fecha_creado}
                    </td>
                    <td style={{ width: "20%" }}>{getAntecedente.data.attributes.nombre_dependencia}</td>
                    <td style={{ width: "60%" }} data-toggle="popover" data-placement="top" title={getAntecedente.data.attributes.descripcion}>{getAntecedente.data.attributes.descripcion_corta.toUpperCase()}</td>
                </tr>
            )
        }

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
                        errores.descripcion = 'Debe ingresar máximo ' + getMaximoTextArea + ' carácteres';
                    }
                    if (countTextArea < getMinimoTextArea) {
                        errores.descripcion = 'Debe ingresar mínimo ' + getMinimoTextArea + ' carácteres'
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/AntecedentesLista/`} state={{ from: from, disable: disable }}><small>Antecedentes</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Cambiar estado de antecedente</small></li>
                                </ol>
                            </nav>
                        </div>


                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title"> {getNombreProceso} :: <strong>INACTIVAR ANTECEDENTE</strong></h3>
                            </div>
                            <div className="block-content">
                                <div className='col-md-12'>

                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full table-responsive-md">
                                        <thead>
                                            <tr>
                                                <th>REGISTRADO POR</th>
                                                <th>DEPENDENCIA</th>
                                                <th>DESCRIPCIÓN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getRtaInfoAntecedente ? CargarInfoAntecedente() : null}

                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="descripcion">MOTIVO POR EL QUE {getEstadoAntecedente.toLocaleUpperCase()} EL ANTECEDENTE <span className="text-danger">*</span></label>
                                        <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="ESCRIBA EN ESTE ESPACIO LA OBSERVACIÓN"
                                            maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getDescripcion} onChange={changeDescripcion}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name="descripcion" component={() => (<span className="text-danger">{errors.descripcion}</span>)} />
                                    </div>
                                </div>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                
                                <Link to={`/AntecedentesLista/`} state={{ from: from, disable: disable }}>
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


export default AntecedentesCambiarEstadoForm;