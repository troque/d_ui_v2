import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, } from "react-router-dom";
import Spinner from '../../Utils/Spinner';
import '../../Utils/Constants';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import GenericApi from './../../Api/Services/GenericApi';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { quitarAcentos } from '../../Utils/Common';
import 'react-datetime/css/react-datetime.css';
import DatePicker from 'react-datetime';
import moment from 'moment';


function ListaSemaforos() {

    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getLista, setLista] = useState({ data: [] });
    const [getNombreProceso, setNombreProceso] = useState('');

    const [resultDiasNoLaborales, setResultDiasNoLaborales] = useState([]);
    const [getAnosAtrasInvalidos, setAnosAtrasInvalidos] = useState(0);

    const location = useLocation();
    const { from } = location.state;

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();
            Calcular();
            getApiDiasNoLaborales();
        }
        fetchData();
    }, []);

    const getApiDiasNoLaborales = () => {
        //ParametrosMasApi.getAllDiasNoLaborales().then(
        GenericApi.getGeneric("dias-no-laborales?estado=1").then(
            datos => {
                if (!datos.error) {
                    var data = [];
                    for (var i in datos.data) {
                        var date = datos.data[i]["attributes"]["fecha"].split(' ')[0];
                        var result = new Date(date);
                        result.setDate(result.getDate() + 1);
                        data.push(i, date);
                    }

                    setResultDiasNoLaborales(data);

                    //obtenemos los parametros
                    obtenerParametros();

                } else {
                    setModalState({ title: "Proceso disciplinario", message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }

        )
    }

    const obtenerParametros = () => {
        try {

            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "limite_años_calendario|minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }

            //buscamos el parametro
            GenericApi.getByDataGeneric("parametro/parametro-nombre", data).then(
                //ParametrosMasApi.getParametroPorNombre(data).then(
                datos => {

                    if (!datos.error) {

                        if (datos["data"].length > 0) {

                            datos["data"].filter(data => data["attributes"]["nombre"].includes('limite_años_calendario')).map(filteredName => (
                                setAnosAtrasInvalidos(filteredName["attributes"]["valor"])
                            ))

                        }
                    } else {
                        setModalState({ title: "Proceso disciplinario", message: datos.error.toString(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                        window.showSpinner(false);
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const nombreProceso = () => {
        GenericApi.getByIdGeneric("nombre-proceso",from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                }
            }
        )
    }

    const Calcular = () => {
        GenericApi.getByIdGeneric('getDiasTranscurridos', from.procesoDisciplinarioId).then(
            datosDiasTranscurridos => {
                if (!datosDiasTranscurridos.error) {
                    console.log(datosDiasTranscurridos);
                    setLista(datosDiasTranscurridos);
                }
                window.showSpinner(false);
            }
        )
    }

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    const SemaforoColor = (semaforo) => {
        let color = '';
        semaforo.attributes.pdxsemaforo.attributes.condiciones.forEach(condiciones => {
            
            let diasTrans = parseInt(semaforo.attributes.diasTranscurridos2, 10);
            let inicial = parseInt(condiciones.inicial, 10);
            let final = condiciones.final != null ? parseInt(condiciones.final, 10) : (diasTrans+1);

            if(semaforo.attributes.pdxsemaforo.attributes.finalizo != null){
                color = "Azul";
            }else{
                if(diasTrans >= inicial && diasTrans <= final){
                    color = condiciones.color ;
                 }
            }
        })

        return color;
    }

    const changeFechaInicioSemaforo = (semaforo, date) => {

        const userInput = moment(date).format("DD-MM-YYYY");

        GenericApi.getGeneric("actualizar-fecha/"+semaforo.attributes.pdxsemaforo.attributes.id_semaforo.id+"/"+from.procesoDisciplinarioId+"/"+userInput).then(
            datosSemaforo => {
                if (!datosSemaforo.error) {
                    setModalState({ 
                        title: getNombreProceso + " :: SELECCIÓN DE FECHA DE INICIO DE SEMÁFORO", 
                        message: 'Fecha seleccionada actualizada con éxito', 
                        show: true, 
                        redirect: '/MisPendientes', 
                        from: {from: from}, 
                        alert: global.Constants.TIPO_ALERTA.EXITO 
                    });
                }else{
                    setModalState({ 
                        title: getNombreProceso + " :: SELECCIÓN DE FECHA DE INICIO DE SEMÁFORO", 
                        message: 'Ocurrio un error al intentar actualizar la fecha', 
                        show: true, 
                        redirect: '/MisPendientes', 
                        from: {from: from}, 
                        alert: global.Constants.TIPO_ALERTA.ERROR 
                    });
                }
            }
        )
    }

    const disableCustomDt = (current) => {
        const bloqueaDiasFuturos  = true;


        var startDate = new Date()
        var year = startDate.getFullYear();
        var month = startDate.getMonth();
        var day = startDate.getDate();
        var pastDate = new Date(year - getAnosAtrasInvalidos, month, day);

        if(bloqueaDiasFuturos){
            return (!resultDiasNoLaborales.includes(current.format('DD-MM-YYYY')) && moment(current).isAfter(pastDate) && moment(current).isBefore(new Date()));
        }
        else{
            return (!resultDiasNoLaborales.includes(current.format('DD-MM-YYYYDD-MM-YYYY')) && moment(current).isAfter(pastDate));
        }
    }
    
    const columns = [
        {
            name: <span title='COLOR'>ESTADO</span>,
            selector: semaforo => 
            <div>
                {SemaforoColor(semaforo) == "Verde" ? 
                (
                    <i class="far fa-lightbulb fa-2x" style={{"color":"#27e427","width":"100%","text-align": "center"}} title="VERDE"></i> 
                )
                : SemaforoColor(semaforo) == "Amarillo" ? 
                (
                    <i class="far fa-lightbulb fa-2x" style={{"color": "#c8c838","width":"100%","text-align": "center"}} title="AMARILLO"></i> 
                ) 
                : SemaforoColor(semaforo) == "Rojo" ? 
                (
                    <i class="far fa-lightbulb fa-2x" style={{"color": "red","width":"100%","text-align": "center"}} title="ROJO"></i> 
                )
                : SemaforoColor(semaforo) == "Azul" ? 
                (
                    <i class="far fa-lightbulb fa-2x" style={{"color": "#0071a1","width":"100%","text-align": "center"}} title="FINALIZADO"></i> 
                ) 
                : null}
            </div>
            ,
            wrap: true,
            sortable: true,
            width: "100px"
        },
        {
            name: 'NOMBRE',
            selector: semaforo => <spam title={semaforo.attributes.pdxsemaforo.attributes.id_semaforo.nombre.toUpperCase()}>{semaforo.attributes.pdxsemaforo.attributes.id_semaforo.nombre.toUpperCase()}</spam>,
            sortable: true,
            wrap: true,
            width: "250px"
        },

        {
            name: <span title='FECHA DE INICIO'>FECHA DE INICIO<br></br></span>,
            selector: semaforo => <spam>{semaforo.attributes.pdxsemaforo.attributes.fecha_inicio}</spam>,
            sortable: true,  
            width: "200px"         
        },
     
        {
            name: <span title='FECHA DE FINALIZACIÓN'>FECHA DE FINALIZACIÓN</span>,
            selector: semaforo =>  semaforo.attributes.pdxsemaforo.attributes.fechafinalizo,
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: <span title='EVENTO DE INICIO'>OBSERVACIONES</span>,
            selector: semaforo =>  
                <div className='text-uppercase'>
                    <strong>EVENTO DE INICIO: </strong>{semaforo.attributes.nombreEventoInicio}<br/>
                    <strong>USUARIO QUE INICIO EL SEMÁFORO: </strong>{semaforo.attributes.pdxsemaforo.attributes.created_user}<br/>
                    {semaforo.attributes.nombreMasActuacion!=null?<><strong>ACTUACIÓN QUE INICIA EL SEMÁFORO:</strong>{semaforo.attributes.nombreMasActuacion}</>:''}
                    <strong>ACTUACIÓN QUE INICIA EL SEMÁFORO: </strong>{semaforo.attributes.nombreMasActuacion}  
                    <strong>ACTUACIÓN QUE INICIA EL SEMÁFORO: </strong>{semaforo.attributes.nombreMasActuacion}<br/>
                    <strong>MOTIVO DE FINALIZACIÓN DEL SEMÁFORO: </strong>{semaforo.attributes.pdxsemaforo.attributes.motivo_finalizado}<br/>                 
                </div>,
            sortable: true,
            wrap: true,
            width: '450px'
        },
        {
            name: <span title='DÍAS CALENDARIO'>DÍAS CALENDARIO</span>,
            selector: semaforo => semaforo.attributes.pdxsemaforo.attributes.finalizo != null? <span title={semaforo.attributes.diasTranscurridosHastaFinalizar2.slice(1)}>{semaforo.attributes.diasTranscurridosHastaFinalizar2.slice(1)}</span> : <span title={semaforo.attributes.diasTranscurridos.slice(1)}>{semaforo.attributes.diasTranscurridos.slice(1)}</span>,
            sortable: true,
            wrap: true,
        },
        {
            name: <span title='DÍAS LABORALES'>DÍAS LABORALES</span>,
            selector: semaforo => semaforo.attributes.pdxsemaforo.attributes.finalizo != null? <span title={semaforo.attributes.diasTranscurridosHastaFinalizar}>{semaforo.attributes.diasTranscurridosHastaFinalizar}</span> : <span title={semaforo.attributes.diasTranscurridos2}>{semaforo.attributes.diasTranscurridos2}</span>,
            sortable: true,
            wrap: true,
        }
    ];

    const TomarColor = (suggestion) => {
        let color = "";
        suggestion.attributes.pdxsemaforo.attributes.condiciones.forEach(element => {
            if(element.color == SemaforoColor(suggestion)){
                color = element.color;
            }
        })
        return color;
    }
    console.log(getLista);

    const showModal = () => {
        window.showModalAyudaListaSemaforos(true);
    }

    const componentListaSemaforoAyuda = () => {
        return (
            <>
                <div className="modal fade" id="modal-block-lista-semaforo-ayuda" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-popout" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">FUNCIONAMIENTO DE LOS SEMÁFOROS</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <table className='table table-bordered table-vcenter text-center'>
                                        <tr>
                                            <th>VERDE</th>
                                            <th>AMARILLO</th>
                                            <th>ROJO</th>
                                            <th>FINALIZADO</th>
                                        </tr>
                                        <tr>
                                            <td>
                                                DENTRO DEL RANGO ACEPTABLE
                                            </td>
                                            <td>
                                                ALERTA ACEPTABLE
                                            </td>
                                            <td>
                                                FUERA DEL RANGO ACEPTABLE
                                            </td>
                                            <td>
                                                FINALIZADO
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <i class="far fa-lightbulb fa-2x" style={{"color":"#27e427","width":"100%","text-align": "center"}} title="VERDE"></i> 
                                            </td>
                                            <td>
                                                <i class="far fa-lightbulb fa-2x" style={{"color": "#c8c838","width":"100%","text-align": "center"}} title="AMARILLO"></i> 
                                            </td>
                                            <td>
                                                <i class="far fa-lightbulb fa-2x" style={{"color": "red","width":"100%","text-align": "center"}} title="ROJO"></i> 
                                            </td>
                                            <td>
                                                <i class="far fa-lightbulb fa-2x" style={{"color": "#0071a1","width":"100%","text-align": "center"}} title="FINALIZADO"></i> 
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
      }

    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            { componentListaSemaforoAyuda() }
            <Formik
                initialValues={{
                    rango: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {
                }}
            >

                {({ errors }) => (
                    <Form>

                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                </ol>
                            </nav>
                        </div>
                        
                        <div className="block block-themed">

                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso} :: LISTAS DE SEMÁFOROS ASOCIADOS</h3>
                                <button type="button" className="btn btn-primary mr-2" data-toggle="tooltip" data-html="true" title="Consultar Versiones" onClick={() => showModal()} data-original-title="Consultar Versiones"><span className="far fa-question-circle"> </span></button>
                            </div>

                            <div className="block-content block-content-full">

                                <div className='row'>
                                    <div className='col-md-3'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                                        </div>
                                    </div>

                                    <div  className='col-md-9 text-right'>
                                        <Link to={`/MisPendientes/`} title='Regresar a mis pendientes' state={{ from: from }}>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>
                            </div>                               

                                <div className="row">
                                    <div className="block-content block-content-full">
                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                                columns={columns}
                                                data={getLista.data.filter((suggestion) => {
                                                    if (getSeach === "") {
                                                        return suggestion;
                                                    }else if (
                                                        (
                                                              (suggestion.attributes.pdxsemaforo.attributes.id_semaforo.nombre ? quitarAcentos(suggestion.attributes.pdxsemaforo.attributes.id_semaforo.nombre) : null)
                                                            + (suggestion.attributes.pdxsemaforo.attributes.fechafinalizo ? quitarAcentos(suggestion.attributes.pdxsemaforo.attributes.fechafinalizo) : null)
                                                            + (suggestion.attributes.pdxsemaforo.attributes.fecha_inicio ? quitarAcentos(suggestion.attributes.pdxsemaforo.attributes.fecha_inicio) : null)
                                                            + (suggestion.attributes.nombreEventoInicio ? quitarAcentos(suggestion.attributes.nombreEventoInicio) : null)
                                                            + (suggestion.attributes.nombreMasActuacion ? quitarAcentos(suggestion.attributes.nombreMasActuacion) : null)
                                                            + (suggestion.attributes.diasTranscurridos ? quitarAcentos(suggestion.attributes.diasTranscurridos) : null)
                                                            + (quitarAcentos(TomarColor(suggestion)))
                                                        ).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase()))
                                                    ) {
                                                        return suggestion;
                                                    }
                                                })}
                                                perPage={perPage}
                                                page={pageActual}
                                                pagination
                                                noDataComponent="Sin datos"
                                                paginationTotalRows={getLista.data.length}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                defaultSortFieldId="Nombre"
                                                striped
                                                paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                defaultSortAsc={false}
                                            />
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )

}

export default ListaSemaforos;