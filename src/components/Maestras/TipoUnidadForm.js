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

export default function TipoUnidadForm() {

    // Constantes generales
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    // Constantes para cargar los valores
    const [getNombreTipoUnidad, setNombreTipoUnidad] = useState("");
    const [getCodigoUnidad, setCodigoUnidad] = useState("");
    const [getDescripcionUnidad, setDescripcionUnidad] = useState("");
    const [getValueDependencias, setValueDependencias] = useState([]);

    // Constante para el array de los estados y dependencias
    const [getArrayEstados, setArrayEstados] = useState([]);
    const [getListadoDependencias, setListadoDependencias] = useState([]);

    // Constantes para los errores
    const [getMensajeErrorDependencias, setMensajeErrorDependencias] = useState("");
    const [getMensajeErrorEstado, setMensajeErrorEstado] = useState("");
    const [getRepuestaNombreTipoUnidad, setRepuestaNombreTipoUnidad] = useState(false);
    const [getRepuestaCodigoUnidad, setRepuestaCodigoUnidad] = useState(false);
    const [getRepuestaDescripcionUnidad, setRepuestaDescripcionUnidad] = useState(false);

    // Se inicializa el array de estados
    const getListaEstados =
        [
            { value: '1', label: 'ACTIVO' },
            { value: '0', label: 'INACTIVO' }
        ];

    const location = useLocation();
    const { from } = location.state;

    useEffect(() => {
        async function fetchData() {

            // Se habilita el cargando
            window.showSpinner(true);

            // Se valida que haya informacion enviada por parametros al formulario
            if (from != null) {

                // Se carga el nombre
                setNombreTipoUnidad(from.attributes.nombre);
                setRepuestaNombreTipoUnidad(true)

                // Se carga el codigo de la unidad
                setCodigoUnidad(from.attributes.codigo_unidad);
                setRepuestaCodigoUnidad(true)

                // Se carga la descripcion de la unidad
                setDescripcionUnidad(from.attributes.descripcion_unidad);
                setRepuestaDescripcionUnidad(true)

                // Se cargan las dependencias
                cargarDependencias();

                // Se carga el estado
                if (from.attributes.estado == 1) {
                    setArrayEstados({ label: 'ACTIVO', value: from.attributes.estado });
                } else {
                    setArrayEstados({ label: 'INACTIVO', value: from.attributes.estado });
                }

                // Se deshabilita el cargando
                window.showSpinner(false);
            } else {

                // Se carga los tipos de expediente por mensajes
                cargarDependencias();

                // Se deshabilita el cargando
                window.showSpinner(false);
            }
        }
        fetchData();
    }, []);

    // Metodo encargado de cargar las dependencias
    const cargarDependencias = () => {

        // Se inicializa el trycatch en caso de error de la api
        try {

            // Se inicializa el array general
            var arrayGeneral = [];

            // Buscamos los valores del array de los tipos de expedientes
            GenericApi.getGeneric("mas-dependencia-origen").then(

                // Variable de la api
                datos => {

                    // Se valida que no haya ningun error
                    if (!datos.error) {

                        // Se valida que el array tenga mas de 0 elementos
                        if (datos["data"].length > 0) {

                            // Se recorre el array de los tipo de expediente
                            for (let index = 0; index < datos.data.length; index++) {

                                // Se captura el valor por posicion
                                const element = datos.data[index];
                                const dependenciaId = parseInt(element.id);

                                // Se valida que haya informacion enviada por parametros al formulario
                                if (from != null) {

                                    // Se valida cuando el elemento sea igual al elemento a editar para setear el valor
                                    if (dependenciaId == from.attributes.dependencia.id) {

                                        // Se setea el valor
                                        setValueDependencias({ label: element.attributes.nombre, value: element.id })
                                    }
                                }

                                // Se añade al array general
                                arrayGeneral.push({ label: element.attributes.nombre, value: element.id });
                            }

                            // Se añade el array general al array de los tipos de antecedentes
                            setListadoDependencias(arrayGeneral);
                        }
                    } else {
                        setModalState({ title: "ADMINISTRACIÓN :: CARÁTULA :: TIPOS DE UNIDAD", message: datos.error.toString(), show: true, redirect: '/TipoExpedientesMensajes', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    // Metodo encargado de enviar los valores para crear
    const enviarDatos = (valores) => {

        // Se inicializa el array
        let data;

        // Se valida que se haya seleccionado una dependencia
        if (!getValueDependencias.value) {

            // Se redeclara el mensaje
            setMensajeErrorDependencias(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);
            return false;
        } else if (getValueDependencias.value) {

            // Se redeclara el mensaje en null
            setMensajeErrorDependencias(null);

            // Se valida que se haya seleccionado un sub tipo de expediente
            if (!getArrayEstados.value) {

                // Se redeclara el mensaje
                setMensajeErrorEstado(global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO);
                return false;
            } else {

                // Se redeclara el mensaje
                setMensajeErrorEstado(null);

                // Se inicializa el array a enviar por post
                data = {
                    "data": {
                        "type": "mas_tipo_expediente_mensajes",
                        "attributes": {
                            "nombre": getNombreTipoUnidad,
                            "codigo_unidad": getCodigoUnidad,
                            "descripcion_unidad": getDescripcionUnidad,
                            "id_dependencia": getValueDependencias.value,
                            "estado": getArrayEstados.value
                        }
                    }
                };
            }
        }

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa la API
        GenericApi.addGeneric('mas_tipo_unidad', data).then(

            // Variable de API
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: CARÁTULA :: TIPOS DE UNIDAD", message: 'Creado con éxito ', show: true, redirect: '/TipoUnidad', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: CARÁTULA :: TIPOS DE UNIDAD", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
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

        // Se inicializa el array a enviar por post
        data = {
            "data": {
                "type": "mas_tipo_expediente_mensajes",
                "attributes": {
                    "nombre": getNombreTipoUnidad,
                    "codigo_unidad": getCodigoUnidad,
                    "descripcion_unidad": getDescripcionUnidad,
                    "id_dependencia": getValueDependencias.value,
                    "estado": getArrayEstados.value
                }
            }
        };

        console.log("data -> ", data);

        // Se utiliza el cargando
        window.showSpinner(true);

        // API Encargada de actualizar 
        GenericApi.updateGeneric('mas_tipo_unidad', id, data).then(

            // Variable de respuesta de la API
            datos => {

                // Se deshabilita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: CARÁTULA :: TIPOS DE UNIDAD", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/TipoUnidad', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: CARÁTULA :: TIPOS DE UNIDAD", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    // Metodo encargado de setear el valor del estado
    const selectChangeEstados = (v) => {

        // Se carga el tipo de estado en el array del select
        setArrayEstados(v);
    }

    // Metodo encargado de setear el valor de la dependencia
    const selectChangeListadoDependencias = (v) => {

        // Se carga el tipo de estado en el array del select
        setValueDependencias(v);
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

    // Metodo encargado de setear el mensaje
    const changeMensaje = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreTipoUnidad(e.target.value);
            setRepuestaNombreTipoUnidad(true);
        }
    }

    // Metodo encargado de setear el codigo de la unidad
    const changeCodigoUnidad = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(e.target.value) && 
        e.target.value.length <= 10)) {
            setCodigoUnidad(e.target.value);
            setRepuestaCodigoUnidad(true);
        }
    }

    // Metodo encargado de setear la descripcion de la unidad
    const changeDescripcionUnidad = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setDescripcionUnidad(e.target.value);
            setRepuestaDescripcionUnidad(true);
        }
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    nombreTipoUnidad: '',
                    codigoUnidad: '',
                    descripcionUnidad: '',
                }}
                enableReinitialize
                validate={(valores) => {

                    // Se inicializa el array
                    let errores = {};

                    if(getRepuestaNombreTipoUnidad == false && getNombreTipoUnidad != ''){
                        errores.nombreTipoUnidad = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    if(getRepuestaCodigoUnidad == false && getCodigoUnidad != ''){
                        errores.codigoUnidad = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    if(getRepuestaDescripcionUnidad == false && getDescripcionUnidad != ''){
                        errores.descripcionUnidad = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    // Se valida que tenga valores el nombre
                    if (!getNombreTipoUnidad) {
                        errores.nombreTipoUnidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    // Se valida que exista
                    if (getNombreTipoUnidad) {

                        // Se valida que contenga caracteres invalidos
                        if (containsSpecialChars(getNombreTipoUnidad)) {
                            errores.nombreTipoUnidad = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                        }
                    }

                    // Se retorna los errores
                    return errores;
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/TipoUnidad`}><small>Lista de tipos de unidad</small></Link></li>
                                    <li className="breadcrumb-item"> <small> Tipos de unidad</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-rounded block-bordered">

                            <div className="block block-themed">

                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: CARÁTULA :: TIPOS DE UNIDAD</h3>
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

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="nombreTipoUnidad">NOMBRE <span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreTipoUnidad" name="nombreTipoUnidad" value={getNombreTipoUnidad} onChange={changeMensaje} autocomplete="off"></Field>
                                                <ErrorMessage name="nombreTipoUnidad" component={() => (<span className="text-danger">{errors.nombreTipoUnidad}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="codigoUnidad">CÓDIGO DE LA UNIDAD</label>
                                                <Field as="input" type="text" className="form-control" id="codigoUnidad" name="codigoUnidad" value={getCodigoUnidad} onChange={changeCodigoUnidad} autocomplete="off"></Field>
                                                <ErrorMessage name="codigoUnidad" component={() => (<span className="text-danger">{errors.codigoUnidad}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="descripcionUnidad">DESCRIPCIÓN</label>
                                                <Field as="input" type="text" className="form-control" id="descripcionUnidad" name="descripcionUnidad" value={getDescripcionUnidad} onChange={changeDescripcionUnidad} autocomplete="off"></Field>
                                                <ErrorMessage name="descripcionUnidad" component={() => (<span className="text-danger">{errors.descripcionUnidad}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="dependencia">DEPENDENCIA: <span className="text-danger">*</span></label>
                                                {getValueDependencias ?
                                                    <Select
                                                        id='dependencia'
                                                        name='dependencia'
                                                        isMulti={false}
                                                        value={getValueDependencias}
                                                        placeholder= {global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListadoDependencias.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeListadoDependencias(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorDependencias ?
                                                    <span className="text-danger">{getMensajeErrorDependencias}</span>
                                                    : null}
                                            </div>
                                        </div>

                                        <div className="col-md-3">
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
                                <Link to={'/TipoUnidad'} className="font-size-h5 font-w600" >
                                    <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

