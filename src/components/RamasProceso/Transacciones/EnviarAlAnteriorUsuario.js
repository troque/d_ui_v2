import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { Link } from "react-router-dom";

function EnviarAlAnteriorUsuario() {
    const location = useLocation();
    const { from } = location.state;


    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreAnterior, setNombreAnterior] = useState("");
    const [getIdProcesoDisciplinario, setIdProcesoDisciplinario] = useState(from.procesoDisciplinarioId);
    const [getDependenciaOrigen, setDependenciaOrigen] = useState("");
    const [getUsuarioSleccionado, setUsuarioSleccionado] = useState("");
    
    const [getUsuarioNombre, setUsuarioNombre] = useState("");
    const [getUsuarioApellido, setUsuarioApellido] = useState("");
    const [getUsuarioName, setUsuarioName] = useState("");
    const [getUsuarioDependenciaNombre, setUsuarioDependenciaNombre] = useState("");
    const [getUsuarioId, setUsuarioId] = useState();
    const [getListaSemaforosActivosSecretaria, setListaSemaforosActivosSecretaria] = useState([]);
    const [getIdDependenciaSecretariaComun, setIdDependenciaSecretariaComun] = useState('');
    
    let numeroLlamadosFinalizar = 0;
    let numeroTotalLlamadosFinalizar = 3;

    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    //Funcion principal
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            obtenerDependenciaSecretaria();
            obtenerParametros();
            obtenemosElUltimoUsuario();
            obtenerSemaforosProcesoDisciplinario()
        }
        fetchData();
    }, []);

    const obtenerDependenciaSecretaria = () => {

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
                } else {
                    // Se setea el mensaje
                    setModalState({ title: "ADMINISTRACIÓN :: USUARIOS", message: datos.error.toString(), show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.ERROR });
                    // Se quita el cargando
                    window.showSpinner(false);
                }

            }
        )
    }

    const obtenerSemaforosProcesoDisciplinario = () => {

        GenericApi.getAllGeneric("semaforo/get-semaforo-proceso-disciplinario/"+global.Constants.SEMAFORO_EVENTOS.EVENTO_DEPENDENCIA+"/"+procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaSemaforosActivosSecretaria(datos)
                }
                window.showSpinner(false);
            }
        )

    }

    // Funcion para validar y detener el spinner
    const validacionSpinnerFinalizar = () => {
        numeroLlamadosFinalizar++
        if(numeroLlamadosFinalizar >= numeroTotalLlamadosFinalizar){
            window.showSpinner(false);
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

        // console.log(getIdProcesoDisciplinario);
        // console.log(getDependenciaOrigen);
        // console.log(getUsuarioName);
        // console.log(valores.informacion);

        window.showSpinner(true);
        const data = {
            "data": {
                "type": "transacciones",
                "attributes": {
                    "id_proceso_disciplinario": getIdProcesoDisciplinario,
                    "id_dependencia_origen": getDependenciaOrigen,
                    "usuario_a_remitir": getUsuarioName,
                    "descripcion_a_remitir": valores.informacion,
                    "id_etapa": 3
                }
            }
        }

        //Finalizando semaforo que inicia por grupo de trabajo
        if(getDependenciaOrigen.toString() !== getIdDependenciaSecretariaComun.toString()){
            GenericApi.getByIdGeneric('get-semaforo-evento', 4).then(
                datosSemaforoFinaliza => {
                    validacionSpinnerFinalizar();
                    if (datosSemaforoFinaliza.data.length >= 1) {
                        datosSemaforoFinaliza.data.forEach(element => {
                            numeroTotalLlamadosFinalizar++
    
                            let data = {
                                "data": {
                                    "type": "semaforo",
                                    "attributes": {
                                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                        "id_semaforo": element.id,
                                        "id_actuacion_finaliza": null,
                                        "id_dependencia_finaliza": null,
                                        "id_usuario_finaliza": getUsuarioId
                                    }
                                }
                            }
    
                            GenericApi.getByDataGeneric('set-finaliza-semaforo', data).then(
                                datos => {
                                    validacionSpinnerFinalizar()
                                }
                            );
    
                        });
                    }
                }
            )
        }

        //Finalizando semaforo que inicia por dependencia y vuelve a iniciar uno nuevo
        GenericApi.getByIdGeneric('get-semaforo-evento', 5).then(
            datosSemaforoFinaliza => {
                
                validacionSpinnerFinalizar();

                if (datosSemaforoFinaliza.data.length >= 1) {
                    datosSemaforoFinaliza.data.forEach(element => {
                        if (element?.attributes?.id_mas_dependencia_inicia && element?.attributes?.id_mas_dependencia_inicia?.id != getDependenciaOrigen) {
                            let data = {
                                "data": {
                                    "type": "semaforo",
                                    "attributes": {
                                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                        "id_semaforo": element.id,
                                        "id_actuacion_finaliza": null,
                                        "id_dependencia_finaliza": getDependenciaOrigen,
                                        "id_usuario_finaliza": null
                                    }
                                }
                            }
    
                            numeroTotalLlamadosFinalizar++
                            
                            GenericApi.getByDataGeneric('set-finaliza-semaforo', data).then(
                                datos => {
                                    validacionSpinnerFinalizar()
                                }
                            );
                        }
                        if (
                                (!getListaSemaforosActivosSecretaria.some(objeto => objeto.id.toString() === element.id.toString())) &&
                                !element?.attributes?.id_mas_dependencia_inicia
                            )
                        {
                            let date = new Date();
                            let datapdxsemaforo = {
                                "data": {
                                    "type": "pdxsemaforo",
                                    "attributes": {
                                        "id_semaforo": element.id,
                                        "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                        "id_actuacion": "",
                                        "fecha_inicio": date.toLocaleDateString('zh-Hans-CN'),
                                        "estado": 1,
                                    }
                                }
                            }
                            numeroTotalLlamadosFinalizar++
                            GenericApi.addGeneric('pdxsemaforo', datapdxsemaforo).then(
                                datos => { 
                                    validacionSpinnerFinalizar() 
                                }
                            )
                        }
                    });
                }
            }
        )

        const tituiloModal = "SINPROC No " + from.radicado + " :: Enviar al anterior usuario";

        // console.log(data);
        GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(
            datos => {
                if (!datos.error) {
                    const mensajeModal = 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + getUsuarioNombre + ' ' + getUsuarioApellido + ' (' + getUsuarioName + ')  de la dependencia: ' + getUsuarioDependenciaNombre + '';
                    setModalState({ title: tituiloModal.toUpperCase(), message: mensajeModal.toUpperCase(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: tituiloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }

    const obtenemosElUltimoUsuario = () => {
        if (getIdProcesoDisciplinario != null) {
            const data = {
                "data": {
                    "type": "log_proceso_disciplinario",
                    "attributes": {
                        "id_proceso_disciplinario": getIdProcesoDisciplinario
                    }
                }
            }

            GenericApi.getByDataGeneric('log-proceso-disciplinario/get-log-etapa-actuaciones/' + getIdProcesoDisciplinario, data).then(
                datos => {
                    if (!datos.error) {
                        const tituiloModal = "SINPROC No " + from.radicado + " :: Enviar al anterior usuario";
                        const mensajeModal = 'No existe un usuario anterior para remitir el proceso';
                        const found = datos.data.find(element => element.attributes.tipo_trasaccion.id === 5);
                        if (found == null) {
                            setModalState({ title: tituiloModal.toUpperCase(), message: mensajeModal.toUpperCase(), show: true, redirect: '/Transacciones', alert: global.Constants.TIPO_ALERTA.ERROR });
                        } else {
                            GenericApi.getAllGeneric('proceso-diciplinario/usuario-habilitado-transacciones/' + getIdProcesoDisciplinario + '/' + found.attributes.funcionario_registra.id).then(
                                datos_respuesta => {
                                    if (!datos_respuesta.error) {
                                        if (datos_respuesta) {
                                            setDependenciaOrigen(found.attributes.dependencia_origen.id);
                                            setUsuarioId(found.attributes.funcionario_registra.id);
                                            setUsuarioNombre(found.attributes.funcionario_registra.nombre);
                                            setUsuarioApellido(found.attributes.funcionario_registra.apellido);
                                            setUsuarioName(found.attributes.funcionario_registra.name);
                                            setUsuarioDependenciaNombre(found.attributes.funcionario_registra.dependencia.nombre);
                                        }
                                        else{
                                            const mensajeModal = 'EL USUARIO ' + found.attributes.funcionario_registra.nombre.toUpperCase() + ' ' + found.attributes.funcionario_registra.apellido.toUpperCase() + ' NO TIENE PERMISO(S) HABILITADO(S) PARA RECIBIR EL PROCESO DISCIPLINARIO.';
                                            setModalState({ title: tituiloModal.toUpperCase(), message: mensajeModal.toUpperCase(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                                        }
                                    }
                                    else {
                                        setModalState({ title: tituiloModal.toUpperCase(), message: datos_respuesta.error.toUpperCase(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                                    }
                                }
                            )
                        }
                    } else {
                        window.showModal(1);
                    }
                }
            )
        }
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    informacion: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    setCountTextArea(valores.informacion.length)
                    let errores = {}
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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Enviar al ultimo usuario</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">SINPROC NO {from.radicado} <strong> VIGENCIA: {from.vigencia} :: REGRESAR AL ÚLTIMO USUARIO</strong></h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="informacion">MOTIVO POR EL CUAL SE REGRESA PROCESO AL ÚLTIMO USUARIO: {getUsuarioNombre.toUpperCase() + " " + getUsuarioApellido.toUpperCase() + " (" + getUsuarioDependenciaNombre.toUpperCase() + ") "} <span className="text-danger">*</span></label>
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
                                    <button type="submit" className="btn btn-rounded btn-primary">REMITIR</button>
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


export default EnviarAlAnteriorUsuario;