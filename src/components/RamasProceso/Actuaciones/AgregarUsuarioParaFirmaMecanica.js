import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import GenericApi from '../../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import { getUser } from '../../../components/Utils/Common';

function AgregarUsuarioParaFirmaMecanica() {

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getListaUsuarios, setListaUsuarios] = useState({ data: [], links: [], meta: [] });
    const [getUsuarioSeleccionado, setUsuarioSeleccionado] = useState();
    const [getTipoFirmaSeleccionada, setTipoFirmaSeleccionada] = useState();
    const [getTipoFirmas, setTipoFirmas] = useState({ data: {} });
    const location = useLocation()
    const { from, selected_id_etapa, id, nombre, estadoActualActuacion, titulo, valor, solicitante, tipoActuacion, actuacionIdMaestra } = location.state;
    const [getNombreProceso, setNombreProceso] = useState('');

    const [getRoutes, setRoutes] = useState({
        ver_detalle: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"
    });

    const mensajeTituloPantalla = "El usuario agregado recibirá una notificación por correo para que pueda revisar y firmar el documento";

    useEffect(() => {

        // Metodo principal
        async function fetchData() {

            // Se carga el nombre del proceso
            nombreProceso();
        }

        // Metodo principal
        fetchData();
    }, []);


    const nombreProceso = () => {

        // Se quita el cargando
        window.showSpinner(true);

        // Se inicializa la API
        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea los datos
                    setNombreProceso(datos.data.attributes.nombre);

                    // Se llama el metodo
                    cargarUsuariosDependencia();
                }
            }
        )
    }

    const cargarUsuariosDependencia = () => {

        // Se captura el id de la dependencia del usuario
        const iduserdependencia = getUser().id_dependencia;

        // Se consume la API
        GenericApi.getByIdGeneric("usuario/get-todos-usuarios-dependencia", iduserdependencia).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea la lista de usuarios
                    setListaUsuarios(datos);
                } else {

                    // Se setea el modal
                    setModalState({ title: getNombreProceso.toUpperCase() + " :: AGREGAR USUARIOS FIRMA MECANICA", message: datos.error.toString(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

                // Se carga el metodo de los tipos de firma
                allFirmas();
            }
        );
    }

    // Metodo encargado de traer la lista de tipos de firmas
    const allFirmas = () => {

        // Se inicializa la API
        GenericApi.getGeneric('mas-tipo-firma').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea la lista a la constante
                    setTipoFirmas(datos);
                }
            }
        )
    }

    // Metodo encargado de enviar los valores al backend
    const enviarDatos = (valores) => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializa el array con la informacion
        let data = {
            "data": {
                "type": "Agregar Usuario",
                "attributes": {
                    "id_actuacion": id,
                    "id_user": getUsuarioSeleccionado,
                    "tipo_firma": getTipoFirmaSeleccionada,
                    "uuid_proceso_disciplinario": from.procesoDisciplinarioId
                }
            }
        }

        // Se inicializa la variable del titulo y mensaje del modal
        const tituloModal = getNombreProceso + " :: Agregar usuario para firma";
        const mensajeModal = global.Constants.MENSAJES_MODAL.EXITOSO;

        // Se inicializa la API con su data
        GenericApi.addGeneric("actuaciones/agregar-usuario-para-firma-mecanica", data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error && datos.data) {

                    // Se muestra el show modal en caso de exito
                    setModalState(
                        {
                            title: tituloModal.toUpperCase(),
                            message: global.Constants.MENSAJES_MODAL.EXITOSO,
                            show: true, redirect: "/ActuacionesVer/" + id + "/" + selected_id_etapa + "/1",
                            from: {
                                from: from,
                                selected_id_etapa: selected_id_etapa,
                                id: id,
                                nombre: nombre,
                                estadoActualActuacion: estadoActualActuacion,
                                tipoActuacion: tipoActuacion,
                                actuacionIdMaestra: actuacionIdMaestra
                            },
                            alert: global.Constants.TIPO_ALERTA.EXITO
                        });
                } else {

                    // Se muestra el show modal en caso de error
                    setModalState({ title: tituloModal.toUpperCase(), message: 'REGISTRO FALLIDO: ' + datos.toUpperCase(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de asignar el valor del usuario seleccionado
    const selectChangelistarUsuarios = (e) => {

        // Se setea el valor enviado por parametros
        setUsuarioSeleccionado(e.target.value);
    }

    // Metodo encargado de asignar el valor del tipo de firma seleccionada
    const selectChangeTipoFirma = (e) => {

        // Se setea el valor enviado por parametros
        setTipoFirmaSeleccionada(e.target.value);
    }

    // Metodo encargado de listar los usuarios
    const selectUsuario = () => {

        // Se retorna
        return (

            // Se recorre el array de firmas
            getListaUsuarios.data.map((u, i) => {

                // Se valida que el estado este activo
                if (u.attributes.estado == 1) {

                    // Se retorna el valor
                    return (
                        <option key={u.id} value={u.id}>{u.attributes.nombre + " " + u.attributes.apellido + " (" + u.attributes.name + ")"}</option>
                    );
                }
            })
        );
    }

    // Metodo encargado de listar los tipos de firma
    const selectTipoFirmas = () => {

        // Se retorna
        return (

            // Se recorre el array de firmas
            getTipoFirmas.data.map((firma, i) => {

                // Se valida que el estado este activo
                if (firma.attributes.estado == 1) {

                    // Se retorna el valor
                    return (
                        <option key={firma.id} value={firma.id}>{firma.attributes.nombre}</option>
                    );
                }
            })
        );
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{

                }}
                enableReinitialize
                validate={(valores) => {

                }}
                onSubmit={(valores, { resetForm }) => {
                    enviarDatos(valores);
                }}
            >
                {({ errors }) => (
                    <Form>
                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>Actuaciones</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion }}><small>Actuación {nombre}</small></Link></li>
                                    <li className="breadcrumb-item"> <small>{tipoActuacion == 0 ? "Actuaciones" : (tipoActuacion == 1 ? 'Impedimentos' : 'Comisorio')} Aprobar/Rechazar</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso.toUpperCase()} :: {tipoActuacion == 0 ? "ACTUACIÓN" : (tipoActuacion == 1 ? 'IMPEDIMENTO' : 'COMISORIO')} :: {titulo.toUpperCase()} </h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="alert alert-warning" role="alert">
                                            {mensajeTituloPantalla.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="listarUsuarios">LISTA DE USUARIOS <span className="text-danger">*</span></label>
                                            <Field as="select" className="form-control" id="listarUsuarios" name="listarUsuarios" value={getUsuarioSeleccionado} onChange={selectChangelistarUsuarios}>
                                                <option value="">SELECCIONA</option>
                                                {getListaUsuarios.data.length > 0 ? selectUsuario() : null}
                                            </Field>
                                            <ErrorMessage name="listarUsuarios" component={() => (<span className="text-danger">{errors.listarUsuarios}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="listarTipoFirma">TIPO FIRMA <span className="text-danger">*</span></label>
                                            <Field as="select" className="form-control" id="listarTipoFirma" name="listarTipoFirma" value={getTipoFirmaSeleccionada} onChange={selectChangeTipoFirma}>
                                                <option value="">SELECCIONA</option>
                                                {getTipoFirmas.data.length >= 1 ? selectTipoFirmas() : null}
                                            </Field>
                                            <ErrorMessage name="listarTipoFirma" component={() => (<span className="text-danger">{errors.listarTipoFirma}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">ACEPTAR</button>
                                    <Link to={getRoutes.ver_detalle} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary" >CANCELAR</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default AgregarUsuarioParaFirmaMecanica;