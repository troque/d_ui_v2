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

function EntidadMigracionForm() {

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getLista, setLista] = useState({ title: "", message: "", show: false });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });


    let { radicado, vigencia, item } = useParams();


    const [entidad, setEntidad] = useState('');
    const [idEntidad, setIdEntidad] = useState('');
    const [direccion, setDireccion] = useState('');
    const [sector, setSector] = useState('');
    const [nombreInvestigado, setNombreInvestigado] = useState('');
    const [cargoInvestigado, setCargoInvestigado] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const [getListaEntidad, setListaEntidad] = useState({ data: {} });
    const [existeEntidad, setExisteEntidad] = useState(false);

    const [existeTempPD, setExisteTempPD] = useState(false);

    const [getMigrado, setMigrado] = useState(null);


    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            lista();

        }
        fetchData();
    }, []);


    const lista = () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("migracion-entidad/" + radicado + "/" + vigencia + "/" + item).then(
                datos => {

                    if (!datos.error) {
                        setLista(datos);
                        setMigrado(datos.data[0].attributes.migrado);
                        entidades();
                    } else {
                        //setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }

                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const entidades = () => {
        try {

            GenericApi.getGeneric("entidades").then(
                datos => {

                    if (!datos.error) {
                        setListaEntidad(datos);
                        setExisteEntidad(true);
                        getInfoEntidades();
                    } else {
                        //setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    //window.showSpinner(false);
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const getInfoEntidades = () => {
        try {

            GenericApi.getGeneric("migrar-entidades/get-entidades/" + radicado + "/" + vigencia + "/" + item).then(
                datos => {

                    if (!datos.error && datos.data.length > 0) {
                        setExisteTempPD(true);
                        setEntidad(datos.data[0].attributes.id_entidad);
                        setDireccion(datos.data[0].attributes.direccion);
                        setSector(datos.data[0].attributes.sector);
                        setNombreInvestigado(datos.data[0].attributes.nombre_investigado);
                        setCargoInvestigado(datos.data[0].attributes.cargo_investigado);
                        setObservaciones(datos.data[0].attributes.observaciones);
                    }
                    else {
                        //setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR }); 
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
        }
    }


    const handleClick = (event, i) => {

        if (i === 1) {
            setEntidad(getLista.data[0].attributes.entidad);
        }

        else if (i === 2) {
            setDireccion(getLista.data[0].attributes.direccion);
        }

        else if (i === 3) {
            setSector(getLista.data[0].attributes.sector);
        }

        else if (i === 4) {
            setNombreInvestigado(getLista.data[0].attributes.nombreInvestigado);
        }

        else if (i === 5) {
            setCargoInvestigado(getLista.data[0].attributes.cargoInvestigado);
        }

        else if (i === 6) {
            setObservaciones(getLista.data[0].attributes.observaciones);
        }

    };


    const handleInputChange = (event, i) => {

        if (i === 1) {
            setEntidad(event.currentTarget.value);
        }

        else if (i === 2) {
            setDireccion(event.currentTarget.value)
        }

        else if (i === 3) {
            setSector(event.currentTarget.value)
        }

        else if (i === 4) {
            setNombreInvestigado(event.currentTarget.value)
        }

        else if (i === 5) {
            setCargoInvestigado(event.currentTarget.value)
        }

        else if (i === 6) {
            setObservaciones(event.currentTarget.value)
        }

        return true;

    }


    const listaEntidades = () => {
        return (
            getListaEntidad.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                )
            })
        )
    }

    const infoEntidades = () => {

        console.log("infoEntidades -> ", getLista)

        if (getLista.data != null && typeof (getLista.data) != 'undefined') {
            return (

                getLista.data.length > 0 && getLista.data.map((item, i) => {
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



                            {/* 1. ENTIDAD */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="entidad_origen">ENTIDAD</label>
                                    <Field value={item.attributes.entidad} as="input" type="text" autoComplete="off"
                                        className="form-control" id="entidad_origen" name="entidad_origen" disabled={true}>
                                    </Field>
                                </div>
                            </div>

                            <div className="col-md-2">

                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="entidad_destino">ENTIDAD</label>
                                    <Field onChange={event => handleInputChange(event, 1)} as="select" className="form-control"
                                        value={entidad} id="entidad_destino" name="entidad_destino">
                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        {existeEntidad ? listaEntidades() : null}
                                    </Field>

                                </div>
                            </div>


                            {/* 2. DIRECCION */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="direccion_origen">DIRECCIÓN</label>
                                    <Field value={item.attributes.direccion} as="input" type="text" autoComplete="off"
                                        className="form-control" id="direccion_origen" name="direccion_origen" disabled={true}></Field>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 2)}>
                                            <i className="fas fa-angle-double-right"></i></button>
                                    </Center>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="direccion_destino">DIRECCIÓN</label>
                                    <Field value={direccion} as="input" type="text" autoComplete="off" className="form-control"
                                        id="direccion_destino" name="direccion_destino" onChange={event => handleInputChange(event, 2)}>

                                    </Field>
                                </div>
                            </div>


                            {/* 3. SECTOR */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="sector_origen">SECTOR</label>
                                    <Field value={item.attributes.sector} as="input" type="text" autoComplete="off"
                                        className="form-control" id="sector_origen" name="sector_origen" disabled={true}></Field>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 3)}>
                                            <i className="fas fa-angle-double-right"></i></button>
                                    </Center>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="sector_destino">SECTOR</label>
                                    <Field value={sector} as="input" type="text" autoComplete="off" className="form-control"
                                        id="sector_destino" name="sector_destino"
                                        onChange={event => handleInputChange(event, 3)}></Field>
                                </div>
                            </div>

                            {/* 4. NOMBRE INVESTIGADO */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="nombre_investigado_origen">NOMBRE DEL INVESTIGADO</label>
                                    <Field value={item.attributes.nombreInvestigado} as="input" type="text"
                                        autoComplete="off" className="form-control"
                                        id="nombre_investigado_origen" name="nombre_investigado_origen" disabled={true}></Field>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 4)}>
                                            <i className="fas fa-angle-double-right"></i></button>
                                    </Center>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="nombre_investigado_destino">NOMBRE DEL INVESTIGADO</label>
                                    <Field value={nombreInvestigado} as="input" type="text" autoComplete="off" className="form-control"
                                        id="nombre_investigado_destino" name="nombre_investigado_destino"
                                        onChange={event => handleInputChange(event, 4)}></Field>

                                </div>
                            </div>


                            {/*5. CARGO INVESTIGADO*/}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="cargo_investigado_origen">CARGO DEL INVESTIGADO</label>
                                    <Field value={item.attributes.cargoInvestigado} as="input" type="text" autoComplete="off" className="form-control"
                                        id="cargo_investigado_origen" name="cargo_investigado_origen" disabled={true}></Field>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 5)}>
                                            <i className="fas fa-angle-double-right"></i></button>
                                    </Center>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="cargo_investigado_destino">CARGO DEL INVESTIGADO</label>
                                    <Field value={cargoInvestigado} as="input" type="text" autoComplete="off" className="form-control"
                                        id="cargo_investigado_destino" name="cargo_investigado_destino" onChange={event => handleInputChange(event, 5)}></Field>
                                </div>
                            </div>

                            {/* 6. OBSERVACIONES */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="observaciones_origen">OBSERVACIONES</label>
                                    <Field patt value={item.attributes.observaciones} autoComplete="off" as="textarea" className="form-control"
                                        id="observaciones_origen" name="observaciones_origen" rows="4" disabled={true}></Field>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="form-group">
                                    <Center>
                                        <button type="button" className="btn btn-success" onClick={event => handleClick(event, 6)}>
                                            <i className="fas fa-angle-double-right"></i></button>
                                    </Center>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="observaciones_destino">OBSERVACIONES</label>
                                    <Field as="textarea" className="form-control" id="observaciones_destino" name="observaciones_destino"
                                        rows="4" value={observaciones} onChange={event => handleInputChange(event, 6)}></Field>
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
                "type": 'entidad-migracion',
                "attributes": {
                    "id_entidad": entidad,
                    //"id_entidad": datos.idEntidad,
                    "direccion": datos.direccion,
                    "sector": datos.sector,
                    "nombre_investigado": datos.nombreInvestigado,
                    "cargo_investigado": datos.cargoInvestigado,
                    "observaciones": datos.observaciones,
                    "radicado": radicado,
                    "vigencia": vigencia,
                    "item": item,
                }
            }
        }

        GenericApi.addGeneric("migrar-entidades", data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "PROCESO No " + radicado + " :: CREAR ENTIDAD", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: `/ListarMigracionEntidades/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "PROCESO No " + radicado + " :: CREAR ENTIDAD", message: datos.error.toString(), show: true, redirect: `/ListarMigracionEntidades/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.ERROR });
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
                    idEntidad: idEntidad,
                    entidad: entidad,
                    direccion: direccion,
                    sector: sector,
                    nombreInvestigado: nombreInvestigado,
                    cargoInvestigado: cargoInvestigado,
                    observaciones: observaciones,
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}

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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ListarMigracionEntidades/${radicado}/${vigencia}`}><small>Lista de entidades</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Entidades del investigado</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">MIGRACIÓN PROCESO No  :: <strong>MIGRAR ENTIDAD DEL INTERESADO {item == -1 ? 1 : item + 1}</strong> :: Entidad del interesado</h3>
                            </div>

                            <div className="block-content">

                                <div className='text-right w2d-enter'>
                                    <Link to={`/ListarMigracionEntidades/${radicado}/${vigencia}`} title='Regresar' >
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>

                                <div className="row">

                                    {infoEntidades()}

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


export default EntidadMigracionForm;