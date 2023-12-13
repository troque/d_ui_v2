import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik, replace } from 'formik';
import Spinner from '../Utils/Spinner';
import { Link, useSearchParams } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import '../Utils/Constants';
import ModalGen from '../Utils/Modals/ModalGeneric';
import InfoErrorApi from '../Utils/InfoErrorApi';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import ModalItemsAgregar from '../Utils/Modals/ModalItemsAgregar';

export default function ActuacionesAdminForm() {

    const [getEstadoSeleccionada, setEstadoSeleccionada] = useState("");
    const [getEtapaCambiarSeleccionada, setEtapaCambiarSeleccionada] = useState("");
    const [getGenerarAutoSeleccionada, setGenerarAutoSeleccionada] = useState("");
    const [getListarActuacionesSeleccionada, setListarActuacionesSeleccionada] = useState("");
    const [getNombrePlantilla, setNombrePlantilla] = useState("");
    const [getNombrePlantillaManual, setNombrePlantillaManual] = useState("");
    const [getNombreActuacion, setNombreActuacion] = useState("");
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getTipoActuacion, setTipoActuacion] = useState("");
    const [getExcluyenteSeleccionado, setExcluyenteSeleccionado] = useState("");
    const [getVisibleSeleccionado, setVisibleSeleccionado] = useState("");
    const [getErrorEtapa, setErrorEtapa] = useState("");
    const [getListaEtapasSeleccionadas, setListaEtapasSeleccionadas] = useState([]);
    const [getCierraProcesoSeleccionado, setCierraProcesoSeleccionado] = useState("");
    const [getListaRoles, setListaRoles] = useState([]);

    const [countTextArea1, setCountTextArea1] = useState(0);
    const [countTextArea2, setCountTextArea2] = useState(0);
    const [countTextArea3, setCountTextArea3] = useState(0);
    const [countTextArea4, setCountTextArea4] = useState(0);
    const [countTextArea5, setCountTextArea5] = useState(0);
    const [countTextArea6, setCountTextArea6] = useState(0);
    const [countTextArea7, setCountTextArea7] = useState(0);

    const [getTextoTransaccion1, setTextoTransaccion1] = useState("");
    const [getTextoTransaccion2, setTextoTransaccion2] = useState("");
    const [getTextoTransaccion3, setTextoTransaccion3] = useState("");
    const [getTextoTransaccion4, setTextoTransaccion4] = useState("");
    const [getTextoTransaccion5, setTextoTransaccion5] = useState("");
    const [getTextoTransaccion6, setTextoTransaccion6] = useState("");
    const [getTextoTransaccion7, setTextoTransaccion7] = useState("");

    const [getRepuestaTextoTransaccion1, setRepuestaTextoTransaccion1] = useState(false);
    const [getRepuestaTextoTransaccion2, setRepuestaTextoTransaccion2] = useState(false);
    const [getRepuestaTextoTransaccion3, setRepuestaTextoTransaccion3] = useState(false);
    const [getRepuestaTextoTransaccion4, setRepuestaTextoTransaccion4] = useState(false);
    const [getRepuestaTextoTransaccion5, setRepuestaTextoTransaccion5] = useState(false);
    const [getRepuestaTextoTransaccion6, setRepuestaTextoTransaccion6] = useState(false);
    const [getRepuestaTextoTransaccion7, setRepuestaTextoTransaccion7] = useState(false);
    

    const [getListaEtapas, setListaEtapas] = useState([]);
    const [getRespuestaEstapas, setRespuestaEstapas] = useState(false);
    const [getRespuestaEstapasCambiar, setRespuestaEstapasCambiar] = useState(false);
    const [getMasActuacionId, setMasActuacionId] = useState(0);
    const [errorApi, setErrorApi] = useState('');
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0);
    const [getPesoTotalArchivosManual, setPesoTotalArchivosManual] = useState(0);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getModalStateItems, setModalStateItems] = useState({ title: "", message: "", show: false, data: {}, agregar: false });
    const [inputListArchivos, setInputListArchivos] = useState([{ folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    const [inputListArchivosManual, setInputListArchivosManual] = useState([{ folios: "", archivoManual: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    const location = useLocation();
    const { from, getData } = location.state;

    // Constantes de los campos
    const [getNombreCampo, setNombreCampo] = useState("");
    const [getNombreItem, setNombreItem] = useState("");
    const [getTipoCampo, setTipoCampo] = useState("");
    const [getTipoCampoItem, setTipoCampoItem] = useState(false);
    const [getIndexItem, setIndexItem] = useState("");
    const [getListadoCampos, setListadoCampos] = useState([]);
    const [getListadoItems, setListadoItems] = useState({ data: [] });
    const [getArrayCamposGenerales, setArrayCamposGenerales] = useState({ data: [] });
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getHayArchivo, setHayArchivo] = useState(false);

    const [getRepuestaNombreActuacion, setRepuestaNombreActuacion] = useState(false);

    const [getArray, setArray] = useState([]);

    const [getTodosRoles, setTodosRoles] = useState(false);

    // Columnas de la tabla 
    const columns = [
        {
            name: 'Nombre',
            selector: campos => (campos.nombreCampo)
        },
        {
            name: 'Tipo',
            selector: campos => validarTipoCampo(campos.tipoCampo)
        },
        {
            name: 'Items',
            selector: campos => validarItems(campos.items)
        },
        {
            name: 'Acciones',
            cell: campos =>
                <div>
                    {/* {campos.tipoCampo == 2 ?
                        <button onClick={() => editarItems(campos)} type="button" className="btn btn btn-primary" title='Editar'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                        : null} */}

                    <button onClick={() => eliminarCampo(campos)} type="button" className="btn btn btn-primary" title='Eliminar'>
                        <i className="fa fa-fw fa-trash-alt"></i>
                    </button>
                </div >
        }
    ];

    // Metodo encargado de retorna los items separados
    const validarItems = (item) => {

        // Se valida que exista y tenga un elemento
        if (item && item.length == 0) {

            // Se retorna el primer elemento
            return item;
        } else if (item && item.length > 0) {

            // Se retorna por comas
            return item.join(", ");
        }
    }

    // Metodo encargado de eliminar el campo seleccionado
    const eliminarCampo = (campos) => {

        // Se busca el index del elemento dentro del array
        let index = getListadoCampos.indexOf(campos);

        // Se valida que el elemento exista
        if (index > -1) {

            // Se elimina el elemento dentro del array
            getListadoCampos.splice(index, 1);
        }

        // Se setea el mensaje
        setModalState({ title: "Campos :: Eliminado con éxito", message: 'Campo eliminado con éxito', show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
    }

    // Metodo encargado de editar items 
    const editarItems = (campos) => {

        // Se setea los valores
        setModalStateItems({ title: "Items :: Editar Items", message: 'Campo agregado con éxito', show: true, data: campos });
    }

    // Columnas de la tabla 
    const columnsItems = [
        {
            name: 'Item',
            selector: item => (item.nombreItem)
        },
        {
            name: 'Acciones',
            cell: item =>
                <div>
                    <button type="button" className="btn btn btn-primary" title='Editar'>
                        <i className="fa fa-fw fa-edit"></i>
                    </button>
                </div>
        }
    ];

    // Metodo encargado de validar el tipo del campo
    const validarTipoCampo = (tipo) => {

        // Se inicializa la variable
        let nombreRetornado;

        // Se valida el tipo
        if (tipo == 0) {

            // Se redeclara la variable
            nombreRetornado = "Texto";
        } else if (tipo == 1) {

            // Se redeclara la variable
            nombreRetornado = "Fecha";
        } else if (tipo == 2) {

            // Se redeclara la variable
            nombreRetornado = "Lista";
        } else if (tipo == 3) {

            // Se redeclara la variable
            nombreRetornado = "Item";
        }

        // Se retorna el valor
        return nombreRetornado;
    }

    const etapasValidar = [
        // { id: 0, nombre: "FORMA DE INGRESO" },
        // { id: 1, nombre: "CAPTURA Y REPARTO" },
        // { id: 2, nombre: "EVALUACIÓN QUEJA PQR" },
        { id: 3, nombre: "EVALUACIÓN QUEJA - PD" },
        { id: 4, nombre: "INDAGACIÓN PREVIA" },
        { id: 5, nombre: "INVESTIGACIÓN DISCIPLINARIA" },
        { id: 6, nombre: "JUZGAMIENTO - P. ORDINARIO" },
        { id: 7, nombre: "JUZGAMIENTO - P. VERBAL" },
        { id: 8, nombre: "SEGUNDA INTANCIA (PERSONERIA AUXILIAR, JURIDICA)" },
        // { id: 9, nombre: "INICIO PROCESO DISCIPLINARIO" }
    ];

    useEffect(() => {

        async function fetchData() {
            window.showSpinner(true);

            if (from != null) {

                validarEtapasSeleccionadas(from.attributes.id_etapa);
                setEstadoSeleccionada(from.attributes.estado);
                setEtapaCambiarSeleccionada(from.attributes.etapa_siguiente);
                setGenerarAutoSeleccionada(from.attributes.generar_auto);
                setListarActuacionesSeleccionada(from.attributes.despues_aprobacion_listar_actuacion);
                setNombrePlantilla(from.attributes.nombre_plantilla);
                setNombrePlantillaManual(from.attributes.nombre_plantilla_manual);
                setNombreActuacion(from.attributes.nombre_actuacion);
                setTextoTransaccion1(from.attributes.texto_dejar_en_mis_pendientes);
                setTextoTransaccion2(from.attributes.texto_enviar_a_alguien_de_mi_dependencia);
                setTextoTransaccion3(from.attributes.texto_enviar_a_jefe_de_la_dependencia);
                setTextoTransaccion4(from.attributes.texto_enviar_a_otra_dependencia);
                setTextoTransaccion5(from.attributes.texto_regresar_proceso_al_ultimo_usuario);
                selectChangeMasActuacion(from.id);
                setCountTextArea1(from.attributes.texto_dejar_en_mis_pendientes.length);
                setCountTextArea2(from.attributes.texto_enviar_a_alguien_de_mi_dependencia.length);
                setCountTextArea3(from.attributes.texto_enviar_a_jefe_de_la_dependencia.length);
                setCountTextArea4(from.attributes.texto_enviar_a_otra_dependencia.length);
                setCountTextArea5(from.attributes.texto_regresar_proceso_al_ultimo_usuario.length);
                setCountTextArea6(from.attributes.texto_enviar_a_alguien_de_secretaria_comun_dirigido.length);
                setCountTextArea7(from.attributes.texto_enviar_a_alguien_de_secretaria_comun_aleatorio.length);
                setTipoActuacion(from.attributes.tipo_actuacion);
                setExcluyenteSeleccionado(from.attributes.excluyente);
                setCierraProcesoSeleccionado(from.attributes.cierra_proceso);
                setVisibleSeleccionado(from.attributes.visible);

                // Se valida que exista una plantilla en la actuacion
                if (from.attributes.nombre_plantilla) {

                    // Se redeclara la variable a true
                    setHayArchivo(true);
                }

                // Se valida que hayan campos para añadirlos al array
                if (from.attributes.campos && from.attributes.campos.length > 0) {

                    // Se setea el valor
                    setListadoCampos(from.attributes.campos);
                }

            } else {
                selectChangeMasActuacion(99);
            }
            
            obtenemosEtapas();
            obtenerParametros();
            obtenerRoles();

        }
        fetchData();
    }, []);

    const validarEtapasSeleccionadas = (etapas) => {

        var validarEtapasSeleccionadas = [];

        // Se valida que exista etapas
        if (etapas) {

            // Se quitan las comas
            let auxEtapaSplit = etapas.split(",");

            // Se recorre el array de etapas
            for (let index = 0; index < auxEtapaSplit.length; index++) {

                // Se captura el elemento por posicion
                const element = auxEtapaSplit[index];

                // Se valida el elemento y se retorna el valor con el array de las etapas
                const validar = etapasValidar.filter(item => item.id == element);

                // Se captura el nombre de las etapas
                const nombreEtapa = validar[0].nombre;

                // Se setea el valor al array para mostrarlo en el select
                validarEtapasSeleccionadas.push({ label: nombreEtapa, value: element })
            }
        }

        // Se setea el valor al array para mostrarlo en el select
        setListaEtapasSeleccionadas(validarEtapasSeleccionadas);

        return validarEtapasSeleccionadas;
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
                        setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
        }
    }

    const selectChangeEtapa = (v) => {
        if (v != null) {
            setListaEtapasSeleccionadas(v);
        } else {
            setErrorEtapa('Campo requerido');
        }
    }

    const selectChangeEstado = (e) => {
        setEstadoSeleccionada(e.target.value);
    }

    const selectChangeCambiarEtapa = (e) => {
        setEtapaCambiarSeleccionada(e.target.value);
    }

    const selectChangeGenerarAuto = (e) => {
        setGenerarAutoSeleccionada(e.target.value);
    }

    const selectChangeListarActuaciones = (e) => {
        setListarActuacionesSeleccionada(e.target.value);
    }

    const changeNombreActuacion = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreActuacion(e.target.value);
            setRepuestaNombreActuacion(true);
        }
    }

    const changeTextoTransaccion1 = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setTextoTransaccion1(e.target.value);
            setCountTextArea1(e.target.value.length);
            setRepuestaTextoTransaccion1(true);
        }
    }

    const changeTextoTransaccion2 = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setTextoTransaccion2(e.target.value);
            setCountTextArea2(e.target.value.length);
            setRepuestaTextoTransaccion2(true);
        }
    }

    const changeTextoTransaccion3 = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setTextoTransaccion3(e.target.value);
            setCountTextArea3(e.target.value.length);
            setRepuestaTextoTransaccion3(true);
        }
    }

    const changeTextoTransaccion4 = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setTextoTransaccion4(e.target.value);
            setCountTextArea4(e.target.value.length);
            setRepuestaTextoTransaccion4(true);
        }
    }

    const changeTextoTransaccion5 = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setTextoTransaccion5(e.target.value);
            setCountTextArea5(e.target.value.length);
            setRepuestaTextoTransaccion5(true);
        }
    }

    const changeTextoTransaccion6 = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setTextoTransaccion6(e.target.value);
            setCountTextArea6(e.target.value.length);
            setRepuestaTextoTransaccion6(true);
        }
    }

    const changeTextoTransaccion7 = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= getMaximoTextArea)) {
            setTextoTransaccion7(e.target.value);
            setCountTextArea7(e.target.value.length);
            setRepuestaTextoTransaccion7(true);
        }
    }

    const selectChangeTipoActuacion = (e) => {
        setTipoActuacion(e.target.value);

        if (e.target.value == 1 || e.target.value == 2) {
            setListarActuacionesSeleccionada(0);
        }
    }

    const selectChangeExcluyente = (e) => {
        setExcluyenteSeleccionado(e.target.value);
    }

    const selectChangeVisible = (e) => {
        setVisibleSeleccionado(e.target.value);
    }

    const selectChangeCierraProceso = (e) => {
        setCierraProcesoSeleccionado(e.target.value);
    }

    // Metodo encargado de setear el valor del nombre del campo
    const changeNombreCampo = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreCampo(e.target.value);
        }
    }

    // Metodo encargado de setear el valor del tipo del campo
    const selectChangeTipoCampo = (e) => {

        // Se setea el valor del campo
        setTipoCampo(e.target.value);
    }

    const obtenerRoles = () => {
        try {
            //buscamos el parametro
            var id = 0;
            if(from != null){
                id = from.id
            }
            GenericApi.getAllGeneric("mas_actuaciones/getRoles/"+id).then(
                datos => {
                    if (!datos.error) {
                        setListaRoles(datos.data);
                        var contadoRol = 0;

                        datos.data.forEach(element => {
                            if(element.estado === '1'){
                                contadoRol++;
                            }
                        });

                        if(contadoRol === datos.data.length){
                            setTodosRoles(true)
                        }
                        else{
                            setTodosRoles(false)
                        }

                    } else {
                        setModalState({ title: "ACTUACIONES", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
        }
    }

    const enviarDatos = (valores) => {

        // Se valida si tiene un archivo valido cargado
        if (!getHayArchivo) {

            // Se usa el cargando
            window.showSpinner(false);

            // Se muestra el modal de error
            setErrorApi("¡Debe cargar un archivo valido!");

            // Se ejecuta el modal
            window.showModal(1);

            // Se retorna falso
            return false;
        }

        let data = {
            "data": {
                "type": "mas_actuaciones",
                "attributes": {
                    "nombre_actuacion": getNombreActuacion,
                    "nombre_plantilla": inputListArchivos[0].archivo.name,
                    "id_etapa": getListaEtapasSeleccionadas,
                    "estado": getEstadoSeleccionada,
                    "etapa_siguiente": getCierraProcesoSeleccionado === '0' ? getEtapaCambiarSeleccionada : 0,
                    "despues_aprobacion_listar_actuacion": getCierraProcesoSeleccionado === '0' ? getListarActuacionesSeleccionada : 0,
                    "generar_auto": getGenerarAutoSeleccionada,
                    "nombre_plantilla_manual": inputListArchivosManual[0].archivoManual.name != null ? inputListArchivosManual[0].archivoManual.name : null,
                    "fileBase64": inputListArchivos[0].filebase64,
                    "fileBase64_manual": inputListArchivosManual[0].filebase64 != null ? inputListArchivosManual[0].filebase64 : null,
                    "texto_dejar_en_mis_pendientes": getTextoTransaccion1,
                    "texto_enviar_a_alguien_de_mi_dependencia": getTextoTransaccion2,
                    "texto_enviar_a_jefe_de_la_dependencia": getTextoTransaccion3,
                    "texto_enviar_a_otra_dependencia": getTextoTransaccion4,
                    "texto_regresar_proceso_al_ultimo_usuario": getTextoTransaccion5,
                    "texto_enviar_a_alguien_de_secretaria_comun_dirigido": getTextoTransaccion6,
                    "texto_enviar_a_alguien_de_secretaria_comun_aleatorio": getTextoTransaccion7,
                    "tipo_actuacion": getTipoActuacion,
                    "excluyente": getExcluyenteSeleccionado,
                    "cierra_proceso": getCierraProcesoSeleccionado,
                    "visible": getVisibleSeleccionado,
                    "campos": getListadoCampos,
                    "lista_roles": getListaRoles,
                    "lista_etapa": getListaEtapas
                }
            }
        }

        /*if (getListaEtapasSeleccionadas.length == 0) {
            setErrorEtapa('Campo requerido');
            return;
        }*/

        // Se utiliza el cargando
        window.showSpinner(true);

        GenericApi.addGeneric('mas_actuaciones', data).then(
            datos => {

                // Se utiliza el cargando
                window.showSpinner(false);

                if (!datos.error) {
                    setModalState({ title: "Actuación :: Creada con éxito", message: 'La actuación ' + valores.nombreActuacion + ' fue creada con éxito ', show: true, redirect: '/ActuacionesAdministracion', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "Actuación :: Error de creación", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    const actualizarDatos = (valores) => {
        const id = from.id;
        let data = "";

        // Se valida si tiene un archivo valido cargado
        if (!getHayArchivo && (from.attributes.nombre_plantilla.length <= 0)) {

            // Se usa el cargando
            window.showSpinner(false);

            // Se muestra el modal de error
            setErrorApi("¡Debe cargar un archivo valido!");

            // Se ejecuta el modal
            window.showModal(1);

            // Se retorna falso
            return false;
        }

        if (inputListArchivos[0].filebase64 != "") {
            if (inputListArchivos[0].archivo.name != null) {
                data = {
                    "data": {
                        "type": "mas_actuaciones",
                        "attributes": {
                            "nombre_actuacion": getNombreActuacion,
                            "nombre_plantilla": inputListArchivos[0].archivo.name,
                            "id_etapa": getListaEtapasSeleccionadas,
                            "estado": getEstadoSeleccionada,
                            "etapa_siguiente": getCierraProcesoSeleccionado === '0' ? (getEtapaCambiarSeleccionada ? getEtapaCambiarSeleccionada : null) : null,
                            "despues_aprobacion_listar_actuacion": getCierraProcesoSeleccionado === '0' ? getListarActuacionesSeleccionada : 0,
                            "generar_auto": getGenerarAutoSeleccionada,
                            "nombre_plantilla_manual": inputListArchivosManual[0].archivoManual.name,
                            "fileBase64": inputListArchivos[0].filebase64,
                            "fileBase64_manual": inputListArchivosManual[0].filebase64,
                            "texto_dejar_en_mis_pendientes": getTextoTransaccion1,
                            "texto_enviar_a_alguien_de_mi_dependencia": getTextoTransaccion2,
                            "texto_enviar_a_jefe_de_la_dependencia": getTextoTransaccion3,
                            "texto_enviar_a_otra_dependencia": getTextoTransaccion4,
                            "texto_regresar_proceso_al_ultimo_usuario": getTextoTransaccion5,
                            "texto_enviar_a_alguien_de_secretaria_comun_dirigido": getTextoTransaccion6,
                            "texto_enviar_a_alguien_de_secretaria_comun_aleatorio": getTextoTransaccion7,
                            "tipo_actuacion": getTipoActuacion,
                            "excluyente": getExcluyenteSeleccionado,
                            "cierra_proceso": getCierraProcesoSeleccionado,
                            "visible": getVisibleSeleccionado,
                            "campos": getListadoCampos,
                            "lista_roles": getListaRoles,
                            "lista_etapa": getListaEtapas
                        }
                    }
                }
            } else {
                data = {
                    "data": {
                        "type": "mas_actuaciones",
                        "attributes": {
                            "nombre_actuacion": getNombreActuacion,
                            "nombre_plantilla": from.attributes.nombre_plantilla,
                            "id_etapa": getListaEtapasSeleccionadas,
                            "estado": getEstadoSeleccionada,
                            "etapa_siguiente": getCierraProcesoSeleccionado === '0' ? (getEtapaCambiarSeleccionada ? getEtapaCambiarSeleccionada : null) : null,
                            "despues_aprobacion_listar_actuacion": getCierraProcesoSeleccionado === '0' ? getListarActuacionesSeleccionada : 0,
                            "generar_auto": getGenerarAutoSeleccionada,
                            "nombre_plantilla_manual": inputListArchivosManual[0].archivoManual.name,
                            "fileBase64": inputListArchivos[0].filebase64,
                            "fileBase64_manual": inputListArchivosManual[0].filebase64,
                            "texto_dejar_en_mis_pendientes": getTextoTransaccion1,
                            "texto_enviar_a_alguien_de_mi_dependencia": getTextoTransaccion2,
                            "texto_enviar_a_jefe_de_la_dependencia": getTextoTransaccion3,
                            "texto_enviar_a_otra_dependencia": getTextoTransaccion4,
                            "texto_regresar_proceso_al_ultimo_usuario": getTextoTransaccion5,
                            "texto_enviar_a_alguien_de_secretaria_comun_dirigido": getTextoTransaccion6,
                            "texto_enviar_a_alguien_de_secretaria_comun_aleatorio": getTextoTransaccion7,
                            "tipo_actuacion": getTipoActuacion,
                            "excluyente": getCierraProcesoSeleccionado === '0' ? getExcluyenteSeleccionado : 0,
                            "cierra_proceso": getCierraProcesoSeleccionado,
                            "visible": getVisibleSeleccionado,
                            "campos": getListadoCampos,
                            "lista_roles": getListaRoles,
                            "lista_etapa": getListaEtapas
                        }
                    }
                }
            }

        } else {
            data = {
                "data": {
                    "type": "mas_actuaciones",
                    "attributes": {
                        "nombre_actuacion": getNombreActuacion,
                        "nombre_plantilla": from.attributes.nombre_plantilla,
                        "id_etapa": getListaEtapasSeleccionadas,
                        "estado": getEstadoSeleccionada,
                        "etapa_siguiente": getCierraProcesoSeleccionado === '0' ? (getEtapaCambiarSeleccionada ? getEtapaCambiarSeleccionada : null) : null,
                        "despues_aprobacion_listar_actuacion": getCierraProcesoSeleccionado === '0' ? getListarActuacionesSeleccionada : 0,
                        "generar_auto": getGenerarAutoSeleccionada,
                        "nombre_plantilla_manual": from.attributes.nombre_plantilla_manual,
                        "fileBase64": null,
                        "fileBase64_manual": null,
                        "texto_dejar_en_mis_pendientes": getTextoTransaccion1,
                        "texto_enviar_a_alguien_de_mi_dependencia": getTextoTransaccion2,
                        "texto_enviar_a_jefe_de_la_dependencia": getTextoTransaccion3,
                        "texto_enviar_a_otra_dependencia": getTextoTransaccion4,
                        "texto_regresar_proceso_al_ultimo_usuario": getTextoTransaccion5,
                        "texto_enviar_a_alguien_de_secretaria_comun_dirigido": getTextoTransaccion6,
                        "texto_enviar_a_alguien_de_secretaria_comun_aleatorio": getTextoTransaccion7,
                        "tipo_actuacion": getTipoActuacion,
                        "excluyente": getExcluyenteSeleccionado,
                        "cierra_proceso": getCierraProcesoSeleccionado,
                        "visible": getVisibleSeleccionado,
                        "campos": getListadoCampos,
                        "lista_roles": getListaRoles,
                        "lista_etapa": getListaEtapas
                    }
                }
            }
        }

        // Se utiliza el cargando
        window.showSpinner(true);

        GenericApi.updateGeneric('mas_actuaciones', id, data).then(
            datos => {
                window.showSpinner(false);
                if (!datos.error) {
                    setModalState({ title: "Actuación :: Actualización con éxito", message: 'La actuación ' + getNombreActuacion + ' fue actualizada con éxito ', show: true, redirect: '/ActuacionesAdministracion', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "Actuación :: Error de actualización", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    const obtenemosEtapas = () => {
        //GenericApi.getAllGeneric('mas-etapa-nuevos').then(
        var id = 0;
        if(from != null){
            id = from.id
        }
        GenericApi.getAllGeneric('mas_actuaciones/getEtapas/'+id).then(
            datos => {
                if (!datos.error) {
                    setListaEtapas(datos.data);
                    setRespuestaEstapas(true);
                    setRespuestaEstapasCambiar(true);
                    window.showSpinner(false);
                } else {
                }
            }
        )
    }

    const selectEtapa = () => {

        return (
            getListaEtapas.data.map((etapa, i) => {
                if (etapa.id >= 3) {
                    return (
                        <option key={etapa.id} value={etapa.id}>{etapa.attributes.nombre}</option>
                    )
                }
            })
        )
    }

    const selectEtapaCambiar = () => {

        return (
            getListaEtapas.data.map((etapa, i) => {
                if (etapa.id >= 3) {
                    return (
                        <option key={etapa.id} value={etapa.id}>{etapa.attributes.nombre}</option>
                    )
                }
            })
        )
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
                setErrorApi("El archivo seleccionado no tiene un formato permitido");
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

    const handleInputChangeArchivosManual = (e, index) => {

        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);
            if (extension == "docx") {

                const list = [...inputListArchivos];
                list[index][name] = files[0];

                if (files[0]) {
                    list[index][name] = files[0];
                } else {
                    list[index][name] = '';
                    list[index].filebase64 = '';
                    list[index].size = 0;
                    list[index].ext = "";

                    setInputListArchivosManual(list);
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
                        setInputListArchivosManual(list);
                    }
                })
                obtenerPesoTotalArchivosManual(list);
            } else {
                const list = [...inputListArchivos];
                list[index][name] = files[0];
                list[index].filebase64 = '';
                list[index].size = 0;
                list[index][name] = '';
                setInputListArchivosManual(list);
                setErrorApi("El archivo seleccionado no tiene un formato permitido. Debe ser *.docx")
                window.showModal(1)
            }
        } else {
            const list = [...inputListArchivos];
            list[index][name] = '';
            list[index].filebase64 = '';
            list[index].size = 0;
            setInputListArchivosManual(list);
            obtenerPesoTotalArchivosManual(list);
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
            setErrorApi('El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro, verifique e tamaño y elimine algunos adjuntos.')
            window.showModal(1)
        }

        setPesoTotalArchivos(peso);
    }

    function obtenerPesoTotalArchivosManual(list) {
        let peso = 0;
        list.forEach(
            (archivo, index) => {
                if (archivo.archivo.size) {
                    peso += archivo.archivo.size;
                }
            }
        )

        if (peso > 15000000) {
            setErrorApi('El peso/tamaño de los todos los adjuntos superan los 15 Mb pertmitidos para el registro, verifique e tamaño y elimine algunos adjuntos, (Si desea enviar mas archivos realice otro proceso de registro de Soportes del radicado)')
            window.showModal(1)
        }

        setPesoTotalArchivosManual(peso);
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

    const selectChangeMasActuacion = (value) => {
        setMasActuacionId(value);
    }

    const handleClicArchivo = () => {
        try {
            window.showSpinner(true);

            const data = {
                "data": {
                    "type": "mas_actuaciones",
                    "attributes": {
                        "nombre_actuacion": "",
                        "nombre_plantilla": "",
                        "id_etapa": "",
                        "estado": "",
                        "etapa_siguiente": "",
                        "despues_aprobacion_listar_actuacion": "",
                        "fileBase64": ""
                    }
                }
            }

            GenericApi.getByDataGeneric('mas_actuaciones/plantilla/' + from.id, data).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, datos.file_name);
                    }
                    else {

                    }
                    window.showSpinner(false);
                }
            )

        } catch (error) {
            console.error(error);
        }
    };

    const handleClicArchivoManual = () => {
        try {
            window.showSpinner(true);

            const data = {
                "data": {
                    "type": "mas_actuaciones",
                    "attributes": {
                        "nombre_actuacion": "",
                        "nombre_plantilla": "",
                        "id_etapa": "",
                        "estado": "",
                        "etapa_siguiente": "",
                        "despues_aprobacion_listar_actuacion": "",
                        "nombre_plantilla_manual": "",
                        "fileBase64": "",
                        "fileBase64_manual": ""
                    }
                }
            }

            GenericApi.getByDataGeneric('mas_actuaciones/manual/' + from.id, data).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64FileManual(datos.content_type, datos.base_64, datos.file_name);
                    }
                    else {

                    }
                    window.showSpinner(false);
                }
            )

        } catch (error) {
            console.error(error);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    function downloadBase64FileManual(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    // Metodo encargado de agregar los campos al listado general
    const agregarCampo = () => {

        // Se valida que haya escrito el nombre del campo
        if (getNombreCampo && getNombreCampo.length < 3) {

            // Se setea el mensaje
            setModalState({ title: "Agregar campo :: Nombre", message: 'El campo debe tener minimo 3 caracteres', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }
        
        // Se valida que no contenga caractereces especiales
        if (!global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getNombreCampo) && getNombreCampo.length <= 255) {
            // Se setea el mensaje
            setModalState({ title: "Agregar campo :: Nombre", message: 'Tiene caracteres invalidos', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se valida que haya seleccionado un valor valido del listado
        if (!getTipoCampo) {

            // Se setea el mensaje
            setModalState({ title: "Agregar campo :: Tipo Campo", message: 'Debe seleccionar un valor valido', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se inicializa el valor
        let dataItems = [];

        // Se inicializa la variable
        let encontroRepetido = 0;

        // Se recorre el array
        getListadoCampos && getListadoCampos.length > 0 && getListadoCampos.forEach(e => {

            // Se capturan los valores
            let nombreCampo = e.nombreCampo;
            let tipoCampo = e.tipoCampo;

            // Se valida que el nombre sea igual para retornar
            if (nombreCampo == getNombreCampo) {

                // Se aumenta el valor
                encontroRepetido++;
            }
        });

        // Se valida que no se haya encontrado repetido
        if (encontroRepetido > 0) {

            // Se setea el mensaje
            setModalState({ title: "Agregar campo :: Agregar Campo", message: 'El nombre del campo ya se encuentra en la lista, por favor escriba otro diferente', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se valida cuando es tipo campo lista
        if (getTipoCampo == 2) {

            // Se setean los valores
            setNombreCampo("");
            setTipoCampo("");

            // Se setea los valores
            setModalStateItems({ title: "ITEMS :: AGREGAR ITEMS", message: getNombreCampo, getData: getData == undefined ? getArray : getData, show: true, agregar: true });
        } else {

            // Se setea el valor al array
            dataItems.push({ nombreCampo: getNombreCampo, tipoCampo: getTipoCampo });

            // Se setean los valores
            getListadoCampos.push(dataItems[0]);
            setNombreCampo("");
            setTipoCampo("");
            setModalState({ title: "Agregar campo :: Agregada con éxito", message: 'Campo agregado con éxito', show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
        }
    }

    // Metodo encargado de buscar los datos de la pagina actual
    const handlePageChange = page => {

        // Se setea la pagina actual
        setPageActual(page);
    }

    // Metodo encargado de buscar los datos de la pagina que se cambie
    const handlePerRowsChange = async (newPerPage, page) => {

        // Se setean los valores
        setPerPage(newPerPage);
        setPageActual(page);
    }

    // Metodo encargado de validar si hay nuevos campos tipo lista
    const validarCamposNuevos = () => {

        // Se captura la informacion de los campos e items
        if (getData && getData.length > 0) {

            // Se recorre la data
            getData.forEach(e => {

                // Se captura la key
                let nombreCampoPrincipal = e.nombreCampo;

                // Se recorre el array a validar
                let encuentra = getListadoCampos && getListadoCampos.length > 0 && getListadoCampos.find(i =>
                    nombreCampoPrincipal == i.nombreCampo
                );

                // Se valida que no encuentre el actual
                if (!encuentra) {

                    // Se añade la lista dentro del listado general
                    getListadoCampos.push(e);
                }
            });
        }
    }

    const agregarCheckRoles = (e, index) => {
        var estado = getListaRoles;
        if(e){
            estado[index].estado = '1';
        }
        else{
            estado[index].estado = '0';
        }
        setListaRoles(estado);
    }

    const agregarCheckTodosRoles = (e) => {

        getListaRoles.forEach((element, index) => {
            var estado = getListaRoles;
            if(e){
                estado[index].estado = '1';
            }
            else{
                estado[index].estado = '0';
            }
            setListaRoles(estado);
        });

        setTodosRoles(true)
    }

    const agregarCheckEtapa = (e, index) => {
        var estado = getListaEtapas;
        if(e){
            estado[index].estado = '1';
        }
        else{
            estado[index].estado = '0';
        }
        setListaEtapas(estado);
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            {<ModalItemsAgregar data={getModalStateItems} />}
            <Formik
                initialValues={{
                    nombreActuacion: '',
                    plantilla: '',
                    estado: '',
                    cambiarEtapa: '',
                    generarAuto: '',
                    listarActuaciones: '',
                    archivo: '',
                    dejarEnMisPendientes: '',
                    enviarAAlguienDeMiDependencia: '',
                    enviarAJefeDeLaDependencia: '',
                    enviarAOtraDependencia: '',
                    regresarProcesoAlUltimoUsuario: '',
                    tipo_actuacion: '',
                    excluyente: '',
                    cirraProceso: '',
                    visible: '',
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    valores.id_actuacion = getMasActuacionId;
                    if (getNombreActuacion == "") {
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getNombreActuacion) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    let archivo = inputListArchivos[0].filebase64 != "" ? inputListArchivos[0].archivo.name : from ? from.attributes.nombre_plantilla : "";
                    if (archivo == "") {
                        errores.archivo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }
                    if (getEstadoSeleccionada == "") {
                        errores.estado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }
                    if (getListarActuacionesSeleccionada == "" && (getTipoActuacion != 1 && getTipoActuacion != 2)) {
                        errores.listarActuaciones = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }
                    if (getTipoActuacion == "") {
                        errores.tipo_actuacion = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }
                    if (getExcluyenteSeleccionado == "") {
                        errores.excluyente = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }
                    if (getCierraProcesoSeleccionado == "") {
                        errores.cirraProceso = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }
                    if (getVisibleSeleccionado == "") {
                        errores.visible = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    if(getGenerarAutoSeleccionada == "" || getGenerarAutoSeleccionada == null){
                        errores.generarAuto = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    //validacion text area 1
                    if (countTextArea1 > getMaximoTextArea) {
                        errores.dejarEnMisPendientes = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getRepuestaTextoTransaccion1) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    //validacion text area 2
                    if (countTextArea2 > getMaximoTextArea) {
                        errores.enviarAAlguienDeMiDependencia = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getRepuestaTextoTransaccion2) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    //validacion text area 3
                    if (countTextArea3 > getMaximoTextArea) {
                        errores.enviarAJefeDeLaDependencia = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getRepuestaTextoTransaccion3) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    //validacion text area 4
                    if (countTextArea4 > getMaximoTextArea) {
                        errores.enviarAOtraDependencia = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getRepuestaTextoTransaccion4) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    //validacion text area 5
                    if (countTextArea5 > getMaximoTextArea) {
                        errores.regresarProcesoAlUltimoUsuario = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                    }                    
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getRepuestaTextoTransaccion5) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    //validacion text area 6
                    if (countTextArea6 > getMaximoTextArea) {
                        errores.enviarAAlguienDeSecretariaComunDirigido = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getRepuestaTextoTransaccion6) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    //validacion text area 7
                    if (countTextArea7 > getMaximoTextArea) {
                        errores.enviarAAlguienDeSecretariaComunAleatorio = 'La descripción debe tener como maximo ' + getMaximoTextArea + ' caracteres';
                    }
                    if(global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(getRepuestaTextoTransaccion7) === false){
                        errores.nombreActuacion = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {
                    if (from != null) {
                        actualizarDatos(valores);
                    } else {
                        enviarDatos(valores);
                    }
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="block block-rounded">

                            <div className="block block-themed">
                                <div className="col-md-12">

                                    <div className="w2d_block let">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-alt push">
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesAdministracion`}> <small>Lista de actuaciones</small></Link></li>
                                                <li className="breadcrumb-item"> <small>Crear actuaciones</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: ACTUACIONES</h3>
                                </div>
                                <div className="block-content">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="nombreActuacion">NOMBRE DE ACTUACIÓN<span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreActuacion" name="nombreActuacion" value={getNombreActuacion} onChange={changeNombreActuacion} autocomplete="off"></Field>
                                                <ErrorMessage name="nombreActuacion" component={() => (<span className="text-danger">{errors.nombreActuacion}</span>)} />
                                            </div>
                                        </div>

                                        {
                                            getMasActuacionId > 0 ?
                                                inputListArchivos.map((x, i) => {
                                                    return (
                                                        <div className="col-md-6" key={i}>
                                                            <div className="form-group">
                                                                <div className='row'>
                                                                    <div className='col-md-12'>
                                                                        <label>PLANTILLA (WORD)<span className="text-danger">* </span></label>
                                                                    </div>
                                                                    <div className='col-md-12' style={{ marginLeft: '13px' }}>
                                                                        <div className='row'>
                                                                            <div className='col-md-10'>
                                                                                <label className="custom-file-label" htmlFor="example-file-input-custom" data-toggle="custom-file-input">{x.archivo.name != null ? x.archivo.name : getNombrePlantilla}</label>
                                                                                <input className="custom-file-input" data-toggle="custom-file-input" type="file" accept='.docx' name="archivo" onChange={e => handleInputChangeArchivos(e, i)} />
                                                                                <label>PESO DEL ARCHIVO: {formatBytes(x.archivo.size)} </label>
                                                                                <ErrorMessage name="archivo" component={() => (<span className="text-danger">{errors.archivo}</span>)} />
                                                                            </div>
                                                                            {from != null ?
                                                                                <div className='col-2'>
                                                                                    <button type='button' title='Descargar documento' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo()}>
                                                                                        <i className='fas fa-download'></i>
                                                                                    </button>
                                                                                </div>
                                                                                : ""}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                : null
                                        }

                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="tipo_actuacion">TIPO DE ACTUACIÓN<span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="tipo_actuacion" name="tipo_actuacion" value={getTipoActuacion} onChange={selectChangeTipoActuacion}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="0">ACTUACIÓN</option>
                                                    <option value="1">IMPEDIMENTO</option>
                                                    <option value="2">COMISORIO</option>
                                                </Field>
                                                <ErrorMessage name="tipo_actuacion" component={() => (<span className="text-danger">{errors.tipo_actuacion}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="excluyente">¿ES EXCLUYENTE? <small>HASTA QUE NO SE APRUEBE, NO SE PUEDEN CREAR MÁS ACTUACIONES</small><span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="excluyente" name="excluyente" value={getExcluyenteSeleccionado} onChange={selectChangeExcluyente}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="1" selected>SI</option>
                                                    <option value="0">NO</option>
                                                </Field>
                                                <ErrorMessage name="excluyente" component={() => (<span className="text-danger">{errors.excluyente}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="visible">¿VISIBLE EN EL PORTAL CIUDADANO?</label>
                                                <Field as="select" className="form-control" id="visible" name="visible" value={getVisibleSeleccionado} onChange={selectChangeVisible}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="1" selected>SI</option>
                                                    <option value="0">NO</option>
                                                </Field>
                                                <ErrorMessage name="visible" component={() => (<span className="text-danger">{errors.visible}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="estado">ESTADO <span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="estado" name="estado" value={getEstadoSeleccionada} onChange={selectChangeEstado}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="1" selected>ACTIVO</option>
                                                    <option value="0">INACTIVO</option>
                                                </Field>
                                                <ErrorMessage name="estado" component={() => (<span className="text-danger">{errors.estado}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="cirraProceso">¿CIERRA EL PROCESO? <span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="cirraProceso" name="cirraProceso" value={getCierraProcesoSeleccionado} onChange={selectChangeCierraProceso}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="1">SI</option>
                                                    <option value="0">NO</option>
                                                </Field>
                                                <ErrorMessage name="cirraProceso" component={() => (<span className="text-danger">{errors.cirraProceso}</span>)} />
                                            </div>
                                        </div>

                                        {
                                            getTipoActuacion === '0' && getCierraProcesoSeleccionado === '0'
                                            ?
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="listarActuaciones">ANULA OTRAS ACTUACIONES<span className="text-danger">*</span></label>
                                                        <Field as="select" className="form-control" id="listarActuaciones" name="listarActuaciones" value={getListarActuacionesSeleccionada} onChange={selectChangeListarActuaciones}>
                                                            <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                            <option value="1">SI</option>
                                                            <option value="0">NO</option>
                                                        </Field>
                                                        <ErrorMessage name="listarActuaciones" component={() => (<span className="text-danger">{errors.listarActuaciones}</span>)} />
                                                    </div>
                                                </div>
                                            : 
                                                null
                                        }
                                        {
                                            getTipoActuacion === '0' && getCierraProcesoSeleccionado === '0'
                                            ?
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="cambiarEtapa">¿DEFINIR ETAPA DESPUÉS DE LA APROBACIÓN?</label>
                                                        <Field as="select" className="form-control" id="cambiarEtapa" name="cambiarEtapa" value={getEtapaCambiarSeleccionada} onChange={selectChangeCambiarEtapa}>
                                                            <option value="0">NO</option>
                                                            <option value="1">SI</option>
                                                        </Field>
                                                        <ErrorMessage name="cambiarEtapa" component={() => (<span className="text-danger">{errors.cambiarEtapa}</span>)} />
                                                    </div>
                                                </div>
                                            : 
                                                null
                                        }
                                          
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="generarAuto">¿SE GENERA AUTO?</label>
                                                <Field as="select" className="form-control" id="generarAuto" name="generarAuto" value={getGenerarAutoSeleccionada} onChange={selectChangeGenerarAuto}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="0">NO</option>
                                                    <option value="1">SI</option>
                                                </Field>
                                                <ErrorMessage name="generarAuto" component={() => (<span className="text-danger">{errors.generarAuto}</span>)} />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="block block-themed mt-2">
                                <div className="block-header">
                                    <h3 className="block-title">CAMPOS ADICIONALES</h3>
                                    
                                    <a className='text-white' data-toggle="collapse" href="#collapseCamposAdicionales" role="button" aria-expanded="false" aria-controls="collapseExample">
                                        <i className="fa fa-solid fa-arrow-down"></i>
                                    </a>
                                </div>
                                <div className="block-content collapse" id="collapseCamposAdicionales">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="nombreCampo">NOMBRE DEL CAMPO <span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreCampo" name="nombreCampo" value={getNombreCampo} onChange={changeNombreCampo} autocomplete="off"></Field>
                                                <ErrorMessage name="nombreCampo" component={() => (<span className="text-danger">{errors.nombreCampo}</span>)} />
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="tipoCampo">TIPO <span className="text-danger">*</span></label>
                                                <Field as="select" className="form-control" id="tipoCampo" name="tipoCampo" value={getTipoCampo} onChange={selectChangeTipoCampo}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="0" selected>TEXTO</option>
                                                    <option value="1">FECHA</option>
                                                    <option value="2">LISTA</option>
                                                </Field>
                                                <ErrorMessage name="tipoCampo" component={() => (<span className="text-danger">{errors.tipoCampo}</span>)} />
                                            </div>
                                        </div>

                                        <div className='col-md-3'>
                                            <div className="form-group" style={{ marginTop: '27px', cursor: 'pointer' }}>
                                                <a onClick={() => agregarCampo()} className="btn btn-rounded btn-primary" >
                                                    {global.Constants.BOTON_NOMBRE.REGISTRAR}
                                                </a>
                                            </div>
                                        </div>

                                        {validarCamposNuevos()}

                                        {getListadoCampos && getListadoCampos.length > 0 ?
                                            <div className="col-sm-8" style={{ marginTop: '40px' }} >
                                                <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase"
                                                    columns={columns}
                                                    data={getListadoCampos.filter((suggestion) => {
                                                        return suggestion;
                                                    })}
                                                    perPage={perPage}
                                                    page={pageActual}
                                                    pagination
                                                    noDataComponent="Sin datos"
                                                    paginationTotalRows={getListadoCampos.length}
                                                    onChangePage={handlePageChange}
                                                    onChangeRowsPerPage={handlePerRowsChange}
                                                    defaultSortFieldId="Nombre"
                                                    striped
                                                    paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                    defaultSortAsc={false}
                                                />
                                            </div>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="block block-themed mt-2">
                                <div className="block-header">
                                    <h3 className="block-title">TEXTOS INFORMATIVOS DE LAS TRANSACCIONES</h3>
                                    <a className='text-white' data-toggle="collapse" href="#collapseTextosInformativos" role="button" aria-expanded="false" aria-controls="collapseExample">
                                        <i className="fa fa-solid fa-arrow-down"></i>
                                    </a>
                                </div>
                                <div className="block-content collapse" id="collapseTextosInformativos">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <i className="fa fa-check text-success fa-2x mr-3"></i>
                                            <label htmlFor="dejarEnMisPendientes">DEJAR EN MIS PENDIENTES</label>
                                            <Field as="textarea" className="form-control" id="dejarEnMisPendientes" rows="3" name="dejarEnMisPendientes" placeholder="Información para dejar en mis pendientes...." value={getTextoTransaccion1} onChange={changeTextoTransaccion1}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea1} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="dejarEnMisPendientes" component={() => (<span className="text-danger">{errors.dejarEnMisPendientes}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <i className="fa fa-user text-success fa-2x mr-3"></i>
                                            <label htmlFor="enviarAAlguienDeMiDependencia">ENVIAR A ALGUIEN DE MI DEPENDENCIA</label>
                                            <Field as="textarea" className="form-control" id="enviarAAlguienDeMiDependencia" rows="3" name="enviarAAlguienDeMiDependencia" placeholder="Información para enviar a alguien de mi dependencia...." value={getTextoTransaccion2} onChange={changeTextoTransaccion2}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea2} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="enviarAAlguienDeMiDependencia" component={() => (<span className="text-danger">{errors.enviarAAlguienDeMiDependencia}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <i className="fa fa-check-double text-success fa-2x mr-3"></i>
                                            <label htmlFor="enviarAJefeDeLaDependencia">ENVIAR A LA JEFE DE MI DEPENDENCIA</label>
                                            <Field as="textarea" className="form-control" id="enviarAJefeDeLaDependencia" rows="3" name="enviarAJefeDeLaDependencia" placeholder="Información para enviar a jefe de la dependencia...." value={getTextoTransaccion3} onChange={changeTextoTransaccion3}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea3} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="enviarAJefeDeLaDependencia" component={() => (<span className="text-danger">{errors.enviarAJefeDeLaDependencia}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <i className="fa fa-paper-plane text-success fa-2x mr-3"></i>
                                            <label htmlFor="enviarAOtraDependencia">ENVIAR A OTRA DEPENDENCIA</label>
                                            <Field as="textarea" className="form-control" id="enviarAOtraDependencia" rows="3" name="enviarAOtraDependencia" placeholder="Información para enviar a otra dependencia...." value={getTextoTransaccion4} onChange={changeTextoTransaccion4}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea4} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="enviarAOtraDependencia" component={() => (<span className="text-danger">{errors.enviarAOtraDependencia}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <i className="fa fa-undo-alt text-success fa-2x mr-3"></i>
                                            <label htmlFor="regresarProcesoAlUltimoUsuario">REGRESAR EL PROCESO AL ÚLTIMO USUARIO QUE LO TUVO</label>
                                            <Field as="textarea" className="form-control" id="regresarProcesoAlUltimoUsuario" rows="3" name="regresarProcesoAlUltimoUsuario" placeholder="Información para regresar proceso al último usuario...." value={getTextoTransaccion5} onChange={changeTextoTransaccion5}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea5} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="regresarProcesoAlUltimoUsuario" component={() => (<span className="text-danger">{errors.regresarProcesoAlUltimoUsuario}</span>)} />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <i className="fa fa-arrow-right text-success fa-2x mr-3"></i>
                                            <label htmlFor="enviarAAlguienDeSecretariaComunDirigido">ENVIAR A ALGUIEN DE SECRETARIA COMÚN (REPARTO DIRIGIDO)</label>
                                            <Field as="textarea" className="form-control" id="enviarAAlguienDeSecretariaComunDirigido" rows="3" name="enviarAAlguienDeSecretariaComunDirigido" placeholder="Información para enviar el proceso a alguien de secretaria común dirigidamente...." value={getTextoTransaccion6} onChange={changeTextoTransaccion6}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea6} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="enviarAAlguienDeSecretariaComunDirigido" component={() => (<span className="text-danger">{errors.enviarAAlguienDeSecretariaComunDirigido}</span>)} />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <i className="fa fa-arrows-alt text-success fa-2x mr-3"></i>
                                            <label htmlFor="enviarAAlguienDeSecretariaComunAleatorio">ENVIAR A ALGUIEN DE SECRETARIA COMÚN (REPARTO ALEATORIO)</label>
                                            <Field as="textarea" className="form-control" id="enviarAAlguienDeSecretariaComunAleatorio" rows="3" name="enviarAAlguienDeSecretariaComunAleatorio" placeholder="Información para enviar el proceso a alguien de secretaria común aleatoriamente...." value={getTextoTransaccion7} onChange={changeTextoTransaccion7}></Field>
                                            <div className="text-right">
                                                <span className="text-primary">{countTextArea7} / {getMaximoTextArea}</span>
                                            </div>
                                            <ErrorMessage name="enviarAAlguienDeSecretariaComunAleatorio" component={() => (<span className="text-danger">{errors.enviarAAlguienDeSecretariaComunAleatorio}</span>)} />
                                        </div>
                                    </div>

                                    {inputListArchivosManual.map((x, i) => {
                                        return (
                                            <div className="col-md-6" key={i}>
                                                <div className="form-group">
                                                    <div className='row'>
                                                        <div className='col-md-12'>
                                                            <label>Manual (Word)</label>
                                                        </div>
                                                        <div className='col-md-12' style={{ marginLeft: '13px' }}>
                                                            <div className='row'>
                                                                <div className='col-md-10'>
                                                                    <label className="custom-file-label manual" htmlFor="example-file-input-custom2" data-toggle="manual">{x.archivoManual.name != null ? x.archivoManual.name : getNombrePlantillaManual}</label>
                                                                    <input className="custom-file-input manual" data-toggle="custom-file-input2" type="file" name="archivoManual" onChange={e => handleInputChangeArchivosManual(e, i)} />
                                                                    <label>PESO DEL ARCHIVO: {formatBytes(x.archivoManual.size)} </label>
                                                                    <ErrorMessage name="archivoManual" component={() => (<span className="text-danger">{errors.archivo}</span>)} />
                                                                </div>
                                                                {from != null ?
                                                                    <div className='col-2'>
                                                                        <button type='button' title='Descargar documento' className='btn btn-sm btn-primary' onClick={() => handleClicArchivoManual()}>
                                                                            <i className='fas fa-download'></i>
                                                                        </button>
                                                                    </div>
                                                                    : ""}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>

                            <div className="block block-themed mt-2">
                                <div className="block-header">
                                    <h3 className="block-title">ROLES Y ETAPAS QUE PUEDEN CREAR ACTUACIONES</h3>
                                    <a className='text-white' data-toggle="collapse" href="#collapseRoles" role="button" aria-expanded="false" aria-controls="collapseExample">
                                        <i className="fa fa-solid fa-arrow-down"></i>
                                    </a>
                                </div>
                                <div className="block-content collapse" id="collapseRoles">
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <label htmlFor="cambiarEtapa" style={{ paddingBottom: "10px" }}>ETAPAS EN LAS QUE SE PUEDE CREAR LA ACTUACIÓN: </label>
                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                <thead>
                                                    <tr>
                                                        <th width="30%">ETAPA</th>
                                                        <th width="30%">ACTIVO</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        getListaEtapas.map((etapa, index) => {
                                                            return (
                                                                <tr key={(index)}>
                                                                    <td>
                                                                        { etapa.nombre }
                                                                    </td>
                                                                    <td>
                                                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                                                            {
                                                                                <>
                                                                                    <input defaultChecked={etapa.estado === '1'} type="checkbox" onChange={e => agregarCheckEtapa(e.target.checked, index)} className="custom-control-input" id={"etapa"+etapa.id_mas_etapa} name={"etapa"+etapa.id_mas_etapa} />
                                                                                    <label className="custom-control-label" htmlFor={"etapa"+etapa.id_mas_etapa}></label>
                                                                                </>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-12"><div className="content-heading"></div>                               
                                            <label htmlFor="cambiarEtapa"  style={{ paddingBottom: "10px" }}>ROLES CON CAPACIDAD PARA CREAR LA ACTUACIÓN: </label> <br></br>
                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                <thead>
                                                    <tr>
                                                        <th width="30%">ROL</th>
                                                        <th width="30%">ACTIVO</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr key="todos">
                                                        <td>TODOS LOS ROLES</td>
                                                        <td>
                                                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                                                {
                                                                    <>
                                                                        <input defaultChecked={getTodosRoles} type="checkbox" onChange={e => agregarCheckTodosRoles(e.target.checked)} className="custom-control-input" id="todos_roles" name="todos_roles" />
                                                                        <label className="custom-control-label" htmlFor="todos_roles"></label>
                                                                    </>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {
                                                        getListaRoles.map((rol, index) => {
                                                            return (
                                                                <tr key={(index)}>
                                                                    <td>
                                                                        { rol.nombre_rol.toUpperCase() }
                                                                    </td>
                                                                    <td>
                                                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                                                            {
                                                                                <>
                                                                                    <input defaultChecked={rol.estado == '1'} type="checkbox" onChange={e => agregarCheckRoles(e.target.checked, index)} className="custom-control-input" id={"rol"+rol.id_rol} name={"rol"+rol.id_rol} />
                                                                                    <label className="custom-control-label" htmlFor={"rol"+rol.id_rol}></label>
                                                                                </>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary" >
                                    {from != null ? global.Constants.BOTON_NOMBRE.ACTUALIZAR : global.Constants.BOTON_NOMBRE.REGISTRAR}
                                </button>
                                <Link to={'/ActuacionesAdministracion'} className="font-size-h5 font-w600" >
                                    <button type="button" className="btn btn-rounded btn-outline-primary" >{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>
    );
};

