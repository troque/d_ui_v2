import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import { useParams } from "react-router";
import Spinner from '../../Utils/Spinner';
import Center from '../../Utils/Styles/Center.js'
import moment from 'moment';

function AntecedentesMigracionForm() {

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getAntecedente, setAntecedente] = useState({ title: "", message: "", show: false });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [getListaDependencias, setListaDependencias] = useState({ data: {} });
    const [existeListaDependencias, setExisteListaDependencias] = useState(false);

    const [getListaUsuarios, setListaUsuarios] = useState({ data: {} });
    const [existeListaUsuarios, setExisteListaUsuarios] = useState(false);

    const [existeTempPD, setExisteTempPD] = useState(false);

    let { radicado, vigencia, item } = useParams();


    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [registradoPor, setRegistradoPor] = useState('');

    const [getMigrado, setMigrado] = useState(null);



    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            antecedente();
        }
        fetchData();
    }, []);


    const antecedente = () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("migracion-antecedente/" + radicado + "/" + vigencia + "/" + item).then(
                datos => {

                    if (!datos.error) {
                        setAntecedente(datos);
                        setMigrado(datos.data[0].attributes.migrado);
                        dependencias();
                    }
                }
            )
        } catch (error) {
        }
    }


    const dependencias = () => {
        try {

            GenericApi.getGeneric("mas-dependencia-origen").then(
                datos => {

                    if (!datos.error) {
                        setListaDependencias(datos);
                        setExisteListaDependencias(true);
                        usuarios();
                    }
                }
            )
        } catch (error) {
        }
    }


    const usuarios = () => {
        try {

            GenericApi.getGeneric("usuario").then(
                datos => {

                    if (!datos.error) {
                        setListaUsuarios(datos);
                        setExisteListaUsuarios(true);
                        getInfoAntecedente();
                    }
                }
            )
        } catch (error) {
        }
    }

    const getInfoAntecedente = () => {
        try {

                GenericApi.getGeneric("migrar-antecedentes/get-antecedentes/" + radicado + "/" + vigencia + "/" + item).then(
                    datos => {

                        if (!datos.error && datos.data.length > 0) {
                            setExisteTempPD(true);
                            setDescripcion(datos.data[0].attributes.descripcion);
                            setFecha(datos.data[0].attributes.fecha_registro);
                        }
                        window.showSpinner(false);
                    }
                )
            } catch (error) {
        }
    }

    const handleClick = (event, i) => {

        if (i === 1) {
            setDescripcion(getAntecedente.data[0].attributes.antecedente);
        }

        else if (i === 2) {

            const date = getAntecedente.data[0].attributes.fecha;
            const dateFormat = 'MM/DD/YYYY';
            const toDateFormat = moment(new Date(date)).format(dateFormat);

            if (moment(toDateFormat, dateFormat, true).isValid()) {
                setFecha(getAntecedente.data[0].attributes.fecha);
            }
            else {
                setModalState({ title: "Error de formato", message: "No cumple con el formato de fecha.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            }
        }

        else if (i === 4) {
            setRegistradoPor(getAntecedente.data[0].attributes.registradoPor);
        }

    };


    const handleInputChange = (event, i) => {

        if (i === 1) {
            setDescripcion(event.currentTarget.value);
        }

        else if (i === 2) {
            setFecha(event.currentTarget.value)
        }

        else if (i === 4) {
            setRegistradoPor(event.currentTarget.valuer);
        }

        return true;

        //return true;
    }

    const infoAntecedente = (errors) => {

        console.log("getAntecedente -> ", getAntecedente)

        if (getAntecedente.data != null && typeof (getAntecedente.data) != 'undefined') {
            return (

                getAntecedente.data.length > 0 && getAntecedente.data.map((item, i) => {
                    return (
                        <>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <h4>ORIGEN</h4>
                                    <hr />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <h4>
                                    <small>{existeTempPD ? <i className="far fa-dot-circle txt-green"></i> : <i className="far fa-dot-circle txt-red"></i>} </small>
                                    DESTINO
                                </h4>
                                <hr />
                            </div>

                            {/* ANTECEDENTE */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="antecedente_origen">ANTECEDENTE</label>
                                    <Field patt value={item.attributes.antecedente} autoComplete="off" as="textarea"
                                        className="form-control" id="antecedente_origen" name="antecedente_origen" rows="4" disabled={true}>
                                    </Field>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 1)}>
                                            <i className="fas fa-angle-double-right"></i></button>
                                    </Center>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="antecedente_destino">ANTECEDENTE<span className="text-danger">*</span></label>
                                    <Field as="textarea" className="form-control" id="antecedente_destino" name="antecedente_destino" rows="4"
                                        value={descripcion} onChange={event => handleInputChange(event, 1)}></Field>
                                    <ErrorMessage name='descripcion' component={() => (<span className='text-danger'>{errors.descripcion}</span>)} />
                                </div>
                            </div>

                            {/* FECHA */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="fecha_antecedente_origen">FECHA</label>
                                    <Field value={item.attributes.fecha} as="input" type="text" autoComplete="off" className="form-control"
                                        id="fecha_antecedente_origen" name="fecha_antecedente_origen" disabled={true}></Field>
                                </div>
                            </div>

                            <div className="col-md-2">

                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="fecha_antecedente_destino">FECHA<span className="text-danger">*</span></label>
                                    <Field value={fecha} as="input" type="date" autoComplete="off" className="form-control" id="fecha_antecedente_destino"
                                        name="fecha_antecedente_destino" onChange={event => handleInputChange(event, 2)}></Field>
                                    <ErrorMessage name='fecha' component={() => (<span className='text-danger'>{errors.fecha}</span>)} />
                                </div>
                            </div>

                        </>
                    )
                })
            )
        }
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);
        let data;

        data = {
            "data": {
                "type": 'antecedente',
                "attributes": {
                    "descripcion": datos.descripcion,
                    "fecha_registro": datos.fecha,
                    "registrado_por": datos.registrado_por,
                    "radicado": radicado,
                    "vigencia": vigencia,
                    "item": item,
                }
            }
        }

        GenericApi.addGeneric("migrar-antecedentes", data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "PROCESO No " + radicado + " :: MIGRAR ANTECEDENTE", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: `/ListarMigracionAntecedentes/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "PROCESO No " + radicado + " :: MIGRAR ANTECEDENTE", message: datos.error.toString(), show: true, redirect: `/ListarMigracionAntecedentes/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);

            }
        )
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}

            <Formik
                initialValues={{
                    descripcion: descripcion,
                    fecha: fecha,
                    registrado_por: registradoPor,
                }}
                enableReinitialize
                validate={(valores) => {

                    let errores = {}

                    if (!valores.descripcion) {
                        errores.descripcion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if (!valores.fecha) {
                        errores.fecha = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    return errores

                }}
                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>

                        <div className="w2d_block">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Buscador`}><small>Buscador</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`}><small>Inicio proceso de migración</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ListarMigracionAntecedentes/${radicado}/${vigencia}`}><small>Lista de antecedentes</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Antecedentes</small></li>
                                </ol>
                            </nav>
                        </div>


                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">MIGRACIÓN PROCESO No :: {radicado} - {vigencia} - ITEM No {item == -1 ? 1 : item + 1} :: ANTECEDENTE</h3>
                            </div>

                            <div className="block-content">

                                <div className='text-right w2d-enter'>
                                    <Link to={`/ListarMigracionAntecedentes/${radicado}/${vigencia}`} title='Regresar' >
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>

                                <div className="row">

                                    {infoAntecedente(errors)}

                                </div>

                            </div>
                            {getMigrado === true ? null :
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                </div>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}


export default AntecedentesMigracionForm;