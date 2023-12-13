import React, { useEffect, useState } from 'react';
import 'rhfa-emergency-styles/dist/styles.css'
import Spinner from '../Utils/Spinner';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import GenericApi from '../Api/Services/GenericApi';
import { Navigate } from "react-router-dom";


function DependenciaConfiguracionForm() {

    const [errorApi, setErrorApi] = useState('');
    const [getNombre, setNombre] = useState('');
    const [getEstado, setEstado] = useState('');
    const [getPrefijo, setPrefijo] = useState('');
    const [getUsuarioJefe, setUsuarioJefe] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [getListaUsuarios, setListaUsuarios] = useState({ data: {} });
    const [getRespuestaUsuarios, setRespuestaUsuarios] = useState(false);
    const [getTiposAccesos, setTiposAccesos] = useState({ data: {} });
    const [getListaAccesosAsociados, setListaAccesosAsociados] = useState(false);
    const [getAccesosAsociados, setAccesosAsociados] = useState([]);
    const [getRepuestaNombre, setRepuestaNombre] = useState(false);

    /*Redirects*/
    const redirectToRoutes = () => {
        return <Navigate to={`/Dependencia/`} />;
    }

    useEffect(() => {
        window.showSpinner(true);
        async function fetchData() {
            cargarUsuarios();
        }

        fetchData();
    }, []);

    const selectUsuarios = () => {
        return (
            getListaUsuarios.data.map((usuario, i) => {
                return (
                    <option key={usuario.id} value={usuario.id}>{usuario.attributes.nombre} ({usuario.attributes.name})</option>
                )
            })
        )
    }

    const cargarUsuarios = () => {
        GenericApi.getAllGeneric('usuario').then(
            datos => {
                // console.log(datos);
                if (!datos.error) {
                    setListaUsuarios(datos);
                    setRespuestaUsuarios(true);
                    cargarAccesos();

                }
                else {
                    window.showModal(1);
                    cargarAccesos();

                }
            }
        )
    }


    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombre") {
            if (value === '' || 
            (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value) && 
            value.length <= 255)) {
                setNombre(value);
                setRepuestaNombre(true);
            }
        }
        if (name == "usuariojefe") {
            setUsuarioJefe(value);
        }

        if (name == "estado") {
            setEstado(value);
        }

        if (name == "prefijo") {
            if (value === '' || 
            (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value) && 
            value.length <= 255)) {
                setPrefijo(value);
            }
        }

    }

    const agregarCheck = (e, accesoId) => {
        if (e == true) {
            setAccesosAsociados(oldArray => [...oldArray, accesoId]);
        } else {
            var index = getAccesosAsociados.indexOf(accesoId);
            if (index !== -1) {
                getAccesosAsociados.splice(index, 1);
            }
        }
    }

    const listarAccessoAsociados = () => {
        return (
            getTiposAccesos.data.map((acceso, i) => {
                return (
                    <tr key={(acceso.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <input type="checkbox" onChange={e => agregarCheck(e.target.checked, acceso.id)} className="custom-control-input" id={acceso.id} name={acceso.id} />
                                <label className="custom-control-label" htmlFor={acceso.id+"AA"}></label>
                            </div>
                        </td>
                        <td>
                            {acceso.attributes.nombre}
                        </td>
                    </tr>
                )
            })
        )
    }

    const cargarAccesos = () => {
        GenericApi.getAllGeneric('mas-dependencia-accesos').then(
            datos => {
                // console.log(datos);
                if (!datos.error) {
                    setTiposAccesos(datos);
                    setListaAccesosAsociados(true);
                    window.showSpinner(false);
                } else {
                    setErrorApi(datos.error.toString());
                    window.showSpinner(false);
                }
            }
        )
    }

    const enviarDatos = () => {

        window.showSpinner(true);

        let data;

        data = {
            "data": {
                "type": "mas_dependencia_origen",
                "attributes": {
                    "nombre": getNombre ? getNombre : "",
                    "estado": getEstado ? getEstado : "",
                    "id_usuario_jefe": getUsuarioJefe ? getUsuarioJefe : "",
                    "accesos": getAccesosAsociados ? getAccesosAsociados : "",
                    "prefijo": getPrefijo ? getPrefijo : ""
                }
            }
        }

        // console.log(JSON.stringify(data));

        GenericApi.addGeneric('mas-dependencia-origen', data).then(
            datos => {
                if (!datos.error) {
                    window.showModal(2)
                    setIsRedirect(true);
                } else {
                    setErrorApi(datos.error.toString());
                    // console.log(datos.error);
                    window.showModal(1)
                }
                window.showSpinner(false);
            }
        )
    }


    const componentFormularioDependencia = () => {

        return (
            <>
                <Spinner />
                <Formik
                    initialValues={{
                        nombre: '',
                        usuariojefe: '',
                        estado: '',
                        prefijo: ''
                    }
                    }
                    enableReinitialize
                    validate={(valores) => {

                        let errores = {}

                        if(getRepuestaNombre == false){
                            errores.nombre = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                        }
                        if (!getNombre) {
                            errores.nombre = "Debe ingresar un nombre";
                        }

                        if (!getEstado) {
                            errores.estado = "Debe ingresar un estado";
                        }

                        return errores
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        enviarDatos();
                    }}
                >
                    {({ errors }) => (
                        <Form>
                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="block block-themed">
                                        <div className="block-header">
                                            <h3 className="block-title">ADMINISTRACIÓN :: DEPENDENCIA</h3>
                                        </div>

                                        <div className="block-content">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor='nombre'>NOMBRE</label>
                                                        <Field value={getNombre} type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre"
                                                            onChange={handleInputChange} />
                                                        <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor='apellido'>JEFE DE LA DEPENDENCIA</label>
                                                        <Field as="select" value={getUsuarioJefe} onChange={handleInputChange} className="form-control" id="usuariojefe" name="usuariojefe" >
                                                            <option value="">Por favor seleccione</option>
                                                            {getRespuestaUsuarios ? selectUsuarios() : null}
                                                        </Field>
                                                        <ErrorMessage name="usuariojefe" component={() => (<span className="text-danger">{errors.usuariojefe}</span>)} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor='user'>Estado </label>
                                                        <Field as="select" value={getEstado} onChange={handleInputChange} className="form-control" id="estado" name="estado" >
                                                            <option value="">Por favor seleccione</option>
                                                            <option value="1">Activo</option>
                                                            <option value="0">Inactivo</option>
                                                        </Field>
                                                        <ErrorMessage name="estado" component={() => (<span className="text-danger">{errors.estado}</span>)} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor='prefijo'>Prefijo </label>
                                                        <Field value={getPrefijo} type="text" id="prefijo" name="prefijo" className="form-control" placeholder="Prefijo"
                                                            onChange={handleInputChange} />
                                                        {/* <ErrorMessage name="prefijo" component={() => (<span className="text-danger">{errors.prefijo}</span>)} /> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mt-3" >
                                                <div className="col-md-12">
                                                    <ErrorMessage name="accesos" component={() => (<span className="text-danger">{errors.accesos}</span>)} />
                                                </div>
                                                <div className="col-md-12">
                                                    <label>¿DÓNDE PUEDE APARECER ESTA DEPENDENCIA? </label>
                                                </div>
                                                <div className="col-md-12" style={{ 'height': '300px', 'overflow': 'scroll', 'display': 'block' }}>
                                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                        <thead>
                                                            <tr>
                                                                <th>SELECCIONAR</th>
                                                                <th>SOLO APARECERÁ EN</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getListaAccesosAsociados ? listarAccessoAsociados() : null}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="block-content block-content-full text-right">
                                            <button type="submit" className="btn btn-rounded btn-primary">
                                                 Registrar
                                            </button>
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

    return (

        <>
            {isRedirect ? redirectToRoutes() : null}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            <div className="col-md-12">
                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Dependencia`}><small>Lista de Dependencias</small></Link></li>
                            <li className="breadcrumb-item"> <small> Crear Dependencia</small></li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="col-md-12">
                {componentFormularioDependencia()}
            </div>
        </>
    )

}
export default DependenciaConfiguracionForm;