import React, { useEffect, useState } from 'react';
import 'rhfa-emergency-styles/dist/styles.css'
import Spinner from '../Utils/Spinner';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import GenericApi from '../Api/Services/GenericApi';
import ModalGen from '../Utils/Modals/ModalGeneric';
import { Navigate } from "react-router-dom";
import ModalCoincidenciasUsuarios from '../Utils/Modals/ModalCoincidenciasUsuarios';
import '../Utils/Constants';
import Select from 'react-select';

// Se inicializa la clase
function UsuarioForm() {

    // Se inicializan las constantes
    const [errorApi, setErrorApi] = useState('');
    const [getNombre, setNombre] = useState('');
    const [getApellido, setApeliido] = useState('');
    const [getUser, setUser] = useState('');
    const [getEmail, setEmail] = useState('');
    const [getIdentificacion, setIdentificacion] = useState('');

    const [getIdDependencia, setIdDependencia] = useState('');
    const [getEstado, setEstado] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [rolesAsociados, setRolesAsociados] = useState([]);
    const [tipoExpAsociados, setTipoExpAsociados] = useState([]);
    const [getRespuestaTipoExpediente, setRespuestaTipoExpediente] = useState(false);
    const [listaDependenciaOrigen, setListaDependenciaOrigen] = useState({ data: {} });
    const [respuestaDependenciaOrigen, setDependenciaOrigen] = useState(false);
    const [getListaRoles, setListaRoles] = useState({ data: {} });
    const [getRespuestaRoles, setRespuestaRoles] = useState(false);

    const [listaTipoDerechoPeticion, setListaDerechoPeticion] = useState({ data: {} });
    const [respuestaTipoDerechoPeticion, setRespuestaDerechoPeticion] = useState(false);

    const [listaTipoProcesoDisciplinario, setListaProcesoDisciplinario] = useState({ data: {} });
    const [respuestaProcesoDisciplinario, setRespuestaProcesoDisciplinario] = useState(false);

    const [listaTiposQueja, setListaTiposQueja] = useState({ data: {} });
    const [respuestaTiposQueja, setRespuestaTiposQueja] = useState(false);

    const [listaTerminosRespuesta, setListaTerminosRespuesta] = useState({ data: {} });
    const [respuestaTerminosRespuesta, setRespuestaTerminosRespuesta] = useState(false);

    const [getTiposExpedientes, setTiposExpedientes] = useState({ data: {} });
    const [getReparto, setReparto] = useState('');
    const [getIdDependenciaSecretariaComun, setIdDependenciaSecretariaComun] = useState('');
    const [listaGruposTrabajo, setListaGruposTrabajo] = useState({ data: {} });
    const [getGrupoTrabajoSeleccionado, setGrupoTrabajoSeleccionado] = useState('');
    const [getIdGrupoTrabajo, setIdGrupoTrabajo] = useState('');
    const [respuestaGrupoTrabajo, setRespuestaGrupoTrabajo] = useState(false);
    const [getListaGruposSeleccionadas, setListaGruposSeleccionadas] = useState([]);
    const [getErrorGrupos, setErrorGrupos] = useState("");

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getValidarSecretariaComun, setValidarSecretariaComun] = useState(false);


    /**
     * Método encargado de cargar la configuracion de la clase
     */
    useEffect(() => {
        window.showSpinner(true);// Inicia el spinner        
        async function fetchData() {// Se llama la funcion del metodo           
            getAllDependenciaOrigen();  // Se cargan las dependencias origen
        }
        window.showSpinner(false);// Finaliza el spinner        
        fetchData();// Se llama la funcion asincrona
    }, []);


    /**
     * Método encargdo de cargar las dependencias registradas
     */
    const getAllDependenciaOrigen = () => {

        GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.CREAR_USUARIO).then(// Se consume la api para traer las depedencias a estado registrar

            // Se incializa la variable de respuesta
            datos => {

                if (!datos.error) { // Se válida que no haya error

                    setListaDependenciaOrigen(datos);// Se setean los datos
                    setDependenciaOrigen(true); // Se redeclara la variable en true
                    getllRoles(); // Se llama el metodo para cargar los roles

                }
                else {
                    // Se lanza el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner   
                }
            }


        )
    }

    /**
     * Método encargado de cargar los roles
     */
    const getllRoles = () => {

        GenericApi.getAllGeneric('role').then(// Se consume la api para traer los roles

            datos => { // Se incializa la variable de respuesta

                if (!datos.error) {  // Se valida que no haya error
                    setListaRoles(datos); // Se setean los datos
                    setRespuestaRoles(true); // Se redeclara la variable en true
                    cargarTiposExpedientes();  // Se llama el metodo para cargar los tipos de expediente
                }
                else {
                    // Se lanza el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner
                }
            }
        )
    }

    /**
     * Método encargado de cargar los tipos de expediente
     */
    const cargarTiposExpedientes = () => {

        GenericApi.getAllGeneric('mas-tipo-expediente').then( // Se consume la api para traer los roles

            datos => { // Se incializa la variable de respuesta

                if (!datos.error) { // Se valida que no haya error
                    setTiposExpedientes(datos); // Se setean los datos                    
                    setRespuestaTipoExpediente(true); // Se redeclara la variable en true
                    cargarTiposDerechoPeticion(); // Se llama el metodo para cargar los tipos de derecho de peticion

                } else {

                    // Se lanza el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner
                }
            }
        )
    }

    /**
     * Método encargado de cargar los tipos de derecho peticion
     */

    const cargarTiposDerechoPeticion = () => {

        GenericApi.getAllGeneric('mas-tipo-derecho-peticion').then(// Se consume la api para traer los tipos de derecho peticion


            datos => { // Se incializa la variable de respuesta

                if (!datos.error) { // Se valida que no haya error

                    setListaDerechoPeticion(datos); // Se setean los datos
                    setRespuestaDerechoPeticion(true); // Se redeclara la variable en true
                    cargarTiposQueja();// Se llama el metodo para cargar los tipos de queja

                } else {

                    // Se lanza el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner
                }
            }
        )
    }

    /**
     * Método encagrado de cargar los tipos de queja
     */
    const cargarTiposQueja = () => {

        GenericApi.getAllGeneric('mas-tipo-queja').then( // Se consume la api para traer los tipos de queja

            datos => { // Se incializa la variable de respuesta

                if (!datos.error) { // Se valida que no haya error

                    setListaTiposQueja(datos); // Se setean los datos
                    setRespuestaTiposQueja(true); // Se redeclara la variable en true

                    setListaProcesoDisciplinario(datos); // Se setean los datos
                    setRespuestaProcesoDisciplinario(true); // Se redeclara la variable en true

                    cargarTerminoRespuesta();// Se llama el metodo para cargar los tipos de respuesta

                } else {

                    // Se lanza el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner
                }
            }
        )
    }

    /**
     * Método encargado de cargar los terminos de respuesta
     */
    const cargarTerminoRespuesta = () => {

        // Se consume la API
        GenericApi.getAllGeneric('mas-termino-respuesta').then(

            datos => {// Se incializa la variable de respuesta

                if (!datos.error) {// Se valida que no haya error

                    setListaTerminosRespuesta(datos);// Se setean los datos
                    setRespuestaTerminosRespuesta(true);// Se redeclara la variable en true
                    cargarIdDependenciaSecretariaComun();// Se llama el metodo para cargar el id de secretaria comun
                } else {

                    // Se lanza el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner
                }
            }
        )
    }

    /**
     * Método encargado de cargar el id de secretaria comun
     */
    const cargarIdDependenciaSecretariaComun = () => {

        // Se inicializa la variable
        const data = {
            "data": {
                "type": 'mas_parametro',
                "attributes": {
                    "nombre": "id_dependencia_secretaria_comun"
                }
            }
        }

        // Se consume la API
        GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(

            // Se incializa la variable de respuesta
            datos => {

                if (!datos.error) { // Se valida que no haya error

                    setIdDependenciaSecretariaComun(datos.data[0].attributes.valor); // Se setea el valor del id
                    cargarGruposDeTrabajo(); // Se llama el metodo para cargar los grupos de trabajo

                } else {
                    // Se lanza el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner
                }
            }
        )
    }


    /**
     * Método encargado de cargar los grupos de trabajo
     */
    const cargarGruposDeTrabajo = () => {

        // Se consume la API
        GenericApi.getGeneric("mas_grupo_trabajo").then(

            datos => {// Se incializa la variable de respuesta

                if (!datos.error) {// Se valida que no haya error

                    setListaGruposTrabajo(datos);// Se setea los datos
                    setRespuestaGrupoTrabajo(true);// Se setea la respuesta en true
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);// Finaliza el spinner  
                }
            }
        )
    }

    /**
     * Método encargado de setear el valor el cambiar
     * @param {*} event 
     */
    const handleInputChange = (event) => {

        // Se capturan el input y valor correspondiente
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombre") {// Se valida cuando es nombre
            setNombre(value); // Se setea el valor
        }

        if (name == "apellido") { // Se valida cuando es apellido
            setApeliido(value);// Se setea el valor
        }

        if (name == "identificacion") { // Se valida cuando es apellido
            setIdentificacion(value);// Se setea el valor
        }

        if (name == "correo") { // Se valida cuando es correo
            setEmail(value);  // Se setea el valor
        }

        if (name == "dependencia") {  // Se valida cuando es dependencia

            setIdDependencia(value);  // Se setea el valor
            validarSecretariaComun(value); // Se llama el metodo encargado de validar si la dependencia tiene accceso a Secretaria Comun
        }

        if (name == "estado") {  // Se valida cuando es estado            
            setEstado(value); // Se setea el valor
        }

        if (name == "user") { // Se valida cuando es user
            setUser(value); // Se setea el valor
        }

        if (name == "reparto") {  // Se valida cuando es reparto
            setReparto(value); // Se setea el valor
        }

        if (name == "grupoTrabajo") { // Se valida cuando es grupoTrabajo
            setIdGrupoTrabajo(value); // Se setea el valor
        }
    }

    /**
     * Metodo encargado de cambiar el valor en los grupos de trabajo
     * @param {*} v 
     */
    const selectChangeGrupo = (v) => {

        if (v != null) { // Se valida que es diferente de null
            setListaGruposSeleccionadas(v); // Se setea el valor seleccionado
        } else {
            setErrorGrupos('Campo requerido'); // Se setea el mensaje de error de los grupos
        }
    }


    /**
     * Método encargado de validar si la dependencia tiene activo el permiso de secretaria comun
     * @param {*} idDependencia 
     */
    const validarSecretariaComun = (idDependencia) => {

        window.showSpinner(true); // Se usa el cargando

        // Se consume la API
        GenericApi.getGeneric("mas-dependencia-configuracion/" + idDependencia).then(

            datos => { // Se inicializa la variable de respuesta


                if (!datos.error) { // Se valida que no haya error
                    setValidarSecretariaComun(true); // Se redeclara la variable en true
                } else {
                    setValidarSecretariaComun(false); // Se redeclara la variable en true
                }

                window.showSpinner(false); // Se quita el cargando
            }
        )
    }

    /**
     * Método encargado de cargar las dependencias de origen
     * @returns 
     */
    const selectDependenciaOrigen = () => {

        // Se retorna
        return (

            listaDependenciaOrigen.data.map((dependencia, i) => { // Se recorre el array
                return (
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>  // Se retorna el select por posicion
                )
            })
        )
    }

    const mostrarModalDirectorio = () => { // Metodo encargado de mostrar el modal del directorio
        window.showModalCoincidenciasUsuario();  // Se llama el modal
    }


    /**
     *  Método encargado de retorna la buscqueda del modal
     * @param {*} childData 
     */
    const handleCallback = (childData) => {

        try { // Se inicializa el trycatch

            if (childData != null) { // Se valida que la data sea diferente de null

                // Se setean los valores
                setNombre(childData.nombre);
                setApeliido(childData.apellido);
                setEmail(childData.email);
                setUser(childData.name);
                setIdentificacion(childData.identificacion);
            }
        } catch (error) {
        }
    }

    // Metodo encargado de enviar los datos al backend
    const enviarDatos = () => {

        window.showSpinner(true); // Se usa el cargando
        let data; // Se inicializa la data

        // Se redeclara la variable con la informacion a enviar
        data = {

            "data": {
                "type": "usuario",
                "attributes": {
                    "nombre": getNombre ? getNombre : "",
                    "apellido": getApellido ? getApellido : "",
                    "name": getUser ? getUser : "",
                    "email": getEmail ? getEmail : "",
                    "identificacion": getIdentificacion ? getIdentificacion : "",
                    "id_dependencia": getIdDependencia ? getIdDependencia : "",
                    "id_mas_grupo_trabajo_secretaria_comun": getListaGruposSeleccionadas ? getListaGruposSeleccionadas : "",
                    "roles": rolesAsociados,
                    "expedientes": tipoExpAsociados,
                    "estado": getEstado ? getEstado : "",
                    "reparto_habilitado": getReparto ? getReparto : "",
                }
            }
        }

        // Se consume la API
        GenericApi.addGeneric('usuario', data).then(

            datos => { // Se inicializa la variable de respuesta

                if (!datos.error) { // Se valida que no haya error

                    setIsRedirect(true); // Se setea el valor en true                    
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/Usuario', alert: global.Constants.TIPO_ALERTA.EXITO });

                } else {
                    // Se muestra el mensaje de error
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/Usuario/Add', alert: global.Constants.TIPO_ALERTA.ERROR });
                }

                // Se quita el cargando
                window.showSpinner(false);
            }
        )
    }

    // Metodo encargado de agregar el check
    const agregarCheck = (e, rolId) => {

        // Se valida que sea true el check
        if (e == true) {

            // Se añade al array el valor
            setRolesAsociados(oldArray => [...oldArray, rolId]);
        } else {

            // Se busca el indice con el id
            var index = rolesAsociados.indexOf(rolId);

            // Se valida que se encuentre en el array
            if (index !== -1) {

                // Se quita del array de roles
                rolesAsociados.splice(index, 1);
            }
        }
    }

    // Metodo encargado de agregar el check de tipos de expediente
    const agregarCheckTipoExp = (e, extId, subExpid) => {

        // Se valida que sea true el check
        if (e == true) {

            // Se añade al array el valor
            setTipoExpAsociados(oldArray => [...oldArray, (extId + "|" + subExpid)]);
        } else {

            // Se busca el indice con el id
            var index = tipoExpAsociados.indexOf((extId + "|" + subExpid));

            // Se valida que se encuentre en el array
            if (index !== -1) {

                // Se quita del array de roles
                tipoExpAsociados.splice(index, 1);
            }
        }
    }

    // Metodo encargado de listar los roles
    const listarRoles = () => {

        // Se retorna
        return (

            // Se recorre el array
            getListaRoles.data.map((rol, i) => {

                // Se retorna cada columna por posicion
                return (
                    <tr key={(rol.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <input type="checkbox" onChange={e => agregarCheck(e.target.checked, rol.id)} className="custom-control-input" id={rol.id} name={rol.id} />
                                <label className="custom-control-label" htmlFor={rol.id}></label>
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

    // Metodo encargado de listar los tippos de expediente asociados
    const listarTiposExpedientessociados = () => {

        // Se retorna
        return (

            // Se carga el html
            <div className='row'>
                <div className="col-md-12">
                    {
                        // Se recorre el array
                        getTiposExpedientes.data.map((tipoExp, i) => {

                            // Se retorna el html ppr posicion
                            return (
                                <div key={tipoExp.id} id="accordion" role="tablist" aria-multiselectable="true">
                                    <div className="block block-rounded mb-1">
                                        <div className="block-header block-header-default" role="tab" id="accordion_h1">
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

    // Tipo expediente - Derecho Peticion
    const componenteTipoExpedienteDerecho = () => {
        return (

            listaTipoDerechoPeticion.data.map((derecho, i) => {
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

    // Tipo expediente - Poder Referente
    const componenteTipoExpedienteReferente = () => {
        return (

            listaTiposQueja.data.map((quejaDef, i) => {
                return (
                    <tr key={(quejaDef.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <div>
                                    <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '2', quejaDef.id)} className="custom-control-input" id={'quejaDef' + quejaDef.id} name={'quejaDef' + quejaDef.id} />
                                    <label className="custom-control-label" htmlFor={'quejaDef' + quejaDef.id}></label>
                                </div>

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

    // Tipo expediente - Queja
    const componenteTipoExpedienteQueja = () => {
        return (

            listaTiposQueja.data.map((queja, i) => {
                return (
                    <tr key={(queja.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <div>
                                    <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '3', queja.id)} className="custom-control-input" id={'queja' + queja.id} name={'queja' + queja.id} />
                                    <label className="custom-control-label" htmlFor={'queja' + queja.id}></label>
                                </div>
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

    // Tipo expediente - Tutela
    const componenteTipoExpedienteTutela = () => {
        return (
            listaTerminosRespuesta.data.map((termino, i) => {
                return (
                    <tr key={(termino.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">

                                <div>
                                    <input type="checkbox" onChange={e => agregarCheckTipoExp(e.target.checked, '4', termino.id)} className="custom-control-input" id={'termino' + termino.id} name={'termino' + termino.id} />
                                    <label className="custom-control-label" htmlFor={'termino' + termino.id}></label>
                                </div>

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

    // Tipo expediente - Proceso Disciplinario
    const componenteTipoExpedienteProcesoDisciplinario = () => {
        return (
            listaTiposQueja.data.map((proceso, i) => {
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

    const componentFormularioUsuario = () => {
        return (
            <>
                {<ModalCoincidenciasUsuarios parentCallback={handleCallback} />}
                <Spinner />
                <Formik
                    initialValues={{
                        nombre: '',
                        apellido: '',
                        correo: '',
                        dependencia: '',
                        roles: '',
                        tipoExpediente: '',
                        estado: '',
                        user: '',
                        reparto: '',

                    }}
                    enableReinitialize
                    validate={(valores) => {

                        let errores = {}

                        if (!getUser) {
                            errores.user = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

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

                        if (rolesAsociados.length == '') {
                            errores.roles = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

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
                            <div className="block block-themed">
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: USUARIOS</h3>
                                </div>

                                <div className="row text-right w2d-enter">
                                    <div className="col-md-12">
                                        <Link to={'/Usuario'} title='Regresar'>
                                            <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="block-content text-center">
                                    <button type="button" className="btn btn-rounded btn-primary" onClick={() => mostrarModalDirectorio()}>
                                        BUSCAR USUARIO
                                    </button>
                                </div>
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='nombre'>NOMBRES <span className="text-danger">*</span></label>
                                                <Field disabled value={getNombre} type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre"
                                                    onChange={handleInputChange} />
                                                {/*<ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />*/}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='apellido'>APELLIDOS <span className="text-danger">*</span></label>
                                                <Field disabled value={getApellido} type="text" id="apellido" name="apellido" className="form-control" placeholder="Apellido"
                                                    onChange={handleInputChange} />
                                                {/*<ErrorMessage name="apellido" component={() => (<span className="text-danger">{errors.apellido}</span>)} />*/}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='user'>USUARIO <span className="text-danger">*</span></label>
                                                <Field disabled value={getUser} onChange={handleInputChange} type="text" id="user" name="user" className="form-control" placeholder="Usuario" />
                                                {/*<ErrorMessage name="user" component={() => (<span className="text-danger">{errors.user}</span>)} />*/}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='correo'>CORREO <span className="text-danger">*</span></label>
                                                <Field disabled value={getEmail} type="text" id="correo" name="correo"
                                                    onChange={handleInputChange} className="form-control" placeholder="Correo" />
                                                {/*<ErrorMessage name="correo" component={() => (<span className="text-danger">{errors.correo}</span>)} />*/}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='correo'>IDENTIFICACIÓN <span className="text-danger">*</span></label>
                                                <Field disabled value={getIdentificacion} type="text" id="correo" name="identificacion"
                                                    onChange={handleInputChange} className="form-control" placeholder="identificacion" />
                                                {/*<ErrorMessage name="correo" component={() => (<span className="text-danger">{errors.correo}</span>)} />*/}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="dependencia">DEPENDENCIA <span className="text-danger">*</span></label>
                                                <Field as="select" value={getIdDependencia} onChange={handleInputChange} className="form-control" id="dependencia" name="dependencia" placeholder="Dependencia">
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {respuestaDependenciaOrigen ? selectDependenciaOrigen() : null}
                                                </Field>
                                                <ErrorMessage name="dependencia" component={() => (<span className="text-danger">{errors.dependencia}</span>)} />
                                            </div>
                                        </div>
                                        {getValidarSecretariaComun ?
                                            (
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="dependencgrupoTrabajoia">GRUPOS DE TRABAJO<span className="text-danger">*</span></label>

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
                                            setIdGrupoTrabajo('')
                                        }
                                        <div className="col-md-6">
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
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="reparto">HABILITADO PARA REPARTO<span className="text-danger">*</span></label>
                                                <Field as="select" value={getReparto} onChange={handleInputChange} className="form-control" id="reparto" name="reparto" placeholder="Habilitado para reparto">
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="1" selected>SI</option>
                                                    <option value="0">NO</option>
                                                </Field>
                                                <ErrorMessage name="reparto" component={() => (<span className="text-danger">{errors.reparto}</span>)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block block-themed">
                                <div className="block-header">
                                    <h3 className="block-title">ASIGNACIÓN DE ROLES</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label >DEBE SELECCIONAR AL MENOS UN ROL<span className="text-danger">*</span></label>
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
                                        <ErrorMessage name="roles" component={() => (<span className="text-danger">{errors.roles}</span>)} />
                                    </div>
                                </div>
                            </div>
                            <div className="block block-themed">
                                <div className="block-header">
                                    <h3 className="block-title">TIPOS DE EXPEDIENTES QUE EL USUARIO PUEDE GESTIONAR</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row" >
                                        <div className="col-md-12">
                                            <ErrorMessage name="tipoExpediente" component={() => (<span className="text-danger">{errors.tipoExpediente}</span>)} />
                                        </div>
                                        <div className="col-md-12">
                                            {getRespuestaTipoExpediente ? listarTiposExpedientessociados() : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    <Link to={'/Usuario'} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
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
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Perfiles</small></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Usuario`}><small>Lista de usuarios</small></Link></li>
                        <li className="breadcrumb-item"> <small> Crear usuario</small></li>
                    </ol>
                </nav>
            </div>
            <div className="col-md-12">
                {componentFormularioUsuario()}
            </div>
        </>
    )

}
export default UsuarioForm;