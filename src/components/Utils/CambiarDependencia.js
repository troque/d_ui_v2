import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from './Spinner';
import GenericApi from '../Api/Services/GenericApi';
import { getUser } from './Common';
import ModalGen from './Modals/ModalGeneric';
import { Link } from "react-router-dom";

function CambiarDependencia(props) {

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

    const [getListaDependenciaDestino, setListaDependenciaDestino] = useState({ data: {} });
    const [getRespuestaDependenciaDestino, setRespuestaDependenciaDestino] = useState(false);
    const location = useLocation();
    const { from } = location.state;

    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    //Funcion principal
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            obtenerParametros();

            //en la tabla MAS_DEPENDENCIA_ACCESO el 1 corresponde a remitir proceso
            GenericApi.getGeneric('dependencias-eje-disciplinario').then(
                //GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.REMITIR_PROCESO).then(
                datos => !datos.error ? (setListaDependenciaDestino(datos), setRespuestaDependenciaDestino(true), window.showSpinner(false)) : window.showModal(1)
            )
            obtenerParametros();

        }
        fetchData();
    }, []);

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
        const iduserdependencia = getUser().id_dependencia;

        if (getDependenciaSeleccionada == getUser()["id_dependencia"])
            setModalState({ title: "SINPROC No " + from.radicado + " :: ENVIAR A OTRA DEPENDENCIA", message: 'SU USUARIO ESTÁ CONFIGURADO COMO JEFE DE LA DEPENDENCIA', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });

        window.showSpinner(true);
        let data;

        if (props.getParametros.proceso === 'transaccion') {
            data = {
                "data": {
                    "type": "transacciones",
                    "attributes": {
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_dependencia_origen": iduserdependencia,
                        "usuario_a_remitir": getUsuarioSleccionado,
                        "descripcion_a_remitir": valores.informacion,
                        "id_etapa": 3
                    }
                }
            }
            GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: "SINPROC No " + from.radicado + " :: ENVIAR A OTRA DEPENDENCIA", message: 'EL PROCESO ' + from.radicado + ' FUE ASIGNADO AL USUARIO ' + getUsuarioSleccionado + ' de la dependencia: ' + getDependenciaDestino + '', show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else {
                        setModalState({ title: "SINPROC No " + from.radicado + " :: ENVIAR A OTRA DEPENDENCIA", message: datos.error.toString(), show: true, redirect: '/RamasAntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        }

        else if (props.getParametros.proceso === 'requerimiento_juzgado') {

            // console.log("DENTRO DE REQUERIMIENTO JUZGADO")

            data = {
                "data": {
                    "type": "requerimiento_juzgado",
                    "attributes": {
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_dependencia_origen": iduserdependencia,
                        "id_dependencia_destino": getDependenciaSeleccionada,
                        "id_funcionario_asignado": getUsuarioSleccionado,
                        "enviar_otra_dependencia": true,
                        "descripcion": valores.informacion,
                    }
                }
            }

            GenericApi.addGeneric('requerimiento-juzgado', data).then(
                datos => {
                    if (!datos.error) {
                        setModalState({ title: "SINPROC No " + from.radicado + " :: Requerimiento Juzgado", message: 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + datos.data.attributes.funcionario_asignado.nombre + ' ' + datos.data.attributes.funcionario_asignado.apellido + ' de la dependencia: ' + getDependenciaDestino + '', show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else {
                        setModalState({ title: "SINPROC No " + from.radicado + " :: Requerimiento Juzgado", message: datos.error.toString(), show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
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
                    }

                }
            })
            setTextoTitulo("EL EXPEDIENTE SERÁ ENVIADO AL JEFE DE LA DEPENDENCIA:");
        }
    }

    const selectDependenciaDestino = () => {
        return (
            getListaDependenciaDestino.data.map((dependencia, i) => {
                if (dependencia.id != getUser()["id_dependencia"]) {
                    return (
                        <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
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
                            <option key={usuario.id} value={usuario.attributes.name}>{usuario.attributes.nombre} ({usuario.attributes.name})</option>
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

    const cargarUsuarioJefe = () => {
        const idUusario = getListaDependenciaDestino.data.find((element) => {
            return element.id === getDependenciaSeleccionada;
        })
        if (idUusario != undefined) {
            if (idUusario.attributes.nombre_usuario_jefe) {
                return (
                    <tr>
                        <td className='bg-success text-white'>
                            <strong>{idUusario.attributes.nombre_usuario_jefe}</strong>
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


                        <div className="row">

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="dependenciaDestino">SELECCIONE LA DEPENDENCIA DESTINO<span className="text-danger">*</span></label>
                                    <Field as="select" className="form-control" id="dependenciaDestino" name="dependenciaDestino" value={getDependenciaSeleccionada} onChange={selectChangeDependencia}>
                                        <option value="">Por favor seleccione</option>
                                        {getRespuestaDependenciaDestino ? selectDependenciaDestino() : null}
                                    </Field>
                                    <ErrorMessage name="dependenciaDestino" component={() => (<span className="text-danger">{errors.dependenciaDestino}</span>)} />
                                </div>
                            </div>

                            {
                                (!getEnviaaJefe && getDependenciaSeleccionada != '') ? (


                                    <div className="col-md-12">
                                        <label>{getTextoTitulo}</label><br />

                                        <div className="form-group">
                                            <Field value={getUsuarioSleccionado} onChange={handleInputChange} as="select" className="form-control" id="usuario" name="usuario">
                                                <option value="">Por favor seleccione</option>
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
                                                {cargarUsuarioJefe()}
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
                                    <label htmlFor="informacion">{props.name_txt_descripcion}<span className="text-danger">*</span></label>
                                    <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder={props.name_txt_descripcion}
                                        maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                    <div className="text-right">
                                        <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                    </div>
                                    <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                </div>
                            </div>

                        </div>
                        <div className="block-content block-content-full text-right">
                            <button type="submit" className="btn btn-rounded btn-primary" >{props.name_boton}</button>
                            <Link to={'/Transacciones'} state={{ from: from }} className="font-size-h5 font-w600" >
                                <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                            </Link>
                        </div>

                    </Form>
                )}
            </Formik>
        </>


    );


}

export default CambiarDependencia;