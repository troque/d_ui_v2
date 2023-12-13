import React, { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import { Link } from "react-router-dom";
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/es';
import { useLocation } from 'react-router-dom'
import ClasificacionRadicado from './ClasificacionRadicado';
import GenericApi from '../../Api/Services/GenericApi';



function ClasificacionRadicadoForm() {
   
    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    const [getNombreProceso, setNombreProceso] = useState('');



    const [getParametros, setParametros] = useState({
        id_proceso_disciplinario: procesoDisciplinarioId,
        id_etapa: global.Constants.ETAPAS.CAPTURA_REPARTO,
        reclasificacion: false,
        route: "/ClasificacionRadicadoLista/",
        tipo_clasificacion: global.Constants.TIPO_CLASIFICACION.CLASIFICACION,
    });

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();
        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso",procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }
                window.showSpinner(false);
            }
        )
    }


    return (
        
        <>
            <Spinner />
            <div className="row">

                
                    <div className="w2d_block let">
                        
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" aria-current="page" to={`/ClasificacionRadicadoLista/`} state={{ from: from }}><small>Lista de clasificacion del radicado</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Nueva clasificacion del radicado</small></li>
                                </ol>
                            </nav>
                        
                    </div>
                

                <div className="col-md-12">
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title"> {getNombreProceso} :: CLASIFICACIÓN DEL RADICADO :: NUEVA CLASIFICACIÓN</h3>
                        </div>

                        <ClasificacionRadicado getParametros={getParametros} id="cr_componente" name="cr_componente" />

                    </div>
                </div>
            </div>

        </>
    );

}
export default ClasificacionRadicadoForm;
