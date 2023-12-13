import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import Spinner from '../../Utils/Spinner';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom'
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';


function DatosInteresadoCambiarEstadoForm() {


    const [countTextArea, setCountTextArea] = useState(0);

    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    let { idDatosInteresado } = useParams();

    const [getDatosInteresado, setDatosInteresado] = useState({ data: [], links: [], meta: [] });
    const [getRtaInfoDatos, setRtaInfoDatos] = useState(false);
    const [getEstado, setEstado] = useState("activa");
    const [getNuevoEstado, setNuevoEstado] = useState(true);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getDescripcion, setDescripcion] = useState('');
    const [getRepuestaDescripcion, setRepuestaDescripcion] = useState(false);

    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);
            GenericApi.getGeneric("datos-interesado/datos-interesado-id/" + idDatosInteresado).then(
                datos => {

                    if (!datos.error) {

                        if (datos.data[0].attributes.estado == true) {
                            setEstado("inactiva");
                            setNuevoEstado(false);
                        }

                        setDatosInteresado(datos);
                        setRtaInfoDatos(true);
                    }
                    else {
                        setModalState({ title: "SINPROC No " + radicado + " :: DATOS DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/DatosInteresadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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
                        setModalState({ title: "SINPROC No " + radicado + " :: DATOS DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/DatosInteresadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
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
                "type": 'interesado',
                "attributes": {
                    "estado_observacion": getDescripcion,
                    "estado": getNuevoEstado,
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_tipo_sujeto_procesal": getDatosInteresado?.data[0]?.attributes?.id_tipo_sujeto_procesal ? getDatosInteresado.data[0].attributes.id_tipo_sujeto_procesal : null
                }
            }
        }

        GenericApi.updateGeneric("datos-interesado", idDatosInteresado, data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso + " :: DATOS DEL INTERESADO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/DatosInteresadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    window.showSpinner(false);
                }
                else {
                    setModalState({ title: getNombreProceso + " :: DATOS DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/DatosInteresadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }

            }
        )
    }

    const CargarInfoDocumentoRadicado = () => {

        if (getDatosInteresado.data != null && typeof (getDatosInteresado.data) != 'undefined') {
            return (

                <tr>
                    <td style={{ width: "15%" }}>
                        {getDatosInteresado.data[0].attributes.nombre_completo.toUpperCase()}
                    </td>
                    <td style={{ width: "15%" }}>{getDatosInteresado.data[0].attributes.created_at}</td>
                    <td style={{ width: "50%" }}>
                        {getDatosInteresado.data[0].attributes.primer_nombre ? getDatosInteresado.data[0].attributes.primer_nombre.toUpperCase()+' ' :'ANÓNIMO(A) '} 
                        {getDatosInteresado.data[0].attributes.segundo_nombre ? getDatosInteresado.data[0].attributes.segundo_nombre.toUpperCase()+' ' :null}
                        {getDatosInteresado.data[0].attributes.primer_apellido ? getDatosInteresado.data[0].attributes.primer_apellido.toUpperCase()+' ' :'ANÓNIMO(A)'}
                        {getDatosInteresado.data[0].attributes.segundo_apellido ? getDatosInteresado.data[0].attributes.segundo_apellido.toUpperCase()+' '  : null}<br/>
                        {getDatosInteresado.data[0].attributes.numero_documento !== '2030405060'?<><strong>DOCUMENTO: </strong>{getDatosInteresado.data[0].attributes.numero_documento}</>:''}<br/>
                        {getDatosInteresado.data[0].attributes.sujeto_procesal_nombre!==''?<><strong>SUJETO PROCESAL: </strong>{getDatosInteresado.data[0].attributes.sujeto_procesal_nombre.toUpperCase()}</>:''}
                    </td>
                    <td>{getDatosInteresado.data[0].attributes.entidad ? getDatosInteresado.data[0].attributes.entidad : (getDatosInteresado.data[0].attributes.nombre_entidad ? getDatosInteresado.data[0].attributes.nombre_entidad : "SIN ENTIDAD")}</td>


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
                        errores.descripcion = 'Debe ingresar maximo ' + getMaximoTextArea + ' carácteres';
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/DatosInteresadoLista/`} state={{ from: from }}><small>Datos del interesado</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Cambiar estado de datos del interesado</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso} :: <strong>INACTIVAR DATOS DEL INTERESADO</strong></h3>
                            </div>
                            <div className="block-content">


                                <div className='col-md-12'>
                                    <div className="table-responsive-md">
                                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                            <thead>
                                                <tr>
                                                    <th>REGSITRADOR POR</th>
                                                    <th>FECHA DE REGISTRO</th>
                                                    <th>INTERESADO</th>
                                                    <th>ENTIDAD</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getRtaInfoDatos ? CargarInfoDocumentoRadicado() : null}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="descripcion">MOTIVO POR EL QUE {getEstado.toUpperCase()} EL REGISTRO DEL INTERESADO <span className="text-danger">*</span></label>
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

                                <Link to={`/DatosInteresadoLista/`} state={{ from: from }}>
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


export default DatosInteresadoCambiarEstadoForm;