import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import { Link } from "react-router-dom";
import CambiarDependencia from '../../Utils/CambiarDependencia';
import GenericApi from '../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';

function RequerimientoJuzgadoForm() {


    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [listaTipoRespuesta, setListaTipoRespuesta] = useState({ data: {} });
    const [respuestaTipoRespuesta, setRespuestaTipoRespuesta] = useState(false);
    const [selectedTipoRespuesta, setSelectedTipoRespuesta] = useState("");
    const [countTextArea, setCountTextArea] = useState(0);
    const [getExisteRequerimiento, setExisteRequerimiento] = useState(false);
    const [getRtaListaRequerimiento, setRtaListaRequerimiento] = useState(false);
    const [getListaRequerimiento, setListaRequerimiento] = useState({ data: [], links: [], meta: [] });
    const location = useLocation();
    const { from, disable } = location.state;
    const [getNombreProceso, setNombreProceso] = useState('');

    let procesoDisciplinarioId = from.procesoDisciplinarioId;


    const [getParametros, setParametros] = useState({
        id_proceso_disciplinario: procesoDisciplinarioId,
        id_etapa: global.Constants.ETAPAS.CAPTURA_REPARTO,
        reclasificacion: false,
        route: "/RequerimientojuzgadoLista/",
        proceso: "requerimiento_juzgado",
    });

    //Funcion principal
    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);

            GenericApi.getGeneric('tipo-respuesta').then(
                datos => !datos.error ? (setListaTipoRespuesta(datos), setRespuestaTipoRespuesta(true)) : window.showModal(1)
            )

            nombreProceso();



        }
        fetchData();
    }, []);

    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    obtenerParametros();
                    consultarRequerimientoJuzgado();
                }
            }
        )
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

                        }
                    } else {
                        setModalState({ title: getNombreProceso.toUpperCase() + " :: REQUERIMIENTO JUZGADO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/RamasProceso', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * Se consulta si la clasificación ya fue aceptada en la etapa de Evaluación.
     * @returns 
     */
    const consultarRequerimientoJuzgado = () => {

        return (
            GenericApi.getGeneric("requerimiento-juzgado/get-requerimiento-by-id-proceso-disciplinario/" + procesoDisciplinarioId).then(
                datos => {

                    if (!datos.error && datos.data.length > 0) {

                        console.log("EXISTE REGISTRO");
                        setExisteRequerimiento(true);
                        listaRequerimientos();
                    }
                    else{
                        window.showSpinner(false);
                    }
                }
            )
        )
    }


    /**
     * Se trae toda la lista de las reclasificaciones realizadas por el sistema
     */
    const listaRequerimientos = () => {

        GenericApi.getGeneric("requerimiento-juzgado/get-requerimiento-by-id-proceso-disciplinario/" + procesoDisciplinarioId).then(

            datos => {
                if (!datos.error) {
                    setListaRequerimiento(datos);
                    setRtaListaRequerimiento(true);
                }
                else {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: REQUERIMIENTO JUZGADO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/RequerimientoJuzgadoForm', from: { from } });
                }
                window.showSpinner(false);
            }
        )
    }


    const TablaRequerimientos = () => {

        if (getListaRequerimiento.data != null && typeof (getListaRequerimiento.data) != 'undefined') {
            return (

                getListaRequerimiento.data.map((requerimiento, i) => {
                    return (
                        cargarTabla(requerimiento, i)
                    )
                })
            )
        }
        else {
            return (

                getListaRequerimiento.map((requerimiento, i) => {
                    return (
                        cargarTabla(requerimiento, i)
                    )
                })
            )
        }

    }


    const cargarTabla = (requerimiento, i) => {

        return (
            <tr className='text-uppercase'>
                <td><strong>Usuario: </strong> {requerimiento.attributes.funcionario_registra.nombre} {requerimiento.attributes.funcionario_registra.apellido}<br />
                    <strong>Etapa: </strong> {requerimiento.attributes.etapa.nombre}<br />
                    <strong>Dependencia origen: </strong> {requerimiento.attributes.dependencia_origen.nombre}<br />
                    <strong>Fecha: </strong> {requerimiento.attributes.created_at}<br />
                </td>
                <td>{requerimiento.attributes.dependencia_destino.nombre}</td>
                <td>{requerimiento.attributes.funcionario_asignado.nombre} {requerimiento.attributes.funcionario_asignado.apellido}</td>
                <td>{requerimiento.attributes.descripcion}</td>

            </tr>
        )
    }



    let selectChangeTipoRespuesta = (e) => {
        setSelectedTipoRespuesta(e);
    }

    const selectTipoRespuesta = () => {
        return (
            listaTipoRespuesta.data.map((tipo_respuesta, i) => {
                return (
                    <>
                        <option key={tipo_respuesta.id} value={tipo_respuesta.id}>{tipo_respuesta.attributes.nombre}</option>
                    </>
                )
            })
        )
    }

    const enviarDatos = (valores) => {

        window.showSpinner(true);

        let data;

        data = {
            "data": {
                "type": "requerimiento_juzgado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_dependencia_origen": null,
                    "id_dependencia_destino": null,
                    "id_funcionario_asignado": null,
                    "enviar_otra_dependencia": true,
                    "descripcion": valores.informacion,
                }
            }
        }

        GenericApi.addGeneric('requerimiento-juzgado', data).then(

            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: REQUERIMIENTO JUZGADO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: REQUERIMIENTO JUZGADO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/RamasProceso', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }


    // Funcion que nos ayuda a ver si existen caracteres especiales en el textarea de -Informacion para su remisión-
    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    // COMPONENTE CONFIRMACION ENVIAR A OTRA DEPENDENCIA
    const componenteTipoRespuesta = (tipo_respuesta) => {

        // CONFIRMACION ENVIAR A OTRA DEPENDENCIA = SI
        if (tipo_respuesta === 1) {
            return (
                <>
                    <CambiarDependencia getParametros={getParametros} name_boton="REGISTRAR" name_txt_descripcion="DESCRIPCIÓN DEL REQUERIMIENTO" id="ev_cambiar_dependencia" name="ev_cambiar_dependencia" />
                </>
            );
        }

        // CONFIRMACION ENVIAR A OTRA DEPENDENCIA = NO
        else if (tipo_respuesta === 2) {
            return (
                <>
                    <Formik

                        initialValues={{
                            informacion: '',
                            enviar_otra_dependiencia: false,
                        }}
                        enableReinitialize
                        validate={(valores) => {

                            setCountTextArea(valores.informacion.length)
                            let errores = {}

                            if (!valores.informacion) {
                                errores.informacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                            }
                            else if (valores.informacion.length <= getMinimoTextArea) {
                                errores.informacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES +' ' + getMinimoTextArea ;
                            }
                            if (valores.informacion) {
                                if (containsSpecialChars(valores.informacion))
                                    errores.informacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                            }

                            return errores;
                        }}

                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}

                    >
                        {({ errors }) => (
                            <Form>

                                <div className="form-group">
                                    <label htmlFor="informacion">DESCRIPCIÓN DEL REQUERIMIENTO<span className="text-danger">*</span></label>
                                    <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder="Descripción del requerimiento"
                                        maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                    <div className="text-right">
                                        <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                    </div>
                                    <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                </div>

                                <div className="block-content block-content-full text-right">

                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>

                                    <Link to={`/ValidarClasificacionRadicadoLista/`} state={{ from: from }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                </div>
                            </Form>
                        )}

                    </Formik>

                </>
            );
        }
    };


    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <small>Enviar a otra dependencia</small></li>
                    </ol>
                </nav>
            </div>
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">{getNombreProceso} :: ENVIAR A OTRA DEPENDENDIA</h3>
                </div>
                <div className="block-content">
                    <div className='col-md-12 text-right my-2'>
                        <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                        </Link>
                    </div>
                    {getExisteRequerimiento ?
                        <table className="table table-vcenter">
                            <thead>
                                <tr>
                                    <th>REGISTRADO POR</th>
                                    <th>DEPENDENCIA DESTINO</th>
                                    <th>ASIGNADO A</th>
                                    <th>OBSERVACIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getRtaListaRequerimiento ? TablaRequerimientos() : null}
                            </tbody>
                        </table>
                        : null}
                    {!getExisteRequerimiento && from.mismoUsuarioBuscador ?
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="ingresoTipoExpediente">EL TRÁMITE DE ESTE EXPEDIENTE CONTINUA EN OTRA DEPENDENCIA?<span className="text-danger">*</span></label>
                                    <select className="form-control" id="ingresoTipoExpediente" name="ingresoTipoExpediente"
                                        value={selectedTipoRespuesta} onChange={e => selectChangeTipoRespuesta(e.target.value)}>
                                        <option value="">Por favor seleccione</option>
                                        {respuestaTipoRespuesta ? selectTipoRespuesta() : null}
                                    </select>
                                </div>
                            </div>
                        </div>
                        : null}
                        
                    {/*SI APLICA RECLASIFIFCACION*/}
                    {selectedTipoRespuesta === '1' && from.mismoUsuarioBuscador ? componenteTipoRespuesta(1) : ''}

                    {/*NO APLICA RECLASIFIFCACION*/}
                    {selectedTipoRespuesta === '2' && from.mismoUsuarioBuscador ? componenteTipoRespuesta(2) : ''}
                </div>
            </div>
        </>
    );
}
export default RequerimientoJuzgadoForm;