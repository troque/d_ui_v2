import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Spinner from '../Utils/Spinner';
import { Link } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import '../Utils/Constants';
import DataTable from 'react-data-table-component';
import ModalGen from '../Utils/Modals/ModalGeneric';
import Constants from '../Utils/Constants';

export default function SemaforosForm() {

    const [getNombreSemaforo, setNombreSemaforo] = useState("");
    const [getEventoInicio, setEventoInicio] = useState("");
    const [getActuacionIniciaSemaforo, setActuacionIniciaSemaforo] = useState("");
    const [getEtapaDeLaActuacionInicia, setEtapaDeLaActuacionInicia] = useState("");
    const [getEtapaDeLaActuacionFinaliza, setEtapaDeLaActuacionFinaliza] = useState("");
    const [getGrupoIniciaSemaforo, setGrupoIniciaSemaforo] = useState("");
    const [getDependenciaIniciaSemaforo, setDependenciaIniciaSemaforo] = useState("");
    const [getEstadoSeleccionada, setEstadoSeleccionada] = useState("");
    const [getAutoFinaliza, setAutoFinaliza] = useState("");
    const [getAutoFinalizaText, setAutoFinalizaText] = useState("");
    const [getEtapaFinalizaText, setEtapaFinalizaText] = useState("");
    const [getNombreCampoFecha, setNombreCampoFecha] = useState("");
    const [getRangoInicial, setRangoInicial] = useState();
    const [getRangoFinal, setRangoFinal] = useState("");
    const [getColor, setColor] = useState("");
    const [getMasEventoDeInicioLista, setMasEventoDeInicioLista] = useState({ data: [] });
    const [getCondicionesLista, setCondicionesLista] = useState({ data: [] });
    const [getActuacionesLista, setActuacionesLista] = useState({ data: [] });
    const [getActuacionesListaInicio, setActuacionesListaInicio] = useState({ data: [] });
    const [getActuacionesListaFinal, setActuacionesListaFinal] = useState({ data: [] });
    const [getEtapasLista, setEtapasLista] = useState({ data: [] });
    const [getAutoFinalizaLista, setAutoFinalizaLista] = useState({ data: [] });
    const [getGruposLista, setGruposLista] = useState({ data: [] });
    const [getDependenciasLista, setDependenciasLista] = useState({ data: [] });
    const [getrespuestaMasEventoInicio, setrespuestaMasEventoInicio] = useState(false);
    const [getrespuestaMasActuaciones, setrespuestaMasActuaciones] = useState(false);
    const [getrespuestaMasActuacionesInicio, setrespuestaMasActuacionesInicio] = useState(false);
    const [getrespuestaMasActuacionesFin, setrespuestaMasActuacionesFin] = useState(false);
    const [getrespuestaMasEtapas, setrespuestaMasEtapas] = useState(false);
    const [getRespuestaGrupos, setRespuestaGrupos] = useState(false);
    const [getRespuestaDependencias, setRespuestaDependencias] = useState(false);
    const [getRepuestaNombreSemaforo, setRepuestaNombreSemaforo] = useState(false);
    const [getRepuestaNombreCampoFecha, setRepuestaNombreCampoFecha] = useState(false);
    
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getDatosEditables, setDatosEditables] = useState(true);

    const location = useLocation();
    const { from } = location.state;

    let numeroLlamados = 0;
    let numeroTotalLlamados = 4;

    // Funcion para validar y detener el spinner
    const validacionSpinner = () => {
        numeroLlamados++
        if(numeroLlamados >= numeroTotalLlamados){
            window.showSpinner(false);
        }
    }

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            if (from != null) {
                setDatosEditables(false)
                setNombreSemaforo(from.attributes.nombre);
                setRepuestaNombreSemaforo(true)
                setEventoInicio(from.attributes.id_mas_evento_inicio.id);
                getCondiciones(from.id);
                getAutosFinalizan(from.id);
                setEstadoSeleccionada(from.attributes.estado);
                setNombreCampoFecha(from.attributes.nombre_campo_fecha); 
                setRepuestaNombreCampoFecha(true);
                if(from.attributes.id_mas_actuacion_inicia != null){
                    setActuacionIniciaSemaforo(from.attributes.id_mas_actuacion_inicia.id);
                    setEtapaDeLaActuacionInicia(from.attributes.id_etapa);
                    getActuacionesPorEtapa(from.attributes.id_etapa, true)
                }
                if(from.attributes.id_mas_dependencia_inicia != null){
                    setDependenciaIniciaSemaforo(from.attributes.id_mas_dependencia_inicia.id);
                }
                if(from.attributes.id_mas_grupo_trabajo_inicia != null){
                    setGrupoIniciaSemaforo(from.attributes.id_mas_grupo_trabajo_inicia.id);
                }
            }
            getMasEventosDeInicio();
            getEtapas();
            //getActuaciones();
            getDependencias();
            getGrupos();

        }
        fetchData();
    }, []);

    const getGrupos = () => {
        GenericApi.getAllGeneric('mas_grupo_trabajo').then(
            datos =>{

                validacionSpinner()

                if (!datos.error) {
                    setGruposLista(datos);
                    setRespuestaGrupos(true);
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const getDependencias = () => {
        GenericApi.getAllGeneric('mas-dependencia-origen-activas').then(
            datos =>{

                validacionSpinner()

                if (!datos.error) {
                    setDependenciasLista(datos);
                    setRespuestaDependencias(true);
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const getMasEventosDeInicio= () => {
        GenericApi.getAllGeneric('mas_evento_inicio').then(
            datos =>{

                validacionSpinner()

                if (!datos.error) {
                    setMasEventoDeInicioLista(datos);
                    setrespuestaMasEventoInicio(true);
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const getCondiciones = (id) => {
        GenericApi.getAllGeneric('condiciones-por-semaforo/'+id).then(
            datos =>{

                validacionSpinner()

                if (!datos.error) {
                    setCondicionesLista(datos);
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const getAutosFinalizan = (id) => {
        GenericApi.getAllGeneric('autosfinalizan/'+id).then(
            datos =>{

                validacionSpinner()

                if (!datos.error) {
                    setAutoFinalizaLista(datos);
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            } 
        )
    }

    const getActuaciones = () => {
        GenericApi.getAllGeneric('mas_actuaciones').then(
            datos =>{

                validacionSpinner()

                if (!datos.error) {                    
                    datos.data.forEach(element => {                        
                        if(from?.attributes?.id_mas_actuacion_inicia?.id == element.id){
                            setEtapaDeLaActuacionInicia(element.attributes.id_etapa);
                        }
                    });
                    setActuacionesLista(datos);
                    setrespuestaMasActuaciones(true);
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const getEtapas = () => {
        GenericApi.getAllGeneric('mas-etapa').then(
            datos =>{

                validacionSpinner()

                if (!datos.error) {
                    setEtapasLista(datos);
                    setrespuestaMasEtapas(true);
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }
    
    const changeNombreSemaforo = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreSemaforo(e.target.value);
            setRepuestaNombreSemaforo(true);
        }
    }

    const getActuacionesPorEtapa = (idEtapa, inicio) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('actuaciones/get-actuaciones-etapa/'+idEtapa).then(
            datos =>{
                if (!datos.error) {
                    if(inicio){
                        setActuacionesListaInicio(datos)
                        setrespuestaMasActuacionesInicio(true)
                    }
                    else{
                        setActuacionesListaFinal(datos)
                        setrespuestaMasActuacionesFin(true)
                    }
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datos.error.toString().toUpperCase(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }                
                window.showSpinner(false);
            } 
        )
    }
    const changeEventoInicio = (e) => {
        console.log(e.target.value);
        setEventoInicio(e.target.value);
        if(e.target.value == 1  || e.target.value == 6){
            setActuacionIniciaSemaforo("");
            setDependenciaIniciaSemaforo("");
            setGrupoIniciaSemaforo("");
        }else if(e.target.value == 2 || e.target.value == 3){
            setDependenciaIniciaSemaforo("");
            setGrupoIniciaSemaforo("");
        }else if(e.target.value == 4){
            setActuacionIniciaSemaforo("");
            setDependenciaIniciaSemaforo("");
        }else if(e.target.value == 5){
            setActuacionIniciaSemaforo("");
            setGrupoIniciaSemaforo("");
        }

        if(e.target.value != 3 && e.target.value != 6){
            setNombreCampoFecha("");
        }
    }

    const changeActuacionIniciaSemaforo = (e) => {
        console.log(e.target.name);
        if(e.target.name == "actuacionIniciaSemaforo"){
            setActuacionIniciaSemaforo(e.target.value);
        }else if (e.target.name == "dependenciaIniciaSemaforo"){
            setDependenciaIniciaSemaforo(e.target.value);
        }else if(e.target.name == "grupoIniciaSemaforo"){
            setGrupoIniciaSemaforo(e.target.value);
        }
        else if(e.target.name == "etapaDeLaActuacionInicia"){
            setEtapaDeLaActuacionInicia(e.target.value);
            getActuacionesPorEtapa(e.target.value, true)
            console.log(e.target.value+" -- "+getEtapaDeLaActuacionFinaliza);
            if((getEventoInicio == 2 || getEventoInicio == 3) 
            && (e.target.value != getEtapaDeLaActuacionFinaliza) 
            && (getEtapaDeLaActuacionFinaliza != "")){
                setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'LA ETAPA DE INICIO SELECCIONADA NO COINICE CON LA ETAPA QUE FINALZA', show: true, alert: global.Constants.TIPO_ALERTA.ADVERTENCIA });
            }
        }
        else if(e.target.name == "etapaDeLaActuacionFinaliza"){
            setEtapaDeLaActuacionFinaliza(e.target.value);
            getActuacionesPorEtapa(e.target.value, false)            
            setEtapaFinalizaText(getEtapasLista.data.find(dato => dato.id == e.target.value).attributes.nombre.toUpperCase())
            console.log(getEtapaDeLaActuacionInicia+" -- "+e.target.value);
            /*if((getEventoInicio == 2 || getEventoInicio == 3) 
            && (getEtapaDeLaActuacionInicia != e.target.value) 
            && (getEtapaDeLaActuacionInicia != "")){
                setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'LA ETAPA DE FINALIZACIÓN NO COINCIDE CON LA ETAPA QUE INICIA', show: true, alert: global.Constants.TIPO_ALERTA.ADVERTENCIA });
            }*/
        }
        
    }

    const changeAutoFinaliza = (e) => {
        setAutoFinaliza(e.target.value);
        var index = e.nativeEvent.target.selectedIndex;
        setAutoFinalizaText(e.nativeEvent.target[index].text);
    }

    const changeNombreCampoFecha = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreCampoFecha(e.target.value);
            setRepuestaNombreCampoFecha(true);
        }
       
    }
    
    const selectMasEventoInicio = () => {
        return (
            getMasEventoDeInicioLista.data.map((evento, i) => {
                return (
                    <option key={evento.id} value={evento.id}>{evento.attributes.nombre}</option>
                )
            })
        )
    }

    const selectActuaciones = () => {
        return (
            getActuacionesListaInicio.data.map((evento, i) => {
                return (
                    <option key={evento.id} value={evento.id}>{evento?.attributes?.nombre_actuacion?.toUpperCase()}</option>
                )                
            })
        )
    }

    const selectActuacionesFinaliza = () => {
        return (
            getActuacionesListaFinal.data.map((evento, i) => {
                return (
                    <option key={evento.id} value={evento.id}>{evento.attributes.nombre_actuacion.toUpperCase()}</option>
                )                
            })
        )
    }

    const selectEtapas = () => {
        return (
            getEtapasLista.data.map((evento, i) => {
                if(    
                       evento.id != Constants.ETAPAS.CAPTURA_REPARTO 
                    && evento.id != Constants.ETAPAS.EVALUACION 
                    && evento.id != Constants.ETAPAS.INICIO_PROCESO_DISCIPLINARIO
                ){
                    return (
                        <option key={evento.id} value={evento.id}>{evento.attributes.nombre.toUpperCase()}</option>
                    )
                }
            })
        )
    }

    const selectGrupos = () => {
        return (
            getGruposLista.data.map((evento, i) => {
                return (
                    <option key={evento.id} value={evento.id}>{evento.attributes.nombre.toUpperCase()}</option>
                )
            })
        )
    }

    const selectDependencias = () => {
        return (
            getDependenciasLista.data.map((evento, i) => {
                return (
                    <option key={evento.id} value={evento.id}>{evento.attributes.nombre.toUpperCase()}</option>
                )
            })
        )
    }

    const changeRangoInicial = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(e.target.value) && 
        e.target.value.length <= 5)) {
            setRangoInicial(e.target.value);
        }
    }

    const changeRangoFinal = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(e.target.value) && 
        e.target.value.length <= 5)) {
            setRangoFinal(e.target.value);
        }
        
    }

    const changeColor = (e) => {
        setColor(e.target.value);
    }

    const eliminarCondicion = (condicion) =>{
        if(condicion.attributes.id_semaforo != undefined){
            let dataCondicion = {
                "data": {
                    "type": "condicion",
                    "attributes": {
                        "inicial": condicion.attributes.inicial,
                        "final": condicion.attributes.final,
                        "color": condicion.attributes.color,
                        "id_semaforo": condicion.attributes.id_semaforo.id,
                        "estado": 0,
                    }
                }
            }
            GenericApi.updateGeneric('condicion', condicion.id , dataCondicion);
            refrescarTablaCondiciones(condicion.id);
        }else if(condicion.attributes.id_semaforo == undefined){
            refrescarTablaCondiciones(condicion.secuencia);
        }else{
            setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'HUBO UN ERROR AL AGREGAR LA CONDICIÓN', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
        }
    }

    const refrescarTablaCondiciones = (id) =>{
        let data = getCondicionesLista.data.filter(obj => {
            if(obj.id != undefined){
                return obj.id !== id;
            }else{
                return obj.secuencia !== id;
            }
        });
        let datas = {data}
        setCondicionesLista(datas);
        setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
    };

    const eliminarAuto = (auto) =>{
        if(auto.attributes.id_semaforo != undefined){
            let dataAutoFinaliza = {
                "data": {
                    "type": "auto_finaliza",
                    "attributes": {
                        "id_semaforo": auto.attributes.id_semaforo.id,
                        "id_etapa": auto.attributes.id_semaforo.id_etapa,
                        "id_mas_actuacion": auto.attributes.id_mas_actuacion.id,
                        "estado": 0,
                    }
                }
            }
            GenericApi.updateGeneric('auto_finaliza', auto.id , dataAutoFinaliza);
            refrescarTablaAutos(auto.id);
        }else if(auto.attributes.id_semaforo == undefined){
            refrescarTablaAutos(auto.secuencia);
        }else{
            setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'HUBO UN EEROR AL AGREGAR EL AUTO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
        }
    }

    const refrescarTablaAutos = (id) =>{
        let data = getAutoFinalizaLista.data.filter(obj => {
            if(obj.id != undefined){
                return obj.id !== id;
            }else{
                return obj.secuencia !== id;
            }
        });
        let datas = {
            data
        }
        setAutoFinalizaLista(
            datas
        );
        setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
    };

    const columnsCondiciones = [
        {
            name: 'RANGO INICIAL',
            selector: condicion => (condicion.attributes.inicial.toUpperCase())
        },
        {
            name: 'RANGO FINAL',
            selector: condicion => (condicion.attributes.final?.toUpperCase())
        },
        {
            name: 'COLOR',
            selector: condicion => (condicion.attributes.color.toUpperCase())
        },
        {
            name: 'ACCIONES',
            cell: condicion => 
            <div>
                <button type="button" className="btn btn btn-primary" title='Eliminar' onClick={() => eliminarCondicion(condicion)}>
                    <i className="fa fa-fw fa-trash-alt"></i>
                </button>
            </div>
        }
    ]; 

    const columnsAutoFinaliza = [
        {
            name: 'AUTO',
            selector: auto => (auto.attributes.id_mas_actuacion != undefined ? auto.attributes.id_mas_actuacion.nombre_actuacion.toUpperCase() : auto.attributes.nombre_actuacion.toUpperCase()),
        },
        {
            name: 'ETAPA',
            selector: auto => (auto.attributes.id_etapa != undefined ? (auto.attributes.id_etapa?.nombre ? auto.attributes.id_etapa?.nombre : Object.values(getEtapasLista.data.find(dato => dato.id == auto.attributes.id_etapa).attributes.nombre.toUpperCase()) ) : 'HOLA 2'),
        },
        {
            name: 'ACCIONES',
            cell: auto => 
            <div>
                <button type="button" className="btn btn btn-primary" title='Eliminar' onClick={() => eliminarAuto(auto)}>
                <i className="fa fa-fw fa-trash-alt"></i>
                </button>
            </div>,
            width: "10%"
        }
    ];

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);

    }

    const between = (x, min, max) =>{
        return x >= min && x <= max;
    }

    const AgregarCondicion = () => {
        try {
            let actualInicial = parseInt(getRangoInicial, 10);
            let actualFinal = parseInt(getRangoFinal, 10);
            let interseccion = 0 ;
            let repiteColor = 0;

            if(actualInicial < 0 || actualFinal < 0){
                setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'LOS RANGOS DEBEN SER MAYORES A CERO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                return;
            }

            let data = {
                "type": "condicion",
                "secuencia": getCondicionesLista.data.length + 1,
                "attributes": {
                    "inicial": getRangoInicial,
                    "final": getRangoFinal,
                    "color": getColor,
                }
            }

            getCondicionesLista.data.forEach(element => {
                let eleInicial =  parseInt(element.attributes.inicial, 10) ;
                let eleFinal =  parseInt(element.attributes.final, 10) ;
                console.log(getColor +" - "+ element.attributes.color);
                if(getColor == element.attributes.color){
                    repiteColor++;
                }
                if(
                    (actualInicial >= eleInicial && actualInicial <= eleFinal) ||
                    (actualFinal   >= eleInicial && actualFinal   <= eleFinal) ||
                    (actualInicial == eleInicial) ||
                    (between(eleInicial, actualInicial, actualFinal)) ||
                    (isNaN(eleFinal) && actualInicial >= eleInicial) ||
                    (isNaN(actualFinal) && actualInicial <= eleFinal) ||
                    (isNaN(actualFinal) && isNaN(eleFinal))
                    ){
                    interseccion++;
                }
            });

            if(data.attributes.inicial != "" && data.attributes.color != ""){
                if(repiteColor >= 1){
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'YA EXISTE UN RANGO CON ESE COLOR', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }else{
                    if(actualFinal > actualInicial || isNaN(actualFinal)){
                        if(interseccion >= 1){
                            setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'SE INTERSECTAN LOS RANGOS', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                        }else{
                            getCondicionesLista.data.push(data);
                            setRangoFinal("");
                            setRangoInicial("");
                            setColor("");
                            setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
                        }
                    }else{
                        setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'EL RANGO INICIAL DEBE SER MENOR AL RANGO FINAL', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
                
            }else{
                setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'EL RANGO INICIAL Y EL COLOR SON OBLIGATORIOS', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            }
        } catch (error) {
            setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: "HUBO UN ERROR AL ENVIAR LOS DATOS. INTENTELO NUEVAMENTE" , show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
        }
    }

    const AgregarAutoFinaliza = () => {
        if(getAutoFinaliza != ""){
            try {
                let data = {
                    "type": "auto_finaliza",
                    "secuencia": getAutoFinalizaLista.data.length + 1,
                    "attributes": {
                        "id_etapa": getEtapaDeLaActuacionFinaliza,
                        "id_mas_actuaciones": getAutoFinaliza,
                        "nombre_actuacion": getAutoFinalizaText,
                        "nombre_etapa": getEtapaFinalizaText,
                    }
                }
                getAutoFinalizaLista.data.push(data);

                if(getAutoFinalizaLista.data.length == 2){
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'EL AUTO QUE FINALIZA EL SEMÁFORO SERÁ El PRIMERO ES SER APROBADO', show: true, alert: global.Constants.TIPO_ALERTA.ADVERTENCIA });
                }else{
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
                }

                
                
            } catch (error) {
                setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: "HUBO UN ERROR AL ENVIAR LOS DATOS. INTENTELO NUEVAMENTE" , show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            }
        }else{
            setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: 'SELECCIONA UN AUTO', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
        }
    }

    const enviarDatos = (valores) => {
        let dataSemaforo = {
            "data": {
                "type": "semaforo",
                "attributes": {
                    "nombre": getNombreSemaforo,
                    "id_mas_evento_inicio": getEventoInicio,
                    "id_etapa": getEtapaDeLaActuacionInicia,
                    "id_mas_actuacion_inicia": getActuacionIniciaSemaforo,
                    "id_mas_dependencia_inicia": getDependenciaIniciaSemaforo,
                    "id_mas_grupo_trabajo_inicia": getGrupoIniciaSemaforo,
                    "nombre_campo_fecha": getNombreCampoFecha,
                    "estado": getEstadoSeleccionada,
                }
            }
        }

        window.showSpinner(true)

        GenericApi.addGeneric('semaforo', dataSemaforo).then(
            datosSemaforo => {
                if (!datosSemaforo.error) {
                    getAutoFinalizaLista.data.forEach(element => {
                        let dataAutoFinaliza = {
                            "data": {
                                "type": "auto_finaliza",
                                "attributes": {
                                    "id_semaforo": datosSemaforo.data.id,
                                    "id_etapa": getEtapaDeLaActuacionFinaliza,
                                    "id_mas_actuacion": element.attributes.id_mas_actuaciones,
                                    "estado": getEstadoSeleccionada,
                                }
                            }
                        }
                        GenericApi.addGeneric('auto_finaliza', dataAutoFinaliza);
                    });
                    getCondicionesLista.data.forEach(element => {
                        let dataCondicion = {
                            "data": {
                                "type": "condicion",
                                "attributes": {
                                    "inicial": element.attributes.inicial,
                                    "final": element.attributes.final,
                                    "color": element.attributes.color,
                                    "id_semaforo": datosSemaforo.data.id,
                                    "estado": getEstadoSeleccionada,
                                }
                            }
                        }
                        GenericApi.addGeneric('condicion', dataCondicion);
                    });
                    
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/Semaforos', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datosSemaforo.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false)
            }
        );
    }

    const actualizarDatos = (valores) => {
        let dataSemaforo = {
            "data": {
                "type": "semaforo",
                "attributes": {
                    "nombre": getNombreSemaforo,
                    "id_mas_evento_inicio": getEventoInicio,
                    "id_etapa": getEtapaDeLaActuacionInicia,
                    "id_mas_actuacion_inicia": getActuacionIniciaSemaforo,
                    "id_mas_dependencia_inicia": getDependenciaIniciaSemaforo,
                    "id_mas_grupo_trabajo_inicia": getGrupoIniciaSemaforo,
                    "nombre_campo_fecha": getNombreCampoFecha,
                    "estado": getEstadoSeleccionada,
                }
            }
        }

        window.showSpinner(true)

        GenericApi.updateGeneric('semaforo', from.id , dataSemaforo).then(
            datosSemaforo => {
                if (!datosSemaforo.error) {
                    getAutoFinalizaLista.data.forEach(element => {
                        if(element.secuencia != undefined){
                            let dataAutoFinaliza = {
                                "data": {
                                    "type": "auto_finaliza",
                                    "attributes": {
                                        "id_semaforo": datosSemaforo.data.id,
                                        "id_etapa": getEtapaDeLaActuacionFinaliza,
                                        "id_mas_actuacion": element.attributes.id_mas_actuaciones,
                                        "estado": getEstadoSeleccionada,
                                    }
                                }
                            }
                            GenericApi.addGeneric('auto_finaliza', dataAutoFinaliza);
                        }
                    });
                    getCondicionesLista.data.forEach(element => {
                        if(element.secuencia != undefined){
                            let dataCondicion = {
                                "data": {
                                    "type": "condicion",
                                    "attributes": {
                                        "inicial": element.attributes.inicial,
                                        "final": element.attributes.final,
                                        "color": element.attributes.color,
                                        "id_semaforo": datosSemaforo.data.id,
                                        "estado": getEstadoSeleccionada,
                                    }
                                }
                            }
                            GenericApi.addGeneric('condicion', dataCondicion);
                        }
                    });
                    
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/Semaforos', alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN :: SEMAFORIZACIÓN", message: datosSemaforo.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false)
            }
        );
    }

    const selectChangeEstado = (e) => {
        setEstadoSeleccionada(e.target.value);
    }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    nombreSemaforo: '',
                    eventoInicio: '',
                    estado: '',
                    nombreCampoFecha: '',
                    actuacionIniciaSemaforo: '',
                    grupoIniciaSemaforo: '',
                    dependenciaIniciaSemaforo: ''
                }}
                enableReinitialize
                validate={(valores) => {

                    let errors = {}

                    if(getRepuestaNombreSemaforo == false){
                        errors.enviarAAlguienDeMiDependencia = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    if(!getNombreSemaforo){
                        errors.nombreSemaforo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }
                    
                    if(!getEventoInicio){
                        errors.eventoInicio = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if(!getEstadoSeleccionada){
                        errors.estado = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }
                    if(getEventoInicio == 3 || getEventoInicio == 6){
                        if(getRepuestaNombreCampoFecha == false){
                            errors.nombreCampoFecha = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                        }
                        if(!getNombreCampoFecha){
                            errors.nombreCampoFecha = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }
                    }

                    if(getEventoInicio == 2 || getEventoInicio == 3){
                        if(!getActuacionIniciaSemaforo){
                            errors.actuacionIniciaSemaforo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }
                    }else if(getEventoInicio == 4){
                        if(!getGrupoIniciaSemaforo){
                            errors.grupoIniciaSemaforo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                    }else if(getEventoInicio == 5){
                        if(!getDependenciaIniciaSemaforo){
                            errors.dependenciaIniciaSemaforo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }
                    }

                    return errors;
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
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/semaforos`}> <small>Lista de semáforos</small></Link></li>
                                                <li className="breadcrumb-item"> <small>{from != null ? "Actualizar" : "Crear"} Semáforo</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: CONFIGURACIÓN DE SEMÁFOROS</h3>
                                </div>
                                <div className="block-content">

                                    <div className="row text-right w2d-enter">
                                        <div className="col-md-12">
                                            <Link to={'/semaforos'} title='Regresar'>
                                                <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                            </Link>                                            
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="nombreSemaforo">NOMBRE DEL SEMÁFORO<span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreSemaforo" name="nombreSemaforo" value={getNombreSemaforo} onChange={changeNombreSemaforo} autocomplete="off"></Field>
                                                <ErrorMessage name="nombreSemaforo" component={() => (<span className="text-danger">{errors.nombreSemaforo}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="eventoInicio">EVENTO DE INICIO<span className="text-danger">*</span></label>
                                                <Field as="select" value={getEventoInicio} onChange={changeEventoInicio} className="form-control" id="eventoInicio" name="eventoInicio" placeholder="Evento de inicio" disabled={!getDatosEditables}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getrespuestaMasEventoInicio ? selectMasEventoInicio() : null}
                                                </Field>
                                                <ErrorMessage name="eventoInicio" component={() => (<span className="text-danger">{errors.eventoInicio}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
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

                                        {getEventoInicio == 2 || getEventoInicio == 3 ? (
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="etapaDeLaActuacionInicia">ETAPA {/*Etapa de la actuación que inicia*/}</label>
                                                    <Field as="select" value={getEtapaDeLaActuacionInicia} onChange={changeActuacionIniciaSemaforo} className="form-control" id="etapaDeLaActuacionInicia" name="etapaDeLaActuacionInicia" placeholder=" Etapa de la actuación que inicia" disabled={!getDatosEditables}>
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {getrespuestaMasEtapas ? selectEtapas() : null}
                                                    </Field>
                                                    <ErrorMessage name="etapaDeLaActuacionInicia" component={() => (<span className="text-danger">{errors.etapaDeLaActuacionInicia}</span>)} />
                                                </div>
                                            </div>
                                        ) : null}
                                        {getEventoInicio == 2 || getEventoInicio == 3 ? (
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="actuacionIniciaSemaforo">ACTUACIÓN QUE INICIA EL SEMÁFORO</label>
                                                    <Field as="select" value={getActuacionIniciaSemaforo} onChange={changeActuacionIniciaSemaforo} className="form-control" id="actuacionIniciaSemaforo" name="actuacionIniciaSemaforo" placeholder="Actuacion que inicia el semáforo" disabled={!getDatosEditables}>
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {getrespuestaMasActuacionesInicio ? selectActuaciones() : null}
                                                    </Field>
                                                    <ErrorMessage name="actuacionIniciaSemaforo" component={() => (<span className="text-danger">{errors.actuacionIniciaSemaforo}</span>)} />
                                                </div>
                                            </div>
                                        ) : null}

                                        {getEventoInicio == 4 ? (
                                            <div className="col-md-8">
                                                <div className="form-group">
                                                    <label htmlFor="grupoIniciaSemaforo">GRUPO DE SECRETARIA COMÚN QUE INICIA EL SEMÁFORO</label>
                                                    <Field as="select" value={getGrupoIniciaSemaforo} onChange={changeActuacionIniciaSemaforo} className="form-control" id="grupoIniciaSemaforo" name="grupoIniciaSemaforo" placeholder="Grupo que inicia el semáforo" disabled={!getDatosEditables}>
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {getRespuestaGrupos ? selectGrupos() : null}
                                                    </Field>
                                                    <ErrorMessage name="grupoIniciaSemaforo" component={() => (<span className="text-danger">{errors.grupoIniciaSemaforo}</span>)} />
                                                </div>
                                            </div>
                                        ) : null}

                                        {getEventoInicio == 5 ? (
                                            <div className="col-md-8">
                                                <div className="form-group">
                                                    <label htmlFor="dependenciaIniciaSemaforo">DEPENDENCIA QUE INICIA EL SEMÁFORO</label>
                                                    <Field as="select" value={getDependenciaIniciaSemaforo} onChange={changeActuacionIniciaSemaforo} className="form-control" id="dependenciaIniciaSemaforo" name="dependenciaIniciaSemaforo" placeholder="Dependencia que inicia el semáforo" disabled={!getDatosEditables}>
                                                        <option value="">Seleccione una opción</option>
                                                        {getRespuestaDependencias ? selectDependencias() : null}
                                                    </Field>
                                                    <ErrorMessage name="dependenciaIniciaSemaforo" component={() => (<span className="text-danger">{errors.dependenciaIniciaSemaforo}</span>)} />
                                                </div>
                                            </div>
                                        ) : null}
                                        
                                        {getEventoInicio == 3 || getEventoInicio == 6 ? (
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="nombreCampoFecha">DESCRIPCIÓN DEL CAMPO FECHA<span className="text-danger">*</span></label>
                                                    <Field as="input" type="text" className="form-control" id="nombreCampoFecha" name="nombreCampoFecha" value={getNombreCampoFecha} onChange={changeNombreCampoFecha} autocomplete="off"></Field>
                                                    <ErrorMessage name="nombreCampoFecha" component={() => (<span className="text-danger">{errors.nombreCampoFecha}</span>)} />
                                                </div>
                                            </div>
                                        ) : null}
                                    
                                    </div>
                                    <div className='row mt-5'>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="rangoInicial">RANGO INICIAL<span className="text-danger">*</span></label>
                                                <Field as="input" type="number" className="form-control" id="rangoInicial" name="rangoInicial" value={getRangoInicial} onChange={changeRangoInicial} autocomplete="off"></Field>
                                                <ErrorMessage name="rangoInicial" component={() => (<span className="text-danger">{errors.rangoInicial}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="rangoFinal">RANGO FINAL</label>
                                                <Field as="input" type="number" className="form-control" id="rangoFinal" name="rangoFinal" value={getRangoFinal} onChange={changeRangoFinal} autocomplete="off"></Field>
                                                <ErrorMessage name="rangoFinal" component={() => (<span className="text-danger">{errors.rangoFinal}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="color">COLOR DEL SEMÁFORO<span className="text-danger">*</span></label>
                                                <Field as="select" value={getColor} onChange={changeColor} className="form-control" id="color" name="color" placeholder="color">
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    <option value="Verde">VERDE</option>
                                                    <option value="Amarillo">AMARILLO</option>
                                                    <option value="Rojo">ROJO</option>
                                                </Field>
                                                <ErrorMessage name="color" component={() => (<span className="text-danger">{errors.color}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-3 align-self-end">
                                            <div className="form-group">
                                                <button type="button" className="btn btn-rounded btn-primary" onClick={() => AgregarCondicion()}>{global.Constants.BOTON_NOMBRE.AGREGAR}</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columnsCondiciones}

                                                data={getCondicionesLista.data.filter((suggestion) => {
                                                    return suggestion;
                                                })}
                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent="Sin datos"
                                                paginationTotalRows={getCondicionesLista.data.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                defaultSortFieldId="Nombre"
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                defaultSortAsc={false}
                                            />
                                        </div>
                                    </div>
                                    {getEventoInicio == 1 || getEventoInicio == 2 || getEventoInicio == 3 || getEventoInicio == 6 ? (
                                    <div className='row mt-5'>
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <label htmlFor="etapaDeLaActuacionInicia">ETAPA DE LA ACTUACIÓN QUE FINALIZA EL SEMÁFORO</label>
                                                <Field as="select" value={getEtapaDeLaActuacionFinaliza} onChange={changeActuacionIniciaSemaforo} className="form-control" id="etapaDeLaActuacionFinaliza" name="etapaDeLaActuacionFinaliza" placeholder=" Etapa de la actuación que finaliza">
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getrespuestaMasEtapas ? selectEtapas() : null}
                                                </Field>
                                                <ErrorMessage name="etapaDeLaActuacionFinaliza" component={() => (<span className="text-danger">{errors.etapaDeLaActuacionFinaliza}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <label htmlFor="AutoFinaliza">AUTOS QUE FINALIZAN EL CONTADOR</label>
                                                <Field as="select" value={getAutoFinaliza} onChange={changeAutoFinaliza} className="form-control" id="AutoFinaliza" name="AutoFinaliza" placeholder="Auto que finaliza el contador">
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getrespuestaMasActuacionesFin ? selectActuacionesFinaliza() : null}
                                                </Field>
                                                <ErrorMessage name="AutoFinaliza" component={() => (<span className="text-danger">{errors.AutoFinaliza}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-2 align-self-end">
                                            <div className="form-group">
                                                <button type="button" className="btn btn-rounded btn-primary" onClick={() => AgregarAutoFinaliza()}>{global.Constants.BOTON_NOMBRE.AGREGAR}</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columnsAutoFinaliza}

                                                data={getAutoFinalizaLista.data.filter((suggestion) => {
                                                    return suggestion;
                                                })}
                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent="Sin datos"
                                                paginationTotalRows={getAutoFinalizaLista.data.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                defaultSortFieldId="Nombre"
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                defaultSortAsc={false}
                                            />
                                        </div>
                                    </div>
                                    ) : null }
                                </div>
                            </div>


                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary" >
                                    {from != null ? global.Constants.BOTON_NOMBRE.ACTUALIZAR : global.Constants.BOTON_NOMBRE.REGISTRAR}
                                </button>
                                <Link to={'/Semaforos'} className="font-size-h5 font-w600" >
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

