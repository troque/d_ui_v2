import React, { useEffect, useState } from 'react';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import '../Utils/Constants';
import DataTable from 'react-data-table-component';
import { quitarAcentos } from '../Utils/Common';
import { Field, Form, Formik } from 'formik';
import { useParams } from "react-router";
import { Chart } from "react-google-charts";
import Spinner from '../Utils/Spinner';
import { Link, useSearchParams } from "react-router-dom";

function InfoDetalleDependencia() {


    const [getRtaReparto, setRtaReparto] = useState(false);
   
    const [getSearch, setSearch] = useState('');
    const paganationPerPages = process.env.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(process.env.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);

    const [getTotalCasos, setTotalCasos] = useState();
    const [getTotalActivos, setTotalActivos] = useState();
    const [getTotalInactivos, setTotalInactivos] = useState();
    const [getTotalArchivados, setTotalArchivados] = useState();


    const [getEstado, setEstado] = useState(false);

    const [getCantDerechosPeticion, setCantDerechosPeticion] = useState();
    const [getCantDPCopias, setCantDPCopias] = useState();
    const [getCantDPGeneral, setCantDPGeneral] = useState();
    const [getCantDPPolitico, setCantDPPolitico] = useState();

    const [getCantPoderPreferente, setCantPoderPreferente] = useState();

    const [getCantQueja, setCantQueja] = useState();
    const [getCantQInterna, setCantQInterna] = useState();
    const [getCantQExterna, setCantQExterna] = useState();

    const [getCantTutela, setCantTutela] = useState();
    const [getCantTHoras, setCantTHoras] = useState();
    const [getCantTDias, setCantTDias] = useState();

    const [getCantProcDisciplinario, setCantProcDisciplinario] = useState();
    

    let { idDependencia } = useParams();

    useEffect(() => {
        async function fetchData() {
            casosAsignados();
        }
        fetchData();
    }, []);


    const dataDP = [
        ["DERECHOS DE PETICIÓN", "DERECHOS DE PETICIÓN"],
        ["COPIAS", parseInt(getCantDPCopias)],
        ["GENERAL", parseInt(getCantDPGeneral)],
        ["ALERTA CONTROL POLÍTICO", parseInt(getCantDPPolitico)],
      ];
      
    const optionsDP = {
        chart: {
          title: "DERECHOS DE PETICIÓN",
          subtitle: "COPIAS, GENERAL Y ALERTA CONTROL POLÍTICO",
        },
      };

    const dataQ = [
        ["QUEJA", "QUEJA"],
        ["Interna", parseInt(getCantQInterna)],
        ["Externa", parseInt(getCantQExterna)],
    ];
      
    const optionsQ = {
        chart: {
          title: "QUEJA",
          subtitle: "INTERNA Y EXTERNA",
        },
    };


    const dataT = [
        ["TUTELA", "TUTELA"],
        ["DÍAS", parseInt(getCantTDias)],
        ["HORAS", parseInt(getCantTHoras)],
    ];
      
    const optionsT = {
        chart: {
          title: "TUTELA",
          subtitle: "HORAS Y DÍAS",
        },
    };

    const dataPP = [
        ["Tutela", "Casos"],
        ["Dias", parseInt(getCantTDias)],
        ["Horas", parseInt(getCantTHoras)],
    ];
    
    const optionsPP = {
        legend: "all",
        pieSliceText: "label",
        title: "Tutela",
        pieStartAngle: 100,
    };

    const dataPD = [
        ["PROCESO DISCIPLINARIO", "PROCESO DISCIPLINARIO"],
        ["RADICADOS", parseInt(getCantProcDisciplinario)],
    ];
      
    const optionsPD = {
        chart: {
          title: "PROCESO DISCIPLINARIO",
          subtitle: "RADICADOS",
        },
    };


    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    const casosAsignados = () => {

        window.showSpinner(true);

        const data = {
            "data": {
                "type": "log_proceso_disciplinario",
                "attributes": {
                    "": "",
                }
            }
        }

        GenericApi.getGeneric('log-proceso-disciplinario/getReporteDetalladoPorDependencia/'+idDependencia, data).then(

            datos => {
                if (!datos.error) {

                    setEstado(true);
                    setTotalCasos(datos.data.attributes.total);

                    setCantDerechosPeticion(datos.data.attributes.derechoPeticion.total);
                    setCantDPCopias(datos.data.attributes.derechoPeticion.copias);
                    setCantDPGeneral(datos.data.attributes.derechoPeticion.general);
                    setCantDPPolitico(datos.data.attributes.derechoPeticion.control_politico);

                    setCantQueja(datos.data.attributes.queja.total);
                    setCantQInterna(datos.data.attributes.queja.interna);
                    setCantQExterna(datos.data.attributes.queja.externa);

                    setCantTutela(datos.data.attributes.tutela.total);
                    setCantTHoras(datos.data.attributes.tutela.horas);
                    setCantTDias(datos.data.attributes.tutela.dias);

                    setCantPoderPreferente(datos.data.attributes.poderPreferente.total);

                    setCantProcDisciplinario(datos.data.attributes.procesoDisciplinario.total);

                    window.showSpinner(false);
                }
                else {
                    window.showSpinner(false);
                }

            }
        )
    }

    return (
        <>
            {<Spinner />}
            <div className="block block-themed">

                <div className="col-md-12">
                    <div className="block-content">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">                    
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/InfoRepartoAleatorio`}><small>Informe general</small></Link></li>
                                <li className="breadcrumb-item"> <small>Informe detallado</small></li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="block-header">
                    <h3 className="block-title"><strong>ADMINISTRACIÓN :: PROCESOS ASIGNADOS</strong></h3>
                </div>
                <div className="block-content">

                <div className="row text-right w2d-enter">
                        <div className="col-md-12">
                            <Link to={'/InfoRepartoAleatorio'} title='Regresar'>
                                <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                            </Link>                                            
                        </div>
                    </div>


                <div className="row">

                    <div className="col-md-2 col-xl-2">
                        <div  className="block block-rounded block-link-shadow">
                            <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                <div>
                                    <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-white font-size-h3 font-w300 mb-0">
                                        {getTotalCasos}
                                    </p>
                                    <p className="text-white-75 mb-0">
                                        TOTAL DE CASOS CASOS ACTIVOS
                                    </p>
                                </div>
                            </div>
                        </div >
                    </div>

                    <div className="col-md-2 col-xl-2">
                        <div  className="block block-rounded block-link-shadow">
                            <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                <div>
                                    <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-white font-size-h3 font-w300 mb-0">
                                        {getCantDerechosPeticion}
                                    </p>
                                    <p className="text-white-75 mb-0">
                                       DERECHOS DE PETICIÓN
                                    </p>
                                </div>
                            </div>
                        </div >
                    </div>

                    <div className="col-md-2 col-xl-2">
                        <div  className="block block-rounded block-link-shadow">
                            <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                <div>
                                    <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-white font-size-h3 font-w300 mb-0">
                                        {getCantQueja}
                                    </p>
                                    <p className="text-white-75 mb-0">
                                        <br></br>
                                        QUEJA
                                    </p>
                                </div>
                            </div>
                        </div >
                    </div>

                    <div className="col-md-2 col-xl-2">
                        <div  className="block block-rounded block-link-shadow">
                            <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                <div>
                                    <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-white font-size-h3 font-w300 mb-0">
                                        {getCantTutela}
                                    </p>
                                    <p className="text-white-75 mb-0">
                                        <br></br>
                                        TUTELA
                                    </p>
                                </div>
                            </div>
                        </div >
                    </div>

                    <div className="col-md-2 col-xl-2">
                        <div  className="block block-rounded block-link-shadow">
                            <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                <div>
                                    <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-white font-size-h3 font-w300 mb-0">
                                        {getCantPoderPreferente}
                                    </p>
                                    <p className="text-white-75 mb-0">
                                        <br></br>
                                       PODER PREFERENTE
                                    </p>
                                </div>
                            </div>
                        </div >
                    </div>

                    <div className="col-md-2 col-xl-2">
                        <div  className="block block-rounded block-link-shadow">
                            <div className="block-content block-rounded block-content-full d-flex align-items-center justify-content-between bg-primary">
                                <div>
                                    <i className="fa fa-2x fa-arrow-alt-circle-up text-primary-lighter"></i>
                                </div>
                                <div className="ml-3 text-right">
                                    <p className="text-white font-size-h3 font-w300 mb-0">
                                        {getCantProcDisciplinario}
                                    </p>
                                    <p className="text-white-75 mb-0">
                                       PROCESOS DISCIPLINARIOS
                                    </p>
                                </div>
                            </div>
                        </div >
                    </div>

                </div>

                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title"><strong>DERECHOS DE PETICIÓN</strong></h3>
                    </div>
                    <div className="block-content">

                        <div className="row">
                            <div className="col-md-6">
                                {getEstado?
                                <Chart chartType="Bar" width="100%" height="400px" data={dataDP} options={optionsDP} />:null
                                }
                            </div>

                            <div className="col-md-6">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                <thead>
                                    <tr>
                                        <th>DERECEHO DE PETICIÓN</th>
                                        <th>CASOS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>COPIAS</td>
                                        <td>{getCantDPCopias}</td>
                                    </tr>
                                    <tr>
                                        <td>GENERAL</td>
                                        <td>{getCantDPGeneral}</td>
                                    </tr>
                                    <tr>
                                        <td>ALERTA CONTROL POLÍTICO</td>
                                        <td>{getCantDPPolitico}</td>
                                    </tr>
                                </tbody>
                            </table>

                            </div>
                        </div> 
                    </div>      
                </div>

                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title"><strong>QUEJA</strong></h3>
                    </div>
                    <div className="block-content">

                        <div className="row">
                            <div className="col-md-6">
                                {getEstado?
                                <Chart chartType="Bar" width="100%" height="400px" data={dataQ} options={optionsQ} />:null
                                }
                            </div>

                            <div className="col-md-6">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                <thead>
                                    <tr>
                                        <th>QUEJA</th>
                                        <th>CASOS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>INTERNA</td>
                                        <td>{getCantQInterna}</td>
                                    </tr>
                                    <tr>
                                        <td>EXTERNA</td>
                                        <td>{getCantQExterna}</td>
                                    </tr>
                                </tbody>
                            </table>

                            </div>
                        </div> 
                    </div>      
                </div>


                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title"><strong>TUTELA</strong></h3>
                    </div>
                    <div className="block-content">

                        <div className="row">
                            <div className="col-md-6">
                                {getEstado?
                                <Chart chartType="Bar" width="100%" height="400px" data={dataT} options={optionsT} />:null
                                }
                            </div>

                            <div className="col-md-6">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                <thead>
                                    <tr>
                                        <th>TUTELA</th>
                                        <th>CASOS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>HORAS</td>
                                        <td>{getCantTHoras}</td>
                                    </tr>
                                    <tr>
                                        <td>DÍAS</td>
                                        <td>{getCantTDias}</td>
                                    </tr>
                                </tbody>
                            </table>

                            </div>
                        </div> 
                    </div>      
                </div>

                <div className="block block-themed">
                    <div className="block-header">
                        <h3 className="block-title"><strong>PROCESO DISCIPLINARIO</strong></h3>
                    </div>
                    <div className="block-content">

                        <div className="row">
                            <div className="col-md-6">
                                {
                                    getEstado
                                    ?
                                        <Chart chartType="Bar" width="100%" height="400px" data={dataPD} options={optionsPD} />
                                    :
                                        null
                                }
                            </div>

                            <div className="col-md-6">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                <thead>
                                    <tr>
                                        <th>PROCESO DISCIPLINARIO</th>
                                        <th>CASOS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>RADICADOS</td>
                                        <td>{getCantProcDisciplinario}</td>
                                    </tr>
                                </tbody>
                            </table>

                            </div>
                        </div> 
                    </div>      
                </div>            

                </div>      
            </div>
        </>
            
        
    )

}

export default InfoDetalleDependencia;