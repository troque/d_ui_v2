import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';
import DataTable from 'react-data-table-component';
import ListaBotones from '../Utils/ListaBotones';
import '../Utils/Constants';
import { quitarAcentos } from '../Utils/Common';
import Spinner from '../Utils/Spinner';


function TipoConductaLista() {

    const [getTipoConductaLista, setTipoConductaLista] = useState({ data: [] });
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getSeach, setSeach] = useState('');

    const [getEstadoLista, setEstadoLista] = useState('1');

    const [getRoutes, setRoutes] = useState({
        crear_registro: "/TipoConducta/Add",
        consultar_registros: "/TipoConducta",
        muestra_atras: false,
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_inactivos: true,
        modulo: "ADMIN_Otros",
    });

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }
    }

    const columns = [
        {
            name: 'NOMBRE',
            selector: TipoConducta => TipoConducta.attributes.nombre,
            sortable: true,
            width: "80%"
        },
        {
            name: 'ESTADO',
            selector: TipoConducta => (TipoConducta.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO'),
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
            window.showSpinner(true);
            GenericApi.getAllGeneric('mas-tipo-conducta').then(
                datos => {
                    if (!datos.error) {
                        setTipoConductaLista(datos); 
                    }
                    else{
                        window.showModal()
                    }
                    window.showSpinner(false);
                }
            )
        }
        fetchData();
    }, []);

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarFormatos(page, perPage);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        // window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //  cargarFormatos(page, newPerPage);

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
                        <li className="breadcrumb-item"> <small>Tipos de conducta</small></li>
                    </ol>
                </nav>
            </div>
        </div>
      {<InfoErrorApi />} 
        
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: TIPOS DE CONDUCTA</h3>
                </div>
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
                                data={getTipoConductaLista.data.filter((suggestion) => {
                                    if (getSeach === "") {
                                        if (suggestion.attributes.estado == getEstadoLista) {
                                            return suggestion;
                                        }
                                    } else if (

                                        ((suggestion.id
                                            + quitarAcentos(suggestion.attributes.nombre)
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
                                paginationTotalRows={getTipoConductaLista.data.length}
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
     </div >
      

        
    )
}

export default TipoConductaLista;