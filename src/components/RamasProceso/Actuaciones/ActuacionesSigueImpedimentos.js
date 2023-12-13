import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import InfoErrorApi from '../../Utils/InfoErrorApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import '../../Utils/Constants';
import { useLocation } from 'react-router-dom';

function ActuacionesSigueImpedimentos() {

    // Constantes principales
    const location = useLocation();

    // Constantes generales
    const [errorApi, setErrorApi] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getArchivosListaSearch, setArchivosListaSearch] = useState({ data: [], links: [], meta: [] });
    const [getAuto, setAuto] = useState('');
    const [getNombreDelDocumento, setNombreDelDocumento] = useState('');
    const [getMuestraBotonFechaParaSemaforo, setMuestraBotonFechaParaSemaforo] = useState(false);
    const [getidMasActuacion, setidMasActuacion] = useState();
    const [getExtensionDocumento, setExtensionDocumento] = useState("");
    const { getDespuesAprobacionListarActuacion, getActuacionCierraProceso, from, selected_id_etapa, nombre, uuid_actuacion, estadoActualActuacion, tipoActuacion, actuacionIdMaestra } = location.state

    // Variables generales
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    // Constante de redireccionamiento
    const redirectToRoutes = () => {
        return <Navigate to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }} />;
    }

    console.log("actuacionIdMaestra ActuacionesSigueImpedimentos -> ", actuacionIdMaestra);

    // Metodo de la clase principal para cargar informacion
    useEffect(() => {

        // Se crea la funcion principal
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se consume la API
            GenericApi.getGeneric("actuaciones/" + uuid_actuacion).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se setea la data
                        setAuto(datos.data.attributes.auto);
                    }
                }
            )

            // Se consume la API
            GenericApi.getGeneric("archivo-actuaciones/get-archivo-actuaciones-by-uuid/" + uuid_actuacion).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se valida que haya informacion
                        if (datos.data.length > 0) {

                            // Se setea la data
                            setArchivosListaSearch(datos.data[0]);
                            setNombreDelDocumento(datos.data[0].attributes.nombre_archivo);

                            // Se valida el tipo de extension del documento
                            if (datos.data[0].attributes.extension == global.Constants.TIPO_DOCUMENTO_PERMITIDO_ACTUACIONES.DOCX) {

                                // Se setea el valor del mensaje a mostrar
                                setExtensionDocumento("Word");
                            } else {

                                // Se setea el valor del mensaje a mostrar
                                setExtensionDocumento("Pdf");
                            }
                        }
                    }
                }
            )

            // Se setea el id de la actuacion
            setidMasActuacion(actuacionIdMaestra);

            // Se consume la API de semaforos
            GenericApi.getGeneric('semaforo').then(

                // Se inicializa la variable de respuesta
                datosSemaforo => {

                    // Se valida que no haya error
                    if (!datosSemaforo.error) {

                        // Se recorre el array 
                        datosSemaforo.data.forEach(element => {

                            // Se valida que haya una actuacion que inicia el proceso
                            if (element.attributes.id_mas_actuacion_inicia != null) {

                                // Se valida que haya una actuacion que inicia el proceso sea igual a la actuacion actual
                                if (element.attributes.id_mas_actuacion_inicia.id == actuacionIdMaestra
                                    && element?.attributes?.id_mas_evento_inicio?.id == 3) {

                                    // Se setea el boton en frue
                                    setMuestraBotonFechaParaSemaforo(true);
                                }
                            }
                        });

                        // Se quita el cargando
                        window.showSpinner(false);
                    }
                }
            )
        }

        // Se llama la clase principal
        fetchData();
    }, []);

    // Metodo encargado de descargar el archivo
    const handleDownloadArchivo = () => {

        // Se usa el trycatch
        try {

            // Se usa el cargando
            window.showSpinner(true);

            // Se consume la API para descargar el archivo
            GenericApi.getGeneric("archivo-actuaciones/get-documento/" + getArchivosListaSearch.attributes.id + "/" + getArchivosListaSearch.attributes.extension).then(

                // Se incializa la variable de respuesta
                datos => {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se llama el metodo para descargar el contenido
                        downloadBase64File(datos.content_type, datos.base_64, getArchivosListaSearch.attributes.nombre_archivo);
                    } else {

                        // Se setea el error
                        setErrorApi(datos.error.toString());

                        // Se muestra el modal
                        window.showModal(1);
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    // Metodo encargado de continuar con el proceso
    const continuar = () => {

        // Se activa el loading
        window.showSpinner(true);

        // Si la actuacion tiene habilitada la opcion de cerrar el proceso
        if (getActuacionCierraProceso == 1) {
            const datadata = {
                "data": {
                    "type": "cerrar_etapa",
                    "attributes": {
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "id_etapa": selected_id_etapa,
                        "id_funcionario_asignado": "",
                        "descripcion": "",
                        "created_user": ""
                    }
                }
            }

            // Se consume la API
            GenericApi.addGeneric("cierre-etapa/actuaciones", datadata)
        }

        // Se quita el cargando
        window.showSpinner(false);

        // Se inicializa la variable del titulo del modal
        const tituloModal = "SINPROC N° " + from.radicado + " :: Estado de actuación";
        const messageModal = "¡Aprobación exitosa!";

        console.log("getDespuesAprobacionListarActuacion -> ", getDespuesAprobacionListarActuacion);
        console.log("getMuestraBotonFechaParaSemaforo    -> ", getMuestraBotonFechaParaSemaforo);

        // Se valida que haya semaforos
        if (getMuestraBotonFechaParaSemaforo) {

            // Se genera el modal
            setModalState({
                title: tituloModal.toUpperCase(),
                message: messageModal.toUpperCase(),
                show: true,
                redirect: '/SeleccionDeFechaParaSemaforo',
                from: { from: from, selected_id_etapa: selected_id_etapa, id: uuid_actuacion, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra },
                alert: global.Constants.TIPO_ALERTA.EXITO
            });
        } else {

            // Se genera el modal
            setModalState({
                title: tituloModal.toUpperCase(),
                message: messageModal.toUpperCase(),
                show: true,
                redirect: '/Transacciones',
                from: { from: from, selected_id_etapa: selected_id_etapa, id_actuacion: getidMasActuacion },
                alert: global.Constants.TIPO_ALERTA.EXITO
            });
        }
    }

    return (
        <>
            {isRedirect ? redirectToRoutes() : null}
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            <Formik>
                <Form>
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Actuación {nombre}</small></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">SINPROC N° {radicado} :: <strong>CONTINUAR PROCESO</strong></h3>
                        </div>
                        <div className="block-content">
                            <div className='row'>
                                <div className='col-md-12'>

                                    <div className="block block-themed">
                                        <div className="block-content alert-warning">
                                            <div className="col-md-12 col-xl-12">
                                                <div className="custom-file">
                                                    <p>SE HA GENERADO EL NÚMERO DE AUTO <b>{getAuto != '' ? getAuto : null} </b> PARA EL DOCUMENTO {getNombreDelDocumento != '' ? getNombreDelDocumento.toUpperCase() : null}.</p>
                                                </div>
                                            </div>
                                            <br></br>
                                        </div>
                                    </div>                                    
                                    <button type='button' title='Descargar' className='btn btn-rounded btn-primary' onClick={() => handleDownloadArchivo()}>DESCARGAR DOCUMENTO DILIGENCIADO EN {getExtensionDocumento.toUpperCase()} CON NÚMERO DE AUTO. <i className="fas fa-download"></i> </button>
                                </div>
                            </div>
                            <div className="block-content block-content-full text-right">
                                <button type="button" className="btn btn-rounded btn-primary" onClick={() => continuar()}>CONTINUAR</button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );
}

export default ActuacionesSigueImpedimentos;