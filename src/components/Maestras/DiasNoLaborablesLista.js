import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ModalCalendar from '../Utils/Modals/ModalCalendar';
import Calendar from 'react-calendar';
import ParametrosMasApi from "./../Api/Services/ParametrosMasApi";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es"; // the locale you want
import Spinner from '../Utils/Spinner';
registerLocale("es", es); // register it with the name you want


function DiasNoLaborablesLista() {
    const [getFecha, setFecha] = useState();
    const [getId, setId] = useState();
    const [resultDiasNoLaborales, setResultDiasNoLaborales] = useState(['']);
    const [startDate, setStartDate] = useState();

    useEffect(() => {
        async function fetchData() {
            setStartDate(new Date());
            cargarDias();
        }
        fetchData();
    }, []);

    const cargarDias = () => {
        window.showSpinner(true);
        setResultDiasNoLaborales([]);
            ParametrosMasApi.getAllDiasNoLaborales().then(
                datos => {
                    if (!datos.error) {
                        var data = [];
                        for (var i in datos.data) {
                            var date = datos.data[i]["attributes"]["fecha"].split(' ')[0];
                            var id = datos.data[i]["id"];
                            var result = new Date(date);
                            result.setDate(result.getDate() + 1);
                            data.push(i, id+"|"+date);
                        }
                        window.showSpinner(false);
                        setResultDiasNoLaborales(data);
                    } else {
                        window.showSpinner(false);
                        window.showModal(1);
                    }

                }

            )
    }

    const shwModalPipe = (value, estado) => {
      
        setId(value[0].split("|")[0]);
        setFecha(value[0].split("|")[1]);
        setEstado(estado);
        window.showModalCalendar(value);
    }

    const shwModalCreate = (value, estado) => {


        setFecha(value);
        setEstado(estado);
        window.showModalCalendar(value);
    }


    const handleCallback = (fecha) => {
        try {
            // console.log(fecha);
            setStartDate(fecha);
            cargarDias();
        } catch (error) {

        }

    }

    const [getEstado, setEstado] = useState(null);


    const renderDayContents = (day, date) => {
        const fecha = resultDiasNoLaborales.filter(fecha => fecha.split("|")[1] == moment(date).format("YYYY-MM-DD"));
        if (fecha.length > 0) {
            return <div onClick={() => shwModalPipe(fecha, '1')}>
                <span  className='p-2 mb-1 bg-danger text-white'>{date.getDate()}</span>
            </div>;
        }
        return <div onClick={() => shwModalCreate(date, '0')}>
            <span >{date.getDate()}</span>
        </div>
    };
    return (
        <>
            {<ModalCalendar getFecha={getFecha} getEstado = {getEstado} getId={getId} parentCallback={handleCallback}/>}
            {<Spinner/>}

            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Proceso disciplinario</small></li>
                        <li className="breadcrumb-item">Configuración del calendario</li>
                    </ol>
                </nav>
            </div>

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title"><strong>ADMINISTRACIÓN :: CONFIGURACIÓN DEL CALENDARIO</strong></h3>
                </div>

                <div className="block-content">

                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-primary text-uppercase" role="alert">
                                <p className="mb-0"><strong>Nota: </strong></p>
                                <p className="mb-0"><strong>1.</strong> Los días marcados con color naranja son considerados días no hábiles.</p>
                                <p className="mb-0"><strong>2.</strong> El día marcado con azul hace referencia al día actual.</p> 
                                <p className="mb-0"><strong>3.</strong> Los días si marcar son considerados días hábiles.</p> 
                            </div>
                        </div>
                    </div>

                    <div className="row text-center">

                        <div className="col-md-12">
                            <div className="form-group">

                                <DatePicker
                                    selected={startDate}
                                    inline
                                    monthsShown={3}
                                    renderDayContents={renderDayContents}
                                    locale="es"
                                />
                            </div>
                        </div>
                    </div>

                </div >





            </div >

        </>
    );


    /*const [diasNoLaborablesLista, setDiasNoLaborablesLista] = useState({data: [] });
            const [diasNoLaborablesListaTotal, setDiasNoLaborablesListaTotal] = useState({data: [], links: [], meta: [] });

    useEffect(() => {
                async function fetchData() {
                    cargarDias();
                }
        fetchData();
    }, []);

    const cargarDias = () => {
                window.showSpinner(true);
            GenericApi.getAllGeneric('dias-no-laborales').then(
            datos => {
                if (!datos.error) {
                setDiasNoLaborablesLista(datos);
            setDiasNoLaborablesListaTotal(datos);
            window.showSpinner(false);
                }
            else{
                window.showModal();
            window.showSpinner(false);
                }
                    
            }
            )
    }


    const cambiarEstado = (objeto, estado) => {

        const data = {
                "data": {
                "type": "mas_dependencia_origen",
            "attributes": {
                "fecha": objeto.attributes.fecha,
            "estado": estado,
                }
            }
        }

            GenericApi.updateGeneric('dias-no-laborales', objeto.id, data).then(
            datos => {
                if (!datos.error) {
                cargarDias();
                }
            else
            window.showModal();
            }
            )

    }

    const diasNoLaborables = () => {
        return (
            diasNoLaborablesLista.data.map((diaNoLaborable, i) => {
                return (
            <tr key={diaNoLaborable.id}>
                <td>
                    {moment(diaNoLaborable.attributes.fecha).format("DD/MM/YYYY")}
                </td>
                <td>
                    {diaNoLaborable.attributes.estado == "1" ? 'Activo' : 'Inactivo'}
                </td>
                <td>
                    <Link to={`${diaNoLaborable.id}`}>
                        <button type="button" className="btn btn-primary btn-sm" title='Editar'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                    </Link>
                    {
                        (diaNoLaborable.attributes.estado == 0) ? (

                            <button type='button' title='Activar Antecedente' className='btn btn-sm btn-success' onClick={() => cambiarEstado(diaNoLaborable, 1)}><i className="fas fa-plus-circle"></i></button>

                        ) : null
                    }

                    {
                        (diaNoLaborable.attributes.estado == 1) ? (

                            <button type='button' title='Inactivar Día' className='btn btn-sm btn-danger' onClick={() => cambiarEstado(diaNoLaborable, 0)}><i className="fas fa-minus-circle"></i></button>



                        ) : null
                    }
                </td>
            </tr>
            )
            })
            )
    }

    const handleSearch = (event) => {
        try {
            if ((event.target.value.trim().trim() == "") || (event.target.value.trim().length == 0)) {
                setDiasNoLaborablesLista(diasNoLaborablesListaTotal);
            }
            else {
                var filteredData = {
                data: diasNoLaborablesListaTotal.data.filter(
                        suggestion => ((suggestion.id
            + suggestion.attributes.fecha
            + (suggestion.attributes.estado == "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(event.target.value.toLowerCase()))
            )
                };
            setDiasNoLaborablesLista(filteredData)
            }
        } catch (error) {
                console.error(error);
        }
    };

            return (
            <div className="block block-rounded block-bordered">
                {<InfoErrorApi />}
                {<Spinner />}

                <div className="block block-themed">
                    <div className="col-md-12">
                        <div className="block-content">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <small>Lista de días no laborables</small></li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="block-header">
                        <h3 className="block-title">Días no laborables registrados</h3>
                        <Link to={`/DiasNoLaborables/Add`} >
                            <button type="button" className="btn btn-sm btn-dark mr-1 mb-3"><i className="far fa-plus-square"></i> Agregar día no laborable</button>
                        </Link>
                    </div>
                    <div className="block-content">
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className="form-group ">
                                    <label htmlFor='search'>Buscar: </label>
                                    <input type="text" id="search" name="search" onChange={handleSearch} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                    <thead>
                                        <tr>
                                            <th>Dia No Laborable</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {diasNoLaborables()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )*/
}

export default DiasNoLaborablesLista;