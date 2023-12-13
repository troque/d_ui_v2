import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation , Link } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import DataTable from 'react-data-table-component';
import GenericApi from '../../Api/Services/GenericApi';
import { hasAccess , quitarAcentos } from '../../Utils/Common';
import { ParametroModel } from '../../Models/ParametroModel';

function BuscadorMigracion() {

    const location = useLocation()
    const { from , disable } = location.state;

    const [getColorPrimary, setColorPrimary] = useState("btn btn-sm btn-primary w2d_btn-large mr-1 mb-3 text-left");

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [listaPendientes, setListaPendientes] = useState({ data: [], links: [], meta: [] });
    const [getSeach, setSeach] = useState('');
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);

    const [getValorExpediente , setValorExpediente] = useState("");
    const [getValorVigencia , setValorVigencia] = useState("");

    
    useEffect(() => {
        async function fetchData() {
        }
        fetchData();
    }, []);


    const enviarDatos = (datos) =>{
        window.showSpinner(true);

        let data;

        data = {
            "data":{
                "type":"buscador",
                "attributes": {
                    "radicado": datos.n_expediente,                        
                }
            }
        }

        GenericApi.getByDataGeneric('buscador-migracion', data).then(
            datos => {
                if (!datos.error) {
                    setListaPendientes(datos);
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE", message: "SE ENCONTRARO(N) "+datos.data.length+" COINCIDENCIA(S)", show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else{                     
                    setModalState({ title: "BUSCADOR DE EXPEDIENTE", message: datos.error.toString(), show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

                window.showSpinner(false);
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

    let columns = [

        {
            name: 'ACCIONES',
            cell: pendiente =>
                <div>
                { 
                    (pendiente.attributes.migracion == -1? "NO ES POSIBLE REALIZAR LA MIGRACIÓN"
                        :pendiente.attributes.migracion == 1?
                        <Link to={`/ProcesoDisciplinarioMigracion/${pendiente.attributes.Numero_expediente}/${pendiente.attributes.proceso_disciplinario.attributes.vigencia}`}>
                            <button type="button" className="btn btn-primary mr-2" data-toggle="tooltip" data-html="true" title="Iniciar Migración" 
                            data-original-title="Iniciar Migración"><span className="fas fa-download"> </span></button><br></br>
                            <span>{pendiente.attributes.observacion}</span>
                        </Link>:
                    (hasAccess('MP_RamasProceso', 'Consultar')) && pendiente.attributes.proceso_disciplinario != null ?
                    (
                        <Link to={`/RamasProceso/`} state={{from: new ParametroModel(
                                pendiente.attributes.proceso_disciplinario.attributes.radicado,
                                pendiente.attributes.proceso_disciplinario.id,
                                pendiente.attributes.proceso_disciplinario.attributes.vigencia,
                                (pendiente.attributes.proceso_disciplinario.attributes.evaluacion ? pendiente.attributes.proceso_disciplinario.attributes.evaluacion.id : ""),
                                (pendiente.attributes.proceso_disciplinario.attributes.evaluacion ? pendiente.attributes.proceso_disciplinario.attributes.evaluacion.nombre.toUpperCase() : ""),
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                /*(pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario) ? (pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.nombre?pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.nombre:"") + ' ' + (pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.apellido?pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.apellido:"") : "",*/
                                pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente == null ? "":pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.descripcion,
                                pendiente.attributes.proceso_disciplinario.attributes.created_at,
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_sinproc == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_sinproc.fecha_ingreso,
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_sirius == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_sirius.fecha_ingreso,
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_poder_preferente == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_poder_preferente.fecha_ingreso,    
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_desglose == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_desglose.fecha_ingreso,
                                pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente ? pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.dependencia.nombre : "",
                        )
                        }}>
                            <button type="button" className="btn btn-primary mr-2" data-toggle="tooltip" data-html="true" title="Ver rama del proceso" data-original-title="Ver rama del proceso"><span className="fas fa-search"> </span></button>
                        </Link>
                    ) : null)
                }
                </div>,
            sortable: true,
            wrap: true,
            width: '300px', 
        },

        {
            name: 'DEPENDENCIA',
            selector: pendiente => pendiente.attributes.Dependencia,
            sortable: true,
            wrap: true,
            width: '300px'
        },
        {
            name: 'RADICADO',
            selector: pendiente => pendiente.attributes.Numero_expediente,
            sortable: true,
            wrap: true,
        },
        {
            name: 'VIGENCIA',
            selector: pendiente => pendiente.attributes.proceso_disciplinario==null?null:pendiente.attributes.proceso_disciplinario.attributes.vigencia,
            sortable: true,
            wrap: true,
        },
        {
            name: 'ANTECEDENTE',
            selector: pendiente => pendiente?.attributes?.Asunto_del_expediente ? pendiente?.attributes?.Asunto_del_expediente : pendiente?.attributes?.proceso_disciplinario?.attributes?.ultimo_antecedente?.descripcion,
            sortable: true,
            wrap: true,
            width: '400px',
        },
        {
            name: 'VERSIÓN',
            selector: pendiente => pendiente.attributes.Version,
            sortable: true,
            wrap: true,
        },
        {
            name: 'ETAPA',
            selector: pendiente => pendiente.attributes.Etapa_expediente,
            sortable: true,
            wrap: true,
        },
        {
            name: 'ESTADO',
            selector: pendiente => pendiente.attributes.Estado_expediente,
            sortable: true,
            wrap: true,
            width: '150px',
        },       
        {
            name: 'ENTIDAD ORIGEN',
            selector: pendiente => pendiente?.attributes?.proceso_disciplinario?.attributes?.dependencia_registro?.nombre,
            sortable: true,
            wrap: true,
            width: '300px',
        },
        {
            name: 'NOMBRE DEL INTERESADO',
            selector: pendiente => pendiente?.attributes?.Nombre_interesado,
            sortable: true,
            wrap: true,
            width: '300px',
        },
        {
            name: 'IDENTIFICACIÓN DEL INTERESADO',
            selector: pendiente => pendiente?.attributes?.Identificacion_interesado,
            sortable: true,
            wrap: true,
            width: '300px',
        },
        {
            name: 'TIPO DE INTERESADO',
            selector: pendiente => pendiente?.attributes?.Tipo_interesado,
            sortable: true,
            wrap: true,
            width: '300px',
        },        
        {
            name: 'TIPO DE CONDUCTA',
            selector: pendiente => pendiente?.attributes?.Tipo_conducta,
            sortable: true,
            wrap: true,
            width: '300px',
        },
        {
            name: 'UBICACIÓN DEL EXPEDIENTE',
            selector: pendiente => pendiente?.attributes?.Ubicacion_actual,
            sortable: true,
            wrap: true,
            width: '300px',
        },
        {
            name: 'CARGO',
            selector: pendiente => pendiente?.attributes?.Cargo_interesado,
            sortable: true,
            wrap: true,
            width: '300px',
        },
        {
            name: 'TIPO DE PROCESO',
            selector: pendiente => pendiente?.attributes?.proceso_disciplinario?.attributes?.nombre_tipo_expediente,
            sortable: true,
            wrap: true,
            width: '300px',
        },
        {
            name: 'ACCIONES',
            cell: pendiente =>
                <div>
                { 
                    (pendiente.attributes.migracion == -1? "NO ES POSIBLE REALIZAR LA MIGRACIÓN"
                        :pendiente.attributes.migracion == 1?
                        <Link to={`/ProcesoDisciplinarioMigracion/${pendiente.attributes.Numero_expediente}/${pendiente.attributes.proceso_disciplinario.attributes.vigencia}`}>
                            <button type="button" className="btn btn-primary mr-2" data-toggle="tooltip" data-html="true" title="Iniciar Migración" 
                            data-original-title="Iniciar Migración"><span className="fas fa-download"> </span></button><br></br>
                            <span>{pendiente.attributes.observacion}</span>
                        </Link>:
                    (hasAccess('MP_RamasProceso', 'Consultar')) && pendiente.attributes.proceso_disciplinario != null ?
                    (
                        <Link to={`/RamasProceso/`} state={{from: new ParametroModel(
                                pendiente.attributes.proceso_disciplinario.attributes.radicado,
                                pendiente.attributes.proceso_disciplinario.id,
                                pendiente.attributes.proceso_disciplinario.attributes.vigencia,
                                (pendiente.attributes.proceso_disciplinario.attributes.evaluacion ? pendiente.attributes.proceso_disciplinario.attributes.evaluacion.id : ""),
                                (pendiente.attributes.proceso_disciplinario.attributes.evaluacion ? pendiente.attributes.proceso_disciplinario.attributes.evaluacion.nombre.toUpperCase() : ""),
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                getColorPrimary,
                                /*(pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario) ? (pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.nombre?pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.nombre:"") + ' ' + (pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.apellido?pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.usuario.apellido:"") : "",*/
                                pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente == null ? "":pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.descripcion,
                                pendiente.attributes.proceso_disciplinario.attributes.created_at,
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_sinproc == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_sinproc.fecha_ingreso,
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_sirius == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_sirius.fecha_ingreso,
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_poder_preferente == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_poder_preferente.fecha_ingreso,    
                                pendiente.attributes.proceso_disciplinario.attributes.proceso_desglose == null ? "" : pendiente.attributes.proceso_disciplinario.attributes.proceso_desglose.fecha_ingreso,
                                pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente ? pendiente.attributes.proceso_disciplinario.attributes.ultimo_antecedente.dependencia.nombre : "",
                        )
                        }}>
                            <button type="button" className="btn btn-primary mr-2" data-toggle="tooltip" data-html="true" title="Ver rama del proceso" data-original-title="Ver rama del proceso"><span className="fas fa-search"> </span></button>
                        </Link>
                    ) : null)
                }
                </div>,
            sortable: true,
            wrap: true,
            width: '300px',    
        }

    ];


    /* Termino de agregar imputs */

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if(name == "n_expediente"){
            setValorExpediente( target.value );
        }else if(name == "Vigencia"){
            setValorVigencia( target.value );
        }
    }


    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    n_expediente: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    
                    let errores = {}

                    if (!valores.n_expediente) {
                        errores.n_expediente = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {

                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="w2d_block">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <small>Buscador del expediente en el sistema de migración</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">BUSCADOR DEL EXPEDIENTE EN EL SISTEMA DE MIGRACIÓN</h3>
                            </div>


                            <div className="block-content">

                                <div className="row">
                                    <div className='col-md-12'>
                                        <div className="alert alert-primary alert-dismissable" role="alert">
                                        <h3 className="alert-heading font-size-h4 my-2">INFORMACIÓN</h3>
                                        <p className="mb-0"><span className="fas fa-download"> </span>: EL PROCESO PUEDE SER MIGRADO </p>
                                        <p className="mb-0"><span className="fas fa-search"> </span>: EL PROCESO YA FUE MIGRADO AL SISTEMA.</p>
                                    </div>
                            </div>

                                    {from != "" ? (
                                        <div className='col-md-12 text-right my-2'>
                                            <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from , disable: disable }}>
                                                <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                            </Link>
                                        </div>
                                    ) : null}


                                    <div className='col-md-3'>
                                        <div className="form-group">
                                            <label htmlFor="n_expediente">NÚMERO DEL EXPEDIENTE</label>
                                            <Field as="input" type="text" className="form-control" id="n_expediente" name="n_expediente" autocomplete="off"></Field>
                                            <ErrorMessage name="n_expediente" component={() => (<span className="text-danger">{errors.n_expediente}</span>)} />
                                        </div>
                                    </div>

                                    <div className='col-md-3'>
                                        <br/>
                                        <button type="submit" className="btn btn-primary mb-3" >BUSCAR</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </Form>
                )}
            </Formik>

            <Formik
                initialValues={{
                    rango: ''
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}
                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {

                    enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>
                        <div className="block block-themed">

                            
                            <div className="block-content">

                                <div className="table-responsive">
                                   
                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                        
                                        columns={columns}   

                                        data={listaPendientes.data.filter((suggestion) => {
                                            if (getSeach === "") {
                                                return suggestion;
                                            } else if (

                                                ((quitarAcentos(suggestion.attributes.Asunto_del_expediente) + quitarAcentos(suggestion.attributes.Dependencia)
                                                    + quitarAcentos(suggestion.attributes.Estado_expediente) + quitarAcentos(suggestion.attributes.Etapa_expediente) +
                                                    quitarAcentos(suggestion.attributes.Nombre_interesado) + quitarAcentos(suggestion.attributes.Numero_expediente)
                                                    + quitarAcentos(suggestion.attributes.Auto)).toLowerCase().includes(getSeach.toLowerCase()))

                                            ) {
                                                return suggestion;
                                            }
                                        })}
                                        perPage={perPage}
                                        page={pageActual}
                                        pagination
                                        noDataComponent="Sin datos"
                                        paginationTotalRows={listaPendientes.data.length}
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
                    </Form>
                )}
            </Formik>

            
        </>
    );

}

export default BuscadorMigracion;