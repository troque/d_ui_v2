import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { getUser } from '../../../components/Utils/Common';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import { Link } from "react-router-dom";
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import ActuacionParametrosPlantillaForm from '../Herramientas/ActuacionParametrosPlantillaForm';
import Spinner from '../../Utils/Spinner';
import Select from 'react-select';

function ActuacionesForm() {

    const [errorApi, setErrorApi] = useState('');
    const [getNombreUsuario, setNombreUsuario] = useState("");
    const [getListaUsuariosComisorio, setListaUsuariosComisorio] = useState("");
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [inputListArchivos, setInputListArchivos] = useState([{ archivo: {}, filebase64: "", size: 0, ext: "" }]);
    const [getMasActuacionId, setMasActuacionId] = useState(0);
    const [getUsuarioComisionado, setUsuarioComisionado] = useState(0);
    const [getListaActuacionesOptions, setListaActuacionesOptions] = useState([]);
    const [getListaActuacionesDefault, setListaActuacionesDefault] = useState([]);
    const [getNombreDocumentoMasActuacion, setNombreDocumentoMasActuacion] = useState("");
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getHayArchivo, setHayArchivo] = useState(false);

    const location = useLocation();
    const { from, selected_id_etapa, tipoActuacion, vengo, rutaParametrizada, redirigirVistaDeclarseImpedido, usuarioComisionado } = location.state;

    let deDondeVengo = vengo ? vengo : false;
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    // let idEtapa = from.idEtapa >= 3 ? from.idEtapa : 3;

    let numeroLlamados = 0;
    let numeroTotalLlamados = 11;

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setNombreUsuario(getUser().nombre);
            nombreProceso();
            if (tipoActuacion == "Comisorio") {
                getListUsuarios(getUser().id_dependencia);
            }
        }
        fetchData();
        selectOptionsActuaciones();
    }, []);

    // Funcion para validar y detener el spinner
    const validacionSpinner = () => {
        numeroLlamados++
        if(numeroLlamados >= numeroTotalLlamados){
        window.showSpinner(false);
        }
    }

    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    getAllTipoActuaciones();
                }
            }
        )
    }

    const getListUsuarios = (id_dependencia) => {

        GenericApi.getAllGeneric("usuario/get-todos-usuarios-dependencia-permisos-disciplinarios/" + from.procesoDisciplinarioId + "/" + id_dependencia).then(
            datos => {
                if (!datos.error) {
                    setListaUsuariosComisorio(datos.data);
                } else {
                    setModalState({ title: getNombreProceso + " :: CREAR " + tipoActuacion, message: datos.error.toString(), show: true, redirect: '/PreguntaImpedimentos', from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )

    }

    /**
     * Trae la lista de todos los tipos de actuaciones.
     */
    const getAllTipoActuaciones = () => {

        GenericApi.getByIdGeneric("mas_actuaciones/actuaciones-etapa", selected_id_etapa).then(
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se envia la informacion al metood encargado de validar y sacar los valores correspondientes del select
                    selectOptionsActuaciones(datos.data);

                    // Se desactiva el spinner
                    window.showSpinner(false);
                } else {
                    setModalState({ title: getNombreProceso + " :: CREAR ACTUACIONES", message: datos.error.toString(), show: true, redirect: '/ActuacionesForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const selectOptionsActuaciones = (datos) => {

        // Se inicializan las variables
        var listaActuacionesValidar = [];

        // Se inicializa la cantidad de cada actuacion en 0
        var cantidadActuaciones = 0;
        var cantidadImpedimentos = 0;
        var cantidadComisorios = 0;


       

        // Se valida que exista el array, tenga longitud 
        if (datos && datos.length > 0) {

            
            // Se recorre el array de las actuaciones
            for (let index = 0; index < datos.length; index++) {

                // Se captura el elemento por posición
                const element = datos[index];

                console.log("TIPO DE ACTUACION: "+element.attributes.tipo_actuacion);

                // Se valida cuando es actuación
                if (element.attributes.tipo_actuacion == 0 && tipoActuacion == "Actuación") {

                    // Se suma +1 al elemento
                    cantidadActuaciones++;

                    // Se añade la actuacion a la lista
                    listaActuacionesValidar.push({ label: element.attributes.nombre_actuacion.toUpperCase(), value: element.id });
                }
                // Se valida cuando es impedimento 
                else if (element.attributes.tipo_actuacion == 1 && tipoActuacion == "Impedimento") {

                    console.log("SOY UN IMPEDIMENTO");

                    // Se suma +1 al elemento
                    cantidadImpedimentos++;

                    // Se añade el impedimento a la lista
                    listaActuacionesValidar.push({ label: element.attributes.nombre_actuacion.toUpperCase(), value: element.id });
                }
                // Se valida cuando es comisorio
                else if (element.attributes.tipo_actuacion == 2 && tipoActuacion == "Comisorio") {

                    // Se suma +1 al elemento
                    cantidadComisorios++;

                    // Se añade el comisorio a la lista
                    listaActuacionesValidar.push({ label: element.attributes.nombre_actuacion.toUpperCase(), value: element.id });
                }
            }

            // ------------------------------------------------------------------------------------ // 

            // Se recorre el array de las actuaciones para preseleccionar y cargar la plantilla automaticamente
            for (let index = 0; index < datos.length; index++) {

                // Se captura el elemento por posición
                const element = datos[index];

                // Se valida cuando es actuación
                if (cantidadActuaciones == 1 && element.attributes.tipo_actuacion == 0 && tipoActuacion == "Actuación") {

                    // Se setea el valor para que auto cargue la plantilla
                    setMasActuacionId(element.id);

                    // Se añade para qué quede preseleccionada en el select
                    setListaActuacionesDefault({ label: element.attributes.nombre_actuacion.toUpperCase(), value: element.id });
                }

                // Se valida cuando es impedimento 
                else if (cantidadImpedimentos == 1 && element.attributes.tipo_actuacion == 1 && tipoActuacion == "Impedimento") {

                    // Se setea el valor para que auto cargue la plantilla
                    setMasActuacionId(element.id);

                    // Se añade para qué quede preseleccionada en el select
                    setListaActuacionesDefault({ label: element.attributes.nombre_actuacion.toUpperCase(), value: element.id });
                }

                // Se valida cuando es comisorio
                else if (cantidadComisorios == 1 && element.attributes.tipo_actuacion == 2 && tipoActuacion == "Comisorio") {

                    // Se setea el valor para que auto cargue la plantilla
                    setMasActuacionId(element.id);

                    // Se añade para qué quede preseleccionada en el select
                    setListaActuacionesDefault({ label: element.attributes.nombre_actuacion.toUpperCase(), value: element.id });
                }
            }
        }

        // Se setea el valor al array lista
        setListaActuacionesOptions(listaActuacionesValidar);
    }

    // Metodo encargado de enviar los datos al backend
    const enviarDatos = (datos) => {

        // Se usa el cargando
        window.showSpinner(true);

        // Se captura el id de la actuacion
        const actuacionId = datos.id_actuacion;

        // Se valida si tiene un archivo valido cargado
        if (!getHayArchivo) {

            // Se usa el cargando
            window.showSpinner(false);

            // Se muestra el modal de error
            setErrorApi("DEBE ADJUNTAR UN DOCUMENTO VÁLIDO");

            // Se ejecuta el modal
            window.showModal(1);

            // Se retorna falso
            return false;
        }

        // Se validan que los campos adicionales tenga informacion obligatoria
        if (from.getCamposAdicionales !== undefined && from.getCamposAdicionales.length > 0) {

            // Se inicializa la variable
            var encontroCampoVacio = false;

            // Se recorre el array
            from.getCamposAdicionales.forEach(e => {

                /**
                    Se valida que el array de campos adicionales tenga información requerida
                    0 = Campo tipo texto
                    1 = Campo tipo lista
                    2 = campo tipo fecha
                */
                if (e.tipoCampo === "0" || e.tipoCampo === "1") {

                    // Se valida que tenga informacion el texto o fecha
                    if (!e.items) {

                        // Se redeclara la variable 
                        encontroCampoVacio = true;
                    }
                } else if (e.tipoCampo == 2) {

                    // Se valida que tenga informacion el texto o fecha
                    if (!e.itemsSeleccionado) {

                        // Se redeclara la variable 
                        encontroCampoVacio = true;
                    }
                }
            });

            // Se valida que haya encontrado el mensaje de error
            if (encontroCampoVacio) {

                // Se quita el cargando
                window.showSpinner(false);

                // Se setea el modal
                setModalState({
                    title: getNombreProceso + " :: CREAR " + tipoActuacion.toUpperCase(),
                    message: "TODOS LOS CAMPOS ADICIONALES SON OBLIGATORIOS",
                    show: true,
                    alert: global.Constants.TIPO_ALERTA.ERROR
                });

                // Se retorna false
                return false;
            }
        } else if ((from.campos !== undefined && from.campos.length > 0) &&
            from.getCamposAdicionales === undefined) {

            // Se quita el cargando
            window.showSpinner(false);

            // Se setea el modal
            setModalState({
                title: getNombreProceso + " :: CREAR " + tipoActuacion.toUpperCase(),
                message: "TODOS LOS CAMPOS ADICIONALES SON OBLIGATORIOS",
                show: true,
                alert: global.Constants.TIPO_ALERTA.ERROR
            });

            // Se retorna false
            return false;
        }

        // Se valida cuando es tipo comisorio
        if (tipoActuacion == 2 || tipoActuacion == "Comisorio") {

            // Se inicializa la variable
            const dataUsuarioComisorio = {
                "data": {
                    "type": "usuario-comisionado",
                    "attributes": {
                        "id_proceso_disciplinario": ""
                    }
                }
            }

            // Se ejecuta la API
            GenericApi.addGeneric("proceso-diciplinario/usuario-comisionado/" + getUsuarioComisionado + "/" + procesoDisciplinarioId, dataUsuarioComisorio).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (datos.error) {

                        // Se setea el modal
                        setModalState({ title: getNombreProceso + " :: CREAR " + tipoActuacion.toUpperCase(), message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        }

        // Se inicializa la variable
        const data = {
            "data": {
                "type": 'actuaciones',
                "attributes": {
                    "id_actuacion": actuacionId,
                    "usuario_accion": getNombreUsuario,
                    "id_estado_actuacion": 3,
                    "created_user": getNombreUsuario,
                    "fileBase64": inputListArchivos[0].filebase64,
                    "nombre_archivo": inputListArchivos[0].archivo.name,
                    "ext": inputListArchivos[0].ext,
                    "peso": inputListArchivos[0].archivo.size,
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": selected_id_etapa,
                    "estado": true,
                    "campos_finales": from.getCamposAdicionales ? from.getCamposAdicionales : [],
                }
            }
        }

        console.log("actuacionId maestra -> ", actuacionId);

        // Se ejecuta la API
        GenericApi.addGeneric("actuaciones", data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Constante del tipo
                    var tipoActuacionDetalle;

                    // Se valida el tipo de actuacion a enviar en el detalle
                    if (tipoActuacion == 2 || tipoActuacion == "Comisorio") {

                        // Se envia como tipo Comisorio
                        tipoActuacionDetalle = 2;
                    } else if (tipoActuacion == 1 || tipoActuacion == "Impedimento") {

                        // Se envia como tipo Impedimento
                        tipoActuacionDetalle = 1;
                    } else if (tipoActuacion == 1 || tipoActuacion == "Actuacion" || tipoActuacion == "Actuación") {

                        // Se envia como tipo Impedimento
                        tipoActuacionDetalle = 0;
                    }

                    // Se setea el modal
                    setModalState({
                        title: getNombreProceso + " :: CREAR " + tipoActuacion.toUpperCase(),
                        message: global.Constants.MENSAJES_MODAL.EXITOSO,
                        show: true, redirect: "/ActuacionesVer/" + procesoDisciplinarioId + "/" + selected_id_etapa + "/1",
                        from: {
                            from: from,
                            selected_id_etapa: selected_id_etapa,
                            id: datos.data.id,
                            nombre: getListaActuacionesDefault.label,
                            estadoActualActuacion: "Pendiente aprobación",
                            tipoActuacion: tipoActuacionDetalle,
                            actuacionIdMaestra: actuacionId
                        },
                        alert: global.Constants.TIPO_ALERTA.EXITO
                    });

                } else {

                    // Se setea el modal
                    setModalState({ title: getNombreProceso + " :: CREAR " + tipoActuacion.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/ActuacionesLista', from: { from: from, selected_id_etapa: selected_id_etapa }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de cambiar la actuacion seleccionada
    const selectChangeMasActuacion = (id, nombreDocumentoMasActuacion, nombreActuacion) => {

        // Se usa el cargando
        if(id !== getMasActuacionId && nombreDocumentoMasActuacion !== getNombreDocumentoMasActuacion){
            window.showSpinner(true);
        }

        // Se setea el nombre de la actuacion
        setNombreDocumentoMasActuacion(nombreDocumentoMasActuacion);

        // Se setea el id de la actuacion
        setMasActuacionId(id);

        // Se añade para qué quede preseleccionada en el select
        setListaActuacionesDefault({ label: nombreDocumentoMasActuacion, value: id });
    }

    const selectChangeUsuarioComisionado = (value) => {
        setUsuarioComisionado(value);
    }

    const selectUsuarioComisorio = () => {

        return (
            getListaUsuariosComisorio && getListaUsuariosComisorio.length ? getListaUsuariosComisorio.map((user, i) => {
                return (
                    <option key={user.id} value={user.id}>{user.attributes.nombre + " " + user.attributes.apellido}</option>
                )
            }) : ""
        )
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

        //setPesoTotalArchivos(peso);
    }

    const handleInputChangeArchivos = (e, index) => {

        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);

            if (extension == global.Constants.TIPO_DOCUMENTO_PERMITIDO_ACTUACIONES.DOCX) {

                const list = [...inputListArchivos];
                list[index][name] = files[0];

                if (files[0]) {
                    list[index][name] = files[0];
                } else {
                    list[index][name] = '';
                    list[index].filebase64 = '';
                    list[index].size = 0;
                    list[index].ext = "";
                    setInputListArchivos(list);
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
                        setInputListArchivos(list);
                    }
                })
                setHayArchivo(true);
                obtenerPesoTotalArchivos(list);
            } else {
                setHayArchivo(false);
                setErrorApi("EL DOCUMENTO SELECCIONADO NO TIENE UN FORMATO PERMITIDO");
                window.showModal(1);
                return false;
            }
        } else {
            const list = [...inputListArchivos];
            list[index][name] = '';
            list[index].filebase64 = '';
            list[index].size = 0;
            setInputListArchivos(list);
            obtenerPesoTotalArchivos(list);
        }

    }

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    return (
        <>
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            {<Spinner />}

            <Formik
                initialValues={{
                    id_actuacion: '',
                    usuario_comisionado: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    valores.id_actuacion = getMasActuacionId;
                    valores.usuario_comisionado = getUsuarioComisionado;

                    if (tipoActuacion == "Comisorio" && valores.usuario_comisionado == 0) {
                        errores.usuario_comisionado = 'DEBE SELECCIONAR UN USUARIO COMISIONADO PARA REGISTRAR'
                    }

                    if (valores.id_actuacion == 0) {
                        errores.id_actuacion = 'DEBE SELECCIONAR UNA ACTUACIÓN PARA REGISTRAR'
                    }

                    // if (valores.id_actuacion != 0 && valores.id_actuacion != "") {
                    //     let id_actuacion = valores.id_actuacion;

                    //     listaTipoActuacion.forEach(element => {
                    //         if (element.id == id_actuacion) {
                    //             setValueDocumentoRuta(element.nombre_plantilla);
                    //         }
                    //     });
                    // }

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
                                    {deDondeVengo ? null : (
                                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={tipoActuacion != "Actuación" ? `/PreguntaImpedimentos/` : (redirigirVistaDeclarseImpedido ? `/PreguntaImpedimentos/` : `/ActuacionesLista/`)} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>{tipoActuacion}</small></Link></li>
                                    )}
                                    <li className="breadcrumb-item"> <small>AGREGAR {tipoActuacion}</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso} :: <strong>CREAR {tipoActuacion.toUpperCase()}</strong></h3>
                            </div>

                            <div className="block-content">
                                <div className='text-right'>
                                    {deDondeVengo ? (
                                        <Link to={`/RamasProceso/`} title='Regresar a lista de Actuaciones' state={{ from: from }}>
                                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    ) :
                                        (rutaParametrizada == "Comisorio") ?
                                            <Link to={`/ActuacionesLista/`} title='Regresar a lista de Actuaciones' state={{ from: from, selected_id_etapa: selected_id_etapa }}>
                                                <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                            </Link>
                                            :
                                            <Link to={tipoActuacion != "Actuación" ? `/PreguntaImpedimentos/` : (redirigirVistaDeclarseImpedido ? `/PreguntaImpedimentos/` : `/ActuacionesLista/`)} title='Regresar a lista de Actuaciones' state={{ from: from, selected_id_etapa: selected_id_etapa, usuarioComisionado: usuarioComisionado }}>
                                                <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                            </Link>}

                                </div>
                                <div className='row mb-4'>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            {getListaActuacionesOptions && getListaActuacionesOptions.length > 0 ?
                                                <label htmlFor="id_actuacion">{tipoActuacion.toUpperCase()} <span className="text-danger"> *</span></label>
                                                : <div>
                                                    <label htmlFor="id_actuacion">SIN DATOS O INFORMACIÓN PARA REGISTRAR <span className="text-danger"></span></label>
                                                </div>
                                            }
                                            {getListaActuacionesOptions && getListaActuacionesOptions.length > 0 ?
                                                <Select
                                                    placeholder={global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}
                                                    defaultValue={getListaActuacionesDefault}
                                                    noOptionsMessage={() => "Sin datos"}
                                                    options={getListaActuacionesOptions.map(e =>
                                                        ({ label: e.label, value: e.value })
                                                    )}
                                                    onChange={(e) => selectChangeMasActuacion(e.value, e.label)}
                                                /> : null
                                            }
                                            <ErrorMessage name="id_actuacion" component={() => (<span className="text-danger">{errors.id_actuacion}</span>)} />
                                        </div>
                                    </div>

                                    {tipoActuacion == "Comisorio" && getListaActuacionesOptions && getListaActuacionesOptions.length > 0 ? (
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="usuario_comisionado">USUARIO COMISIONADO<span className="text-danger">*</span></label>
                                                <select className="form-control" id="usuario_comisionado" name="usuario_comisionado" onChange={e => selectChangeUsuarioComisionado(e.target.value)}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {selectUsuarioComisorio()}
                                                </select>
                                                {
                                                    getListaUsuariosComisorio.length <= 0
                                                    ?
                                                        <>
                                                            <label className='text-danger'>No hay usuarios con permisos o habilitados para comisionar</label>
                                                            <br></br>
                                                        </>
                                                    :
                                                        null
                                                }
                                                <ErrorMessage name="usuario_comisionado" component={() => (<span className="text-danger">{errors.usuario_comisionado}</span>)} />
                                            </div>
                                        </div>
                                    ) : null}

                                </div>

                                {getMasActuacionId > 0 ? <ActuacionParametrosPlantillaForm from={from} id_mas_actuacion={getMasActuacionId} /> : null}

                                {getMasActuacionId > 0 ?
                                    inputListArchivos.map((x, i) => {
                                        return (
                                            <div className="col-md-12 mt-4" key={i}>
                                                <div className="form-group">
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <label>DOCUMENTO ADJUNTO DILIGENCIADO (WORD)<span className="text-danger">* </span></label>
                                                        </div>
                                                        <div className='col-md-12' style={{ marginLeft: '13px' }}>
                                                            <div className='row'>
                                                                <div className='col-md-6'>
                                                                    <label className="custom-file-label" htmlFor="example-file-input-custom" data-toggle="custom-file-input">{x.archivo.name}</label>
                                                                    <input className="custom-file-input" data-toggle="custom-file-input" type="file" accept='.docx' name="archivo" onChange={e => handleInputChangeArchivos(e, i)} required />
                                                                    <label>PESO DEL ARCHIVO: {formatBytes(x.archivo.size)}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    : null
                                }
                            </div>
                        </div>
                        <div className="block-content block-content-full text-right bg-light">
                            {getListaActuacionesOptions && getListaActuacionesOptions.length > 0
                                ?
                                <button type="submit" className="btn btn-rounded btn-primary"> {global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                : null}
                            {deDondeVengo ? (
                                <Link to={`/RamasProceso/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary"> {global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            ) :
                                (rutaParametrizada == "Comisorio") ?
                                    <Link to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa, usuarioComisionado: usuarioComisionado }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary"> {global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                    :
                                    <Link to={tipoActuacion != "Actuación" ? `/PreguntaImpedimentos/` : (redirigirVistaDeclarseImpedido ? `/PreguntaImpedimentos/` : `/ActuacionesLista/`)} state={{ from: from, selected_id_etapa: selected_id_etapa, usuarioComisionado: usuarioComisionado }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary"> {global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );

}

export default ActuacionesForm;