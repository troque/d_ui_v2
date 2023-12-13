import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import Spinner from '../Utils/Spinner';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';

function ActuacionesAdminLista() {
    const [actuacionesLista, setActuacionesLista] = useState({ data: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({

        crear_registro: "/ActuacionesAdministracion/Add",
        consultar_registros: "/ActuacionesAdministracion",
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        modulo: "Actuaciones",
        muestra_atras: false,
        ocultar_agregar: false,
        
    });

    const handleCallback = (childData) => {
        try {

            setEstadoLista(childData)
        } catch (error) {

        }

    }

    const etapasValidar = [
        // { id: 0, nombre: "FORMA DE INGRESO" },
        // { id: 1, nombre: "CAPTURA Y REPARTO" },
        // { id: 2, nombre: "EVALUACIÓN QUEJA PQR" },
        { id: 3, nombre: "EVALUACIÓN QUEJA - PD" },
        { id: 4, nombre: "INDAGACIÓN PREVIA" },
        { id: 5, nombre: "INVESTIGACIÓN DISCIPLINARIA" },
        { id: 6, nombre: "JUZGAMIENTO - P. ORDINARIO" },
        { id: 7, nombre: "JUZGAMIENTO - P. VERBAL" },
        { id: 8, nombre: "SEGUNDA INTANCIA (PERSONERIA AUXILIAR, JURIDICA)" },
        // { id: 9, nombre: "INICIO PROCESO DISCIPLINARIO" }
    ];

    const validarNombreEtapas = (etapas) => {

        // Se inicializa la variable
        var retornaEtapasValidar = "";

        // Se valida que exista etapas
        if (etapas) {

            // Se quitan las comas
            let auxEtapaSplit = etapas.split(",");

            // Se recorre el array de etapas
            for (let index = 0; index < auxEtapaSplit.length; index++) {

                // Se captura el elemento por posicion
                const element = auxEtapaSplit[index];

                // Se valida el elemento y se retorna el valor con el array de las etapas
                const validar = etapasValidar.filter(item => item.id == element);
                
                if(validar.length > 0){
                    // Se captura el nombre de las etapas
                    const nombreEtapa = validar[0].nombre;

                    if (retornaEtapasValidar == "") {
                        retornaEtapasValidar = nombreEtapa;
                    } else{
                        // Se concadena el nombre al string
                        retornaEtapasValidar += ", " + nombreEtapa;
                    }
                }
            }
        }

        // Se retorna el valor en nombre de las etapas
        return retornaEtapasValidar;
    }

    const columns = [
        {
            name: 'INFORMACIÓN DE LA ACTUACIÓN',
            selector: mas_actuaciones =>
                <div className='mb-3'>
                    <strong>NOMBRE DE LA ACTUACIÓN:</strong> {mas_actuaciones.attributes.nombre_actuacion ? mas_actuaciones.attributes.nombre_actuacion.toUpperCase() : "-"}<br />
                    <strong>ETAPA DESPUÉS DE LA APROBACIÓN:</strong> { mas_actuaciones.attributes.etapa_siguiente ? 'SI' : 'NO'}<br />
                    <strong>ANULA OTRAS ACTUACIONES:</strong> {mas_actuaciones.attributes.despues_aprobacion_listar_actuacion == "1" ? 'SI' : 'NO'} <br />
                    <strong>TIPO DE ACTUACIÓN:</strong> {(mas_actuaciones.attributes.tipo_actuacion == "0" ? "ACTUACIÓN" : (mas_actuaciones.attributes.tipo_actuacion == "1" ? 'IMPEDIMENTO' : 'COMISORIO'))} <br />
                    <strong>EXCLUYENTE:</strong> {(mas_actuaciones.attributes.excluyente == "1" ? 'SI' : 'NO')} <br />
                    <strong>CIERRA PROCESO:</strong> {(mas_actuaciones.attributes.cierra_proceso == "1" ? 'SI' : 'NO')} <br />
                    <strong>VISIBLE:</strong> {(mas_actuaciones.attributes.visible == "1" ? 'SI' : 'NO')} <br />
                    <strong>GENERA AUTO:</strong> {(mas_actuaciones.attributes.generar_auto == "1" ? 'SI' : 'NO')}
                </div>,
            sortable: true,
            width: '50%'
        },
        {
            name: 'ESTADO',
            selector: mas_actuaciones => (mas_actuaciones.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
            width: "25%"
        },
        {
            name: 'ACCIONES',
            cell: row => <div><Link to={`${row.id}`} state={{ from: row }}>
                <button type="button" className="btn btn btn-primary" title='Editar'>
                    <i className="fa fa-fw fa-edit"></i>
                </button>
            </Link></div>,
            width: "25%"
        }
    ];


    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarActuaciones(1, paganationPerPages);
        }
        fetchData();
    }, []);


    const cargarActuaciones = (page, perPage) => {

        //GenericApi.getAllGeneric('departamento/departamento-paginate' + '/' + page + '/' + perPage).then(
        GenericApi.getAllGeneric('mas_actuaciones').then(
            datos => {
                if (!datos.error) {
                    setActuacionesLista(datos);
                    window.showSpinner(false);
                }
                else {
                    window.showModal()
                    window.showSpinner(false);
                }
            }
        )
    }

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarDepartamentos(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarDepartamentos(page, newPerPage)

    }

    return (
        <div>
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Actuaciones</small></li>
                        <li className="breadcrumb-item"> <small>Gestión de actuaciones</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: ACTUACIONES  {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVAS" : "ACTIVAS"}</h3>
                </div>
                <div className="block-content">
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className="form-group ">
                                <input type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                            </div>
                        </div>
                        <ListaBotones getRoutes={getRoutes} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />

                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                columns={columns}

                                data={actuacionesLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        quitarAcentos(suggestion.attributes.nombre_actuacion).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase()))
                                            && (suggestion.attributes.estado == getEstadoLista)
                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={actuacionesLista.data.length}
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
        </div>
    )
}

export default ActuacionesAdminLista;