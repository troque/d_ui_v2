import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';
import { getUser } from '../../Utils/Common';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { Link } from "react-router-dom";

function EnviarAotraDependencia() {

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
    const [getUsuarioId, setUsuarioId] = useState();

    const [getListaDependenciaDestino, setListaDependenciaDestino] = useState({ data: {} });
    const [getRespuestaDependenciaDestino, setRespuestaDependenciaDestino] = useState(false);
    const [getListaSemaforosActivosSecretaria, setListaSemaforosActivosSecretaria] = useState([]);

    const [getHabilitarBotonRemitir, setHabilitarBotonRemitir] = useState(false);
    const [getHabilitarEstadoRemitir, setHabilitarEstadoRemitir] = useState('');

    const location = useLocation();
    const { from, selected_id_etapa } = location.state;

    let numeroLlamadosFinalizar = 0;
    let numeroTotalLlamadosFinalizar = 3;

    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    // Constante de modal general
    const getMensajeTituloModal = from.nombreProcesoTransacciones && from.nombreProcesoTransacciones.length > 0 ? from.nombreProcesoTransacciones : "";

    //Funcion principal
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            obtenerParametros();
            GenericApi.getGeneric('mas-dependencia-actuacion/'+getUser()["id_dependencia"]).then(
                datos => !datos.error ? (setListaDependenciaDestino(datos), setRespuestaDependenciaDestino(true), window.showSpinner(false)) : window.showModal(1)
            )
            obtenerParametros();
            obtenerSemaforosProcesoDisciplinario()

        }
        fetchData();
    }, []);

    // Funcion para validar y detener el spinner
    const validacionSpinnerFinalizar = () => {
        numeroLlamadosFinalizar++
        if(numeroLlamadosFinalizar >= numeroTotalLlamadosFinalizar){
            window.showSpinner(false);
            // Constante de mensaje
            const mensajeModalExito = 'El proceso con radicado: ' + from.radicado + ' fue asignado al usuario: ' + getUsuarioNombre + ' ' + getUsuarioApellido + ' (' + getUsuarioName + ') jefe de la dependencia: ' + getUsuarioDependenciaNombre + '';
            setModalState({ title: getMensajeTituloModal.toUpperCase() + " :: ENVIAR A OTRA DEPENDENCIA", message: mensajeModalExito.toUpperCase(), show: true, redirect: '/MisPendientes', alert: global.Constants.TIPO_ALERTA.EXITO });
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

    const enviarDatos = (valores) => {
        const iduserdependencia = getUser().id_dependencia;

        if (getDependenciaSeleccionada == getUser()["id_dependencia"])
            setModalState({ title: getMensajeTituloModal.toUpperCase() + " :: ENVIAR A OTRA DEPENDENCIA", message: '¡SU USUARIO ESTÁ CONFIGURADO COMO EL JEFE DE LA DEPENDENCIA!', show: true, redirect: null, from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.ERROR });

        window.showSpinner(true);
        let data;

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

        //Finalizando semaforo que inicia por grupo de trabajo
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

        //Finalizando semaforo que inicia por dependencia y vuelve a iniciar uno nuevo
        GenericApi.getByIdGeneric('get-semaforo-evento', 5).then(
            datosSemaforoFinaliza => {
                
                validacionSpinnerFinalizar();

                if (datosSemaforoFinaliza.data.length >= 1) {
                    datosSemaforoFinaliza.data.forEach(element => {                        
                        if (element?.attributes?.id_mas_dependencia_inicia && element?.attributes?.id_mas_dependencia_inicia?.id != getDependenciaSeleccionada) {
                           let data = {
                            "data": {
                                "type": "semaforo",
                                "attributes": {
                                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                    "id_semaforo": element.id,
                                    "id_actuacion_finaliza": null,
                                    "id_dependencia_finaliza": getDependenciaSeleccionada,
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
                        //if (getListaSemaforosActivosSecretaria element?.attributes?.id_mas_dependencia_inicia == null) {
                        if (
                                (!getListaSemaforosActivosSecretaria.some(objeto => objeto.id.toString() === element.id.toString())) &&
                                !element?.attributes?.id_mas_dependencia_inicia
                            )
                        {
                            console.log(element);
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

        GenericApi.addGeneric('transacciones/cambiar-usuario-proceso-disciplinario', data).then(
            datos => {

                validacionSpinnerFinalizar();

                if (!datos.error) {
                    numeroTotalLlamadosFinalizar++
                    GenericApi.getByIdGeneric('get-semaforo-evento', 5).then(
                        datosSemaforo => {

                            validacionSpinnerFinalizar()

                            if (!datosSemaforo.error) {
                                datosSemaforo.data.forEach(element => {
                                    if (element?.attributes?.id_mas_evento_inicio?.id == 5) {
                                        if (element?.attributes?.id_mas_dependencia_inicia?.id == getDependenciaSeleccionada) {
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
                                            GenericApi.addGeneric('pdxsemaforo', datapdxsemaforo).then(
                                                datos => {
                                                    validacionSpinnerFinalizar()
                                                }
                                            )
                                        }
                                    }
                                });
                            } else {
                                setModalState({ title: getMensajeTituloModal.toUpperCase() + " :: ENVIAR A OTRA DEPENDENCIA", message: "HA OCURRIDO UN ERROR CON LA SEMAFORIZACIÓN", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                            }
                        }
                    )                    
                }
                else {
                    setModalState({ title: getMensajeTituloModal.toUpperCase() + " :: ENVIAR A OTRA DEPENDENCIA", message: datos.error.toString(), show: true, redirect: '/AntecedentesLista', from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )

    }

    const selectChangeDependencia = (e) => {
        if (e.target.value === "") {
            return
        }
        setDependenciaDestino("");
        setUsuarioSleccionado("");


        const idUusario = getListaDependenciaDestino.data.find((element) => {
            return element.id === e.target.value;
        })
        if (idUusario) {
            window.showSpinner(true);
            GenericApi.getAllGeneric('proceso-diciplinario/usuario-habilitado-transacciones/' + procesoDisciplinarioId + '/' + idUusario.attributes.id_usuario_jefe).then(
                datos_respuesta => {
                    if (!datos_respuesta.error) {
                        if (datos_respuesta) {
                            setHabilitarBotonRemitir(true)
                            setHabilitarEstadoRemitir('')
                        }
                    }
                    else {
                        setHabilitarBotonRemitir(false)
                        setHabilitarEstadoRemitir(datos_respuesta.error)
                        //setModalState({ title: getMensajeTituloModal.toUpperCase(), message: datos_respuesta.error.toUpperCase(), show: true, redirect: '/Transacciones', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }                    
                    window.showSpinner(false);
                }
            )

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
            setTextoTitulo("EL EXPEDIENTE SERÁ ENVIADO AL JEFE DE LA DEPENDENCIA:");
        }
    }

    const datosDelUsuarioARemitir = (name) => {

        GenericApi.getGeneric('usuario/get-usuario-por-name/' + name).then(
            datos => {
                if (!datos.error) {
                    // console.log(datos);                    
                    if(datos.data.length > 0){
                        setUsuarioId(datos.data[0].id);
                        setUsuarioNombre(datos.data[0].attributes.nombre);
                        setUsuarioApellido(datos.data[0].attributes.apellido);
                        setUsuarioName(datos.data[0].attributes.name);
                        setUsuarioDependenciaNombre(datos.data[0].attributes.dependencia.nombre);
                    }
                }
                else {

                }
            }
        )
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

    const cargarUsuuarioJefe = () => {
        const idUusario = getListaDependenciaDestino.data.find((element) => {
            return element.id === getDependenciaSeleccionada;
        })
        if (idUusario != undefined) {
            if (idUusario.attributes.nombre_usuario_jefe) {
                return (
                    <tr>
                        <td className={ getHabilitarBotonRemitir ? 'bg-success text-white' : 'bg-warning text-dark' }>
                            <strong>{idUusario.attributes.nombre_usuario_jefe} {!getHabilitarBotonRemitir ? <> - {getHabilitarEstadoRemitir}</> : null}</strong>
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

                    if (getUsuarioSleccionado == undefined || getUsuarioSleccionado == "")
                        errores.usuario = 'LA DEPENDENCIA SELECCIONADA NO TIENE UN JEFE ASIGNADO';

                    if (!valores.informacion) {
                        errores.informacion = 'Debe ingresar un valor';
                    } else if (valores.informacion.length <= getMinimoTextArea) {
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
                                    <li className="breadcrumb-item"> <small>Enviar a otra dependencia</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">SINPROC NO {from.radicado} <strong> VIGENCIA: {from.vigencia} :: ENVIAR A OTRA DEPENDENCIA</strong></h3>
                            </div>
                            {
                                getListaDependenciaDestino?.data.length > 0
                                ?
                                    <>
                                        <div className="block-content">
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
                                                            <label>{getTextoTitulo.toUpperCase()}</label><br />
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
                                                            <label>{getTextoTitulo.toUpperCase()}</label><br />
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
                                                        <Field as="textarea" className="form-control" id="informacion" name="informacion" rows="6" placeholder="INFORMACIÓN PARA SU REMISIÓN..."
                                                            maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                                        <div className="text-right">
                                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                                        </div>
                                                        <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="block-content block-content-full text-right">
                                                <button type="submit" className="btn btn-rounded btn-primary" disabled={!getHabilitarBotonRemitir} >REMITIR</button>
                                                <Link to={'/Transacciones'} state={{ from: from, selected_id_etapa: selected_id_etapa }} className="font-size-h5 font-w600" >
                                                    <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                :
                                <>
                                    <br></br>
                                    <div className="alert alert-warning alert-dismissable" role="alert">
                                        <h3 className="alert-heading font-size-h4 my-2">INFORMACIÓN</h3>
                                        <p className='text-uppercase'>Para enviar el proceso disciplinario, es necesario configurar al menos una dependencia de destino. Si no se configura ninguna, no será posible remitir el expediente a otras dependencias.</p>
                                    </div>
                                </>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default EnviarAotraDependencia;