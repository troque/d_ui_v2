import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { hasAccess } from '../../Utils/Common';
import Spinner from '../../Utils/Spinner';
import GenericApi from '../../Api/Services/GenericApi';

function ListaAccionesForm() {
    const location = useLocation();
    const { from, selected_id_etapa, id_actuacion } = location.state;

    let idActu = id_actuacion != null ? id_actuacion : null;

    const [getTextoTransaccion1, setTextoTransaccion1] = useState("");
    const [getTextoTransaccion2, setTextoTransaccion2] = useState("");
    const [getTextoTransaccion3, setTextoTransaccion3] = useState("");
    const [getTextoTransaccion4, setTextoTransaccion4] = useState("");
    const [getTextoTransaccion5, setTextoTransaccion5] = useState("");
    const [getTextoTransaccion6, setTextoTransaccion6] = useState("");
    const [getTextoTransaccion7, setTextoTransaccion7] = useState("");
    const [getNombreProceso, setNombreProceso] = useState('');
    const [getRtaJefe, setRtaJefe] = useState(false);

    //Funcion principal
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            if (idActu != null) {
                datosTransacciones(idActu);
            }
            nombreProceso();
        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    from.nombreProcesoTransacciones = datos.data.attributes.nombre;
                    jefeDependencia();
                }
            }
        )
    }

    // Se consulta si el usuario que se encuentra en sesión es jefe dependencia
    const jefeDependencia = () => {

        const data = {
            "data": {
                "type": "usuario",
                "attributes": {
                    "": ""
                }
            }
        }
        GenericApi.getByDataGeneric("usuario/get-jefe-dependencia", data).then(
            datos => {
                // console.log(datos);
                if (!datos.error) {
                    setRtaJefe(true);
                } else {
                    setRtaJefe(false);
                }
                window.showSpinner(false);
            }
        )
    }

    const datosTransacciones = (id) => {
        GenericApi.getGeneric('mas_actuaciones/' + id).then(
            datos => {
                if (!datos.error) {
                    setTextoTransaccion1(datos.data.attributes.texto_dejar_en_mis_pendientes);
                    setTextoTransaccion2(datos.data.attributes.texto_enviar_a_alguien_de_mi_dependencia);
                    setTextoTransaccion3(datos.data.attributes.texto_enviar_a_jefe_de_la_dependencia);
                    setTextoTransaccion4(datos.data.attributes.texto_enviar_a_otra_dependencia);
                    setTextoTransaccion5(datos.data.attributes.texto_regresar_proceso_al_ultimo_usuario);
                    setTextoTransaccion6(datos.data.attributes.texto_enviar_a_alguien_de_secretaria_comun_aleatorio);
                    setTextoTransaccion7(datos.data.attributes.texto_enviar_a_alguien_de_secretaria_comun_dirigido);
                }
                else {
                    // console.log("Error en la consulta de la los datos de las transacciones");
                }

            }
        )
    }

    function downloadBase64FileManual(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    return (

        <>
            {<Spinner />}

            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ActuacionesLista/`} state={{ from: from, selected_id_etapa: selected_id_etapa }}><small>Actuaciones</small></Link></li>
                        <li className="breadcrumb-item"> <small>Transacciones</small></li>
                    </ol>
                </nav>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">{getNombreProceso.toUpperCase()} :: <strong>TRANSACCIONES</strong></h3>
                </div>
                <div className="block-content row">
                    <table className="table table-striped table-borderless table-vcenter">
                        <thead className="thead-light">
                            <tr>
                                <th colSpan="2">
                                    {/* {idActu != null ? (
                                        "En el siguiente boton puedes descargar una guia :"
                                    ) : null}
                                    {idActu != null ? (
                                        <button type='button' title='Descargar documento' className='btn btn-rounded btn-primary ml-3' onClick={() => handleClicArchivoManual()}>
                                            Descargar Manual
                                        </button>
                                    ) : null} */}
                                    <div className="text-muted mt-2 mb-1">
                                        <b>¿QUÉ TRANSACCIÓN DESEA REALIZAR CON EL PROCESO CON RADICADO {from.radicado} - {from.vigencia}?</b>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {/* {(hasAccess('EnviarAMisPendientes', 'Gestionar')) ? ( */}
                            <tr>
                                <td className="text-center">
                                    <i className="fa fa-check text-success fa-2x"></i>
                                </td>
                                <td>
                                    <Link to={'/MisPendientes'} className="font-size-h5 font-w600">TRANSFERIR A MI BANDEJA DE PENDIENTES</Link>
                                    <div className="text-muted mt-2 mb-1">{getTextoTransaccion1 != null ? getTextoTransaccion1.toUpperCase() : null}</div>
                                </td>
                            </tr>
                             {/* ) : null} */}
                            {(hasAccess('EnviarUsuarioDependencia', 'Gestionar')) ? (
                                <tr>
                                    <td className="text-center">
                                        <i className="fa fa-user text-success fa-2x"></i>
                                    </td>
                                    <td>
                                        <Link to={'/EnviaraAlguienDeMiDependencia'} state={{ from: from, selected_id_etapa: selected_id_etapa }} className="font-size-h5 font-w600">
                                            TRANSFERIR EL PROCESO A UN USUARIO DE MI DEPENDENCIA
                                        </Link>
                                        <div className="text-muted mt-2 mb-1">{getTextoTransaccion2 != null ? getTextoTransaccion2.toUpperCase() : null}</div>
                                    </td>
                                </tr>
                            ) : null}
                            {(hasAccess('EnviarAJefe', 'Gestionar')) ? (
                                <tr>
                                    <td className="text-center">
                                        <i className="fa fa-check-double text-success fa-2x"></i>
                                    </td>
                                    <td>
                                        <Link to={`/EnviarAlJefeDeMiDependencia`} state={{ from: from, selected_id_etapa: selected_id_etapa }} className="font-size-h5 font-w600">
                                            TRASFERIR EL PROCESO AL JEFE DE MI DEPENDENCIA
                                        </Link>
                                        <div className="text-muted mt-2 mb-1">{getTextoTransaccion3 != null ? getTextoTransaccion3.toUpperCase() : null}</div>
                                    </td>
                                </tr>
                            ) : null}
                            {(hasAccess('EnviarOtraDependencia', 'Gestionar')) ? (
                                <tr>
                                    <td className="text-center">
                                        <i className="fa fa-paper-plane text-success fa-2x"></i>
                                    </td>
                                    <td>
                                        <Link to={`/EnviarAotraDependencia`} state={{ from: from, selected_id_etapa: selected_id_etapa }} className="font-size-h5 font-w600">
                                            TRANSFERIR EL PROCESO AL JEFE DE OTRA DEPENDENCIA
                                        </Link>
                                        <div className="text-muted mt-2 mb-1">{getTextoTransaccion4 != null ? getTextoTransaccion4.toUpperCase() : null}</div>
                                    </td>
                                </tr>
                            ) : null}
                            {(hasAccess('RegresarUltimoUsuario', 'Gestionar')) ? (
                                <tr>
                                    <td className="text-center">
                                        <i className="fa fa-undo-alt text-success fa-2x"></i>
                                    </td>
                                    <td>
                                        <Link to={'/EnviarAlAnteriorUsuario'} state={{ from: from, selected_id_etapa: selected_id_etapa }} className="font-size-h5 font-w600">
                                            TRANSFERIR EL PROCESO AL ÚLTIMO USUARIO QUE LA GESTIONÓ
                                        </Link>
                                        <div className="text-muted mt-2 mb-1">{getTextoTransaccion5 != null ? getTextoTransaccion5.toUpperCase() : null}</div>
                                    </td>
                                </tr>
                            ) : null}
                            {(hasAccess('EnviarDirigidoSecretariaComun', 'Gestionar')) ? (
                                <tr>
                                    <td className="text-center">
                                        <i className="fa fa-arrow-right text-success fa-2x"></i>
                                    </td>
                                    <td>
                                        <Link to={'/EnviaraAlguienDeSecretariaComunDirigido'} state={{ from: from, selected_id_etapa: selected_id_etapa }} className="font-size-h5 font-w600">
                                            TRANSFERIR EL PROCESO A UN USUARIO ESPECÍFICO DE MI DEPENDENCIA (SOLO APLICA PARA SECRETARIA COMÚN)
                                        </Link>
                                        <div className="text-muted mt-2 mb-1">{getTextoTransaccion6 != null ? getTextoTransaccion6.toUpperCase() : null}</div>
                                    </td>
                                </tr>
                            ) : null}
                            {(hasAccess('EnviarAleatorioSecretariaComun', 'Gestionar')) ? (
                                <tr>
                                    <td className="text-center">
                                        <i className="fa fa-arrows-alt text-success fa-2x"></i>
                                    </td>
                                    <td>
                                        <Link to={'/EnviaraAlguienDeSecretariaComunAleatorio'} state={{ from: from, selected_id_etapa: selected_id_etapa }} className="font-size-h5 font-w600">
                                            TRANSFERIR EL PROCESO ALEATORIAMENTE ENTRE LOS USUARIOS DE MI DEPENDENCIA (SOLO APLICA PARA SECRETARIA COMÚN)
                                        </Link>
                                        <div className="text-muted mt-2 mb-1">{getTextoTransaccion7 != null ? getTextoTransaccion7.toUpperCase() : null}</div>
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ListaAccionesForm;