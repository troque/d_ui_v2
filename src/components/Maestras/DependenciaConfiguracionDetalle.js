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
import { getUser } from '../Utils/Common';

function DependenciaConfiguracionDetalle() {

    const [errorApi, setErrorApi] = useState('');
    const [getNombre, setNombre] = useState('');
    const [getEstado, setEstado] = useState('');
    const [getPrefijo, setPrefijo] = useState('');
    const [getUsuarioJefe, setUsuarioJefe] = useState('');
    const [getListaUsuarios, setListaUsuarios] = useState({ data: {} });
    const [getRespuestaUsuarios, setRespuestaUsuarios] = useState(false);
    const [getListaAccesosAsociados, setListaAccesosAsociados] = useState(false);
    const [getTiposAccesos, setTiposAccesos] = useState({ data: {} });
    const [getAccesosAsociados, setAccesosAsociados] = useState([]);
    const [getDependenciasAsociadas, setDependenciasAsociadas] = useState([]);
    const [getPorcentajesAsociados, setPorcentajesAsociados] = useState([]);
    const [getDependenciaActuacion, setDependenciaActuacion] = useState([]);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getRepuestaNombre, setRepuestaNombre] = useState(true);
    const [getDependenciasLista, setDependenciasLista] = useState({ data: [] });
    const [getDependenciasListaBoolean, setDependenciasListaBoolean] = useState(false);

    let { id } = useParams();

    useEffect(() => {
        window.showSpinner(true);
        async function fetchData() {
            cargarUsuarios();
        }
        fetchData();
    }, []);

    const agregarCheck = (e, accesoId, posAccesoId) => {
        if (e == true) {
            setAccesosAsociados(oldArray => [...oldArray, accesoId]);
            setPorcentajesAsociados(oldArray => [...oldArray, 100]);
        }
        else {
            var index = getAccesosAsociados.indexOf(accesoId);
            if (index !== -1) {
                getAccesosAsociados.splice(index, 1);
                getPorcentajesAsociados.splice(index, 1);
            }
        }
        var temporalFilter = getTiposAccesos.data.filter((datos, i) => {
            if (i == posAccesoId) {
                return datos;
            }
        });

        temporalFilter[0].attributes.checked = !temporalFilter[0].attributes.checked;

        var validarElemento = document.getElementById('porcentaje_' + posAccesoId);

        if (getTiposAccesos.data[posAccesoId].attributes.checked == false && validarElemento) {
            document.getElementById('porcentaje_' + posAccesoId).style.display = 'none';
            //$(validarElemento).hide();
        }
        else if (validarElemento) {
            document.getElementById('porcentaje_' + posAccesoId).style.display = 'block';
            document.getElementById('porcentaje_' + posAccesoId).value = 100;
        }
    }

    const agregarCheckDependencia = (e, dependenciaId) => {
        if (e == true) {
            setDependenciasAsociadas(oldArray => [...oldArray, dependenciaId]);
        }
        else {
            var index = getDependenciasAsociadas.indexOf(dependenciaId);
            if (index !== -1) {
                getDependenciasAsociadas.splice(index, 1);
            }
        }
    }

    const agregarPorcentaje = (e, accesoId) => {
        if (e) {
            var index = getAccesosAsociados.indexOf(accesoId);
            var porcentajes = getPorcentajesAsociados;
            porcentajes[index] = e;
            setPorcentajesAsociados(porcentajes);
        }
    }

    const cargarDependencias = (estado) => {
        GenericApi.getAllGeneric('getMasDependenciaOrigen/'+estado).then(
            datos => {
                if (!datos.error) {
                    setDependenciasListaBoolean(true);
                    setDependenciasLista(datos);
                }
                else{
                    setDependenciasListaBoolean(false);
                    setModalState({ title: "LISTA DE DEPENDENCIAS :: ERROR", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
                }
                window.showSpinner(false);

            }
        )
    }

    const getDependenciaById = () => {

        GenericApi.getByIdGeneric('mas-dependencia-origen', id).then(
            datos => {
                // console.log(datos);
                if (!datos.error) {
                    if (datos["data"] != "") {
                        setNombre(datos["data"]["attributes"]["nombre"]);
                        setEstado(datos["data"]["attributes"]["estado"]);
                        setPrefijo(datos["data"]["attributes"]["prefijo"]);
                        setDependenciaActuacion(datos["data"]["attributes"]["dependenciaActuacion"]);
                        datos["data"]["attributes"]["dependenciaActuacion"].forEach(element => {
                            setDependenciasAsociadas(oldArray => [...oldArray, element.id_dependencia_destino]);
                        });

                        if (datos["data"]["attributes"]["id_usuario_jefe"]) {
                            setUsuarioJefe(datos["data"]["attributes"]["id_usuario_jefe"]);
                        }

                        if (datos["data"]["attributes"]["accesos"]) {
                            if (datos["data"]["attributes"]["accesos"]["porcentajes_asignados"]) {
                                datos["data"]["attributes"]["accesos"]["porcentajes_asignados"].split(',').map((porcentaje, i) => {
                                    setPorcentajesAsociados(oldArray => [...oldArray, porcentaje]);
                                });
                            }

                            if (datos["data"]["attributes"]["accesos"]["ids_accesos"]) {

                                let auxAccesosAsociados = [];

                                datos["data"]["attributes"]["accesos"]["ids_accesos"].split(',').map((acceso, i) => {
                                    //setAccesosAsociados(oldArray => [...oldArray, acceso]);
                                    auxAccesosAsociados[i] = acceso;
                                });
                                setAccesosAsociados(auxAccesosAsociados);
                                cargarAccesos(auxAccesosAsociados);
                            }
                            else {
                                cargarAccesos();
                            }
                        }
                        else {
                            cargarAccesos();
                        }

                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                        cargarAccesos();

                    }
                }
                else {
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                    cargarAccesos();
                }

            }
        )
    }

    const cargarAccesos = (accesos = null) => {
        GenericApi.getAllGeneric('mas-dependencia-accesos').then(
            datos => {
                // console.log(datos);
                if (!datos.error) {

                    datos.data.forEach(acceso => {
                        if (!accesos) {
                            acceso.attributes.checked = false;
                        }
                        else {
                            var datoEncontrado = accesos.find(dato => dato == acceso.id)
                            if (datoEncontrado) {
                                acceso.attributes.checked = true;
                            }
                            else {
                                acceso.attributes.checked = false;
                            }
                        }
                    });
                    cargarDependencias(1);

                    setTiposAccesos(datos);
                    setListaAccesosAsociados(true);
                }
                else {
                    setErrorApi(datos.error.toString());
                    window.showSpinner(false);
                }
            }
        )
    }

    const selectUsuarios = () => {
        return (
            getListaUsuarios.data.map((usuario, i) => {
                return (
                    <option key={usuario.id} value={usuario.id}>{usuario.attributes.nombre} {usuario.attributes.apellido} ({usuario.attributes.name})</option>
                )
            })
        )
    }

    const cargarUsuarios = () => {

        GenericApi.getByIdGeneric("usuario/get-todos-usuarios-dependencia", id).then(
            datos => {
                // console.log("usuario/get-todos-usuarios-dependencia -> ", datos);
                if (!datos.error) {
                    setListaUsuarios(datos);
                    setRespuestaUsuarios(true);
                }
                else {
                    window.showModal(1);
                }
                getDependenciaById();
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
            }else{
                setRepuestaNombre(false);
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
                    "porcentajes": getPorcentajesAsociados ? getPorcentajesAsociados : "",
                    "dependencia_actuaciones": getDependenciasAsociadas ? getDependenciasAsociadas : "",
                    "prefijo": getPrefijo ? getPrefijo : ""
                }
            }
        }

        // console.log(JSON.stringify(data));

        GenericApi.updateGeneric('mas-dependencia-origen', id, data).then(
            datos => {
                if (!datos.error) {
                    window.showSpinner(false);
                    setModalState({ title: "Dependencia :: Datos Actualizados con éxito", message: 'La información ha sido actualizada con éxito', show: true, redirect: '/Dependencia', alert: global.Constants.TIPO_ALERTA.EXITO });
                
                } else {
                    setErrorApi();
                    window.showSpinner(false);
                    setModalState({ title: "Dependencia :: Error", message: 'Ocurrió un error al guardar los cambios. '+datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                
            }
        )
    }

    const listarAccessoAsociados = () => {

        return (
            getTiposAccesos.data.map((acceso, i) => {
                return (
                    <tr key={(acceso.id + 1)}>
                        <td>
                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                <>
                                    {
                                        (getAccesosAsociados.length > 0) ? (
                                            (getAccesosAsociados.indexOf(acceso.id.toString()) > -1) ? (
                                                <>
                                                    <div>
                                                        <input defaultChecked={true} type="checkbox" onChange={e => agregarCheck(e.target.checked, acceso.id, i)} className="custom-control-input" id={acceso.id+"AA"} name={acceso.id+"AA"} />
                                                        <label className="custom-control-label" htmlFor={acceso.id+"AA"}></label>
                                                    </div>
                                                </>
                                            ) :
                                                <div>
                                                    <input type="checkbox" onChange={e => agregarCheck(e.target.checked, acceso.id, i)} className="custom-control-input" id={acceso.id+"AA"} name={acceso.id+"AA"} />
                                                    <label className="custom-control-label" htmlFor={acceso.id+"AA"}></label>
                                                </div>

                                        ) :
                                            <div>
                                                <input type="checkbox" onChange={e => agregarCheck(e.target.checked, acceso.id, i)} className="custom-control-input" id={acceso.id} name={acceso.id} />
                                                <label className="custom-control-label" htmlFor={acceso.id}></label>
                                            </div>
                                    }
                                </>
                            </div>
                        </td>
                        <td>
                            {acceso.attributes.nombre}
                        </td>
                        <td>
                            {
                                global.Constants.ACCESO_DEPENDENCIA.REMISION_QUEJA_COMISORIO_EJE == acceso.id && acceso.attributes.checked
                                    ?
                                    <input type="number" id={'porcentaje_' + i} name={'porcentaje_' + i} min='0' max='100' defaultValue={getPorcentajesAsociados[getAccesosAsociados.indexOf(acceso.id.toString())] || 100} className="form-control" onChange={e => agregarPorcentaje(e.target.value, acceso.id)} />
                                    :
                                    null
                            }
                        </td>
                    </tr>

                )
            })

        )

    }

    const listarDependencias = () => {
        return (
            getDependenciasLista.data.map((dependencia, i) => {
                if(dependencia.id !== id){
                    return (
                        <tr key={(dependencia.id + 1)}>
                            <td>
                                {dependencia.attributes.nombre}
                            </td>
                            <td>
                                <div className="custom-control custom-switch custom-control-lg mb-2">
                                    {
                                        <>                                    
                                            <input defaultChecked={getDependenciaActuacion.find(dato => dato.id_dependencia_destino === dependencia.id)} type="checkbox" onChange={e => agregarCheckDependencia(e.target.checked, dependencia.id, i)} className="custom-control-input" id={dependencia.id+"D"} name={dependencia.id+"D"} />
                                            <label className="custom-control-label" htmlFor={dependencia.id+"D"}></label>
                                        </>
                                    }
                                </div>
                            </td>
                        </tr>
                    )
                }
            })
        )
    }


    const componentFormularioDependencia = () => {

        return (
            <>
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
                            errores.nombre = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        if (!getEstado) {
                            errores.estado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
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
                            <div className='row'>
                                <div className="col-md-12">
                                    <li className="nav-main-item open" style={{ padding: 0, margin: 0 }}>
                                        <a className="nav-main-link nav-main-link-submenu acordeon-pantalla" data-toggle="submenu" aria-haspopup="true" aria-expanded="false">
                                            <div className="block-header">
                                                <h3 className="block-title">ADMINISTRACIÓN :: DEPENDENCIA</h3>
                                            </div>
                                        </a>
                                        <ul className="nav-main-submenu acordeon-pantalla-espacio">
                                            { componentDependencia(errors) }
                                        </ul>
                                    </li>
                                    <li className="nav-main-item" style={{ padding: 0, margin: 0 }}>
                                        <a className="nav-main-link nav-main-link-submenu acordeon-pantalla" data-toggle="submenu" aria-haspopup="true" aria-expanded="false">
                                            <div className="block-header">
                                                <h3 className="block-title">ADMINISTRACIÓN :: DEPENDENCIA - ACTUACIÓN</h3>
                                            </div>
                                        </a>
                                        <ul className="nav-main-submenu acordeon-pantalla-espacio">
                                            { componentDependenciaActuacion() }
                                        </ul>
                                    </li>
                                </div>
                            
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="submit" className="btn btn-rounded btn-primary">
                                        {global.Constants.BOTON_NOMBRE.ACTUALIZAR}
                                    </button>
                                    <Link to={'/Dependencia'} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                </div>
                            </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        )
    }

    const componentDependenciaActuacion = () => {

        return (
            <div className="block block-themed">

                <div className="row text-right w2d-enter">
                    <div className="col-md-12">
                        <Link to={'/Dependencia'} title='Regresar'>
                            <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                        </Link>                                            
                    </div>
                </div>

                <div className="block-content">
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                <thead>
                                    <tr>
                                        <th width="70%">DEPENDENCIA</th>
                                        <th width="30%">PUEDE ENVIAR</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    { getDependenciasListaBoolean ? listarDependencias() : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const componentDependencia = (errors) => {
        return (               
            <div className="block-content">
                <div className="row text-right w2d-enter">
                    <div className="col-md-12">
                        <Link to={'/Dependencia'} title='Regresar'>
                            <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                        </Link>                                            
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor='nombre'>NOMBRE<span className="text-danger">*</span></label>
                            <Field value={getNombre} type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre"
                                onChange={handleInputChange} />
                            <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor='apellido'>JEFE DE LA DEPENDENCIA<span className="text-danger">*</span></label>
                            <Field as="select" value={getUsuarioJefe} onChange={handleInputChange} className="form-control" id="usuariojefe" name="usuariojefe" >
                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                {getRespuestaUsuarios ? selectUsuarios() : null}
                            </Field>
                            <ErrorMessage name="usuariojefe" component={() => (<span className="text-danger">{errors.usuariojefe}</span>)} />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor='user'>ESTADO<span className="text-danger">*</span></label>
                            <Field as="select" value={getEstado} onChange={handleInputChange} className="form-control" id="estado" name="estado" >
                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                <option value="1">ACTIVO</option>
                                <option value="0">INACTIVO</option>
                            </Field>
                            <ErrorMessage name="estado" component={() => (<span className="text-danger">{errors.estado}</span>)} />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor='prefijo'>PREFIJO</label>
                            <Field value={getPrefijo} type="text" id="prefijo" name="prefijo" className="form-control" placeholder="Prefijo"
                                onChange={handleInputChange} />
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

                    <div className="col-md-12">
                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                            <thead>
                                <tr>
                                    <th width="8%">SELECCIONAR</th>
                                    <th width="22%">SOLO APARECERA</th>
                                    <th width="50%">PORCENTAJE DE ASIGNACIÓN</th>
                                </tr>
                            </thead>
                            <tbody >
                                { getListaAccesosAsociados ? listarAccessoAsociados() : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    return (

        <>
            <Spinner />
            {<ModalGen data={getModalState} />}
            <div className="col-md-12">
                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Dependencia`}><small>Lista de Dependencias</small></Link></li>
                            <li className="breadcrumb-item"> <small> actualizar dependencia</small></li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="col-md-12">
                { componentFormularioDependencia() }
            </div>
        </>
    )

}
export default DependenciaConfiguracionDetalle;