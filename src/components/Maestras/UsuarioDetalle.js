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
import '../Utils/Constants';
import Select from 'react-select';

function UsuarioDetalle() {

    // Variables de la clase
    const [getNombre, setNombre] = useState('');
    const [getApellido, setApeliido] = useState('');
    const [getUser, setUser] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getIdDependencia, setIdDependencia] = useState('');
    const [getEstado, setEstado] = useState('');

    const [listaTipoDerechoPeticion, setListaDerechoPeticion] = useState({ data: {} });
    const [respuestaTipoDerechoPeticion, setRespuestaDerechoPeticion] = useState(false);

    const [listaTipoProcesoDisciplinario, setListaProcesoDisciplinario] = useState({ data: {} });
    const [respuestaProcesoDisciplinario, setRespuestaProcesoDisciplinario] = useState(false);

    const [listaTiposQueja, setListaTiposQueja] = useState({ data: {} });
    const [respuestaTiposQueja, setRespuestaTiposQueja] = useState(false);

    const [listaTerminosRespuesta, setListaTerminosRespuesta] = useState({ data: {} });
    const [respuestaTerminosRespuesta, setRespuestaTerminosRespuesta] = useState(false);

    const [listaDependenciaOrigen, setListaDependenciaOrigen] = useState({ data: {} });
    const [respuestaDependenciaOrigen, setDependenciaOrigen] = useState(false);
    const [getListaRoles, setListaRoles] = useState({ data: {} });
    const [getRespuestaTipoExpediente, setRespuestaTipoExpediente] = useState(false);
    const [getTiposExpedientes, setTiposExpedientes] = useState({ data: {} });
    const [getRespuestaRoles, setRespuestaRoles] = useState(false);
    const [rolesAsociados, setRolesAsociados] = useState([]);
    const [tipoExpAsociados, setTipoExpAsociados] = useState([]);
    const [getReparto, setReparto] = useState('');
    const [getIdGrupoTrabajo, setIdGrupoTrabajo] = useState('');
    const [getIdDependenciaSecretariaComun, setIdDependenciaSecretariaComun] = useState('');
    const [respuestaGrupoTrabajo, setRespuestaGrupoTrabajo] = useState(false);
    const [listaGruposTrabajo, setListaGruposTrabajo] = useState({ data: {} });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getListaGruposSeleccionadas, setListaGruposSeleccionadas] = useState([]);
    const [getErrorGrupos, setErrorGrupos] = useState("");

    // Se captura el id del usuario
    let { id } = useParams();

    // Metodo encargado de cargar o consumir los servicios
    useEffect(() => {

        // Se inicializa el cargando
        window.showSpinner(true);

        // Se cargan los metodos
        async function fetchData() {

            // Se cargan las dependencias
            getAllDependenciaOrigen();
        }

        // Se usa la funcion
        fetchData();
    }, []);

    // Metodo encargado de cargar las dependencias
    const getAllDependenciaOrigen = () => {

        // Se consume la API
        GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.MODIFICAR_USUARIO).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    setListaDependenciaOrigen(datos);// Se setean los datos
                    setDependenciaOrigen(true);// Se setea la variable en true                    
                    getUserById();// Se llama el metodo para cargar los usuarios

                } else {

                    // Se setea el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            })

    }

    // Metodo encargado de cargar los datos del usuario con el id
    const getUserById = () => {

        // Se consume la API
        GenericApi.getByIdGeneric('usuario', id).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se valida que haya data
                    if (datos["data"] != "") {

                        // Se setean los valores
                        setNombre(datos["data"]["attributes"]["nombre"]);
                        setApeliido(datos["data"]["attributes"]["apellido"]);
                        setEmail(datos["data"]["attributes"]["email"]);
                        setUser(datos["data"]["attributes"]["name"]);
                        setIdDependencia(datos["data"]["attributes"]["id_dependencia"]);
                        setEstado(datos["data"]["attributes"]["estado"]);
                        setReparto(datos["data"]["attributes"]["reparto_habilitado"]);

                        // Se valida que haya el id del secretaria comun
                        if (datos["data"]["attributes"]["id_mas_grupo_trabajo_secretaria_comun"] != null) {

                            // Se setea el id del grupo
                            validarGruposSeleccionados(datos["data"]["attributes"]["id_mas_grupo_trabajo_secretaria_comun"]);
                        }

                        // Se valida que haya el id de los roles
                        if (datos["data"]["attributes"]["ids_roles"]) {

                            // Se setea el id de los roles
                            datos["data"]["attributes"]["ids_roles"].split(',').map((rol, i) => {

                                // Se setea cada id
                                setRolesAsociados(oldArray => [...oldArray, rol]);
                            });

                        }

                        // Se valida que haya el id de los tipo de expediente
                        if (datos["data"]["attributes"]["ids_tipo_expediente"]) {

                            // Se setea el id de los tipo de expediente
                            datos["data"]["attributes"]["ids_tipo_expediente"].map((rol, i) => {

                                // Se setea cada id
                                setTipoExpAsociados(oldArray => [...oldArray, rol]);
                            });

                        }

                        // Se cargan los roles
                        getllRoles();

                    } else {

                        // Se setea el mensaje de error
                        setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                        // Se quita el cargando
                        window.showSpinner(false);
                    }
                } else {

                    // Se setea el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar los roles
    const getllRoles = () => {

        // Se consume la API
        GenericApi.getAllGeneric('role').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los datos
                    setListaRoles(datos);

                    // Se setea la variable en true
                    setRespuestaRoles(true);

                    // Se cargan los tipos de expediente
                    cargarTiposExpedientes();
                } else {

                    // Se setea el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar los tipos de expediente
    const cargarTiposExpedientes = () => {

        // Se consume la API
        GenericApi.getAllGeneric('mas-tipo-expediente').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los datos
                    setTiposExpedientes(datos);

                    // Se setea la variable en true
                    setRespuestaTipoExpediente(true);

                    // Se cargan los tipos de derecho peticion
                    cargarTiposDerechoPeticion();
                } else {

                    // Se setea el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar los tipos de derecho peticion 
    const cargarTiposDerechoPeticion = () => {

        // Se consume la API
        GenericApi.getAllGeneric('mas-tipo-derecho-peticion').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los datos
                    setListaDerechoPeticion(datos);

                    // Se setea la variable en true
                    setRespuestaDerechoPeticion(true);

                    // Se cargan los tipos de queja
                    cargarTiposQueja();
                } else {

                    // Se setea el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar los tipos de queja
    const cargarTiposQueja = () => {

        // Se consume la API
        GenericApi.getAllGeneric('mas-tipo-queja').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {


                    setListaTiposQueja(datos);// Se setean los datos
                    setRespuestaTiposQueja(true);// Se setea la variable en true

                    setListaProcesoDisciplinario(datos);// Se setea la variable en true                    
                    setRespuestaProcesoDisciplinario(true);

                    cargarTerminoRespuesta();// Se cargan los terminos de respuesta
                } else {

                    // Se setea el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar los terminos de respuesta
    const cargarTerminoRespuesta = () => {

        // Se consume la API
        GenericApi.getAllGeneric('mas-termino-respuesta').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los datos
                    setListaTerminosRespuesta(datos);

                    // Se setea la variable en true
                    setRespuestaTerminosRespuesta(true);

                    // Se cargan los tipos de proceso disciplinario
                    cargarIdDependenciaSecretariaComun();


                } else {

                    // Se setea el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    // Metodo encargado de cargar el id de la dependecia de secretaria comun
    const cargarIdDependenciaSecretariaComun = () => {

        // Se inicializa la data
        const data = {
            "data": {
                "type": 'mas_parametro',
                "attributes": {
                    "nombre": "id_dependencia_secretaria_comun"
                }
            }
        }

        // Buscamos el parametro
        GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(

            // Se inicializa el valor de la API
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea el ID de la dependencia secretaria comun
                    setIdDependenciaSecretariaComun(datos.data[0].attributes.valor);

                    // Se consumen los grupos de trabajo
                    cargarGruposDeTrabajo();
                } else {

                    // Se setea el mensaje
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }

            }
        )
    }


    // Metodo encargado de consumir los grupos de trabajo
    const cargarGruposDeTrabajo = () => {

        // Se consume le API
        GenericApi.getGeneric("mas_grupo_trabajo").then(

            // Se inicializa la variable de la api
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea la respuesta en true
                    setRespuestaGrupoTrabajo(true);

                    // Se setean los datos
                    setListaGruposTrabajo(datos);
                } else {

                    // Se setean los mensajes
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }

                // Se quita el cargando
                window.showSpinner(false);
            }
        )
    }

    // Metodo encargado de setear el valor de la lista de grupo seleccionados
    const selectChangeGrupo = (v) => {

        // Se valida que no sea null
        if (v != null) {

            // Se setea el valor
            setListaGruposSeleccionadas(v);
        } else {

            // Se setea el mensaje de error
            setErrorGrupos('Campo requerido');
        }
    }

    // Metodo secundaria para cargar los grupos de trabajo
    const selectGrupoTrabajo = () => {

        // Se retorna la informacion del select
        return (

            // Se valida que tenga informacion
            listaGruposTrabajo.data.length > 0 && listaGruposTrabajo.data.map((grupoTrabajo, i) => {

                // Se retorna cada option value
                return (
                    <option key={grupoTrabajo.id} value={grupoTrabajo.id}>{grupoTrabajo.attributes.nombre}</option>
                )
            })
        )
    }

    // Metodo encargado de setear cada valor del check
    const handleInputChange = (event) => {

        // Se inicializan las constantes
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        // Se valida que sea nombre el check
        if (name == "nombre") {

            // Se setea el valor
            setNombre(value);
        }

        // Se valida que sea apellido el check
        if (name == "apellido") {

            // Se setea el valor
            setApeliido(value);
        }

        // Se valida que sea correo el check
        if (name == "correo") {

            // Se setea el valor
            setEmail(value);
        }

        // Se valida que sea dependencia el check
        if (name == "dependencia") {

            // Se valida que el valor sea diferente de secretaria comun
            if (value != getIdDependenciaSecretariaComun) {

                // Se setea la lista vacia
                setListaGruposSeleccionadas([]);
            }

            // Se setea el id con el valor
            setIdDependencia(value);
        }

        // Se valida que sea estado el check
        if (name == "estado") {

            // Se setea el valor
            setEstado(value);
        }

        // Se valida que sea reparto el check
        if (name == "reparto") {

            // Se setea el valor
            setReparto(value);
        }

        // Se valida que sea grupoTrabajo el check
        if (name == "grupoTrabajo") {

            // Se setea el valor
            setIdGrupoTrabajo(value);
        }

    }

    // Metodo encargado de cargar cada valor del select de las dependencias
    const selectDependenciaOrigen = () => {

        // Se retorna
        return (

            // Se recorren la lista
            listaDependenciaOrigen.data.map((dependencia, i) => {

                // Se retorna cada select 
                return (
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                )
            })
        )
    }

    // Metodo encargado de cargar cada valor del select de los grupos seleccionados
    const validarGruposSeleccionados = (grupos) => {

        // Se separan por comas en la variable
        let auxGrupoSplit = grupos.split(",");

        // Se recorren la lista
        auxGrupoSplit.forEach(element => {

            // Se consume la api por elemento
            GenericApi.getByIdGeneric("mas_grupo_trabajo", element).then(

                // Se incializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se añade al array de los grupos seleccionados
                        getListaGruposSeleccionadas.push({ label: datos.data.attributes.nombre, value: datos.data.id });
                    }
                }
            )
        });
    }

    // Metodo encargado de enviar los valores el backend
    const enviarDatos = () => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializa la variable
        let data;

        // Se setean los valores en el array
        data = {
            "data": {
                "type": "usuario",
                "attributes": {
                    "nombre": getNombre ? getNombre : "",
                    "apellido": getApellido ? getApellido : "",
                    "name": getUser ? getUser : "",
                    "email": getEmail ? getEmail : "",
                    "id_dependencia": getIdDependencia ? getIdDependencia : "",
                    "roles": rolesAsociados,
                    "expedientes": tipoExpAsociados,
                    "estado": getEstado ? getEstado : "",
                    "reparto_habilitado": getReparto ? getReparto : "",
                    "id_mas_grupo_trabajo_secretaria_comun": getListaGruposSeleccionadas ? getListaGruposSeleccionadas : "",
                }
            }
        }

        // Se ejecuta la API
        GenericApi.updateGeneric('usuario', id, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los valores en el modal
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/Usuario', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setean los valores en el modal
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado para checkear los valores por rol
    const agregarCheck = (e, rolId) => {

        // Se valida el valor en true
        if (e == true) {

            // Se setean los valores
            setRolesAsociados(oldArray => [...oldArray, rolId]);
        } else {

            // Se inicializa la variable
            var index = rolesAsociados.indexOf(rolId);

            // Se valida que sea diferente de null o vacio
            if (index != -1) {

                // Se quita el check
                rolesAsociados.splice(index, 1);
            }
        }
    }

    // Metodo encargado de checkear el valor de los tipos de expediente
    const agregarCheckTipoExp = (e, extId, subExpid) => {

        // Se valida que sea true
        if (e == true) {

            // Se setea el valor
            setTipoExpAsociados(oldArray => [...oldArray, (extId + "|" + subExpid)]);
        } else {

            // Se busca el indice
            var index = tipoExpAsociados.indexOf((extId + "|" + subExpid));

            // se valida se encuentre valor
            if (index != -1) {

                // Se quita el valor del array
                tipoExpAsociados.splice(index, 1);
            }
        }
    }

    // Metodo encargado de listar cada rol
    const listarRoles = () => {

        // Se retorna
        return (

            // Se recorre la lista de roles
            getListaRoles.data.map((rol, i) => {

                // Se retorna por posicion
                return (
                    <tr key={(rol.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        (rolesAsociados.length > 0) ? (
                                            (rolesAsociados.indexOf(rol.id.toString()) > -1) ? (
                                                <div>
                                                    <input defaultChecked="true" type="checkbox" onChange={e => agregarCheck(e.target.checked, rol.id)} className="custom-control-input" id={rol.id} name={rol.id} />
                                                    <label className="custom-control-label" htmlFor={rol.id}></label>
                                                </div>
                                            ) :
                                                <div>
                                                    <input type="checkbox" onChange={e => agregarCheck(e.target.checked, rol.id)} className="custom-control-input" id={rol.id} name={rol.id} />
                                                    <label className="custom-control-label" htmlFor={rol.id}></label>
                                                </div>

                                        ) :
                                            <div>
                                                <input type="checkbox" onClick={e => agregarCheck(e.target.checked, rol.id)} className="custom-control-input" id={rol.id} name={rol.id} />
                                                <label className="custom-control-label" htmlFor={rol.id}></label>
                                            </div>
                                    }
                                </>
                            </div>
                        </td>
                        <td>
                            {rol.attributes.nombre.toUpperCase()}
                        </td>
                    </tr>
                )
            })
        )
    }

    // TIPO DE EXPEDIENTE = DERECHO DE PETICION
    const componenteTipoExpedienteDerecho = () => {

        // Se retorna
        return (

            // Se recorre la lista de derechos de peticion
            listaTipoDerechoPeticion.data.map((derecho, i) => {

                // Se retorna por posicion
                return (
                    <tr key={(derecho.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        (tipoExpAsociados.indexOf(('1|' + derecho.id).toString()) > -1) ? (
                                            <div>
                                                <input defaultChecked={true} type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '1', derecho.id)} className="custom-control-input" id={'derecho' + derecho.id} name={'derecho' + derecho.id} />
                                                <label className="custom-control-label" htmlFor={'derecho' + derecho.id}></label>
                                            </div>
                                        ) : <div>
                                            <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '1', derecho.id)} className="custom-control-input" id={'derecho' + derecho.id} name={'derecho' + derecho.id} />
                                            <label className="custom-control-label" htmlFor={'derecho' + derecho.id}></label>
                                        </div>
                                    }
                                </>
                            </div>
                        </td>
                        <td>
                            {derecho.attributes.nombre}
                        </td>
                    </tr>
                )
            })
        )
    }

    // Metodo encargado de cargar los tipos de expediente asociados
    const listarTiposExpedientesAsociados = () => {

        // Se retorna
        return (
            <div className='row'>
                <div className="col-md-12">
                    {
                        // Se recorre el array
                        getTiposExpedientes.data.map((tipoExp, i) => {

                            // Se retorna por posicion
                            return (
                                <div key={tipoExp.id} id="accordion" role="tablist" aria-multiselectable="true">
                                    <div className="block block-rounded mb-1">
                                        <div className="block-header block-header-primary" role="tab" id="accordion_h1">
                                            <a className="font-w600" data-toggle="collapse" data-parent="#accordion" href="#accordion_q1" aria-expanded="true" aria-controls="accordion_q1"><i className="fas fa-folder" /> {tipoExp.attributes.nombre} </a>
                                        </div>
                                        <div id="accordion_q1" className="show" role="tabpanel" aria-labelledby="accordion_h1" data-parent="#accordion">
                                            <div className="block-content">
                                                {/*DERECHO DE PETICION*/}
                                                {tipoExp.id === '1' && respuestaTipoDerechoPeticion ? componenteTipoExpedienteDerecho() : ''}
                                                {/*PODER REFERENTE A SOLIICTUD*/}
                                                {tipoExp.id === '2' && respuestaTiposQueja ? componenteTipoExpedienteReferente() : ''}
                                                {/*QUEJA*/}
                                                {tipoExp.id === '3' && respuestaTiposQueja ? componenteTipoExpedienteQueja() : ''}
                                                {/*TUTELA*/}
                                                {tipoExp.id === '4' && respuestaTerminosRespuesta ? componenteTipoExpedienteTutela() : ''}
                                                {/*PROCESO DISCIPLINARIO*/}
                                                {tipoExp.id === '5' && respuestaProcesoDisciplinario ? componenteTipoExpedienteProcesoDisciplinario() : ''}

                                            </div>
                                        </div>
                                    </div>
                                </div >
                            )
                        })
                    }
                </div>
            </div>
        )
    }


    // TIPO DE EXPEDIENTE = REFERENTE
    const componenteTipoExpedienteReferente = () => {

        // Se retorna
        return (

            // Se recorre el array
            listaTiposQueja.data.map((quejaDef, i) => {

                // Se retorna por posicion
                return (
                    <tr key={(quejaDef.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        (tipoExpAsociados.indexOf(('2|' + quejaDef.id).toString()) > -1) ? (
                                            <div>
                                                <input defaultChecked={true} type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '2', quejaDef.id)} className="custom-control-input" id={'quejaDef' + quejaDef.id} name={'quejaDef' + quejaDef.id} />
                                                <label className="custom-control-label" htmlFor={'quejaDef' + quejaDef.id}></label>
                                            </div>
                                        ) : <div>
                                            <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '2', quejaDef.id)} className="custom-control-input" id={'quejaDef' + quejaDef.id} name={'quejaDef' + quejaDef.id} />
                                            <label className="custom-control-label" htmlFor={'quejaDef' + quejaDef.id}></label>
                                        </div>
                                    }
                                </>
                            </div>
                        </td>
                        <td>
                            {quejaDef.attributes.nombre}
                        </td>
                    </tr>
                )
            })
        )
    }

    // TIPO DE EXPEDIENTE = QUEJA
    const componenteTipoExpedienteQueja = () => {

        // Se retorna
        return (

            // Se recorre el array
            listaTiposQueja.data.map((queja, i) => {

                // Se retorna por posicion
                return (
                    <tr key={(queja.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        (tipoExpAsociados.indexOf(('3|' + queja.id).toString()) > -1) ? (
                                            <div>
                                                <input defaultChecked={true} type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '3', queja.id)} className="custom-control-input" id={'queja' + queja.id} name={'queja' + queja.id} />
                                                <label className="custom-control-label" htmlFor={'queja' + queja.id}></label>
                                            </div>

                                        ) : <div>
                                            <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '3', queja.id)} className="custom-control-input" id={'queja' + queja.id} name={'queja' + queja.id} />
                                            <label className="custom-control-label" htmlFor={'queja' + queja.id}></label>
                                        </div>
                                    }
                                </>
                            </div>
                        </td>
                        <td>
                            {queja.attributes.nombre}
                        </td>
                    </tr>
                )
            })
        )
    }


    // TIPO DE EXPEDIENTE = TUTELA
    const componenteTipoExpedienteTutela = () => {

        // Se retorna
        return (

            // Se recorre el array
            listaTerminosRespuesta.data.map((termino, i) => {

                // Se retorna por posicion
                return (
                    <tr key={(termino.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        (tipoExpAsociados.indexOf(('4|' + termino.id).toString()) > -1) ? (
                                            <div>
                                                <input defaultChecked={true} type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '4', termino.id)} className="custom-control-input" id={'termino' + termino.id} name={'termino' + termino.id} />
                                                <label className="custom-control-label" htmlFor={'termino' + termino.id}></label>
                                            </div>


                                        ) : <div>
                                            <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '4', termino.id)} className="custom-control-input" id={'termino' + termino.id} name={'termino' + termino.id} />
                                            <label className="custom-control-label" htmlFor={'termino' + termino.id}></label>
                                        </div>
                                    }
                                </>
                            </div>
                        </td>
                        <td>
                            {termino.attributes.nombre}
                        </td>
                    </tr>
                )
            })
        )
    }


    // TIPO DE EXPEDIENTE = PROCESO_DISCIPLINARIO
    const componenteTipoExpedienteProcesoDisciplinario = () => {

        // Se retorna
        return (

            // Se recorre el array
            listaTipoProcesoDisciplinario.data.map((proceso, i) => {

                // Se retorna por posicion
                return (
                    <tr key={(proceso.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        (tipoExpAsociados.indexOf(('5|' + proceso.id).toString()) > -1) ? (
                                            <div>
                                                <input defaultChecked={true} type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '5', proceso.id)} className="custom-control-input" id={'proceso' + proceso.id} name={'proceso' + proceso.id} />
                                                <label className="custom-control-label" htmlFor={'proceso' + proceso.id}></label>
                                            </div>


                                        ) : <div>
                                            <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '5', proceso.id)} className="custom-control-input" id={'proceso' + proceso.id} name={'termino' + proceso.id} />
                                            <label className="custom-control-label" htmlFor={'proceso' + proceso.id}></label>
                                        </div>
                                    }
                                </>
                            </div>
                        </td>
                        <td>
                            {proceso.attributes.nombre}
                        </td>
                    </tr>
                )
            })
        )
    }

    // Metodo encargado de cargar el formulario general
    const componentFormularioUsuario = () => {

        // Se retorna
        return (
            <>
                <Formik
                    initialValues={{

                        nombre: '',
                        apellido: '',
                        correo: '',
                        dependencia: '',
                        roles: '',
                        tipoExpediente: '',
                        estado: '',
                        reparto: ''

                    }}
                    enableReinitialize
                    validate={(valores) => {

                        let errores = {}

                        if (!getNombre) {
                            errores.nombre = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        if (!getApellido) {
                            errores.apellido = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        if (!getEmail) {
                            errores.correo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        if (!getIdDependencia) {
                            errores.dependencia = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        if (rolesAsociados.length == 0) {

                            errores.roles = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        /*if (tipoExpAsociados.length == 0) {

                            errores.tipoExpediente = "Debe seleccionar al menos un expediente";
                        }*/

                        if (getEstado == '') {

                            errores.estado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        if (!getReparto) {
                            errores.reparto = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }


                        return errores
                    }}
                    onSubmit={(valores, { resetForm }) => {

                        enviarDatos();
                    }}
                >
                    {({ errors }) => (
                        <Form>

                            <div className="col-md-12">
                                <div className="block block-themed">
                                    <div className="block-header">
                                        <h3 className="block-title">ADMINISTRACIÓN :: USUARIOS</h3>
                                    </div>

                                    <div className="block-content">

                                        <div className="row text-right w2d-enter">
                                            <div className="col-md-12">
                                                <Link to={'/Usuario'} title='Regresar'>
                                                    <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="row">

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor='nombre'>NOMBRES <span className="text-danger">*</span></label>
                                                    <Field disabled value={getNombre} type="text" id="nombre" name="nombre" className="form-control" onChange={handleInputChange} />
                                                    <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor='apellido'>APELLIDOS <span className="text-danger">*</span></label>
                                                    <Field disabled value={getApellido} type="text" id="apellido" name="apellido" className="form-control" placeholder="Apellido"
                                                        onChange={handleInputChange} />
                                                    <ErrorMessage name="apellido" component={() => (<span className="text-danger">{errors.apellido}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor='user'>USUARIO <span className="text-danger">*</span></label>
                                                    <Field value={getUser} type="text" id="user" name="user" className="form-control" placeholder="Usuario" disabled />

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor='correo'>CORREO <span className="text-danger">*</span></label>
                                                    <Field disabled value={getEmail} type="text" id="correo" name="correo"
                                                        onChange={handleInputChange} className="form-control" placeholder="Correo" />
                                                    <ErrorMessage name="correo" component={() => (<span className="text-danger">{errors.correo}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="dependencia">DEPENDENCIA <span className="text-danger">*</span></label>
                                                    <Field as="select" value={getIdDependencia} onChange={handleInputChange} className="form-control" id="dependencia" name="dependencia" placeholder="Dependencia">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {respuestaDependenciaOrigen ? selectDependenciaOrigen() : null}
                                                    </Field>
                                                    <ErrorMessage name="dependencia" component={() => (<span className="text-danger">{errors.dependencia}</span>)} />
                                                </div>
                                            </div>
                                            {getIdDependencia == getIdDependenciaSecretariaComun ?
                                                (
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label htmlFor="dependencgrupoTrabajoia">GRUPO DE TRABAJO <span className="text-danger">*</span></label>
                                                            {respuestaGrupoTrabajo && listaGruposTrabajo.data.length > 0 ?
                                                                <Select
                                                                    id='grupoTrabajo'
                                                                    name='grupoTrabajo'
                                                                    isMulti={true}
                                                                    value={getListaGruposSeleccionadas}
                                                                    placeholder="Selecciona"
                                                                    noOptionsMessage={() => "Sin datos"}
                                                                    options={listaGruposTrabajo?.data?.map(e =>
                                                                        ({ label: e.attributes.nombre, value: e.id }))}
                                                                    onChange={(e) => selectChangeGrupo(e)}
                                                                />
                                                                : null}
                                                            <ErrorMessage name="grupoTrabajo" component={() => (<span className="text-danger">{errors.grupoTrabajo} {getErrorGrupos}</span>)} />
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                null
                                            }
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label htmlFor="estado">ESTADO <span className="text-danger">*</span></label>
                                                    <Field as="select" value={getEstado} onChange={handleInputChange} className="form-control" id="estado" name="estado">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        <option value="1">ACTIVO</option>
                                                        <option value="0">INACTIVO</option>
                                                    </Field>
                                                    <ErrorMessage name="estado" component={() => (<span className="text-danger">{errors.estado}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label htmlFor="reparto">HABILITADO PARA REPARTO<span className="text-danger">*</span></label>
                                                    <Field as="select" value={getReparto} onChange={handleInputChange} className="form-control" id="reparto" name="reparto">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        <option value="1">SI</option>
                                                        <option value="0">NO</option>
                                                    </Field>
                                                    <ErrorMessage name="reparto" component={() => (<span className="text-danger">{errors.reparto}</span>)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="block block-themed">
                                    <div className="block-header">
                                        <h3 className="block-title">ASIGNACIÓN DE ROLES</h3>
                                    </div>
                                    <div className="block-content">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <label >DEBE SELECCIONAR AL MENOS UN ROL<span className="text-danger">*</span></label>
                                                <ErrorMessage name="roles" component={() => (<span className="text-danger">{errors.roles}</span>)} />
                                            </div>
                                            <div className="col-md-12">
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "50px" }}>SELECCIONAR</th>
                                                            <th>NOMBRE DE ROL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        {getRespuestaRoles ? listarRoles() : null}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="block block-themed">
                                    <div className="block-header">
                                        <h3 className="block-title">TIPOS DE EXPEDIENTES QUE EL USUARIO PUEDE GESTIONAR</h3>
                                    </div>
                                    <div className="block-content">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <ErrorMessage name="tipoExpediente" component={() => (<span className="text-danger">{errors.tipoExpediente}</span>)} />
                                            </div>
                                            <div className="col-md-12">
                                                {getRespuestaTipoExpediente ? listarTiposExpedientesAsociados() : null}
                                            </div>
                                        </div>
                                        <div className="block-content block-content-full text-right bg-light">
                                            <button type="submit" className="btn btn-rounded btn-primary"> {global.Constants.BOTON_NOMBRE.ACTUALIZAR} </button>
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

    // Metodo encargado de general form
    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Perfiles</small></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Usuario`}><small>Lista de usuarios</small></Link></li>
                        <li className="breadcrumb-item"> <small> Actualizar usuario</small></li>
                    </ol>
                </nav>
            </div>
            <div className="col-md-12">
                {componentFormularioUsuario()}
            </div>
        </>
    )

}

// Se exporta la clase
export default UsuarioDetalle;