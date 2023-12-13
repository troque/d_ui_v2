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

function ParametroCamposActuacionesForm() {

    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    // Constantes para cargar los valores
    const [getDescripcionParametro, setDescripcionParametro] = useState("");
    const [getValorParametro, setValorParametro] = useState("");

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
            { value: 'Antecedentes', label: 'LISTA DE ANTECEDENTES' },
            { value: 'Dependencia', label: 'DEPENDENCIA' },
            { value: 'Investigado', label: 'LISTADO DE NOMBRES DEL INVESTIGADO' },
            { value: 'Cargo', label: 'LISTADO DE CARGOS DEL INVESTIGADO' },
            { value: 'Entidad', label: 'LISTADO DE ENTIDADES DEL INVESTIGADO' },
            { value: 'Interesados', label: 'LISTADO DE INTERESADOS' },
            { value: 'Fecha de Ingreso', label: 'FECHA DE INGRESO' },
            { value: 'Fecha de Registro', label: 'FECHA DE REGISTRO' },
            { value: 'Número de auto (generado despues de aprobación)', label: 'NÚMERO DE AUTO (GENERADO DESPUÉS DE LA APROBACIÓN)' },
            { value: 'Número de radicado', label: 'NÚMERO DEL RADICADO' },
            { value: 'Dependencia Origen', label: 'NOMBRE DE LA DEPENDENCIA' },
        ];

    const location = useLocation();
    const { from } = location.state;

    useEffect(() => {
        async function fetchData() {

            // Se habilita el cargando
            window.showSpinner(true);

            if (from != null) {

                // Se carga el nombre del parametro
                setDescripcionParametro(from.attributes.nombre_campo);
                setValorParametro(from.attributes.type);

                // Se carga el estado
                if (from.attributes.estado == 1) {

                    // Se setea el valor del estado
                    setArrayEstados({ label: 'ACTIVO', value: from.attributes.estado });
                } else {

                    // Se setea el valor del estado
                    setArrayEstados({ label: 'INACTIVO', value: from.attributes.estado });
                }

                // Se deshabilita el cargando
                window.showSpinner(false);
            }
        }
        fetchData();
    }, []);

    // Metodo encargado de registrar los valores
    const enviarDatos = (valores) => {

        // Se inicializa el array
        let data;

        // Se validan los campos
        if (!getDescripcionParametro) {

            // Se setea el valor
            setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);

            // Se retorna el error
            return false;
        } else if (getDescripcionParametro) {

            // Se valida que contenga caracteres invalidos
            if (containsSpecialChars(getDescripcionParametro)) {

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
        if (getDescripcionParametro.length <= 2) {

            // Se setea el valor
            setMensajeErrorNombreParametro('El parámetro debe tener al menos 3 caracteres');

            // Se retorna el error
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorNombreParametro('');
        }

        // Se valida que el valor del parametro sea diferente de null
        if (!getArrayEstados.value) {

            // Se setea el mensaje de error
            setMensajeErrorEstado("DEBE SELECCIONAR AL MENOS UN VALOR");

            // Se retorna el error
            return;
        } else {

            // Se setea el mensaje de error
            setMensajeErrorEstado("");
        }

        // Se inicializa el array a enviar por post
        data = {
            "data": {
                "type": "parametro-campos",
                "attributes": {
                    "descripcion_parametro": getDescripcionParametro,
                    "type": getValorParametro,
                    "estado": getArrayEstados.value
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa la API
        GenericApi.addGeneric('parametro-campos', data).then(
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: ACTUACIONES :: PARAMÉTRICAS", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/ParametroCampos', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: ACTUACIONES :: PARAMÉTRICAS", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
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
        if (!getDescripcionParametro) {

            // Se setea el valor
            setMensajeErrorNombreParametro(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);

            // Se retorna el error
            return false;
        } else if (getDescripcionParametro) {

            // Se valida que contenga caracteres invalidos
            if (containsSpecialChars(getDescripcionParametro)) {

                // Se setea el valor
                setMensajeErrorNombreParametro(global.Constants.MENSAJE_INFORMATIVO.ERROR_FORMATO_CARACTERES_INVALIDOS);

                // Se retorna
                return false;
            } else {

                // Se setea el valor
                setMensajeErrorNombreParametro('');
            }
        }

        // Se valida que tenga el minimo de caracteres ingresados
        if (getDescripcionParametro.length < 3) {

            // Se setea el valor
            setMensajeErrorNombreParametro('El parámetro debe tener al menos 3 caracteres');

            // Se retorna el error
            return false;
        } else {

            // Se setea el valor
            setMensajeErrorNombreParametro('');
        }

        // Se inicializa el array a enviar por post
        data = {
            "data": {
                "type": "parametro-campos",
                "attributes": {
                    "nombre_campo": getDescripcionParametro,
                    "type": getValorParametro,
                    "estado": getArrayEstados.value
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        GenericApi.updateGeneric('parametro-campos', id, data).then(
            datos => {

                // Se deshabilita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: ACTUACIONES :: PARAMÉTRICAS", message: 'Actualizado con éxito ', show: true, redirect: '/ParametroCampos', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: ACTUACIONES :: PARAMÉTRICAS", message: datos.errors[0].detail, show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
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
            setDescripcionParametro(e.target.value);
        }
    }

    // Metodo encargado de setear el valor del parametro
    const changeDescripcion = (e) => {

        // Se setea el valor escrito a la constante
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setDescripcionParametro(e.target.value);
        }
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
                        <div className="block block-rounded">
                            <div className="block block-themed">
                                <div className="col-md-12">
                                    <div className="w2d_block let">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-alt push">
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ParametroCamposCaratula`}> <small>Lista parámetros de las actuaciones</small></Link></li>
                                                <li className="breadcrumb-item"> <small>{from != null ? 'Actualizar' : 'Crear'} parámetros de las actuaciones</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: ACTUACIONES :: PARAMÉTRICAS</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row">

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="nombreParametro">NOMBRE DEL PARÁMETRO<span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="valorParametro" name="valorParametro" value={getValorParametro} onChange={changeDescripcion} autocomplete="off"></Field>
                                                {getMensajeErrorNombreParametro ?
                                                    <span className="text-danger">{getMensajeErrorNombreParametro}</span>
                                                    : null}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="nombreParametro">DESCRIPCION DEL PARÁMETRO<span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreParametro" name="nombreParametro" value={getDescripcionParametro} onChange={changeParametro} autocomplete="off"></Field>
                                                {getMensajeErrorNombreParametro ?
                                                    <span className="text-danger">{getMensajeErrorNombreParametro}</span>
                                                    : null}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="estado">ESTADO <span className="text-danger">*</span></label>
                                                {(getArrayEstados) ?
                                                    <Select
                                                        id='estado'
                                                        name='estado'
                                                        isMulti={false}
                                                        value={getArrayEstados}
                                                        placeholder= {global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
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
                                <Link to={'/ParametroCampos'} className="font-size-h5 font-w600" >
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

export default ParametroCamposActuacionesForm;