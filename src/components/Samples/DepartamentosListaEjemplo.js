import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import ApiSamples from "./../Api/Services/SamplesApi";

function DepartamentosListaEjemplo() {

    const [departamentosLista, setDepartamentosLista] = useState({ data: [], links: [], meta: [] });

    useEffect(() => {
        async function fetchData() {
            ApiSamples.getAllDepartamentos().then(
                datos => !datos.error ? setDepartamentosLista(datos) : window.showModal()
            )
        }
        fetchData();
    }, []);

    const departamentos = () => {
        return(
            departamentosLista.data.map((departamento, i) => {
                return (                
                    <tr key={departamento.id}>
                        <td className="text-center">{departamento.id}</td>
                        <td className="font-w600">
                            {departamento.attributes.codigo_dane}
                        </td>
                        <td>
                            {departamento.attributes.nombre}
                        </td>
                        <td>
                            <Link to={`${departamento.id}`}>
                                <button type="button" className="btn btn-warning mr-1 mb-3">
                                    <i className="fa fa-fw fa-edit"></i>
                                </button>
                            </Link>
                            <button type="button" className="btn btn-danger mr-1 mb-3">
                                <i className="fa fa-fw fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                )
            })
        )
    }

    const paginacion = () => {

        const links = Object.assign([] , departamentosLista.meta.links);
        const items = links.map((link, i) => {
            return (
                <li key={i} className={`paginate_button page-item ${link.active && link.label ? 'active' : ''}`}>
                    <button onClick={handlePaginacion.bind(this, link.url)} aria-controls="DataTables_Table_3" data-dt-idx="1" tabIndex="0" className="page-link">{link.label === '&laquo; Previous' ? <i className="fa fa-angle-left"></i> : link.label === 'Next &raquo;' ? <i className="fa fa-angle-right"></i> : link.label}</button>
                </li>
            )
        })

        return(
            <div className="row">
                <div className="col-md-6">
                    <div className="dataTables_info" id="DataTables_Table_3_info" role="status" aria-live="polite">
                        Page <strong>1</strong> de <strong>4</strong>
                    </div>
                </div>
                <div className="col-md-6 text-rigth">
                    <div className="dataTables_paginate paging_simple_numbers">
                        <ul className="pagination">
                            { items }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    const handlePaginacion = (url) => {
        //evt.preventDefault();
        ApiSamples.getAllDepartamentosPaginacion(url).then(
            datos => !datos.error ? setDepartamentosLista(datos) : window.showModal()
        )
    }

    return (          
        <div className="block block-rounded block-bordered">
            { <InfoErrorApi /> }
            <div className="block-header block-header-default">
                <h3 className="block-title">Lista de departamentos</h3>
                <Link to={`${'agregar'}`}>
                    <button type="button" className="btn btn-primary mr-1 mb-3">
                        <i className="fa fa-fw fa-plus mr-1"></i> Agregar
                    </button>
                </Link>
            </div>                
            <div className="block-content block-content-full">
                <div className="row">
                    <div className="col-sm-12">
                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                            <thead>
                                <tr>
                                    <th className="text-center">No</th>
                                    <th>Código DANE</th>
                                    <th>Departamento</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { departamentos() }
                            </tbody>
                        </table>
                    </div>
                </div>
                { paginacion() }
            </div>
        </div>
    )
}

export default DepartamentosListaEjemplo;