import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';
import { getUser } from '../../Utils/Common';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { Link } from "react-router-dom";

function EnviaraAlguienDeSecretariaComunAleatorio() {

    const [getUsuarioSleccionado, setUsuarioSleccionado] = useState("");
    const [getListaUusariosDependencia, setListaUusariosDependencia] = useState({ data: {} });
    const [getUsuarioNombre, setUsuarioNombre] = useState("");
    const [getUsuarioApellido, setUsuarioApellido] = useState("");
    const [getUsuarioName, setUsuarioName] = useState("");
    const [getUsuarioDependenciaNombre, setUsuarioDependenciaNombre] = useState("");
    const [getUsuarioGruposTrabajo, setUsuarioGruposTrabajo] = useState([]);
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getIdGrupoTrabajo, setIdGrupoTrabajo] = useState('');
    const [respuestaGrupoTrabajo, setRespuestaGrupoTrabajo] = useState(false);
    const [respuestaUsuariosGrupoTrabajo, setRespuestaUsuariosGrupoTrabajo] = useState(false);
    const [listaGruposTrabajo, setListaGruposTrabajo] = useState({ data: {} });
    const [getNombreProceso, setNombreProceso] = useState('');
    const [respuestaUsuarioAleatorio, setRespuestaUsuarioAleatorio] = useState(false);
    const [getUsuarioAleatorio, setUsuarioAleatorio] = useState();
    const [getExisteUsuarioValido, setExisteUsuarioValido] = useState(false);
    const [getListaSemaforosActivosSecretaria, setListaSemaforosActivosSecretaria] = useState([]);

    const location = useLocation();
    const { from } = location.state;

    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    
    let numeroLlamadosFinalizar = 0;
    let numeroTotalLlamadosFinalizar = 1;

    /**
     * Funcion principal
     */
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();
        }
        fetchData();
    }, []);

    // Funcion para validar y detener el spinner
    const validacionSpinnerFinalizar = () => {
        numeroLlamadosFinalizar++
        if(numeroLlamadosFinalizar >= numeroTotalLlamadosFinalizar){
            window.showSpinner(false);
            const tituloModal = getNombreProceso + " :: Enviar a alguien de secretaria común dirigidamente";
            const mensajeModal = 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + getUsuarioNombre + ' ' + getUsuarioApellido + ' (' + getUsuarioName + ')  de la dependencia: ' + getUsuarioDependenciaNombre + '';
            setModalState({ title: tituloModal.toUpperCase(), message: mensajeModal.toUpperCase(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
        }
    }


    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    obtenerParametros();
                    cargarGruposDeTrabajo();
                    obtenerSemaforosProcesoDisciplinario()
                }
            }
        )
    }

    const cargarGruposDeTrabajo = () => {
        GenericApi.getGeneric("mas_grupo_trabajo").then(
            datos => {
                if (!datos.error) {
                    setRespuestaGrupoTrabajo(true);
                    setListaGruposTrabajo(datos);
                }
                window.showSpinner(false);
            }
        )
    }

    const obtenerSemaforosProcesoDisciplinario = () => {

        GenericApi.getAllGeneric("semaforo/get-semaforo-proceso-disciplinario/"+global.Constants.SEMAFORO_EVENTOS.EVENTO_SECRETARIA_COMUN+"/"+procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaSemaforosActivosSecretaria(datos)
                }
                window.showSpinner(false);
            }
        )

    }

    const selectGrupoTrabajo = () => {
        if (listaGruposTrabajo.data.length >= 1) {
            return (
                listaGruposTrabajo.data.map((grupoTrabajo, i) => {
                    return (
                        <option key={grupoTrabajo.id} value={grupoTrabajo.id}>{grupoTrabajo.attributes.nombre}</option>
                    )
                })
            )
        }
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


    const enviarDatos = (valores) => {
        const iduserdependencia = getUser().id_dependencia;
        window.showSpinner(true);
        let data;
        data = {
            "data": {
                "type": "transacciones",
                "attributes": {

                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_dependencia_origen": iduserdependencia,
                    "usuario_a_remitir": getUsuarioAleatorio.nombre_funcionario,
                    "descripcion_a_remitir": valores.informacion,
                    "id_etapa": 3
                }
            }
        }

        //Finalizando semaforo        
        GenericApi.getByIdGeneric('get-semaforo-evento', 4).then(
            datosSemaforoFinaliza => {
                if (datosSemaforoFinaliza.data.length >= 1) {
                    datosSemaforoFinaliza.data.forEach(element => {
                        if(getListaSemaforosActivosSecretaria.some(dato => dato.id == element.id) && element.attributes.id_mas_grupo_trabajo_inicia.id.toString() !== getIdGrupoTrabajo.toString()){
                            let data = {
                                "data": {
                                    "type": "semaforo",
                                    "attributes": {
                                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                        "id_semaforo": element.id,
                                        "id_actuacion_finaliza": null,
                                        "id_dependencia_finaliza": null,
                                        "id_usuario_finaliza": getUsuarioAleatorio.id_funcionario
                                    }
                                }
                            }    
                            GenericApi.getByDataGeneric('set-finaliza-semaforo', data);
                        }
                    });
                }
            }
        )

        const tituloModal = getNombreProceso.toUpperCase() + " :: Enviar a alguien de secretaria común aleatoriamente";
        const mensajeModal = 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + getUsuarioNombre + ' ' + getUsuarioApellido + ' (' + getUsuarioName + ')  de la dependencia: ' + getUsuarioDependenciaNombre + '';

        GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(
            datos => {
                if (!datos.error) {

                    validacionSpinnerFinalizar()

                    GenericApi.getByIdGeneric('get-semaforo-evento', 4).then(
                        datosSemaforo => {

                            numeroTotalLlamadosFinalizar++
                            validacionSpinnerFinalizar()

                            if (!datosSemaforo.error) {

                                datosSemaforo.data.forEach((element, index) => {
                                    if (element.attributes.id_mas_evento_inicio.id == 4) {
                                        if (!getListaSemaforosActivosSecretaria.some(objeto => objeto.id.toString() === element.id.toString())) {
                                            if(element.attributes.id_mas_grupo_trabajo_inicia.id.toString() == getIdGrupoTrabajo.toString()){
                                                let date = new Date();
                                                let datapdxsemaforo = {
                                                    "data": {
                                                        "type": "pdxsemaforo",
                                                        "attributes": {
                                                            "id_semaforo": element.id,
                                                            "id_proceso_disciplinario": procesoDisciplinarioId,
                                                            "id_actuacion": "",
                                                            "fecha_inicio": date.toLocaleDateString('zh-Hans-CN'),
                                                            "estado": 1,
                                                        }
                                                    }
                                                }

                                                numeroTotalLlamadosFinalizar++

                                                GenericApi.getByDataGeneric('pdxsemaforo', datapdxsemaforo).then(
                                                    datosSemaforo => {
                                                        numeroTotalLlamadosFinalizar++
                                                        validacionSpinnerFinalizar()                                                        
                                                    }
                                                )
                                            }
                                        }
                                    }
                                });
                            } else {
                                setModalState({ title: tituloModal.toUpperCase(), message: "HA OCURRIDO UN ERROR CON LA SEMAFORIZACIÓN", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                            }
                        }
                    )
                } else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )

        /*GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(
            datos => {
                if (!datos.error) {
                    GenericApi.getByIdGeneric('get-semaforo-evento', 4).then(
                        datosSemaforo => {
                            if (!datosSemaforo.error) {
                                datosSemaforo.data.forEach(element => {
                                    if (element.attributes.id_mas_evento_inicio.id == 4) {
                                        if (element.attributes.id_mas_grupo_trabajo_inicia.id == getIdGrupoTrabajo) {
                                            let date = new Date();
                                            let datapdxsemaforo = {
                                                "data": {
                                                    "type": "pdxsemaforo",
                                                    "attributes": {
                                                        "id_semaforo": element.id,
                                                        "id_proceso_disciplinario": procesoDisciplinarioId,
                                                        "id_actuacion": "",
                                                        "fecha_inicio": date.toLocaleDateString('zh-Hans-CN'),
                                                        "estado": 1,
                                                    }
                                                }
                                            }
                                            GenericApi.addGeneric('pdxsemaforo', datapdxsemaforo)
                                        }
                                    }
                                });
                            } else {
                                setModalState({ title: tituiloModal.toUpperCase(), message: "HA OCURRIDO UN ERROR CON LA SEMAFORIZACIÓN", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                            }
                        }
                    )
                    setModalState({ title: tituiloModal.toUpperCase(), message: mensajeModal.toUpperCase(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: tituiloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )*/
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "grupoTrabajo") {
            setIdGrupoTrabajo(value);
            cargarUsuariosPorGrupo(value);
            cargarUsuarioAleatorio(value);
        }
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
            GenericApi.getByDataGeneric('parametro/parametro-nombre', data).then(
                datos => {
                    if (!datos.error) {
                        if (datos["data"].length > 0) {
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ))
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ))
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

    const cargarUsuariosPorGrupo = (idGrupo) => {
        window.showSpinner(true);
        const tituloModal = getNombreProceso + " :: Enviar a alguien de mi dependencia";
        GenericApi.getAllGeneric("usuario/get-usuarios-grupotrabajo/"+idGrupo+"/"+procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setRespuestaUsuariosGrupoTrabajo(true);
                    setListaUusariosDependencia(datos);
                    window.showSpinner(false);
                } else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        );
    }

    const cargarUsuarioAleatorio = (idGrupo) => {
        window.showSpinner(true);
        const tituloModal = "SINPROC No " + from.radicado + " :: Enviar a alguien de secretaria común";
        const mensajeModal = "No existen usuarios que puedan atender este expediente";
        GenericApi.getAllGeneric("mas_grupo_trabajo/repartoAleatorio/" + idGrupo + "/" + procesoDisciplinarioId).then(
            datos => {
                if (datos != "") {
                    if (!datos.error) {
                        setRespuestaUsuarioAleatorio(true);
                        setUsuarioAleatorio(datos);
                        GenericApi.getGeneric('usuario/get-usuario-por-name/' + datos.nombre_funcionario).then(
                            datos => {
                                if (!datos.error) {
                                    setUsuarioNombre(datos.data[0].attributes.nombre);
                                    setUsuarioApellido(datos.data[0].attributes.apellido);
                                    setUsuarioName(datos.data[0].attributes.name);
                                    setUsuarioDependenciaNombre(datos.data[0].attributes.dependencia.nombre);
                                    setUsuarioGruposTrabajo(datos.data[0].attributes.grupo_trabajo_secretaria_comun.split(','))
                                    setExisteUsuarioValido(true);
                                }
                            }
                        )
                    } else {
                        setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                        setExisteUsuarioValido(false);

                    }
                } else {
                    setUsuarioNombre("");
                    setUsuarioApellido("");
                    setUsuarioName("");
                    setUsuarioDependenciaNombre("");                    
                    setUsuarioGruposTrabajo([]);
                    setModalState({ title: tituloModal.toUpperCase(), message: mensajeModal.toUpperCase(), show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    setExisteUsuarioValido(false);
                }
                window.showSpinner(false);
            }
        );
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: '',
                    usuario: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    setCountTextArea(valores.informacion.length)
                    let errores = {}

                    if (!valores.informacion) {
                        errores.informacion = 'Debe ingresar un valor'
                    }
                    else if (valores.informacion.length <= getMinimoTextArea) {
                        errores.informacion = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres'
                    }
                    if (valores.informacion) {
                        if (containsSpecialChars(valores.informacion))
                            errores.informacion = 'Tiene caracteres inválidos'
                    }

                    return errores
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Enviar a alguien de secretaria común aleatoriamente</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso.toUpperCase()} <strong> :: ENVIAR A ALGUIEN DE SECRETARIA COMÚN ALEATORIAMENTE</strong></h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="grupoTrabajo">SELECCIONE EL GRUPO DE TRABAJO <span className="text-danger">*</span></label>
                                            <Field value={getIdGrupoTrabajo} onChange={handleInputChange} as="select" className="form-control" id="grupoTrabajo" name="grupoTrabajo">
                                                <option value="">Por favor seleccione</option>
                                                {respuestaGrupoTrabajo ? selectGrupoTrabajo() : null}
                                            </Field>
                                            <ErrorMessage name="grupoTrabajo" component={() => (<span className="text-danger">{errors.grupoTrabajo}</span>)} />
                                        </div>
                                    </div>
                                    {getExisteUsuarioValido ?
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>USUARIO A RECIBIR GESTION: </label> {getUsuarioNombre != "" ? " " + getUsuarioNombre.toUpperCase() + " " + getUsuarioApellido.toUpperCase() + " (" + getUsuarioName.toUpperCase() + ") DE LA DEPENDENCIA " + getUsuarioDependenciaNombre.toUpperCase() : null}
                                            </div>
                                        </div> : null}
                                    {getExisteUsuarioValido ?
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="informacion">OBSERVACIONES <span className="text-danger">*</span></label>
                                                <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder="INFORMACIÓN PARA SU REMISIÓN..."
                                                    maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                <div className="text-right">
                                                    <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                </div>
                                                <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                            </div>
                                        </div> : null}
                                </div>
                                <div className="block-content block-content-full text-right">
                                    {getExisteUsuarioValido ?
                                        <button type="submit" className="btn btn-rounded btn-primary">REMITIR</button>
                                        : null}
                                    <Link to={'/Transacciones'} state={{ from: from }} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
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

export default EnviaraAlguienDeSecretariaComunAleatorio;