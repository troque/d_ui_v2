import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { hasAccess } from '../components/Utils/Common';

class Navbar extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <nav id="sidebar" aria-label="Main Navigation">
                {/* Side Header */}
                <div className="bg-header-white">
                    <div className="content-header bg-white-10">
                        {/* Logo */}
                        <Link className="nav-main-link" to="/Inicio">
                            <img src={process.env.PUBLIC_URL + "/assets/images/logo_pdb_azul.png"} alt="Logo" height="50px" />
                        </Link>
                        {/* END Logo */}
                        <div>
                            <a className="d-lg-none text-primary ml-2" data-toggle="layout" data-action="sidebar_close">
                                <i className="fa fa-times-circle"></i>
                            </a>
                        </div>
                    </div>
                </div>


                <div>

                   
                    <li className="nav-main-item">

                        <Link className="nav-main-link" to="/Inicio">
                                <span className="nav-main-link-name">INICIO</span>
                        </Link>

    
                        <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                <span className="nav-main-link-name">SISTEMA DISCIPLINARIOS</span>
                        </Link>

                        <ul className="nav-main-submenu">
                            {(hasAccess('G_IniciarProceso', 'Gestionar')) ? (
                                <li className="nav-main-item">
                                    <Link className="nav-main-link" to="/ProcesoDisciplinario">
                                        <span className="nav-main-link-name">INICIAR PROCESO</span>
                                    </Link>
                                </li>) : null
                            }

                            {(hasAccess('MP_Semaforizacion', 'Consultar') || hasAccess('MP_Historial_Expediente', 'Consultar') || hasAccess('MP_RemitirProceso', 'Consultar') || hasAccess('MP_Caratula', 'Consultar') ||  hasAccess('MP_RamasProceso', 'Consultar')) ? (
                                <li className="nav-main-item">
                                    <Link className="nav-main-link" to="/MisPendientes">
                                        <span className="nav-main-link-name">MIS PENDIENTES</span>
                                    </Link>
                                </li>
                            ) : null}

                            {(hasAccess('Buscador', 'Consultar')) ? (
                                <li className="nav-main-item">
                                    <Link className="nav-main-link" to="/Buscador" state={{ from: "" }}>
                                        <span className="nav-main-link-name">BUSCADOR DE EXPEDIENTES</span>
                                    </Link>
                                </li>) : null}
                        </ul>
                    </li>


                    {(hasAccess('ADMIN_Perfiles', 'Consultar') || hasAccess('ADMIN_ProcesoDisciplinario', 'Consultar') || hasAccess('ADMIN_Actuaciones', 'Consultar') || hasAccess('ADMIN_Caratula', 'Consultar') ||hasAccess('ADMIN_TrasladoCasos', 'Gestionar') || hasAccess('ADMIN_InformeGeneral', 'Gestionar') || hasAccess('ADMIN_PortalWeb', 'Consultar') || hasAccess('ADMIN_Otros', 'Consultar') )? (

                        <li className="nav-main-item">
                            <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                <span className="nav-main-link-name">ADMINISTRACIÓN</span>
                            </Link>
                            <ul className="nav-main-submenu">

                            {(hasAccess('ADMIN_Perfiles', 'Consultar')) ? (
                                <li className="nav-main-item">
                                    <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                        <span className="nav-main-link-name">PERFILES</span>
                                    </Link>
                                    <ul className="nav-main-submenu">
                                        
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/Rol">
                                                    <span className="nav-main-link-name">ROLES Y PERMISOS</span>
                                                </Link>
                                            </li>
                                        
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/Usuario">
                                                    <span className="nav-main-link-name">USUARIOS</span>
                                                </Link>
                                            </li>
                                    </ul>
                                </li>
                                ) : null}

                                {(hasAccess('ADMIN_ProcesoDisciplinario', 'Consultar')) ? (

                                <li className="nav-main-item">
                                    <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                        <span className="nav-main-link-name">PROCESO DISCIPLINARIO</span>
                                    </Link>
                                    <ul className="nav-main-submenu">

                                        <li className="nav-main-item">
                                            <Link className="nav-main-link" to="/DiasNoLaborables">
                                                <span className="nav-main-link-name">CALENDARIO</span>
                                            </Link>
                                        </li>

                                        <li className="nav-main-item">
                                            <Link className="nav-main-link" to="/CambiarVigencia">
                                                <span className="nav-main-link-name">CAMBIAR DE VIGENCIA DE UN PROCESO</span>
                                            </Link>
                                        </li>
                                    
                                        <li className="nav-main-item">
                                            <Link className="nav-main-link" to="/Dependencia">
                                                <span className="nav-main-link-name">DEPENDENCIAS</span>
                                            </Link>
                                        </li>

                                        <li className="nav-main-item">
                                            <Link className="nav-main-link" to="/Etapa">
                                                <span className="nav-main-link-name">ETAPAS</span>
                                            </Link>
                                        </li>

                                        <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/ResultadoEvaluacion">
                                                    <span className="nav-main-link-name">EVALUACIÓN</span>
                                                </Link>
                                            </li>

                                        <li className="nav-main-item">
                                            <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                                <span className="nav-main-link-name">EXPEDIENTES</span>
                                            </Link>
                                            <ul className="nav-main-submenu">

                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link" to="/TipoExpediente">
                                                        <span className="nav-main-link-name">TIPOS DE EXPEDIENTES</span>
                                                    </Link>
                                                </li>

                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link" to="/TipoDerechoPeticion">
                                                        <span className="nav-main-link-name">TIPOS DE DERECHO DE PETICIÓN</span>
                                                    </Link>
                                                </li>

                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link" to="/TipoExpedienteMensajes">
                                                        <span className="nav-main-link-name">MENSAJES</span>
                                                    </Link>
                                                </li>

                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link" to="/TipoQueja">
                                                        <span className="nav-main-link-name">TIPOS DE QUEJA</span>
                                                    </Link>
                                                </li>


                                            </ul>
                                        </li>

                                        <li className="nav-main-item">
                                            <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                                <span className="nav-main-link-name">FASES</span>
                                            </Link>
                                            <ul className="nav-main-submenu">

                                            
                                                    <li className="nav-main-item">
                                                        <Link className="nav-main-link" to="/Fase">
                                                            <span className="nav-main-link-name">EDICIÓN DE NOMBRES</span>
                                                        </Link>
                                                    </li>
                                            

                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                                        <span className="nav-main-link-name">FASES ETAPA EVALUACIÓN PQR</span>
                                                    </Link>
                                                    <ul className="nav-main-submenu">

                                                    
                                                            <li className="nav-main-item">
                                                                <Link className="nav-main-link" to="/EvaluacionFasesLista">
                                                                    <span className="nav-main-link-name">CONFIGURACIÓN DE FASES</span>
                                                                </Link>
                                                            </li>
                                                    

                                                            <li className="nav-main-item">
                                                                <Link className="nav-main-link" to="/FuncionalidadGestorRespuesta">
                                                                    <span className="nav-main-link-name">FASE GESTOR RESPUESTA ETAPA EVALUACIÓN</span>
                                                                </Link>
                                                            </li>
                                                        
                                                    </ul>
                                                </li>

                                            </ul>
                                        </li>

                                        <li className="nav-main-item">
                                            <Link className="nav-main-link" to="/OrigenRadicado">
                                                <span className="nav-main-link-name">ORIGEN DEL RADICADO</span>
                                            </Link>
                                        </li>
                                    
                                        <li className="nav-main-item">
                                            <Link className="nav-main-link" to="/TipoProceso">
                                                <span className="nav-main-link-name">TIPOS DEL PROCESO</span>
                                            </Link>
                                        </li>
                                    
                                        <li className="nav-main-item">
                                            <Link className="nav-main-link" to="/Vigencia">
                                                <span className="nav-main-link-name">VIGENCIAS</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                ) : null}


                                {(hasAccess('ADMIN_Actuaciones', 'Consultar')) ? (
                                <li className="nav-main-item">
                                    <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                        <span className="nav-main-link-name">ACTUACIONES</span>
                                    </Link>
                                    <ul className="nav-main-submenu">

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/ActuacionesAdministracion">
                                                    <span className="nav-main-link-name">GESTIÓN DE ACTUACIONES</span>
                                                </Link>
                                            </li>

                                
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/ParametroCampos">
                                                    <span className="nav-main-link-name">GESTIÓN DE PARAMÉTRICAS</span>
                                                </Link>
                                            </li>

                                    
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/TipoFirma">
                                                    <span className="nav-main-link-name">TIPOS DE FIRMA</span>
                                                </Link>
                                            </li>

                                    
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/semaforos">
                                                    <span className="nav-main-link-name">SEMAFORIZACIÓN</span>
                                                </Link>
                                            </li>

                                        
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/GrupoTrabajoSecretariaComun">
                                                    <span className="nav-main-link-name">GRUPOS DE TRABAJO DE SECRETARÍA COMÚN</span>
                                                </Link>
                                            </li>

                                    
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/ConsecutivoActuaciones">
                                                    <span className="nav-main-link-name">CONFIGURACIÓN DE CONSECUTIVO DE ACTUACIONES</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/CambioFaseForm">
                                                    <span className="nav-main-link-name">CAMBIAR ETAPA</span>
                                                </Link>
                                            </li>
                                    </ul>
                                </li>
                                ) : null}

                                {(hasAccess('ADMIN_Caratula', 'Consultar')) ? (       
                                    <li className="nav-main-item">
                                        <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                            <span className="nav-main-link-name">CARÁTULA</span>
                                        </Link>
                                        <ul className="nav-main-submenu">
                                            
                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link" to="/ParametroCamposCaratula">
                                                        <span className="nav-main-link-name">PARÁMETRICAS</span>
                                                    </Link>
                                                </li>
                                            
                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link" to="/CaratulasAdminLista">
                                                        <span className="nav-main-link-name">PLANTILLA</span>
                                                    </Link>
                                                </li>
                                        
                                                <li className="nav-main-item">
                                                    <Link className="nav-main-link" to="/TipoUnidad">
                                                        <span className="nav-main-link-name">TIPOS DE UNIDAD</span>
                                                    </Link>
                                                </li>
                                        </ul>
                                    </li>
                                ) : null}

                                {(hasAccess('ADMIN_TrasladoCasos', 'Gestionar')) ? (
                                    <li className="nav-main-item">
                                        <Link className="nav-main-link" to="/TrasladoProcesos">
                                            <span className="nav-main-link-name">TRASLADO DE CASOS</span>
                                        </Link>
                                    </li>) : null}

                                {(hasAccess('ADMIN_AbrirProceso', 'Gestionar')) ? (
                                    <li className="nav-main-item">
                                        <Link className="nav-main-link" to="/AbrirProceso">
                                            <span className="nav-main-link-name">ABRIR UN PROCESO</span>
                                        </Link>
                                    </li>) : null}

                                {(hasAccess('ADMIN_InformeGeneral', 'Gestionar')) ? (
                                    <li className="nav-main-item">
                                        <Link className="nav-main-link" to="/InfoRepartoAleatorio">
                                            <span className="nav-main-link-name">INFORME GENERAL</span>
                                        </Link>
                                    </li>) : null}

                                {(hasAccess('ADMIN_PortalWeb', 'Consultar')) ? (
                                    <li className="nav-main-item">
                                        <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                            <span className="nav-main-link-name">PORTAL WEB</span>
                                        </Link>
                                        <ul className="nav-main-submenu">

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/PortalConfiguracionTipoInteresado">
                                                    <span className="nav-main-link-name">CONFIGURACIÓN DE INTERESADOS</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/PortalLog">
                                                    <span className="nav-main-link-name">LOG DE USUARIO</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/PortalNotificaciones">
                                                    <span className="nav-main-link-name">NOTIFICACIONES</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>) : null}

                                {(hasAccess('ADMIN_Otros', 'Consultar')) ? (  
                                    <li className="nav-main-item">
                                        <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                            <span className="nav-main-link-name">OTROS</span>
                                        </Link>
                                        <ul className="nav-main-submenu">

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                                    <span className="nav-main-link-name">GÉNERO / SEXO</span>
                                                </Link>
                                                <ul className="nav-main-submenu">
                                                
                                                        <li className="nav-main-item">
                                                            <Link className="nav-main-link" to="/Genero">
                                                                <span className="nav-main-link-name">GÉNERO</span>
                                                            </Link>
                                                        </li>
                                                    
                                                        <li className="nav-main-item">
                                                            <Link className="nav-main-link" to="/OrientacionSexual">
                                                                <span className="nav-main-link-name">ORIENTACIÓN SEXUAL</span>
                                                            </Link>
                                                        </li>
                                                
                                                        <li className="nav-main-item">
                                                            <Link className="nav-main-link" to="/Sexo">
                                                                <span className="nav-main-link-name">SEXO</span>
                                                            </Link>
                                                        </li> 
                                                </ul>
                                            </li>

                                        
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/Cargos">
                                                    <span className="nav-main-link-name">NIVEL JERÁRQUICO</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/EstadoProcesoDiciplinario">
                                                    <span className="nav-main-link-name">ESTADO DE PROCESOS DISCIPLINARIOS</span>
                                                </Link>
                                            </li>

                                        
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/Formatos">
                                                    <span className="nav-main-link-name">EXTENSIONES DE DOCUMENTOS</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                                    <span className="nav-main-link-name">LOCALIZACIÓN</span>
                                                </Link>
                                                <ul className="nav-main-submenu">
                                                
                                                    <li className="nav-main-item">
                                                        <Link className="nav-main-link" to="/Ciudad">
                                                            <span className="nav-main-link-name">CIUDADES</span>
                                                        </Link>
                                                    </li>
                                                
                                                    <li className="nav-main-item">
                                                        <Link className="nav-main-link" to="/Departamento">
                                                            <span className="nav-main-link-name">DEPARTAMENTO</span>
                                                        </Link>
                                                    </li>
                                            
                                                    <li className="nav-main-item">
                                                        <Link className="nav-main-link" to="/Localidad">
                                                            <span className="nav-main-link-name">LOCALIDADES</span>
                                                        </Link>
                                                    </li> 
                                                </ul>
                                            </li>

                                            
                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/LogConsultas">
                                                    <span className="nav-main-link-name">LOG DE CONSULTAS</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/Parametro">
                                                    <span className="nav-main-link-name">PARÁMETROS DEL SISTEMA</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/TipoConducta">
                                                    <span className="nav-main-link-name">TIPOS DE CONDUCTA</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/TipoDocumento">
                                                    <span className="nav-main-link-name">TIPOS DE DOCUMENTO DE IDENTIFICACIÓN</span>
                                                </Link>
                                            </li>

                                            <li className="nav-main-item">
                                                <Link className="nav-main-link" to="/TipoSujetoProcesal">
                                                    <span className="nav-main-link-name">TIPOS DE SUJETO PROCESAL</span>
                                                </Link>
                                            </li>

                                                
                                        </ul>
                                    </li>) : null}                           
                            </ul>
                        </li> ) : null
                    }
                </div>
            </nav>
        )
    }

}

export default Navbar;