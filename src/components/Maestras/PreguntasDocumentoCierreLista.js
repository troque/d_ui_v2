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
function UsuarioForm() {

    const [errorApi, setErrorApi] = useState('');
    const [getNombre, setNombre] = useState('');
    const [getApellido, setApeliido] = useState('');
    const [getUser, setUser] = useState('');
    const [getEmail, setEmail] = useState('');
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
    const [listaTiposQueja, setListaTiposQueja] = useState({ data: {} });
    const [listaTerminosRespuesta, setListaTerminosRespuesta] = useState({ data: {} });
    const [getTiposExpedientes, setTiposExpedientes] = useState({ data: {} });
    const [getReparto, setReparto] = useState('');

    /*Redirects*/
    const redirectToRoutes = () => {
        return <Navigate to={`/Usuario/`} />;
    }


    useEffect(() => {
        window.showSpinner(true);
        async function fetchData() {
            getAllDependenciaOrigen();
            cargarTiposDerechoPeticion();
            cargarTiposQueja();
            cargarTerminoRespuesta();
        }

        fetchData();
    }, []);

    const cargarTiposDerechoPeticion = () => {
        GenericApi.getAllGeneric('mas-tipo-derecho-peticion').then(
            datos => {
                if (!datos.error) {
                    // console.log(datos);
                    setListaDerechoPeticion(datos);
                }
                else {
                    window.showModal(1)
                }
            }
        )
    }

    const cargarTiposQueja = () => {
        GenericApi.getAllGeneric('mas-tipo-queja').then(
            datos => {

                if (!datos.error) {
                    setListaTiposQueja(datos);
                }
                else {
                    window.showModal(1)
                }
            }
        )
    }

    const cargarTerminoRespuesta = () => {
        GenericApi.getAllGeneric('mas-termino-respuesta').then(
            datos => {
                if (!datos.error) {
                    setListaTerminosRespuesta(datos);

                }
                else {
                    window.showModal(1)
                }
            }
        )
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombre") {
            setNombre(value);
        }
        if (name == "apellido") {
            setApeliido(value);
        }
        if (name == "correo") {
            setEmail(value);
        }
        if (name == "dependencia") {
            setIdDependencia(value);
        }
        if (name == "estado") {
            setEstado(value);
        }
        if (name == "user") {
            setUser(value);
        }

        if(name == "reparto"){
            setReparto(value);
        }


    }

    const selectDependenciaOrigen = () => {
        return (
            listaDependenciaOrigen.data.map((dependencia, i) => {
                return (
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                )
            })
        )
    }

    const getAllDependenciaOrigen = () => {

        //GenericApi.getAllGeneric('mas-dependencia-origen').then(
        //en la tabla MAS_DEPENDENCIA_ACCESO el 5 corresponde a crear usuario
        GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.CREAR_USUARIO).then(
            datos => !datos.error ? (setListaDependenciaOrigen(datos), setDependenciaOrigen(true), getllRoles()) : (getllRoles(), window.showModal(1))
        )
    }

    const getllRoles = () => {
        GenericApi.getAllGeneric('role').then(
            datos => !datos.error ? (setListaRoles(datos), setRespuestaRoles(true),
            cargarTiposExpeidnetes()) : (window.showModal(1), cargarTiposExpeidnetes())
        )
    }

    const cargarTiposExpeidnetes = () => {
        GenericApi.getAllGeneric('mas-tipo-expediente').then(
            datos => {
                if (!datos.error) {

                    setTiposExpedientes(datos);
                    setRespuestaTipoExpediente(true);
                    window.showSpinner(false)
                }
                else {
                    window.showModal(1);
                    window.showSpinner(false)
                }
            }
        )
    }

    const mostrarModalDirectorio = () => {
        window.showModalCoincidenciasUsuario();
    }


    const handleCallback = (childData) => {
        try {

            if (childData != null) {
                setNombre(childData.nombre);
                setApeliido(childData.apellido);
                setEmail(childData.email);
                setUser(childData.name);
            }


        } catch (error) {

        }

    }

    const inicilizarDatos = () => {
        setNombre("");
        setApeliido("");
        setEmail("");
        setDependenciaOrigen("");
        setUser("")
    }

    const enviarDatos = () => {
        window.showSpinner(true);
        let data;


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
                }
            }
        }


        // console.log(JSON.stringify(data));

        GenericApi.addGeneric('usuario', data).then(
            datos => {
                if (!datos.error) {
                    window.showModal(2)
                    setIsRedirect(true);
                }
                else {
                    //console.log("hay error");
                    // console.log(datos.error);
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                }
                window.showSpinner(false);
            }
        )
    }

    const agregarCheck = (e, rolId) => {
        if (e == true) {

            setRolesAsociados(oldArray => [...oldArray, rolId]);

        }
        else {


            var index = rolesAsociados.indexOf(rolId);
            if (index !== -1) {
                rolesAsociados.splice(index, 1);
            }
        }

    }


    const agregarCheckTipoExp = (e, extId, subExpid) => {

        

        if (e == true) {
            setTipoExpAsociados(oldArray => [...oldArray, (extId + "|" + subExpid)]);

        }
        else {
            var index = tipoExpAsociados.indexOf((extId + "|" + subExpid));
            if (index !== -1) {
                tipoExpAsociados.splice(index, 1);
            }
        }

    }




    const listarRoles = () => {
        return (

            getListaRoles.data.map((rol, i) => {
                return (
                    <tr key={(rol.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <input type="checkbox" onChange={e => agregarCheck(e.target.checked, rol.id)} className="custom-control-input" id={rol.id} name={rol.id} />
                                <label className="custom-control-label" htmlFor={rol.id}></label>
                            </div>
                        </td>
                        <td>
                            {rol.attributes.nombre}
                        </td>
                    </tr>
                )
            })
        )
    }



    const listarTiposExpedientessociados = () => {

        return (
            <div className='row'>
                <div className="col-md-12">
                    {
                        getTiposExpedientes.data.map((tipoExp, i) => {
                            return (

                                <div key={tipoExp.id} id="accordion" role="tablist" aria-multiselectable="true">
                                    <div className="block block-rounded mb-1">
                                        <div className="block-header block-header-default" role="tab" id="accordion_h1">
                                            <a className="font-w600" data-toggle="collapse" data-parent="#accordion" href="#accordion_q1" aria-expanded="true" aria-controls="accordion_q1"><i className="fas fa-folder" /> {tipoExp.attributes.nombre} </a>
                                        </div>
                                        <div id="accordion_q1" className="show" role="tabpanel" aria-labelledby="accordion_h1" data-parent="#accordion">
                                            <div className="block-content">


                                                {/*DERECHO DE PETICION*/}
                                                {tipoExp.id === '1' ? componenteTipoExpedienteDerecho() : ''}
                                                {/*PODER REFERENTE A SOLIICTUD*/}
                                                {tipoExp.id === '2' ? componenteTipoExpedienteReferente() : ''}
                                                {/*QUEJA*/}
                                                {tipoExp.id === '3' ? componenteTipoExpedienteQueja() : ''}
                                                {/*TUTELA*/}
                                                {tipoExp.id === '4' ? componenteTipoExpedienteTutela() : ''}



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

    // TIPO DE EXPEDIENTE = DERECHO DE PETICION
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

    // TIPO DE EXPEDIENTE = DERECHO DE PETICION
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
                            errores.user = "Debe ingresar un nombre de usuario";
                        }

                        if (!getNombre) {
                            errores.nombre = "Debe ingresar un nombre";
                        }

                        if (!getApellido) {
                            errores.apellido = "Debe ingresar un apellido";
                        }

                        if (!getEmail) {
                            errores.correo = "Debe ingresar un correo";
                        }

                        if (!getIdDependencia) {
                            errores.dependencia = "Debe ingresar una dependencia";
                        }

                        if (rolesAsociados.length == '') {
                            errores.roles = "Debe seleccionar al menos un rol";
                        }

                        if (getEstado == '') {
                            errores.estado = "Debe seleccionar un estado";
                        }

                        if (!getReparto) {
                            errores.reparto = "Debe ingresar si está habilitado para reparto";
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
                                    <h3 className="block-title">Datos Básicos</h3>
                                </div>

                                <div className="block-content text-center">
                                    <button type="button" className="btn btn-rounded btn-primary" onClick={() => mostrarModalDirectorio()}>
                                         Buscar usuario
                                    </button>
                                </div>

                                <div className="block-content">
                                    <div className="row">


                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='nombre'>Nombre <span className="text-danger">*</span></label>
                                                <Field value={getNombre} type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre"
                                                    onChange={handleInputChange} />
                                                <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='apellido'>Apellido <span className="text-danger">*</span></label>
                                                <Field value={getApellido} type="text" id="apellido" name="apellido" className="form-control" placeholder="Apellido"
                                                    onChange={handleInputChange} />
                                                <ErrorMessage name="apellido" component={() => (<span className="text-danger">{errors.apellido}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='user'>Usuario <span className="text-danger">*</span></label>
                                                <Field disabled value={getUser} onChange={handleInputChange} type="text" id="user" name="user" className="form-control" placeholder="Usuario" />
                                                <ErrorMessage name="user" component={() => (<span className="text-danger">{errors.user}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='correo'>Correo <span className="text-danger">*</span></label>
                                                <Field disabled value={getEmail} type="text" id="correo" name="correo"
                                                    onChange={handleInputChange} className="form-control" placeholder="Correo" />
                                                <ErrorMessage name="correo" component={() => (<span className="text-danger">{errors.correo}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="dependencia">Dependencia <span className="text-danger">*</span></label>
                                                <Field as="select" value={getIdDependencia} onChange={handleInputChange} className="form-control" id="dependencia" name="dependencia" placeholder="Dependencia">
                                                    <option value="">Por favor seleccione</option>
                                                    {respuestaDependenciaOrigen ? selectDependenciaOrigen() : null}
                                                </Field>
                                                <ErrorMessage name="dependencia" component={() => (<span className="text-danger">{errors.dependencia}</span>)} />
                                            </div>

                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="estado">Estado <span className="text-danger">*</span></label>
                                                <Field as="select" value={getEstado} onChange={handleInputChange} className="form-control" id="estado" name="estado">
                                                    <option value="">Por favor seleccione</option>
                                                    <option value="1">Activo</option>
                                                    <option value="0">Inactivo</option>
                                                </Field>
                                                <ErrorMessage name="estado" component={() => (<span className="text-danger">{errors.estado}</span>)} />
                                            </div>

                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="reparto">Habilitado para Reparto <span className="text-danger">*</span></label>
                                                <Field as="select" value={getReparto} onChange={handleInputChange} className="form-control" id="reparto" name="reparto" placeholder="Habilitado para reparto">
                                                    <option value="">Por favor seleccione</option>
                                                    <option value="1" selected>Si</option>
                                                    <option value="0">No</option>
                                                </Field>
                                                <ErrorMessage name="reparto" component={() => (<span className="text-danger">{errors.reparto}</span>)} />
                                            </div>
                                        </div>

                                    </div>

                                </div>
                        
                            </div>

                       
                            <div className="block block-themed">
                                <div className="block-header">
                                    <h3 className="block-title">Asignación de roles</h3>
                                </div> 

                                
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-12">
                                        <label >Seleccionar al menos un perfil <span className="text-danger">*</span></label>
                                        </div>
                                        <div className="col-md-12">
                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                <thead>
                                                    <tr>
                                                        <th>Seleccionar</th>
                                                        <th>Nombre Rol</th>
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
                                    <h3 className="block-title">Tipos de expedientes que puede gestionar</h3>
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
                                    <button type="submit" className="btn btn-rounded btn-primary">
                                         Registrar
                                    </button>
                                    <Link to={'/Usuario'} className="font-size-h5 font-w600" >
                                            <button type="button" className="btn btn-rounded btn-outline-primary" >Cancelar</button>
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
            {isRedirect ? redirectToRoutes() : null}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Usuario`}><small>Lista de Usuarios</small></Link></li>
                        <li className="breadcrumb-item"> <small> Crear Usuario</small></li>
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