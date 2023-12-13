import React, { Component, useState } from 'react';
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
                        <a>
                            <img src={process.env.PUBLIC_URL + "/assets/images/logo_pdb_azul.png"} alt="Logo" height="50px" />
                        </a>
                        {/* END Logo */}
                        <div>
                            <a className="d-lg-none text-primary ml-2" data-toggle="layout" data-action="sidebar_close">
                                <i className="fa fa-times-circle"></i>
                            </a>
                        </div>
                    </div>
                </div>
                {/* END Side Header */}

                {/* Side Navigation */}
                <div className="content-side content-side-full">
                    <ul className="nav-main">
                        <li className="nav-main-item">
                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" >
                                <span className="nav-main-link-name">Sistemas Disciplinarios</span>
                            </a>
                            <ul className="nav-main-submenu">
                                <>
                                    {
                                        (hasAccess('G_IniciarProceso', 'Gestionar')) ? (
                                            <li className="nav-main-item li-border-bottom">
                                                <Link className="nav-main-link" to="/ProcesoDisciplinario">
                                                    <span className="nav-main-link-name">Inicio Proceso Disciplinario </span>
                                                </Link>
                                            </li>
                                        ) : null
                                    }
                                </>
                                <>
                                    {
                                        (hasAccess('MP_MisPendientes', 'Consultar')) ? (
                                            <>
                                                <li className="nav-main-item li-border-bottom">
                                                    <Link className="nav-main-link" to="/MisPendientes">
                                                        <span className="nav-main-link-name">Mis Pendientes</span>
                                                    </Link>
                                                </li>


                                                <li className="nav-main-item li-border-bottom">
                                                    <Link className="nav-main-link" to="/Buscador" state={{ from: "" }}>
                                                        <span className="nav-main-link-name">Buscador Expediente</span>
                                                    </Link>
                                                </li>

                                            </>

                                        ) : null
                                    }
                                </>

                            </ul>
                        </li>

                        {
                            (hasAccess('Administrador') ? (

                                <li className="nav-main-item">
                                    <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" >
                                        <span className="nav-main-link-name">Administración</span>
                                    </a>

                                    <ul className="nav-main-submenu">
                                        <li className="nav-main-item li-border-bottom">

                                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" >
                                                <span className="nav-main-link-name">Perfiles</span>
                                            </a>

                                            <ul className="nav-main-submenu">
                                                <li className="nav-main-item">

                                                    {
                                                        (hasAccess('Administrador', 'RolesYPermisos')) ? (
                                                            <Link className="nav-main-link" to="/Rol">
                                                                <span className="nav-main-link-name">Roles y Permisos</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Usuarios')) ? (
                                                            <Link className="nav-main-link" to="/Usuario">
                                                                <span className="nav-main-link-name">Usuarios</span>
                                                            </Link>
                                                        ) : null
                                                    }


                                                </li>
                                            </ul>

                                        </li>
                                    </ul>


                                    <ul className="nav-main-submenu">
                                        <li className="nav-main-item li-border-bottom">

                                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" >
                                                <span className="nav-main-link-name">Localización</span>
                                            </a>

                                            <ul className="nav-main-submenu">
                                                <li className="nav-main-item li-border-bottom">

                                                    {
                                                        (hasAccess('Administrador', 'Ciudades')) ? (
                                                            <Link className="nav-main-link" to="/Ciudad">
                                                                <span className="nav-main-link-name">Ciudades</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Departamentos')) ? (
                                                            <Link className="nav-main-link" to="/Departamento">
                                                                <span className="nav-main-link-name">Departamentos</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Localidad')) ? (
                                                            <Link className="nav-main-link" to="/Localidad">
                                                                <span className="nav-main-link-name">Localidades</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                </li>
                                            </ul>

                                        </li>
                                    </ul>


                                    <ul className="nav-main-submenu">
                                        <li className="nav-main-item li-border-bottom">


                                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" >
                                                <span className="nav-main-link-name">Maestras</span>
                                            </a>

                                            <ul className="nav-main-submenu">
                                                <li className="nav-main-item li-border-bottom">

                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/Cargos">
                                                                <span className="nav-main-link-name">Cargos</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'ConsecutivoDesglose')) ? (
                                                            <Link className="nav-main-link" to="/ConsecutivoDesglose">
                                                                <span className="nav-main-link-name">Consecutivos desglose</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'DiasNoLaborables')) ? (
                                                            <Link className="nav-main-link" to="/DiasNoLaborables">
                                                                <span className="nav-main-link-name">Días No Laborables</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {/*
                                                        (hasAccess('Administrador', 'EntidadesPermitidasInteresado')) ? (
                                                            <Link className="nav-main-link" to="/EntidadesInteresadoLista">
                                                                <span className="nav-main-link-name">Entidades Permitidas Comunicación Interesado</span>
                                                            </Link>
                                                        ) : null

                                                        */}

                                                    {
                                                        (hasAccess('Administrador', 'Etapas')) ? (
                                                            <Link className="nav-main-link" to="/Etapa">
                                                                <span className="nav-main-link-name">Etapas</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Fases')) ? (
                                                            <Link className="nav-main-link" to="/Fase">
                                                                <span className="nav-main-link-name">Fases</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Formatos')) ? (
                                                            <Link className="nav-main-link" to="/Formatos">
                                                                <span className="nav-main-link-name">Formatos</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Genero')) ? (
                                                            <Link className="nav-main-link" to="/Genero">
                                                                <span className="nav-main-link-name">Géneros</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'GrupoTrabajoSecretariaComun')) ? (
                                                            <Link className="nav-main-link" to="/GrupoTrabajoSecretariaComun">
                                                                <span className="nav-main-link-name">Grupos de trabajo de secretaria común</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/TipoExpedienteMensajes">
                                                                <span className="nav-main-link-name">Mensajes Tipo Expediente</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'OrigenRadicado')) ? (
                                                            <Link className="nav-main-link" to="/OrigenRadicado">
                                                                <span className="nav-main-link-name">Orígenes radicado</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'OrientacionSexual')) ? (
                                                            <Link className="nav-main-link" to="/OrientacionSexual">
                                                                <span className="nav-main-link-name">Orientaciones Sexuales</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'ParametroCampos')) ? (
                                                            <Link className="nav-main-link" to="/ParametroCampos">
                                                                <span className="nav-main-link-name">Parámetro Campos Actuaciones</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'ParametroCamposCaratula')) ? (
                                                            <Link className="nav-main-link" to="/ParametroCamposCaratula">
                                                                <span className="nav-main-link-name">Parámetro Campos Carátulas</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'ParametrosSistema')) ? (
                                                            <Link className="nav-main-link" to="/Parametro">
                                                                <span className="nav-main-link-name">Parámetros Sistema</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/ResultadoEvaluacion">
                                                                <span className="nav-main-link-name">Resultado de Evaluación</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Sexo')) ? (
                                                            <Link className="nav-main-link" to="/Sexo">
                                                                <span className="nav-main-link-name">Sexo</span>
                                                            </Link>
                                                        ) : null
                                                    }


                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/TipoConducta">
                                                                <span className="nav-main-link-name">Tipos de Conducta</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'TipoDerechoPeticion')) ? (
                                                            <Link className="nav-main-link" to="/TipoDerechoPeticion">
                                                                <span className="nav-main-link-name">Tipos derecho petición</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'TipoDocumento')) ? (
                                                            <Link className="nav-main-link" to="/TipoDocumento">
                                                                <span className="nav-main-link-name">Tipos de documentos</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/TipoFirma">
                                                                <span className="nav-main-link-name">Tipos de firma</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/TipoProceso">
                                                                <span className="nav-main-link-name">Tipos de Proceso</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/TipoSujetoProcesal">
                                                                <span className="nav-main-link-name">Tipo de Sujeto Procesal </span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', '#')) ? (
                                                            <Link className="nav-main-link" to="/TipoUnidad">
                                                                <span className="nav-main-link-name">Tipos de Unidad</span>
                                                            </Link>
                                                        ) : null

                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Vigencias')) ? (
                                                            <Link className="nav-main-link" to="/Vigencia">
                                                                <span className="nav-main-link-name">Vigencias</span>
                                                            </Link>
                                                        ) : null
                                                    }
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <ul className="nav-main-submenu">
                                        <li className="nav-main-item li-border-bottom">

                                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" >
                                                <span className="nav-main-link-name">Configuración</span>
                                            </a>

                                            <ul className="nav-main-submenu">
                                                <li className="nav-main-item">

                                                    {
                                                        (hasAccess('Administrador', 'CaratulasAdministracion')) ? (
                                                            <Link className="nav-main-link" to="/CaratulasAdminLista">
                                                                <span className="nav-main-link-name">Carátulas</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'ActuacionesAdministracion')) ? (
                                                            <Link className="nav-main-link" to="/ActuacionesAdministracion">
                                                                <span className="nav-main-link-name">Actuaciones</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Dependencias')) ? (
                                                            <Link className="nav-main-link" to="/Dependencia">
                                                                <span className="nav-main-link-name">Dependencias</span>
                                                            </Link>
                                                        ) : null
                                                    }


                                                    {
                                                        <Link className="nav-main-link" to="/EvaluacionFasesLista">
                                                            <span className="nav-main-link-name">Evaluación</span>
                                                        </Link>
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'TipoQueja')) ? (
                                                            <Link className="nav-main-link" to="/FuncionalidadGestorRespuesta">
                                                                <span className="nav-main-link-name">Gestor Respuesta - Lista de roles</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        <Link className="nav-main-link" to="/PortalConfiguracionTipoInteresado">
                                                            <span className="nav-main-link-name">Portal Web - Configuracion Tipo Interesado</span>
                                                        </Link>
                                                    }

                                                    {
                                                        <Link className="nav-main-link" to="/PortalLog">
                                                            <span className="nav-main-link-name">Portal Web - Log</span>
                                                        </Link>
                                                    }

                                                    {
                                                        <Link className="nav-main-link" to="/PortalNotificaciones">
                                                            <span className="nav-main-link-name">Portal Web - Notificaciones</span>
                                                        </Link>
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Reasignacion')) ? (
                                                            <Link className="nav-main-link" to="/TrasladoProcesos">
                                                                <span className="nav-main-link-name">Reasignación de casos</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                    {
                                                        (hasAccess('Administrador', 'Semaforos')) ? (
                                                            <Link className="nav-main-link" to="/semaforos">
                                                                <span className="nav-main-link-name">Semáforos</span>
                                                            </Link>
                                                        ) : null
                                                    }

                                                </li>
                                            </ul>

                                        </li>
                                    </ul>


                                    <ul className="nav-main-submenu">
                                        <li className="nav-main-item li-border-bottom">

                                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" >
                                                <span className="nav-main-link-name">Informes</span>
                                            </a>

                                            <ul className="nav-main-submenu">
                                                <li className="nav-main-item">

                                                    {/*
                                                        (hasAccess('Administrador', 'LogConsultas')) ? (
                                                            <Link className="nav-main-link" to="/LogConsultas">
                                                                <span className="nav-main-link-name">Log Consultas</span>
                                                            </Link>
                                                        ) : null
                                                        */}

                                                    {

                                                        <Link className="nav-main-link" to="/InfoRepartoAleatorio">
                                                            <span className="nav-main-link-name">Reparto de casos</span>
                                                        </Link>


                                                    }

                                                </li>
                                            </ul>

                                        </li>
                                    </ul>

                                </li>
                            ) : null)
                        }
                    </ul>
                </div>
                {/* END Side Navigation */}


                <div>
                        <li className="nav-main-item">
                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                <i className="nav-main-link-icon si si-settings"></i>
                                <span className="nav-main-link-name">SISTEMA DISCIPLINARIOS</span>
                            </a>
                            <ul className="nav-main-submenu">
                                <li className="nav-main-item">
                                    <a className="nav-main-link" href="#">
                                        <i className="nav-main-link-icon si si-drawer"></i>
                                        <span className="nav-main-link-name">INICIAR PROCESO</span>
                                    </a>
                                </li>
                                <li className="nav-main-item">
                                    <a className="nav-main-link" href="#">
                                        <i className="nav-main-link-icon si si-fire"></i>
                                        <span className="nav-main-link-name">MIS PENDIENTES</span>
                                    </a>
                                </li>
                                <li className="nav-main-item">
                                    <a className="nav-main-link" href="#">
                                        <i className="nav-main-link-icon si si-graph"></i>
                                        <span className="nav-main-link-name">BUSCADOR DE EXPEDIENTES</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-main-item">
                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                <i className="nav-main-link-icon si si-settings"></i>
                                <span className="nav-main-link-name">ADMINISTRACIÓN</span>
                            </a>
                            <ul className="nav-main-submenu">
                                
                                <li className="nav-main-item">
                                    <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                        <span className="nav-main-link-name">PERFILES</span>
                                        <span className="nav-main-link-badge badge badge-pill badge-primary">3</span>
                                    </a>
                                    <ul className="nav-main-submenu">
                                        <li className="nav-main-item">
                                            <a className="nav-main-link" href="#">
                                                <i className="nav-main-link-icon si si-tag"></i>
                                                <span className="nav-main-link-name">ROLES Y PERMISOS</span>
                                                <span className="nav-main-link-badge badge badge-pill badge-info">2</span>
                                            </a>
                                        </li>
                                        <li className="nav-main-item">
                                            <a className="nav-main-link" href="#">
                                                <i className="nav-main-link-icon si si-pie-chart"></i>
                                                <span className="nav-main-link-name">USUARIOS</span>
                                                <span className="nav-main-link-badge badge badge-pill badge-danger">2</span>
                                            </a>
                                        </li>                                        
                                    </ul>
                                </li>

                                <li className="nav-main-item">
                                    <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                        <span className="nav-main-link-name">TABLAS MAESTRAS</span>
                                        <span className="nav-main-link-badge badge badge-pill badge-primary">3</span>
                                    </a>
                                    <ul className="nav-main-submenu">

                                    <li className="nav-main-item">
                                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                                <span className="nav-main-link-name">CARÁTULA</span>
                                            </a>
                                            <ul className="nav-main-submenu">
                                                <li className="nav-main-item">
                                                    <a className="nav-main-link" href="#">
                                                        <i className="nav-main-link-icon si si-map"></i>
                                                        <span className="nav-main-link-name">CIUDADES</span>
                                                    </a>
                                                </li>
                                                <li className="nav-main-item">
                                                    <a className="nav-main-link" href="#">
                                                        <i className="nav-main-link-icon si si-cup"></i>
                                                        <span className="nav-main-link-name">DEPARTAMENTOS</span>
                                                    </a>
                                                </li>
                                                <li className="nav-main-item">
                                                    <a className="nav-main-link" href="#">
                                                        <i className="nav-main-link-icon si si-user-female"></i>
                                                        <span className="nav-main-link-name">LOCALIDADES</span>
                                                    </a>
                                                </li>

                                            </ul>
                                        </li>

                                        <li className="nav-main-item">
                                            <a className="nav-main-link nav-main-link-submenu" data-toggle="submenu" aria-haspopup="true" aria-expanded="false" href="#">
                                                <span className="nav-main-link-name">LOCALIZACIÓN</span>
                                            </a>
                                            <ul className="nav-main-submenu">
                                                {(hasAccess('Administrador', 'Ciudades')) ? (
                                                    <li className="nav-main-item">
                                                        <Link className="nav-main-link" to="/Ciudad">                                                           
                                                            <span className="nav-main-link-name">CIUDADES</span>
                                                        </Link>
                                                    </li>
                                                 ) : null
                                                }
                                                {(hasAccess('Administrador', 'Departamentos')) ? (
                                                    <li className="nav-main-item">
                                                        <Link className="nav-main-link" to="/Departamento">
                                                            <span className="nav-main-link-name">DEPARTAMENTOS</span>
                                                        </Link>
                                                    </li>
                                                    ) : null
                                                }
                                                {(hasAccess('Administrador', 'Localidad')) ? (
                                                    <li className="nav-main-item">
                                                        <Link className="nav-main-link" to="/Localidad">
                                                            <span className="nav-main-link-name">LOCALIDADES</span>
                                                        </Link>
                                                    </li>
                                                    ) : null
                                                }

                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </div>    
            </nav>
        )
    }

}

export default Navbar;