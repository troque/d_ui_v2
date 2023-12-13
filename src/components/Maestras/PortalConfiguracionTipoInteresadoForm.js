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

export default function PortalConfiguracionTipoInteresadoForm() {

    // Constantes generales
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    // Constantes para cargar los valores
    const [getValueTipoInteresados, setValueTipoInteresados] = useState([]);
    const [getValueTipoSujetoProcesal, setValueTipoSujetoProcesal] = useState([]);
    const [getValueTipoEntidad, setValueTipoEntidad] = useState([]);

    // Constante para el array de los estados y dependencias
    const [getArrayEstados, setArrayEstados] = useState([]);
    const [getListadoTipoInteresados, setListadoTipoInteresados] = useState([]);
    const [getListadoTipoSujetoProcesal, setListadoTipoSujetoProcesal] = useState([]);
    const [getListadoTipoEntidad, setListadoTipoEntidad] = useState([]);

    // Constantes para los errores
    const [getMensajeErrorTipoInteresado, setMensajeErrorTipoInteresado] = useState("");
    const [getMensajeErrorTipoSujetoProcesal, setMensajeErrorTipoSujetoProcesal] = useState("");
    const [getMensajeErrorTipoEntidad, setMensajeErrorTipoEntidad] = useState("");
    const [getMensajeErrorEstado, setMensajeErrorEstado] = useState("");

    // Constantes para validar
    const [getDataValidaTipoEntidad, setDataValidaTipoEntidad] = useState(false);
    const [getDataValidaTipoSujetoProcesal, setDataValidaTipoSujetoProcesal] = useState(false);

    // Se inicializa el array de estados
    const getListaEstados =
        [
            { value: '1', label: 'SI' },
            { value: '0', label: 'NO' }
        ];

    const location = useLocation();
    const { from } = location.state;

    useEffect(() => {
        async function fetchData() {

            // Se habilita el cargando
            window.showSpinner(true);

            // Se valida que haya informacion enviada por parametros al formulario
            if (from != null) {

                // Se carga los tipos de interesados
                cargarTiposInteresados();

                // Se valida cuando el tipo de interesado es Persona Natural
                if (from.attributes.tipo_interesado.id && from.attributes.tipo_interesado.id == 1) {

                    // Se valida en false
                    setDataValidaTipoEntidad(false);

                    // Se carga los tipos de sujetos procesales
                    cargarTiposSujetoProcesal();

                    // Se setea el valor
                    setValueTipoEntidad([]);
                }

                // Se valida cuando el tipo de interesado es Entidad
                else if (from.attributes.tipo_interesado.id && from.attributes.tipo_interesado.id == 2) {

                    // Se valida en false
                    setDataValidaTipoSujetoProcesal(false);

                    // Se carga los tipos de sujetos procesales
                    cargarTiposEntidades();

                    // Se setea el valor
                    setValueTipoSujetoProcesal([]);
                }

                // Se carga el estado
                if (from.attributes.permiso_consulta == 1) {

                    // Se setea el estado actual en activo
                    setArrayEstados({ label: 'SI', value: from.attributes.permiso_consulta });
                } else {

                    // Se setea el estado actual en inactivo
                    setArrayEstados({ label: 'NO', value: from.attributes.permiso_consulta });
                }

                // Se deshabilita el cargando
                window.showSpinner(false);
            } else {

                // Se carga los tipos de interesados
                cargarTiposInteresados();

                // Se deshabilita el cargando
                window.showSpinner(false);
            }
        }
        fetchData();
    }, []);

    // Metodo encargado de cargar las dependencias
    const cargarTiposInteresados = () => {

        // Se inicializa el trycatch en caso de error de la api
        try {

            // Se inicializa el array general
            var arrayGeneral = [];

            // Buscamos los valores del array de los tipos de expedientes
            GenericApi.getGeneric("tipo-interesado").then(

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
                                const elementId = parseInt(element.id);

                                // Se valida que haya informacion enviada por parametros al formulario
                                if (from != null) {

                                    // Se valida cuando el elemento sea igual al elemento a editar para setear el valor
                                    if (elementId == from.attributes.tipo_interesado.id) {

                                        // Se setea el valor
                                        setValueTipoInteresados({ label: from.attributes.tipo_interesado.nombre.toUpperCase(), value: from.attributes.tipo_interesado.id })
                                    }
                                }

                                // Se añade al array general
                                arrayGeneral.push({ label: element.attributes.nombre, value: element.id });
                            }

                            // Se añade el array general al array de los tipos de interesados
                            setListadoTipoInteresados(arrayGeneral);
                        }
                    } else {
                        setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: datos.error.toString(), show: true, redirect: '/TipoExpedientesMensajes', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
        }
    }

    // Metodo encargado de cargar las tipos de sujeto procesales
    const cargarTiposSujetoProcesal = () => {

        // Se inicializa el trycatch en caso de error de la api
        try {

            // Se inicializa el array general
            var arrayGeneral = [];

            // Buscamos los valores del array de los tipos de expedientes
            GenericApi.getGeneric("tipo-sujeto-procesal").then(

                // Variable de la api
                datos => {

                    // Se valida que no haya ningun error
                    if (!datos.error) {

                        // Se valida que el array tenga mas de 0 elementos
                        if (datos["data"].length > 0) {

                            // Se valida en true
                            setDataValidaTipoSujetoProcesal(true);

                            // Se recorre el array de los tipo de expediente
                            for (let index = 0; index < datos.data.length; index++) {

                                // Se captura el valor por posicion
                                const element = datos.data[index];
                                const idElemento = parseInt(element.id);

                                // Se valida que haya informacion enviada por parametros al formulario
                                if (from != null) {

                                    // Se valida cuando el elemento sea igual al elemento a editar para setear el valor
                                    if (idElemento == from.attributes.tipo_sujeto_procesal.id) {

                                        // Se setea el valor
                                        setValueTipoSujetoProcesal({ label: from.attributes.tipo_sujeto_procesal.nombre.toUpperCase(), value: from.attributes.tipo_sujeto_procesal.id })
                                    }
                                }

                                // Se añade al array general
                                arrayGeneral.push({ label: element.attributes.nombre, value: element.id });
                            }

                            // Se añade el array general al array de los tipos de interesados
                            setListadoTipoSujetoProcesal(arrayGeneral);
                        } else {

                            // Se valida en true
                            setDataValidaTipoSujetoProcesal(false);
                        }
                    } else {
                        setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: datos.error.toString(), show: true, redirect: '/PortalConfiguracionTipoInteresado', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
        }
    }

    // Metodo encargado de cargar las tipos de entidades
    const cargarTiposEntidades = () => {

        // Se inicializa el trycatch en caso de error de la api
        try {

            // Se inicializa el array general
            var arrayGeneral = [];

            // Buscamos los valores del array de los tipos de expedientes
            GenericApi.getGeneric("tipo-entidad").then(

                // Variable de la api
                datos => {

                    // Se valida que no haya ningun error
                    if (!datos.error) {

                        // Se valida que el array tenga mas de 0 elementos
                        if (datos["data"].length > 0) {

                            // Se valida en true
                            setDataValidaTipoEntidad(true);

                            // Se recorre el array de los tipo de expediente
                            for (let index = 0; index < datos.data.length; index++) {

                                // Se captura el valor por posicion
                                const element = datos.data[index];
                                const elementId = parseInt(element.id);

                                // Se valida que haya informacion enviada por parametros al formulario
                                if (from != null) {

                                    // Se valida cuando el elemento sea igual al elemento a editar para setear el valor
                                    if (elementId == from.attributes.tipo_sujeto_procesal.id) {

                                        // Se setea el valor
                                        setValueTipoEntidad({ label: from.attributes.tipo_sujeto_procesal.nombre, value: from.attributes.tipo_sujeto_procesal.nombre })
                                    }
                                }

                                // Se añade al array general
                                arrayGeneral.push({ label: element.attributes.nombre, value: element.id });
                            }

                            // Se añade el array general al array de los tipos de interesados
                            setListadoTipoEntidad(arrayGeneral);
                        } else {

                            // Se valida en true
                            setDataValidaTipoEntidad(false);
                        }
                    } else {

                        // Se setea el modal
                        setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: datos.error.toString(), show: true, redirect: '/PortalConfiguracionTipoInteresado', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
        }
    }

    // Metodo encargado de enviar los valores para crear
    const enviarDatos = (valores) => {

        // Se inicializa el array
        let data;

        // Se captura la informacion general
        let tipoInteresado = getValueTipoInteresados;
        let tipoSujetoProcesal = getValueTipoSujetoProcesal;
        let tipoEntidad = getValueTipoEntidad;
        let estado = getArrayEstados;

        // Se valida que tenga seleccionado al menos 1
        if (tipoInteresado.length <= 0) {

            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'TIPO DE INTERESADO ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida cuando es Persona Natural
        if (tipoInteresado.value == "1") {

            // Se valida que tenga seleccionado al menos 1
            if (tipoSujetoProcesal.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'TIPO DE SUJETO PROCESOSAL ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;
            }

            // Se valida el estado
            if (estado.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'PERMISOS PARA CONSULTAR ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;
            }

            // Se inicializa el array a enviar por post
            data = {
                "data": {
                    "type": "mas_tipo_expediente_mensajes",
                    "attributes": {
                        "id_tipo_interesado": tipoInteresado.value,
                        "id_tipo_sujeto_procesal": tipoSujetoProcesal.value,
                        "permiso_consulta": estado.value,
                    }
                }
            };
        }

        // Se valida cuando es Entidad
        if (tipoInteresado.value == "2") {

            // Se valida que tenga seleccionado al menos 1
            if (tipoEntidad.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'TIPO DE ENTIDAD ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;
            }

            // Se valida el estado
            if (estado.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'PERMISOS PARA CONSULTA ES COBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;

            }

            // Se inicializa el array a enviar por post
            data = {
                "data": {
                    "type": "mas_tipo_expediente_mensajes",
                    "attributes": {
                        "id_tipo_interesado": tipoInteresado.value,
                        "id_tipo_sujeto_procesal": tipoEntidad.value,
                        "permiso_consulta": estado.value,
                    }
                }
            };
        }

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa la API
        GenericApi.addGeneric('portal-tipo-interesado', data).then(

            // Variable de API
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea el modal
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/PortalConfiguracionTipoInteresado', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea el modal
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de actualizar los valores
    const actualizarDatos = (valores) => {

        // Se inicializa el valor del id
        const id = from.id;

        // Se captura la informacion general
        let tipoInteresado = getValueTipoInteresados;
        let tipoSujetoProcesal = getValueTipoSujetoProcesal;
        let tipoEntidad = getValueTipoEntidad;
        let estado = getArrayEstados;

        // Se valida que tenga seleccionado al menos 1
        if (tipoInteresado.length <= 0) {

            // Se retorna el mensaje de error
            setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'TIPO DE INTERESADO ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

            // Se retorna
            return false;
        }

        // Se valida cuando es Persona Natural
        if (tipoInteresado.value == "1") {

            // Se valida que tenga seleccionado al menos 1
            if (tipoSujetoProcesal.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'SUJETO PROCESAL ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;
            }

            // Se valida el estado
            if (estado.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'PERMISOS PARA CONSULTAR ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;
            }
        }

        // Se valida cuando es Entidad
        if (tipoInteresado.value == "2") {

            // Se valida que tenga seleccionado al menos 1
            if (tipoEntidad.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'TIPO DE ENTIDAD ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;
            }

            // Se valida el estado
            if (estado.length <= 0) {

                // Se retorna el mensaje de error
                setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: 'PERMISOS PARA CONSULTAR ES OBLIGATORIO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });

                // Se retorna
                return false;
            }
        }

        // Se inicializa el array a enviar por post
        const data = {
            "data": {
                "type": "portal-tipo-interesado",
                "attributes": {
                    "id_tipo_interesado": tipoInteresado.value,
                    "id_tipo_sujeto_procesal": tipoInteresado.value == "1" ? tipoSujetoProcesal.value : tipoEntidad.value,
                    "permiso_consulta": estado.value,
                }
            }
        };

        // Se utiliza el cargando
        window.showSpinner(true);

        // API Encargada de actualizar 
        GenericApi.updateGeneric('portal-tipo-interesado', id, data).then(

            // Variable de respuesta de la API
            datos => {

                // Se deshabilita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea el modal
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/PortalConfiguracionTipoInteresado', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea el modal
                    setModalState({ title: "ADMINISTRACIÓN :: PORTAL WEB", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
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
    const selectChangeListadoTipoInteresados = (v) => {

        // Se carga el tipo de estado en el array del select
        setValueTipoInteresados(v);

        // Se valida cuando el tipo de interesado es Persona Natural
        if (v.value == "1") {

            // Se valida en false
            setDataValidaTipoEntidad(false);

            // Se cargan los sujetos procesales
            cargarTiposSujetoProcesal();

            // Se setea el valor
            setValueTipoEntidad([]);
        }

        // Se valida cuando el tipo de interesado es Entidad
        else if (v.value == "2") {

            // Se cargan los tipos de entidades
            cargarTiposEntidades();

            // Se valida en false
            setDataValidaTipoSujetoProcesal(false);

            // Se setea el valor
            setValueTipoSujetoProcesal([]);
        }
    }

    // Metodo encargado de setear el valor del sujeto procesal
    const selectChangeListadoTipoSujetoProcesal = (v) => {

        // Se setea el valor
        setValueTipoSujetoProcesal(v);
    }

    // Metodo encargado de setear el valor de la dependencia
    const selectChangeListadoTipoEntidad = (v) => {

        // Se setea el valor
        setValueTipoEntidad(v);
    }

    // Se inicializa el formulario
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

                    // // Se valida que tenga valores el nombre
                    // if (!getValueTipoInteresados) {
                    //     errores.nombreTipoUnidad = 'Debe ingresar un valor';
                    // }

                    // Se retorna los errores
                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {

                    // Se valida que tenga un from para actualizar
                    if (from != null) {

                        // Se envia al metodo para actualizar valores
                        actualizarDatos(valores);
                    } else {

                        // Se envia al metodo para registrar valores
                        enviarDatos(valores);
                    }
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div>
                            <div className="block block-themed">
                                <div className="col-md-12">
                                    <div className="w2d_block let">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-alt push">
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/PortalConfiguracionTipoInteresadoLista`}> <small>Lista de tipos de interesado</small></Link></li>
                                                <li className="breadcrumb-item"> <small>{from != null ? 'Actualizar' : 'Crear'} Configuración tipos de interesado</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: PORTAL WEB :: TIPOS DE INTERESADO</h3>
                                </div>
                                <div className="block-content">

                                    <div className='text-right '>
                                        <Link to={"/PortalConfiguracionTipoInteresado"} title='Regresar a lista' >
                                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    </div>

                                    <div className="row">

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="id_tipo_interesado">TIPO DE INTERESADO <span className="text-danger">*</span></label>
                                                {getValueTipoInteresados ?
                                                    <Select
                                                        id='id_tipo_interesado'
                                                        name='id_tipo_interesado'
                                                        isMulti={false}
                                                        value={getValueTipoInteresados}
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListadoTipoInteresados.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeListadoTipoInteresados(e)}
                                                    />
                                                    : null}
                                                {getMensajeErrorTipoInteresado ?
                                                    <span className="text-danger">{getMensajeErrorTipoInteresado}</span>
                                                    : null}
                                            </div>
                                        </div>

                                        {getDataValidaTipoSujetoProcesal ?
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="id_tipo_sujeto_procesal">TIPO DE SUJETO PROCESAL <span className="text-danger">*</span></label>
                                                    <Select
                                                        id='id_tipo_sujeto_procesal'
                                                        name='id_tipo_sujeto_procesal'
                                                        isMulti={false}
                                                        value={getValueTipoSujetoProcesal}
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListadoTipoSujetoProcesal.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeListadoTipoSujetoProcesal(e)}
                                                    />
                                                    {getMensajeErrorTipoSujetoProcesal ?
                                                        <span className="text-danger">{getMensajeErrorTipoSujetoProcesal}</span>
                                                        : null}
                                                </div>
                                            </div>
                                            : null}

                                        {getDataValidaTipoEntidad ?
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="id_tipo_entidad">TIPO DE ENTIDAD<span className="text-danger">*</span></label>
                                                    <Select
                                                        id='id_tipo_entidad'
                                                        name='id_tipo_entidad'
                                                        isMulti={false}
                                                        value={getValueTipoEntidad}
                                                        placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                        noOptionsMessage={() => "Sin datos"}
                                                        options={getListadoTipoEntidad.map(e =>
                                                            ({ label: e.label, value: e.value })
                                                        )}
                                                        onChange={(e) => selectChangeListadoTipoEntidad(e)}
                                                    />
                                                    {getMensajeErrorTipoEntidad ?
                                                        <span className="text-danger">{getMensajeErrorTipoEntidad}</span>
                                                        : null}
                                                </div>
                                            </div>
                                            : null}

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="estado">¿TIENE PERMISOS PARA CONSULTAR? <span className="text-danger">*</span></label>
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
                                <Link to={'/PortalConfiguracionTipoInteresado'} className="font-size-h5 font-w600" >
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

