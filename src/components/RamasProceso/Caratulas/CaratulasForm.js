import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { getUser } from '../../../components/Utils/Common';
import '../../Utils/Constants';
import GenericApi from '../../Api/Services/GenericApi';
import { Link } from "react-router-dom";
import ModalGen from '../../Utils/Modals/ModalGeneric';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import InfoErrorApi from '../../Utils/InfoErrorApi';
import CaratulasParametrosPlantillaForm from '../Herramientas/CaratulasParametrosPlantillaForm';
import Spinner from '../../Utils/Spinner';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function CaratulasForm() {

    const [errorApi, setErrorApi] = useState('');
    const [getCaratula, setCaratula] = useState("");
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getCaratulaId, setCaratulaId] = useState(0);
    const [getCaratulaActual, setCaratulaActual] = useState([]);
    const [getNombreProceso, setNombreProceso] = useState('');


    const location = useLocation();
    const { from } = location.state;

    let radicado = from.radicado;

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            nombreProceso();  
        }
        fetchData();
    }, []);


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso",from.procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                    getAllCaratulas();
                }
            }
        )
    }


    /**
     * Trae la lista de las carátulas.
     */
    const getAllCaratulas = () => {

        GenericApi.getGeneric("caratulas").then(
            datos => {
                if (!datos.error) {

                    // Se valida que hayan datos
                    if (datos.data.length > 0) {

                        // Se setean los valores al array
                        setCaratula(datos.data);

                        // Se setea el valor de la caratula actual
                        setCaratulaActual({ label: datos.data[0].attributes.nombre, value: datos.data[0].id });

                        // Se setea el valor del id
                        setCaratulaId(datos.data[0].id);
                    }

                    // Se deshabilita el cargando
                    window.showSpinner(false);
                } else {
                    setModalState({ title: getNombreProceso + " :: Crear Actuaciones", message: datos.error.toString(), show: true, redirect: '/ActuacionesForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    const onChangeCaratula = (value) => {
        setCaratulaId(value);
    }

    return (
        <>
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            {<Spinner />}

            <Formik
                initialValues={{
                    id_actuacion: '',
                }}
                enableReinitialize
                validate={(valores) => {

                }}
                onSubmit={(valores, { resetForm }) => {
                    //enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>

                        <div className="w2d_block let">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-alt push">
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                                    <li className="breadcrumb-item"> <small>Imprimir carátula</small></li>
                                </ol>
                            </nav>
                        </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso} :: <strong>IMPRIMIR CARÁTULA</strong></h3>
                            </div>

                            <div className="block-content">
                                <div className='text-right'>
                                    <Link to={`/MisPendientes/`} title='Regresar a mis pendientes'>
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            {getCaratula && getCaratula.length > 0 ?
                                                <label htmlFor="id_actuacion">CARÁTULA <span className="text-danger">*</span></label>
                                                : <label style={{ textAlign: 'center' }} htmlFor="informacion">No existe información <span className="text-danger"></span></label>
                                            }
                                            {getCaratula && getCaratula.length > 0 ?
                                                <Select
                                                    placeholder="Selecciona"
                                                    value={getCaratulaActual}
                                                    isDisabled={true}
                                                    noOptionsMessage={() => "Sin datos"}
                                                    options={getCaratula.map(e =>
                                                        ({ label: e.attributes.nombre, value: e.id })
                                                    )}
                                                    onChange={(e) => onChangeCaratula(e.value)}
                                                /> : null
                                            }
                                            <ErrorMessage name="id_actuacion" component={() => (<span className="text-danger">{errors.id_actuacion}</span>)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Cuando cambie el el valor de la caratula a mayor a 1 se coloca el formulario de parametros */}
                                {getCaratulaId > 0 ? <CaratulasParametrosPlantillaForm from={from} caratulaId={getCaratulaId} /> : null}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );

}

export default CaratulasForm;