import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GenericApi from '../../Api/Services/GenericApi';
import '../../Utils/Constants';

function ModalCierreEtapaInfo(props) {

    const location = useLocation()
    const { from } = location.state

    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    // Cierre de etapas
    const [getInfoCierreEtapa_CR, setInfoCierreEtapa_CR] = useState({ data: [], links: [], meta: [] });
    const [getRtaCierreEtapa_CR, setRtaCierreEtapa_CR] = useState(false);


    const [getInfoCierreEtapa_EV, setInfoCierreEtapa_EV] = useState({ data: [], links: [], meta: [] });
    const [getRtaCierreEtapa_EV, setRtaCierreEtapa_EV] = useState(false);


    useEffect(() => {
        async function fetchData() {

            etapaCapturaReparto();
            etapaEvaluacion();


        }
        fetchData();
    }, []);


    const etapaCapturaReparto = () => {

        const data = {
            "data": {
                "type": "log_disciplinario",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": global.Constants.ETAPAS.CAPTURA_REPARTO,
                }

            }
        }

        GenericApi.getByDataGeneric('log-proceso-disciplinario/get-log-cierre-etapa', data).then(
            datos => {

                if (!datos.error) {
                    setInfoCierreEtapa_CR(datos);
                    setRtaCierreEtapa_CR(true);
                }
            }
        );

        window.showSpinner(true);

    }


    const etapaEvaluacion = () => {

        const data = {
            "data": {
                "type": "log_disciplinario",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": global.Constants.ETAPAS.EVALUACION,
                }

            }
        }

        console.log("*****************************************");
        console.log(JSON.stringify(data));
        console.log("*****************************************");

        GenericApi.getByDataGeneric('log-proceso-disciplinario/get-log-cierre-etapa', data).then(
            datos => {



                if (!datos.error) {
                    // console.log("ESTOY EN CIERRE DE ETAPA 2");
                    // console.log(JSON.stringify(datos));
                    // console.log("ESTOY EN CIERRE DE ETAPA 2");

                    setInfoCierreEtapa_EV(datos);
                    setRtaCierreEtapa_EV(true);
                }
            }
        );

        window.showSpinner(true);

    }


    const listaCierreEtapaCR = () => {

        if (getInfoCierreEtapa_CR.data != null && typeof (getInfoCierreEtapa_CR.data) != 'undefined') {

            return (

                getInfoCierreEtapa_CR.data.map((etapa, i) => {
                    return (

                        <tr key={etapa.id}>
                            <td>{etapa.attributes.etapa.nombre}</td>
                            <td>{etapa.attributes.created_at}</td>
                            <td>{etapa.attributes.funcionario_registra.nombre} {etapa.attributes.funcionario_registra.apellido}</td>
                            <td>{etapa.attributes.dependencia_origen.nombre} </td>
                            <td>Etapa revisada y aprobada por funcionario(a)</td>
                        </tr>
                    )
                })
            )
        }
    }


    const listaCierreEtapaEV = () => {

        if (getInfoCierreEtapa_EV.data != null && typeof (getInfoCierreEtapa_EV.data) != 'undefined') {

            return (

                getInfoCierreEtapa_EV.data.map((etapa, i) => {
                    return (

                        <tr key={etapa.id}>
                            <td>{etapa.attributes.etapa.nombre}</td>
                            <td>{etapa.attributes.created_at}</td>
                            <td>{etapa.attributes.funcionario_registra.nombre} {etapa.attributes.funcionario_registra.apellido}</td>
                            <td>{etapa.attributes.dependencia_origen.nombre} </td>
                            <td>Etapa revisada y aprobada por funcionario(a)</td>
                        </tr>
                    )
                })
            )
        }
    }


    return (
        <>
            <div className="modal" id={'modal-consultar-detalle-1'} tabIndex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">Sinproc {props?.radicado} :::: Cierre de etapa</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">


                                <div className='col-md-12'>
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                        <thead>
                                            <tr>
                                                <th>Etapa</th>
                                                <th>Fecha registro</th>
                                                <th>Funcionario Registra</th>
                                                <th>Dependencia</th>
                                                <th>Detalle de cierre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getRtaCierreEtapa_CR ? listaCierreEtapaCR() : null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-sm btn-primary" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal" id={'modal-consultar-detalle-2'} tabIndex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">Sinproc {props?.radicado} :::: Cierre de etapa</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">


                                <div className='col-md-12'>
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                        <thead>
                                            <tr>
                                                <th>Etapa</th>
                                                <th>Fecha registro</th>
                                                <th>Funcionario Registra</th>
                                                <th>Dependencia</th>
                                                <th>Detalle de cierre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getRtaCierreEtapa_EV ? listaCierreEtapaEV() : null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalCierreEtapaInfo;
