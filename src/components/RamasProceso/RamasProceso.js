import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Field, Form, Formik } from 'formik';
import Spinner from '../Utils/Spinner';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { hasAccess } from '../../components/Utils/Common';
import '../Utils/Constants';
import GenericApi from '../Api/Services/GenericApi';
import { getUser } from '../../components/Utils/Common';
import ModalCierreEtapaInfo from '../Utils/Modals/ModalCierreEtapaInfo';
import ModalGen from '../Utils/Modals/ModalGeneric';
import ClasificacionRadicadoApi from '../Api/Services/ClasificacionRadicadoApi';

function RamasProceso() {

  const [getRespuestaAntecedente, setRespuestaAntecedente] = useState(false);
  const [getRtaJefe, setRtaJefe] = useState(false);
  const [getListaFasesHabilitadas, setListaFasesHabilitadas] = useState({ data: [] });
  const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
  const [getFase, setFase] = useState(false);
  const [getEtapa, setEtapa] = useState(0);
  const [getUsuarioComisionado, setUsuarioComisionado] = useState("");
  const [getExistenActuacionesEtapas, setExistenActuacionesEtapas] = useState({ data: {} });
  const [getMostrarIniciarProcesoActuaciones, setMostrarIniciarProcesoActuaciones] = useState(false);
  const [getMostrarIniciarProcesoActuacionesQuejaInterna, setMostrarIniciarProcesoActuacionesQuejaInterna] = useState(false);
  const [getTipoProceso, setTipoProceso] = useState(false);
  const [getIdTipoProceso, setIdTipoProceso] = useState(false);
  const [getOrigenRadicado, setOrigenRadicado] = useState(false);
  const [getActivarTipoConducta, setActivarTipoConducta] = useState(false);
  const [getActivarReTipoExpediente, setActivarReTipoExpediente] = useState(false);
  const [getActivarReTipoEvaluacion, setActivarReTipoEvaluacion] = useState(false);
  const [getTipoReparto, setTipoReparto] = useState("");
  const [getListaEtapas, setListaEtapas] = useState({ data: {} });
  const [getListaDatosHijo, setListaDatosHijo] = useState({ data: {} });
  const [getDependenciaDuena, setDependenciaDuena] = useState();
  const [getPermisoReclasificarExpediente, setPermisoReclasificarExpediente] = useState(hasAccess('CH_ReclasificacionExpediente', 'Consultar'));
  const [getListaVigencias, setListaVigencias] = useState({ data: {} });
  const [getVigenciaProceso, setVigenciaProceso] = useState();
  //const [getNumeroLlamados, setNumeroLlamados] = useState(0);
  //const [getTotalNumeroLlamados, setTotalNumeroLlamados] = useState(2);
  let numeroLlamados = 0;
  let numeroTotalLlamados = 11;

  const location = useLocation();
  const { from, disable, mismoUsuarioBuscador = true } = location.state;
  let radicado = from.radicado;
  let procesoDisciplinarioId = from.procesoDisciplinarioId;
  let vigencia = from.vigencia;
  const etapaId = parseInt(from.idEtapa);
  const mensajeCierreEtapa = etapaId >= 3 ? "PROCESO DISCIPLINARIO" : "EXPEDIENTE";
  const idTipoExpediente = parseInt(from.idTipoExpediente);
  const paginationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;

  // Metodo principal de la clase para cargar la informacion
  useEffect(() => {

    if(from.mismoUsuarioBuscador === null || from.mismoUsuarioBuscador === undefined){
      from.mismoUsuarioBuscador = mismoUsuarioBuscador
    }

    // Metodo encargado de cargar la informacion de la clase
    function fetchData() {
      // Se usa el cargando
      window.showSpinner(true);

      // Se llaman los metodos
      jefeDependencia();
      listaFasesHabilitadas();
      etapaActual(); //Llamados internos
      validarEstadoTipoConducta();
      validarEstadoReTipoExpediente();
      tipo_reparto();
      getexistenActuaciones();
      getMostrarIniciarProceso();
      // Se consultan los nombres de las etapas
      cargarEtapas();
      obtenerVigencias();

      console.log("********************** "+getPermisoReclasificarExpediente)
      console.log("********************** ",from)
    }

    // Se llama el metodo
    fetchData();
  }, []);

  // Funcion para validar y detener el spinner
  const validacionSpinner = () => {
    numeroLlamados++
    if(numeroLlamados >= numeroTotalLlamados){
      window.showSpinner(false);
    }
  }

  // Metodo encargado de cargar el nombre del tipo de expediente
  const cargarNombreTipoExpedienteCerrarEtapa = (dataPost) => {

    // Se usa el cargando
    window.showSpinner(true);

    // Se inicializa la data
    const dataTipoExpediente = {
      "data": {
        "type": "clasificacion_radicado",
        "attributes": {
          "id_proceso_disciplinario": procesoDisciplinarioId,
          "id_etapa": global.Constants.ETAPAS.CAPTURA_REPARTO,
          "id_tipo_expediente": "1",
          "estado": "1",
          'per_page': paginationPerPages,
          'current_page': 1
        }
      }
    };

    // Se consume la API
    ClasificacionRadicadoApi.getAllClasificacionRadicadoByIdProDisciplinario(dataTipoExpediente, procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {

        // Se usa el cargando
        window.showSpinner(false);

        // Se valida que no haya error
        if (!datos.error) {

          // Se captura la informacion
          const datosPrincipal = datos.data[0];

          // Se inicializa la variable
          const nombreTipoExpedientePrincipal = datosPrincipal.attributes.expediente.nombre.toUpperCase();
          const idTipoExpedienteGeneral = datosPrincipal.attributes.expediente.id;

          // Se inicializa la variable del nombre del expediente
          var nombreGeneral = nombreTipoExpedientePrincipal;

          // Se valida el tipo de expediente
          if (idTipoExpedienteGeneral === parseInt(global.Constants.TIPOS_EXPEDIENTES.DERECHO_PETICION)) {

            // Se concadena el nombre
            nombreGeneral += " " + datosPrincipal.attributes.tipo_derecho_peticion.nombre.toUpperCase();
          } else if (idTipoExpedienteGeneral === parseInt(global.Constants.TIPOS_EXPEDIENTES.QUEJA)) {

            // Se concadena el nombre
            nombreGeneral += " " + datosPrincipal.attributes.tipo_queja.nombre.toUpperCase();
          } else if (idTipoExpedienteGeneral === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA)) {

            // Se concadena el nombre
            nombreGeneral += " " + datosPrincipal.attributes.fecha_termino.toUpperCase();
          } else if (idTipoExpedienteGeneral === parseInt(global.Constants.TIPOS_EXPEDIENTES.TUTELA)) {

            // Se concadena el nombre
            nombreGeneral += " " + datosPrincipal.attributes.fecha_termino.toUpperCase();
            nombreGeneral += " (" + datosPrincipal.attributes.hora_termino != null ? datosPrincipal.attributes.hora_termino.toUpperCase() + ")" : ("0") + ") horas";
          }

          // Se ejecuta el metodo para cerrar etapa
          cerrarEtapa(dataPost, nombreGeneral);
        }
      }
    )
  }

  /* Se consulta si el usuario que se encuentra en sesión es jefe de la dependencia*/
  const jefeDependencia = () => {

    // Se inicializa la data
    const data = {
      "data": {
        "type": "usuario",
        "attributes": {
          "": ""
        }
      }
    }

    // Se consume la API
    GenericApi.getByDataGeneric("usuario/get-jefe-dependencia", data).then(

      // Se inicializa la variable de respuesta
      datos => {

        validacionSpinner()

        // Se valida que no haya error
        if (!datos.error) {

          // Se redeclara la variable en true
          setRtaJefe(true)
        } else {

          // Se redeclara la variable en false
          setRtaJefe(false);
        }
      }
    )
  }

  // Metodo encargado de generar la caratula desde las ramas del proceso
  const generarCaratula = () => {

    // Se consume la API
    GenericApi.getGeneric("caratulas/caratula-ramas-proceso/" + procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {

        // Se valida que no haya error
        if (!datos.error) {

          // Se manda al metodo encargado de convertir el base64 en un archivo descargable
          downloadBase64File(datos.content_type, datos.base_64, datos.file_name);
        } else {

          // Se setea el mensaje de error
          setModalState({ title: "GENERACIÓN DE CARÁTULA ", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
        }
      }
    )
  }

  // Metodo encargado de cargar las etapas
  const cargarEtapas = () => {

    // Se inicializa el array
    let arrayGeneral = [];

    // Se inicializa la api
    GenericApi.getAllGeneric('mas-etapa').then(

      // Se inicializa la variable de respuesta
      datos => {

        validacionSpinner()

        // Se valida que no haya error
        if (!datos.error) {

          // Se recorren las etapas
          for (let index = 0; index < datos.data.length; index++) {

            // Se captura el elemento
            const element = datos.data[index];

            // Se valida el id en orden
            if (element.id && element.id == 1) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 2) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 3) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 4) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 5) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 6) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 7) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 8) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            } else if (element.id && element.id == 9) {

              // Se añade al array
              arrayGeneral.push({ nombre: element.attributes.nombre, id: element.id });
            }
          }

          // Se setea el array general
          setListaEtapas(arrayGeneral);
        }
      }
    )
  }

  const selectVigencia = () => {
    return (
        getListaVigencias.data.map((vigencia, i) => {
            return (
                <option key={vigencia.attributes.vigencia} value={vigencia.attributes.vigencia}>{vigencia.attributes.vigencia}</option>
            )
        })
    )
}

  const obtenerVigencias = () => {
    // Se consume la API
    GenericApi.getGeneric("vigencia").then(

      // Se inicializa la variable de respuesta
      datos => {

        validacionSpinner()

        if(datos.data.length > 0){
          setListaVigencias(datos)
        }
      }

    );

  }

  function downloadBase64File(contentType, base64Data, fileName) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const etapaActual = () => {

    // Se consume la API
    GenericApi.getGeneric("proceso-diciplinario/" + procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {
        // Se valida que no haya error
        validacionSpinner()
        if (!datos.error) {
          from.radicadoPadre = datos.data.attributes.radicado_padre;
          from.vigenciaPadre = datos.data.attributes.vigencia_padre;
          from.idEtapa = datos.data.attributes.id_etapa;
          setEtapa(datos.data.attributes.id_etapa);
          if(datos.data.attributes.dependencia_duena!=null){
            //setDependenciaDuena(datos?.data?.attributes?.dependencia_duena.nombre)
            setDependenciaDuena(datos?.data?.attributes?.dependencia_duena)
          }else{
            setDependenciaDuena('NO HA SIDO ASIGNADA')
          }
          
          
          if(datos.data.attributes.usuario_comisionado != null){
            setUsuarioComisionado(datos?.data?.attributes?.usuario_comisionado?.nombre + " " + datos?.data?.attributes?.usuario_comisionado?.apellido);
          }else{
            setUsuarioComisionado("NO HA SIDO ASIGNADO");
          }
         
          // Se valida que haya un id de tipo proceso
          if (datos.data.attributes.id_tipo_proceso) {

            // Se setea la informacion al from
            from.idTipoProceso = datos.data.attributes.id_tipo_proceso;

            // Se valida que el tipo proceso actual ea igual a desglose
            if (from.idTipoProceso == global.Constants.TIPO_INGRESO.DESGLOSE) {

              // Se consume la API
              GenericApi.getByIdGeneric("getinfohijo", from.procesoDisciplinarioId).then(

                // Se inicializa la variable de respuesta
                datosHijo => {

                  // Se valida que no haya error
                  if (!datosHijo.error) {

                    // Se setea la informacion
                    setListaDatosHijo(datosHijo);
                  }
                }
              )
            }
          }

          // Se setea la informacion
          setTipoProceso(datos.data.attributes.nombre_tipo_proceso);
          setIdTipoProceso(datos.data.attributes.id_tipo_proceso);

          // Se valida que el tipo de proceso sea igual a SIRIUS
          if (datos.data.attributes.id_tipo_proceso == global.Constants.TIPO_INGRESO.SIRIUS) {

            // Se setea la informacion
            setOrigenRadicado(datos.data.attributes.nombre_origen_radicado);
          }
        }
      }
    )
  }

  const listaFasesHabilitadas = () => {

    // Se consume la API
    GenericApi.getGeneric("proceso-diciplinario/get-fases-registradas/" + procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {
        validacionSpinner()
        // Se valida que no haya error
        if (!datos.error) {

          // Se setea la informacion
          setListaFasesHabilitadas(datos);
          setFase(true);
          setRespuestaAntecedente(true);
        }
      }
    )
  }

  const validarEstadoTipoConducta = () => {

    // Se consume la API
    GenericApi.getGeneric("activar-reclasificacion-tipo-conducta/" + procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {

        validacionSpinner()

        // Se valida que no haya error
        if (!datos.error) {

          // Se setea la informacion
          setActivarTipoConducta(datos.data.attributes.activar_funcionalidad);
        }
      }
    )
  }

  const validarEstadoReTipoExpediente = () => {

    // Se consume la API
    GenericApi.getGeneric("activar-reclasificacion-tipo-expediente/" + procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {
        validacionSpinner()
        // Se valida que no haya error
        if (!datos.error) {

          // Se setea la informacion
          setActivarReTipoExpediente(datos.data.attributes.activar_funcionalidad);

          // Se llama el metodo
          validarEstadoReTipoEvaluacion();
        }
      }
    )
  }

  const validarEstadoReTipoEvaluacion = () => {

    // Se consume la API
    GenericApi.getGeneric("activar-registro-fase-evaluacion/" + procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {

        validacionSpinner()

        // Se valida que no haya error
        if (!datos.error) {

          // Se setea la informacion
          setActivarReTipoEvaluacion(datos.data.attributes.activar_funcionalidad);
        }
      }
    )
  }

  const tipo_reparto = () => {

    // Se consume la API
    GenericApi.getGeneric("cierre-etapa/tipo-reparto/" + procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {
        
        validacionSpinner()

        // Se valida que no haya error
        if (!datos.error) {

          // Se valida que haya datos y que haya el id del tipo reparto
          if (datos && datos.data.attributes.id_tipo_reparto) {

            // Se setea la informacion
            setTipoReparto(datos.data.attributes.id_tipo_reparto);
          }
        }
      }
    )
  }


  
  const handleClicSoporteRadicado = (id_etapa, id_fase, es_soporte) => {
    from.id_etapa = id_etapa;
    from.id_fase = id_fase;
    changeValueEsFuncion(es_soporte);
  };

  function changeValueEsFuncion(es_funcion) {
    from.es_soporte = es_funcion;
  }

  // Metodo encargado para cerrar la etapa
  const cerrarEtapa = (datos, nombreTipoExpedienteParametro) => {

    // Se usa el cargando
    window.showSpinner(true);

    // Se inicializa la variabel
    let data;

    // Se redeclara la variable
    data = {
      "data": {
        "type": "cerrar_etapa",
        "attributes": {
          "id_proceso_disciplinario": procesoDisciplinarioId,
          "id_etapa": datos.inputEtapa,
          "descripcion": "Cierre de etapa",
          "created_user": getUser().nombre,
        }
      }
    }

    // Se consume la API
    GenericApi.addGeneric('cierre-etapa', data).then(

      // Se inicializa la variable de respuesta
      datos => {

        // Se usa el cargando
        window.showSpinner(false);

        // Se captura el nombre del tipo de expediente
        const nombreTipoExpediente = nombreTipoExpedienteParametro;

        // Se valida que no haya error
        if (!datos.error) {

          // Se valida que el tipo de reparto es igual al mismo usuario logeado
          if (getTipoReparto == global.Constants.TIPO_REPARTO.ASIGNADO_ASI_MISMO) {

            // Se recarga la pagina
            window.location.reload();
          } else {

            // Se valida que el estado del proceso sea 1: Asignado
            if (datos.data.attributes.proceso_disciplinario.estado == 1) {

              // Se inicializa el mensaje
              let mensajeModal = "SE DA CIERRE DE ETAPA AL " + mensajeCierreEtapa + " TIPO " + nombreTipoExpediente + ", SE ASIGNA A: " + datos.data.attributes.funcionario_asignado.nombre + " " + datos.data.attributes.funcionario_asignado.apellido;

              // Se setea el modal
              setModalState({ title: "RADICADO " + radicado + " - " + vigencia + " :: CIERRE DE ETAPA", message: mensajeModal.toUpperCase(), show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
            }
            // Se valida cuando el estado del proceso sea 2: Cerrado
            else if (datos.data.attributes.proceso_disciplinario.estado == 2) {

              // Se setea el modal
              setModalState({ title: "RADICADO " + radicado + " - " + vigencia + " :: CIERRE DE ETAPA", message: "EL " + mensajeCierreEtapa + " HA SIDO CERRADO", show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
            }

            // Se valida cuando el estado del proceso sea 3: Archivado
            else if (datos.data.attributes.proceso_disciplinario.estado == 3) {

              // Se setea el modal
              setModalState({ title: "RADICADO " + radicado + " - " + vigencia + " :: CIERRE DE ETAPA", message: "EL " + mensajeCierreEtapa + " HA SIDO ARCHIVADO", show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
            }
          }
        } else {

          // Se setea el modal
          setModalState({ title: "RADICADO " + radicado + " - " + vigencia + " :: CIERRE DE ETAPA", message: datos.error.toString().toUpperCase(), show: true, redirect: '/MisPendientes', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
        }
      }
    )
  }

  const componentAntecedente = () => {
    return (
      <>
        <div className="col-lg-12 push">
          <div className="alert alert-info" role="alert">
            <h4 className="txt-blue-primary">RADICADO: {radicado} - {vigencia}</h4>
            <span className="txt-blue-primary"><strong>ANTECEDENTE: </strong></span><br />
            <div className=''>
              <span className='txt-black-primary' data-toggle="modal" data-target={"#q"+radicado}>{from.antecedente ? from.antecedente.substring(0, 300) : ""}...</span>
              <div className="modal fade" id={"q"+radicado} tabIndex="-1" role="dialog" aria-labelledby="descriptionModalLabel" aria-hidden="true">
                  <div className="modal-dialog modal-xl" role="document">
                      <div className="modal-content">
                        <div className="modal-header block.block-themed">
                            <h5 className="modal-title" id="descriptionModalLabel">RADICADO: {radicado} - {vigencia} :: ÚLTIMO ANTECEDENTE </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body text-uppercase">
                            {from.antecedente}                              
                        </div>                  
                      </div>
                  </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-6"><span className="txt-blue-primary"><strong >REGISTRADO POR: </strong> <span className='txt-black-primary'>{from.registradoPor ? from.registradoPor.toUpperCase() : "SIN INFORMACIÓN"}</span></span></div>
              <hr />
              <div className="col-lg-6"><span className="txt-blue-primary"><strong>DEPENDENCIA REGISTRO: </strong> <span className='txt-black-primary'>{from.dependendencia ? from.dependendencia : "SIN INFORMACIÓN"}</span></span></div>
              <hr />

              <div className="col-lg-6"><span className="txt-blue-primary"><strong>DEPENDENCIA DUEÑA: </strong> <span className='txt-black-primary'>{getDependenciaDuena ? (getDependenciaDuena?.nombre ? getDependenciaDuena?.nombre : getDependenciaDuena) : null}</span></span></div>
              <hr />

              <div className="col-lg-6"><span className="txt-blue-primary"><strong>USUARIO COMISIONADO: </strong> <span className='txt-black-primary'>{getUsuarioComisionado}</span></span></div>
              <hr />             
            </div>

            <div className="row">
              <div className="col-lg-4"><span><strong className="txt-blue-primary">FECHA DE REGISTRO: </strong> {moment(from.fechaRegistro, 'DD/MM/YYYY, h:mm:ss a').format("DD/MM/YYYY, h:mm:ss a")}</span></div>
              <div className="col-lg-4"><span><strong className="txt-blue-primary">FECHA DE INGRESO: </strong> {moment(from.fechaIngreso, 'YYYY/MM/DD').format("DD/MM/YYYY")}</span></div>
              <div className="col-lg-4"><span><strong className="txt-blue-primary">FORMA DE INGRESO: </strong></span> <span className='txt-black-primary'>{getTipoProceso}</span></div>
            </div>

            <div className="row">
              {getIdTipoProceso == 1 ?
                <div className="col-lg-4"><span><strong className="txt-blue-primary">ORIGEN DEL RADICADO: </strong> </span><span className='txt-black-primary'>{getOrigenRadicado}</span></div> : null
              }
            </div>
            {getIdTipoProceso == 2 ? (
              <div className="row">
                <hr width="100%" />
                <div className="col-lg-3"><span><strong className="txt-blue-primary">RADICADO PADRE: </strong> {from.radicadoPadre}</span></div>
                <div className="col-lg-3">
                  <span>
                    <strong className="txt-blue-primary">VIGENCIA PADRE: </strong> 
                    {
                      from.vigenciaPadre
                      ? 
                        from.vigenciaPadre 
                      : 
                        <>
                          <select name="proceso_vigencia" id="proceso_vigencia" onChange={e => onChangeVigencia(e.target.value)}>
                            <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                            {getListaVigencias.data.length > 0 ? selectVigencia() : null}</select>
                        </>
                    }
                  </span>
                </div>
                <div className="col-lg-3"><span><strong className="txt-blue-primary">NÚMERO DE AUTO: </strong> {getListaDatosHijo.data[0]?.attributes.numero_auto}</span></div>
                <div className="col-lg-3"><span><strong className="txt-blue-primary">VIGENCIA DE AUTO: </strong> {moment(getListaDatosHijo.data[0]?.attributes.fecha_auto_desglose, 'DD/MM/YYYY').format("YYYY")}</span></div>
              </div>
            ) : null}
          </div>
        </div>
      </>
    )
  }

  const cargarFase = (id_etapa, id_fase, es_soporte, redirect) => {
    for (var i = 0; i < getListaFasesHabilitadas.data.length; i++) {

      if (getListaFasesHabilitadas.data[i].id == id_fase
        && (getListaFasesHabilitadas.data[i].attributes.visible
          || (id_etapa >= 3) //Validación para fases de Evaluación en PD en adelante
        )) {
        if (getListaFasesHabilitadas.data[i].attributes.estado) {
          return (
            <>
              <div className='w2d-form-group'>
                <Link to={redirect} state={{ from: from, selected_id_etapa: id_etapa, disable: disable, usuarioComisionado: getUsuarioComisionado }}>
                  <button type="button" className="btn btn-sm btn-secundary w2d_btn-large mr-1 mb-3 text-left" onClick={() => changeValueEsFuncion(false)}>
                    <i className={colorFase(getListaFasesHabilitadas.data[i].attributes.semaforizacion)}></i> {getListaFasesHabilitadas.data[i].attributes.nombre}</button>
                </Link>

                {getListaFasesHabilitadas.data[i].attributes.etapa == global.Constants.ETAPAS.CAPTURA_REPARTO && disable != true && from.mismoUsuarioBuscador ? (
                  <Link to={`/SoporteradicadoForm/`} state={{ from: from, disable: disable }}>
                    <button type="button" className="btn btn-sm btn-secundary mr-1 mb-3" onClick={() => handleClicSoporteRadicado(id_etapa, id_fase, es_soporte)}><i className="far fa-folder-open"></i></button>
                  </Link>
                ) : null
                }
              </div>
            </>
          )
        }
        
        else {
          return (
            <>
              <div className='w2d-form-group'>
                <Link to={redirect} state={{ from: from, selected_id_etapa: id_etapa, disable: disable, usuarioComisionado: getUsuarioComisionado }}>
                  <button type="button" className="btn btn-sm btn-secundary w2d_btn-large mr-1 mb-3 text-left" onClick={() => changeValueEsFuncion(false)}>
                    <i className={colorFase(getListaFasesHabilitadas.data[i].attributes.semaforizacion)}></i> {getListaFasesHabilitadas.data[i].attributes.nombre}</button>
                </Link>

                {getListaFasesHabilitadas.data[i].attributes.etapa == global.Constants.ETAPAS.CAPTURA_REPARTO && disable != true && from.mismoUsuarioBuscador ? (
                  <Link to={`/SoporteradicadoForm/`} state={{ from: from, disable: disable }}>
                    <button type="button" className="btn btn-sm btn-secundary mr-1 mb-3" onClick={() => handleClicSoporteRadicado(id_etapa, id_fase, es_soporte)}>
                      <i className="far fa-folder-open"></i></button>
                  </Link>
                ) : null
                }

              </div>
            </>
          )
        }
      }

    }

  }

  const colorFase = (estado_fase) => {

    if (estado_fase === 1)
      return (global.Constants.SEMAFORIZACION_FASES.RED)
    else if (estado_fase === 2)
      return (global.Constants.SEMAFORIZACION_FASES.ORANGE)
    else
      return (global.Constants.SEMAFORIZACION_FASES.GREEN)
  }

  const cargarSoportesRadicado = (id_etapa, id_fase, es_soporte, redirect) => {

    for (var i = 0; i < getListaFasesHabilitadas.data.length; i++) {

      if (getListaFasesHabilitadas.data[i].id == id_fase && getListaFasesHabilitadas.data[i].attributes.estado) {
        return (
          <div className='w2d-form-group'>
            <Link to={redirect} state={{ from: from, disable: disable }}>
              <button type="button" className="btn btn-sm btn-secundary w2d_btn-large mr-1 mb-3 text-left" onClick={() => handleClicSoporteRadicado(id_etapa, id_fase, es_soporte)}>
                <i className={colorFase(getListaFasesHabilitadas.data[i].attributes.semaforizacion)}></i> {getListaFasesHabilitadas.data[i].attributes.nombre}</button>
            </Link>
          </div>
        )
      } else if (getListaFasesHabilitadas.data[i].id == id_fase && !getListaFasesHabilitadas.data[i].attributes.estado) {
        return (
          <div className='w2d-form-group'>
            <Link to={redirect} state={{ from: from, disable: disable }}>
              <button type="button" className="btn btn-sm btn-secundary w2d_btn-large mr-1 mb-3 text-left" onClick={() => handleClicSoporteRadicado(id_etapa, id_fase, es_soporte)}>
                <i className={colorFase(getListaFasesHabilitadas.data[i].attributes.semaforizacion)}></i> {getListaFasesHabilitadas.data[i].attributes.nombre}</button>
            </Link>
          </div>
        )
      }
    }
  }

  // Metodo encargado de cerrar la etapa
  const cargarCierreEtapa = (id_etapa, id_fase_lista_para_cierre, id_fase_cerrada) => {

    // Se recorre el array
    for (var i = 0; i < getListaFasesHabilitadas.data.length; i++) {

      // Se valida cierre de captura y reparto
      if (getListaFasesHabilitadas.data[i].id == id_fase_lista_para_cierre) {

        // Se retorna el HTML
        return (
          <div className="form-group">
            <Formik
              initialValues={{
                inputCierreEtapa: '',
                inputEtapa: id_etapa,
              }}
              enableReinitialize
              validate={(valores) => {

                // Se inicializa la variable
                let errores = {};

                // Se valida que no haya chequeado cerrar etapa
                if (!valores.inputCierreEtapa) {

                  // Se coloca el mensaje de error
                  errores.inputCierreEtapa = 'DEBE SELECCIONAR LA OPCIÓN CIERRE DE ETAPA'
                }

                // Se retornan los errores
                return errores;
              }}
              onSubmit={(valores, { resetForm }) => {

                // Se llama el metodo para cerrar etapa
                cargarNombreTipoExpedienteCerrarEtapa(valores);
              }}
            >
              {({ errores }) => (
                <Form>
                  {
                      (hasAccess('CR_CierreEtapa', 'Crear') && from.mismoUsuarioBuscador) ? (
                        <>
                            <div className="col-md-12">
                              <Field type="checkbox" className="form-check-input" id="inputCierreEtapa" name="inputCierreEtapa" />
                              <label className="form-check-label" htmlFor="example-checkbox-inline1">¿CON LA INFORMACIÓN ACTUAL SE PUEDE DAR CIERRE A ESTA ETAPA?</label>
                            </div>
                            <div className="col-md-12">
                            
                                <div className="block-content block-content-full text-center">
                                  <button type="submit" className="btn btn-rounded btn-outline-primary">CERRAR ETAPA</button>
                                </div>
                          </div>                        
                        </>                        
                      ) : null
                      }
                </Form>
              )}
            </Formik>
          </div>
        )
      }

     
      if (getListaFasesHabilitadas.data[i].id == id_fase_cerrada && getListaFasesHabilitadas.data[i].attributes.estado && hasAccess('CR_CierreEtapa', 'Consultar')) {

        // Se retorna el HTML
        return (
          <div className="col-md-12 text-center">
            <button type='button' title='Consultar cierre de etapa' className='btn btn-sm' data-toggle="modal" data-target={'#modal-consultar-detalle-' + id_etapa}>
              <i className="fas fa-clipboard-list fa-2x txt-blue-secundary"></i>
            </button>
          </div>
        )
      }
    }
  }

  // Metodo encargado de mostrar el nombre de la etapa por el id
  const capturarNombreEtapa = (idEtapa) => {

    // Se valida cada id para mostrar su nombre
    if (idEtapa && idEtapa != null) {

      // Se valida que exista el array de etapas y se filtra por el id de la etapa
      var nombreEtapa = getListaEtapas && getListaEtapas.length && getListaEtapas.filter((e) => {

        // Se valida que el id sea igual al id de la etapa
        if (e.id == idEtapa) {

          // Se retorna el nombre de la etapa
          return e.nombre;
        }
      });

      // Se retorna
      return nombreEtapa[0].nombre;
    }
  }

  const getexistenActuaciones = () =>{
    
    // Se consume la API
    GenericApi.getGeneric('actuaciones/existen-actuaciones-etapas/'+procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {

        validacionSpinner()

        // Se valida que no haya error
        if (!datos.error) {
          // Se valida que tenga informacion el array
          setExistenActuacionesEtapas(datos);
        }
      }
    )
  }

  const getMostrarIniciarProceso = () =>{
    
    // Se consume la API
    GenericApi.getGeneric('actuaciones/mostrar-iniciar-proceso/'+procesoDisciplinarioId).then(

      // Se inicializa la variable de respuesta
      datos => {

        validacionSpinner()

        // Se valida que no haya error
        if (!datos.error) {
          // Se valida que tenga informacion el array
          setMostrarIniciarProcesoActuaciones(datos?.data?.attributes?.mostrar_boton);
          setMostrarIniciarProcesoActuacionesQuejaInterna(datos?.data?.attributes?.queja_interna);
        }
      }
    )
  }

  const componentVigenciaConfirmacion = () => {
    return (
        <>
            <div className="modal fade" id="modal-block-popout-cambio-vigencia-proceso-disciplinario" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-dialog-popout" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">CONFIRMACIÓN DE ASIGNACIÓN VIGENCIA</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">
                                <p>¿DESEA REGISTRAR LA VIGENCIA { getVigenciaProceso ? getVigenciaProceso : null } AL PROCESO DISCIPLINARIO ?</p>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => onCambiarVigencia()}>{global.Constants.BOTON_NOMBRE.ACTUALIZAR}</button>
                                <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal" onClick={() => (setVigenciaProceso(null))}>{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
  }

  const onCambiarVigencia = () => {
    window.showSpinner(true);
    GenericApi.getAllGeneric("proceso-diciplinario/set-vigencia/"+procesoDisciplinarioId+"/"+getVigenciaProceso).then(
        datos => {
            if (!datos.error) {
                from.vigenciaPadre = getVigenciaProceso;
                setModalState({ title: "RADICADO " + radicado + " - " + vigencia + " :: RAMAS DEL PROCESO :: ACTUACIÓN DETALLE", message: 'CAMBIOS ACTUALIZADOS', show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
            } else {
                setModalState({ title: "RADICADO " + radicado + " - " + vigencia + " :: RAMAS DEL PROCESO :: ACTUACIÓN DETALLE", message: datos.error.toString(), show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
            }         
            window.showSpinner(false);
        }
    )
}

  const showModalCambioVigencia = () => {
      window.showModalVigenciaConfirmacionProcesoDisciplinario(true);
  }

  const onChangeVigencia = (vigencia) => {
    if(vigencia){
        showModalCambioVigencia()
        setVigenciaProceso(vigencia)
    }
  }

  return (
    <>
      {<Spinner />}
      {<ModalCierreEtapaInfo object={1} />}
      {<ModalGen data={getModalState} />}
      { componentVigenciaConfirmacion() }

      <div className="row">
        <div className="col-md-12">
          <div className="w2d_block let">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-alt push">
                <li className="breadcrumb-item">
                  <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                <li className="breadcrumb-item"><small>Ramas del proceso</small></li>
              </ol>
            </nav>
          </div>
        </div>
        {getRespuestaAntecedente ? componentAntecedente() : null}
        {hasAccess('Buscador', 'Consultar') && from.mismoUsuarioBuscador ? (
          <div className='col-md-4 offset-md-4'>
            <Link to="/Buscador" state={{ from: from }} >
              <button type="button" className="btn btn-rounded btn-primary">BUSCADOR DE EXPEDIENTES <i className="fas fa-search"></i></button>
            </Link>
          </div>):null}
          <div className="col-md-12 w2d-enter">
            <div id="horizontal-navigation-hover-normal" className="d-none d-lg-block mt-2 mt-lg-0">
            {
              from.mismoUsuarioBuscador
              ?
                
                    <ul className="nav-main nav-main-horizontal nav-main-hover">
                      <li className="nav-main-item">
                        <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                          <span className="nav-main-link-name"><i className="fas fa-tools"></i> HERRAMIENTAS</span>
                        </Link>
                        <ul className="nav-main-submenu">

                          {(hasAccess('CH_ReclasificacionExpediente', 'Consultar')) ?
                            <li className="nav-main-item">
                              <Link className="nav-main-link" to="/ValidarClasificacionRadicadoForm" state={{ from: from }}>
                                <span className="nav-main-link-name">RECLASIFICACIÓN DEL EXPEDIENTE</span>
                              </Link>
                            </li> : null
                          }

                          {getRtaJefe && (hasAccess('CH_ReclasificacionEvaluacion', 'Consultar')) ?
                            <li className="nav-main-item">
                              <Link className="nav-main-link" to="/EvaluacionQuejaForm" state={{ from: from }}>
                                <span className="nav-main-link-name">RECLASIFICACIÓN DEL TIPO DE EVALUACIÓN</span>
                              </Link>
                            </li> : null
                          }

                          {getRtaJefe && getActivarTipoConducta && (hasAccess('CH_TipoConducta', 'Consultar')) ?
                            <li className="nav-main-item">
                              <Link className="nav-main-link" to="/TipoConductaProcesoLista" state={{ from: from, disable: disable }}>
                                <span className="nav-main-link-name">TIPO DE CONDUCTA</span>
                              </Link>
                            </li>
                            : null}

                          {/* Se muestra cuando el usuario es jefe de dependencia */}
                          {(hasAccess('CH_Transacciones', 'Consultar')) ?
                            <li className="nav-main-item">
                              <Link className="nav-main-link" to="/Transacciones" state={{ from: from, selected_id_etapa: getEtapa, disable: disable }}>
                                <span className="nav-main-link-name">TRANSACCIONES</span>
                              </Link>
                            </li>
                            : null}

                          {/* Se muestra a partir de la etapa 3 */}
                          {etapaId >= global.Constants.ETAPAS.EVALUACION_PD && getRtaJefe  && (hasAccess('CH_UsuarioComisionado', 'Consultar')) ?
                            <li className="nav-main-item">
                              <Link className="nav-main-link" to="/ActuacionesForm" state={{ from: from, selected_id_etapa: getEtapa, tipoActuacion: "Comisorio", vengo: true }}>
                                <span className="nav-main-link-name">USUARIO COMISIONADO</span>
                              </Link>
                            </li>
                            : null}

                          {etapaId >= global.Constants.ETAPAS.EVALUACION_PD && getRtaJefe && (hasAccess('CH_DeclararmeImpedido', 'Consultar')) ?
                            <li className="nav-main-item">
                              <Link className="nav-main-link" to="/ActuacionesForm" state={{ from: from, selected_id_etapa: getEtapa, tipoActuacion: "Impedimento", vengo: true }}>
                                <span className="nav-main-link-name">DECLARARME IMPEDIDO</span>
                              </Link>
                            </li>
                            : null}

                          {etapaId >= global.Constants.ETAPAS.EVALUACION_PD && (hasAccess('CH_DuenaProceso', 'Consultar')) ?
                            <li className="nav-main-item">
                              <Link className="nav-main-link" to={"/SeleccionarDuenoProceso/"} state={{ from: from, id_dependencia_duena: getDependenciaDuena?.id }}>
                                <span className="nav-main-link-name">ASIGNAR NUEVA DEPENDENCIA DUEÑA DEL PROCESO</span>
                              </Link>
                            </li>
                            : null}

                          {(hasAccess('CH_Caratula', 'Consultar')) ?
                          <li className="nav-main-item">
                            <Link className="nav-main-link" to="#" state={{ from: from }} onClick={generarCaratula}>
                              <span className="nav-main-link-name">CARÁTULA</span>
                            </Link>
                          </li>: null}
                        </ul>
                      </li>
                    </ul>
              :
                <></>
            }
            </div>
        </div>
        


        {/*CAPTURA Y REPARTO*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.CAPTURA_REPARTO ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.CAPTURA_REPARTO ? (disable ? ("block-header bg-dark block-header-default") : "block-header block-header-default") : (disable ? ("block-header bg-dark block-header-default") : "block-header block-header-default")}>
              <h3 className={getEtapa == global.Constants.ETAPAS.CAPTURA_REPARTO ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(1) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.CAPTURA_REPARTO?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(1, 1, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(1, 1, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>
            <> 
              <div className="block-content">
                <ul className="nav-items push">
                  {(hasAccess('CR_Antecedente', 'Consultar')) ? (
                    <li className='li-border-bottom'>{getFase ? cargarFase(global.Constants.ETAPAS.CAPTURA_REPARTO, global.Constants.FASES.ANTECEDENTES, true, '/AntecedentesLista/') : null}</li>
                  ):null}
                  {(hasAccess('CR_Interesado', 'Consultar')) ? (
                    <li className='li-border-bottom'>{getFase ? cargarFase(global.Constants.ETAPAS.CAPTURA_REPARTO, global.Constants.FASES.INTERESADO, true, '/DatosInteresadoLista/') : null}</li>
                  ):null}
                  {(hasAccess('CR_ClasificacionRadicado', 'Consultar')) ? (
                    <li className='li-border-bottom'>{getFase ? cargarFase(global.Constants.ETAPAS.CAPTURA_REPARTO, global.Constants.FASES.CLASIFICACION, true, '/ClasificacionRadicadoLista/') : null}</li>
                  ):null}
                  {(hasAccess('CR_EntidadInvestigado', 'Consultar')) ? (
                    <li className='li-border-bottom'>{getFase ? cargarFase(global.Constants.ETAPAS.CAPTURA_REPARTO, global.Constants.FASES.ENTIDAD_INVESTIGADO, true, '/EntidadInvestigadoLista/') : null}</li>
                  ):null}
                  {(hasAccess('CR_SoporteRadicado', 'Consultar')) ? (
                    <li className='li-border-bottom'>{getFase ? cargarSoportesRadicado(global.Constants.ETAPAS.CAPTURA_REPARTO, global.Constants.FASES.SOPORTE_RADICADO, false, '/SoporteRadicadoLista/') : null}</li>
                  ):null}
                  
                  <li>{getFase ? cargarCierreEtapa(global.Constants.ETAPAS.CAPTURA_REPARTO, global.Constants.FASES.LISTA_PARA_CIERRE_CAPTURA_REPARTO, global.Constants.FASES.CIERRE_CAPTURA_REPARTO) : null}</li>
                
                </ul>
              </div>
            </>
          </div>
        </div>

        {/*EVALUACIÓN QUEJA PQR*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.EVALUACION ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.EVALUACION ? (disable ? ("block-header bg-dark block-header-default") : "block-header block-header-default") : (disable ? ("block-header bg-dark block-header-default") : "block-header block-header-default")}>
              <h3 className={getEtapa == global.Constants.ETAPAS.EVALUACION ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(2) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.EVALUACION?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(1, 1, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(1, 1, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>

            <>
              <div className="block-content">

                <ul className="nav-items push">
                  {(hasAccess('EI_ValidarClasificacion', 'Consultar')) ? (
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.VALIDAR_CLASIFICACION, true, '/ValidarClasificacionRadicadoForm/') : null}</li>
                  ):null}
                  {(hasAccess('EI_Evaluacion', 'Consultar')) ? (
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.EVALUACION, true, '/EvaluacionQuejaForm/') : null}</li>
                  ):null}
                  {(hasAccess('EI_RemisionQueja', 'Consultar')) ? (
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.REMISION_QUEJA, true, '/RemisionQuejaForm/') : null}</li>
                  ):null}
                  {(hasAccess('EI_RequerimientoJuzgado', 'Consultar')) ? (
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.REQUERIMIENTO_JUZGADO, true, '/RequerimientoJuzgadoForm/') : null}</li>
                  ):null}
                  {(hasAccess('E_GestorRespuesta', 'Consultar')) ? (  
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.GESTOR_RESPUESTA, true, '/GestorRespuestaForm/') : null}</li>
                  ):null}
                  {(hasAccess('EI_InformacionCierre', 'Consultar')) ? (
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.INFORME_CIERRE, true, '/InformeCierreSiriusForm/') : null}</li>
                  ):null}
                  {(hasAccess('E_ComunicacionInteresados', 'Consultar')) ? (
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.COMUNICACION_INTERESADO, true, '/ComunicacionInteresadoForm/') : null}</li>
                  ):null}
                  {(hasAccess('EI_DocumentoCierre', 'Consultar')) ? (  
                    <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.DOCUMENTO_CIERRE, true, '/DocumentoCierreForm/') : null}</li>
                  ):null}
            
                  <li className={getFase ? 'li-border-bottom' : null}>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.REGISTRO_SEGUIMIENTO, true, '/RegistroSeguimientoForm/') : null}</li>
            
                  {(hasAccess('EI_CierreEtapa', 'Consultar') && disable !== true) ? (
                    <li>{getFase ? cargarCierreEtapa(global.Constants.ETAPAS.EVALUACION, global.Constants.FASES.LISTA_PARA_CIERRE_EVALUACION, global.Constants.FASES.CIERRE_EVALUACION) : null}</li>
                  ) : null}
                </ul>
              </div>                
            </>
          </div>
        </div>

        {/*EVALUACIÓN QUEJA - PD*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.EVALUACION_PD ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.EVALUACION_PD ? (disable ? ("block-header bg-dark block-header-default") : "block-header block-header-default") : (disable ? ("block-header bg-dark block-header-default") : "block-header block-header-default")}>
              <h3 className={getEtapa == global.Constants.ETAPAS.EVALUACION_PD ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(3) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.EVALUACION_PD?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>
            <>
              {
                  <div className="block-content">
                    <ul className="nav-items push">
                      {
                        getEtapa == global.Constants.ETAPAS.EVALUACION_PD
                        ?
                          (
                            getMostrarIniciarProcesoActuaciones && from.mismoUsuarioBuscador
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION_PD, global.Constants.FASES.IMPEDIMENTOS_COMISORIOS, false, '/PreguntaImpedimentos/') : null}</li>
                            :
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION_PD, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                          )
                        :
                          (
                            getExistenActuacionesEtapas?.data?.attributes?.evaluacion_pd
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.EVALUACION_PD, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            :
                              null
                          )
                      }
                    </ul>
                  </div>
              }
            </>
          </div>
        </div>

        {/*INDAGACIÓN PREVIA*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR ? "block-header block-header-default" : "block-header block-header-default"}>
              <h3 className={getEtapa == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(4) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>
            <>
              {
                  <div className="block-content">
                    <ul className="nav-items push">
                      {/* {
                        getEtapa == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR
                        ?
                          (
                            getMostrarIniciarProcesoActuaciones
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR, global.Constants.FASES.IMPEDIMENTOS_COMISORIOS, false, '/PreguntaImpedimentos/') : null}</li>
                            :
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                          )
                        :
                          (
                            getExistenActuacionesEtapas?.data?.attributes?.investigacion_preliminar
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            :
                              null
                          )
                      } */}
                      {
                        getEtapa == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR
                        ?                          
                          (
                            getMostrarIniciarProcesoActuacionesQuejaInterna
                            ?
                              (
                                <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                              )
                            :
                              (
                                getMostrarIniciarProcesoActuaciones && from.mismoUsuarioBuscador
                                ?
                                  <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR, global.Constants.FASES.IMPEDIMENTOS_COMISORIOS, false, '/PreguntaImpedimentos/') : null}</li>
                                :
                                  <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                              )
                          )
                        :
                          (
                            getExistenActuacionesEtapas?.data?.attributes?.investigacion_preliminar
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            :
                              null
                          )
                      }
                        
                    </ul>
                  </div>
              }
            </>
          </div>
        </div>

        {/*INVESTIGACIÓN DISCIPLINARIA*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA ? "block-header block-header-default" : "block-header block-header-default"}>
              <h3 className={getEtapa == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(5) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>
            <>
              {
                  <div className="block-content">
                    <ul className="nav-items push">
                    {
                        getEtapa == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA
                        ?
                          (
                            getMostrarIniciarProcesoActuaciones && from.mismoUsuarioBuscador
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA, global.Constants.FASES.IMPEDIMENTOS_COMISORIOS, false, '/PreguntaImpedimentos/') : null}</li>
                            :
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            )
                        :
                          (
                            getExistenActuacionesEtapas?.data?.attributes?.investigacion_disciplinaria
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            :
                              null
                          )
                      }
                    </ul>
                  </div>
              }
            </>
          </div>
        </div>

        {/*JUZGAMIENTO - P. ORDINARIO*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.CAUSA_JUZGAMIENTO ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.CAUSA_JUZGAMIENTO ? "block-header block-header-default" : "block-header block-header-default"}>
              <h3 className={getEtapa == global.Constants.ETAPAS.CAUSA_JUZGAMIENTO ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(6) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>
            <>
              {
                  <div className="block-content">
                    <ul className="nav-items push">
                      {
                        getEtapa == global.Constants.ETAPAS.CAUSA_JUZGAMIENTO
                        ?
                          (
                            getMostrarIniciarProcesoActuaciones && from.mismoUsuarioBuscador
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.CAUSA_JUZGAMIENTO, global.Constants.FASES.IMPEDIMENTOS_COMISORIOS, false, '/PreguntaImpedimentos/') : null}</li>
                            :
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.CAUSA_JUZGAMIENTO, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            )
                        :
                          (
                            getExistenActuacionesEtapas?.data?.attributes?.causa_juzgamiento
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.CAUSA_JUZGAMIENTO, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            :
                              null
                          )
                      }
                    </ul>
                  </div>
              }
            </>
          </div>
        </div>

        {/*JUZGAMIENTO - P. VERBAL*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.PROCESO_VERBAL ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.PROCESO_VERBAL ? "block-header block-header-default" : "block-header block-header-default"}>
              <h3 className={getEtapa == global.Constants.ETAPAS.PROCESO_VERBAL ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(7) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.PROCESO_VERBAL?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>
            <>
              {
                  <div className="block-content">
                    <ul className="nav-items push">
                    {
                        getEtapa == global.Constants.ETAPAS.PROCESO_VERBAL
                        ?
                          (
                            getMostrarIniciarProcesoActuaciones && from.mismoUsuarioBuscador
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.PROCESO_VERBAL, global.Constants.FASES.IMPEDIMENTOS_COMISORIOS, false, '/PreguntaImpedimentos/') : null}</li>
                            :
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.PROCESO_VERBAL, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            )
                        :
                          (
                            getExistenActuacionesEtapas?.data?.attributes?.proceso_verbal
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.PROCESO_VERBAL, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            :
                              null
                          )
                      }
                    </ul>
                  </div>
              }
            </>
          </div>
        </div>

        {/*SEGUNDA INTANCIA (PERSONERIA AUXILIAR, JURIDICA)*/}
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className={getEtapa == global.Constants.ETAPAS.SEGUNDA_INSTANCIA ? "block block-themed" : "block block-themed-secundary"}>
            <div className={getEtapa == global.Constants.ETAPAS.SEGUNDA_INSTANCIA ? "block-header block-header-default" : "block-header block-header-default"}>
              <h3 className={getEtapa == global.Constants.ETAPAS.SEGUNDA_INSTANCIA ? "block-title" : "block-title-secundary"}>{getListaEtapas && getListaEtapas.length ? capturarNombreEtapa(8) : ""}</h3>
              <Link to={`/SoporteRadicadoLista/`} state={{ from: from, disable: disable }}>
                {getEtapa == global.Constants.ETAPAS.SEGUNDA_INSTANCIA?
                  <button type="button" className="btn btn-sm" style={{ color: 'white' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>:
                  <button type="button" className="btn btn-sm" style={{ color: '#0071a1' }} onClick={() => handleClicSoporteRadicado(etapaId, global.Constants.ETAPAS.ACTUACIONES_EVALUACION_PD, true)}><i className="fas fa-folder-open fa-2x"></i></button>
                }
              </Link>
            </div>
            <>
              {
                  <div className="block-content">
                    <ul className="nav-items push">
                      {
                        getEtapa == global.Constants.ETAPAS.SEGUNDA_INSTANCIA
                        ?
                          (
                            getMostrarIniciarProcesoActuaciones && from.mismoUsuarioBuscador
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.SEGUNDA_INSTANCIA, global.Constants.FASES.IMPEDIMENTOS_COMISORIOS, false, '/PreguntaImpedimentos/') : null}</li>
                            :
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.SEGUNDA_INSTANCIA, global.Constants.FASES.ACTUACIONES_EVALUACION_PD, false, '/ActuacionesLista/') : null}</li>
                            )
                        :
                          (
                            getExistenActuacionesEtapas?.data?.attributes?.segunda_instancia
                            ?
                              <li>{getFase ? cargarFase(global.Constants.ETAPAS.SEGUNDA_INSTANCIA, global.Constants.FASES.CAUSA_JUZGAMIENTO, false, '/ActuacionesLista/') : null}</li>
                            :
                              null
                          )
                      }
                    </ul>
                  </div>
              }
            </>
          </div>
        </div>
      </div>
    </>
  );
}


export default RamasProceso;