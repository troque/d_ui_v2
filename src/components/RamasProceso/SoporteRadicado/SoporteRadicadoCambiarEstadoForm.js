import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { Navigate } from "react-router-dom";
import Spinner from '../../Utils/Spinner';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import InfoExitoApi from '../../Utils/InfoExitoApi';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom'
import ParametrosMasApi from '../../Api/Services/ParametrosMasApi';
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';

function SoporteRadicadoCambiarEstadoForm() {


    const [isRedirect, setIsRedirect] = useState(false);

    const [countTextArea, setCountTextArea] = useState(0);
    const [nombreUsuario, setNombreUsuario] = useState("");

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;

    let { idDocumentoSirius } = useParams();
    const [getNombreProceso, setNombreProceso] = useState('');


    /*Redirects*/
    const redirectToRoutes = () => {
        return <Navigate to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }} />;
    }

    const [getErrorApi, setErrorApi] = useState('');
    const [getDocumentoSirius, setDocumentoSirius] = useState({ data: [], links: [], meta: [] });
    const [getRtaInfoDocumentoSirius, setRtaInfoDocumentoSirius] = useState(false);
    const [getEstadoDocumentoSirius, setEstadoDocumentoSirius] = useState("activa");

    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);
            setNombreUsuario(getUser().nombre);
            DocumentoSiriusApi.getDocumentoById(idDocumentoSirius).then(
                datos => {
                    if (!datos.error) {

                        if (datos.data.attributes.estado == true) {
                            setEstadoDocumentoSirius("inactiva");
                        }

                        setDocumentoSirius(datos);
                        setRtaInfoDocumentoSirius(true);
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal()

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
            ParametrosMasApi.getParametroPorNombre(data).then(
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

                        nombreProceso();

                    } else {
                        window.showModal(1);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso",procesoDisciplinarioId).then(
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
                "type": 'documento_sirius',
                "attributes": {
                    "descripcion": "",
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "update_user": nombreUsuario,
                    "update_at": Date.now(),
                    "estado_observacion": datos.descripcion,
                    "estado": true,
                    "id_etapa": from.id_etapa,
                    "id_fase": from.id_fase,
                }
            }
        }

        DocumentoSiriusApi.updateEstadoDocumentoSirius(data, idDocumentoSirius).then(
            datos => {
                if (!datos.error) {
                    window.showModal(2);
                    setIsRedirect(true);
                    from.estadoActividad = true;
                    window.showSpinner(false);
                }
                else {
                    setErrorApi(datos.error.toString());
                    window.showModal(1);
                    window.showSpinner(false);
                }

            }
        )
    }



    const CargarInfoDocumentoSirius = () => {

        if (getDocumentoSirius.data != null && typeof (getDocumentoSirius.data) != 'undefined') {
            return (
                <tr>
                    <td style={{ width: "30%" }}>
                        <strong>FUNCIONARIO: </strong>{getDocumentoSirius.data.attributes.nombre_completo.toUpperCase()}<br />
                        <strong>ETAPA: </strong>{getDocumentoSirius.data.attributes.etapa.nombre.toUpperCase()}<br />
                        <strong>FECHA: </strong>{getDocumentoSirius.data.attributes.created_at}
                    </td>
                    <td>
                        <span data-toggle="modal" data-target={"#q"+getDocumentoSirius.data.id}>{getDocumentoSirius.data.attributes.descripcion_corta.toUpperCase()}</span>
                        
                        <div className="modal fade" id={"q"+getDocumentoSirius.data.id} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl" role="document">
                                <div className="modal-content">
                                <div className="modal-header block.block-themed">
                                    <h5 className="modal-title" id="descriptionModalLabel">{radicado} - {vigencia}:: SOPORTES DEL RADICADO</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {getDocumentoSirius.data.attributes.descripcion.toUpperCase()}
                                </div>                  
                                </div>
                            </div>
                        </div>
                    </td>
                  
                </tr>
            )
        }

    }



    return (
        <>
            {isRedirect ? redirectToRoutes() : null}
            {<Spinner />}
            {<InfoErrorApi error={getErrorApi} />}
            {<InfoExitoApi />}
            <Formik
                initialValues={{
                    descripcion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    setCountTextArea(valores.descripcion.length)


                    if (!valores.descripcion) {
                        errores.descripcion = 'Debe ingresar una observación'
                    }
                    else if (valores.descripcion.length < getMinimoTextArea) {
                        errores.descripcion = 'Debe ingresar mínimo ' + getMinimoTextArea + ' caracteres'
                    }
                    else if (valores.descripcion.length > getMaximoTextArea) {
                        errores.descripcion = 'Debe ingresar mínimo ' + getMaximoTextArea + ' caracteres'
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}><small>Lista soportes del radicado</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Activar / Inactivar soporte del radicado</small></li>
                                </ol>
                            </nav>
                        </div>


                        <div className="block block-themed">
                            <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                <h3 className="block-title">{getNombreProceso} :: <strong>ACTIVAR / INACTIVAR SOPORTE</strong></h3>
                            </div>
                            <div className="block-content">

                                <div className='col-md-12 w2d-enter'>
                                    <div className='text-right'>
                                        <Link to={`/SoporteRadicadoLista/`} title='Regresar a lista de soportes del radicado' state={{ from: from }}>
                                            <button type="button" className="btn btn-sm btn-success"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                        <thead>
                                            <tr>
                                                <th>REGISTRADO POR</th>
                                                <th>OBSERVACIONES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getRtaInfoDocumentoSirius ? CargarInfoDocumentoSirius() : null}

                                        </tbody>
                                    </table>
                                </div>
                                {disable != true ? (
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="descripcion">MOTIVO POR EL QUE {getEstadoDocumentoSirius.toUpperCase()} EL SOPORTE <span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4" placeholder="Escriba en este espacio la observación"
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="descripcion" component={() => (<span className="text-danger">{errors.descripcion}</span>)} />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                {disable != true ? (
                                    <button type="submit" className="btn btn-rounded btn-primary"> {global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                ) : null}
                                <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary"> {global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>
    );
}


export default SoporteRadicadoCambiarEstadoForm;