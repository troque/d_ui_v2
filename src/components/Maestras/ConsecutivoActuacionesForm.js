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

export default function ConsecutivoDesgloseForm() {

    // Constates de la pagina    
    const location = useLocation();
    const { from } = location.state;

    // Constantes generales
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    // Constantes para cargar los valores
    const [getVigencia, setVigencia] = useState();
    const [getConsecutivo, setConsecutivo] = useState("");
    const [getRespuestaVigencia, setRespuestaVigencia] = useState(false);
    const [getRepuestaConsecutivo, setRepuestaConsecutivo] = useState(false);
    
    // Constantes para los errores
    const [getMensajeErrorDependencias, setMensajeErrorDependencias] = useState("");
    const [getMensajeErrorEstado, setMensajeErrorEstado] = useState("");

    // Constante para el array de los estados y dependencias
    const [getArrayEstados, setArrayEstados] = useState([]);
    const [getListaVigencias, setListaVigencias] = useState([]);

    // Se inicializa el array de estados
    const getListaEstados =
        [
            { value: '1', label: 'Activo' },
            { value: '0', label: 'Inactivo' }
        ];
    // const getEstadoDisabled = from != null ? true : false;

    useEffect(() => {
        async function fetchData() {

            // Se habilita el cargando
            window.showSpinner(true);

            // Se cargan las vigencias disponibles
            cargarVigencias();

            // Se valida que haya informacion enviada por parametros al formulario
            if (from != null) {

                // Se cargan los datos
                setConsecutivo(from.attributes.consecutivo);
                setVigencia(from.attributes.id_vigencia.id);

                // Se carga el estado
                if (from.attributes.estado == 1) {

                    // Se setea la data
                    setArrayEstados({ label: 'ACTIVO', value: from.attributes.estado });
                } else {

                    // Se setea la data
                    setArrayEstados({ label: 'INACTIVO', value: from.attributes.estado });
                }

            } else {
                
                // Se deshabilita el cargando
                window.showSpinner(false);
            }
        }
        fetchData();
    }, []);

    // Metodo encargado de enviar los valores para crear
    const enviarDatos = (valores) => {

        // Se valida que haya un estado seleccionado valido
        if (!getArrayEstados.value) {

            // Se redeclara el mensaje
            setMensajeErrorEstado("Debe seleccionar un estado");

            // Se setea en false
            return false;
        }

        // Se inicializa el array
        let data = {
            "data": {
                "type": "mas-consecutivo-actuaciones",
                "attributes": {
                    "id_vigencia": getVigencia,
                    "consecutivo": getConsecutivo,
                    "estado": getArrayEstados.value
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa la API
        GenericApi.addGeneric('mas-consecutivo-actuaciones', data).then(

            // Variable de API
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea el modal
                    setModalState({ title: "CONSECUTIVO ACTUACIONES :: CREAR CONSECUTIVO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/ConsecutivoActuaciones', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea el modal
                    setModalState({ title: "CONSECUTIVO ACTUACIONES :: CREAR CONSECUTIVO", message: datos.error.toString().toUpperCase(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de actualizar los valores
    const actualizarDatos = (valores) => {

        // Se inicializa el valor del id
        const id = from.id;

        // Se inicializa el array a enviar por post
        let data = {
            "data": {
                "type": "mas-consecutivo-actuaciones",
                "attributes": {
                    "id_vigencia": getVigencia,
                    "consecutivo": getConsecutivo,
                    "estado": getArrayEstados.value,
                    "form": true
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        // API Encargada de actualizar 
        GenericApi.updateGeneric('mas-consecutivo-actuaciones', id, data).then(

            // Variable de respuesta de la API
            datos => {

                // Se deshabilita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea el modal
                    setModalState({ title: "CONSECUTIVO ACTUACIONES :: ACTUALIZACIÓN DE DATOS", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/ConsecutivoActuaciones', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea el modal
                    setModalState({ title: "CONSECUTIVO ACTUACIONES :: ACTUALIZACIÓN DE DATOS", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de setear el valor del estado
    const selectChangeEstados = (v) => {

        // Se carga el tipo de estado en el array del select
        setArrayEstados(v);
    }

    const selectVigencia = () => {

        // Se retorna
        return (

            // Se recorre la lista de vigencias
            getListaVigencias.data.map((vigencia, i) => {

                // Se retorna cada option
                return (
                    <option key={vigencia.id} value={vigencia.id}>{vigencia.attributes.vigencia}</option>
                )
            })
        )
    }

    const cargarVigencias = () => {

        // Se consume la API
        GenericApi.getGeneric("vigencia?estado=1").then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya
                if (!datos.error) {

                    // Se setea la lista de vigencias
                    setListaVigencias(datos);
                    setRespuestaVigencia(true);
                }

                // Se deshabilita el cargando
                window.showSpinner(false);
            }
        );
    }

    const handleInputChange = (event) => {

        // Se captura la informacion del input
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        // Se valida cuando el input es vigencia
        if (name == "vigencia") {

            // Se setea la data
            setVigencia(value);
        }

        // Se valida cuando el input es el consecutivo
        if (name == "Consecutivo") {
            if (value === '' || 
            (global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(value) && 
            value.length <= 10)) {
                setConsecutivo(value);
                setRepuestaConsecutivo(true);
            }
        }
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    vigencia: '',
                    Consecutivo: '',
                }}
                enableReinitialize
                validate={(valores) => {

                    // Se inicializa el array
                    let errores = {};

                    // Se valida que tenga valores
                    if (!getVigencia) {
                        errores.vigencia = 'Debe ingresar un valor';
                    }
                    
                    if(getRepuestaConsecutivo == false){
                        errores.Consecutivo = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    if (!getConsecutivo) {
                        errores.Consecutivo = 'Debe ingresar un valor';
                    }

                    // Se retorna los errores
                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {

                    // Se valida si viene data en el from para actualizar
                    if (from != null) {

                        // Se manda a actualizar los datos
                        actualizarDatos(valores);
                    } else {

                        // Se manda a crear los datos
                        enviarDatos(valores);
                    }
                }}
            >
                {({ errors }) => (
                    <Form>
                        <div className="block block-rounded block-bordered">
                            <div className="block block-themed">
                                <div className="col-md-12">
                                    <div className="w2d_block let">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-alt push">
                                                <li className="breadcrumb-item"> <small>Administración</small></li>
                                                <li className="breadcrumb-item"> <small>Maestras</small></li>
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ConsecutivoDesglose`}> <small>Lista de consecutivos de desglose</small></Link></li>
                                                <li className="breadcrumb-item"> <small>{from != null ? 'Actualizar' : 'Crear'} consecutivos de desglose</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">Datos básicos</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="vigencia">VIGENCIA <span className="text-danger">*</span></label>
                                                <Field value={getVigencia} onChange={handleInputChange} as="select" className="form-control" id="vigencia" name="vigencia">
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRespuestaVigencia ? selectVigencia() : null}
                                                </Field>
                                                <ErrorMessage name="vigencia" component={() => (<span className="text-danger">{errors.vigencia}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="Consecutivo">CONSECUTIVO <span className="text-danger">*</span></label>
                                                <Field as="input" type="number" className="form-control" id="Consecutivo" name="Consecutivo" value={getConsecutivo} onChange={handleInputChange} autocomplete="off"></Field>
                                                <ErrorMessage name="Consecutivo" component={() => (<span className="text-danger">{errors.Consecutivo}</span>)} />
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
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListaEstados.map(e =>
                                                            ({ label: e.label.toUpperCase(), value: e.value })
                                                        )}
                                                        //isDisabled={getEstadoDisabled}
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
                                    {from != null ? "ACTUALIZAR" : "CREAR"}
                                </button>
                                <Link to={'/ConsecutivoActuaciones'} className="font-size-h5 font-w600">
                                    <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                </Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

