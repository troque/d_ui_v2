import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik, getIn } from 'formik';
import { Link } from "react-router-dom";
import GenericApi from '../../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import 'react-datetime/css/react-datetime.css';
import DatePicker from 'react-datetime';
import moment from 'moment';

function AgregarSemaforo() {

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [countTextArea, setCountTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);

    const [getFechaInicioSemaforo, setFechaInicioSemaforo] = useState("");
    const [getFechaFinSemaforo, setFechaFinSemaforo] = useState("");
    const [getSemaforoSeleccionado, setSemaforoSeleccionado] = useState("");
    const [getInformacion, setInformacion] = useState("");
    const [getInteresadoSeleccionado, setInteresadoSeleccionado] = useState("");
    const [getRespuestaSemaforo, setRespuestaSemaforo] = useState(false);
    const [getRespuestaInteresado, setRespuestaInteresado] = useState(false);
    const [getListaSemaforos, setListaSemaforos] = useState({ data: [] });
    const [getListaInteresados, setListaInteresados] = useState({ data: [] });

    const [resultDiasNoLaborales, setResultDiasNoLaborales] = useState([]);
    const [getAnosAtrasInvalidos, setAnosAtrasInvalidos] = useState(0);

    const tituloModal = "Semáforo :: Ocurrio un error";

    const location = useLocation()
    //const { semaforo, from, selected_id_etapa, id, nombre, estadoActualActuacion, actuacionIdMaestra } = location.state;
    const { semaforo, from, selected_id_etapa, id, nombre, estadoActualActuacion, tipoActuacion, disable, actuacionIdMaestra } = location.state;
    console.log("Semaforo", semaforo);

    console.log("actuacionIdMaestra AgregarSemaforo -> ", actuacionIdMaestra);

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            if (semaforo != undefined) {
                setFechaInicioSemaforo(semaforo.attributes.fecha_inicio);
                setFechaFinSemaforo(semaforo.attributes.fecha_fin);
                setSemaforoSeleccionado(semaforo.attributes.id_semaforo.id);
                setInformacion(semaforo.attributes.observaciones);
                setInteresadoSeleccionado(semaforo.attributes.id_interesado.uuid);
                setCountTextArea(semaforo.attributes.observaciones.length);
            }
            getApiDiasNoLaborales();
            obtenerParametros();
            DatosSemaforos();
            DatosInteresados();
        }
        fetchData();
    }, []);

    function containsSpecialChars(str) {
        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }
            return false;
        });
        return result;
    }

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
            GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(
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
                        setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )

            const data2 = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "limite_años_calendario|minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            //buscamos el parametro
            GenericApi.getByDataGeneric("parametro/parametro-nombre", data2).then(
                //ParametrosMasApi.getParametroPorNombre(data).then(
                datos => {
                    if (!datos.error) {
                        if (datos["data"].length > 0) {
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('limite_años_calendario')).map(filteredName => (
                                setAnosAtrasInvalidos(filteredName["attributes"]["valor"])
                            ))
                        }
                    } else {
                        setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                        window.showSpinner(false);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const DatosSemaforos = () => {
        GenericApi.getAllGeneric('semaforo').then(
            datos => {
                if (!datos.error) {
                    datos.data.forEach(element => {
                        if (element.attributes.id_mas_evento_inicio.id == 6) {
                            //getListaSemaforos.data.push(element);
                            setListaSemaforos(prevState => ({
                                ...prevState,
                                data: [...prevState.data, element]
                              }));
                            setRespuestaSemaforo(true);
                        }
                    });
                } else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const DatosInteresados = () => {
        const data = {
            "data": {
                "type": "interesado",
                "attributes": {
                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                    "tipo_documento": "1",
                    "numero_documento": "1",
                    "primer_nombre": "1",
                    "segundo_nombre": "1",
                    "primer_apellido": "1",
                    "segundo_apellido": "1",
                    "estado": "1"
                }
            }
        }
        GenericApi.getByDataGeneric('datos-interesado/datos-interesado/' + from.procesoDisciplinarioId, data).then(
            datos => {
                if (!datos.error) {
                    setListaInteresados(datos);
                    setRespuestaInteresado(true);
                } else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )

    }

    const ListaSemaforos = () => {
        return (
            getListaSemaforos.data.map((evento, i) => {
                return (
                    <option key={evento.id} value={evento.id}>{evento.attributes.nombre}</option>
                )
            })
        )
    }
    console.log("Lista interesados", getListaInteresados);
    const ListaInteresados = () => {
        return (
            getListaInteresados.data.map((t, i) => {
                return (
                    <option key={t.id} value={t.id}>{
                        (t.attributes.primer_nombre != null ? t.attributes.primer_nombre : "")
                        + " " + (t.attributes.segundo_nombre != null ? t.attributes.segundo_nombre : "")
                        + " " + (t.attributes.primer_apellido != null ? t.attributes.primer_apellido : "")
                        + " " + (t.attributes.segundo_apellido != null ? t.attributes.segundo_apellido : "")

                    }</option>
                )
            })
        )
    }

    const handleInputChange = (e) => {
        if (e.target.name == "semaforo") {
            setSemaforoSeleccionado(e.target.value);
        } else if (e.target.name == "interesado") {
            setInteresadoSeleccionado(e.target.value);
        } else if (e.target.name == "informacion") {
            setInformacion(e.target.value);
            setCountTextArea(e.target.value.length);
        }
    }

    const actualizarDatos = (valores) => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializan las constantes de datos
        const Finicio = moment(getFechaInicioSemaforo).format("YYYY-MM-DD");
        const Ffin = getFechaFinSemaforo != "" && getFechaFinSemaforo != null ? moment(getFechaFinSemaforo).format("YYYY-MM-DD") : null;

        // Se inicializa la data a enviar
        let data = {
            "data": {
                "type": "actuacionxsemaforo",
                "attributes": {
                    "id_semaforo": getSemaforoSeleccionado,
                    "id_interesado": getInteresadoSeleccionado,
                    "id_actuacion": id,
                    "fecha_inicio": Finicio,
                    "fecha_fin": Ffin,
                    "observaciones": getInformacion,
                    //"finalizo": valores.informacion,
                    //"fechafinalizo": valores.informacion,
                    "estado": 1,
                }
            }
        }

        // Constante de titulo del modal
        const tituloModalSemaforos = "SINPROC No " + from.radicado + " :: Agregar semáforo";

        // Se consume le API
        GenericApi.updateGeneric('actuacionxsemaforo', semaforo.id, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Constante de mensaje exito
                    const mensajeExito = 'Se ha actualizado el semáforo al proceso con radicado: ' + from.radicado + '';

                    // Se setea el modal
                    setModalState({
                        title: tituloModalSemaforos.toUpperCase(),
                        message: mensajeExito.toUpperCase(),
                        show: true,
                        from: { from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion },
                        redirect: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1",
                        alert: global.Constants.TIPO_ALERTA.EXITO
                    });
                } else {

                    // Constante de mensaje
                    const mensajeError = 'Ha ocurrido un error al momento de actualizar el semáforo';

                    // Se setea el modal
                    setModalState({
                        title: tituloModalSemaforos.toUpperCase(),
                        message: mensajeError.toUpperCase(),
                        show: true,
                        from: { from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion },
                        redirect: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1",
                        alert: global.Constants.TIPO_ALERTA.ERROR
                    });
                }
            }
        )
    }

    const enviarDatos = (valores) => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se inicializan las constantes de datos
        const Finicio = moment(getFechaInicioSemaforo).format("YYYY-MM-DD");
        const Ffin = getFechaFinSemaforo != "" && getFechaFinSemaforo != null ? moment(getFechaFinSemaforo).format("YYYY-MM-DD") : null;

        // Se inicializa la data a enviar
        let data = {
            "data": {
                "type": "actuacionxsemaforo",
                "attributes": {
                    "id_semaforo": getSemaforoSeleccionado,
                    "id_interesado": getInteresadoSeleccionado,
                    "id_actuacion": id,
                    "fecha_inicio": Finicio,
                    "fecha_fin": Ffin,
                    "observaciones": getInformacion,
                    //"finalizo": valores.informacion,
                    //"fechafinalizo": valores.informacion,
                    "estado": 1,
                }
            }
        };

        // Se inicializa el titulo de la modal
        const tituloModalAdd = "SINPROC No " + from.radicado + " :: Agregar semáforo";

        // Se consume le API
        GenericApi.addGeneric('actuacionxsemaforo', data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Constante de mensaje exito
                    const mensajeExito = 'Se ha agregado el semáforo al proceso con radicado: ' + from.radicado + '';

                    // Se setea el modal
                    setModalState({
                        title: tituloModalAdd.toUpperCase(),
                        message: mensajeExito.toUpperCase(),
                        show: true,
                        //from: { from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion },
                        from: { from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra },
                        redirect: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1",
                        alert: global.Constants.TIPO_ALERTA.EXITO
                    });
                } else {

                    // Constante de mensaje de error
                    const mensajeError = 'Ha ocurrido un error al momento de agregar el semáforo';

                    // Se setea el modal
                    setModalState({
                        title: tituloModalAdd.toUpperCase(),
                        message: mensajeError.toUpperCase(),
                        show: true,
                        //from: { from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion },
                        from: { from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra },
                        redirect: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1",
                        alert: global.Constants.TIPO_ALERTA.ERROR
                    });
                }
            }
        )
    }

    const getApiDiasNoLaborales = () => {

        // Se consume la API
        GenericApi.getGeneric("dias-no-laborales?estado=1").then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se inicializa la variable de respuesta
                    var data = [];

                    // Se recorre la data de los dias laborales
                    for (var i in datos.data) {

                        // Se captura la informacion y se formatea la fecha
                        var date = datos.data[i]["attributes"]["fecha"].split(' ')[0];
                        var result = new Date(date);
                        result.setDate(result.getDate() + 1);
                        data.push(i, date);
                    }

                    // Se setea la data
                    setResultDiasNoLaborales(data);

                    // Se cargan los parametros
                    obtenerParametros();
                } else {

                    // Constante de titulo api
                    const titleModal = "Proceso disciplinario";

                    // Se setea el modal
                    setModalState({ title: titleModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    const disableCustomDt = (current) => {
        const bloqueaDiasFuturos = false;
        var startDate = new Date()
        var year = startDate.getFullYear();
        var month = startDate.getMonth();
        var day = startDate.getDate();
        var pastDate = new Date(year - getAnosAtrasInvalidos, month, day);

        if (bloqueaDiasFuturos) {
            return (!resultDiasNoLaborales.includes(current.format('YYYY-MM-DD')) && moment(current).isAfter(pastDate) && moment(current).isBefore(new Date()));
        } else {
            return (!resultDiasNoLaborales.includes(current.format('YYYY-MM-DD')) && moment(current).isAfter(pastDate));
        }
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    semaforo: getSemaforoSeleccionado,
                    interesado: getInteresadoSeleccionado,
                    fechaInicioSemaforo: getFechaInicioSemaforo,
                    fechaFinSemaforo: getFechaFinSemaforo,
                    informacion: getInformacion,
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}

                    if (!getInformacion) {
                        errores.informacion = 'Debe ingresar un valor';
                    }
                    else if (getInformacion.length <= getMinimoTextArea) {
                        errores.informacion = 'La descripción debe tener almenos ' + getMinimoTextArea + ' caracteres';
                    }
                    if (getInformacion) {
                        if (containsSpecialChars(getInformacion))
                            errores.informacion = 'Tiene caracteres inválidos';
                    }

                    if (valores.semaforo == "") {
                        errores.semaforo = 'Debe seleccionar un semáforo';
                    }

                    if (valores.interesado == "") {
                        errores.interesado = 'Debe seleccionar un interesado';
                    }

                    if (valores.fechaInicioSemaforo == "") {
                        errores.fechaInicioSemaforo = 'Debe seleccionar una fecha de inicio';
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    if (semaforo != undefined) {
                        actualizarDatos(valores);
                    } else {
                        enviarDatos(valores);
                    }
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>Actuaciones</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={"/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion }}><small>Actuación {nombre}</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Agregar Semáforo</small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">INFORMACIÓN DEL SEMÁFORO</h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="semaforo">SEMÁFORO: <span className="text-danger">*</span></label>
                                            <Field value={getSemaforoSeleccionado} onChange={handleInputChange} as="select" className="form-control" id="semaforo" name="semaforo">
                                                <option value="">Por favor seleccione</option>
                                                {getRespuestaSemaforo ? ListaSemaforos() : null}
                                            </Field>
                                            <ErrorMessage name="semaforo" component={() => (<span className="text-danger">{errors.semaforo}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="interesado">INTERESADO: <span className="text-danger">*</span></label>
                                            <Field value={getInteresadoSeleccionado} onChange={handleInputChange} as="select" className="form-control" id="interesado" name="interesado">
                                                <option value="">Por favor seleccione</option>
                                                {getRespuestaInteresado ? ListaInteresados() : null}
                                            </Field>
                                            <ErrorMessage name="interesado" component={() => (<span className="text-danger">{errors.interesado}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor='fechaInicioSemaforo'>FECHA INICIO: <span className="text-danger">*</span></label>
                                            <DatePicker
                                                value={getFechaInicioSemaforo}
                                                id="fechaInicioSemaforo"
                                                locale='es'
                                                name="fechaInicioSemaforo"
                                                dateFormat="YYYY-MM-DD"
                                                closeOnSelect={true}
                                                placeholder="dd/mm/yyyy"
                                                onChange={(date) => setFechaInicioSemaforo(date)} timeFormat={false}
                                                isValidDate={disableCustomDt}
                                            />
                                            <ErrorMessage name="fechaInicioSemaforo" component={() => (<span className="text-danger">{errors.fechaInicioSemaforo}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor='fechaFinSemaforo'>FECHA FIN:</label>
                                            <DatePicker
                                                value={getFechaFinSemaforo}
                                                id="fechaFinSemaforo"
                                                locale='es'
                                                name="fechaFinSemaforo"
                                                dateFormat="YYYY-MM-DD"
                                                closeOnSelect={true}
                                                placeholder="dd/mm/yyyy"
                                                onChange={(date) => setFechaFinSemaforo(date)}
                                                timeFormat={false}
                                                isValidDate={disableCustomDt}
                                            />
                                            <ErrorMessage name="fechaFinSemaforo" component={() => (<span className="text-danger">{errors.fechaFinSemaforo}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor='informacion'>OBSERVACIONES: <span className="text-danger">*</span></label>
                                            <Field as="textarea" value={getInformacion} onChange={handleInputChange} className="form-control" id="informacion" name="informacion" rows="6" placeholder="Información para su solicitud de inactivación...."
                                                maxLength={getMaximoTextArea} minLength={getMinimoTextArea}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="informacion" component={() => (<span className="text-danger">{errors.informacion}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">ACEPTAR</button>
                                    {/* <Link to={"/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"}
                                        state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, actuacionIdMaestra: actuacionIdMaestra }} className="font-size-h5 font-w600" >
                                        <button type="button" className="btn btn-rounded btn-outline-primary" >CANCELAR</button>
                                    </Link> */}
                                    <Link to={"/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"}
                                        state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra }} className="font-size-h5 font-w600" >
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

export default AgregarSemaforo;