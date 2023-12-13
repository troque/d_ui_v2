import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import { useParams } from "react-router";

function ProcesoDisciplinarioMigracion() {

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getListaFases, setListaFases] = useState({ data: [], links: [], meta: [] });
    const [getProcesoDisciplinario, setProcesoDisciplinario] = useState({ data: [], links: [], meta: [] });
    const [getRadicado, setRadicado] = useState(false);
    const [getEtapa, setEtapa] = useState(false);
    const [getUbicacionExpediente, setUbicacionExpediente] = useState(false);
    const [getAntecedente, setAntecedente] = useState(false);
    const [getDependenciaOrigen, setDependenciaOrigen] = useState(false);
    const [getMigrado, setMigrado] = useState(null);


    const location = useLocation()
    let { radicado, vigencia } = useParams();

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            listaFases();

        }
        fetchData();
    }, []);


    const listaFases = () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("fases-migracion/" + radicado + "/" + vigencia).then(
                datos => {

                    if (!datos.error) {
                        setListaFases(datos);
                        listaProcesoDisciplinarioMigracion();

                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }


    const listaProcesoDisciplinarioMigracion = () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("migracion-proceso-disciplinario/" + radicado + "/" + vigencia).then(
                datos => {

                    if (!datos.error) {
                        setProcesoDisciplinario(datos);
                        setRadicado(datos.data[0].attributes.radicado);
                        setEtapa(datos.data[0].attributes.etapa);
                        setAntecedente(datos.data[0].attributes.antecedente);
                        setUbicacionExpediente(datos.data[0].attributes.ubicacion_expediente);
                        setDependenciaOrigen(datos.data[0].attributes.dependencia_origen);
                        setMigrado(datos.data[0].attributes.migrado);

                        //setRtaListaFases(true);
                    } else {
                        setModalState({ title: "Migración", message: datos.error.toString(), show: true, redirect: 'Buscador', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            // console.log(error);
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

    const tablaFases = () => {

        if (getListaFases.data != null && typeof (getListaFases.data) != 'undefined') {
            return (

                getListaFases.data.map((item, i) => {
                    return (
                        <tr>
                            <td>{i = i + 1}</td>
                            <td>{item.attributes.nombre.toUpperCase()}</td>
                            <td><Link className="text-dark" to={item.attributes.link_consulta + `/${radicado}/${vigencia}`}>
                                <button type="button" className="btn btn-sm btn-secundary w2d_btn-large mr-1 mb-3 text-left">
                                    <i className={colorFase(item.attributes.semaforizacion)}></i> COMPLETAR INFORMACIÓN
                                </button>
                            </Link>
                            </td>

                        </tr>
                    )
                })
            )
        }
    }


    const procesoDisciplinario = () => {

        if (getProcesoDisciplinario.data != null && typeof (getProcesoDisciplinario.data) != 'undefined') {
            return (
                <div className="col-lg-12 push">
                    <div className="alert alert-info" role="alert">
                        <span className='txt-black-primary'><strong className="txt-blue-primary">RADICADO: </strong> {getRadicado} <strong className="txt-blue-primary">Vigencia: </strong> {vigencia}</span><br />
                        <span className="txt-black-primary"><strong className="txt-blue-primary">TIPO DE PROCESO: </strong>  </span><br />
                        <span className="txt-black-primary"><strong className="txt-blue-primary">ETAPA: </strong>  {getEtapa}</span><br />
                        <span className="txt-black-primary"><strong className="txt-blue-primary">UBICACIÓN ACTUAL: </strong>  {getUbicacionExpediente}</span><br />
                        <span className="txt-black-primary"><strong className="txt-blue-primary">DEPENDENCIA ORIGEN: </strong>  {getDependenciaOrigen}</span><br />
                        <span className="txt-black-primary"><strong className="txt-blue-primary">ANTECEDENTE: </strong></span><br />

                        <div className=''>
                            <span className='txt-black-primary' title={getAntecedente}>{getAntecedente}</span>
                        </div>
                    </div>
                </div>
            )

        }
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);

        GenericApi.getGeneric("migracion-definitva/" + radicado + "/" + vigencia).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "PROCESO No " + radicado + " :: MIGRACIÓN DEFINITIVA", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: `/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: "PROCESO No " + radicado + " :: MIGRACIÓN DEFINICTIVA", message: datos.error.toString(), show: true, redirect: `/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }


    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}

            <div className="w2d_block">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to="/Buscador" state={{ from: "" }}><small>Buscador</small></Link></li>
                        <li className="breadcrumb-item"> <small>Inicio proceso de migración</small></li>
                    </ol>
                </nav>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">MIGRACIÓN PROCESO No :: {radicado} - {vigencia}</h3>
                </div>

                <div className="block-content">

                    {procesoDisciplinario()}

                    <div className="col-md-12">

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">FASE</th>
                                    <th scope="col">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getListaFases != null ?
                                    tablaFases() : null
                                }

                            </tbody>
                        </table>

                        <Formik
                            initialValues={{
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

                                    {getMigrado === true ? null :
                                        <div className="block block-themed">
                                            <div className="block-content block-content-full text-right bg-light">
                                                <button type="submit" className="btn btn-rounded btn-primary">MIGRAR DEFINITIVAMENTE</button>
                                            </div>
                                        </div>
                                    }
                                </Form>
                            )}
                        </Formik>

                    </div>
                </div>

            </div>


        </>
    );
}


export default ProcesoDisciplinarioMigracion;