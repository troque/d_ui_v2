import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import Autocomplete from "../../Autocomplete/Autocomplete";
import { useLocation } from 'react-router-dom'
import '../../Utils/Constants';

import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';


function EntidadInvestigadoForm() {

    const [selectedRegistro, setSelectedRegistro] = useState("");
    const [idEntidad, setIdEntidad] = useState('');

    const [nombreInvestigado, setNombreInvestigado] = useState('');
    const [cargoInvestigado, setCargoInvestigado] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [esAnonimo, setEsAnonimo] = useState(false);

    const [countTextArea, setCountTextArea] = useState(0);
    const [listaEntidad, setListaEntidad] = useState({ data: {} });
    const [respuestaEntidad, setRespuestaEntidad] = useState(false);
    const [getInformacionPersoneria, setInformacionPersoneria] = useState({ data: {} })

    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');

    const location = useLocation()
    const { from } = location.state;
    var tipoQueja;

    if (from.subTipoExpediente) {
        if (from.subTipoExpediente.id_tipo_queja) {
            tipoQueja = from.subTipoExpediente.id_tipo_queja;
        }
    }

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;


    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }


    useEffect(() => {

        async function fetchData() {
            window.showSpinner(true);
            getApiObtenerEntidades();
        }

        fetchData();
    }, []);

    const getApiObtenerEntidades = () => {
        GenericApi.getAllGeneric('entidades').then(
            datos => {
                if (!datos.error) {
                    setListaEntidad(datos);
                    // Se valida que sea un tipo de queja interna
                    if (tipoQueja == 2) {
                        let informacionPersoneria = datos.data.filter(e => e.nombre == "PERSONERIA DE BOGOTA D.C.");
                        informacionPersoneria[0].tipoQueja = tipoQueja;
                        setInformacionPersoneria(informacionPersoneria);
                        setSelectedRegistro(true);
                        asignarAnonimoCheck(false);
                        setIdEntidad(67);
                    }
                    setRespuestaEntidad(true);
                    obtenerParametros();
                } else {
                    setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

                }
            }
        )
    }

    const obtenerParametros = () => {

        const data = {
            "data": {
                "type": 'mas_parametro',
                "attributes": {
                    "nombre": "minimo_caracteres_textarea|maximo_caracteres_textarea"
                }
            }
        }
        GenericApi.getByDataGeneric('parametro/parametro-nombre', data).then(
            //buscamos el parametro
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
                    setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
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


    const handleCallback = (childData) => {
        try {
            setIdEntidad(childData)
            // console.log("chilData -> ", childData);
            if (childData) {
                if (childData == '1') {
                    // console.log("childData 1 -> ", childData);
                    asignarAnonimo();
                }
                else {
                    setEsAnonimo(false);
                    setNombreInvestigado("");
                    setCargoInvestigado("");
                    setObservaciones("");
                }
            }
        } catch (error) {

        }

    }

    let selectChangeRegistro = (e) => {
        setSelectedRegistro(e);

        asignarAnonimoCheck(false);
    }

    const enviarDatos = (datos) => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializa la variable
        let data;

        // Se valida si se selecciono investigado
        if (selectedRegistro === "true") {

            // Se redeclara la variable con la data
            data = {
                "data": {
                    "type": "entidad_investigado",
                    "attributes": {
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_etapa": 1,
                        "id_entidad": idEntidad,
                        "nombre_investigado": nombreInvestigado,
                        "cargo": cargoInvestigado,
                        "codigo": datos.codigoEntidadInvestigado,
                        "observaciones": observaciones,
                        "estado": true,
                        "requiere_registro": true,
                        "sector": "",
                    }
                }
            }
        } else {

            // Se redeclara la variable con la data
            data = {
                "data": {
                    "type": "entidad_investigado",
                    "attributes": {
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_etapa": 1,
                        "id_entidad": null,
                        "nombre_investigado": null,
                        "cargo": null,
                        "codigo": null,
                        //"observaciones": datos.observaciones ? datos.observaciones : "",
                        "observaciones": observaciones,
                        "estado": true,
                        "requiere_registro": false,
                        "sector": null,

                    }
                }
            }
        }

        // Se consume la API
        GenericApi.getByDataGeneric("entidad-investigado", data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Setea la modal
                    setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/EntidadInvestigadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Setea la modal
                    setModalState({ title: getNombreProceso + " ::  ENTIDAD DEL INVESTIGADO", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    let asignarAnonimo = () => {
        setEsAnonimo(true);
        setNombreInvestigado("NO_APLICA");
        setCargoInvestigado("NO_APLICA");
        setObservaciones("NO_APLICA");

    }


    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombreInvestigado") {
            if (value == '')
                setNombreInvestigado('');

            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value)) {
                setNombreInvestigado(value);
                return true;
            }
            else {
                return false;
            }
        }

        if (name == "cargoInvestigado") {
            if (value == '')
                setCargoInvestigado('');

            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value)) {
                setCargoInvestigado(value);
                return true;
            }
            else {
                return false;
            }
        }

        if (name == "observaciones") {
            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value)) {
                setCountTextArea(value.length);
                setObservaciones(value);
            }
        }
    }


    let asignarAnonimoCheck = (e) => {
        setEsAnonimo(e);

        if (e) {
            setNombreInvestigado("NO_APLICA");
            setCargoInvestigado("NO_APLICA");
            setCountTextArea("NO_APLICA".length)
            setObservaciones("NO_APLICA");
        }
        else {
            setNombreInvestigado("");
            setCargoInvestigado("");
            setCountTextArea("");
            setObservaciones("");
        }

    }

    // COMPOENENTE TIPO EXPEDIENTE
    const componenteEntidadInvestigado = (aplica_entidad) => {

        if (aplica_entidad === true) {
            return (
                <>
                    <Formik
                        initialValues={{
                            idEntidad: '',
                            codigoEntidadInvestigado: '',
                            nombreInvestigado: '',
                            cargoInvestigado: '',
                            observaciones: '',
                        }}
                        enableReinitialize
                        validate={(valores) => {
                            let errores = {}

                            if (!valores.idEntidad && idEntidad == '') {
                                errores.idEntidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (!nombreInvestigado) {
                                errores.nombreInvestigado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (!cargoInvestigado) {
                                errores.cargoInvestigado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (!observaciones) {
                                errores.observaciones = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (observaciones.length <= getMinimoTextArea && observaciones != 'NO_APLICA') {
                                errores.observaciones = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARÁCTERES'
                            }
                            if (observaciones.length > getMaximoTextArea && observaciones != 'NO_APLICA') {
                                errores.observaciones = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARÁCTERES'
                            }

                            if (observaciones) {
                                if (containsSpecialChars(observaciones))
                                    errores.observaciones = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS
                            }

                            return errores;
                        }}

                        onSubmit={(valores, { resetForm }) => {
                            //console.log (valores);
                            enviarDatos(valores);
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="row">
                                    <div className="block block-themed">
                                        <div className="block-content">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="idEntidad">ENTIDAD EL INVESTIGADO<span className="text-danger">*</span></label>
                                                        <Autocomplete suggestions={listaEntidad} parentCallback={handleCallback} dataPersoneria={getInformacionPersoneria} />
                                                        <ErrorMessage name="idEntidad" component={() => (<span className="text-danger">{errors.idEntidad}</span>)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="block-content">
                                                    <>
                                                        {
                                                            (esAnonimo == true) ? (
                                                                <div className='text-center'>
                                                                    <div className="custom-control custom-switch custom-control-lg mb-2">
                                                                        <input type="checkbox" checked onChange={e => asignarAnonimoCheck(e.target.checked)} className="custom-control-input" id="example-sw-custom-lg11" name="example-sw-custom-lg11" />
                                                                        <label className="custom-control-label" htmlFor="example-sw-custom-lg11">NO CONOZCO LOS DATOS</label>
                                                                    </div>
                                                                </div>
                                                            ) : null
                                                        }

                                                        {
                                                            (esAnonimo == false) ? (
                                                                <div className='text-center'>
                                                                    <div className="custom-control custom-switch custom-control-lg mb-2">
                                                                        <input type="checkbox" onChange={e => asignarAnonimoCheck(e.target.checked)} className="custom-control-input" id="example-sw-custom-lg12" name="example-sw-custom-lg12" />
                                                                        <label className="custom-control-label" htmlFor="example-sw-custom-lg12">NO CONOZCO LOS DATOS</label>
                                                                    </div>
                                                                </div>
                                                            ) : null
                                                        }
                                                    </>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="nombreInvestigado">NOMBRE DEL INVESTIGADO<span className="text-danger">*</span></label>
                                                        <Field disabled={esAnonimo} onChange={handleInputChange} as="input" value={nombreInvestigado} className="form-control" type="text" id="nombreInvestigado" name="nombreInvestigado" placeholder="Nombre del Investigado" autocomplete="off"/>
                                                        <ErrorMessage name="nombreInvestigado" component={() => (<span className="text-danger">{errors.nombreInvestigado}</span>)} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="cargoInvestigado">CARGO DEL INVESTIGADO<span className="text-danger">*</span></label>
                                                        <Field disabled={esAnonimo} onChange={handleInputChange} as="input" value={cargoInvestigado} className="form-control" type="text" id="cargoInvestigado" name="cargoInvestigado" placeholder="Cargo del Investigado" autocomplete="off" />
                                                        <ErrorMessage name="cargoInvestigado" component={() => (<span className="text-danger">{errors.cargoInvestigado}</span>)} />
                                                    </div>
                                                </div>


                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="observaciones">OBSERVACIONES <span className="text-danger">*</span></label>
                                                        <Field disabled={esAnonimo} as="textarea" value={observaciones} onChange={handleInputChange} className="form-control" id="observaciones" name="observaciones" rows="4"
                                                            placeholder="Observaciones" maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                        <div className="text-right">
                                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                        </div>
                                                        <ErrorMessage name="observaciones" component={() => (<span className="text-danger">{errors.observaciones}</span>)} />
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="block-content block-content-full text-right">
                                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                                        <Link to={`/EntidadInvestigadoLista/`} state={{ from: from }}>
                                                            <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            );
        }

        else {

            return (
                <>

                    <Formik
                        initialValues={{
                            observaciones: '',
                        }}
                        enableReinitialize

                        validate={(valores) => {
                            let errores = {}

                            if (!observaciones) {
                                errores.observaciones = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                            if (observaciones.length <= getMinimoTextArea && observaciones != 'NO_APLICA') {
                                errores.observaciones = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARÁCTERES'
                            }
                            if (observaciones.length > getMaximoTextArea && observaciones != 'NO_APLICA') {
                                errores.observaciones = 'DEBE INGRESAR MAXIMO ' + getMaximoTextArea + ' CARÁCTERES'
                            }

                            if (observaciones) {
                                if (containsSpecialChars(observaciones))
                                    errores.observaciones = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS
                            }

                            //console.log(errores);
                            return errores
                        }}

                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}
                    >

                        {({ errors }) => (
                            <Form>
                                <div className="row">

                                    <div className="block-content">


                                        <div className="row">

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="nombreInvestigado">NOMBRE DEL INVESTIGADO<span className="text-danger">*</span></label>
                                                    <Field disabled={true} onChange={handleInputChange} as="input" value="NO_APLICA" className="form-control" type="text" id="nombreInvestigado" name="nombreInvestigado" placeholder="Nombre del Investigado" autocomplete="off"/>

                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="cargoInvestigado">CARGO DEL INVESTIGADO<span className="text-danger">*</span></label>
                                                    <Field disabled={true} onChange={handleInputChange} as="input" value="NO_APLICA" className="form-control" type="text" id="cargoInvestigado" name="cargoInvestigado" placeholder="Cargo del Investigado" autocomplete="off"/>

                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="observaciones">OBSERVACIONES<span className="text-danger">*</span></label>
                                                    <Field disabled={esAnonimo} as="textarea" value={observaciones} onChange={handleInputChange} className="form-control" id="observaciones" name="observaciones" rows="4"
                                                        placeholder="Observaciones" maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                    <div className="text-right">
                                                        <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                    </div>
                                                    <ErrorMessage name="observaciones" component={() => (<span className="text-danger">{errors.observaciones}</span>)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">

                                            <div className="col-md-12">
                                                <div className="block-content block-content-full text-right">
                                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                                    <Link to={`/EntidadInvestigadoLista/`} state={{ from: from }}>
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
            );



        }
    };

    // COMPONENTE PRINCIPAL
    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}

            <div className="content">


                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" aria-current="page" to={`/EntidadInvestigadoLista/`} state={{ from: from }}><small>Entidad del investigado</small></Link></li>
                            <li className="breadcrumb-item"><small>Nueva entidad del investigado</small></li>
                        </ol>
                    </nav>
                </div>



                <div className="row">
                    <div className="col-md-12">
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso}:: ENTIDAD DE INVESTIGADO</h3>
                            </div>
                            <div className="block-content">
                                <div className="form-group">
                                    <div className="alert alert-warning alert-dismissable" role="alert">
                                        <h3 className="alert-heading font-size-h4 my-2">ALERTA.</h3>
                                        <p className="mb-0">POR LA CLASIFICACIÓN DEL EXPEDIENTE, SELECCIONE <strong>SI APLICA o NO APLICA</strong> EL REGISTRO DE ESTA INFORMACIÓN</p>

                                    </div>
                                    <div className='text-right'>
                                        <Link to={`/EntidadInvestigadoLista/`} title='Regresar a lista de Entidades Investigado' state={{ from: from }}>
                                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    </div>
                                    <label htmlFor="require">APLICA REGISTRO<span className="text-danger">*</span></label>
                                    <select className="form-control" id="registroExpediente" name="registroExpediente" value={selectedRegistro}
                                        onChange={e => selectChangeRegistro(e.target.value)}>
                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                        <option value="true">SI</option>
                                        <option value="false">NO</option>
                                    </select>

                                    {/*DERECHO DE PETICION*/}
                                    {selectedRegistro === 'true' || tipoQueja == 2 ? componenteEntidadInvestigado(true) : ''}
                                    {/*PODER REFERENTE A SOLIICTUD*/}
                                    {selectedRegistro === 'false' ? componenteEntidadInvestigado(false) : ''}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}
export default EntidadInvestigadoForm;
