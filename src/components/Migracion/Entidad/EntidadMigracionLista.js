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

function EntidadMigracionLista() {

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getListaEntidades, setListaEntidades] = useState({ data: [], links: [], meta: [] });

    let { radicado, vigencia} = useParams();


    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            listaAntecedentes();
            
           
        }
        fetchData();
    }, []);


    const listaAntecedentes= () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("migracion-lista-entidades/"+radicado+"/"+vigencia).then(
                datos => {

                    if (!datos.error) {
                        setListaEntidades(datos);

                    } else {
                        setModalState({ title: "Migración Datos del interesado", message: datos.error.toString(), show: true, redirect: `/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.ERROR });
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


    const lista = () => {

        if (getListaEntidades.data != null && typeof (getListaEntidades.data) != 'undefined') {
            return (

                getListaEntidades.data.map((item, i) => {
                    return (
                        <tr>
                            <td>{i=i+1}</td>
                            <td>{item.attributes.entidad}</td>
                            <td>{item.attributes.sector}</td>
                            <td>{item.attributes.nombreInvestigado}</td>
                            <td>{item.attributes.cargoInvestigado}</td>
                            <td><Link className="text-dark" to={`/CargarMigracionEntidad/${radicado}/${vigencia}/${item.attributes.id}`}>
                                <button type="button" className="btn btn-sm btn-secundary w2d_btn-large mr-1 mb-3 text-left">
                                    <i className={colorFase(item.attributes.semaforizacion)}></i> COMPLETAR INFORMACIÓN
                                </button></Link>
                            </td>
                        </tr>
                    )
                })
            )
        }
    }


    return (
        <>
            {<Spinner />}   
            {<ModalGen data={getModalState} />}
          
            <div className="w2d_block">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Buscador`}><small>Buscador</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`}><small>Inicio proceso de migración</small></Link></li>
                        <li className="breadcrumb-item"> <small>Lista de interesados</small></li>
                    </ol>
                </nav>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">MIGRACIÓN PROCESO No :: {radicado} - {vigencia} :: ENTIDAD DEL INTERESADO</h3>
                </div>

                <div className="block-content">

                    <div className='text-right w2d-enter'>
                        <Link to={`/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`} title='Regresar' >
                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                        </Link>
                    </div>

                    {getListaEntidades.data.length==0?
                        <div className="alert alert-primary alert-dismissable" role="alert">
                            <h3 className="alert-heading font-size-h4 my-2">ALERTA</h3>
                            <p className="mb-0">NO EXISTEN ENTIDADES REGISTRADAS EN EL SISTEMA DE MIGRACIÓN PARA ESTE PROCESO. 
                                DEBE REGISTRAR UNA ENTIDAD PARA MIGRAR EL PROCESO.
                            </p><br/>

                            <Link to={`/CargarMigracionEntidad/${radicado}/${vigencia}/${-1}`}>
                                <button type="button" className="btn btn-success">{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                            </Link>

                        </div>
                        :
                    
                        <div className="col-md-12">

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">ENTIDAD</th>
                                        <th scope="col">SECTOR</th>
                                        <th scope="col">NOMBRE DEL INVESTIGADO</th>
                                        <th scope="col">CARGO DEL INVESTIGADO</th>
                                        <th scope="col">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista()}                 
                                </tbody>
                            </table>
                            
                        </div>
                    }
                </div>
                
            </div>

                   
        </>
    );
}


export default EntidadMigracionLista;