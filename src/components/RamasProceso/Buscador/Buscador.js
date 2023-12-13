import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation , Link } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import DataTable from 'react-data-table-component';
import GenericApi from '../../Api/Services/GenericApi';
import { getUser, hasAccess , quitarAcentos } from '../../../components/Utils/Common';
import { ParametroModel } from '../../Models/ParametroModel';
import { saveAs } from "file-saver";
import XlsxPopulate from "xlsx-populate";

function Buscador() {

    const containerStyle = {
        position: 'relative',
        display: 'block',
        userSelect: 'none',
        border: 'none',
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        padding: '8px',
        cursor: 'pointer',
        transition: '0.4s',
        color: 'rgba(0, 0, 0, 0.54)',
        fill: 'rgba(0, 0, 0, 0.54)',
        backgroundColor: 'transparent',
    };

    const location = useLocation()
    const { from , disable } = location.state;

    const [getColorPrimary, setColorPrimary] = useState("btn btn-sm btn-primary w2d_btn-large mr-1 mb-3 text-left");
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [listaPendientes, setListaPendientes] = useState({ data: [], links: [], meta: [] });
    const [getVisible, setVisible] = useState(false);
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);

    const [getEstadosProcesoDisciplinario, setEstadosProcesoDisciplinario] = useState({ data: [] });
    const [getRespuestaEstadosProcesoDisciplinario, setRespuestaEstadosProcesoDisciplinario] = useState(false);

    const [getTiposInteresado, setTiposInteresado] = useState({ data: [] });
    const [getRespuestaTiposInteresado, setRespuestaTiposInteresado] = useState(false);

    const [getEtapas, setEtapas] = useState({ data: [] });
    const [getRespuestaEtapas, setRespuestaEtapas] = useState(false);

    const [getVigencias, setVigencias] = useState({ data: [] });
    const [getRespuestaVigencias, setRespuestaVigencias] = useState(false);

    const [getDependencias, setDependencias] = useState({ data: [] });
    const [getRespuestaDependencias, setRespuestaDependencias] = useState(false);

    const [getSujetoProcesal, setSujetoProcesal] = useState({ data: [] });
    const [getRtaSujetoProcesal, setRtaSujetoProcesal] = useState(false);

    const [getEvaluacion, setEvaluacion] = useState({ data: [] });
    const [getRtaEvaluacion, setRtaEvaluacion] = useState(false);

    const [getTipoConducta, setTipoConducta] = useState({ data: [] });
    const [getRtaTipoConducta, setRtaTipoConducta] = useState(false);

    const [getFuncionarioActual, setFuncionarioActual] = useState({ data: [] });
    const [getRtaFuncionarioActual, setRtaFuncionarioActual] = useState(false);

    const [getEntidades, setEntidades] = useState({ data: [] });
    const [getRtaEntidades, setRtaEntidades] = useState(false);

    const [getSectores, setSectores] = useState({ data: [] });
    const [getRtaSectores, setRtaSectores] = useState(false);

    const [getExpediente , setExpediente] = useState(false);
    const [getagregarVigencia , setagregarVigencia] = useState(false);
    const [getagregarEstadoDelExpediente , setagregarEstadoDelExpediente] = useState(false);
    const [getagregarCargoDelInvestigado , setagregarCargoDelInvestigado] = useState(false);
    const [getagregarNombreDisciplinado , setagregarNombreDisciplinado] = useState(false);
    const [getagregarAsuntoDelExpediente , setagregarAsuntoDelExpediente] = useState(false);
    const [getAgregarSector , setAgregarSector] = useState();
    const [getAgregarNombreEntidad , setAgregarNombreEntidad] = useState(false);
    const [getagregarNombreQuejoso , setagregarNombreQuejoso] = useState(false);
    const [getagregarIdentificacionQuejoso , setagregarIdentificacionQuejoso] = useState(false);
    const [getagregarTipoQuejoso , setagregarTipoQuejoso] = useState(false);
    const [getagregarEtapaDelExpediente , setagregarEtapaDelExpediente] = useState(false);
    const [getagregarDelegada , setagregarDelegada] = useState(false);
    const [getAgregarSujetoProcesal , setAgregarSujetoProcesal] = useState(false);
    const [getAgregarEvaluacion , setAgregarEvaluacion] = useState(false);
    const [getAgregarTipoConducta , setAgregarTipoConducta] = useState(false);
    const [getAgregarFuncionarioActual , setAgregarFuncionarioActual] = useState(false);
    const [getAgregarAuto , setAgregarAuto] = useState(false);
    

    const [getValorExpediente , setValorExpediente] = useState("");
    const [getValorVigencia , setValorVigencia] = useState("");
    const [getValorEstadoDelExpediente , setValorEstadoDelExpediente] = useState("");
    const [getValorNombreDisciplinado , setValorNombreDisciplinado] = useState("");
    const [getValorCargoDelInvestigado , setValorCargoDelInvestigado] = useState("");
    const [getValorAsuntoDelExpediente , setValorAsuntoDelExpediente] = useState("");
    const [getValorSector , setValorSector] = useState("");
    const [getValorNombreEntidad , setValorNombreEntidad] = useState("");
    const [getValorPrimerNombreQuejoso , setValorPrimerNombreQuejoso] = useState("");
    const [getValorSegundoNombreQuejoso , setValorSegundoNombreQuejoso] = useState("");
    const [getValorPrimerApellidoQuejoso , settValorPrimerApellidoQuejoso] = useState("");
    const [getValorSegundoApellidoQuejoso , settValorSegundoApellidoQuejoso] = useState("");
    const [getValorIdentificacionQuejoso , setValorIdentificacionQuejoso] = useState("");
    const [getValorTipoQuejoso , setValorTipoQuejoso] = useState("");
    const [getValorEtapaDelExpediente , setValorEtapaDelExpediente] = useState("");
    const [getValorDelegada , setValorDelegada] = useState("");
    const [getValorAuto , setValorAuto] = useState("");
    const [getValorSujetoProcesal , setValorSujetoProcesal] = useState("");
    const [getValorEvaluacion , setValorEvaluacion] = useState("");
    const [getValorTipoConducta , setValorTipoConducta] = useState("");
    const [getValorFuncionarioActual , setValorFuncionarioActual] = useState("");
    
    const [getTotalPaginas, setTotalPaginas] = useState(0);
    const [getTotalRegistros, setTotalRegistros] = useState(0);

    const exportToExcel = () => {
        var data = [];

        listaPendientes.data.map((dato, index) => {
            data.push(
                {
                    radicado: dato.attributes.radicado, 
                    fecha_de_registro: dato.attributes.fecha, 
                    estado: dato.attributes.estado_expediente,
                    etapa_actual: dato.attributes.etapa, 
                    evaluacion: dato.attributes.evaluacion, 
                    ultimo_tipo_conducta: dato.attributes.tipo_de_conducta,
                    funcionario_actual: dato.attributes.funcionario_actual, 
                    dependencia_funcionario_actual: dato.attributes.dependencia, 
                    usuario_comisionado: dato.attributes.usuario_comisionado,
                    dependencia_usuario_comisionado: dato.attributes.dependencia_duena,
                    ultimo_antecedente_fecha: dato.attributes.fecha_antecedente, 
                    ultimo_antecedente: dato.attributes.antecedente.toUpperCase(), 
                    ultimo_investigado_nombre: dato.attributes.nombre_investigado,
                    ultimo_investigado_cargo: dato.attributes.cargo_investigado,
                    ultimo_investigado_entidad: dato.attributes.entidad,
                    ultimo_investigado_sector: dato.attributes.sector,
                    ultimo_interesado_tipo_interesado: dato.attributes.tipo_quejoso,
                    ultimo_interesado_sujeto_procesal: dato.attributes.sujeto_procesal,
                    ultimo_interesado_nombre: dato.attributes.nombre_quejoso,
                    ultimo_interesado_documento: dato.attributes.documento_quejoso
                }
            )
        })

        let header = ["RADICADO", "FECHA DE REGISTRO", "ESTADO", "ETAPA ACTUAL", "EVALUACIÓN", "ÚLTIMO TIPO DE CONDUCTA", "FUNCIONARIO ACTUAL", "DEPENDENCIA FUNCIONARIO ACTUAL", "USUARIO COMISIONADO", "DEPENDENCIA USUARIO COMISIONADO", "ÚLTIMO ANTECEDENTE FECHA", "ÚLTIMO ANTECEDENTE", "ÚLTIMO INVESTIGADO NOMBRE", "ÚLTIMO INVESTIGADO CARGO" , "ÚLTIMO INVESTIGADO ENTIDAD", "ÚLTIMO INVESTIGADO SECTOR", "ÚLTIMO INTERESADO TIPO DE INTERESADO", "ÚLTIMO INTERESADO SUJETO PROCESAL", "ÚLTIMO INTERESADO NOMBRE", "ÚLTIMO INTERESADO DOCUMENTO"];
    
        XlsxPopulate.fromBlankAsync().then(async (workbook) => {
        const sheet1 = workbook.sheet(0);
        const sheetData = getSheetData(data, header);
        const totalColumns = sheetData[0].length;
    
        sheet1.cell("A1").value(sheetData);
        const range = sheet1.usedRange();
        const endColumn = String.fromCharCode(64 + totalColumns);
        sheet1.row(1).style("bold", true);
        sheet1.range("A1:" + endColumn + "1").style("fill", "BFBFBF");
        range.style("border", true);
        return workbook.outputAsync().then((res) => {
            saveAs(res, obtenerFechaActual()+".xlsx");
        });
        });
    };

    const obtenerFechaActual = () => {
        const fecha = new Date();
      
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que agregamos 1
        const anio = fecha.getFullYear();
        const hora = fecha.getHours();
        const minutos = fecha.getMinutes();
        const segundos = fecha.getSeconds();
      
        // Formatear los valores para asegurarte de que tengan 2 dígitos
        const diaStr = dia.toString().padStart(2, '0');
        const mesStr = mes.toString().padStart(2, '0');
        const horaStr = hora.toString().padStart(2, '0');
        const minutosStr = minutos.toString().padStart(2, '0');
        const segundosStr = segundos.toString().padStart(2, '0');
      
        // Crear la cadena de fecha en el formato deseado
        const fechaFormateada = `${diaStr}${mesStr}${anio}${horaStr}${minutosStr}${segundosStr}`;
      
        return fechaFormateada.toString();
      };

    function getSheetData(data, header) {
        var fields = Object.keys(data[0]);
        var sheetData = data.map(function (row) {
          return fields.map(function (fieldName) {
            return row[fieldName] ? row[fieldName] : "";
          });
        });
        sheetData.unshift(header);
        return sheetData;
      }

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarEstadosProcesoDisciplinario();
            cargarTiposInteresado();
            CargarEtapas();
            CargarVigencias();
            CargarDependencias();
            CargarTipoSujetoProcesal();
            CargarEvaluacion();
            CargarTipoConducta();
            CargarFuncionarioActual();
            CargarEntidades();
            CargarSectores();
        }
        fetchData();
    }, []);

    const CargarVigencias = () => {
        GenericApi.getAllGeneric('vigencia').then(
            datos =>{
                if (!datos.error) {
                    setVigencias(datos);
                    setRespuestaVigencias(true);
                }else{
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las vigencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const cargarEstadosProcesoDisciplinario = () => {
        GenericApi.getAllGeneric('mas-estado-proceso-disciplinario').then(
            datos => {
                if (!datos.error) {
                    setEstadosProcesoDisciplinario(datos);
                    setRespuestaEstadosProcesoDisciplinario(true);
                }
                else{
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar los estados de procesos disciplinarios.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }
    
    const cargarTiposInteresado = () => {
        GenericApi.getGeneric("tipo-interesado").then(
            datos => {
                if (!datos.error) {
                    setTiposInteresado(datos);
                    setRespuestaTiposInteresado(true);
                }
                else {
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar los tipos de interesados.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    const CargarEtapas = () => {
        GenericApi.getAllGeneric('mas-etapa').then(
            datos =>{
                if (!datos.error) {
                    console.log(datos);
                    setEtapas(datos);
                    setRespuestaEtapas(true);
                }else{
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las etapas.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const CargarDependencias = () => {
        GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.REMITIR_PROCESO).then(
            datos =>{
                if (!datos.error) {
                    setDependencias(datos);
                    setRespuestaDependencias(true);
                    window.showSpinner(false);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las dependencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }


    const CargarTipoSujetoProcesal = () => {
        GenericApi.getAllGeneric('tipo-sujeto-procesal').then(
            datos =>{
                if (!datos.error) {
                    setSujetoProcesal(datos);
                    setRtaSujetoProcesal(true);
                    window.showSpinner(false);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las dependencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const CargarEvaluacion = () => {
        GenericApi.getAllGeneric('mas-resultado-evaluacion').then(
            datos =>{
                if (!datos.error) {
                    console.log(datos);
                    setEvaluacion(datos);
                    setRtaEvaluacion(true);
                    window.showSpinner(false);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las dependencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const CargarTipoConducta = () => {
        GenericApi.getAllGeneric('mas-tipo-conducta').then(
            datos =>{
                if (!datos.error) {
                    setTipoConducta(datos);
                    setRtaTipoConducta(true);
                    window.showSpinner(false);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las dependencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const CargarFuncionarioActual = () => {
        GenericApi.getGeneric('getAllUsuarios').then(
            datos =>{
                if (!datos.error) {
                    setFuncionarioActual(datos);
                    setRtaFuncionarioActual(true);
                    window.showSpinner(false);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las dependencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const CargarEntidades = () => {
        GenericApi.getGeneric('entidades').then(
            datos =>{
                if (!datos.error) {
                    setEntidades(datos);
                    setRtaEntidades(true);
                    window.showSpinner(false);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las dependencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const CargarSectores = () => {
        GenericApi.getGeneric('sectores').then(
            datos =>{
                if (!datos.error) {
                    setSectores(datos);
                    setRtaSectores(true);
                    window.showSpinner(false);
                }else{
                    window.showSpinner(false);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR", message: "Ocurrió un error al intentar consultar las dependencias.", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            } 
        )
    }

    const enviarDatos = () =>{
        if(
        getValorExpediente !== "" ||
        getValorVigencia !== "" ||
        getValorEstadoDelExpediente !== "" ||
        getValorNombreDisciplinado !== "" ||
        getValorAsuntoDelExpediente !== "" ||
        getValorCargoDelInvestigado !== "" ||
        getValorPrimerNombreQuejoso !== "" ||
        getValorSegundoNombreQuejoso !== "" ||
        getValorPrimerApellidoQuejoso !== "" ||
        getValorSegundoApellidoQuejoso !== "" ||
        getValorIdentificacionQuejoso !== "" ||
        getValorTipoQuejoso !== "" ||
        getValorEtapaDelExpediente !== "" ||
        getValorDelegada !== "" ||
        getValorSujetoProcesal !== ""  || 
        getValorEvaluacion !== ""  || 
        getValorTipoConducta !== ""  || 
        getValorFuncionarioActual  !== ""  || 
        getValorAuto  !== ""  || 
        getValorSector  !== ""  || 
        getValorNombreEntidad  !== ""
        ){
            window.showSpinner(true);
            console.log("Entro if");
            setPageActual(1)
            cargarPendientes(1, perPage);
        }else{
            setModalState({ title: "BUSCADOR DE EXPEDIENTES", message: "NO SE ENVÍO NUNGUN DATO", show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.ERROR });
        }        
    }

    const cargarPendientes = (page, perPage) => {
        let data = {
            "data":{
                "type":"buscador",
                "attributes": {
                    "radicado": getValorExpediente,
                    "vigencia": getValorVigencia,
                    "estado_expediente": getValorEstadoDelExpediente,
                    "dependencia": getValorDelegada,
                    "etapa": getValorEtapaDelExpediente,
                    "antecedente": getValorAsuntoDelExpediente,
                    "nombre_investigado": getValorNombreDisciplinado,
                    "cargo_investigado": getValorCargoDelInvestigado,
                    "tipo_quejoso": getValorTipoQuejoso,
                    "primer_nombre_quejoso": getValorPrimerNombreQuejoso,
                    "segundo_nombre_quejoso": getValorSegundoNombreQuejoso,
                    "primer_apellido_quejoso": getValorPrimerApellidoQuejoso,
                    "segundo_apellido_quejoso": getValorSegundoApellidoQuejoso,    
                    "numero_documento": getValorIdentificacionQuejoso,                        
                    "auto": getValorAuto,
                    "sujeto_procesal": getValorSujetoProcesal,
                    "evaluacion": getValorEvaluacion,  
                    "tipo_conducta": getValorTipoConducta,
                    "funcionario_actual": getValorFuncionarioActual,
                    "sector": getValorSector,
                    "entidad": getValorNombreEntidad,
                    'per_page': perPage,
                    'current_page': page,
                }
            }
        }

        
        setTotalPaginas(0)
        setTotalRegistros(0)

        GenericApi.getByDataGeneric('buscador-general', data).then(
            datos => {
                if (!datos.error) {
                    if(datos.data.length > 0){
                        setListaPendientes(datos);
                        
                        setTotalPaginas(datos.data[0].TotalPaginas)
                        setTotalRegistros(datos.data[0].TotalRegistros)

                        setVisible(datos.data[0].visible)
                        setModalState({ title: "BUSCADOR DE EXPEDIENTES", message: "SE ENCONTRARON "+datos.data.length+" COINCIDENCIAS", show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.EXITO });
                    }else{
                        setTotalPaginas(0)
                        setTotalRegistros(0)
                        setModalState({ title: "BUSCADOR DE EXPEDIENTES", message: "NO SE ENCONTRARON COINCIDENCIAS", show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    
                    
                }
                else {
                    setModalState({ title:  "BUSCADOR DE EXPEDIENTES", message: datos.error.toString(), show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.ERROR });
                
                }

                window.showSpinner(false);
            }
        )
    }

    const handlePageChange = page => {
        window.showSpinner(true);
        setPageActual(page);
        cargarPendientes(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    let columns = [

        {
            name: 'ACCIONES',
            cell: pendiente =>
                <div>
                { 

                /*
                procesoDisciplinarioId, OK
                vigencia, OK
                tipoEvaluacion,
                tipoEvaluacionNombre,
                cambiaColorAntecedentes, 
                cambiaColorDatosInteresado,
                cambiaColorClasificacionRadicado,
                cambiaColorEntidadInvestigado,
                cambiaColorSoporteRadicado,
                cambiaColorComunicacionInteresado,
                habilitaBotonComunicacionInteresado,
                registradoPor,
                antecedente,
                fechaRegistro,
                fechaIngreso,
                dependendencia,
                idAntecedente,
                idEtapa,
                idFase,
                cambiaColorCapturaReparto,
                idEntidadInvestigado,
                evaluacionRepartoCerrada,
                subTipoExpediente, //solo para obtener el tipo de expediente que se debe quitar en el lostado de clasificacion
                idTipoExpediente,
                idSubTipoExpediente,
                */
                    
                    <Link to={`/RamasProceso/`} state={{from: new ParametroModel(
                        pendiente.attributes.radicado,
                        pendiente.attributes.id,
                        pendiente.attributes.vigencia,
                        pendiente.attributes.id_evaluacion,
                        pendiente.attributes.evaluacion,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        false,
                        pendiente.attributes.registrado_por,
                        pendiente.attributes.antecedente,
                        pendiente.attributes.created_at,
                        pendiente.attributes.fecha_ingreso_sinproc ? pendiente.attributes.fecha_ingreso_sinproc : (pendiente.attributes.fecha_ingreso_sirius ? pendiente.attributes.fecha_ingreso_sirius : (pendiente.attributes.fecha_ingreso_poder_preferente ? pendiente.attributes.fecha_ingreso_poder_preferente : (pendiente.attributes.fecha_ingreso_desgloce ? pendiente.attributes.fecha_ingreso_desgloce : null ))),
                        pendiente.attributes.dependencia,
                        pendiente.attributes.id_antecedente,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    )
                    , mismoUsuarioBuscador: pendiente.attributes.log_funcionario_actual === getUser().nombre ? true : false}}>
                        {pendiente.visible===true?<button type="button" className="btn btn-primary mr-2" data-toggle="tooltip" data-html="true" title="Ver rama del proceso" data-original-title="Ver rama del proceso"><span className="fas fa-search"> </span></button>:""}
                    </Link>

                }
                </div>
        },

        {
            name: 'RADICADO',
            cell: pendiente => <div>{pendiente.attributes.radicado}-{pendiente.attributes.vigencia}</div>,
            selector: pendiente => pendiente.attributes.radicado,
            sortable: true,
            wrap: true,
            width: '120px'
        },

        {
            name: 'FECHA DE REGISTRO',
            cell: pendiente => <div>{pendiente.attributes.fecha}</div>,
            selector: pendiente => pendiente.attributes.fecha,
            sortable: true,
            wrap: true,
            width: '180px'
        },

        {
            name: 'ESTADO',
            cell: pendiente => <div>{pendiente.attributes.estado_expediente}</div>,
            selector: pendiente => pendiente.attributes.estado_expediente,
            sortable: true,
            wrap: true,
            width: '100px'
        },

        {
            name: 'ETAPA ACTUAL',
            cell: pendiente => <div>{pendiente.attributes.etapa}</div>,
            selector: pendiente => pendiente.attributes.etapa,
            sortable: true,
            wrap: true,
            width: '180px'
        },

        {
            name: 'EVALUACIÓN',
            cell: pendiente => <div>{pendiente.attributes.evaluacion}</div>,
            selector: pendiente => pendiente.attributes.evaluacion,
            sortable: true,
            wrap: true,
            width: '180px'
        },

        {
            name: 'ÚLTIMO TIPO DE CONDUCTA',
            cell: pendiente => <div>{pendiente.attributes.tipo_de_conducta}</div>,
            selector: pendiente => pendiente.attributes.tipo_de_conducta,
            sortable: true,
            wrap: true,
            width: '200px'
        },
            
        {
            name: 'FUNCIONARIO ACTUAL',
            cell:pendiente => <div>
                <strong>FUNCIONARIO: </strong>{ pendiente.attributes.funcionario_actual}<br/>
                <strong>DEPENDENCIA: </strong>{pendiente.attributes.dependencia}<br/>
            </div>,
            selector: pendiente => pendiente.attributes.dependencia,
            sortable: true,
            wrap: true,
            width: '400px'
        },

        {
            name: 'USUARIO COMISIONADO',
            cell:pendiente => <div>
                <strong>FUNCIONARIO: </strong>{pendiente.attributes.usuario_comisionado}<br/>
                <strong>DEPENDENCIA: </strong>{pendiente.attributes.dependencia_duena}<br/>               
            </div>,
            selector: pendiente => pendiente.attributes.nombre_investigado,
            sortable: true,
            wrap: true,
            width: '400px'
        },
      
        {
            name: 'ÚLTIMO ANTECEDENTE',
            cell:pendiente => <div>   

            <span data-toggle="modal" data-target={"#q"+pendiente.attributes.id}><small></small>{pendiente.attributes.antecedente_corto}</span><br/>
            <strong>FECHA: </strong>{pendiente.attributes.fecha_antecedente}<br/> 

                <div className="modal fade" id={"q"+pendiente.attributes.id} tabIndex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                        <div className="modal-header block.block-themed">
                            <h5 className="modal-title" id="descriptionModalLabel"> {pendiente.attributes.radicado}-{pendiente.attributes.vigencia} :: ÚLTIMO ANTECEDENTE </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {pendiente.attributes.antecedente.toUpperCase()}                              
                        </div>                  
                        </div>
                    </div>
                </div>
            </div>,
            selector: pendiente => pendiente.attributes.antecedente,
            sortable: true,
            wrap: true,
            width: '400px'
        },            
        {
            name: 'ÚLTIMO INVESTIGADO',
            cell:pendiente => <div>
                <strong>NOMBRE: </strong>{pendiente?.attributes.nombre_investigado}<br/>
                <strong>CARGO: </strong>{pendiente?.attributes.cargo_investigado}<br/>
                <strong>ENTIDAD: </strong>{pendiente?.attributes.entidad}<br/>
                <strong>SECTOR: </strong>{pendiente?.attributes.sector}<br/>
            </div>,
            selector: pendiente => pendiente.attributes.nombre_investigado,
            sortable: true,
            wrap: true,
            width: '400px'
        },
     
        {
            name: 'ÚLTIMO INTERESADO',
            cell:pendiente => <div>
                <strong>TIPO DE INTERESADO: </strong>{pendiente.attributes.tipo_quejoso}<br/>
                <strong>SUJETO PROCESAL: </strong>{pendiente.attributes.sujeto_procesal}<br/>
                <strong>NOMBRE DEL INTERESADO: </strong>{pendiente.attributes.nombre_quejoso}<br/>
                <strong>DOCUMENTO DEL INTERESADO: </strong>{pendiente.attributes.documento_quejoso}<br/>
            </div>,
            selector: pendiente => pendiente.attributes.nombre_investigado,
            sortable: true,
            wrap: true,
            width: '400px'
        },
    ];


    
    /* Agregar inputs a la busqueda */

        const agregarExpediente = (value, cheked) =>{
            if(cheked){
                setExpediente(true);
            }else{
                setExpediente(false);
                setValorExpediente("");
            }
        }

        const agregarVigencia = (value, cheked) =>{
            if(cheked){
                setagregarVigencia(true);
            }else{
                setagregarVigencia(false);
                setValorVigencia("");
            }
        }

        const agregarEstadoDelExpediente = (value, cheked) =>{
            if(cheked){
                setagregarEstadoDelExpediente(true);
            }else{
                setagregarEstadoDelExpediente(false);
                setValorEstadoDelExpediente("");
            }
        }

        const agregarCargoDelInvestigado = (value, cheked) =>{
            if(cheked){
                setagregarCargoDelInvestigado(true);
            }else{
                setagregarCargoDelInvestigado(false);
                setValorCargoDelInvestigado("");
            }
        }

        const agregarNombreDisciplinado = (value, cheked) =>{
            if(cheked){
                setagregarNombreDisciplinado(true);
            }else{
                setagregarNombreDisciplinado(false);
                setValorNombreDisciplinado("");
            }
        }


        const agregarAsuntoDelExpediente = (value, cheked) =>{
            if(cheked){
                setagregarAsuntoDelExpediente(true);
            }else{
                setagregarAsuntoDelExpediente(false);
                setValorAsuntoDelExpediente("");
            }
        }

        const agregarSector = (value, cheked) =>{
            if(cheked){
                setAgregarSector(true);
            }else{
                setAgregarSector(false);
                setValorSector("");
            }
        }

        const agregarNombreEntidad = (value, cheked) =>{
            if(cheked){
                setAgregarNombreEntidad(true);
            }else{
                setAgregarNombreEntidad(false);
                setValorNombreEntidad("");
            }
        }

        const agregarNombreQuejoso = (value, cheked) =>{
            if(cheked){
                setagregarNombreQuejoso(true);
            }else{
                setagregarNombreQuejoso(false);
                setValorPrimerNombreQuejoso("");
                setValorSegundoNombreQuejoso("");
                settValorPrimerApellidoQuejoso("");
                settValorSegundoApellidoQuejoso("");
            }
        }

        const agregarIdentificacionQuejoso = (value, cheked) =>{
            if(cheked){
                setagregarIdentificacionQuejoso(true);
            }else{
                setagregarIdentificacionQuejoso(false);
                setValorIdentificacionQuejoso("");
            }
        }

        const agregarTipoQuejoso = (value, cheked) =>{
            if(cheked){
                setagregarTipoQuejoso(true);
            }else{
                setagregarTipoQuejoso(false);
                setValorTipoQuejoso("");
            }
        }

        const agregarEtapaDelExpediente = (value, cheked) =>{
            if(cheked){
                setagregarEtapaDelExpediente(true);
            }else{
                setagregarEtapaDelExpediente(false);
                setValorEtapaDelExpediente("");
            }
        }

        const agregarDelegada = (value, cheked) =>{
            if(cheked){
                setagregarDelegada(true);
            }else{
                setagregarDelegada(false);
                setValorDelegada("");
            }
        }

        const agregarSujetoProcesal = (value, cheked) =>{
            if(cheked){
                setAgregarSujetoProcesal(true);
            }else{
                setAgregarSujetoProcesal(false);
                setValorSujetoProcesal("");
            }
        }

        const agregarEvaluacion = (value, cheked) =>{
            if(cheked){
                setAgregarEvaluacion(true);
            }else{
                setAgregarEvaluacion(false);
                setValorEvaluacion("");
            }
        }

        const agregarTipoConducta = (value, cheked) =>{
            if(cheked){
                setAgregarTipoConducta(true);
            }else{
                setAgregarTipoConducta(false);
                setValorTipoConducta("");
            }
        }

        const agregarFuncionarioActual = (value, cheked) =>{
            if(cheked){
                setAgregarFuncionarioActual(true);
            }else{
                setAgregarFuncionarioActual(false);
                setValorFuncionarioActual("");
            }
        }

        const agregarAuto = (value, cheked) =>{
            if(cheked){
                setAgregarAuto(true);
            }else{
                setAgregarAuto(false);
                setValorAuto("");
            }
        }

    /* Termino de agregar imputs */

        const handleInputChange = (event) => {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            if(name === "n_expediente"){
                setValorExpediente( target.value );
            }
            else if(name === "Vigencia"){
                setValorVigencia( target.value );
            }
            else if(name === "estado_del_expediente"){
                setValorEstadoDelExpediente( target.value );
            }
            else if(name === "nombre_disciplinado"){
                setValorNombreDisciplinado( target.value );
            }
            else if(name === "cargo_investigado"){
                setValorCargoDelInvestigado( target.value );
            }
            else if(name === "asunto_del_expediente"){
                setValorAsuntoDelExpediente( target.value );
            }
            else if(name === "nombre_sector"){
                setValorSector( target.value );
            }
            else if(name === "nombre_entidad"){
                setValorNombreEntidad( target.value );
            }
            else if(name === "primer_nombre_quejoso"){
                setValorPrimerNombreQuejoso( target.value );
            } else if(name === "segundo_nombre_quejoso"){
                setValorSegundoNombreQuejoso( target.value );
            }
            else if(name === "primer_apellido_quejoso"){
                settValorPrimerApellidoQuejoso( target.value );
            }
            else if(name === "segundo_apellido_quejoso"){
                settValorSegundoApellidoQuejoso( target.value );
            }
            else if(name === "identificacion_quejoso"){
                setValorIdentificacionQuejoso( target.value );
            }
            else if(name === "tipo_quejoso"){
                setValorTipoQuejoso( target.value );
            }
            else if(name === "etapa_del_expediente"){
                setValorEtapaDelExpediente( target.value );
            }
            else if(name === "delegada"){
                setValorDelegada( target.value );
            }
            else if(name === "sujeto_procesal"){
                setValorSujetoProcesal( target.value );
            }
            else if(name === "tipo_evaluacion"){
                setValorEvaluacion( target.value );
            }
            else if(name === "tipo_conducta"){
                setValorTipoConducta( target.value );
            }
            else if(name === "funcionario_actual"){
                setValorFuncionarioActual( target.value );
            }
            else if(name === "numero_auto"){
                setValorAuto( target.value );
            }

        }

    
    /* Agregando las opciones para los selects */

        const selectVigencias = () => {
            return (
                getVigencias.data.map((vigencia, i) => { // Se recorre el array
                    return (
                        <option key={vigencia.id} value={vigencia.attributes.vigencia}>{vigencia.attributes.vigencia}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectEstadosProcesoDisciplinario = () => {
            return (
                getEstadosProcesoDisciplinario.data.map((estado, i) => { // Se recorre el array
                    return (
                        <option key={estado.id} value={estado.id}>{estado.attributes.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectTiposInteresado = () => {
            return (
                getTiposInteresado.data.map((tipoInteresado, i) => { // Se recorre el array
                    return (
                        <option key={tipoInteresado.id} value={tipoInteresado.id}>{tipoInteresado.attributes.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectEtapas = () => {
            return (
                getEtapas.data.map((etapa, i) => { // Se recorre el array
                    return (
                        <option key={etapa.id} value={etapa.id}>{etapa.attributes.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectDependencias = () => {
            return (
                getDependencias.data.map((dependencia, i) => { // Se recorre el array
                    return (
                        <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectSujetoProcesal = () => {
            return (
                getSujetoProcesal.data.map((item, i) => { // Se recorre el array
                    return (
                        <option key={item.id} value={item.id}>{item.attributes.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectEvaluacion = () => {
            return (
                getEvaluacion.data.map((item, i) => { // Se recorre el array
                    return (
                        <option key={item.id} value={item.id}>{item.attributes.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectTipoConducta = () => {
            return (
                getTipoConducta.data.map((item, i) => { // Se recorre el array
                    return (
                        <option key={item.id} value={item.id}>{item.attributes.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectFuncionarioActual = () => {
            return (
                getFuncionarioActual.data.map((item, i) => { // Se recorre el array
                    return (
                        <option key={item.id} value={item.attributes.name}>{item.attributes.nombre +' '+ item.attributes.apellido}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }


        const selectEntidades = () => {
            return (
                getEntidades.data.map((item, i) => { // Se recorre el array
                    return (
                        <option key={item.idsector} value={item.id}>{item.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

        const selectSectores = () => {
            return (
                getSectores.data.map((item, i) => { // Se recorre el array
                    return (
                        <option key={item.id} value={item.idsector}>{item.nombre}</option>  // Se retorna el select por posicion
                    )
                })
            )
        }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                }}
                enableReinitialize
                validate={(valores) => {
                    
                    let errores = {}

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {

                    enviarDatos();
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    
                                    {from != "" ? (
                                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                                    ) : null}
                                    {from != "" ? (
                                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    ) : null}
                                   
                                    <li className="breadcrumb-item"> <small>Buscador de expediente</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">BUSCADOR DEL EXPEDIENTE :: SELECCIONE LOS CAMPOS A CONSULTAR</h3>
                            </div>

                            <div className="block-content">
                                <div className="row">
                                    {from != "" ? (
                                        <div className='col-md-12 text-right my-2'>
                                            <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from , disable: disable }}>
                                                <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                            </Link>
                                        </div>
                                    ) : null}
                                    
                                    <div className='col-md-6'>
                                        <h2>FILTROS: </h2>
                                    </div>
                                    <div className='col-md-6'>
                                        <h2>BÚSQUEDA: </h2>
                                    </div>
                                    <div className="col-md-3">

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="Expediente" className="custom-control-input" id="Expediente" name="Expediente" onChange={e => agregarExpediente(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="Expediente">RADICADO</label>
                                            </div>
                                        </div>
                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="Vigencia" className="custom-control-input" id="Vigencia" name="Vigencia" onChange={e => agregarVigencia(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="Vigencia">VIGENCIA</label>
                                            </div>
                                        </div>
                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="EstadoDelExpediente" className="custom-control-input" id="EstadoDelExpediente" name="EstadoDelExpediente" onChange={e => agregarEstadoDelExpediente(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="EstadoDelExpediente">ESTADO</label>                                               
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="Delegada" className="custom-control-input" id="Delegada" name="Delegada" onChange={e => agregarDelegada(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="Delegada">DEPENDENCIA</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="FuncionarioActual" className="custom-control-input" id="FuncionarioActual" name="FuncionarioActual" onChange={e => agregarFuncionarioActual(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="FuncionarioActual">FUNCIONARIO ACTUAL</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="EtapaDelExpediente" className="custom-control-input" id="EtapaDelExpediente" name="EtapaDelExpediente" onChange={e => agregarEtapaDelExpediente(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="EtapaDelExpediente">ETAPA</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="AsuntoDelExpediente" className="custom-control-input" id="AsuntoDelExpediente" name="AsuntoDelExpediente" onChange={e => agregarAsuntoDelExpediente(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="AsuntoDelExpediente">ANTECEDENTES O HECHOS</label>
                                            </div>
                                        </div>
                                        
                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="NombreDisciplinado" className="custom-control-input" id="NombreDisciplinado" name="NombreDisciplinado" onChange={e => agregarNombreDisciplinado(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="NombreDisciplinado">NOMBRE DEL INVESTIGADO</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="CargoInvestigado" className="custom-control-input" id="CargoInvestigado" name="CargoInvestigado" onChange={e => agregarCargoDelInvestigado(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="CargoInvestigado">CARGO DEL INVESTIGADO</label>
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div className="col-md-3">

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="Entidad" className="custom-control-input" id="Entidad" name="Entidad" onChange={e => agregarNombreEntidad(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="Entidad">ENTIDAD</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="Sector" className="custom-control-input" id="Sector" name="Sector" onChange={e => agregarSector(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="Sector">SECTOR</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="NombreQuejoso" className="custom-control-input" id="NombreQuejoso" name="NombreQuejoso" onChange={e => agregarNombreQuejoso(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="NombreQuejoso">NOMBRE DEL INTERESADO (QUEJOSO)</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="IdentificacionQuejoso" className="custom-control-input" id="IdentificacionQuejoso" name="IdentificacionQuejoso" onChange={e => agregarIdentificacionQuejoso(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="IdentificacionQuejoso">IDENTIFICACIÓN DEL INTERESADO (QUEJOSO)</label>
                                            </div>
                                        </div>
                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="TipoQuejoso" className="custom-control-input" id="TipoQuejoso" name="TipoQuejoso" onChange={e => agregarTipoQuejoso(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="TipoQuejoso">TIPO DEL INTERESADO (QUEJOSO)</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="SujetoProcesal" className="custom-control-input" id="SujetoProcesal" name="SujetoProcesal" onChange={e => agregarSujetoProcesal(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="SujetoProcesal">TIPO DE SUJETO PROCESAL</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="Evaluacion" className="custom-control-input" id="Evaluacion" name="Evaluacion" onChange={e => agregarEvaluacion(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="Evaluacion">EVALUACIÓN</label>
                                            </div>
                                        </div>

                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="TipoConducta" className="custom-control-input" id="TipoConducta" name="TipoConducta" onChange={e => agregarTipoConducta(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="TipoConducta">TIPO DE CONDUCTA</label>
                                            </div>
                                        </div>
                                        {/*
                                        <div className="custom-control custom-switch custom-control-lg mb-2">
                                            <div>
                                                <input type="checkbox" value="Auto" className="custom-control-input" id="Auto" name="Auto" onChange={e => agregarAuto(e.target.value , e.target.checked)}/>
                                                <label className="custom-control-label" htmlFor="Auto">AUTO</label>
                                            </div>
                                        </div>
                                    */}
                                        
                                    
                                    </div>
                                    <div className='col-md-6'>
                                        
                                        {getExpediente == true ? (
                                            <div className="form-group">
                                                <label htmlFor="n_expediente">RADICADO</label>
                                                <Field as="input" type="text" className="form-control" id="n_expediente" name="n_expediente" onChange={handleInputChange}></Field>
                                                <ErrorMessage name="n_expediente" component={() => (<span className="text-danger">{errors.n_expediente}</span>)} />
                                            </div>
                                        ) : null}

                                        {getagregarVigencia == true ? (
                                            <div className="form-group">
                                                <label htmlFor="Vigencia">VIGENCIA</label>
                                                <Field as="select" className="form-control" id="Vigencia" name="Vigencia" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRespuestaVigencias ? selectVigencias() : null}
                                                </Field>
                                                <ErrorMessage name="Vigencia" component={() => (<span className="text-danger">{errors.Vigencia}</span>)} />
                                            </div>
                                        ) : null}

                                        {getagregarEstadoDelExpediente == true ? (
                                            <div className="form-group">
                                                <label htmlFor="estado_del_expediente">ESTADO</label>
                                                <Field as="select" className="form-control" id="estado_del_expediente" name="estado_del_expediente" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRespuestaEstadosProcesoDisciplinario ? selectEstadosProcesoDisciplinario() : null}
                                                </Field>
                                                <ErrorMessage name="estado_del_expediente" component={() => (<span className="text-danger">{errors.estado_del_expediente}</span>)} />
                                            </div>
                                        ) : null}

                                        {getagregarNombreDisciplinado == true ? (
                                            <div className="form-group">
                                                <label htmlFor="nombre_disciplinado">NOMBRE DEL INVESTIGADO</label>
                                                <Field as="input" type="text" className="form-control" id="nombre_disciplinado" name="nombre_disciplinado" onChange={handleInputChange} autocomplete="off"></Field>
                                                <ErrorMessage name="nombre_disciplinado" component={() => (<span className="text-danger">{errors.nombre_disciplinado}</span>)} />
                                            </div>
                                        ) : null} 

                                        {getagregarCargoDelInvestigado == true ? (
                                            <div className="form-group">
                                                <label htmlFor="cargo_investigado">CARGO DEL INVESTIGADO</label>
                                                <Field as="input" type="text" className="form-control" id="cargo_investigado" name="cargo_investigado" onChange={handleInputChange} autocomplete="off"></Field>
                                                <ErrorMessage name="cargo_investigado" component={() => (<span className="text-danger">{errors.cargo_investigado}</span>)} />
                                            </div>
                                        ) : null} 

                                        {getagregarAsuntoDelExpediente == true ? (
                                            <div className="form-group">
                                                <label htmlFor="asunto_del_expediente">ANTECENTES O HECHOS</label>
                                                <Field as="input" type="text" className="form-control" id="asunto_del_expediente" name="asunto_del_expediente" onChange={handleInputChange} autocomplete="off"></Field>
                                                <ErrorMessage name="asunto_del_expediente" component={() => (<span className="text-danger">{errors.asunto_del_expediente}</span>)} />
                                            </div>
                                        ) : null}


                                        {getAgregarSector == true ? (
                                            <div className="form-group">
                                                <label htmlFor="nombre_sector">SECTOR</label>
                                                <Field as="select" className="form-control" id="nombre_sector" name="nombre_sector" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRtaSectores ? selectSectores() : null}
                                                </Field>
                                                <ErrorMessage name="nombre_sector" component={() => (<span className="text-danger">{errors.nombre_sector}</span>)} />
                                            </div>
                                        ) : null}

                                        {getAgregarNombreEntidad == true ? (
                                            <div className="form-group">
                                                <label htmlFor="nombre_entidad">ENTIDADES</label>
                                                <Field as="select" className="form-control" id="nombre_entidad" name="nombre_entidad" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRtaEntidades ? selectEntidades() : null}
                                                </Field>
                                                <ErrorMessage name="nombre_entidad" component={() => (<span className="text-danger">{errors.nombre_entidad}</span>)} />
                                            </div>
                                        ) : null}


                                        {getagregarNombreQuejoso == true ? (
                                            <>

                                                <div className="form-group">
                                                    <label htmlFor="primer_nombre_quejoso">PRIMER NOMBRE DEL INTERESADO (QUEJOSO)</label>
                                                    <Field as="input" type="text" className="form-control" id="primer_nombre_quejoso" name="primer_nombre_quejoso" onChange={handleInputChange} autocomplete="off"></Field>
                                                    <ErrorMessage name="primer_nombre_quejoso" component={() => (<span className="text-danger">{errors.primer_nombre_quejoso}</span>)} />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="segundo_nombre_quejoso">SEGUNDO NOMBRE DEL INTERESADO (QUEJOSO)</label>
                                                    <Field as="input" type="text" className="form-control" id="segundo_nombre_quejoso" name="segundo_nombre_quejoso" onChange={handleInputChange} autocomplete="off"></Field>
                                                    <ErrorMessage name="segundo_nombre_quejoso" component={() => (<span className="text-danger">{errors.segundo_nombre_quejoso}</span>)} />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="primer_apellido_quejoso">PRIMER APELLIDO DEL INTERESADO (QUEJOSO)</label>
                                                    <Field as="input" type="text" className="form-control" id="primer_apellido_quejoso" name="primer_apellido_quejoso" onChange={handleInputChange} autocomplete="off"></Field>
                                                    <ErrorMessage name="primer_apellido_quejoso" component={() => (<span className="text-danger">{errors.primer_apellido_quejoso}</span>)} />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="segundo_apellido_quejoso">SEGUNDO APELLIDO DEL INTERESADO (QUEJOSO)</label>
                                                    <Field as="input" type="text" className="form-control" id="segundo_apellido_quejoso" name="segundo_apellido_quejoso" onChange={handleInputChange} autocomplete="off"></Field>
                                                    <ErrorMessage name="segundo_apellido_quejoso" component={() => (<span className="text-danger">{errors.segundo_apellido_quejoso}</span>)} />
                                                </div>
                                            </>
                                            

                                        ) : null}

                                        {getagregarIdentificacionQuejoso == true ? (
                                            <div className="form-group">
                                                <label htmlFor="identificacion_quejoso">IDENTIFICACIÓN INTERESADO (QUEJOSO) </label>
                                                <Field as="input" type="text" className="form-control" id="identificacion_quejoso" name="identificacion_quejoso" onChange={handleInputChange} autocomplete="off"></Field>
                                                <ErrorMessage name="identificacion_quejoso" component={() => (<span className="text-danger">{errors.identificacion_quejoso}</span>)} />
                                            </div>
                                        ) : null}

                                        {getagregarTipoQuejoso == true ? (
                                            <div className="form-group">
                                                <label htmlFor="tipo_quejoso">TIPO INTERESADO (QUEJOSO) </label>
                                                <Field as="select" className="form-control" id="tipo_quejoso" name="tipo_quejoso" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRespuestaTiposInteresado ? selectTiposInteresado() : null}
                                                </Field>
                                                <ErrorMessage name="tipo_quejoso" component={() => (<span className="text-danger">{errors.tipo_quejoso}</span>)} />
                                            </div>
                                        ) : null}

                                        {getagregarEtapaDelExpediente == true ? (
                                            <div className="form-group">
                                                <label htmlFor="etapa_del_expediente">ETAPA</label>
                                                <Field as="select" className="form-control" id="etapa_del_expediente" name="etapa_del_expediente" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRespuestaEtapas ? selectEtapas() : null}
                                                </Field>
                                                <ErrorMessage name="etapa_del_expediente" component={() => (<span className="text-danger">{errors.etapa_del_expediente}</span>)} />
                                            </div>
                                        ) : null}

                                        {getagregarDelegada == true ? (
                                            <div className="form-group">
                                                <label htmlFor="delegada">DEPENDENCIA</label>
                                                <Field as="select" className="form-control" id="delegada" name="delegada" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRespuestaDependencias ? selectDependencias() : null}
                                                </Field>
                                                <ErrorMessage name="delegada" component={() => (<span className="text-danger">{errors.delegada}</span>)} />
                                            </div>
                                        ) : null}

                                        {getAgregarFuncionarioActual === true ? (
                                            <div className="form-group">
                                                <label htmlFor="funcionario_actual">FUNCIONARIO ACTUAL</label>
                                                <Field as="select" className="form-control" id="funcionario_actual" name="funcionario_actual" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRtaFuncionarioActual ? selectFuncionarioActual() : null}
                                                </Field>
                                                <ErrorMessage name="funcionario_actual" component={() => (<span className="text-danger">{errors.funcionario_actual}</span>)} />
                                            </div>
                                        ) : null}  


                                         {getAgregarSujetoProcesal === true ? (
                                            <div className="form-group">
                                                <label htmlFor="sujeto_procesal">SUJETO PROCESAL</label>
                                                <Field as="select" className="form-control" id="sujeto_procesal" name="sujeto_procesal" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRtaSujetoProcesal ? selectSujetoProcesal() : null}
                                                </Field>
                                                <ErrorMessage name="sujeto_procesal" component={() => (<span className="text-danger">{errors.sujeto_procesal}</span>)} />
                                            </div>
                                        ) : null}     


                                        {getAgregarEvaluacion === true ? (
                                            <div className="form-group">
                                                <label htmlFor="tipo_evaluacion">EVALUACIÓN</label>
                                                <Field as="select" className="form-control" id="tipo_evaluacion" name="tipo_evaluacion" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRtaEvaluacion ? selectEvaluacion() : null}
                                                </Field>
                                                <ErrorMessage name="tipo_evaluacion" component={() => (<span className="text-danger">{errors.tipo_evaluacion}</span>)} />
                                            </div>
                                        ) : null} 

                                        {getAgregarTipoConducta === true ? (
                                            <div className="form-group">
                                                <label htmlFor="tipo_conducta">TIPO DE CONDUCTA</label>
                                                <Field as="select" className="form-control" id="tipo_conducta" name="tipo_conducta" onChange={handleInputChange}>
                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                    {getRtaTipoConducta ? selectTipoConducta() : null}
                                                </Field>
                                                <ErrorMessage name="tipo_conducta" component={() => (<span className="text-danger">{errors.tipo_conducta}</span>)} />
                                            </div>
                                        ) : null} 


                                        {/*getAgregarAuto == true ? (
                                            <div className="form-group">
                                                <label htmlFor="numero_auto">AUTO</label>
                                                <Field as="input" type="text" className="form-control" id="numero_auto" name="numero_auto" onChange={handleInputChange}></Field>
                                                <ErrorMessage name="numero_auto" component={() => (<span className="text-danger">{errors.numero_auto}</span>)} />
                                            </div>
                                        ) : null*/} 


                                        <button type="submit" className="btn btn-primary mb-3" >BUSCAR</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </Form>
                )}
            </Formik>

            <Formik
                initialValues={{
                    rango: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {

                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">RESULTADOS DE LA BÚSQUEDA</h3>
                                {
                                    listaPendientes.data.length > 0
                                    ?
                                        <button type="button" className="btn btn-primary mb-3" onClick={exportToExcel} title="EXPORTAR A EXCEL"><i class="fa fa-file-export"></i> </button>                                        
                                    :
                                        null
                                }
                            </div>                          

                            <div className="block-content">
                                {listaPendientes.data.length != 0 ?(
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                        </div>
                                    </div>
                                </div>
                                ) : null}


                                <div className="table-responsive">                                    
                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                  
                                        columns={columns}
                                        
                                        data={listaPendientes.data.filter((suggestion) => {
                                            if (getSeach === "") {
                                                return suggestion;
                                            } else if (
                                                (quitarAcentos(suggestion.attributes.antecedente) + quitarAcentos(suggestion.attributes.dependencia)
                                                    + quitarAcentos(suggestion.attributes.estado_expediente) + quitarAcentos(suggestion.attributes.etapa) +
                                                    quitarAcentos(suggestion.attributes.nombre_quejoso)).toLowerCase().includes(getSeach.toLowerCase())

                                            ) {
                                                return suggestion;
                                            }
                                        })}
                                        perPage={perPage}
                                        page={pageActual}
                                        pagination
                                        noDataComponent="Sin datos"
                                        paginationTotalRows={listaPendientes.data.length}
                                        onChangePage={handlePageChange}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        defaultSortFieldId="Nombre"
                                        striped
                                        paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                        defaultSortAsc={false}
                                        paginationComponent={() => (
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }} class="sc-ezOQGI hoQsHK">
                                                <span style={{  paddingTop: "9px" }}> { ((pageActual-1) * paganationPerPages) + 1 } - { ((pageActual-1) * paganationPerPages) + listaPendientes.data.length } de {getTotalRegistros} {console.log("Daticos", getTotalRegistros)} </span>
                                                <button id="pagination-first-page" type="button" aria-label="First Page" aria-disabled="true" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={pageActual === 1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                        <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path>
                                                        <path fill="none" d="M24 24H0V0h24v24z"></path>
                                                    </svg>
                                                </button>
                                                <button id="pagination-previous-page" type="button" aria-label="Previous Page" aria-disabled="true" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                    onClick={() => handlePageChange(pageActual - 1)}
                                                    disabled={pageActual === 1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                                    </svg>
                                                </button>                                             
                                                <button id="pagination-next-page" type="button" aria-label="Next Page" aria-disabled="false" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                    onClick={() => handlePageChange(pageActual + 1)}
                                                    disabled={getTotalPaginas === pageActual}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                                    </svg>
                                                </button>
                                                <button id="pagination-last-page" type="button" aria-label="Last Page" aria-disabled="false" class="sc-gikAfH fyrdjl" style={containerStyle}
                                                    onClick={() => handlePageChange(getTotalPaginas)}
                                                    disabled={getTotalPaginas === pageActual}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
                                                        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path>
                                                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            
        </>
    );

}

export default Buscador;