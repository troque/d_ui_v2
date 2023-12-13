import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ClasificacionRadicadoApi from '../../Api/Services/ClasificacionRadicadoApi';
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import CierreEtapaApi from '../../Api/Services/CierreEtapaApi';
import { useLocation } from 'react-router-dom'
import { hasAccess } from '../../Utils/Common';
import ListaBotones from '../../Utils/ListaBotones';
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import { quitarAcentos } from '../../../components/Utils/Common';

function TipoConductaLista() {


    const [errorApi, setErrorApi] = useState('');
    const [estadoEtapaCapturaReparto, setEstadoEtapaCapturaReparto] = useState(false);
    const [getEstadoLista, setEstadoLista] = useState('');
    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [tipoConductaLista, setTipoConductaLista] = useState({ data: [], links: [], meta: [] });

    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;


    const columns = [
        {
            name: 'Registra por',
            cell: tipo_conducta => <div>
                <strong>Nombre: </strong>{tipo_conducta.attributes.usuario}<br />
                <strong>Fecha: </strong>{tipo_conducta.attributes.created_at}<br />
                <strong>Etapa: </strong>{tipo_conducta.attributes.etapa.nombre}<br />
                <strong>Dependencia: </strong>{tipo_conducta.attributes.dependencia ? tipo_conducta.attributes.dependencia.nombre : null}<br /></div>,
            selector: tipo_conducta => tipo_conducta.attributes.usuario,
            sortable: true,
            width: "40%"
        },

        {
            name: 'Tipo de Conducta',
            cell: tipo_conducta => tipo_conducta.attributes.tipo_conducta.nombre,
            selector: tipo_conducta => tipo_conducta.attributes.tipo_conducta.nombre,
            sortable: true,
            width: "40%"
        },


        {
            name: 'Descripción',
            cell: tipo_conducta => tipo_conducta.attributes.descripcion,
            selector: tipo_conducta => tipo_conducta.attributes.descripcion,
            sortable: true,
            width: "20%"
        },

    ];


    const [getRoutes, setRoutes] = useState({
        id_etapa: from.idEtapa,
        crear_registro: "/TipoConductaProcesoForm",
        consultar_registros: "/TipoConductaProcesoLista",
        funcionalidad_crear: "Crear",
        funcionalidad_consultar: "Consultar",
        muestra_atras: true,
        muestra_inactivos: false,
    });

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            setEstadoLista("Activos")
            cargarTiposDeConducta();

        }
        fetchData();
    }, []);

    const cargarTiposDeConducta = () => {

        const data = {
            "data": {
                "type": "tipo_conducta_proceso_disciplinario",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId
                }
            }
        }
        // console.log(JSON.stringify(data));

        GenericApi.getByDataGeneric('tipo-conducta/get-conducta-by-id-proceso-disciplinario/' + procesoDisciplinarioId, data).then(
            datos => {
                if (!datos.error) {
                    setTipoConductaLista(datos)
                    window.showSpinner(false);
                }
                else {
                    setErrorApi(datos.error.toString())
                    window.showSpinner(false);
                    window.showModal()
                }
            }
        )

    }

    const handlePageChange = page => {
        //window.showSpinner(true);
        setPageActual(page);
        //cargarClasificaciones(page, perPage, (getEstadoLista == "Inactivos" ? '0' : "1"));
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        //window.showSpinner(true);
        setPerPage(newPerPage);
        setPageActual(page);
        //cargarClasificaciones(page, newPerPage, (getEstadoLista == "Inactivos" ? '0' : "1"));

    }

    const handleCallback = (childData) => {
        try {
            window.showSpinner(true);
            setEstadoLista(childData == global.Constants.ESTADOS.INACTIVO ? "Inactivos" : "Activos")
            cargarTiposDeConducta(1, paganationPerPages, childData);
        } catch (error) {

        }
    }

    return (
        <>
            <Spinner />
            <Formik>
                <Form>

                    <div className="w2d_block let">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb breadcrumb-alt push">
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                                <li className="breadcrumb-item"> <small>Tipos de conducta</small></li>
                            </ol>
                        </nav>
                    </div>


                    <div className="block block-themed">
                        <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                            <h3 className="block-title text-uppercase">SINPROC No {radicado} :: <strong>CONSULTAR LISTA DE TIPOS DE CONDUCTA {getEstadoLista}</strong></h3>
                        </div>

                        <div className="block-content">
                            <>


                                <div className='row'>

                                    <div className='col-md-3'>
                                        <div className="form-group ">
                                            <Field type="text" id="search" name="search" value={getSeach} onChange={e => setSeach(e.target.value)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className="form-control border border-success" placeholder="Buscar" />

                                        </div>
                                    </div>

                                    <ListaBotones getRoutes={getRoutes} from={from} disable={disable} parentCallback={handleCallback} id="botonesNavegacion" name="botonesNavegacion" />

                                </div>



                                {

                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase"
                                        columns={columns}
                                        data={tipoConductaLista.data.filter((suggestion) => {
                                            if (getSeach === "") {
                                                return suggestion;
                                            } else if (

                                                ((quitarAcentos(suggestion.attributes.etapa.nombre) +
                                                    quitarAcentos(suggestion.attributes.tipo_conducta.nombre) +
                                                    quitarAcentos(suggestion.attributes.usuario) +
                                                    suggestion.attributes.created_at
                                                ).toLowerCase().includes(getSeach.toLowerCase()))

                                            ) {
                                                return suggestion;
                                            }
                                        })}
                                        perPage={perPage}
                                        page={pageActual}
                                        pagination
                                        noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                        paginationTotalRows={tipoConductaLista.data.length}
                                        onChangePage={handlePageChange}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        defaultSortFieldId="Nombre"
                                        striped
                                        paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                        defaultSortAsc={false}
                                    />

                                }
                            </>
                        </div>
                    </div>
                </Form>
            </Formik>
        </>
    );

}
export default TipoConductaLista;
