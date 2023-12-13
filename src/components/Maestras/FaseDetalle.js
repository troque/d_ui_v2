import React, { useEffect, useState } from 'react';
import 'rhfa-emergency-styles/dist/styles.css'
import Spinner from '../Utils/Spinner';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useParams } from "react-router";
import { Link, } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import GenericApi from '../Api/Services/GenericApi';
import ModalGen from '../Utils/Modals/ModalGeneric';
import { Navigate } from "react-router-dom";
import { getUser } from '../Utils/Common';

function FaseDetalle() {

    let { id } = useParams();
    const [getNombre, setNombre] = useState('');
    const [getEstado, setEstado] = useState('');
    const [getEtapa, setEtapa] = useState('');
    const [getIdEtapa, setIdEtapa] = useState('');
    const [getListaPreguntas, setListaPreguntas] = useState({ data: {} });
    const [getRtaListaPreguntas, setRtaListaPreguntas] = useState('');
    const [getEstadoRequiereDocumentos, setEstadoRequiereDocumentos] = useState(false);
    const [getCompulsaCopias, setCompulsaCopias] = useState(false);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getRepuestaNombre, setRepuestaNombre] = useState(true);
    
    useEffect(() => {
        window.showSpinner(true);
        async function fetchData() {
            cargarInfoFase();
        }
        fetchData();
    }, []);


    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombre") {
            if (value === '' || 
            (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value) && 
            value.length <= 255)) {
                setNombre(value);
                setRepuestaNombre(true);
            }else{
                setRepuestaNombre(false);
            }
        }

        if (name == "estado") {
            setEstado(value);
        }
    }


    const cargarInfoFase = () => {

        GenericApi.getByIdGeneric("mas-fase", id).then(
            datos => {
                if (!datos.error) {
                    setNombre(datos.data.attributes.nombre);
                    setEstado(datos.data.attributes.estado);
                    setEtapa(datos.data.attributes.etapa.nombre);
                    setIdEtapa(datos.data.attributes.id_etapa)
                    preguntasDocCierre();
                }
                else {

                }

            }
        )
    }

    const preguntasDocCierre = () => {

        GenericApi.getGeneric("preguntas-doc-cierre", id).then(
            datos => {
                if (!datos.error) {
                    setListaPreguntas(datos);
                    setRtaListaPreguntas(true);
                    estadoPreguntas()
                }
                else {

                }

            }
        )
    }

    const estadoPreguntas = () => {

        GenericApi.getGeneric("estado-preguntas").then(
            datos => {
                if (!datos.error) {
                    setEstadoRequiereDocumentos(datos.data[0].attributes.preguntas_documento_cierre);
                    setCompulsaCopias(datos.data[0].attributes.compulsan_copias);
                }
                else {

                }
                window.showSpinner(false);
            }
        )
    }


    const agregarCheck = (e, id) => {

        if (id == 1) {
            setEstadoRequiereDocumentos(e);
            console.log("Soy 1 " + e);
        }
        if (id == 2) {
            setCompulsaCopias(e);
            console.log("Soy 2 " + e);
        }
    }

    /**
     * 
     */
    const enviarDatos = () => {
        window.showSpinner(true);

        let data = {
            "data": {
                "type": "mas_fase",
                "attributes": {
                    "id_etapa": getIdEtapa,
                    "nombre": getNombre ? getNombre : "",
                    "estado": getEstado ? getEstado : "",
                }
            }
        }

        GenericApi.updateGeneric('mas-fase', id, data).then(
            datos => {
                if (!datos.error) {

                    if (id != 8) {
                        window.showSpinner(false);
                        setModalState({ title: "SINPROC No :: Actualizar Fase", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/Fase', alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else {
                        enviarDatosDocumentoCierre();
                    }

                } else {
                    window.showSpinner(false);
                    setModalState({ title: "SINPROC No :: Actualizar Fase", message: datos.error.toString(), show: true, redirect: '/Fase', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    const enviarDatosDocumentoCierre = () => {

        let data = {
            "data": {
                "type": "documento_cierre",
                "attributes": {
                    "requiere_documento": getEstadoRequiereDocumentos,
                    "compulsa_copias": getCompulsaCopias,
                }
            }
        }

        GenericApi.addGeneric('update-preguntas-doc-cierre', data).then(
            datos => {
                if (!datos.error) {
                    window.showSpinner(false);
                    setModalState({ title: "SINPROC No :: Actualizar Fase", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/Fase', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    window.showSpinner(false);
                    setModalState({ title: "SINPROC No :: Enviar respuestas Documento Cierre", message: datos.error.toString(), show: true, redirect: '/Fase', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    const listarPreguntas = () => {

        return (
            getListaPreguntas.data.map((acceso, i) => {
                return (
                    <tr key={(acceso.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        <div>
                                            {
                                                (getListaPreguntas.length > 0) ? (
                                                    (getListaPreguntas.indexOf(acceso.id.toString()) > -1) ? (
                                                        <>
                                                            <div>
                                                                <input defaultChecked={acceso.attributes.estado == 1 ? true : false} type="checkbox" onChange={e => agregarCheck(e.target.checked, acceso.id)} className="custom-control-input" id={acceso.id} name={acceso.id} />
                                                                <label className="custom-control-label" htmlFor={acceso.id}></label>
                                                            </div>
                                                        </>
                                                    ) :
                                                        <div>
                                                            <input type="checkbox" onChange={e => agregarCheck(e.target.checked, acceso.id)} className="custom-control-input" id={acceso.id} name={acceso.id} />
                                                            <label className="custom-control-label" htmlFor={acceso.id}></label>
                                                        </div>
                                                ) :
                                                    <div>
                                                        <input type="checkbox" defaultChecked={acceso.attributes.estado == 1 ? true : false} onChange={e => agregarCheck(e.target.checked, acceso.id)} className="custom-control-input" id={acceso.id} name={acceso.id} />
                                                        <label className="custom-control-label" htmlFor={acceso.id}></label>
                                                    </div>
                                            }
                                        </div>
                                    }

                                </>

                            </div>
                        </td>
                        <td>
                            {acceso.attributes.nombre}
                        </td>
                    </tr>

                )
            })

        )

    }


    const componentFormularioFase = () => {

        return (
            <>
                <Spinner />
                <Formik
                    initialValues={{
                        nombre: '',
                        estado: '',
                    }
                    }
                    enableReinitialize
                    validate={(valores) => {
                        let errores = {}

                        if(getRepuestaNombre == false){
                            errores.nombre = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                        }
                        if (!getNombre) {
                            errores.nombre = "Debe ingresar un nombre";
                        }

                        if (!getEstado) {
                            errores.estado = "Debe ingresar un estado";
                        }

                        return errores
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        enviarDatos();
                    }}
                >
                    {({ errors }) => (
                        <Form>
                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="block block-themed">
                                        <div className="block-header">
                                            <h3 className="block-title">ADMINSITRACIÓN :: FASES</h3>
                                        </div>
                                        <div className="block-content">

                                            <div className="row text-right w2d-enter">
                                                <div className="col-md-12">
                                                    <Link to={'/Fase'} title='Regresar'>
                                                        <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor='nombre'>NOMBRE <span className="text-danger">*</span> </label>
                                                        <Field value={getNombre} type="text" id="nombre" name="nombre" className="form-control"
                                                            placeholder="Nombre" onChange={handleInputChange} />
                                                        <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor='user'>NOMBRE DE LA ETAPA A LA QUE PERTENECE <span className="text-danger">*</span></label>
                                                        <Field value={getEtapa} type="text" id="etapa" name="etapa" className="form-control"
                                                            placeholder="Etapa" onChange={handleInputChange} disabled="true" />
                                                        <ErrorMessage name="etapa" component={() => (<span className="text-danger">{errors.estado}</span>)} />
                                                    </div>
                                                </div>

                                            </div>

                                            {id == 8 ?

                                                <div className="row mt-3" >
                                                    <div className="col-md-12">
                                                        <ErrorMessage name="accesos" component={() => (<span className="text-danger">{errors.accesos}</span>)} />
                                                    </div>

                                                    <div className="col-md-12">
                                                        <label>PREGUNTAS FASE DOCUMENTO CIERRE</label>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>ACTIVAR/INACTIVAR</th>
                                                                    <th>PREGUNTA</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody >
                                                                {getRtaListaPreguntas ? listarPreguntas() : null}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div> : null}
                                        </div>

                                        <div className="block-content block-content-full text-right">
                                            <button type="submit" className="btn btn-rounded btn-primary">
                                                {global.Constants.BOTON_NOMBRE.ACTUALIZAR}
                                            </button>
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


    return (

        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}


            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Fase`}><small>Lista de fases</small></Link></li>
                        <li className="breadcrumb-item"> <small>Editar Fase</small></li>
                    </ol>
                </nav>
            </div>

            <div className="col-md-12">
                {componentFormularioFase()}
            </div>
        </>
    )



};

export default FaseDetalle;