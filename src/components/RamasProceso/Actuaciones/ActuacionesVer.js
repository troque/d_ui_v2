import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { getUser, hasAccess } from '../../../components/Utils/Common'
import Spinner from '../../Utils/Spinner'
import InfoErrorApi from '../../Utils/InfoErrorApi'
import InfoExitoApi from '../../Utils/InfoExitoApi'
import InfoConfirmarAccion from '../../Utils/InfoConfirmarAccion'
import ModalActuaciones from '../../Utils/Modals/ModalActuaciones'
import { Link } from "react-router-dom"
import { useLocation } from 'react-router-dom'
import '../../Utils/Constants'
import ModalGen from '../../Utils/Modals/ModalGeneric'
import GenericApi from '../../Api/Services/GenericApi'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import ModalItemsVer from '../../Utils/Modals/ModalItemsVer'
import { quitarAcentos } from '../../Utils/Common';
import DatePerson from '../../DatePerson/DatePerson'
import DatePicker from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

function ActuacionesVer() {

    const [errorApi, setErrorApi] = useState('')
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false })
    const [getModalStateItems, setModalStateItems] = useState({ title: "", message: "", show: false, data: {} })
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE)
    const [pageActual, setPageActual] = useState(1)

    //Variables parametrizadas para la clase    
    const [getArticuloNombreTipoActuacion, setArticuloNombreTipoActuacion] = useState('')
    const [getNombreTipoActuacion, setNombreTipoActuacion] = useState('')
    const [getActuacion, setActuacion] = useState({ data: [] })
    const [getInformacionActuacion, setInformacionActuacion] = useState(false)
    const [getListaVisibilidadEstado, setListaVisibilidadEstado] = useState({ data: [] })
    const [getIdEstadoVisibilidadSeleccionado, setIdEstadoVisibilidadSeleccionado] = useState()
    const [getIdEtapaVisibilidadActual, setIdEtapaVisibilidadActual] = useState()
    const [getInputArchivo, setInputArchivo] = useState({ nombre: "", archivo: {}, filebase64: "", size: 0, ext: "" })
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0)   
    const [getListaActuaciones, setListaActuaciones] = useState([])
    const [getListaTrazabilidad, setListaTrazabilidad] = useState()  
    const [getUsuarioSolicitante, setUsuarioSolicitante] = useState("")
    const [getListaSemaforos, setListaSemaforos] = useState({ data: [] })    
    const [getIdEtapaSiguiente, setIdEtapaSiguiente] = useState()    
    const [getEtapaNombreSiguiente, setEtapaNombreSiguiente] = useState()
    const [getIdEtapaActual, setIdEtapaActual] = useState()
    const [getEtapaNombreActual, setEtapaNombreActual] = useState()
    const [getListaEtapas, setListaEtapas] = useState({ data: [] }) 
    const [getIncluirReporte, setIncluirReporte] = useState(false)
    const [getNombreProceso, setNombreProceso] = useState('')    
    const [getActualizarDocumento, setActualizarDocumento] = useState(false);
    const [getListaHistorialActuaciones, setListaHistorialActuaciones] = useState([]);
    const [getMostrarBotonTransacciones, setMostrarBotonTransacciones] = useState(true);
    const [getMostrarBotonGuardarLista, setMostrarBotonGuardarLista] = useState(true);
    const [getInputNumeroAuto, setInputNumeroAuto] = useState('');
    const [getFechaRegistro, setFechaRegistro] = useState();
    const [getFechaRegistroFormato, setFechaRegistroFormato] = useState();

    
    const [getActuacionEstaAprobadaSioNo, setActuacionEstaAprobadaSioNo] = useState(false) //REVISAR ESTO
    const [getMuestraBotonFechaParaSemaforo, setMuestraBotonFechaParaSemaforo] = useState(false) //REVISAR ESTO

    
    const [getSeach, setSeach] = useState('');
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [resultDiasNoLaborales, setResultDiasNoLaborales] = useState([]);
    const [getAnosAtrasInvalidos, setAnosAtrasInvalidos] = useState(0);

    const location = useLocation()
    const { from, selected_id_etapa, id, nombre, estadoActualActuacion, tipoActuacion, disable, actuacionIdMaestra } = location.state

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true)
            if(tipoActuacion == '0'){
                setArticuloNombreTipoActuacion('LA')
                setNombreTipoActuacion('ACTUACIÓN')
            }
            else if(tipoActuacion == '1'){
                setArticuloNombreTipoActuacion('EL')
                setNombreTipoActuacion('IMPEDIMENTO')
            }
            else{
                setArticuloNombreTipoActuacion('EL')
                setNombreTipoActuacion('COMISORIO')
            }
            obtenerActuacion()
            getApiDiasNoLaborales()
        }
        fetchData()
    }, [])

    /**
     * LLAMADO DE FUNCIONES AL SERVIDOR
    */

    //Obtener la información de una actuacion
    const obtenerActuacion = () => {
        GenericApi.getGeneric('actuacion-proceso-disciplinario/' + id).then(
            datos => {
                if (!datos.error) {
                    setActuacion(datos)
                    if(datos.data.attributes.firmas.length > 0){
                        let firmasDefinitivas = datos.data.attributes.firmas.filter(
                            data => data.estado.toString() === global.Constants.ESTADO_FIRMA_MECANICA.FIRMADO.toString()
                        )
                        let firmasPendientes = datos.data.attributes.firmas.filter(
                            data => data.estado.toString() === global.Constants.ESTADO_FIRMA_MECANICA.PENDIENTE_FIRMA.toString()
                        )
                        if(firmasPendientes.length <= 0 && firmasDefinitivas.length > 0){
                            setMostrarBotonGuardarLista(false)
                        }
                    }

                    setIdEtapaVisibilidadActual(datos.data.attributes.id_estado_visibilidad)
                    setInformacionActuacion(true)
                    cargarEstadoVisibilidad()
                } else {
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                    window.showSpinner(false)
                }
            }
        )
    }


    //Obtener los estado de visibilidad
    const cargarEstadoVisibilidad = () => {
        GenericApi.getGeneric('mas-estado-visibilidad/estado/1').then(
            datos => {
                if (!datos.error) {
                    setListaVisibilidadEstado(datos)                    
                    cargarActuaciones()
                } else {
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                    window.showSpinner(false)
                }
            }
        )
    }

    //Carga las actuaciones del sistema
    const cargarActuaciones = () => {

        const data = {
            "data": {
                "type": "usuario",
                "attributes": [
                    {
                        "id_actuacion_principal": id,
                        "id_proceso_disciplinario": from.procesoDisciplinarioId
                    }
                ]
            }
        }

        // Se consume la API
        //GenericApi.getGeneric('actuaciones/get-actuaciones-discipl-documento-final/' + from.procesoDisciplinarioId + '/1').then(
        GenericApi.getByDataGeneric('actuaciones/get-actuaciones-inactivas', data).then(

            // Se inicializa la variable de respuesta
            datos => {
                // Se valida que no haya error
                if (!datos.error) {
                    // Se setean los datos
                    setListaActuaciones(datos.data)
                    cargarTrazabilidad(true)
                } else {
                    // Se setea el error
                    setErrorApi(datos.error.toString())
                    // Se muestra el modal
                    window.showModal(1)
                    window.showSpinner(false)
                }
            }
        )
    }

    //Carga la trazabilidad de la actuacion
    const cargarTrazabilidad = (cascada = false) => {
        
        GenericApi.getGeneric("trazabilidad-actuaciones/get-all-trazabilidad-actuaciones-uuid/" + id).then(

            // Se inicializa la variable de respuesta
            datos => {
                // Se valida que no haya error
                if (!datos.error) {
                    // Se valida que haya informacion
                    if (datos.data.length > 0) {
                        // Se setean los valores
                        setListaTrazabilidad(datos)
                        setUsuarioSolicitante(datos.data[0].attributes.created_user)
                    }
                    if(cascada){
                        cargarSemaforosActuacion()
                    }
                    else{
                        window.showSpinner(false)
                    }
                }
                else {
                    // Se setea el error
                    setErrorApi(datos.error.toString())
                    // Se muestra el modal
                    window.showModal(1)
                    window.showSpinner(false)
                }
            }
        )
    }

    const cargarSemaforosActuacion = () => {
        GenericApi.getByIdGeneric('getDiasTranscurridos/actuacion', id).then(
            datosDiasTranscurridos => {

                if (!datosDiasTranscurridos.error) {
                    /*datosDiasTranscurridos.data.forEach(element => {
                        if (SemaforoColor(element) == "Azul") {
                            //GenericApi.getGeneric('set-finaliza-asemaforo/' + element.attributes.actuacionxsemaforo.attributes.id_semaforo.id + "/" + id)
                            let data = {
                                "data": {
                                    "type": "semaforo",
                                    "attributes": {
                                        "id_proceso_disciplinario": id,
                                        "id_semaforo": element.attributes.actuacionxsemaforo.attributes.id_semaforo.id,
                                        "id_actuacion_finaliza": null,
                                        "id_dependencia_finaliza": null,
                                        "id_usuario_finaliza": null
                                    }
                                }
                            }
    
                            GenericApi.getByDataGeneric('set-finaliza-semaforo', data)
                        }
                    })*/
                    setListaSemaforos(datosDiasTranscurridos)
                    obtenerEtapas()
                }
                else{
                    window.showSpinner(false)
                }
            }
        )
    }

    const obtenerEtapas = () => {
        GenericApi.getAllGeneric('mas-etapa-nuevos').then(
            datos => {
                if (!datos.error) {
                    setListaEtapas(datos)
                    cargarSemaforos()
                }
                else{
                    window.showSpinner(false)
                }
            }
        )
    }

    const cargarSemaforos = () => {
        GenericApi.getGeneric('semaforo').then(
            // Se inicializa la variable de respuesta
            datosSemaforo => {    
                // Se valida que no haya error
                if (!datosSemaforo.error) {    
                    // Se recorre la informacion
                    datosSemaforo.data.forEach(element => {
                        // Se valida que el ic de la actuacion inicial sea diferente de null
                        if (element.attributes.id_mas_actuacion_inicia != null) {    
                            // Se valida que el id de la actuacion inicial sea igual a la actuacion actual
                            if (element.attributes.id_mas_actuacion_inicia.id == actuacionIdMaestra
                                && element?.attributes?.id_mas_evento_inicio?.id == 3
                            ) {    
                                // Se setea en true
                                setMuestraBotonFechaParaSemaforo(true)
                            }
                        }
                    })
                    nombreProceso()
                }
                else{
                    window.showSpinner(false)
                }
            }
        )
    }

    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso",from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }
                else{
                    setModalState({ title: "ACTUACIONES", message: datos.error.toString(), show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR })
                }
                window.showSpinner(false)
            }
        )
    }

    const getApiDiasNoLaborales = () => {
        //ParametrosMasApi.getAllDiasNoLaborales().then(
        GenericApi.getGeneric("dias-no-laborales?estado=1").then(
            datos => {
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
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }

        )
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
                        setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                        window.showSpinner(false);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    /**
     * LLAMADO DE FUNCIONES DE LA CLASE
     */

    const onCambiarVisibilidad = (idEtapaVisibilidad) => {
        window.showSpinner(true)
        GenericApi.getAllGeneric("actuaciones/set-etapa-visibilidad/"+id+"/"+idEtapaVisibilidad).then(
            datos => {
                if (!datos.error) {
                    setIdEstadoVisibilidadSeleccionado(idEtapaVisibilidad)
                    setIdEtapaVisibilidadActual(idEtapaVisibilidad)
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: 'CAMBIOS ACTUALIZADOS', show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO })
                } else {
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: datos.error.toString(), show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR })
                }         
                window.showSpinner(false)
            }
        )
    }

    const handleClicArchivo = (id_documento, extension, nombre_documento) => {

        try {
            window.showSpinner(true)

            // Se genera la peticion para descargar el archivo
            GenericApi.getGeneric("archivo-actuaciones/get-documento/" + id_documento + "/" + extension).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento)
                    } else {
                        setErrorApi(datos.error.toString().toUpperCase())
                        window.showModal(1)
                    }
                    window.showSpinner(false)
                }
            )
        } catch (error) {
            console.error(error)
        }
    }

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`
        const downloadLink = document.createElement("a")
        downloadLink.href = linkSource
        downloadLink.download = fileName
        downloadLink.click()
    }

    const handleInputChangeArchivos = (e, borrador) => {
        let extAux = e.target.files[0].name.split('.')
        if(borrador){
            if (extAux[extAux.length - 1].toUpperCase() !== global.Constants.TIPO_DOCUMENTO_PERMITIDO_ACTUACIONES.DOCX.toUpperCase()) {
                setErrorApi("EL ARCHIVO SELECCIONADO NO TIENE UN FORMATO PERMITIDO. DEBE SER '.DOCX'.")
                setInputArchivo({})
                window.showModal(1)
                return false
            }
        }
        else{
            if (extAux[extAux.length - 1].toUpperCase() !== global.Constants.TIPO_DOCUMENTO_PERMITIDO_ACTUACIONES.PDF.toUpperCase()) {
                setErrorApi("EL ARCHIVO SELECCIONADO NO TIENE UN FORMATO PERMITIDO. DEBE SER '.PDF'.")
                setInputArchivo({})
                window.showModal(1)
                return false
            }
        }
        
        //Conversion a Base64
        Array.from(e.target.files).forEach(file => {
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function () {
                var base64Aux = []
                var extAux = []
                var base64 = reader.result
                base64Aux = base64.split(',')
                extAux = file.name.split('.')
                setInputArchivo({
                    nombre: file.name,
                    archivo: {}, 
                    filebase64: base64Aux[1], 
                    size: file.size, 
                    ext: extAux[extAux.length - 1]
                })
                if(borrador){
                    setActualizarDocumento(true)
                }
                window.showModal(9)
            }
        })

        obtenerPesoTotalArchivos(getInputArchivo)
    }

    function formatBytes(bytes, decimals = 3) {
        if (bytes === undefined) return '0 Bytes'
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }

    function obtenerPesoTotalArchivos(archivo) {
        let peso = 0
        if (archivo.size) {
            peso += archivo.archivo.size
        }

        if (peso > 15000000) {
            setErrorApi('El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro, verifique e tamaño y elimine algunos adjuntos.')
            window.showModal(1)
        }

        setPesoTotalArchivos(peso)
    }

    const agregarCheckInactivos = (e, index) => {
        var inactivo = getListaActuaciones
        if(e){
            inactivo[index].estado_inactivo = '1'
        }
        else{
            inactivo[index].estado_inactivo = '0'
        }
        setListaActuaciones(inactivo)
    }

    const listarActuacionesActivas = () => {
        return (
            getListaActuaciones.map((actuacion, index) => {
                if(actuacion.id_actuacion !== id){
                    return (
                        <tr key={(index)}>
                            <td>
                                { actuacion.nombre_actuacion } - { actuacion.auto ? actuacion.auto : 'SIN NÚMERO AUTO' }
                            </td>
                            <td>
                                { actuacion.nombre_etapa }
                            </td>
                            <td>
                                <small><strong>USUARIO:</strong> { actuacion.nombre_usuario + " " + actuacion.apellido_usuario }</small><br />
                                <small> { actuacion.fecha_creacion }</small><br />
                            </td>
                            <td className='text-center'>
                                <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo(actuacion.id_archivo, actuacion.extension_archivo, actuacion.nombre_archivo)}><i className="fas fa-download"></i></button>
                            </td>
                            <td>
                                { actuacion.numero_notificaciones }
                            </td>
                            <td>
                                <div className="custom-control custom-switch custom-control-lg mb-2">
                                    {
                                        <>
                                            <input defaultChecked={actuacion.estado_inactivo == '1'} type="checkbox" onChange={e => agregarCheckInactivos(e.target.checked, index)} className="custom-control-input" id={actuacion.id_actuacion} name={actuacion.id_actuacion} disabled={!getMostrarBotonGuardarLista}/>
                                            <label className="custom-control-label" htmlFor={actuacion.id_actuacion}></label>
                                        </>
                                    }
                                </div>
                            </td>
                        </tr>
                    )
                }
            })
        )
    }

    const showModalCambioEtapaActuacion = () => {
        window.showModalEtapaConfirmacionActuaciones(true)
    }

    const onCambiarEtapa = () => {
        window.showSpinner(true)
        GenericApi.getAllGeneric("actuaciones/set-etapa/"+id+"/"+getIdEtapaSiguiente).then(
            datos => {
                if (!datos.error) {
                    
                    let actuacionAux = getActuacion
                    actuacionAux.data.attributes.etapa_siguiente = {
                        'id': getIdEtapaSiguiente,
                        'nombre': getEtapaNombreSiguiente,
                    }
                    setEtapaNombreActual(getEtapaNombreSiguiente)
                    setIdEtapaActual(getIdEtapaSiguiente)
                    actuacionAux.data.attributes.acciones.mostrar_mensaje_informativo_para_aprobar = getActuacion.data.attributes.acciones.mostrar_mensaje_informativo_para_aprobar.filter(dato => dato.tipo !== 'etapa');
                    setActuacion(actuacionAux)
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: 'CAMBIOS ACTUALIZADOS', show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO })
                } else {
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: datos.error.toString(), show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR })
                }         
                window.showSpinner(false)
            }
        )
    }

    const obtenerEtapa = (idEtapa) => {
        if(idEtapa){
            setIdEtapaSiguiente(idEtapa)
            setEtapaNombreSiguiente(getListaEtapas.data.find(dato => idEtapa === dato.id).attributes.nombre)
            showModalCambioEtapaActuacion()
        }
    }

    /*Modal: mensaje de confirmación para realizar el cambio de etapa */
    const componentEtapaAlertConfirmacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-cambio-etapa-actuaciones" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">{getNombreProceso} :: CONFIRMACIÓN DE CAMBIO DE ETAPA</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <p>¿DESEA MODIFICAR EL CAMBIO DE ETAPA A { getEtapaNombreSiguiente } ?</p>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => onCambiarEtapa()}>{global.Constants.BOTON_NOMBRE.ACTUALIZAR}</button>
                                    <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal" onClick={() => (setEtapaNombreSiguiente(getEtapaNombreActual), setIdEtapaSiguiente(getIdEtapaActual))}>{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const obtenerFechaRegistro = (fecha) => {
        fecha = moment(fecha).format("YYYY-MM-DD")
        let fechaFormato = moment(fecha).format("DD/MM/YYYY")
        if(fecha){
            setFechaRegistro(fecha)
            setFechaRegistroFormato(fechaFormato)
            showModalCambioFechaRegistroActuacion()
        }
    }

    const showModalCambioFechaRegistroActuacion = () => {
        window.showModalFechaRegistroConfirmacionActuaciones(true)
    }

    /*Modal: mensaje de confirmación para realizar el cambio de fecha registro */
    const componentFechaRegistroAlertConfirmacion = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-cambio-fecha-registro-actuaciones" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">{getNombreProceso} :: CONFIRMACIÓN DE FECHA DE REGISTRO</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <p>¿DESEA MODIFICAR LA FECHA DE REGISTRO DEL { getActuacion?.data?.attributes?.fecha_registro } POR LA FECHA { getFechaRegistroFormato }?</p>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => onCambiarFechaRegistro()}>{global.Constants.BOTON_NOMBRE.ACTUALIZAR}</button>
                                    <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal" onClick={() => setFechaRegistro()}>{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const onCambiarFechaRegistro = () => {
        window.showSpinner(true)
        GenericApi.getAllGeneric("actuaciones/set-fecha-registro/"+id+"/"+getFechaRegistro).then(
            datos => {
                if (!datos.error) {                    
                    let actuacionAux = getActuacion
                    actuacionAux.data.attributes.fecha_registro = getFechaRegistro
                    setActuacion(actuacionAux)
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: 'CAMBIOS ACTUALIZADOS', show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO })
                } else {
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: datos.error.toString(), show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR })
                }         
                window.showSpinner(false)
            }
        )
    }

    // Metodo encargado de mostrar los campos adicionales de la actuación
    const verCamposAdicionales = () => {

        // Se captura la informacion de los campos
        let informacionCampos = getActuacion.data.attributes.campos_finales

        let dependenciaCreadora = false
        if(getActuacion.data.attributes.dependencia_creadora.id == getUser().id_dependencia){
            dependenciaCreadora = true
        }

        // Se setea los valores
        setModalStateItems({ title: getNombreProceso + " :: CAMPOS ADICIONALES", show: true, data: informacionCampos, showButton: false, permitirEditar: dependenciaCreadora, uuidActuacion: id })
    }

    const onCambiarIncluirReporte = (valor) => {
        window.showSpinner(true)
        var valorEnvio = 0
        if(valor){
            valorEnvio = 1
        }
        GenericApi.getAllGeneric("actuaciones/set-reporte/"+id+"/"+valorEnvio).then(
            datos => {
                if (!datos.error) {
                    setIncluirReporte(valor)
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: 'CAMBIOS ACTUALIZADOS', show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO })
                } else {
                    setIncluirReporte(!valor)
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: datos.error.toString(), show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR })
                }         
                window.showSpinner(false)
            }
        )
    }

    function onChangeNumeroAuto(numeroAuto){
        setInputNumeroAuto(numeroAuto)
    }

    function saveNumeroAuto(){
        let data = {

            "data": {
                "type": "actuaciones",
                "attributes": {
                    "numero_auto": getInputNumeroAuto
                }
            }
        }

        window.showSpinner(true)

        GenericApi.addGeneric("actuaciones/set-guardar-auto/"+getActuacion.data.id, data).then(
            datos => {
                if (!datos.error){

                }
                else{
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                }
                window.showSpinner(false)
            }
        )
    }

    const disableCustomDt = (current) => {
        const bloqueaDiasFuturos = true;


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

    const componenteAccionesCabecera = () => {
        return (
            <>
                <div className="row">
                    <div className="col-md-12 col-xl-12">
                        <a className="block block-rounded block-link-shadow">
                            <div className="block-content d-flex align-items-center justify-content-between">
                                <p><label>CREADO POR: </label> { getActuacion.data.attributes.trazabilidad_primer_registro.nombre_usuario.toUpperCase() } { getActuacion.data.attributes.trazabilidad_primer_registro.apellido_usuario.toUpperCase() }</p>
                                <p><label>CREADO POR LA DEPENDENCIA: </label> { getActuacion.data.attributes.trazabilidad_primer_registro.nombre_dependencia.toUpperCase() }</p>
                                <p><label>ETAPA: </label> { getActuacion.data.attributes.etapa.nombre  }</p>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-xl-4">
                        <a className="block block-rounded block-link-shadow">
                            <div className="block-content block-content-full d-flex align-items-center justify-content-between">
                                <div className="item item-circle bg-body-light">
                                    <i className="far fa-file fa-2x text-primary"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="font-size-lg font-w600 mb-0">
                                        { getActuacion.data.attributes.mas_actuacion.nombre_actuacion.toUpperCase() }
                                    </p>
                                    <p className="text-muted mb-0">
                                        { getNombreTipoActuacion }
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-xl-4">
                        <a className="block block-rounded block-link-shadow">
                            <div className="block-content block-content-full d-flex align-items-center justify-content-between">
                                <div className="item item-circle bg-body-light">
                                    <i className="fa fa-file-signature fa-2x text-primary"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="font-size-lg font-w600 mb-0">
                                        {
                                            getActuacion.data.attributes.acciones.mostrar_boton_guardar_auto
                                            ?
                                                <div className="form-group">
                                                    <input type="text" className="form-control" placeholder='Escriba el auto' id="input_numero_auto" name='input_numero_auto' defaultValue={ getActuacion.data.attributes.auto ? getActuacion.data.attributes.auto : '' } onChange={e => onChangeNumeroAuto(e.target.value)}/>
                                                </div>
                                            :
                                                getActuacion.data.attributes.auto ? getActuacion.data.attributes.auto : 'SIN NÚMERO AUTO'
                                        }
                                    </p>
                                    <p className="text-muted mb-0">
                                        {
                                            getActuacion.data.attributes.acciones.mostrar_boton_guardar_auto
                                            ?
                                                <button type="button" className="btn btn-rounded btn-primary" onClick={() => saveNumeroAuto()}>GUARDAR AUTO</button>
                                            :
                                               'AUTO'
                                        }
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-xl-4">
                        <a className="block block-rounded block-link-shadow">
                            <div className="block-content block-content-full d-flex align-items-center justify-content-between">
                                <div className="item item-circle bg-body-light">
                                    <i className="fa fa-info-circle fa-2x" style={{ color: getActuacion.data.attributes.acciones.color_estado }}></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="font-size-lg font-w600 mb-0">
                                        { getActuacion.data.attributes.estado_actuacion.nombre.toUpperCase() }
                                    </p>
                                    <p className="text-muted mb-0">
                                        ESTADO
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-xl-6">
                        {
                            getActuacion.data.attributes.acciones.mostrar_cuadro_advertencia
                            ?
                                <div className="block block-themed">
                                    <div className="block-header block-header-warning">
                                        <h3 className="block-title">CAMBIOS GENERADOS POR { getArticuloNombreTipoActuacion } { getNombreTipoActuacion }</h3>
                                    </div>
                                    <div className="block-content alert-warning">
                                        <ul className="list-group push">
                                            {
                                                getActuacion.data.attributes.mas_actuacion.etapa_siguiente === '1'
                                                ?
                                                    <li className="list-group-item">UNA VEZ APROBADA, SE AVANZARÁ A LA ETAPA: <b>{ getEtapaNombreSiguiente ? getEtapaNombreSiguiente : ( getActuacion.data.attributes.etapa_siguiente ? getActuacion.data.attributes.etapa_siguiente.nombre : 'SIN DEFINIR') }</b></li>
                                                :
                                                    null
                                            }
                                            {
                                                getActuacion.data.attributes.mas_actuacion.excluyente === '1'
                                                ?
                                                    <li className="list-group-item">NO SE PUEDEN CREAR MÁS ACTUACIONES ADICIONALES</li>
                                                :
                                                    null
                                            }
                                            {
                                                getActuacion.data.attributes.mas_actuacion.despues_aprobacion_listar_actuacion === '1'
                                                ?
                                                    <li className="list-group-item">DESPUÉS DE LA APROBACIÓN, SE ANULARÁN LAS ACTUACIONES SELECCIONADAS</li>
                                                :
                                                    null
                                            }
                                            {
                                                getActuacion.data.attributes.mas_actuacion.cierra_proceso === '1'
                                                ?
                                                    <li className="list-group-item">SE DARÁ FIN AL PROCESO ACTUAL</li>
                                                :
                                                    null
                                            }
                                        </ul>
                                    </div>
                                </div>
                            :
                                null
                        }
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <a className="block block-rounded block-link-shadow">
                            <div className="block-content block-content-full d-flex align-items-center justify-content-between">
                                <div className="item item-circle bg-body-light">
                                    <i className="fa fa-calendar-alt fa-2x text-primary"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    {
                                        getActuacion.data.attributes.acciones.editar_fecha_registro
                                        ?
                                            <div>
                                                <DatePicker
                                                    id="fechaRegistro"
                                                    locale='es'
                                                    name="fechaRegistro"
                                                    dateFormat="DD/MM/YYYY"
                                                    closeOnSelect={true}
                                                    placeholder="dd/mm/yyyy"
                                                    onChange={(date) => obtenerFechaRegistro(date)}
                                                    timeFormat={false}
                                                    initialValue={getActuacion.data.attributes.fecha_registro}
                                                    isValidDate={disableCustomDt}
                                                />
                                            </div>
                                        :
                                            <p className="font-size-lg font-w600 mb-0">
                                                { getActuacion.data.attributes.fecha_registro }
                                            </p>
                                    }
                                    <p className="text-muted mb-0">
                                        FECHA REGISTRO
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <a className="block block-rounded block-link-shadow">
                            <div className="block-content block-content-full d-flex align-items-center justify-content-between">
                                <div className="item">
                                </div>
                                <div className="ml-3">
                                    {/* Barra de navegación de acciones */}
                                    <div className='row'>
                                        {
                                            from.mismoUsuarioBuscador
                                            ?
                                                <div>
                                                    <div className="dropdown dropleft">
                                                        <button type="button" className="btn btn-rounded btn-primary dropdown-toggle" id="dropdown-default-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            ACCIONES
                                                        </button>
                                                        {/* Barra de opciones */}
                                                        <div className="dropdown-menu" aria-labelledby="dropdown-default-primary">                                                    
                                                            <div className="bg-primary rounded-top font-w600 text-white text-center p-3">
                                                                OPCIONES
                                                            </div>
                                                            {
                                                            getActuacionEstaAprobadaSioNo && getMuestraBotonFechaParaSemaforo
                                                            ?
                                                                <div className='p-1'>
                                                                    <a className="dropdown-item">
                                                                        <Link className="font-size-h5 font-w600" to={"/SeleccionDeFechaParaSemaforo/"} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }}>
                                                                            SELECCIÓN DE FECHA PARA SEMÁFORO
                                                                        </Link>
                                                                    </a>
                                                                </div>
                                                            : 
                                                                null
                                                            }
                                                            {
                                                                (
                                                                    tipoActuacion == "1" && hasAccess('SeleccionarDependenciaDuenaDelProceso', 'Gestionar')
                                                                )
                                                                ?
                                                                    <div className='p-1'>
                                                                        <Link className="dropdown-item" to={"/SeleccionarDuenoProceso/"} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }}>
                                                                            ASIGNAR NUEVA DEPENDENCIA DUEÑA DEL PROCESO
                                                                        </Link>
                                                                    </div>
                                                                : 
                                                                    null
                                                            }
                                                            {
                                                                getActuacion.data.attributes.acciones.mostrar_boton_accion_transacciones && getMostrarBotonTransacciones
                                                                ?
                                                                    <div className='p-1'>
                                                                        <Link className="dropdown-item" to="/Transacciones" state={{ from: from, selected_id_etapa: selected_id_etapa, id_actuacion: getActuacion.data.attributes.mas_actuacion.id, actuacionIdMaestra: actuacionIdMaestra }}>
                                                                            TRANSACCIONES
                                                                        </Link>
                                                                    </div>
                                                                :
                                                                null
                                                            }

                                                            {/* Si no es un comisorio y es es diferente de Pendiente de aprobacion */}
                                                            {/* {(estadoActualActuacion == "Pendiente aprobación" || estadoActualActuacion == "Solicitud inactivación rechazada") && */}
                                                            {
                                                                getActuacion.data.attributes.acciones.mostrar_boton_accion_solicitud_inactivacion
                                                                ?
                                                                    <div className='p-1'>
                                                                        <Link className="dropdown-item" to={`/ActuacionesSolicitudDeAnulacion/`} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, actuacionIdMaestra: actuacionIdMaestra, activacion: false }}>
                                                                            SOLICITAR INACTIVACIÓN
                                                                        </Link>
                                                                    </div>
                                                                : 
                                                                    null
                                                            }
                                                            {
                                                                getActuacion.data.attributes.acciones.mostrar_boton_accion_solicitud_activacion
                                                                ?
                                                                    <Link className="dropdown-item" to={`/ActuacionesSolicitudDeAnulacion/`} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, actuacionIdMaestra: actuacionIdMaestra, activacion: true }}>
                                                                        SOLICITAR ACTIVACIÓN
                                                                    </Link>
                                                                : 
                                                                    null
                                                            }

                                                            {
                                                                getActuacion.data.attributes.campos_finales.length > 0
                                                                ?
                                                                    <a className="dropdown-item" onClick={() => verCamposAdicionales()}>
                                                                        VER CAMPOS ADICIONALES
                                                                    </a>
                                                                : 
                                                                    null
                                                            }
                                                            {
                                                                getActuacion.data.attributes.acciones.mostrar_boton_visiblidad
                                                                ?
                                                                <>                                                       
                                                                    <div className="bg-primary rounded-top font-w600 text-white text-center p-3">
                                                                        VISIBILIDAD
                                                                    </div>
                                                                    {
                                                                        getListaVisibilidadEstado.data.map((estado, i) => {
                                                                            return (
                                                                                <div className='p-1' onClick={() => (onCambiarVisibilidad(estado.id))}>
                                                                                    <a className="dropdown-item" key={i}>
                                                                                            { (getIdEtapaVisibilidadActual.toString() === estado.id.toString()) ? <i className='fa fa-check'></i> : null } { estado.nombre }
                                                                                    </a>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </>
                                                                :
                                                                    null
                                                            }
                                                            <div className="dropdown-divider"></div>
                                                            <a className='dropdown-item'>
                                                                <div className="custom-control custom-switch mb-1 text-center">
                                                                    <input type="checkbox" className="custom-control-input" id="incluir_reporte" name="incluir_reporte" checked={getIncluirReporte} onChange={e => onCambiarIncluirReporte(e.target.checked)} />
                                                                    <label className="custom-control-label" htmlFor="incluir_reporte">INCLUIR EN EL REPORTE</label>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            :
                                                null
                                        }
                                        <div className='mb-2'>
                                            <Link to={`/ActuacionesLista/`} title='REGRESAR A LA LISTA DE ACTUACIONES' state={{ from: from, selected_id_etapa: selected_id_etapa, disable: disable }}>
                                                <button type="button" className="btn btn-rounded btn-primary"><i className="fas fa-backward"></i></button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </>
        )
    }

    const listaArchivosActuacion = () => {
        return (getActuacion.data.attributes.archivos.map((archivo, index) => {
            return (
                <tr key={index}>
                    <td>
                        {archivo.nombre_tipo_archivo.toUpperCase()}
                    </td>
                    <td>
                        {archivo.nombre_archivo.toUpperCase()}
                    </td>
                    <td className='text-center'>
                        {
                            getActuacion.data.attributes.archivos.length > 1
                            ?
                                (
                                    getActuacion.data.attributes.archivos.length - 1 === index
                                    ?
                                        <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo(archivo.uuid, archivo.extension, archivo.nombre_archivo)}><i className="fas fa-download"></i></button>
                                    :
                                        null
                                )
                            :
                                <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo(archivo.uuid, archivo.extension, archivo.nombre_archivo)}><i className="fas fa-download"></i></button>
                        }
                    </td>
                    <td style={{ width: '35%' }}>
                        {
                            getActuacion.data.attributes.acciones.mostrar_input_carga_archivo_borrador && from.mismoUsuarioBuscador
                            ?                                
                                <div className="custom-file" style={{ display: 'inherit' }}>
                                    <label className="custom-file-label" htmlFor="cargaBorrador" data-toggle="custom-file-input">{getInputArchivo.nombre} </label>
                                    <input className="custom-file-input" id="cargaBorrador" data-toggle="custom-file-input" type="file" name="archivo" accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => handleInputChangeArchivos(e, true)} />
                                    <label>PESO DEL ARCHIVO: {formatBytes(getInputArchivo.size)}</label>
                                </div>
                            : 
                                <label>NO SE PUEDE ACTUALIZAR.</label>                                 
                        }
                    </td>
                </tr >
            )
        }))
    }

    const showModalConfirmacionHistorialListaActuacionesInactivas = (listaHistorial) => {
        setListaHistorialActuaciones(listaHistorial)
        window.showConfirmacionHistorialListaActuacionesInactivas(true)
    }

    const listaHistorialTrazabilidad = () => {
        if(getListaHistorialActuaciones){
            return (getListaHistorialActuaciones.map((actuacion, index) => {
                return (
                    <tr key={(index)}>
                        <td>
                            { actuacion.nombre_actuacion.toUpperCase() }
                        </td>
                        <td>
                            { actuacion.nombre_etapa.toUpperCase() }
                        </td>
                        <td>
                            <small>{ actuacion.nombre_usuario.toUpperCase() + " " + actuacion.apellido_usuario.toUpperCase() }</small><br />
                            <small><strong>{ actuacion.nombre_dependencia }</strong></small><br />
                        </td>
                        <td className='text-center'>
                            { actuacion.estado_anulacion_registro === '1' ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i> }
                        </td>
                    </tr>
                )
            }))
        }
    }

    const componentModalHistorialListaActuacionesInactivadas = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-popout-historial-lista-actuaciones-inactivas" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">{ getNombreProceso } :: ACTUACIONES INACTIVADAS EL { getListaHistorialActuaciones.length > 0 ? getListaHistorialActuaciones[0].fecha_creacion  : null }</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                        <thead>
                                            <tr>
                                                <th width="25%">ACTUACIÓN</th>
                                                <th width="25%">ETAPA</th>
                                                <th width="25%">REALIZADO POR</th>
                                                <th width="10%">ANULADO</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            { listaHistorialTrazabilidad() }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const listaTrazabilidad = () => {
        return (getListaTrazabilidad.data.map((t) => {
            
            //REVISAR ESTO
            if (t.attributes.nombre_estado_actuacion === global.Constants.ESTADOS_ACTUACION.APROBADA && getActuacionEstaAprobadaSioNo) {
                setActuacionEstaAprobadaSioNo(true)
            }

            let nombreDependencia = t.attributes.id_dependencia == "" ? "" : " (" + t.attributes.id_dependencia.nombre + ")"
            return (
                <tr key={t.attributes.id}>
                    <td>
                        {t.attributes.created_at.toUpperCase()}
                    </td>
                    <td>
                        {t.attributes.usuario.nombre.toUpperCase() + " " + t.attributes.usuario.apellido.toUpperCase() + nombreDependencia.toUpperCase()}
                    </td>
                    <td>
                        {t.attributes.updated_user.toUpperCase()}
                    </td>
                    <td>
                        {t.attributes.nombre_estado_actuacion.toUpperCase()}
                    </td>
                    { 
                        t.attributes.actuaciones_inactivas.length > 0
                        ?
                            <td style={{ padding: '0px' }}>
                                <table style={{ padding: '0px', width: '100%' }}>
                                    <tr>
                                        <td>{ t.attributes.observacion.toUpperCase() }</td>
                                        <td>
                                            <button type='button' title='MIRAR ACTUACIONES INACTIVADAS' className='btn btn-sm btn-primary' onClick={() => showModalConfirmacionHistorialListaActuacionesInactivas(t.attributes.actuaciones_inactivas)}><i className="fas fa-search"></i></button>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        :
                            <td>
                                { t.attributes.observacion.toUpperCase() }
                            </td>
                    }
                </tr>
            )
        }))
    }

    const usuarioJefe = () => {
        if(getUser().id.toString() === getUser().nombre_dependencia.id_usuario_jefe.toString()){
            return true
        }
        else{
            return false
        }
    }

    const handleClicEliminarFirmaUser = (idFirma) => {
        let data = {
            "data": {
                "type": "Agregar Usuario",
                "attributes": {
                    "estado": global.Constants.ESTADO_FIRMA_MECANICA.ELIMINADO,
                }
            }
        }

        window.showSpinner(true)

        GenericApi.updateGeneric("actuaciones/set-eliminar-firmas-mecanicas", idFirma, data).then(
            datos => {

                if (!datos.error) {
                    window.location.reload()
                } 
                else {
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                }
                window.showSpinner(false)
            }
        )
    }

    const listaFirmasMecanicas = () => {

        // Se inicializa la constante del titulo
        const tituloModal = "SINPROC NO " + from.radicado + " :: FIRMAR ACTUACIÓN"
        const messageModal = "FALTA AGREGAR FIRMA MECÁNICA A SU PERFIL"

        if(getActuacion.data.attributes.firmas){
            return (
                getActuacion.data.attributes.firmas.map((firma, i) => {
                    if (firma.estado.toString() === global.Constants.ESTADO_FIRMA_MECANICA.ELIMINADO.toString()) {
                        return null
                    } 
                    else {
                        return (
                            <tr>
                                <td>
                                    {firma.usuario_nombre.toUpperCase() + " " + firma.usuario_apellido.toUpperCase()}
                                </td>
                                <td>
                                    {firma.tipo_firma_nombre.toUpperCase()}
                                </td>
                                <td>
                                    {firma.estado.toString() === global.Constants.ESTADO_FIRMA_MECANICA.PENDIENTE_FIRMA.toString() ? "PENDIENTE FIRMA" : null}
                                    {firma.estado.toString() === global.Constants.ESTADO_FIRMA_MECANICA.FIRMADO.toString() ? "FIRMADO" : null}
                                </td>
                                <td>
                                    { 
                                        usuarioJefe() && firma.estado.toString() === global.Constants.ESTADO_FIRMA_MECANICA.PENDIENTE_FIRMA.toString() 
                                        ? 
                                            <button type="button" className="btn btn-rounded btn-primary" value={firma.id} onClick={() => handleClicEliminarFirmaUser(firma.id)}><i className="fas fa-trash-alt"></i> ELIMINAR</button>
                                        : 
                                            null
                                    }
                                    { 
                                        getUser().nombre === firma.usuario_name && firma.estado.toString() !== global.Constants.ESTADO_FIRMA_MECANICA.FIRMADO.toString() 
                                        ? 
                                            (
                                                firma.usuario_firma_mecanica != null
                                                ?
                                                    <Link to="/FirmarDocumentoActuacion" state={{ from: from, FirmaActuacion: firma, nombreActuacion: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }}>
                                                        <button type="button" className="btn btn-rounded btn-primary"> FIRMAR</button>
                                                    </Link>
                                                :
                                                    <button type="button" className="btn btn-rounded btn-primary" onClick={() => setModalState({ title: tituloModal.toUpperCase(), message: messageModal.toUpperCase(), show: true, redirect: "/AgregarFirma/", alert: global.Constants.TIPO_ALERTA.ERROR })}> FIRMAR</button>
                                            ) 
                                    : 
                                        null
                                    }

                                </td>
                            </tr>
                        )
                    }
                }
            ))
        }
    }

    const selectEtapaCambiar = () => {

        return (
            getListaEtapas.data.map((etapa, i) => {
                if (etapa.id >= 3 && from.idEtapa != etapa.id) {
                    return (
                        <option key={etapa.id} value={etapa.id}>{etapa.attributes.nombre}</option>
                    )
                }
            })
        )
    }

    const onEstablecerListaAnulados = () => {

        window.showSpinner(true)

        const data = {
            "data": {
                "type": "usuario",
                "attributes": getListaActuaciones
            }
        }

        

        GenericApi.getByDataGeneric("actuaciones/set-actuaciones-inactivas", data).then(
            datos => {
                if (!datos.error) {

                    let filter = getListaActuaciones.filter(dato => dato.estado_inactivo === '1');
                    let actuacionAux = getActuacion
                    if(filter.length > 0){
                        setMostrarBotonTransacciones(true)
                        actuacionAux.data.attributes.acciones.mostrar_mensaje_informativo_para_aprobar = getActuacion.data.attributes.acciones.mostrar_mensaje_informativo_para_aprobar.filter(dato => dato.tipo !== 'anulacion');
                    }
                    else{
                        setMostrarBotonTransacciones(false)
                        actuacionAux.data.attributes.acciones.mostrar_mensaje_informativo_para_aprobar.push(
                            {
                                "tipo": global.Constants.MENSAJE_TIPO_INFORMATIVO_PARA_APROBAR.ANULACION,
                                "mensaje": global.Constants.MENSAJE_INFORMATIVO_PARA_APROBAR.ANULACION
                            }
                        );
                    }
                    setActuacion(actuacionAux)
                    cargarTrazabilidad()
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: 'CAMBIOS ACTUALIZADOS', show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO })
                } else {
                    setModalState({ title: getNombreProceso + " :: ACTUACIÓN DETALLE", message: datos.error.toString(), show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR })
                    window.showSpinner(false)
                }         
            }
        )
    }

    function subirArchivo(e) {

        if (e.type == "click") {

            window.showSpinner(true)

            if (getActualizarDocumento) {
                const data = {
                    "data": {
                        "type": 'archivo-actuaciones/update-documento',
                        "attributes": {
                            "uuid_actuacion": getActuacion.data.id,
                            "fileBase64": getInputArchivo.filebase64,
                            "nombre_archivo": getInputArchivo.nombre,
                            "extension": getInputArchivo.ext,
                            "peso": getInputArchivo.size,
                            "id_tipo_archivo": 2,
                            "tipoDocumentoActualizar": 1
                        }
                    }
                }

                GenericApi.getByDataGeneric("archivo-actuaciones/update-documento/" + getActuacion.data.attributes.archivos[0].uuid + "/" + getActuacion.data.id, data).then(
                    datos => {

                        if (!datos.error) {
                            setModalState({ title: getNombreProceso.toUpperCase() + " :: CREAR ACTUACIONES", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: "/ActuacionesLista/", from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.EXITO })
                        } else {
                            setModalState({ title: getNombreProceso.toUpperCase() + " :: CREAR ACTUACIONES", message: datos.error.toString(), show: true, redirect: "/ActuacionesLista/", from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.ERROR })
                        }
                        window.showSpinner(false)
                    }
                )


            }
            else {
                const data = {
                    "data": {
                        "type": 'archivo-actuaciones/up-documento',
                        "attributes": {
                            "uuid_actuacion": getActuacion.data.id,
                            "fileBase64": getInputArchivo.filebase64,
                            "nombre_archivo": getInputArchivo.nombre,
                            "extension": getInputArchivo.ext,
                            "peso": getInputArchivo.size,
                            "id_tipo_archivo": 2
                        }
                    }
                }

                GenericApi.addGeneric("archivo-actuaciones/up-documento", data).then(
                    datos => {

                        if (!datos.error) {
                            if (getActuacion.data.attributes.mas_actuacion.cierra_proceso == 1 || getActuacion.data.attributes.mas_actuacion.cierra_proceso == '1') {
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
                                setModalState({ title: getNombreProceso.toUpperCase() + " :: CREAR ACTUACIONES", message: 'EL DOCUMENTO DEFINITIVO HA SIDO ESTABLECIDO', show: true, redirect: "/ActuacionesLista/", from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.EXITO })
                            }
                        } else {
                            setModalState({ title: getNombreProceso.toUpperCase() + " :: CREAR ACTUACIONES", message: datos.error.toString(), show: true, redirect: "/ActuacionesLista/", from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.ERROR })
                        }
                        window.showSpinner(false)
                    }
                )
            }


        }
    }

    // Metodo encargado de generar la informacion del interesado
    const informacionInteresado = (p) => {

        // Se inicializa en una constante la informacion en HTML
        const div =
            <div className='mb-3'>
                <strong>N° DOCUMENTO:</strong> {p.attributes.informacionDatosInteresados.attributes.numero_documento ? p.attributes.informacionDatosInteresados.attributes.numero_documento : "-"}<br />
                <strong>TIPO DE DOCUMENTO:</strong> {(p.attributes.informacionDatosInteresados.attributes.tipo_documento == 1 ? "CÉDULA DE CIUDADANÍA" :
                    p.attributes.informacionDatosInteresados.attributes.tipo_documento == 2 ? "CÉDULA DE EXTRANJERÍA" :
                        p.attributes.informacionDatosInteresados.attributes.tipo_documento == 3 ? "PASAPORTE" : "NO INFORMA")}<br />
                <strong>NOMBRE:</strong> {p.attributes.informacionDatosInteresados.attributes.primer_nombre + " " +
                    p.attributes.informacionDatosInteresados.attributes.segundo_nombre + " " +
                    p.attributes.informacionDatosInteresados.attributes.primer_apellido + " " +
                    p.attributes.informacionDatosInteresados.attributes.segundo_apellido}
                <br />
            </div>;

        // Se retorna la constante HTML
        return div;
    }

    // Metodo encargado de generar la informacion de la notificación
    const informacionNotificacion = (p) => {

        // Se inicializa en una constante la informacion en HTML
        const div =
            <div className='mb-3 text-uppercase'>
                <strong>DETALLE DE LA NOTIFICACIÓN: </strong>
                {p.attributes.informacionPortalNotificaciones.attributes.detalle_incompleto ?
                    p.attributes.informacionPortalNotificaciones.attributes.detalle_incompleto + "... " : "-"}

                {p.attributes.informacionPortalNotificaciones.attributes.detalle ?
                    <button type="button"
                        data-toggle="popover"
                        data-placement="top"
                        data-tooltip-suffix="Sales"
                        data-detalle={p.attributes.informacionPortalNotificaciones.attributes.detalle}
                        title="Ver detalle"
                        className="btn btn-sm btn-light mr-2"
                        onClick={() => verDetalle(p.attributes.informacionPortalNotificaciones.attributes.detalle)}>
                        <span className="fa fa-search" />
                    </button>
                    : ""}
                < br />
                <strong>USUARIO QUE ENVÍA:</strong> {p.attributes.informacionPortalNotificaciones.attributes.usuario_envia ? p.attributes.informacionPortalNotificaciones.attributes.usuario_envia : "-"}<br />
                <strong>INFORMACIÓN DEL PROCESO DISCIPLINARIO:</strong> {p.attributes.informacionAntecedentes.attributes.descripcion ? p.attributes.informacionAntecedentes.attributes.descripcion : "-"}<br />
                <strong>TIPO DE PROCESO:</strong> {p.attributes.informacionProcesoDisciplinario.attributes.nombre_tipo_proceso ? p.attributes.informacionProcesoDisciplinario.attributes.nombre_tipo_proceso : ""}<br />
                <strong>FECHA DE REGISTRO:</strong> {p.attributes.informacionProcesoDisciplinario.attributes.fecha_registro ? p.attributes.informacionProcesoDisciplinario.attributes.fecha_registro : ""} <br />
            </div >;

        // Se retorna la constante HTML
        return div;
    }

    // Metodo encargado de ver el detalle de la notificacion
    const verDetalle = (detalle) => {

        // Se abre el modal
        setModalState({ title: "Detalle notificación", message: detalle, show: true });
    }

    const componenteActuacion = () => {
        return (
            <>
                {/* ACTUACION DETALLE */}
                <div className='row'>
                    <div className='col-md-12'>
                        <div className="block block-themed">
                            <li className="nav-main-item open">
                                <a className="nav-main-link nav-main-link-submenu acordeon-pantalla" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                    <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                        <h3 className="block-title">{ getNombreProceso } :: <strong>{tipoActuacion == "0" ? "ACTUACIÓN" : (tipoActuacion == "1" ? 'IMPEDIMENTO' : 'COMISORIO')} DETALLE</strong></h3>
                                    </div>
                                </a>
                                <ul className="nav-main-submenu">
                                    <div className="block-content">
                                        <div className="row">
                                            <div className='col-md-12'>

                                            </div>
                                        </div>
                                        {/* ETAPA DESPUÉS DE LA APROBACIÓN */}
                                        {
                                            getActuacion.data.attributes.acciones.mostrar_etapa_despues_aprobacion && from.mismoUsuarioBuscador
                                            ?
                                                <div className="row">
                                                    <div className='col-md-12'>
                                                        <>
                                                            <div className="content-heading"></div>
                                                                <div className='row'>
                                                                    <div className="col-md-12">
                                                                        <div className="form-group">
                                                                            <label htmlFor="cambiarEtapa">DEFINIR ETAPA DESPUÉS DE LA APROBACIÓN</label>
                                                                            <select as="select" className="form-control" id="cambiarEtapa" name="cambiarEtapa" value={getActuacion.data.attributes.etapa_siguiente?.id} onChange={e => (obtenerEtapa(e.target.value))}>
                                                                                <option value="">{ global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION }</option>
                                                                                { getListaEtapas.data.length > 0 ? selectEtapaCambiar() : null }
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            <div className="content-heading"></div>
                                                        </>
                                                    </div>
                                                </div>
                                            :
                                                null
                                        }                                        
                                        
                                        {/* ACTUACIONES A ANULAR */}
                                        {
                                            getActuacion.data.attributes.acciones.mostrar_lista_actuaciones_inactivar && from.mismoUsuarioBuscador
                                            ?
                                                <div className="row">
                                                    <div className='col-md-12'>
                                                            <label htmlFor="cambiarEtapa">ACTUACIONES A ANULAR</label>
                                                            {                                                                 
                                                                <div className='row'>
                                                                    <div className="col-md-12">
                                                                        {
                                                                            getListaActuaciones.length > 0
                                                                            ?
                                                                                <>
                                                                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th width="25%">ACTUACIÓN</th>
                                                                                                <th width="25%">ETAPA</th>
                                                                                                <th width="25%">DETALLE</th>
                                                                                                <th width="5%">DOCUMENTO</th>
                                                                                                <th width="5%">NOTIFICACIONES</th>
                                                                                                <th width="10%">ANULAR</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody >
                                                                                            { listarActuacionesActivas() }
                                                                                        </tbody>
                                                                                    </table>
                                                                                    {
                                                                                        getMostrarBotonGuardarLista
                                                                                        ?
                                                                                            <div className="block-content block-content-full text-right">
                                                                                                <button type="button" className="btn btn-rounded btn-primary" onClick={() => onEstablecerListaAnulados()}>GUARDAR LISTA</button>
                                                                                            </div>
                                                                                        :
                                                                                            null
                                                                                    }
                                                                                </>
                                                                            :
                                                                                <ul className="list-group push">
                                                                                    <li className="list-group-item">
                                                                                        <label className="text-danger">NO EXISTEN ACTUACIONES A ANULAR</label>
                                                                                    </li>
                                                                                </ul>
                                                                        }      
                                                                    </div>                                                                       
                                                                </div>
                                                            }                                           
                                                        <div className="content-heading"></div>
                                                    </div>
                                                </div>
                                            :
                                                null
                                        }
                                        {
                                            getActuacion.data.attributes.acciones.mostrar_input_carga_archivo_definitivo && from.mismoUsuarioBuscador
                                            ?
                                                <div className="block block-themed">
                                                    <div className="block-header block-header-warning">
                                                        <h3 className="block-title">SUBIR PDF DEFINITIVO</h3>
                                                    </div>
                                                    <div className="block-content alert-warning">
                                                        <div className="col-md-12 col-xl-12">
                                                            <div className="custom-file">
                                                                <label className="custom-file-label" htmlFor="cargaDefinitiva" data-toggle="custom-file-input">{getInputArchivo.nombre} </label>
                                                                <input className="custom-file-input" id="cargaDefinitiva" data-toggle="custom-file-input" type="file" name="archivo" accept="application/pdf" onChange={e => handleInputChangeArchivos(e, false)} /><br></br>
                                                                <label>PESO DEL ARCHIVO: {formatBytes(getInputArchivo.size)}</label>
                                                            </div>
                                                        </div>
                                                        <br></br>
                                                    </div>
                                                </div>
                                            :
                                                null
                                        }

                                        {/* ARCHIVO DE ACTUACIÓN */}
                                        <div className='row'>
                                            <div className="col-md-12">
                                                <label>ARCHIVOS</label>
                                            </div>
                                            <div className="col-md-12">
                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full table-responsive-md">
                                                    <thead>
                                                        <tr>
                                                            <th>TIPO</th>
                                                            <th>NOMBRE DOCUMENTO</th>
                                                            <th>DESCARGAR</th>
                                                            <th>ACTUALIZAR</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        { listaArchivosActuacion() }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* BOTÓN DE APROBACIÓN DE UNA ACTUACIÓN */}
                                        {
                                            (
                                                hasAccess('SolicitudDeAprobacion', 'Gestionar') &&
                                                getActuacion.data.attributes.acciones.mostrar_boton_aprobar_actuacion
                                            )
                                            ?
                                                <div className="row text-right">
                                                    <div className='col-md-12'>
                                                        {
                                                            from.mismoUsuarioBuscador
                                                            ?
                                                                (
                                                                    (
                                                                        getActuacion.data.attributes.acciones.mostrar_mensaje_informativo_para_aprobar.length > 0
                                                                    )
                                                                    ?
                                                                        <>
                                                                            <ul className="list-group push">
                                                                                {
                                                                                    getActuacion.data.attributes.acciones.mostrar_mensaje_informativo_para_aprobar.map((mensaje, index) => (
                                                                                        <li className="list-group-item" key={index}><label className="text-danger">{mensaje.mensaje}</label></li>
                                                                                    ))
                                                                                }
                                                                            </ul>
                                                                            <Link to={`/ActuacionesAprobacionRechazar/`} state={{ getActuacionConFirmas: (getActuacion.data.attributes.firmas ? getActuacion.data.attributes.firmas.length : 0), from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, titulo: "Rechazar actuación", valor: 2, solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, nombreTipoActuacion: getNombreTipoActuacion, actuacionIdMaestra: actuacionIdMaestra, detalles_actuacion: getActuacion.data.attributes.trazabilidad_primer_registro }}>
                                                                                <button type="button" className="btn btn-rounded btn-outline-primary">RECHAZAR</button>
                                                                            </Link>
                                                                        </>
                                                                    :
                                                                        <>
                                                                            <label>¿APROBAR Y/O RECHAZAR {getNombreTipoActuacion}?</label><br></br>
                                                                            <Link to={`/ActuacionesAprobacionRechazar/`} state={{ getActuacionConFirmas: (getActuacion.data.attributes.firmas ? getActuacion.data.attributes.firmas.length : 0), from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, titulo: "Aprobar actuación", valor: 1, solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, nombreTipoActuacion: getNombreTipoActuacion, actuacionIdMaestra: actuacionIdMaestra, detalles_actuacion: getActuacion.data.attributes.trazabilidad_primer_registro, disable: disable }}>
                                                                                <button type="button" className="btn btn-rounded btn-primary">APROBAR</button>
                                                                            </Link>
                                                                            <Link to={`/ActuacionesAprobacionRechazar/`} state={{ getActuacionConFirmas: (getActuacion.data.attributes.firmas ? getActuacion.data.attributes.firmas.length : 0), from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, titulo: "Rechazar actuación", valor: 2, solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, nombreTipoActuacion: getNombreTipoActuacion, actuacionIdMaestra: actuacionIdMaestra, detalles_actuacion: getActuacion.data.attributes.trazabilidad_primer_registro, disable: disable }}>
                                                                                <button type="button" className="btn btn-rounded btn-outline-primary">RECHAZAR</button>
                                                                            </Link>
                                                                        </>
                                                                )
                                                            :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                            : 
                                                null
                                        }

                                        {/* BOTÓN DE RECHAZO DE UN IMPEDIMENTO */}
                                        {/* {
                                            (
                                                hasAccess('AprobarYRechazarUnImpedimento', 'Gestionar') &&
                                                getActuacion.data.attributes.acciones.mostrar_boton_aprobar_impedimento
                                            )
                                            ?
                                                <div>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '30%' }}>APROBAR Y/O RECHAZAR IMPEDIMENTO: </th>
                                                                <th style={{ paddingLeft: '50px' }}>
                                                                    <div className="block-content block-content-full text-left">
                                                                        <Link to={`/ActuacionesAprobacionRechazar/`} state={{ getActuacionConFirmas: (getActuacion.data.attributes.firmas ? getActuacion.data.attributes.firmas.length : 0), from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, titulo: "Aprobar actuación", valor: 1, solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }}>
                                                                            <button type="button" className="btn btn-rounded btn-primary mb-2">APROBAR</button>
                                                                        </Link>
                                                                        <Link to={`/ActuacionesAprobacionRechazar/`} state={{ getActuacionConFirmas: (getActuacion.data.attributes.firmas ? getActuacion.data.attributes.firmas.length : 0), from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, titulo: "Rechazar actuación", valor: 2, solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }}>
                                                                            <button type="button" className="btn btn-rounded btn-outline-primary mb-2">RECHAZAR</button>
                                                                        </Link>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                    </table>
                                                </div>
                                            : 
                                                null
                                        } */}
                                        {/* BOTÓN DE SOLICITUD DE ACTIVACIÓN O INACTIVACIÓN DE UNA ACTUACIÓN */}
                                        {
                                            hasAccess('SolicitudDeInactivacion', 'Gestionar') && (
                                                getActuacion.data.attributes.acciones.mostrar_boton_aprobar_solicitud_activacion || 
                                                getActuacion.data.attributes.acciones.mostrar_boton_aprobar_solicitud_inactivacion
                                            )
                                            ? 
                                                <div className='mt-4'>
                                                    <label className='mb-3'><b>CONFIRMAR { getActuacion.data.attributes.acciones.mostrar_boton_aprobar_solicitud_activacion ? 'ACTIVACIÓN' : 'INACTIVACIÓN'} : </b></label>
                                                    <Link to={`/ActuacionesAceptaRechazaSolicitudDeAnulacion/`} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, boton: "Acepta", solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra, activacion: getActuacion.data.attributes.acciones.mostrar_boton_aprobar_solicitud_activacion }}>
                                                        <button type="button" className="btn btn-rounded btn-primary ml-2">ACEPTAR</button>
                                                    </Link>
                                                    <Link to={`/ActuacionesAceptaRechazaSolicitudDeAnulacion/`} state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, boton: "Rechaza", solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra, activacion: getActuacion.data.attributes.acciones.mostrar_boton_aprobar_solicitud_activacion }}>
                                                        <button type="button" className="btn btn-rounded btn-outline-primary">RECHAZAR</button>
                                                    </Link>
                                                </div>
                                            : 
                                                null
                                        }
                                    </div>
                                </ul>
                            </li>
                        </div >
                    </div>
                </div>
            </>
        )
    }

    const componenteFirma = () => {
        return (
            <>
            
                {/* FIRMA MECÁNICA */}
                <div className="block block-themed">
                    <li className="nav-main-item">
                        <a className="nav-main-link nav-main-link-submenu acordeon-pantalla" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                            <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                <h3 className="block-title"><strong>USUARIOS PARA FIRMA MECÁNICA</strong></h3>
                            </div>
                        </a>
                        <ul className="nav-main-submenu">
                            <div className="block-content">
                                {
                                    (
                                        hasAccess('AgregarUsuarioParaFirmaMecanica', 'Gestionar') &&
                                        getActuacion.data.attributes.acciones.mostrar_firmas &&
                                        from.mismoUsuarioBuscador
                                    ) 
                                    ? 
                                        <div className='row text-right'>
                                            <div className='col-md-12'>
                                                <Link to="/AgregarUsuarioParaFirmaMecanica" state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, titulo: "Agregar usuario para firma mecánica", valor: 1, solicitante: getUsuarioSolicitante, tipoActuacion: tipoActuacion, actuacionIdMaestra: actuacionIdMaestra }}>
                                                    <button type="button" className="btn btn-rounded btn-primary mb-4" title='AGREGAR USUARIO PARA FIRMA MECÁNICA'>AGREGAR</button>
                                                </Link>
                                            </div>
                                        </div>
                                    : 
                                        null
                                }
                                {
                                    getActuacion.data.attributes.firmas.length > 0
                                    ?
                                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                            <thead>
                                                <tr>
                                                    <th>USUARIO</th>
                                                    <th>TIPO FIRMA</th>
                                                    <th>ESTADO</th>
                                                    <th>ACCIONES</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { listaFirmasMecanicas() }
                                            </tbody>
                                        </table>
                                    :
                                        null
                                }
                            </div>
                        </ul>
                    </li>
                </div>
            </>
        )
    }

    const componenteHistorial = () => {
        return (
            <>
            
                {/* HISTORIAL DE APROBACIONES */}
                <div className="block block-themed">
                    <li className="nav-main-item">
                        <a className="nav-main-link nav-main-link-submenu acordeon-pantalla" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                            <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                            <h3 className="block-title"><strong>HISTORIAL DE APROBACIONES</strong></h3>
                            </div>
                        </a>
                        <ul className="nav-main-submenu">
                            <div className="block-content">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full table-responsive-md">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '13%' }}>FECHA</th>
                                            <th>USUARIO</th>
                                            <th>USUARIO APROBO/RECHAZO</th>
                                            <th>ESTADO</th>
                                            <th colSpan={2}>OBSERVACIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { getListaTrazabilidad ? listaTrazabilidad() : null}
                                    </tbody>
                                </table>
                            </div>
                        </ul>
                    </li>
                </div>
            </>
        )
    }

    const columns_semaforo = [
        {
            name: <span title='Fecha'>FECHA</span>,
            selector: semaforo => <span title={semaforo.attributes.actuacionxsemaforo.attributes.created_at.toUpperCase()}>{semaforo.attributes.actuacionxsemaforo.attributes.created_at.toUpperCase()}</span>,
            sortable: true,
            width: "10%"
        },
        {
            name: <span title='Usuario que registra'>USUARIO QUE REGISTRA</span>,
            selector: semaforo => <span title={semaforo.attributes.actuacionxsemaforo.attributes.created_user.toUpperCase()}>{semaforo.attributes.actuacionxsemaforo.attributes.created_user.toUpperCase()}</span>,
            sortable: true,
            width: "10%"
        },

        {
            name: <span title='Semáforo'>SEMÁFORO</span>,
            selector: semaforo => <span title={semaforo.attributes.actuacionxsemaforo.attributes.id_semaforo.nombre.toUpperCase()}>{semaforo.attributes.actuacionxsemaforo.attributes.id_semaforo.nombre.toUpperCase()}</span>,
            sortable: true,
            width: "14%"
        },
        {
            name: <span title='Interesado'>INTERESADO</span>,
            selector: semaforo => <span title={(
                semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_nombre != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_nombre.toUpperCase() : ""
                    + " " + semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_nombre != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_nombre.toUpperCase() : ""
                        + " " + semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_apellido != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_apellido.toUpperCase() : ""
                            + " " + semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_apellido != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_apellido.toUpperCase() : ""
            )}>{(
                semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_nombre != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_nombre.toUpperCase() : ""
                    + " " + semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_nombre != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_nombre.toUpperCase() : ""
                        + " " + semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_apellido != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.primer_apellido.toUpperCase() : ""
                            + " " + semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_apellido != null ? semaforo.attributes.actuacionxsemaforo.attributes.id_interesado.segundo_apellido.toUpperCase() : ""
            )}</span>,
            sortable: true,
            width: "13%"
        },
        {
            name: <span title='Fecha Inicio'>FECHA INICIO<br></br><span style={{ "font-size": "10px" }}>(AAAA-MM-DD)</span></span>,
            selector: semaforo => <spam title={semaforo.attributes.actuacionxsemaforo.attributes.fecha_inicio}>{semaforo.attributes.actuacionxsemaforo.attributes.fecha_inicio}</spam>,
            sortable: true,
            width: "10%"
        },
        {
            name: <span title='Fecha Finaliza'>FECHA FINALIZA<br></br><span style={{ "font-size": "10px" }}>(AAAA-MM-DD)</span></span>,
            selector: semaforo => semaforo.attributes.actuacionxsemaforo.attributes.fecha_fin ? <spam title={semaforo.attributes.actuacionxsemaforo.attributes.fecha_fin}>{semaforo.attributes.actuacionxsemaforo.attributes.fecha_fin}</spam> : null,
            sortable: true,
            width: "10%"
        },
        {
            name: <span title='Días Calendario'>DÍAS CALENDARIO</span>,
            selector: semaforo => semaforo.attributes.actuacionxsemaforo.attributes.finalizo != null ? <span title={semaforo.attributes.diasTranscurridosHastaFinalizar2}>{semaforo.attributes.diasTranscurridosHastaFinalizar2}</span> : <span title={semaforo.attributes.diasTranscurridos}>{semaforo.attributes.diasTranscurridos}</span>,
            sortable: true,
            width: "7%"
        },
        {
            name: <span title='Días Laborales'>DÍAS LABORALES</span>,
            selector: semaforo => semaforo.attributes.actuacionxsemaforo.attributes.finalizo != null ? <span title={semaforo.attributes.diasTranscurridos2}>{semaforo.attributes.diasTranscurridos2}</span> : <span title={semaforo.attributes.diasTranscurridos2}>{semaforo.attributes.diasTranscurridos2}</span>,
            sortable: true,
            width: "7%"
        },
        {
            name: <span title='Color'>COLOR</span>,
            selector: semaforo =>
                <div>
                    {
                        semaforoColor(semaforo) == "Verde" 
                        ?
                            <div style={{ "background-color": "lime", "color": "white", "width": "100%", "text-align": "center" }} title="VERDE"><strong>VERDE</strong></div>
                        : 
                        (
                            semaforoColor(semaforo) == "Amarillo" 
                            ?
                                <div style={{ "background-color": "yellow", "color": "white", "width": "100%", "text-align": "center" }} title="AMARILLO"><strong>AMARILLO</strong></div>
                                :
                                    (

                                        semaforoColor(semaforo) == "Rojo" 
                                        ?
                                            <div style={{ "background-color": "red", "color": "white", "width": "100%", "text-align": "center" }} title="ROJO"><strong>ROJO</strong></div>
                                            : 
                                            (
                                                semaforoColor(semaforo) == "Azul" 
                                                ?
                                                    <div style={{ "background-color": "#0071a1", "color": "white", "width": "100%", "text-align": "center" }} title="FINALIZADO"><strong>FINALIZADO</strong></div>
                                                :
                                                    null
                                            )
                                    )
                        )
                    }
                </div>
            ,
            sortable: true,
            width: "10%"
        },
        {
            name: <span title='Editar'>EDITAR</span>,
            selector: semaforo => (
                from.mismoUsuarioBuscador
                ?
                <Link to={"/AgregarSemaforo/" + semaforo.attributes.actuacionxsemaforo.id} state={{ semaforo: semaforo.attributes.actuacionxsemaforo, from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion }}>
                    <button type="button" className="btn btn btn-primary" title='Editar'>
                        <i className="fa fa-fw fa-edit"></i>
                    </button>
                </Link>
                :
                null
            ),
            sortable: true,
            width: "9%"
        }
    ]

    const handlePageChange = page => {
        setPageActual(page)
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage)
        setPageActual(page)
    }

    const semaforoColor = (semaforo) => {
        let color = ''
        const hoy = new Date()
        let Fhoy = formatoFecha(hoy, 'yyyy-mm-dd')
        let FeHoy = moment(Fhoy)
        let Ffin = moment(semaforo.attributes.actuacionxsemaforo.attributes.fecha_fin)
        let dias = FeHoy.diff(Ffin, 'days')

        semaforo.attributes.actuacionxsemaforo.attributes.condiciones.forEach(condiciones => {

            let diasTrans = parseInt(semaforo.attributes.diasTranscurridos2, 10)
            let inicial = parseInt(condiciones.inicial, 10)
            let final = condiciones.final != null ? parseInt(condiciones.final, 10) : (diasTrans + 1)

            if (dias >= 0) {
                color = "Azul"
            } else {
                if (diasTrans >= inicial && diasTrans <= final) {
                    color = condiciones.color
                }
            }
        })

        return color
    }

    function formatoFecha(fecha, formato) {
        const map = {
            dd: fecha.getDate(),
            mm: fecha.getMonth() + 1,
            yyyy: fecha.getFullYear()
        }

        return formato.replace(/dd|mm|yyyy/gi, matched => map[matched])
    }

    const componenteSemaforo = () => {
        return (
            <>
            
                {/* SEMÁFOROS */}
                <div className="block block-themed">
                    <li className="nav-main-item">
                        <a className="nav-main-link nav-main-link-submenu acordeon-pantalla" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                            <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                                <h3 className="block-title"><strong>SEMÁFOROS</strong></h3>
                            </div>
                        </a>
                        <ul className="nav-main-submenu">                                    
                            <div className="block-content">
                                {
                                    getActuacion.data.attributes.acciones.mostrar_boton_agregar_semaforo && from.mismoUsuarioBuscador
                                    ?
                                        <div className='row' style={{ paddingBottom: '20px' }}>
                                            <Link to="/AgregarSemaforo/Add" state={{ from: from, selected_id_etapa: selected_id_etapa, id: id, nombre: nombre, estadoActualActuacion: estadoActualActuacion, tipoActuacion: tipoActuacion, disable: disable, actuacionIdMaestra: actuacionIdMaestra }} style={{ marginLeft: 'auto' }}>
                                                <button type="button" className="btn btn-rounded btn-primary">AGREGAR</button>
                                            </Link>
                                        </div>
                                    : 
                                    null
                                }
                                {
                                    getListaSemaforos.data.length > 0
                                    ?
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <DataTable id="tablaSemaforoActuacion" className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                    columns={columns_semaforo}
                                                    data={getListaSemaforos.data.filter((suggestion) => {
                                                        return suggestion
                                                    })}
                                                    perPage={perPage}
                                                    page={pageActual}
                                                    pagination
                                                    noDataComponent="Sin datos"
                                                    paginationTotalRows={getListaSemaforos.data.length}
                                                    onChangePage={handlePageChange}
                                                    onChangeRowsPerPage={handlePerRowsChange}
                                                    defaultSortFieldId="Nombre"
                                                    striped
                                                    paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                    defaultSortAsc={false}
                                                />
                                            </div>
                                        </div>
                                    :
                                        null
                                }                                
                            </div>
                        </ul>
                    </li>
                </div>
            </>
        )
    }

    return (
        <>
            { componentModalHistorialListaActuacionesInactivadas() }
            { componentFechaRegistroAlertConfirmacion() }
            { componentEtapaAlertConfirmacion() }
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            {<InfoErrorApi error={errorApi} />}
            {<InfoConfirmarAccion mensaje={'¿ESTÁ SEGURO DE QUE DESEA SUBIR ESTE ARCHIVO' + (!getActualizarDocumento ? ' COMO PDF DEFINITIVO' : '') + '?'} function={e => subirArchivo(e)} />}
            {<InfoExitoApi />}
            {/* {getInfoModal ? <ModalActuaciones accionActuacion={getMessageModal} /> : null} */}
            {<ModalItemsVer data={getModalStateItems} />}

            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa, disable: disable }}><small>Actuaciones</small></Link></li>
                        <li className="breadcrumb-item"> <small>Ver detalle {tipoActuacion == "0" ? "Actuación" : (tipoActuacion == "1" ? 'Impedimento' : 'Comisorio')}</small></li>
                    </ol>
                </nav>
            </div>
           
            {
                getInformacionActuacion
                ?
                    <>
                        { componenteAccionesCabecera() }
                        { componenteActuacion() }
                        { componenteFirma() }
                        { getActuacion.data.attributes.acciones.mostrar_historial ? componenteHistorial() : null }
                        { componenteSemaforo() }
                    </>
                :
                    null
            }

        </>
    )
}

export default ActuacionesVer