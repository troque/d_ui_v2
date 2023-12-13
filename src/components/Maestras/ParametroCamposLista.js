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

function ParametroCamposActuacionesLista() {

    const [getParametroCamposActuacionesLista, setParametroCamposActuacionesLista] = useState({ data: [] });
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({
        crear_registro: "/ParametroCampos/Add",
        consultar_registros: "/ParametroCampos",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: 'ADMIN_Actuaciones',
        ocultar_agregar: true
    });

    const getListaValorParametro =
        [
            { value: 'Antecedentes', label: 'LISTADO DE ANTECENDENTES' },
            { value: 'Dependencia', label: 'DEPENDENCIA DE REGISTRO' },
            { value: 'Investigado', label: 'LISTADO DE NOMBRES DEL INVESTIGADO' },
            { value: 'Cargo', label: 'LISTADO DE CARGOS DEL INVESTIGADO' },
            { value: 'Entidad', label: 'LISTADO DE ENTIDADES DEL INVESTIGADO' },
            { value: 'Interesados', label: 'LISTADO DE INTERESADOS' },
            { value: 'Fecha de Ingreso', label: 'FECHA DE INGRESO' },
            { value: 'Fecha de Registro', label: 'FECHA DE REGISTRO' },
            { value: 'Número de auto (generado despues de aprobación)', label: 'NÚMERO DE AUTO (GENERADO DESPUÉS DE LA APROBACIÓN' },
            { value: 'Sinproc', label: 'NÚMERO DEL RADICADO' },
            { value: 'Dependencia Origen', label: 'NOMBRE DE LA DEPENDENCIA' },
            { value: 'Delegada', label: 'NOMBRE DE LA DELEGADA' },
            { value: 'Radicacion', label: 'NÚMERO DEL RADICADO' },
        ];

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }

    }

    const columns = [
        {
            name: 'VALOR DEL PARÁMETRO',
            selector: p => p.attributes.type ? "${"+p.attributes.type+"}" : "",
            sortable: true,
        },
        {
            name: 'DESCRIPCIÓN DEL PARÁMETRO',
            selector: p => p.attributes.nombre_campo,
            sortable: true,
        },
        {
            name: 'ESTADO',
            selector: p => (p.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
            sortable: true,
        },
    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            cargarParametroCamposCaratula(1, paganationPerPages);
        }
        fetchData();
    }, []);

    const validarNombreParametro = (type, nombreParametro) => {

        // Se declara la variable
        var valor = "";

        // Se filtra el valor para retornar el label
        let valorEncontrado = getListaValorParametro.filter((e) => {

            // Se valida que el parametro sea igual al tipo
            if (type == e.value) {

                // Se retorna el valor
                return e;
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
        GenericApi.getAllGeneric('parametro-campos').then(
            datos => {
                if (!datos.error) {
                    setParametroCamposActuacionesLista(datos);
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
            <div className="w2d_block">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Actuaciones</small></li>
                        <li className="breadcrumb-item"> <small>Gestión de Parámetricas</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: ACTUACIONES :: PARAMÉTRICAS {getEstadoLista == global.Constants.ESTADOS.INACTIVO ? "INACTIVAS" : "ACTIVAS"}</h3>
                </div>
                <div className="block-content">
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className="form-group ">
                                <input type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                columns={columns}
                                data={getParametroCamposActuacionesLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (
                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre_campo)
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
                                paginationTotalRows={getParametroCamposActuacionesLista.data.length}
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

export default ParametroCamposActuacionesLista;