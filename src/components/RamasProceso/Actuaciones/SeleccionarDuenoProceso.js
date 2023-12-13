import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';
import { getUser } from '../../Utils/Common';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { Link } from "react-router-dom";
import '../../Utils/Constants';

function SeleccionarDuenoProceso() {

    const [getUsuarioSleccionado, setUsuarioSleccionado] = useState("");
    const [getListaUusariosDependencia, setListaUusariosDependencia] = useState({ data: [], links: [], meta: [] });

    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getDependenciaSeleccionada, setDependenciaSeleccionada] = useState("");
    const [getTextoTitulo, setTextoTitulo] = useState('');
    const [getDependenciaDestino, setDependenciaDestino] = useState('');
    const [getEnviaaJefe, setEnviaaJefe] = useState(false);

    const [getUsuarioNombre, setUsuarioNombre] = useState("");
    const [getUsuarioApellido, setUsuarioApellido] = useState("");
    const [getUsuarioName, setUsuarioName] = useState("");
    const [getUsuarioDependenciaNombre, setUsuarioDependenciaNombre] = useState("");

    const [getListaDependenciaDestino, setListaDependenciaDestino] = useState({ data: {} });
    const [getRespuestaDependenciaDestino, setRespuestaDependenciaDestino] = useState(false);
    const location = useLocation();
    const { from, selected_id_etapa, id, nombre, estadoActualActuacion, tipoActuacion, id_dependencia_duena } = location.state;

    let procesoDisciplinarioId = from.procesoDisciplinarioId;


    //Funcion principal
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            obtenerParametros();

            //en la tabla MAS_DEPENDENCIA_ACCESO el 1 corresponde a remitir proceso
            cargarDependencias();
            obtenerParametros();

        }
        fetchData();
    }, []);

    function cargarDependencias() {
        GenericApi.getGeneric('dependencias-eje-disciplinario').then(
            datos => {
                if (!datos.error) {
                    setListaDependenciaDestino(datos);
                    setRespuestaDependenciaDestino(true);
                }
                else {
                    window.showModal(1);
                }
                window.showSpinner(false);
            }
        );
    }

    // Funcion que nos ayuda a ver si existen caracteres especiales en el textarea de -Informacion para su remisión-
    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    // consultamos la cantidad maxima de caracteres para el textarea
    const obtenerParametros = () => {
        try {
            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            //buscamos el parametro
            GenericApi.getByDataGeneric('parametro/parametro-nombre', data).then(
                datos => {
                    if (!datos.error) {
                        if (datos["data"].length > 0) {
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ));
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ));
                        }
                    } else {
                        window.showModal(1);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const enviarDatos = (valores) => {

        window.showSpinner(true);

        let prueba = {
            "data": {
                "type": "prueba",
                "attributes": {
                    "id_proceso_disciplinario": ""
                }
            }
        }

        GenericApi.addGeneric('proceso-diciplinario/id-dependencia-duena/' + getDependenciaSeleccionada + '/' + procesoDisciplinarioId, prueba).then(
            datos => {
                if (!datos.error) {
                    window.showSpinner(false);
                    if (selected_id_etapa && id && nombre && estadoActualActuacion && tipoActuacion) {
                        setModalState({ title: "SINPROC N° " + from.radicado + " :: SELECCIONAR DEPENDENCIA DUEÑA DEL PROCESO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: "/Transacciones", from: { from: from, selected_id_etapa: selected_id_etapa, id_actuacion: id }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    } else {
                        setModalState({ title: "SINPROC N° " + from.radicado + " :: SELECCIONAR DEPENDENCIA DUEÑA DEL PROCESO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: "/Transacciones", from: { from: from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                } else {
                    window.showSpinner(false);
                    if (selected_id_etapa && id && nombre && estadoActualActuacion && tipoActuacion) {
                        setModalState({ title: "SINPROC N° " + from.radicado + " :: SELECCIONAR DEPENDENCIA DUEÑA DEL PROCESO", message: 'OCURRIO UN ERROR', show: true, redirect: "/SeleccionarDuenoProceso", from: { from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: from.actuacionIdMaestra }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    } else {
                        setModalState({ title: "SINPROC N° " + from.radicado + " :: SELECCIONAR DEPENDENCIA DUEÑA DEL PROCESO", message: 'OCURRIO UN ERROR', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            }
        );

        let estadoActuacion = 0;
        if (estadoActualActuacion == "Aprobada") {
            estadoActuacion = 1;
        } else if (estadoActualActuacion == "Rechazada") {
            estadoActuacion = 2;
        } else if (estadoActualActuacion == "Pendiente aprobación") {
            estadoActuacion = 3;
        } else if (estadoActualActuacion == "Solicitud inactivación") {
            estadoActuacion = 4;
        } else if (estadoActualActuacion == "Aprobada y pdf definitivo") {
            estadoActuacion = 5;
        } else if (estadoActualActuacion == "Actualización del Documento") {
            estadoActuacion = 6;
        } else if (estadoActualActuacion == "Solicitud inactivación aceptada") {
            estadoActuacion = 7;
        } else if (estadoActualActuacion == "Solicitud inactivación rechazada") {
            estadoActuacion = 8;
        } else if (estadoActualActuacion == "Documento firmado") {
            estadoActuacion = 9;
        }

        if(id){
            let traza = {
                "data": {
                    "type": "trazabilidad-actuaciones",
                    "attributes": {
                        "uuid_actuacion": id,
                        "id_estado_actuacion": estadoActuacion,
                        "observacion": valores.informacion,
                        "estado": 1,
                        "envia_correo": 1,
                        "id_proceso_disciplinario": procesoDisciplinarioId
                    }
                }
            }
            GenericApi.addGeneric('trazabilidad-actuaciones', traza)
        }

    }

    const selectChangeDependencia = (e) => {
        if (e.target.value === "") return;
        setDependenciaDestino("");
        setUsuarioSleccionado("");


        const idUusario = getListaDependenciaDestino.data.find((element) => {
            return element.id === e.target.value;
        })
        if (idUusario) {
            if (idUusario.attributes.nombre) {
                setDependenciaDestino(idUusario.attributes.nombre);
            }
        }


        setDependenciaSeleccionada(e.target.value);
        setListaUusariosDependencia({ data: [], links: [], meta: [] });
        if (e.target.value == getUser()["id_dependencia"]) {
            setEnviaaJefe(false);
            setTextoTitulo("Seleccione el usuario al cual desea remitir el proceso");
        }
        else {
            setEnviaaJefe(true);
            getListaDependenciaDestino.data.find((element) => {
                if (element.id === e.target.value) {
                    if (element.attributes.nombre_solo_usuario_jefe) {
                        // console.log(element.attributes.nombre_solo_usuario_jefe);
                        setUsuarioSleccionado(element.attributes.nombre_solo_usuario_jefe);
                        datosDelUsuarioARemitir(element.attributes.nombre_solo_usuario_jefe);
                    }

                }
            })
            setTextoTitulo("EL PROCESO DISCIPLINARIO SERÁ ENVIADO AL JEFE DE LA DEPENDENCIA: ");
        }
    }

    const datosDelUsuarioARemitir = (name) => {


        GenericApi.getGeneric('usuario/get-usuario-por-name/' + name).then(
            datos => {
                if (!datos.error) {
                    // console.log(datos);
                    setUsuarioNombre(datos.data[0].attributes.nombre);
                    setUsuarioApellido(datos.data[0].attributes.apellido);
                    setUsuarioName(datos.data[0].attributes.name);
                    setUsuarioDependenciaNombre(datos.data[0].attributes.dependencia.nombre);
                }
                else {

                }
            }
        )
    }

    const selectDependenciaDestino = () => {
        return (
            getListaDependenciaDestino.data.map((dependencia, i) => {
                if (dependencia.id != getUser()["id_dependencia"] && id_dependencia_duena != dependencia.id) {
                    return (
                        <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre.toUpperCase()}</option>
                    )
                }
            })
        )
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "usuario") {
            setUsuarioSleccionado(value);
        }
    }

    const listaUsuariosDependencia = () => {
        return (
            getListaUusariosDependencia.data.map((usuario, i) => {
                if (usuario.attributes.reparto_habilitado) {

                    if (usuario.attributes.reparto_habilitado !== "0") {
                        return (
                            <option key={usuario.id} value={usuario.attributes.name}>{usuario.attributes.nombre.toUpperCase()} ({usuario.attributes.name.toUpperCase()})</option>
                        )
                    }

                }
                else {
                    let usuarioActual = (getUser() != null) ? (getUser().nombre) : "SIN ESPECIFICAR"

                    if (usuarioActual != usuario.attributes.name) {
                        return (

                            <option key={usuario.id} value={usuario.attributes.name}>{usuario.attributes.nombre} ({usuario.attributes.name})</option>
                        )
                    }

                }

            })
        )
    }

    const cargarUsuuarioJefe = () => {
        const idUusario = getListaDependenciaDestino.data.find((element) => {
            return element.id === getDependenciaSeleccionada;
        })
        if (idUusario != undefined) {
            if (idUusario.attributes.nombre_usuario_jefe) {
                return (
                    <tr>
                        <td className='bg-success text-white'>
                            <strong>{idUusario.attributes.nombre_jefe.toUpperCase()}</strong>
                        </td>
                    </tr>
                )
            }
            else {
                return (
                    <tr><td className='bg-warning text-dark'><div ><strong>LA DEPENDENCIA NO CUENTA CON JEFE ENCARGADO</strong></div></td></tr>
                )
            }
        }
        else {
            return (
                <tr><td className='bg-warning text-dark'><div ><strong>LA DEPENDENCIA NO CUENTA CON JEFE ENCARGADO</strong></div></td></tr>
            )
        }
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: '',
                    dependenciaDestino: '',
                    usuario: '',
                }}
                enableReinitialize
                validate={(valores) => {
                    setCountTextArea(valores.informacion.length)
                    let errores = {}
                    if (!getDependenciaSeleccionada)
                        errores.dependenciaDestino = 'Debe seleccionar una dependencia';

                    if (getUsuarioSleccionado == undefined || getUsuarioSleccionado == "")
                        errores.usuario = 'La dependencia seleccionada no tiene un jefe asignado';

                    if (!valores.informacion) {
                        errores.informacion = 'Debe ingresar un valor';
                    }
                    else if (valores.informacion.length <= getMinimoTextArea) {
                        errores.informacion = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres';
                    }
                    if (valores.informacion) {
                        if (containsSpecialChars(valores.informacion))
                            errores.informacion = 'Tiene caracteres inválidos';
                    }

                    return errores;
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Asignar dependencia dueña del proceso</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">SINPROC NO {from.radicado.toUpperCase()} <strong> VIGENCIA: {from.vigencia.toUpperCase()} :: ASIGNAR DEPENDENCIA DUEÑA DEL PROCESO</strong></h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="dependenciaDestino">SELECCIONE LA DEPENDENCIA <span className="text-danger">*</span></label>
                                            <Field as="select" className="form-control" id="dependenciaDestino" name="dependenciaDestino" value={getDependenciaSeleccionada} onChange={selectChangeDependencia}>
                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                {getRespuestaDependenciaDestino ? selectDependenciaDestino() : null}
                                            </Field>
                                            <ErrorMessage name="dependenciaDestino" component={() => (<span className="text-danger">{errors.dependenciaDestino.toUpperCase()}</span>)} />
                                        </div>
                                    </div>
                                    {
                                        (!getEnviaaJefe && getDependenciaSeleccionada != '') ? (
                                            <div className="col-md-12">
                                                <label>{getTextoTitulo}</label><br />
                                                <div className="form-group">
                                                    <Field value={getUsuarioSleccionado} onChange={handleInputChange} as="select" className="form-control" id="usuario" name="usuario">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {listaUsuariosDependencia()}
                                                    </Field>
                                                    <ErrorMessage name="usuario" component={() => (<span className="text-danger">{errors.usuario}</span>)} />
                                                </div>
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                    <thead className='bg-primary text-white'>
                                                        <tr>
                                                            <th>DEPENDENCIA ORIGEN</th>
                                                            <th>DEPENDENCIA DESTINO</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                {
                                                                    (getUser().nombre_dependencia != null) ? (getUser().nombre_dependencia.nombre) : "SIN ESPECIFICAR"
                                                                }
                                                            </td>
                                                            <td>
                                                                {getDependenciaDestino ? getDependenciaDestino : "SIN ESPECIFICAR"}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : null
                                    }
                                    {
                                        (getEnviaaJefe && getDependenciaSeleccionada != '') ? (
                                            <div className="col-md-12">
                                                <label>{getTextoTitulo}</label><br />
                                                <ErrorMessage name="usuario" component={() => (<span className="text-danger">{errors.usuario}</span>)} />
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                    <tbody>
                                                        {cargarUsuuarioJefe()}
                                                    </tbody>
                                                </table>
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                    <thead>
                                                        <tr>
                                                            <th>DEPENDENCIA ORIGEN</th>
                                                            <th>DEPENDENCIA DESTINO</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                {
                                                                    (getUser().nombre_dependencia != null) ? (getUser().nombre_dependencia.nombre) : "SIN ESPECIFICAR"
                                                                }
                                                            </td>
                                                            <td>
                                                                {getDependenciaDestino ? getDependenciaDestino : "SIN ESPECIFICAR"}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : null
                                    }
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="informacion">OBSERVACIONES <span className="text-danger">*</span></label>
                                            <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder="Información para su remisión...."
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary" >ASIGNAR</button>
                                    {selected_id_etapa && id && nombre && estadoActualActuacion && tipoActuacion ?
                                        <Link to={"/ActuacionesVer/" + procesoDisciplinarioId + "/" + selected_id_etapa + "/1"} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion }} className="font-size-h5 font-w600" >
                                            <button type="button" className="btn btn-rounded btn-outline-primary" >CANCELAR</button>
                                        </Link>
                                        :
                                        <Link to={"/RamasProceso"} state={{ from: from }} className="font-size-h5 font-w600" >
                                            <button type="button" className="btn btn-rounded btn-outline-primary" >CANCELAR</button>
                                        </Link>
                                    }
                                </div>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>


    );


}

export default SeleccionarDuenoProceso;