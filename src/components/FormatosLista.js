import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../Utils/InfoErrorApi';
import GenericApi from '../Api/Services/GenericApi';
import 'moment/locale/es';

function FormatosLista() {
    const [formatosLista, setFormatosLista] = useState({ data: [] });
    const [formatosListaTotal, setFormatosListaTotal] = useState({ data: [], links: [], meta: [] });

    useEffect(() => {
        async function fetchData() {
            GenericApi.getAllGeneric('mas-formato').then(
                datos => {
                    if (!datos.error) {
                        setFormatosLista(datos);
                        setFormatosListaTotal(datos);
                    }
                    else
                        window.showModal()
                }
            )
        }
        fetchData();
    }, []);

    const formatos = () => {
        return (
            formatosLista.data.map((formato, i) => {
                return (
                    <tr key={formato.id}>
                        <td className="text-center">{formato.id}</td>
                        <td>{formato.attributes.nombre}</td>
                        <td>
                            {formato.attributes.estado == "1" ? 'Activo' : 'Inactivo'}
                        </td> 
                        <td>
                            <Link to={`${formato.id}`}>
                                <button type="button" className="btn btn-primary" title='Editar'>
                                    <i className="fa fa-fw fa-edit"></i>
                                </button>
                            </Link> 
                            {/* <button type="button" className="btn btn-danger mr-1 mb-3">
                                <i className="fa fa-fw fa-trash-alt"></i>
                            </button> */}
                        </td>
                    </tr>
                )
            })
        )
    }

    const handleSearch = (event) => {
        try {
            if ((event.target.value.trim().trim() == "") || (event.target.value.trim().length == 0)) {
                setFormatosLista(formatosListaTotal);
            }
            else {
                var filteredData = {
                    data: formatosListaTotal.data.filter(
                        suggestion => ((suggestion.id
                            + quitarAcentos(suggestion.attributes.nombre)
                            + (suggestion.attributes.estado == "1" ? 'Activo' : 'Inactivo')).toLowerCase().includes(event.target.value.toLowerCase()
                        ))
                    )
                };
                setFormatosLista(filteredData)
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="block block-rounded block-bordered">
            {<InfoErrorApi />}

            <div className="block block-themed">
                <div className="col-md-12">
                    <div className="block-content">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <small>Lista de Formatos</small></li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="block-header">
                    <h3 className="block-title">Formatos registrados</h3>
                </div>
                <div className="block-content">
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className="form-group ">
                                <label htmlFor='search'>Buscar: </label>
                                <input type="text" id="search" name="search" onChange={handleSearch} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />
                            </div>
                        </div>

                        <div className='col-md-9 text-right'>
                            <Link to={`/Formatos/Add`} >
                                <button type="button" className="btn btn btn-success mr-1 mb-3"><i className="fas fa-plus"></i></button>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                <thead>
                                    <tr>
                                        <th className="text-center">Id</th>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formatos()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormatosLista;