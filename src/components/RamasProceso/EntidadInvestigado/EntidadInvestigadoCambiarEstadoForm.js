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
import GenericApi from '../../Api/Services/GenericApi';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';

function EntidadInvestigadoCambiarEstadoForm() {

    const [isRedirect, setIsRedirect] = useState(false);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    let { idEntidadInvestigado } = useParams();

    /*Redirects*/
    const redirectToRoutes = () => {
        return <Navigate to={`/EntidadInvestigadoLista/`} state={{ from: from }} />;
    }

    const [getErrorApi, setErrorApi] = useState('');
    const [getEntidadInvestigado, setEntidadInvestigado] = useState({ data: [], links: [], meta: [] });
    const [getRtaInfoEntidad, setRtaEntidad] = useState(false);
    const [getEstado, setEstado] = useState("activa");
    const [getNuevoEstado, setNuevoEstado] = useState(true);
    const [getDescripcion, setDescripcion] = useState('');
    const [getRepuestaDescripcion, setRepuestaDescripcion] = useState(false);

    useEffect(() => {
        async function fetchData() {

            // console.log(idEntidadInvestigado);

            GenericApi.getByIdGeneric('entidad-investigado', idEntidadInvestigado).then(
                datos => {

                    if (!datos.error) {
                        if (datos.data[0]) {
                            if (datos.data[0].attributes.estado == true) {
                                setEstado("inactiva");
                                setNuevoEstado(false);
                            }
                        }


                        setEntidadInvestigado(datos);
                        setRtaEntidad(true);
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

                            nombreProceso();

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

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializa la data
        const data = {
            "data": {
                "type": 'entidad_investigado',
                "attributes": {
                    "observaciones": getDescripcion,
                    "estado": getNuevoEstado,
                    "id_proceso_disciplinario": procesoDisciplinarioId
                }
            }
        }

        // Se consume la API
        GenericApi.updateGeneric('entidad-investigado', idEntidadInvestigado, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida no haya error
                if (!datos.error) {

                    // Setea la modal
                    setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO :: INACTIVAR DATOS", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/EntidadInvestigadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Setea la modal
                    setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO :: INACTIVAR DATOS", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoCambiarEstadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    const CargarEntidad = () => {

        if (getEntidadInvestigado.data != null && typeof (getEntidadInvestigado.data) != 'undefined') {
            return (
                getEntidadInvestigado.data.map((entidad, i) => {
                    return (
                        <tr key={entidad.id}>
                            <td className='text-uppercase'>
                                <strong>FUNCIONARIO:</strong> {entidad.attributes.nombre_completo}<br />
                                <strong>DEPENDENCIA:</strong> {entidad.attributes.usuario}<br />
                                <strong>FECHA DE REGISTRO:</strong> {entidad.attributes.created_at}<br/>
                            </td>
                            <td  className='text-uppercase'>
                                <strong>NOMBRE DEL INVESTIGADO:</strong> {entidad.attributes.nombre_investigado}<br />
                                <strong>CARGO DEL INVESTIGADO:</strong> {entidad.attributes.cargo}<br />     
                                <strong>ENTIDAD:</strong> {entidad.attributes.nombre_entidad}<br />
                                <strong>SECTOR: </strong>{entidad.attributes.nombre_sector}<br />                                                      
                            </td>
                            <td  className='text-uppercase'>
                                <span data-toggle="modal" data-target={"#q"+entidad.id}>{entidad.attributes.observacion_corta}</span>

                                <div className="modal fade" id={"q"+entidad.id} tabindex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-xl" role="document">
                                        <div className="modal-content">
                                        <div className="modal-header block.block-themed">
                                            <h5 className="modal-title" id="descriptionModalLabel">{radicado} - {vigencia} :: OBSERVACIONES</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            {entidad.attributes.observaciones}
                                        </div>                  
                                        </div>
                                    </div>
                                </div>

                            </td>
                        </tr>
                    )
                })


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
            {isRedirect ? redirectToRoutes() : null}
            {<Spinner />}
            {<ModalGen data={getModalState} />}

            <Formik
                initialValues={{
                    descripcion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}

                    if (!getDescripcion) {
                        errores.descripcion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }
                    if (countTextArea > getMaximoTextArea) {
                        errores.descripcion = 'DEBE INGRESAR MÁXIMO ' + getMaximoTextArea + ' CARACTERES';
                    }
                    if (countTextArea < getMinimoTextArea) {
                        errores.descripcion = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARACTERES'
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/EntidadInvestigadoLista/`} state={{ from: from, disable: disable }}><small>Lista de entidades del investigado</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Activar / inactivar entidad del investigado</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso} :: ENTIDAD DEL INVESTIGADO :: INACTIVAR DATOS</h3>
                            </div>
                            <div className="block-content">

                                <div className='col-md-12 w2d-enter'>
                                    <div className='text-right'>
                                        <Link to={`/EntidadInvestigadoLista/`} title='Regresar a lista de Entidades Investigado' state={{ from: from }}>
                                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                        <thead>
                                            <tr>
                                                <th width="30%">REGISTRADO POR</th>
                                                <th width="30%">INVESTIGADO</th>
                                                <th>OBSERVACIONES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getRtaInfoEntidad ? CargarEntidad() : null}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="descripcion">MOTIVO POR EL QUE {getEstado} EL REGISTRO DE LA ENTIDAD DEL INVESTIGADO<span className="text-danger">*</span></label>
                                        <Field as="textarea" className="form-control" id="descripcion" name="descripcion" rows="4"
                                            placeholder="Escriba en este espacio la observación" maxLength={getMaximoTextArea} minLength={getMinimoTextArea} value={getDescripcion} onChange={changeDescripcion}></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name="descripcion" component={() => (<span className="text-danger">{errors.descripcion}</span>)} />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                
                                <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                
                                <Link to={`/EntidadInvestigadoLista/`} state={{ from: from}}>
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


export default EntidadInvestigadoCambiarEstadoForm;