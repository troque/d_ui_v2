import { ErrorMessage, Field, Form, Formik } from 'formik';
import Spinner from '../../Utils/Spinner';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';

function TipoConductaForm() {


    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getSelectedTipoConducta, setSelectedTipoConducta] = useState("");
    const [getListaTipoConducta, setListaTipoConducta] = useState({ data: {} });
    const [getRespuesta, setRespuesta] = useState(false);


    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let dependencia = from.dependencia;


    useEffect(() => {
        async function fetchData() {

            GenericApi.getGeneric("lista-tipo-conducta/" + procesoDisciplinarioId).then(
                datos => !datos.error ?
                    (setListaTipoConducta(datos), setRespuesta(true)) :
                    setModalState({ title: "Tipo Conducta:", message: datos.error.toString(), show: true, redirect: '/RamasProceso', from: { from } })
            )

        }
        fetchData();
    }, []);


    let selectChangeTipoConducta = (e) => {
        setSelectedTipoConducta(e);
    }


    const selectTipoConducta = () => {
        return (
            getListaTipoConducta.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.conducta_nombre}</option>
                )
            })
        )
    }


    const enviarDatos = (datos) => {

        window.showSpinner(true);

        const data = {
            "data": {
                "type": 'evaluacion',
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "noticia_priorizada": "",
                    "justificacion": "",
                    "estado": global.Constants.ESTADOS_EVALUACION.APROBADO_POR_JEFE,
                    "resultado_evaluacion": "",
                    "tipo_conducta": datos.tipoConducta
                }
            }
        }

        GenericApi.addGeneric('actualizar-tipo-conducta', data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "Tipo de conducta", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/MisPendientes', from: { from } });
                }
                else {
                    setModalState({ title: "Tipo de conducta", message: datos.error.toString(), show: true, redirect: '/TipoConductaForm', from: { from } });

                }
                window.showSpinner(false);
            }
        )
    }


    return (

        <>
            {<Spinner />}
            <ModalGen data={getModalState} />

            <div className="row">

                <div className="col-md-12">
                    <div className="block block-rounded block-bordered">
                        <div className="block-content">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" aria-current="page" to={`/ClasificacionRadicadoLista/`} state={{ from: from }}><small>Validar Clasificación</small></Link></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title"> SINPROC No {radicado} :: <strong>Actualizar Tipo de Conducta</strong></h3>
                        </div>

                        <div className="block-content">
                            <Formik

                                initialValues={{
                                    tipoConducta: '',
                                }}
                                enableReinitialize

                                onSubmit={(valores, { resetForm }) => {
                                    // console.log(valores);
                                    enviarDatos(valores);
                                }}

                            >



                                <Form>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">

                                                <label htmlFor="ingresoTipoExpediente">Tipo de conducta<span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="tipoConducta" name="tipoConducta">
                                                    <option value="">Por favor seleccione</option>
                                                    {getRespuesta ? selectTipoConducta() : null}
                                                </Field>

                                                {/*<select className="form-control" id="inputTipoConducta" name="inputTipoConducta"
                                                    value={getSelectedTipoConducta} onChange={e => selectChangeTipoConducta(e.target.value)}>
                                                    <option value="">Por favor seleccione</option>
                                                    {getRespuesta ? selectTipoConducta(): null}
                                                </select>
                                                */
                                                }


                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-rounded btn-primary">Registrar</button>
                                        </div>
                                    </div>
                                </Form>

                            </Formik>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}


export default TipoConductaForm;