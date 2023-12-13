import React, { useEffect, useState, } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Utils/Spinner';
import GenericApi from '../Api/Services/GenericApi';
import { Chart } from "react-google-charts";
import '../Utils/Constants';
import { hasAccess } from '../Utils/Common';
import ParametroModel from '../Models/ParametroModel';

function Dashboard() {


    const [getInfoDashboard, setInfoDashboard] = useState({ data: []});
    const [misPendientes, setMisPendientes] = useState();
    const [pendientesFirma, setPendientesFirma] = useState();

    const [listaPendientesFirma, setListaPendientesFirma] = useState();
    const [rtaListaPendientesFirma, setRtaListaPendientesFirma] = useState(false);

    const [getListaEtapa, setListaEtapa] = useState();
    const [getListaTransacciones, setListaTransacciones] = useState({ data: [] });
    const [rtaListaTransacciones, setRtaListaTransacciones] = useState(false);
    const [rtaListaEtapa, setRtaListaEtapa] = useState(false);
    
    const [rtaInfoDashboard, setRtaInfoDashboard] = useState(false);

    const [getSinClasificacion, setSinClasificacion] = useState();
    const [getCantDerechosPeticion, setCantDerechosPeticion] = useState();
    const [getCantPoderPreferente, setCantPoderPreferente] = useState();
    const [getCantQueja, setCantQueja] = useState();
    const [getCantTutela, setCantTutela] = useState();
    const [getCantProcDisciplinario, setCantProcDisciplinario] = useState();
    const [getCantProcesos, setCantProcesos] = useState(false);    
    const [getColorPrimary, setColorPrimary] = useState("btn btn-sm btn-primary w2d_btn-large mr-1 mb-3 text-left");

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);

            await infoDashboard();
            await infoDocumentosPorFirmar();
            await casosAsignadosPorEtapa();
            await casosAsignadosPorExpediente();
            await transacciones();

            window.showSpinner(false);
        }
        fetchData();
    }, []);


    const infoDashboard = () => {

        GenericApi.getGeneric("inicio").then(
            datos => {
    
                if (!datos.error) {
                    setInfoDashboard(datos);
                    setRtaInfoDashboard(true);
                    setMisPendientes(datos.data[0].attributes.cat_procesos_activos);
                    setPendientesFirma(datos.data[0].attributes.cat_documentos_sin_firmar);   
                }
                
            }
        )
    }


    const infoDocumentosPorFirmar = () => {

        GenericApi.getGeneric("documentos-por firmar").then(
            datos => {
    
                if (!datos.error) {
                    setListaPendientesFirma(datos);
                    setRtaListaPendientesFirma(true);                             
                }              
            }
        )
    }



    const casosAsignadosPorExpediente = () => {

        GenericApi.getGeneric('procesos-por-expediente').then(

            datos => {
                if (!datos.error) {      
                    setSinClasificacion(datos.data.attributes.sinClasificacion);
                    setCantDerechosPeticion(datos.data.attributes.derechoPeticion);                  
                    setCantQueja(datos.data.attributes.queja);
                    setCantTutela(datos.data.attributes.tutela);
                    setCantPoderPreferente(datos.data.attributes.poderPreferente);
                    setCantProcDisciplinario(datos.data.attributes.procesoDisciplinario);
                    setCantProcesos(true)
                }
            }
        )
    }

    const transacciones = () => {
        GenericApi.getGeneric('mis-transacciones').then(

            datos => {
                if (!datos.error) {      
                    setListaTransacciones(datos);
                    setRtaListaTransacciones(true)
                }
            }
        )
    }



    const casosAsignadosPorEtapa = () => {

        GenericApi.getGeneric('procesos-por-etapa').then(

            datos => {
                if (!datos.error) {      
                    setListaEtapa(datos);    
                    setRtaListaEtapa(true);
                }
               

            }
        )
    }



    const tablaPendienteFirma = () => {
        if (listaPendientesFirma.data != null && typeof (listaPendientesFirma.data) != 'undefined') {
            return (
                listaPendientesFirma.data.map((lista, i) => {
                    return (
                        <tr key={lista.attributes.id}>
                            <td>{i+1}</td>
                            <td>{lista.attributes.radicado} - {lista.attributes.vigencia}</td>
                            <td>{lista.attributes.nombre_actuacion}</td>
                            <td>{lista.attributes.usuario_solicita_firma}</td>                          
                        </tr>
                    )
                })
            )
        }
    }

    const tablaTransacciones = () => {
        return (
            getListaTransacciones.data.map((pendiente, i) => {
                if(i < 6){
                    return (
                        <tr key={pendiente.attributes.MisPendientes.id}>
                            <td>{i+1}</td>
                            {/* <td>{lista.attributes.MisPendientes.attributes.radicado} - {lista.attributes.MisPendientes.attributes.vigencia}</td> */}
                            <td>
                                {
                                    (hasAccess('MP_RamasProceso', 'Consultar')) ? (
                                        <Link to={`/RamasProceso/`} state={{
                                            from: new ParametroModel(pendiente.attributes.MisPendientes.attributes.radicado,
                                                pendiente.attributes.MisPendientes.id,
                                                pendiente.attributes.MisPendientes.attributes.vigencia,
                                                (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.id : ""),
                                                (pendiente.attributes.MisPendientes.attributes.evaluacion ? pendiente.attributes.MisPendientes.attributes.evaluacion.nombre.toUpperCase() : ""),
                                                getColorPrimary,
                                                getColorPrimary,
                                                getColorPrimary,
                                                getColorPrimary,
                                                getColorPrimary,
                                                getColorPrimary,
                                                getColorPrimary,
                                                (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario) ? (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.nombre : "") + ' ' + (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.usuario.apellido : "") : "",
                                                pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.descripcion,
                                                pendiente.attributes.MisPendientes.attributes.created_at,
                                                (pendiente.attributes.MisPendientes.attributes.proceso_sinproc ? pendiente.attributes.MisPendientes.attributes.proceso_sinproc.fecha_ingreso
                                                    : (pendiente.attributes.MisPendientes.attributes.proceso_sirius ? pendiente.attributes.MisPendientes.attributes.proceso_sirius.fecha_ingreso
                                                        : (pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente ? pendiente.attributes.MisPendientes.attributes.proceso_poder_preferente.fecha_ingreso
                                                            : (pendiente.attributes.MisPendientes.attributes.proceso_desglose ? pendiente.attributes.MisPendientes.attributes.proceso_desglose.fecha_ingreso:null)))),
                                                (pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia) ? pendiente.attributes.MisPendientes.attributes.ultimo_antecedente.dependencia.nombre : "",
                                            )
                                        }}>
                                            <>{pendiente.attributes.MisPendientes.attributes.radicado} - {pendiente.attributes.MisPendientes.attributes.vigencia}</>
                                        </Link>
                                    ) : null
                                }
                            </td>                          
                            <td>{pendiente.attributes.MisPendientes.attributes.ultima_descripcion_log}</td>                          
                        </tr>
                    )
                }
            })
        )
    }

    const dataE = [
        ["Expediente", "CASOS"],
        ["N/A", parseInt(getSinClasificacion)],
        ["DERECHO PETICION", parseInt(getCantDerechosPeticion)],
        ["QUEJA", parseInt(getCantQueja)],
        ["PODER PREFERENTE", parseInt(getCantPoderPreferente)],
        ["TUTELA", parseInt(getCantTutela)],
        ["PROCESO DISCIPLINARIO", parseInt(getCantProcDisciplinario)],
      ];

      const optionsE = {
        chart: {
          title: "PROCESOS POR TIPO DE EXPEDIENTE",
          subtitle: "",         
        },
        bars: "horizontal",
      };  


      const dataEtapa = [
        ["ETAPA", "CASOS"],
        [rtaListaEtapa?getListaEtapa.data[0].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[0].cant_etapa:'')],
        [rtaListaEtapa?getListaEtapa.data[1].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[1].cant_etapa:'')],
        [rtaListaEtapa?getListaEtapa.data[2].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[2].cant_etapa:'')],
        [rtaListaEtapa?getListaEtapa.data[3].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[3].cant_etapa:'')],
        [rtaListaEtapa?getListaEtapa.data[4].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[4].cant_etapa:'')],
        [rtaListaEtapa?getListaEtapa.data[5].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[5].cant_etapa:'')],
        [rtaListaEtapa?getListaEtapa.data[6].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[6].cant_etapa:'')],
        [rtaListaEtapa?getListaEtapa.data[7].nombre_etapa:'', parseInt(rtaListaEtapa?getListaEtapa.data[7].cant_etapa:'')],
      ];

      const optionsEtapa = {
        chart: {
          title: "PROCESOS POR ETAPA",
          subtitle: "",
        },
        bars: "horizontal",
      };  


    return (
        <>
            {<Spinner />}
            <div className="content">
                <div className="pt-4 px-4 bg-body-dark rounded push">
                    <div className="row row-deck">
                        <div className="col-md-2">
                            {
                                misPendientes
                                ?
                                    <Link className="block block-rounded block-link-pop text-center d-flex align-items-center" underline="hover" to={`/MisPendientes`}>
                                        <div className="block-content">
                                            <h2>
                                                {misPendientes}
                                            </h2>
                                            <p className="font-w600 font-size-sm text-uppercase">MIS PENDIENTES</p>
                                        </div>
                                    </Link>
                                :
                                    <div className="block block-rounded block-link-pop text-center d-flex align-items-center">
                                        <div className="block-content">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                            <p></p>
                                        </div>
                                    </div>
                            }
                        </div>

                        <div className="col-md-2">
                            {
                                pendientesFirma
                                ?
                                    <div className="block block-rounded block-link-pop text-center d-flex align-items-center">
                                        <div className="block-content">
                                            <h2>
                                                {pendientesFirma}
                                            </h2>                                   
                                            <p className="font-w600 font-size-sm text-uppercase">PENDIENTES DE FIRMA</p>
                                        </div>
                                    </div>
                                :
                                    <div className="block block-rounded block-link-pop text-center d-flex align-items-center">
                                        <div className="block-content">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                            <p></p>
                                        </div>
                                    </div>
                            }
                        </div>

                        {/* <div className="col-md-2">
                            <a className="block block-rounded block-link-pop text-center d-flex align-items-center" href="javascript:void(0)">
                                <div className="block-content">
                                    <p className="mb-2 d-none d-sm-block">
                                        <i className="fa fa-pencil-alt text-gray fa-2x"></i>
                                    </p>
                                    <p className="font-w600 font-size-sm text-uppercase">TRANSACCIONES PENDIENTES</p>
                                </div>
                            </a>
                        </div>

                        <div className="col-md-2">
                            <a className="block block-rounded block-link-pop text-center d-flex align-items-center" href="javascript:void(0)">
                                <div className="block-content">
                                    <p className="mb-2 d-none d-sm-block">
                                        <i className="fa fa-pencil-alt text-gray fa-2x"></i>
                                    </p>
                                    <p className="font-w600 font-size-sm text-uppercase">ALERTA VERDE</p>
                                </div>
                            </a>
                        </div>

                        <div className="col-md-2">
                            <a className="block block-rounded block-link-pop text-center d-flex align-items-center" href="javascript:void(0)">
                                <div className="block-content">
                                    <p className="mb-2 d-none d-sm-block">
                                        <i className="fa fa-pencil-alt text-gray fa-2x"></i>
                                    </p>
                                    <p className="font-w600 font-size-sm text-uppercase">ALERTA NARANJA</p>
                                </div>
                            </a>
                        </div>

                        <div className="col-md-2">
                            <a className="block block-rounded block-link-pop text-center d-flex align-items-center" href="javascript:void(0)">
                                <div className="block-content">
                                    <p className="mb-2 d-none d-sm-block">
                                        <i className="fa fa-pencil-alt text-gray fa-2x"></i>
                                    </p>
                                    <p className="font-w600 font-size-sm text-uppercase">ALERTA ROJA</p>
                                </div>
                            </a>
                        </div> */}
                    </div>
                </div>


                <div className="row">

                    <div className="col-md-6">

                        <div className="block block-rounded" data-toggle="appear">
                            <div className="block-header"  style={{ color: 'red' }}>
                                <h3 className="block-title-black">DOCUMENTOS PENDIENTES DE FIRMA</h3>
                                <div className="block-options">

                                <Link className="block block-rounded block-link-pop text-center d-flex align-items-center" underline="hover" to={`/DocumentosFirmadosOPendientesDeFirma`}>
                                    VER TODOS
                                </Link>
                                                          
                                </div>
                            </div>
                            <div className="block-content block-content-full">
                                {
                                    rtaListaPendientesFirma
                                    ?
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-vcenter mb-0 text-uppercase">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Radicado</th>
                                                        <th>Actuación</th>
                                                        <th>Solicitado por</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rtaListaPendientesFirma ? tablaPendienteFirma() : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    :
                                        <div className="block block-rounded block-link-pop text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="block block-rounded" data-toggle="appear">
                            <div className="block-header"  style={{ color: 'red' }}>
                                <h3 className="block-title-black">TRANSACCIONES</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-toggle="block-option" data-action="state_toggle" data-action-mode="demo">
                                        VER TODOS
                                    </button> 
                                </div>
                            </div>
                            <div className="block-content block-content-full">
                                {
                                    rtaListaTransacciones
                                    ?
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-vcenter mb-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>NO</th>
                                                        <th>RADICADO</th>
                                                        <th>OBSERVACIÓN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getListaTransacciones.data.length > 0 ? tablaTransacciones() : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    :
                                        <div className="block block-rounded block-link-pop text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">

                        <div className="block block-rounded" data-toggle="appear">
                            <div className="block-header">                         
                              
                            </div>
                            <div className="block-content block-content-full">
                                {
                                    getCantProcesos
                                    ?
                                        <div className="table-responsive">
                                            <Chart chartType="Bar" width="100%" height="400px" data={dataE} options={optionsE} />
                                        </div>
                                    :
                                        <div className="block block-rounded block-link-pop text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>

                    </div>

   

                    <div className="col-md-6">

                        <div className="block block-rounded" data-toggle="appear">
                            <div className="block-header">                         
                              
                            </div>
                            <div className="block-content block-content-full">
                                {
                                    rtaListaEtapa
                                    ?
                                        <div className="table-responsive">
                                            <Chart chartType="Bar" width="100%" height="400px" data={dataEtapa} options={optionsEtapa} />
                                        </div>
                                    :
                                        <div className="block block-rounded block-link-pop text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>       
            </div>
        
        </>
    )

}

export default Dashboard;