import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Spinner from '../Utils/Spinner';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import '../Utils/Constants';
import ModalGen from '../Utils/Modals/ModalGeneric';
import InfoErrorApi from '../Utils/InfoErrorApi';
import Select from 'react-select';

function ParametroCamposCaratulaForm() {

    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [countTextArea, setCountTextArea] = useState(0);

    // Constantes para cargar los valores
    const [getNombreParametro, setNombreParametro] = useState("");
    const [getValorParametro, setValorParametro] = useState([]);

    const [getArrayEstados, setArrayEstados] = useState([]);

    const [getMensajeErrorNombreParametro, setMensajeErrorNombreParametro] = useState("");
    const [getMensajeErrorValorParametro, setMensajeErrorValorParametro] = useState("");
    const [getMensajeErrorEstado, setMensajeErrorEstado] = useState("");

    const getListaEstados =
        [
            { value: '1', label: 'ACTIVO' },
            { value: '0', label: 'INACTIVO' }
        ];

    const getListaValorParametro =
        [
            { value: 'Sinproc', label: 'No de SINPROC'},
            { value: 'Antecedentes', label: 'LISTADO DE ANTECEDENTES'},
            { value: 'Usuario', label: 'NOMBRE DE USUARIO' },
            { value: 'Dependencia', label: 'DEPENDENCIA REGISTRO'},
            { value: 'Vigencia', label: 'VIGENCIA' },
            { value: 'Fecha Registro', label: 'FECHA DE REGISTRO'},
            { value: 'Fecha Ingreso', label: 'FECHA DE INGRESO'},
            { value: 'Generado', label: 'USUARIO ACTUAL'}
        ];

    const location = useLocation();
    const { from } = location.state;

    useEffect(() => {
        async function fetchData() {

            // Se habilita el cargando
            window.showSpinner(true);

            // Se carga la api de parametros permitidos
            obtenerParametros();

            if (from != null) {

                // Se carga el nombre del parametro
                setNombreParametro(from.attributes.nombre_campo);

                // Se carga los tipos de valores por parametro
                validarValorParametro(from.attributes.type);

                // Se carga el estado
                if (from.attributes.estado == 1) {

                    // Se setea el valor del estado
                    setArrayEstados({ label: 'Activo', value: from.attributes.estado });
                } else {

                    // Se setea el valor del estado
                    setArrayEstados({ label: 'Inactivo', value: from.attributes.estado });
                }

                // Se deshabilita el cargando
                window.showSpinner(false);
            } else {

                // Se carga los tipos de expediente por mensajes
                cargarParametroCamposCaratula();
            }
        }
        fetchData();
    }, []);

    // Metodo encargado de cargar el formulario para registrar un parametro
    const cargarParametroCamposCaratula = () => {

        // Se deshabilita el cargando
        window.showSpinner(false);
    }

    // Metodo encargado de retornar el valor del parametro
    const validarValorParametro = (parametro) => {

        // Se recorre el array de los parametros
        for (let index = 0; index < getListaValorParametro.length; index++) {

            // Se captura el elemento por posicion
            const element = getListaValorParametro[index];

            // Se valida que donde exista el parametro se retorna el label y el valor
            if (parametro == element.value) {

                // Se setean los valores
                setValorParametro({ value: parametro, label: element.label });
            }
        }

    }

    // Metodo encargado de registrar los valores
    const enviarDatos = (valores) => {

        // Se inicializa el array
        let data;

        // Se validan los campos
        if (!getNombreParametro) {

            // Se setea el valor
            setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);

            // Se retorna el error
            return false;
        } else if (getNombreParametro) {

            // Se valida que contenga caracteres invalidos
            if (containsSpecialChars(getNombreParametro)) {

                // Se setea el valor
                setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS);

                // Se retorna
                return false;
            } else {

                // Se setea el valor
                setMensajeErrorNombreParametro('');
            }
        }

        // Se valida que tenga el minimo de caracteres ingresados
        if (getNombreParametro.length <= 2) {

            // Se setea el valor
            setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES + ' 2');

            // Se retorna el error
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorNombreParametro('');
        }

        // Se valida que el valor del parametro sea diferente de null
        if (!getValorParametro.value) {

            // Se setea el mensaje de error
            setMensajeErrorValorParametro(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);

            // Se retorna el error
            return false;
        } else {

            // Se setea el mensaje de error
            setMensajeErrorValorParametro("");
        }

        // Se valida que el valor del parametro sea diferente de null
        if (!getArrayEstados.value) {

            // Se setea el mensaje de error
            setMensajeErrorEstado(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);

            // Se retorna el error
            return;
        } else {

            // Se setea el mensaje de error
            setMensajeErrorEstado("");
        }

        // Se inicializa el array a enviar por post
        data = {
            "data": {
                "type": "parametro_campos_caratula",
                "attributes": {
                    "nombre_campo": getNombreParametro,
                    "type": getValorParametro.value,
                    "estado": getArrayEstados.value
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa la API
        GenericApi.addGeneric('parametro_campos_caratula', data).then(
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINSITRACIÓN :: CARÁTULA", message: global.Constants.MENSAJES_MODAL.EXITOSO , show: true, redirect: '/ParametroCamposCaratula', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: "ADMINSITRACIÓN :: CARÁTULA", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    // Metodo encargado de actualizar los valores 
    const actualizarDatos = (valores) => {

        // Se inicializa el valor del id
        const id = from.id;

        // Se inicializa el array
        let data;

        // Se validan los campos
        if (!getNombreParametro) {

            // Se setea el valor
            setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);

            // Se retorna el error
            return false;
        } else if (getNombreParametro) {

            // Se valida que contenga caracteres invalidos
            if (containsSpecialChars(getNombreParametro)) {

                // Se setea el valor
                setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS);

                // Se retorna
                return false;
            } else {

                // Se setea el valor
                setMensajeErrorNombreParametro('');
            }
        }

        // Se valida que tenga el minimo de caracteres ingresados
        if (getNombreParametro.length < 3) {

            // Se setea el valor
            setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES + ' 3');

            // Se retorna el error
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorNombreParametro('');
        }

        // Se inicializa el array a enviar por post
        data = {
            "data": {
                "type": "parametro_campos_caratula",
                "attributes": {
                    "nombre_campo": getNombreParametro,
                    "type": getValorParametro.value,
                    "estado": getArrayEstados.value
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        GenericApi.updateGeneric('parametro_campos_caratula', id, data).then(
            datos => {

                // Se deshabilita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINSITRACIÓN :: CARÁTULA", message: global.Constants.MENSAJES_MODAL.EXITOSO , show: true, redirect: '/ParametroCamposCaratula', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: "ADMINSITRACIÓN :: CARÁTULA", message: datos.errors[0].detail, show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    // Metodo encargado de validar el maximo de caracteres por input
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

            // Buscamos el parametro
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
                        setModalState({ title: "ADMINSITRACIÓN :: CARÁTULA", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de validar que no se ingresen caracteres invalidos
    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    // Metodo encargado de setear el valor del parametro
    const changeParametro = (e) => {

        // Se setea el valor escrito a la constante
        
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreParametro(e.target.value);
        }
    }

    // Metodo encargado de cambiar el valor del parametro
    const selectChangeParametro = (v) => {

        // Se setea el valor a la constante
        setValorParametro(v)
    }

    // Metodo encargado de setear el valor del estado
    const selectChangeEstados = (v) => {

        // Se carga el tipo de estado en el array del select
        setArrayEstados(v);
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    nombreParametro: '',
                }}
                enableReinitialize
                validate={(valores) => {

                }}
                onSubmit={(valores, { resetForm }) => {

                    if (from != null) {
                        actualizarDatos(valores);
                    } else {
                        enviarDatos(valores);
                    }
                }}
            >

                {({ errors }) => (
                    <Form>

                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ParametroCamposCaratula`}><small>Lista de parámetros de carátula</small></Link></li>
                                    <li className="breadcrumb-item"> <small>{from != null ? 'Actualizar' : 'Crear'} parámetros de carátula</small></li>
                                </ol>
                            </nav>
                        </div>


                        <div className="block block-rounded block-bordered">
                            <div className="block block-themed">

                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: CARÁTULA :: PARÁMETROS DE CARÁTULA</h3>
                                </div>
                                <div className="block-content">

                                    <div className="row text-right w2d-enter">
                                        <div className="col-md-12">
                                            <Link to={'/ParametroCamposCaratula'} title='Regresar'>
                                                <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                            </Link>                                            
                                        </div>
                                    </div>

                                    <div className="row">

                                        <div className="col-md-12">

                                            <div className="alert alert-primary text-uppercase" role="alert">
                                                <p className="mb-0"><strong>Nota: </strong></p>
                                                <p className="mb-0"><strong>1.</strong> El nombre del parámetro debe ser igual al establecido en el documento de word.</p>
                                                <p className="mb-0"><strong>2.</strong> El nombre del parámetro no debe ser ingresado con los carácteres especiales.</p> 
                                            </div>

                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="nombreParametro">NOMBRE DEL PARÁMETRO<span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreParametro" name="nombreParametro" value={getNombreParametro} onChange={changeParametro} autocomplete="off"></Field>
                                                {getMensajeErrorNombreParametro ?
                                                    <span className="text-danger">{getMensajeErrorNombreParametro}</span>
                                                    : null}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="valorParametro">VALOR DEL PARÁMETRO<span className="text-danger">*</span></label>
                                                {(getValorParametro) ?
                                                    <Select
                                                        id='valorParametro'
                                                        name='valorParametro'
                                                        isMulti={false}
                                                        value={getValorParametro}
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListaValorParametro.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeParametro(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorValorParametro ?
                                                    <span className="text-danger">{getMensajeErrorValorParametro}</span>
                                                    : null}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="estado">ESTADO<span className="text-danger">*</span></label>
                                                {(getArrayEstados) ?
                                                    <Select
                                                        id='estado'
                                                        name='estado'
                                                        isMulti={false}
                                                        value={getArrayEstados}
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListaEstados.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeEstados(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorEstado ?
                                                    <span className="text-danger">{getMensajeErrorEstado}</span>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary" >
                                    {from != null ? global.Constants.BOTON_NOMBRE.ACTUALIZAR : global.Constants.BOTON_NOMBRE.REGISTRAR}
                                </button>
                                <Link to={'/ParametroCamposCaratula'} className="font-size-h5 font-w600" >
                                    <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default ParametroCamposCaratulaForm;