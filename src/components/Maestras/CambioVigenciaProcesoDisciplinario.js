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
import ModalInfo from '../Utils/Modals/ModalInformacion';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ModalGen from '../Utils/Modals/ModalGeneric';

function CambioVigenciaProcesoDisciplinario() {

    // Se inicializan las variables
    const [getProcesoDisciplinario, setProcesoDisciplinario] = useState({});
    const [modalState, setModalState] = useState({ title: "", message: "", show: false });
    
    const [getRadicado, setRadicado] = useState('');
    const [getVigencia, setVigencia] = useState('');
    const [getListaVigencias, setListaVigencias] = useState([]);
    const [getResultadoNotificacionesLista, setResultadoNotificacionesLista] = useState(false);

    // Se inicializan las rutas
    const [getRoutes, setRoutes] = useState({
        crear_registro: "/PortalNotificaciones/Add",
        consultar_registros: "/PortalNotificaciones",
        id_etapa: global.Constants.ETAPAS.NINGUNA,
        muestra_activos: true,
        muestra_inactivos: true,
        muestra_atras: false,
        ocultar_agregar: true,
        modulo: 'ADMIN_PortalWeb'
    });

    // Metodo encargado de realizar la primera peticion del formulario
    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true)
            getApiVigencia()
        }
        fetchData();
    }, []);

    const getApiVigencia = () => {
        GenericApi.getGeneric("vigencia?estado=1").then(
            datos => {
                if (!datos.error) {
                    setListaVigencias(datos)
                }
                else {
                    setModalState({ title: "PROCESO DISCIPLINARIO", message: datos.error.toString().toUpperCase(), show: true, redirect: '/ProcesoDisciplinario', alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }

    const buscarProcesoDisciplinario = () => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('cambio-etapa/obtener-proceso/'+getRadicado+'/'+getVigencia).then(
            datos => {
                if (!datos.error) {
                    setResultadoNotificacionesLista(true)
                    setProcesoDisciplinario(datos)
                } else {
                    window.showModal();
                    setResultadoNotificacionesLista(false)
                }
                window.showSpinner(false);
            }
        )
    }

    const selectVigencia = () => {
        return (
            getListaVigencias.data.map((vigencia, i) => {
                if(vigencia.attributes.vigencia != getVigencia){
                    return (
                        <option key={vigencia.id} value={vigencia.attributes.vigencia}>{vigencia.attributes.vigencia}</option>
                    )
                }
            })
        )
    }

    const enviarDatos = (valores) => {
        window.showSpinner(true);
        GenericApi.getAllGeneric('proceso-diciplinario/actualizar-vigencia/'+getProcesoDisciplinario.data.id+'/'+valores.vigencia).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN :: CAMBIAR VIGENCIA", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    setModalState({ title: "ADMINISTRACIÓN :: CAMBIAR VIGENCIA", message: datos.error.toString().toUpperCase(), show: true, redirect: null, alert: global.Constants.TIPO_ALERTA.ERROR });
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
                        <li className="breadcrumb-item"><small>Administración</small></li>
                        <li className="breadcrumb-item"><small>Proceso Disciplinario</small></li>
                        <li className="breadcrumb-item"><small>Cambiar vigencia</small></li>
                    </ol>
                </nav>
            </div>
            {<InfoErrorApi />}
            {<Spinner />}
            <ModalGen data={modalState} />
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: CAMBIAR VIGENCIA</h3>
                </div>
                <div className="block-content">
                    <div className='col-md text-right ms-auto'>
                        <Link to='/PortalNotificaciones/Add'>
                            <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus"></i> </button>
                        </Link>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="descripcion">RADICADO <span className="text-danger">*</span></label>
                                <input type="text" id="radicado" name="radicado" onChange={e => setRadicado(e.target.value)} className="form-control border border-success" placeholder="Radicado" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="descripcion">VIGENCIA <span className="text-danger">*</span></label>
                                <input type="text" id="vigencia" name="vigencia" onChange={e => setVigencia(e.target.value)} className="form-control border border-success" placeholder="Vigencia" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <br></br>
                                <button type="button" className="btn btn-primary" onClick={() => buscarProcesoDisciplinario()} disabled={!getRadicado || !getVigencia}>
                                    <i className="fa fa-fw fa-search"></i> BUSCAR
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        getResultadoNotificacionesLista
                        ?
                            (
                                getProcesoDisciplinario?.data?.id
                                ?
                                    <>
                                        <Formik
                                            initialValues={{
                                                vigencia: '',
                                            }}
                                            enableReinitialize
                                            validate={(valores) => {

                                                // Se inicializa el array
                                                let errores = {};

                                                // Se valida que tenga un archivo valido
                                                if (!valores.vigencia) {
                                                    // Se setea el mensaje de error
                                                    errores.vigencia = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                                                }

                                                // Se retornan los errores
                                                return errores;
                                            }}
                                            onSubmit={(valores, { resetForm }) => {
                                                enviarDatos(valores)
                                            }}
                                        >
                                            {({ errors }) => (
                                                <Form>
                                                    <>
                                                        <div className="form-group">
                                                            <label htmlFor="vigencia">VIGENCIA <span className="text-danger">*</span></label>
                                                            <Field as="select" className="form-control" id="vigencia" name="vigencia">
                                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                { selectVigencia() }
                                                            </Field>
                                                            <ErrorMessage name="vigencia" component={() => (<span className="text-danger">{errors.vigencia}</span>)} />
                                                        </div>
                                                        <div className="block-content block-content-full text-right">
                                                            <button type="submit" className="btn btn-rounded btn-primary">CAMBIAR</button>
                                                        </div>
                                                    </>
                                                </Form>
                                            )}
                                        </Formik>
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

export default CambioVigenciaProcesoDisciplinario;