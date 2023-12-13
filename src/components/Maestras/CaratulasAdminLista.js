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

// Clase
function CaratulasAdminLista() {

    // Constantes de la clase
    const [getCaratulasLista, setCaratulasLista] = useState({ data: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');
    const [getEstadoLista, setEstadoLista] = useState('1');
    const [getMostrarBotonAgregar, setMostrarBotonAgregar] = useState(false);
    /*const [getRoutes, setRoutes] = useState({
        crear_registro: "/CaratulasAdminForm/Add",
        consultar_registros: "/CaratulasAdminForm",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
    });*/

    // Metodo encargado de cargar la informacion de la pagina
    useEffect(() => {

        // Se llama la funcion
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se cargan las caratulas
            cargarCaratulas(1, paganationPerPages);
        }

        // Se llama la funcion encargada de traer la informacion
        fetchData();
    }, []);


    // Metodo encargado de cargar la caratula
    const cargarCaratulas = (page, perPage) => {

        // Se consume la API
        GenericApi.getAllGeneric('caratulas').then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se valida que cuando hay una caratula o más no deje añadir mas´
                    if (datos.data.length >= 1) {

                        // Se setea en true
                        setMostrarBotonAgregar(true);
                    }

                    // Se setea la informacion
                    setCaratulasLista(datos);

                    // Se quita el cargando
                    window.showSpinner(false);
                } else {

                    // Se muestra el modal
                    window.showModal();

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            }
        )
    }

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {
        }
    }

    // Metodo encargado de generar las columnas de la tabla
    const columns = [
        {
            name: 'NOMBRE DE LA CARÁTULA',
            selector: caratulas =>
                <div className='mb-3'>
                    {caratulas.attributes.nombre ? caratulas.attributes.nombre : "-"}
                </div>,
            sortable: true,
            width: '20%'
        },

        {
            name: 'NOMBRE DEL DOCUMENTO',
            selector: caratulas =>
                <div className='mb-3'>
                    {caratulas.attributes.nombre_plantilla ? caratulas.attributes.nombre_plantilla : "-"}
                </div>,
            sortable: true,
            width: '50%'
        },

        {
            name: 'ACCIONES',
            cell: row =>
                <div>
                    <Link to={`/CaratulasAdminForm/${row.id}`} state={{ from: row }}>
                        <button type="button" className="btn btn btn-primary" title='Editar'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                    </Link>
                </div>,
            width: "25%"
        }
    ];

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
                        <li className="breadcrumb-item"> <small>Carátula</small></li>
                        <li className="breadcrumb-item"> <small>Plantilla</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: CARÁTULA :: PLANTILLA DE LA CARÁTULA</h3>
                </div>
                <div className="block-content">
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className="form-group ">
                                <input type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                            </div>
                        </div>
                        {/*<ListaBotones getRoutes={getRoutes} mostrarBotonAgregar={getMostrarBotonAgregar} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />*/}

                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                columns={columns}
                                data={getCaratulasLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        ((quitarAcentos(suggestion.id)
                                            + quitarAcentos(suggestion.attributes.nombre)
                                            + quitarAcentos(suggestion.attributes.nombre_plantilla)
                                            + (suggestion.attributes.estado == "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase()))
                                            && (suggestion.attributes.estado == getEstadoLista))
                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={getCaratulasLista.data.length}
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

export default CaratulasAdminLista;