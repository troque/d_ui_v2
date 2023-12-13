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

function ActuacionesCargarArchivoDefinitivo() {

    const [errorApi, setErrorApi] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);
    const [inputListArchivos, setInputListArchivos] = useState([{ archivo: {}, filebase64: "", size: 0, ext: "" }]);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [inputActualizarArchivos, setInputActualizarArchivos] = useState([{ archivo: {}, filebase64: "", size: 0, ext: "", uuid: "" }]);
    const [getValidarAccion, setValidarAccion] = useState(0);
    const [getRtaInfoTrue, setRtaInfoTrue] = useState(false);
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0);
    const [getArchivosListaSearch, setArchivosListaSearch] = useState({ data: [], links: [], meta: [] });
    const [getMuestraBotonFechaParaSemaforo, setMuestraBotonFechaParaSemaforo] = useState(false);
    const [getidMasActuacion, setidMasActuacion] = useState();
    const [getMasActuacion, setMasActuacion] = useState({});

    const location = useLocation()
    const { getActuacionCierraProceso, getDespuesAprobacionListarActuacion, from, selected_id_etapa, nombre, uuid_actuacion, estadoActualActuacion, tipoActuacion, actuacionIdMaestra } = location.state

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let idEtapa = from.idEtapa >= 3 ? from.idEtapa : 3;
    let estado = 1;

    const [getRoutes, setRoutes] = useState({
        crear_registro: "/ActuacionesForm/",
        consultar_registros: "/ActuacionesLista/",
        ver_detalle: "/ActuacionesVer/" + procesoDisciplinarioId + "/" + selected_id_etapa + "/" + estado,
        muestra_atras: true,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        selected_id_etapa: selected_id_etapa,
        muestra_inactivos: true,
    });


    const redirectToRoutes = () => {
        return <Navigate to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }} />;
    }

    useEffect(() => {
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            obtenerMaestraActuacion()

            // Buscamos el detalle de los documentos
            GenericApi.getGeneric("archivo-actuaciones/get-archivo-actuaciones-by-uuid/" + uuid_actuacion).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se valida que haya informacion
                        if (datos.data.length > 0) {

                            // Se setea la informacion
                            setArchivosListaSearch(datos.data[0]);
                        }
                    }
                }
            )

            console.log("actuacionIdMaestra ActuacionesCargarArchivoDefinitivo -> ", actuacionIdMaestra);

            // Se usa el cargando
            window.showSpinner(true);

            // Se setea el id de la actuacion
            setidMasActuacion(actuacionIdMaestra);

            // Se consume la API
            GenericApi.getGeneric('semaforo').then(

                // Se inicializa la variable de respuesta
                datosSemaforo => {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se valida que no haya error
                    if (!datosSemaforo.error) {

                        // Se recore el array
                        datosSemaforo.data.forEach(element => {

                            // Se valida que haya una actuacion que inicie el proceso
                            if (element.attributes.id_mas_actuacion_inicia != null) {

                                // Se valida que la actuacion que inicia el proceso sea igual a la actuacion maestra
                                if (element.attributes.id_mas_actuacion_inicia.id == actuacionIdMaestra && element?.attributes?.id_mas_evento_inicio?.id == 3 && element?.attributes?.id_etapa == selected_id_etapa) {

                                    // Se setea el boton en true
                                    setMuestraBotonFechaParaSemaforo(true);
                                }
                            }
                        });
                    }
                }
            )
        }

        // Se llama el metodo principal
        fetchData();
    }, []);

    const obtenerMaestraActuacion = () => {
        GenericApi.getGeneric('mas_actuaciones/' + actuacionIdMaestra).then(
            // Se inicializa la variable de respuesta
            datos => {
                // Se valida que no haya error
                if (!datos.error) {
                    setMasActuacion(datos.data)
                }
            }
        )
    }

    const handleInputChangeArchivos = (e, index, actualizar = 0, id = 0, uuid_actuacion = 0, tipo_archivo = "") => {

        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);

            var error = 0;

            if (extension != "pdf") {
                setErrorApi("EL ARCHIVO SELECCIONADO NO TIENE UN FORMATO PERMITIDO. DEBE SER EN .pdf")
                window.showModal(1)
                error = 1;
                return false;
            }

            if (error == 0) {

                if (actualizar == 0) {
                    var list = [...inputListArchivos];
                    list[index][name] = files[0];
                } else {
                    var list = [...inputActualizarArchivos];
                    list[index][name] = files[0];
                    setValidarAccion(1);
                }

                if (files[0]) {
                    list[index][name] = files[0];
                } else {
                    list[index][name] = '';
                    list[index].filebase64 = '';
                    list[index].size = 0;
                    list[index].ext = "";
                    list[index].uuid = "";
                    if (actualizar == 0) {
                        setInputListArchivos(list);
                    } else {
                        setInputActualizarArchivos(list);
                    }
                    return false;
                }

                // Conversion a Base64
                Array.from(e.target.files).forEach(archivo => {
                    var reader = new FileReader();
                    reader.readAsDataURL(archivo);
                    reader.onload = function () {
                        var arrayAuxiliar = [];
                        var base64 = reader.result;
                        arrayAuxiliar = base64.split(',');
                        list[index].filebase64 = arrayAuxiliar[1];
                        list[index].ext = extension;
                        list[index].uuid = id;
                        if (actualizar == 0) {
                            setInputListArchivos(list);
                        } else {
                            list[index].uuid_actuacion = uuid_actuacion;
                            setInputActualizarArchivos(list);
                            setValidarAccion(1);
                        }
                        setRtaInfoTrue(true);
                        window.showModal(9)
                    }
                })
                obtenerPesoTotalArchivos(list);
            } else {
                if (actualizar == 0) {
                    var list = [...inputListArchivos];
                } else {
                    var list = [...inputActualizarArchivos];
                }
                list[index][name] = files[0];
                list[index].filebase64 = '';
                list[index].size = 0;
                list[index].uuid = "";
                if (actualizar == 0) {
                    setInputListArchivos(list);
                } else {
                    list[index].uuid_actuacion = uuid_actuacion;
                    setInputActualizarArchivos(list);
                }
            }
        } else {
            if (actualizar == 0) {
                var list = [...inputListArchivos];
            } else {
                var list = [...inputActualizarArchivos];
            }
            list[index][name] = '';
            list[index].filebase64 = '';
            list[index].size = 0;
            list[index].uuid = "";
            if (actualizar == 0) {
                setInputListArchivos(list);
            } else {
                setInputActualizarArchivos(list);
            }
            obtenerPesoTotalArchivos(list);
            return false;
        }
    }

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function obtenerPesoTotalArchivos(list) {
        let peso = 0;
        list.forEach(
            (archivo, index) => {
                if (archivo.archivo.size) {
                    peso += archivo.archivo.size;
                }
            }
        )

        if (peso > 15000000) {
            setErrorApi('El PESO/TAMAÑO DE TODOS LOS ARCHIVO SADJUNTOS SUPERAN LOS 15 MB PERMITIDOS PARA EL REGISTRO. VERIFIQUE EL TAMAÑO Y ELIMINE ALGUNOS ADJUNTOS')
            window.showModal(1)
        }

        setPesoTotalArchivos(peso);
    }

    function formatBytes(bytes, decimals = 3) {
        if (bytes === undefined) return '0 Bytes';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const handleDownloadArchivo = () => {
        try {
            window.showSpinner(true);

            // Se genera la peticion para descargar el archivo
            GenericApi.getGeneric("archivo-actuaciones/get-documento/" + getArchivosListaSearch.attributes.id + "/" + getArchivosListaSearch.attributes.extension).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, getArchivosListaSearch.attributes.nombre_archivo);
                    } else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                    window.showSpinner(false);
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

    const subirDocumentoDefinitivo = () => {

        // Se activa el loading
        window.showSpinner(true);

        // Se valida que haya informacion o un archivo existente
        if (!inputListArchivos[0].filebase64 &&
            !inputListArchivos[0].archivo.name &&
            !inputListArchivos[0].ext &&
            !inputListArchivos[0].archivo.size) {

            // Se activa el loading
            window.showSpinner(false);

            setModalState({
                title: "SINPROC No " + from.radicado + " :: CARGUE EL ARCHIVO DEFINITIVO",
                message: "DEBE AGREGAR UN DOCUMENTO EN FORMATO PDF",
                show: true, alert: global.Constants.TIPO_ALERTA.ERROR
            });
            return;
        }

        const data = {
            "data": {
                "type": 'archivo-actuaciones/up-documento',
                "attributes": {
                    "uuid_actuacion": uuid_actuacion,
                    "fileBase64": inputListArchivos[0].filebase64,
                    "nombre_archivo": inputListArchivos[0].archivo.name,
                    "extension": inputListArchivos[0].ext,
                    "peso": inputListArchivos[0].archivo.size,
                    "id_tipo_archivo": 2
                }
            }
        };

        GenericApi.addGeneric("archivo-actuaciones/up-documento", data).then(
            datos => {
                window.showSpinner(false);
                if (!datos.error) {
                    // si la actuacion tiene habilitada la opcion de cerrar el proceso
                    if (getActuacionCierraProceso == 1 || getActuacionCierraProceso == '1') {
                        const datadata = {
                            "data": {
                                "type": "cerrar_etapa",
                                "attributes": {
                                    "id_proceso_disciplinario": from.procesoDisciplinarioId,
                                    "id_etapa": selected_id_etapa,
                                    "id_funcionario_asignado": "",
                                    "descripcion": "",
                                    "created_user": ""
                                }
                            }
                        }
                        GenericApi.addGeneric("cierre-etapa/actuaciones", datadata)
                        setModalState({ title: "SINPROC N° " + from.radicado + " :: CARGA DE DOCUMENTO DEFINITIVO", message: 'EL PROCESO DISCIPLINARIO HA SIDO CERRADO', show: true, redirect: '/MisPendientes/', alert: global.Constants.TIPO_ALERTA.EXITO });
                    }
                    else{
                        if (getMuestraBotonFechaParaSemaforo) {
                            setModalState({
                                title: "SINPROC N° " + from.radicado + " :: CARGA DE DOCUMENTO DEFINITIVO",
                                message: "¡Documento subido con éxito!", show: true,
                                redirect: '/SeleccionDeFechaParaSemaforo',
                                from: { from: from, selected_id_etapa: selected_id_etapa, id: uuid_actuacion, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra },
                                alert: global.Constants.TIPO_ALERTA.EXITO
                            });
                        } else {
                            setModalState({
                                title: "SINPROC N° " + from.radicado + " :: CARGA DE DOCUMENTO DEFINITIVO",
                                message: global.Constants.MENSAJES_MODAL.EXITOSO,
                                show: true,
                                redirect: '/Transacciones',
                                from: { from: from, selected_id_etapa: selected_id_etapa, id_actuacion: getidMasActuacion },
                                alert: global.Constants.TIPO_ALERTA.EXITO
                            });
                        }
                    }                    
                } else {
                    setModalState({ title: "SINPROC N° " + from.radicado + " :: CARGA DE DOCUMENTO DEFINITIVO", message: datos.error.toString(), show: true, redirect: '/MisPendientes/', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
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
                            <h3 className="block-title">SINPROC N° {radicado} :: <strong>CARGUE DOCUMENTO DEFINITIVO</strong></h3>
                        </div>
                        <div className="block-content">
                            <div className='row'>
                                <div className='col-md-12'>
                                    {/* <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" /> */}
                                    <h3 className="block-title mb-4" style={{ color: 'black' }}> <b>CARGA DE DOCUMENTO DEFINITVO EN .PDF PARA ACTUACIÓN:</b> {nombre} </h3>
                                </div>
                                <div className='col-md-12'>
                                    <table className="table table-striped table-vcenter js-dataTable-full">
                                        <thead>
                                            <tr>
                                                {inputListArchivos.map((x, i) => {
                                                    return (
                                                        <div className="col-md-12" key={i}>
                                                            <div className="form-group" style={{
                                                                display: 'flex',
                                                                justifyContent: 'left'
                                                            }}>
                                                                <div className='row'>
                                                                    <button type='button' title='Descargar' className='btn btn-rounded btn-primary' onClick={() => handleDownloadArchivo()}>DESCARGAR DOCUMENTO DILIGENCIADO EN WORD { getMasActuacion?.data?.attributes?.generar_auto === '1' ? 'CON NÚMERO DE AUTO' : null } <i className="fas fa-download"></i> </button>
                                                                    <div className='col-md-12 mt-4'>
                                                                        <label >* { getMasActuacion?.data?.attributes?.generar_auto === '1' ? 'AUTO' : null } DILIGENCIADO EN PDF: </label>
                                                                    </div>
                                                                    <div className='col-md-12' style={{
                                                                        display: 'flex',
                                                                        justifyContent: 'left'
                                                                    }}>
                                                                        <div className='col-md-6'>
                                                                            <label className="custom-file-label" htmlFor="example-file-input-custom" name="input-file" data-toggle="custom-file-input">{x.archivo.name}</label>
                                                                            <input className="custom-file-input" data-toggle="custom-file-input" type="file" name="archivo" onChange={e => handleInputChangeArchivos(e, i)} required />
                                                                            <label style={{
                                                                                marginLeft: '-13px',
                                                                                marginTop: '10px'
                                                                            }}>PESO DEL ARCHIVO: {formatBytes(x.archivo.size)}</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                {/* <ListaBotones getRoutes={getRoutes} from={from} mostrarBotonAgregar={getMostrarBotonAgregar != null ? getMostrarBotonAgregar : validacionDeBotonAgregar()} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" /> */}
                            </div>

                            <div className="row">
                                <div className='col-md-12'>

                                </div>
                            </div>

                            <div className="block-content block-content-full text-right">
                                <button type="button" className="btn btn-rounded btn-primary" onClick={subirDocumentoDefinitivo}>{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                {/* {
                                    (getActuacionCierraProceso == 1 || getActuacionCierraProceso == '1')
                                    ?
                                        null
                                    :
                                        <Link to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}>
                                            <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                        </Link>
                                } */}
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );

}

export default ActuacionesCargarArchivoDefinitivo;