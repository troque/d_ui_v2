import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import moment from 'moment';
import 'moment/locale/es';
import DataTable from 'react-data-table-component';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';

function ParametroLista() {
    const [parametroLista, setParametroLista] = useState({ data: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');

    const columns = [
        {
            name: 'MÓDULO',
            selector: ciudad => ciudad.attributes.modulo,
            sortable: true,
            width: "40%"
        },
        {
            name: 'NOMBRE',
            selector: ciudad => ciudad.attributes.nombre,
            sortable: true,
            width: "40%"
        },
        {
            name: 'VALOR',
            selector: ciudad => ciudad.attributes.valor,
            sortable: true,
            width: "10%"
        },
        {
            name: 'ACCIONES',


            cell: row => <div><Link to={`${row.id}`}>
                <button type="button" className="btn btn btn-primary" title='Editar'>
                    <i className="fa fa-fw fa-edit"></i>
                </button>
            </Link></div>,
            width: "10%"
        }
    ];

    useEffect(() => {
        async function fetchData() {
            cargarParametros(1, paganationPerPages);
        }
        fetchData();
    }, []);

    const cargarParametros = (page, perPage) => {

        window.showSpinner(true);
        //GenericApi.getAllGeneric('parametro/parametro-paginate' + '/' + page + '/' + perPage).then(
        GenericApi.getAllGeneric('parametro').then(
            datos => {
                if (!datos.error) {
                    setParametroLista(datos);
                }
                else{
                    window.showModal()
                }                
                window.showSpinner(false);
            }
        )
    }

    const handlePageChange = page => {
        setPageActual(page);
        //cargarParametros(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {

        setPerPage(newPerPage);
        setPageActual(page);
        //cargarParametros(page, newPerPage);

    }

    return (
        <div>

            {<Spinner />}
            
            <div className="col-md-12">
                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <small>Administrador</small></li>
                            <li className="breadcrumb-item"> <small>Otros</small></li>
                            <li className="breadcrumb-item"> <small>Parámetros del sistema</small></li>
                        </ol>
                    </nav>
                </div>
            </div>

            {<InfoErrorApi />}

            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: PARÁMETROS DEL SISTEMA</h3>
                </div>
                <div className="block-content">
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className="form-group ">
                                <input type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                columns={columns}

                                data={parametroLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        return suggestion;
                                    } else if (

                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.modulo)
                                            + quitarAcentos(suggestion.attributes.nombre)
                                            + quitarAcentos(suggestion.attributes.valor)
                                        ).toLowerCase().includes(quitarAcentos(getSeach.toLowerCase())))

                                    ) {
                                        return suggestion;
                                    }
                                })}
                                perPage={perPage}
                                page={pageActual}
                                pagination
                                noDataComponent="Sin datos"
                                paginationTotalRows={parametroLista.data.length}
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

export default ParametroLista;