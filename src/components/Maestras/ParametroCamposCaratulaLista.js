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

function ParametroCamposCaratulaLista() {

    const [getParametroCamposCaratulaLista, setParametroCamposCaratulaLista] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({
        crear_registro: "/ParametroCamposCaratula/Add",
        consultar_registros: "/ParametroCamposCaratula",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: 'ADMIN_Caratula'
        
    });

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }

    }

    const getListaValorParametro =
        [
            { value: 'Sinproc', label: 'N° de Sinproc' },
            { value: 'Antecedentes', label: 'Listado de antecedentes' },
            { value: 'Usuario', label: 'Nombre de usuario' },
            { value: 'Dependencia', label: 'Dependencia de registro' },
            { value: 'Vigencia', label: 'Vigencia' },
            { value: 'Fecha Registro', label: 'Fecha de Registro' },
            { value: 'Fecha Ingreso', label: 'Fecha de Ingreso' },
            { value: 'Generado', label: 'Nombre de usuario actual' }
        ];

    const columns = [
        {
            name: 'NOMBRE DEL PARÁMETRO',
            selector: p => p.attributes.nombre_campo ? "${"+p.attributes.nombre_campo+"}" : "",
            sortable: true,
        },
        {
            name: 'VALOR DEL PARÁMETRO',
            selector: p => p.attributes.type ? validarNombreParametro(p.attributes.type).toUpperCase() : "",
            sortable: true,
        },
        {
            name: 'ESTADO',
            selector: p => (p.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
        },
        {
            name: 'ACCIONES',
            cell: p =>
                <div>
                    <Link to={`/ParametroCamposCaratula/${p.id}`} state={{ from: p }}>
                        <button type="button" className="btn btn btn-primary" title='Editar'>
                            <i className="fa fa-fw fa-edit"></i>
                        </button>
                    </Link>
                </div>,
            width: "10%"
        }
    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarParametroCamposCaratula(1, paganationPerPages);
        }
        fetchData();
    }, []);

    const validarNombreParametro = (type) => {

        // Se declara la variable
        var valor = "";

        // Se filtra el valor para retornar el label
        let valorEncontrado = getListaValorParametro.filter((e) => {

            // Se valida que el parametro sea igual al tipo
            if (e.value == type) {

                // Se retorna el valor
                return e.label;
            }
        });

        // Se valida que el valor encontrado contenga un label
        if (valorEncontrado.length > 0) {

            // Se asigna el valor al label
            valor = valorEncontrado[0].label;
        }

        // Se retorna
        return valor;
    }

    const cargarParametroCamposCaratula = (page, perPage) => {
        GenericApi.getAllGeneric('parametro_campos_caratula').then(
            datos => {
                if (!datos.error) {
                    setParametroCamposCaratulaLista(datos);
                    window.showSpinner(false);
                } else {
                    window.showModal();
                    window.showSpinner(false);
                }
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

    return (
        <div>
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Carátula</small></li>
                        <li className="breadcrumb-item"> <small>Parámetricas</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: CARÁTULA :: LISTA DE PARÁMETROS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVOS" : "ACTIVOS"}</h3>
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
                                data={getParametroCamposCaratulaLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre_campo)
                                            + quitarAcentos(suggestion.attributes.type)
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
                                paginationTotalRows={getParametroCamposCaratulaLista.data.length}
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

export default ParametroCamposCaratulaLista;