import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link } from "react-router-dom";
import GenericApi from '../../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import { getUser } from '../../Utils/Common';
import DatePerson from "../../DatePerson/DatePerson";
import 'react-datetime/css/react-datetime.css';
import DatePicker from 'react-datetime';
import moment from 'moment';

function SeleccionDeFechaParaSemaforo() {

    const [getFechaInicioSemaforo, setFechaInicioSemaforo] = useState();
    const [getSemaforo, setSemaforo] = useState();
    const [getListaSemaforos, setListaSemaforos] = useState({ data: [] });
    const [getRespuestaSemaforo, setRespuestaSemaforo] = useState(false);
    const [getidMasActuacion, setidMasActuacion] = useState();
    const [resultDiasNoLaborales, setResultDiasNoLaborales] = useState([]);
    const [getAnosAtrasInvalidos, setAnosAtrasInvalidos] = useState(0);
    const [getNombreFechaInicioSemaforo, setNombreFechaInicioSemaforo] = useState('FECHA INICIO SEMÁFORO');

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const location = useLocation();
    const { from, selected_id_etapa, id, nombre, estadoActualActuacion, tipoActuacion, actuacionIdMaestra } = location.state;
    let numeroLlamados = 0;
    let numeroTotalLlamados = 2;

    console.log("actuacionIdMaestra SeleccionDeFechaParaSemaforo -> ", actuacionIdMaestra)

    useEffect(() => {
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se cargan los metodos
            getSemaforos();
            getApiDiasNoLaborales();

            // Se setea el id de la actuacion maestra
            setidMasActuacion(actuacionIdMaestra)
        }
        fetchData();
    }, []);


    const validacionSpinner = () => {
        numeroLlamados++
        if(numeroLlamados >= numeroTotalLlamados){
          window.showSpinner(false);
        }
      }

    const enviarDatos = (valores) => {
        const userInput = moment(getFechaInicioSemaforo).format("YYYY-MM-DD");
        GenericApi.getByIdGeneric('existe-semaforo-con-fecha', getSemaforo).then(
            datos => {
                if (!datos.error) {
                    let data = {
                        "data": {
                            "type": "pdxsemaforo",
                            "attributes": {
                                "id_semaforo": getSemaforo,
                                "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                "id_actuacion": id,
                                "fecha_inicio": userInput,
                                "estado": 1,
                            }
                        }
                    }
                    if (datos.data.length >= 1) {
                        GenericApi.updateGeneric('pdxsemaforo', datos.data[0].id, data).then(
                            datosSemaforo => {
                                if (!datosSemaforo.error) {
                                    setModalState({
                                        title: "SINPROC No " + from.radicado + " :: SELECCIÓN DE FECHA DE INICIO DE SEMÁFORO",
                                        message: 'Fecha seleccionada actualizada con éxito',
                                        show: true,
                                        redirect: '/Transacciones',
                                        from: { from: from, selected_id_etapa: selected_id_etapa, id_actuacion: getidMasActuacion },
                                        alert: global.Constants.TIPO_ALERTA.EXITO
                                    });
                                    // setModalState({ 
                                    //     title: "Semáforo :: Selección de fecha", 
                                    //     message: 'Fecha seleccionada actualizada con éxito ', 
                                    //     show: true, 
                                    //     redirect: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1", 
                                    //     from: { from: from, id: id, nombre: nombre, selected_id_etapa: selected_id_etapa, id_actuacion: id  } ,
                                    //     alert: global.Constants.TIPO_ALERTA.EXITO 
                                    // });
                                } else {
                                    setModalState({
                                        title: "Semáforo :: Selección de fecha",
                                        message: datosSemaforo.error.toString(),
                                        show: true,
                                        alert: global.Constants.TIPO_ALERTA.ERROR
                                    });
                                }
                            }
                        )
                    } else {
                        GenericApi.addGeneric('pdxsemaforo', data).then(
                            datosSemaforo => {
                                if (!datosSemaforo.error) {
                                    setModalState({
                                        title: "SINPROC No " + from.radicado + " :: SELECCIÓN DE FECHA DE INICIO DE SEMÁFORO",
                                        message: 'Fecha seleccionada con éxito',
                                        show: true,
                                        redirect: '/Transacciones',
                                        from: { from: from, selected_id_etapa: selected_id_etapa, id_actuacion: getidMasActuacion },
                                        alert: global.Constants.TIPO_ALERTA.EXITO
                                    });
                                    // setModalState({ 
                                    //     title: "Semáforo :: Selección de fecha",
                                    //     message: 'Fecha seleccionada con éxito ', 
                                    //     show: true, redirect: "/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1", 
                                    //     from: { from: from, id: id, nombre: nombre, selected_id_etapa: selected_id_etapa, id_actuacion: id  } ,
                                    //     alert: global.Constants.TIPO_ALERTA.EXITO 
                                    // });
                                } else {
                                    setModalState({
                                        title: "Semáforo :: Selección de fecha",
                                        message: datosSemaforo.error.toString(),
                                        show: true,
                                        alert: global.Constants.TIPO_ALERTA.ERROR
                                    });
                                }
                            }
                        )
                    }
                } else {
                    console.log(datos.error);
                }
            }
        )
    }

    const changeSemaforo = (e) => {
        setSemaforo(e.target.value);
        setNombreFechaInicioSemaforo(getListaSemaforos.data.find(dato => dato.id == e.target.value).attributes.nombre_campo_fecha.toUpperCase())
    }

    const selectSemaforo = () => {
        return (
            getListaSemaforos.data.map((evento, i) => {
                return (
                    <option key={evento.id} value={evento.id}>{evento.attributes.nombre}</option>
                )
            })
        )
    }

    const getSemaforos = () => {
        GenericApi.getAllGeneric('semaforo/get-semaforo-por-etapa/'+selected_id_etapa+'/1').then(
            datos => {

                validacionSpinner()

                if (!datos.error) {
                    datos.data.forEach(element => {
                        if (element.attributes.id_mas_evento_inicio.id == 3) {
                            getListaSemaforos.data.push(element);
                            setRespuestaSemaforo(true);
                        }
                    });

                } else {
                    setModalState({ title: "Semáforo :: Ocurrio un error", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
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
        }
        else {
            return (!resultDiasNoLaborales.includes(current.format('YYYY-MM-DD')) && moment(current).isAfter(pastDate));
        }

    }

    const obtenerParametros = () => {
        try {

            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "limite_años_calendario|minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            //buscamos el parametro
            GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(
                //ParametrosMasApi.getParametroPorNombre(data).then(
                datos => {

                    if (!datos.error) {

                        if (datos["data"].length > 0) {

                            datos["data"].filter(data => data["attributes"]["nombre"].includes('limite_años_calendario')).map(filteredName => (
                                setAnosAtrasInvalidos(filteredName["attributes"]["valor"])
                            ))

                        }
                    } else {
                        setModalState({ title: "Proceso disciplinario", message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const getApiDiasNoLaborales = () => {
        //ParametrosMasApi.getAllDiasNoLaborales().then(
        GenericApi.getGeneric("dias-no-laborales?estado=1").then(
            datos => {

                validacionSpinner()

                if (!datos.error) {
                    var data = [];
                    for (var i in datos.data) {
                        var date = datos.data[i]["attributes"]["fecha"].split(' ')[0];
                        var result = new Date(date);
                        result.setDate(result.getDate() + 1);
                        data.push(i, date);
                    }

                    setResultDiasNoLaborales(data);

                    //obtenemos los parametros
                    obtenerParametros();

                } else {
                    setModalState({ title: "Proceso disciplinario", message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }

        )
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
                    let errores = {};

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
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Selección de fecha para semáforo</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">SINPROC No {from.radicado.toUpperCase()} <strong> VIGENCIA: {from.vigencia.toUpperCase()} :: SELECCIÓN DE FECHA PARA SEMÁFORO </strong></h3>
                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="Semaforo">SEMÁFORO</label>.
                                            <Field as="select" value={getSemaforo} onChange={changeSemaforo} className="form-control" id="Semaforo" name="Semaforo" placeholder="SEMÁFORO">
                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                {getRespuestaSemaforo ? selectSemaforo() : null}
                                            </Field>
                                            <ErrorMessage name="Semaforo" component={() => (<span className="text-danger">{errors.Semaforo}</span>)} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            {console.log(getSemaforo)}
                                            <label htmlFor='fechaInicioSemaforo'>{ getNombreFechaInicioSemaforo }<span className="text-danger">*</span> {getNombreFechaInicioSemaforo != 'FECHA INICIO SEMÁFORO' ? <small>(FECHA INICIO SEMÁFORO)</small> : null }</label>

                                            <DatePicker
                                                id="fechaInicioSemaforo"
                                                locale='es'
                                                name="fechaInicioSemaforo"
                                                dateFormat="DD/MM/YYYY"
                                                closeOnSelect={true}
                                                placeholder="dd/mm/yyyy"
                                                onChange={(date) => setFechaInicioSemaforo(date)}
                                                timeFormat={false}
                                                isValidDate={disableCustomDt}
                                            />
                                            <ErrorMessage name="fechaInicioSemaforo" component={() => (<span className="text-danger">{errors.fechaInicioSemaforo}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary" >ACEPTAR</button>
                                    <Link to={"/ActuacionesVer/" + from.procesoDisciplinarioId + "/" + selected_id_etapa + "/1"} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }} className="font-size-h5 font-w600" >
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

export default SeleccionDeFechaParaSemaforo;