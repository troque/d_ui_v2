import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import Spinner from '../../Utils/Spinner';
import '../../Utils/Constants';
import { useLocation } from 'react-router-dom';
import GenericApi from '../../Api/Services/GenericApi';

function PreguntaImpedimentos() {

    const location = useLocation()
    const { from, selected_id_etapa, usuarioComisionado, disable: disable } = location.state
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    const [getNombreProceso, setNombreProceso] = useState('');

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();
            console.log("Usuario comisionado: ", usuarioComisionado)
        }
        fetchData();
    }, []);

    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                }
                window.showSpinner(false);
            }
        )
    }

    return (
        <>
            {<Spinner />}
            <Formik>
                <Form>
                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Pregunta Impedimentos</small></li>
                            </ol>
                        </nav>
                    </div>
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">{getNombreProceso} :: IMPEDIMENTO {from.dependendencia} </h3>
                        </div>
                        <div className="block-content ">
                            <div className='text-right'>
                                <Link to={`/RamasProceso/`} title='Regresar a ramas del proceso' state={{ from: from }}>
                                    <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                </Link>
                            </div>
                            <div className='row align-items-center mb-4'>
                                <div className='col-md-3 mt-1'>
                                    ¿EXISTE UN IMPEDIMENTO?
                                </div>
                                <div className='col-md-2 mt-1'>
                                    <Link className="btn btn-rounded btn-primary w-100" to="/ActuacionesForm" state={{ from: from, selected_id_etapa: selected_id_etapa, tipoActuacion: "Impedimento", usuarioComisionado: usuarioComisionado, disable: disable }}>
                                        <span className="nav-main-link-name">SI</span>
                                    </Link>
                                </div>
                                <div className='col-md-2 mt-1'>
                                    <Link className="btn btn-rounded btn-primary w-100" to="/ActuacionesLista" state={{ from: from, selected_id_etapa: selected_id_etapa, tipoActuacion: (usuarioComisionado === 'NO HA SIDO ASIGNADO' ? "Comisorio" : "Actuación"), redirigirVistaDeclarseImpedido: true, usuarioComisionado: usuarioComisionado, disable: disable }}>
                                        <span className="nav-main-link-name">NO</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );
}

export default PreguntaImpedimentos;