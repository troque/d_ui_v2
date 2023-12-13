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

function PortalLogLista() {

    const [getInfoUsuario, setInfoUsuario] = useState();
    const [getPortalLogLista, setPortalLogLista] = useState();
    const [getResultadoPortalLogLista, setResultadoPortalLogLista] = useState(false);
    const [getCedula, setCedula] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [getEstadoLista, setEstadoLista] = useState('1');

    const handleCallback = (childData) => {
        try {
            setEstadoLista(childData)
        } catch (error) {

        }

    }

    const columns = [
        {
            name: 'FECHA',
            selector: p => p.attributes.fecha_registro ? p.attributes.fecha_registro : "",
            sortable: true,
            width: '20%'
        },
        {
            name: 'ACTIVIDAD USUARIO',
            selector: p => p.attributes.detalle ? p.attributes.detalle : "",
            sortable: true,
        }
    ];

    useEffect(() => {
        async function fetchData() {
        }
        fetchData();
    }, []);

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    const buscarUsuario = () => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('portal-log/buscar-usuario-log/'+getCedula).then(
            datos => {
                if (!datos.error) {
                    setResultadoPortalLogLista(true)
                    setInfoUsuario(datos.usuario)
                    setPortalLogLista(datos.log);
                } else {
                    window.showModal();
                    setResultadoPortalLogLista(false)
                }
                window.showSpinner(false);
            }
        )
    }

    return (
        <div>
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Portal Web</small></li>
                        <li className="breadcrumb-item"> <small>Log</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: PORTAL WEB :: LOG</h3>
                </div>
                <div className="block-content">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="descripcion">NÚMERO IDENTIFICACIÓN <span className="text-danger">*</span></label>
                                <input type="text" id="search" name="search" onChange={e => setCedula(e.target.value)} className="form-control border border-success" placeholder="Número identificación" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <button type="button" className="btn btn-primary" onClick={() => buscarUsuario()} disabled={!getCedula}>
                                    <i className="fa fa-fw fa-search"></i> BUSCAR
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        getResultadoPortalLogLista
                        ?
                            (
                                getPortalLogLista
                                ?
                                    <>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <table className='table table-bordered table-striped table-vcenter js-dataTable-full'>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <label>NOMBRE: </label> {getInfoUsuario.nombre}
                                                            </td>
                                                            <td>
                                                                <label>CORREO: </label> {getInfoUsuario.email}
                                                            </td>
                                                        </tr>                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase"
                                                    columns={columns}
                                                    data={getPortalLogLista.filter((suggestion) => {
                                                        if (getCedula === "") {
                                                            if (suggestion.attributes.estado == getEstadoLista) {
                                                                return suggestion;
                                                            }
                                                        } else if (
                                                            ((suggestion.id
                                                                + quitarAcentos(suggestion.attributes.created_at)
                                                                + quitarAcentos(suggestion.attributes.informacion_interesado.interesado)
                                                                + quitarAcentos(suggestion.attributes.detalle)
                                                                + (suggestion.attributes.estado == "1" ? 'ACTIVO' : 'INACTIVO')).toLowerCase().includes(quitarAcentos(getCedula.toLowerCase()))
                                                                && (suggestion.attributes.estado == getEstadoLista))
                                                        ) {
                                                            return suggestion;
                                                        }
                                                    })}
                                                    perPage={perPage}
                                                    page={pageActual}
                                                    pagination
                                                    noDataComponent="Sin datos"
                                                    paginationTotalRows={getPortalLogLista.length}
                                                    onChangePage={handlePageChange}
                                                    onChangeRowsPerPage={handlePerRowsChange}
                                                    defaultSortFieldId="Nombre"
                                                    striped
                                                    paginationComponentOptions={{ rowsPerPageText: 'Filas por página' }}
                                                    defaultSortAsc={false}
                                                />
                                            </div>
                                        </div>
                                    </>
                                :
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <p className='text-center'><label>NO SE ENCONTRARON DATOS</label></p>
                                        </div>
                                    </div>
                            )
                        :
                            null
                    }
                </div>
            </div>
        </div>
    )
}

export default PortalLogLista;