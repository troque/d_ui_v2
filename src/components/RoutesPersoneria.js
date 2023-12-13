import React, { Component, lazy } from 'react';

import { Route, Routes } from "react-router-dom";
import { hasAccess } from '../components/Utils/Common';
import CambioVigenciaProcesoDisciplinario from './Maestras/CambioVigenciaProcesoDisciplinario';

//Containers
//login
const Login = lazy(() => import('./Login/Login'))

const PaginaInicio = lazy(() => import('./Dashboard/Dashboard'))

//Ejemplos

const DepartamentosEjemplo = lazy(() => import('./Samples/DepartamentosEjemplo'))
const DepartamentoFormEjemplo = lazy(() => import('./Samples/DepartamentoFormEjemplo'))

//Proceso Disciplinario
const ProcesoDisciplinario = lazy(() => import('./SistemasDisciplinarios/ProcesoDisciplinario'))

//Mis Pendientes
const MisPendientes = lazy(() => import('./MisPendientes/MisPendientes2'))

//Traslado procesos
const TrasladoProcesos = lazy(() => import('./Administracion/TrasladoProcesos/TrasladoProcesos'))
const CasosActivos = lazy(() => import('./Administracion/TrasladoProcesos/CasosActivos'))

//Abrir proceso
const AbrirProceso = lazy(() => import('./Administracion/AbrirProceso/AbrirProceso'))

//entidades interesado
const EntidadesInteresadoForm = lazy(() => import('./EntidadesInteresado/EntidadesInteresadoForm'))
const EntidadesInteresadoLista = lazy(() => import('./EntidadesInteresado/EntidadesInteresadoLista'))


//Ramas del proceso
const RamasProceso = lazy(() => import('./RamasProceso/RamasProceso'))


//--Captura y reparto - Antecendentes
const AntecedentesLista = lazy(() => import('./RamasProceso/Antecedentes/AntecedentesLista'))
const AntecedentesForm = lazy(() => import('./RamasProceso/Antecedentes/AntencentesForm'))
const AntecedentesCambiarEstadoForm = lazy(() => import('./RamasProceso/Antecedentes/AntecedentesCambiarEstadoForm'))

//Datos Interesado
const DatosInteresadoForm = lazy(() => import('./RamasProceso/DatosInteresado/DatosInteresadoForm'))
const DatosInteresadoLista = lazy(() => import('./RamasProceso/DatosInteresado/DatosInteresadoLista'))
const DatosInteresadoCambiarEstadoForm = lazy(() => import('./RamasProceso/DatosInteresado/DatosInteresadoCambiarEstadoForm'))


//--Captura y repato - Clasificacion del radicado
const ClasificacionRadicadoForm = lazy(() => import('./RamasProceso/ClasificacionRadicado/ClasificacionRadicadoForm'));
const ClasificacionRadicadoLista = lazy(() => import('./RamasProceso/ClasificacionRadicado/ClasificacionRadicadoLista'));

//--Entidad investigado
const EntidadInvestigadoForm = lazy(() => import('./RamasProceso/EntidadInvestigado/EntidadInvestigadoForm'));
const EntidadInvestigadoLista = lazy(() => import('./RamasProceso/EntidadInvestigado/EntidadInvestigadoLista'));
const EntidadInvestigadoCambiarEstadoForm = lazy(() => import('./RamasProceso/EntidadInvestigado/EntidadInvestigadoCambiarEstadoForm'));
const EntidadInvestigadoQuejaInterna = lazy(() => import('./RamasProceso/EntidadInvestigado/EntidadInvestigadoQuejaInterna'));

//--Soporte radicado
const SoporteRadicadoForm = lazy(() => import('./RamasProceso/SoporteRadicado/SoporteRadicadoForm'));
const SoporteRadicadoLista = lazy(() => import('./RamasProceso/SoporteRadicado/SoporteRadicadoLista'));
const SoporteRadicadoCambiarEstadoForm = lazy(() => import('./RamasProceso/SoporteRadicado/SoporteRadicadoCambiarEstadoForm'));

//--Confirmar Validacion Clasificado
const ValidarClasificacionRadicadoForm = lazy(() => import('./RamasProceso/ValidarClasificacionRadicado/ValidarClasificacionRadicadoForm'));


const ComunicacionInteresadoForm = lazy(() => import('./RamasProceso/ComunicacionInteresado/ComunicacionInteresadoForm'));

/*
* Evaluación e Incorporacion
*/
//--Remisión Queja
const RemisionQuejaForm = lazy(() => import('./RamasProceso/RemisionQueja/RemisionQuejaForm'));

//Documento Cierre
const DocumentoCierreForm = lazy(() => import('./RamasProceso/DocumentoCierre/DocumentoCierreForm'))

//Gestor Respuesta
const GestorRespuestaForm = lazy(() => import('./RamasProceso/GestorRespuesta/GestorRespuestaForm'))

//Requerimiento Juzgado
const RequerimientoJuzgadoForm = lazy(() => import('./RamasProceso/RequerimientoJuzgado/RequerimientoJuzgadoForm'))

//Informe Cierre
const InformeCierreSiriusForm = lazy(() => import('./RamasProceso/InformeCierre/InformeCierreSiriusForm'))
const InformeCierreDocumentoForm = lazy(() => import('./RamasProceso/InformeCierre/InformeCierreDocumentoForm'))

//Registro Seguimiento
const RegistroSeguimientoForm = lazy(() => import('./RamasProceso/RegistroSeguimiento/RegistroSeguimientoForm'))


/*
* Evaluacion Queja
*/
const EvaluacionQuejaForm = lazy(() => import('./RamasProceso/EvaluacionQueja/EvaluacionQuejaForm'));

//Departamento
const DepartamentoLista = lazy(() => import('./Maestras/DepartamentoLista'));
const DepartamentoForm = lazy(() => import('./Maestras/DepartamentoForm'));

//Usuario
const UsuarioLista = lazy(() => import('./Maestras/UsuarioLista'));
const UsuarioForm = lazy(() => import('./Maestras/UsuarioForm'));
const UsuarioDetalle = lazy(() => import('./Maestras/UsuarioDetalle'));

//Dependencia origen
const DependenciaLista = lazy(() => import('./Maestras/DependenciaLista'));
const DependenciaForm = lazy(() => import('./Maestras/DependenciaForm'));

//Dependencia origen
const DependenciaConfiguracionForm = lazy(() => import('./Maestras/DependenciaConfiguracionForm'));
const DependenciaConfiguracionDetalle = lazy(() => import('./Maestras/DependenciaConfiguracionDetalle'));

//Días no laborables
const DiasNoLaborablesLista = lazy(() => import('./Maestras/DiasNoLaborablesLista'));
const DiasNoLaborablesForm = lazy(() => import('./Maestras/DiasNoLaborablesForm'));

//Fases
const FaseLista = lazy(() => import('./Maestras/FaseLista'))
const FaseForm = lazy(() => import('./Maestras/FaseForm'));
const FaseDetalle = lazy(() => import('./Maestras/FaseDetalle'));

//Etapas
const EtapaLista = lazy(() => import('./Maestras/EtapaLista'))
const EtapaForm = lazy(() => import('./Maestras/EtapaForm'));

//Rol Lista
const RolLista = lazy(() => import('./Maestras/RolesLista'));
const RolForm = lazy(() => import('./Maestras/RolForm'));
const RolDetalle = lazy(() => import('./Maestras/RolDetalle'));

//Parametros sistema
const ParametroLista = lazy(() => import('./Maestras/ParametroLista'));
const ParametroForm = lazy(() => import('./Maestras/ParametroForm'));

//Vigencia
const VigenciaLista = lazy(() => import('./Maestras/VigenciaLista'));
const VigenciaForm = lazy(() => import('./Maestras/VigenciaForm'));

//Tipos de Documentos
const TipoDocumentoLista = lazy(() => import('./Maestras/TipoDocumentoLista'));
const TipoDocumentoForm = lazy(() => import('./Maestras/TipoDocumentoForm'));


//Formatos
const FormatosLista = lazy(() => import('./Maestras/FormatosLista'));
const FormatosForm = lazy(() => import('./Maestras/FormatosForm'));

//Generos
const GeneroLista = lazy(() => import('./Maestras/GeneroLista'));
const GeneroForm = lazy(() => import('./Maestras/GeneroForm'));

// Tipo de conducta  
const TipoConductaForm = lazy(() => import('./Maestras/TipoConductaForm'));
const TipoConductaLista = lazy(() => import('./Maestras/TipoConductaLista'));

//EstadoProcesoDiciplinario
const EstadoProcesoDiciplinarioForm = lazy(() => import('./Maestras/EstadoProcesoDiciplinarioForm'));
const EstadoProcesoDiciplinarioLista = lazy(() => import('./Maestras/EstadoProcesoDiciplinarioLista'));

//ResultadoEvaluacion
const ResultadoEvaluacionForm = lazy(() => import('./Maestras/ResultadoEvaluacionForm'));
const ResultadoEvaluacionLista = lazy(() => import('./Maestras/ResultadoEvaluacionLista'));

//TipoSujetoProcesal
const TipoSujetoProcesalForm = lazy(() => import('./Maestras/TipoSujetoProcesalForm'));
const TipoSujetoProcesalLista = lazy(() => import('./Maestras/TipoSujetoProcesalLista'));

//Localidades
const LocalidadLista = lazy(() => import('./Maestras/LocalidadLista'));
const LocalidadForm = lazy(() => import('./Maestras/LocalidadForm'));

//Orientaciones
const OrientacionSexualLista = lazy(() => import('./Maestras/OrientacionSexualLista'));
const OrientacionSexualForm = lazy(() => import('./Maestras/OrientacionSexualForm'));

//Orientaciones
const OrigenRadicadoLista = lazy(() => import('./Maestras/OrigenRadicadoLista'));
const OrigenRadicadoForm = lazy(() => import('./Maestras/OrigenRadicadoForm'));

//Tipo Derecho Peticion
const TipoDerechoPeticionLista = lazy(() => import('./Maestras/TipoDerechoPeticionLista'));
const TipoDerechoPeticionForm = lazy(() => import('./Maestras/TipoDerechoPeticionForm'));

//Tipo expediente
const TipoExpedienteLista = lazy(() => import('./Maestras/TipoExpedienteLista'));
const TipoExpedienteForm = lazy(() => import('./Maestras/TipoExpedienteForm'));

//Tipo queja
const TipoQuejaLista = lazy(() => import('./Maestras/TipoQuejaLista'));
const TipoQuejaForm = lazy(() => import('./Maestras/TipoQuejaForm'));

//Sexos
const SexoLista = lazy(() => import('./Maestras/SexoLista'));
const SexoForm = lazy(() => import('./Maestras/SexoForm'));

//Funcionarios Lista
const FuncionarioGestorRespuestaLista = lazy(() => import('./Maestras/FuncionarioListaGestorRespuesta'));
const FuncionarioGestorRespuestaForm = lazy(() => import('./Maestras/RolForm'));
const FuncionarioGestorRespuestaDetalle = lazy(() => import('./Maestras/RolDetalle'));

//Ciudades
const CiudadLista = lazy(() => import('./Maestras/CiudadLista'));
const CiudadForm = lazy(() => import('./Maestras/CiudadForm'));

//Firma
const TipoFirmaLista = lazy(() => import('./Maestras/TipoFirmaLista'));
const TipoFirmaForm = lazy(() => import('./Maestras/TipoFirmaForm'));

/*
* Historial
*/
const LogProcesoDisciplinario = lazy(() => import('./LogSistema/LogProcesoDisciplinario'));
const LogProcesosAsignados = lazy(() => import('./LogSistema/LogProcesosAsignados'));


const InfoRepartoAleatorio = lazy(() => import('./LogSistema/InfoRepartoAleatorio'));
const InfoDetalleUsuario = lazy(() => import('./LogSistema/InfoDetalleUsuario'));
const InfoRepartoDependencia = lazy(() => import('./LogSistema/InfoRepartoDependencia'));
const InfoDetalleDependencia = lazy(() => import('./LogSistema/InfoDetalleDependencia'));


// HERRAMIENTAS

//-- Evaluacion en PD - Actuaciones
const ActuacionesForm = lazy(() => import('./RamasProceso/Actuaciones/ActuacionesForm'));
const ActuacionesLista = lazy(() => import('./RamasProceso/Actuaciones/ActuacionesLista'));
const ActuacionesVer = lazy(() => import('./RamasProceso/Actuaciones/ActuacionesVer'));
const ActuacionesSolicitudDeAnulacion = lazy(() => import('./RamasProceso/Actuaciones/SolicitudDeAnulacion'));
const ActuacionesAceptaRechazaSolicitudDeAnulacion = lazy(() => import('./RamasProceso/Actuaciones/AceptaRechazaAnulacion'));
const ActuacionesAprobacionRechazar = lazy(() => import('./RamasProceso/Actuaciones/ActuacionesAprobacionRechazar'));
const ActuacionesInactivar = lazy(() => import('./RamasProceso/Actuaciones/ActuacionesInactivar'));
const ActuacionesCargarArchivoDefinitivo = lazy(() => import('./RamasProceso/Actuaciones/ActuacionesCargarArchivoDefinitivo'));
const AgregarUsuarioParaFirmaMecanica = lazy(() => import('./RamasProceso/Actuaciones/AgregarUsuarioParaFirmaMecanica'));
const FirmarDocumentoActuacion = lazy(() => import('./RamasProceso/Actuaciones/FirmarDocumentoActuacion'));



//-- Transacciones
const ListaAccionesForm = lazy(() => import('./RamasProceso/Transacciones/ListaAccionesForm'));
const EnviaraAlguienDeMiDependencia = lazy(() => import('./RamasProceso/Transacciones/EnviaraAlguienDeMiDependencia'));
const EnviarAlJefeDeMiDependencia = lazy(() => import('./RamasProceso/Transacciones/EnviarAlJefeDeMiDependencia'));
const EnviarAotraDependencia = lazy(() => import('./RamasProceso/Transacciones/EnviarAotraDependencia'));
const EnviarAlAnteriorUsuario = lazy(() => import('./RamasProceso/Transacciones/EnviarAlAnteriorUsuario'));
const EnviaraAlguienDeSecretariaComunAleatorio = lazy(() => import('./RamasProceso/Transacciones/EnviaraAlguienDeSecretariaComunAleatorio'));
const EnviaraAlguienDeSecretariaComunDirigido = lazy(() => import('./RamasProceso/Transacciones/EnviaraAlguienDeSecretariaComunDirigido'));

//Actuaciones Administración
const ActuacionesAdminLista = lazy(() => import('./Maestras/ActuacionesAdminLista'));
const ActuacionesAdminForm = lazy(() => import('./Maestras/ActuacionesAdminForm'));

// Parametro Campos Administración
const ParametroCamposLista = lazy(() => import('./Maestras/ParametroCamposLista'));
const ParametroCamposForm = lazy(() => import('./Maestras/ParametroCamposForm'));

// Buscador de expedientes
const Buscador = lazy(() => import('./RamasProceso/Buscador/Buscador'));
const BuscadorMigracion = lazy(() => import('./RamasProceso/Buscador/BuscadorMigracion'));




// Tipo de conducta
const TipoConductaProcesoLista = lazy(() => import('./RamasProceso/TipoConducta/TipoConductaEvaluacionLista'));
const TipoConductaProcesoForm = lazy(() => import('./RamasProceso/TipoConducta/TipoConductaEvaluacionForm'));

// Impedimentos
const PreguntaImpedimentos = lazy(() => import('./RamasProceso/Impedimentos/PreguntaImpedimentos'));

// Log Consultas
const LogConsultas = lazy(() => import('./LogConsultas/LogConsultas'));

// Caratulas
const CaratulasForm = lazy(() => import('./RamasProceso/Caratulas/CaratulasForm'));
const CaratulasAdminForm = lazy(() => import('./Maestras/CaratulasAdminForm'));
const CaratulasAdminLista = lazy(() => import('./Maestras/CaratulasAdminLista'));

// Log Consultas
const EvaluacionFasesLista = lazy(() => import('./Administracion/Evaluacion/EvaluacionFasesLista'));
const EvaluacionFasesAdd = lazy(() => import('./Administracion/Evaluacion/EvaluacionFasesAdd'));
const EvaluacionFasesDetalle = lazy(() => import('./Administracion/Evaluacion/EvaluacionFasesDetalle'));

//Perfil
const Perfil = lazy(() => import('./Perfil/Perfil'));
const AgregarFirma = lazy(() => import('./Perfil/AgregarFirma'));
const DocumentosFirmadosOPendientesDeFirma = lazy(() => import('./Perfil/DocumentosFirmadosOPendientesDeFirma'));
const FirmaActuaciones = lazy(() => import('./Perfil/FirmaActuaciones'));

// Tipo Proceso
const TipoProcesoLista = lazy(() => import('./Maestras/TipoProcesoLista'));
const TipoProcesoForm = lazy(() => import('./Maestras/TipoProcesoForm'));

// Tipo Expediente
const TipoExpedienteMensajesLista = lazy(() => import('./Maestras/TipoExpedienteMensajesLista'));
const TipoExpedienteMensajesForm = lazy(() => import('./Maestras/TipoExpedienteMensajesForm'));

// Tipo Unidad
const TipoUnidadLista = lazy(() => import('./Maestras/TipoUnidadLista'));
const TipoUnidadForm = lazy(() => import('./Maestras/TipoUnidadForm'));

// Parametros Caratula
const ParametroCamposCaratulaLista = lazy(() => import('./Maestras/ParametroCamposCaratulaLista'));
const ParametroCamposCaratulaForm = lazy(() => import('./Maestras/ParametroCamposCaratulaForm'));

const SeleccionarDuenoProceso = lazy(() => import('./RamasProceso/Actuaciones/SeleccionarDuenoProceso'));
const ActuacionesSigueImpedimentos = lazy(() => import('./RamasProceso/Actuaciones/ActuacionesSigueImpedimentos'));

// Semaforos
const SemaforosLista = lazy(() => import('./Maestras/SemaforosLista'));
const SemaforosForm = lazy(() => import('./Maestras/SemaforosForm'));
const SeleccionDeFechaParaSemaforo = lazy(() => import('./RamasProceso/Actuaciones/SeleccionDeFechaParaSemaforo'));
const ListaSemaforos = lazy(() => import('./RamasProceso/ListaSemaforos/ListaSemaforos'));
// Migracion

const CargarMigracionProcesoDisciplinario = lazy(() => import('./Migracion/ProcesoDisciplinario/ProcesoDisciplinarioMigracionForm'));
const ProcesoDisciplinarioMigracion = lazy(() => import('./Migracion/ProcesoDisciplinario/ProcesoDisciplinarioMigracion'));
const CargarMigracionAntecedentes = lazy(() => import('./Migracion/Antecedentes/AntencentesMigracionForm'));
const ListarMigracionAntecedentes = lazy(() => import('./Migracion/Antecedentes/AntecedentesMigracionLista'));
const CargarDatosInteresado = lazy(() => import('./Migracion/DatosInteresado/DatoInteresadoMigracionForm'));
const ListarDatosInteresados = lazy(() => import('./Migracion/DatosInteresado/DatoInteresadoMigracionLista'));
const CargarMigracionEntidad = lazy(() => import('./Migracion/Entidad/EntidadMigracionForm'));
const ListarMigracionEntidades = lazy(() => import('./Migracion/Entidad/EntidadMigracionLista'));
const CargarMigracionActuacion = lazy(() => import('./Migracion/Actuaciones/ActuacionesMigracionForm'));
const ListarMigracionActuaciones = lazy(() => import('./Migracion/Actuaciones/ActuacionesMigracionLista'));

const PortalLogLista = lazy(() => import('./Maestras/PortalLogLista'));

const PortalNotificaciones = lazy(() => import('./Maestras/PortalNotificacionesLista'));
const PortalNotificacionesForm = lazy(() => import('./Maestras/PortalNotificacionesForm'));
const PortalNotificacionesCambiarEstadoForm = lazy(() => import('./Maestras/PortalNotificacionesCambiarEstadoForm'));

const PortalConfiguracionTipoInteresado = lazy(() => import('./Maestras/PortalConfiguracionTipoInteresadoLista'));
const PortalConfiguracionTipoInteresadoForm = lazy(() => import('./Maestras/PortalConfiguracionTipoInteresadoForm'));

// GrupoTrabajoSecretariaComunLista
const GrupoTrabajoSecretariaComun = lazy(() => import('./Maestras/GrupoTrabajoSecretariaComunLista'));
const GrupoTrabajoSecretariaComunForm = lazy(() => import('./Maestras/GrupoTrabajoSecretariaComunForm'));

// Agregar Semaforo en actuacion
const AgregarSemaforo = lazy(() => import('./RamasProceso/Actuaciones/AgregarSemaforo'));

// Cargos
const CargosLista = lazy(() => import('./Maestras/CargosLista'));
const CargosForm = lazy(() => import('./Maestras/CargosForm'));

//Consecutivo Deslglose
const ConsecutivoActuacionesLista = lazy(() => import('./Maestras/ConsecutivoActuacionesLista'));
const ConsecutivoActuacionesForm = lazy(() => import('./Maestras/ConsecutivoActuacionesForm'));

//Cambio de fase de un proceso disciplinario
const CambioFaseForm = lazy(() => import('./Administracion/CambioFase/CambioFase'));

//function App() {
class RoutesPersoneria extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canEjemplo: hasAccess('TiposUsuario', 'Control interno disciplinario2')
    };
  }

  render() {
    return (
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/inicio" element={<PaginaInicio />} />


        <Route path="/Ejemplos/Departamentos" element={<DepartamentosEjemplo />} />
        {this.state.canEjemplo ? (<Route path="/Ejemplos/Departamentos/agregar" element={<DepartamentoFormEjemplo />} />) : null}
        <Route path="/Ejemplos/Departamentos/:departamentoId" element={<DepartamentoFormEjemplo />} />
        <Route path="/ProcesoDisciplinario" element={<ProcesoDisciplinario />} />
        <Route path="/MisPendientes" element={<MisPendientes />} />
        <Route path="/TrasladoProcesos" element={<TrasladoProcesos />} />
        <Route path="/CasosActivos/:usuario" element={<CasosActivos />} />
        <Route path="/EntidadesInteresadoForm" element={<EntidadesInteresadoForm />} />
        <Route path="/EntidadesInteresadoLista" element={<EntidadesInteresadoLista />} />
        <Route path="/RamasProceso" element={<RamasProceso />} />

        <Route path="/AntecedentesLista/" element={<AntecedentesLista />} />
        <Route path="/AntencentesForm/" element={<AntecedentesForm />} />
        <Route path="/AntecedentesCambiarEstadoForm/:idAntecedente" element={<AntecedentesCambiarEstadoForm />} />

        <Route path="/ClasificacionRadicadoForm/" element={<ClasificacionRadicadoForm />} />
        <Route path="/ClasificacionRadicadoLista/" element={<ClasificacionRadicadoLista />} />

        <Route path="/EntidadInvestigadoForm/" element={<EntidadInvestigadoForm />} />
        <Route path="/EntidadInvestigadoLista/" element={<EntidadInvestigadoLista />} />
        <Route path="/EntidadInvestigadoCambiarEstadoForm/:idEntidadInvestigado" element={<EntidadInvestigadoCambiarEstadoForm />} />
        <Route path="/EntidadInvestigadoQuejaInterna/" element={<EntidadInvestigadoQuejaInterna />} />

        <Route path="/SoporteRadicadoForm/" element={<SoporteRadicadoForm />} />
        <Route path="/SoporteRadicadoLista/" element={<SoporteRadicadoLista />} />
        <Route path="/SoporteRadicadoCambiarEstadoForm/:idDocumentoSirius" element={<SoporteRadicadoCambiarEstadoForm />} />
        <Route path="/ComunicacionInteresadoForm/" element={<ComunicacionInteresadoForm />} />

        <Route path="/DatosInteresadoForm/" element={<DatosInteresadoForm />} />
        <Route path="/DatosInteresadoLista/" element={<DatosInteresadoLista />} />
        <Route path="/DatosInteresadoCambiarEstadoForm/:idDatosInteresado" element={<DatosInteresadoCambiarEstadoForm />} />

        <Route path="/ValidarClasificacionRadicadoForm/" element={<ValidarClasificacionRadicadoForm />} />
        <Route path="/RemisionQuejaForm/" element={<RemisionQuejaForm />} />
        <Route path="/EvaluacionQuejaForm/" element={<EvaluacionQuejaForm />} />

        <Route path="/LogProcesoDisciplinario/" element={<LogProcesoDisciplinario />} />
        <Route path="/LogProcesosAsignados/" element={<LogProcesosAsignados />} />

        <Route path="/Departamento" element={<DepartamentoLista />} />
        <Route path="/Departamento/Add" element={<DepartamentoForm />} />
        <Route path="/Departamento/:id" element={<DepartamentoForm />} />

        <Route path="/Usuario" element={<UsuarioLista />} />
        <Route path="/Usuario/Add" element={<UsuarioForm />} />
        <Route path="/Usuario/:id" element={<UsuarioDetalle />} />

        <Route path="/Dependencia" element={<DependenciaLista />} />
        <Route path="/Dependencia/Add" element={<DependenciaForm />} />
        <Route path="/Dependencia/:id" element={<DependenciaForm />} />

        <Route path="/FuncionalidadGestorRespuesta" element={<FuncionarioGestorRespuestaLista />} />
        <Route path="/FuncionalidadGestorRespuesta/Add" element={<FuncionarioGestorRespuestaForm />} />
        <Route path="/FuncionalidadGestorRespuesta/:id" element={<FuncionarioGestorRespuestaDetalle />} />

        <Route path="/ActuacionesForm/" element={<ActuacionesForm />} />
        <Route path="/ActuacionesLista/" element={<ActuacionesLista />} />
        <Route path="/ActuacionesVer/:procesoDisciplinarioId/:idEtapa/:estado" element={<ActuacionesVer />} />
        <Route path="/ActuacionesSolicitudDeAnulacion/" element={<ActuacionesSolicitudDeAnulacion />} />
        <Route path="/ActuacionesAceptaRechazaSolicitudDeAnulacion/" element={<ActuacionesAceptaRechazaSolicitudDeAnulacion />} />
        <Route path="/ActuacionesAprobacionRechazar/" element={<ActuacionesAprobacionRechazar />} />
        <Route path="/ActuacionesInactivar/" element={<ActuacionesInactivar />} />
        <Route path="/ActuacionesCargarArchivoDefinitivo/" element={<ActuacionesCargarArchivoDefinitivo />} />
        <Route path="/AgregarUsuarioParaFirmaMecanica/" element={<AgregarUsuarioParaFirmaMecanica />} />
        <Route path="/FirmarDocumentoActuacion/" element={<FirmarDocumentoActuacion />} />

        <Route path="/ParametroCampos/" element={<ParametroCamposLista />} />
        <Route path="/ParametroCampos/Add" element={<ParametroCamposForm />} />
        <Route path="/ParametroCampos/:id" element={<ParametroCamposForm />} />

        <Route path="/DependenciaConfiguracion/Add" element={<DependenciaConfiguracionForm />} />
        <Route path="/DependenciaConfiguracion/:id" element={<DependenciaConfiguracionDetalle />} />

        <Route path="/Rol" element={<RolLista />} />
        <Route path="/Rol/Add" element={<RolForm />} />
        <Route path="/Rol/:id" element={<RolDetalle />} />
        <Route path="/DiasNoLaborables" element={<DiasNoLaborablesLista />} />
        <Route path="/DiasNoLaborables/Add" element={<DiasNoLaborablesForm />} />
        <Route path="/DiasNoLaborables/:id" element={<DiasNoLaborablesForm />} />
        <Route path="/Parametro" element={<ParametroLista />} />
        <Route path="/Parametro/:id" element={<ParametroForm />} />
        <Route path="/Vigencia" element={<VigenciaLista />} />
        <Route path="/Vigencia/Add" element={<VigenciaForm />} />
        <Route path="/Vigencia/:id" element={<VigenciaForm />} />
        <Route path="/FuncionalidadGestorRespuesta" element={<FuncionarioGestorRespuestaLista />} />
        <Route path="/FuncionalidadGestorRespuesta/Add" element={<FuncionarioGestorRespuestaForm />} />
        <Route path="/FuncionalidadGestorRespuesta/:id" element={<FuncionarioGestorRespuestaDetalle />} />

        <Route path="/TipoDocumento" element={<TipoDocumentoLista />} />
        <Route path="/TipoDocumento/Add" element={<TipoDocumentoForm />} />
        <Route path="/TipoDocumento/:id" element={<TipoDocumentoForm />} />

        <Route path="/Formatos" element={<FormatosLista />} />
        <Route path="/Formatos/Add" element={<FormatosForm />} />
        <Route path="/Formatos/:id" element={<FormatosForm />} />

        <Route path="/Genero" element={<GeneroLista />} />
        <Route path="/Genero/Add" element={<GeneroForm />} />
        <Route path="/Genero/:id" element={<GeneroForm />} />

        <Route path="/TipoConducta" element={<TipoConductaLista />} />
        <Route path="/TipoConducta/Add" element={<TipoConductaForm />} />
        <Route path="/TipoConducta/:id" element={<TipoConductaForm />} />

        <Route path="/EstadoProcesoDiciplinario" element={<EstadoProcesoDiciplinarioLista />} />
        <Route path="/EstadoProcesoDiciplinario/Add" element={<EstadoProcesoDiciplinarioForm />} />
        <Route path="/EstadoProcesoDiciplinario/:id" element={<EstadoProcesoDiciplinarioForm />} />

        <Route path="/ResultadoEvaluacion" element={<ResultadoEvaluacionLista />} />
        <Route path="/ResultadoEvaluacion/Add" element={<ResultadoEvaluacionForm />} />
        <Route path="/ResultadoEvaluacion/:id" element={<ResultadoEvaluacionForm />} />

        <Route path="/TipoSujetoProcesal" element={<TipoSujetoProcesalLista />} />
        <Route path="/TipoSujetoProcesal/Add" element={<TipoSujetoProcesalForm />} />
        <Route path="/TipoSujetoProcesal/:id" element={<TipoSujetoProcesalForm />} />


        <Route path="/Localidad" element={<LocalidadLista />} />
        <Route path="/Localidad/Add" element={<LocalidadForm />} />
        <Route path="/Localidad/:id" element={<LocalidadForm />} />

        <Route path="/OrientacionSexual" element={<OrientacionSexualLista />} />
        <Route path="/OrientacionSexual/Add" element={<OrientacionSexualForm />} />
        <Route path="/OrientacionSexual/:id" element={<OrientacionSexualForm />} />

        <Route path="/OrigenRadicado" element={<OrigenRadicadoLista />} />
        <Route path="/OrigenRadicado/Add" element={<OrigenRadicadoForm />} />
        <Route path="/OrigenRadicado/:id" element={<OrigenRadicadoForm />} />

        <Route path="/Sexo" element={<SexoLista />} />
        <Route path="/Sexo/Add" element={<SexoForm />} />
        <Route path="/Sexo/:id" element={<SexoForm />} />

        <Route path="/TipoDerechoPeticion" element={<TipoDerechoPeticionLista />} />
        <Route path="/TipoDerechoPeticion/Add" element={<TipoDerechoPeticionForm />} />
        <Route path="/TipoDerechoPeticion/:id" element={<TipoDerechoPeticionForm />} />

        <Route path="/TipoExpediente" element={<TipoExpedienteLista />} />
        <Route path="/TipoExpediente/Add" element={<TipoExpedienteForm />} />
        <Route path="/TipoExpediente/:id" element={<TipoExpedienteForm />} />


        <Route path="/TipoQueja" element={<TipoQuejaLista />} />
        <Route path="/TipoQueja/Add" element={<TipoQuejaForm />} />
        <Route path="/TipoQueja/:id" element={<TipoQuejaForm />} />

        <Route path="/Ciudad" element={<CiudadLista />} />
        <Route path="/Ciudad/Add" element={<CiudadForm />} />
        <Route path="/Ciudad/:id" element={<CiudadForm />} />

        <Route path="/Fase" element={<FaseLista />} />
        <Route path="/Fase/Add" element={<FaseForm />} />
        <Route path="/Fase/:id" element={<FaseForm />} />
        <Route path="/FaseDetalle/:id" element={<FaseDetalle />} />

        <Route path="/Etapa" element={<EtapaLista />} />
        <Route path="/Etapa/Add" element={<EtapaForm />} />
        <Route path="/Etapa/:id" element={<EtapaForm />} />

        <Route path="/DocumentoCierreForm" element={<DocumentoCierreForm />} />
        <Route path="/GestorRespuestaForm" element={<GestorRespuestaForm />} />

        <Route path="/InfoRepartoAleatorio" element={<InfoRepartoAleatorio />} />
        <Route path="/InfoDetalleUsuario/:idUsuario" element={<InfoDetalleUsuario />} />
        <Route path="/InfoRepartoDependencia" element={<InfoRepartoDependencia />} />
        <Route path="/InfoDetalleDependencia/:idDependencia" element={<InfoDetalleDependencia />} />

        <Route path="/Transacciones" element={<ListaAccionesForm />} />
        <Route path="/EnviaraAlguienDeMiDependencia/" element={<EnviaraAlguienDeMiDependencia />} />
        <Route path="/EnviarAlJefeDeMiDependencia/" element={<EnviarAlJefeDeMiDependencia />} />
        <Route path="/EnviarAotraDependencia/" element={<EnviarAotraDependencia />} />
        <Route path="/EnviarAlAnteriorUsuario/" element={<EnviarAlAnteriorUsuario />} />
        <Route path="/EnviaraAlguienDeSecretariaComunDirigido/" element={<EnviaraAlguienDeSecretariaComunDirigido />} />
        <Route path="/EnviaraAlguienDeSecretariaComunAleatorio/" element={<EnviaraAlguienDeSecretariaComunAleatorio />} />

        <Route path="/ActuacionesAdministracion" element={<ActuacionesAdminLista />} />
        <Route path="/ActuacionesAdministracion/Add" element={<ActuacionesAdminForm />} />
        <Route path="/ActuacionesAdministracion/:id" element={<ActuacionesAdminForm />} />

        <Route path="/RequerimientoJuzgadoForm" element={<RequerimientoJuzgadoForm />} />
        <Route path="/InformeCierreSiriusForm" element={<InformeCierreSiriusForm />} />
        <Route path="/InformeCierreDocumentoForm" element={<InformeCierreDocumentoForm />} />
        <Route path="/RegistroSeguimientoForm" element={<RegistroSeguimientoForm />} />

        <Route path="/Buscador" element={<Buscador />} />
        <Route path="/BuscadorMigracion" element={<BuscadorMigracion />} />

        <Route path="/TipoConductaProcesoLista" element={<TipoConductaProcesoLista />} />
        <Route path="/TipoConductaProcesoForm" element={<TipoConductaProcesoForm />} />

        <Route path="/PreguntaImpedimentos" element={<PreguntaImpedimentos />} />

        <Route path="/LogConsultas" element={<LogConsultas />} />

        <Route path="/EvaluacionFasesLista" element={<EvaluacionFasesLista />} />
        <Route path="/EvaluacionFasesAdd" element={<EvaluacionFasesAdd />} />
        <Route path="/EvaluacionFasesLista/:id_tipo_expediente/:id_sub_tipo_expediente/:id_tipo_evaluacion" element={<EvaluacionFasesDetalle />} />


        <Route path="/Caratulas" element={<CaratulasForm />} />
        <Route path="/CaratulasAdminForm" element={<CaratulasAdminForm />} />
        <Route path="/CaratulasAdminForm/:id" element={<CaratulasAdminForm />} />
        <Route path="/CaratulasAdminLista" element={<CaratulasAdminLista />} />

        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/AgregarFirma" element={<AgregarFirma />} />
        <Route path="/DocumentosFirmadosOPendientesDeFirma" element={<DocumentosFirmadosOPendientesDeFirma />} />
        <Route path="/FirmaActuaciones" element={<FirmaActuaciones />} />

        <Route path="/TipoProceso" element={<TipoProcesoLista />} />
        <Route path="/TipoProceso/Add" element={<TipoProcesoForm />} />
        <Route path="/TipoProceso/:id" element={<TipoProcesoForm />} />

        <Route path="/TipoExpedienteMensajes" element={<TipoExpedienteMensajesLista />} />
        <Route path="/TipoExpedienteMensajes/Add" element={<TipoExpedienteMensajesForm />} />
        <Route path="/TipoExpedienteMensajes/:id" element={<TipoExpedienteMensajesForm />} />

        <Route path="/TipoUnidad" element={<TipoUnidadLista />} />
        <Route path="/TipoUnidad/Add" element={<TipoUnidadForm />} />
        <Route path="/TipoUnidad/:id" element={<TipoUnidadForm />} />

        <Route path="/ParametroCamposCaratula" element={<ParametroCamposCaratulaLista />} />
        <Route path="/ParametroCamposCaratula/Add" element={<ParametroCamposCaratulaForm />} />
        <Route path="/ParametroCamposCaratula/:id" element={<ParametroCamposCaratulaForm />} />

        <Route path="/TipoFirma" element={<TipoFirmaLista />} />
        <Route path="/TipoFirma/Add" element={<TipoFirmaForm />} />
        <Route path="/TipoFirma/:id" element={<TipoFirmaForm />} />

        <Route path="/SeleccionarDuenoProceso" element={<SeleccionarDuenoProceso />} />
        <Route path="/ActuacionesSigueImpedimentos" element={<ActuacionesSigueImpedimentos />} />

        <Route path="/semaforos" element={<SemaforosLista />} />
        <Route path="/semaforos/Add" element={<SemaforosForm />} />
        <Route path="/semaforos/:id" element={<SemaforosForm />} />

        <Route path="/SeleccionDeFechaParaSemaforo" element={<SeleccionDeFechaParaSemaforo />} />
        <Route path="/ListaSemaforos" element={<ListaSemaforos />} />

        <Route path="/ProcesoDisciplinarioMigracion/:radicado/:vigencia" element={<ProcesoDisciplinarioMigracion />} />
        <Route path="/CargarMigracionProcesoDisciplinario/:radicado/:vigencia" element={<CargarMigracionProcesoDisciplinario />} />
        <Route path="/CargarMigracionAntecedentes/:radicado/:vigencia/:item" element={<CargarMigracionAntecedentes />} />
        <Route path="/ListarMigracionAntecedentes/:radicado/:vigencia/" element={<ListarMigracionAntecedentes />} />
        <Route path="/CargarMigracionInteresado/:radicado/:vigencia/:item" element={<CargarDatosInteresado />} />
        <Route path="/ListarMigracionInteresados/:radicado/:vigencia" element={<ListarDatosInteresados />} />
        <Route path="/CargarMigracionEntidad/:radicado/:vigencia/:item" element={<CargarMigracionEntidad />} />
        <Route path="/ListarMigracionEntidades/:radicado/:vigencia" element={<ListarMigracionEntidades />} />
        <Route path="/CargarMigracionActuacion/:radicado/:vigencia/:item" element={<CargarMigracionActuacion />} />
        <Route path="/ListarMigracionActuaciones/:radicado/:vigencia" element={<ListarMigracionActuaciones />} />

        <Route path="/PortalLog" element={<PortalLogLista />} />

        <Route path="/PortalNotificaciones" element={<PortalNotificaciones />} />
        <Route path="/PortalNotificaciones/Add" element={<PortalNotificacionesForm />} />
        <Route path="/PortalNotificacionesCambiarEstadoForm/:idNotificacion" element={<PortalNotificacionesCambiarEstadoForm />} />

        <Route path="/PortalConfiguracionTipoInteresado" element={<PortalConfiguracionTipoInteresado />} />
        <Route path="/PortalConfiguracionTipoInteresado/Add" element={<PortalConfiguracionTipoInteresadoForm />} />
        <Route path="/PortalConfiguracionTipoInteresado/:id" element={<PortalConfiguracionTipoInteresadoForm />} />

        <Route path="/GrupoTrabajoSecretariaComun" element={<GrupoTrabajoSecretariaComun />} />
        <Route path="/GrupoTrabajoSecretariaComun/Add" element={<GrupoTrabajoSecretariaComunForm />} />
        <Route path="/GrupoTrabajoSecretariaComun/:id" element={<GrupoTrabajoSecretariaComunForm />} />

        <Route path="/AgregarSemaforo/Add" element={<AgregarSemaforo />} />
        <Route path="/AgregarSemaforo/:id" element={<AgregarSemaforo />} />

        <Route path="/Cargos" element={<CargosLista />} />
        <Route path="/Cargos/Add" element={<CargosForm />} />
        <Route path="/Cargos/:id" element={<CargosForm />} />

        <Route path="/ConsecutivoActuaciones" element={<ConsecutivoActuacionesLista />} />
        <Route path="/ConsecutivoActuaciones/Add" element={<ConsecutivoActuacionesForm />} />
        <Route path="/ConsecutivoActuaciones/:id" element={<ConsecutivoActuacionesForm />} />

        <Route path="/CambioFaseForm" element={<CambioFaseForm />} />
        
        <Route path="/AbrirProceso" element={<AbrirProceso />} />
        <Route path="/CambiarVigencia" element={<CambioVigenciaProcesoDisciplinario />} />

      </Routes>
    );
  }
}


export default RoutesPersoneria;
