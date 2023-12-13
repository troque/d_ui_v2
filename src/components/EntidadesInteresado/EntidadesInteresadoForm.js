import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import InfoErrorApi from '../Utils/InfoErrorApi';
import InfoExitoApi from '../Utils/InfoExitoApi';
import InfoCustom from '../Utils/InfoCustom';
import { Link } from "react-router-dom";
import ParametrosMasApi from '../Api/Services/ParametrosMasApi';
import InteresadoEntidadPermitidaApi from '../Api/Services/InteresadoEntidadPermitidaApi';

import { Navigate } from "react-router-dom";
import { useParams } from "react-router";
import Autocomplete from "../Autocomplete/Autocomplete";
import Spinner from '../Utils/Spinner';





function EntidadesInteresadoForm() {

    const [errorApi, setErrorApi] = useState('');
    const [listaEntidad, setListaEntidad] = useState({ data: {} });
    const [respuestaEntidad, setRespuestaEntidad] = useState(false);
    const [isRedirect, setIsRedirect] = useState(false);
    const [idEntidad, setIdEntidad] = useState('');
    const [formIntialValuesInteresado, setFormIntialValuesInteresado] = useState();
    const [respuestaPermitidasTotal, setRespuestaEntidadesPermitidasTotal] = useState(false);
    const [entidadesPermitidasListaTotal, setEntidadesPermitidasListaTotal] = useState({ data: [], links: [], meta: [] });
    /*Redirects*/
    const redirectToRoutes = () => {
        return <Navigate to={`/EntidadesInteresadoLista/`} />;
    }

    useEffect(() => {
        window.showSpinner(true)
        async function fetchData() {

            //window.showSpinner(true);

            ParametrosMasApi.getAllEntidades().then(
                datos => !datos.error ? (setListaEntidad(datos), setRespuestaEntidad(true), console.log(datos)) : window.showModal(1), window.showSpinner(false)
            )

            ParametrosMasApi.getAllEntidadesPermitidasInteresado().then(
                datos => !datos.error ? (setEntidadesPermitidasListaTotal(datos), setRespuestaEntidadesPermitidasTotal(true), window.showSpinner(false)) : window.showModal(1), window.showSpinner(false)
            )

        }
        fetchData();
    }, []);

    const handleCallback = (childData) => {
        try {
            setIdEntidad(childData)
        } catch (error) {

        }

    }


    const enviarDatos = (datos) => {
        window.showSpinner(true);
        let data;
        if (formIntialValuesInteresado) {

            data = {

                "data": {
                    "type": "mas_entidad_permitida",
                    "attributes": {
                        "id_entidad": idEntidad,
                        "estado": 1
                    }
                }
            }
        }

        let yaExiste = false;
        entidadesPermitidasListaTotal.data.forEach(element => {

            if (element["attributes"]["id_entidad"] == idEntidad) {

                yaExiste = true;
            }

        });

        if (yaExiste == false) {
            InteresadoEntidadPermitidaApi.addInteresadoEntidadPermitida(data).then(
                datos => {

                    if (!datos.error) {
                        window.showModal(2)
                        setIsRedirect(true);
                        window.showSpinner(false)
                    }
                    else {
                        //console.log("hay error");
                        // console.log(datos.error);
                        window.showModal(1)
                        window.showSpinner(false)
                    }
                    //window.showSpinner(false);
                }
            )
        }
        else {
            window.showModal(5)
            window.showSpinner(false)
        }



    }

    return (
        <>
            {<Spinner />}
            {isRedirect ? redirectToRoutes() : null}
            {<InfoErrorApi error={errorApi} />}
            {<InfoExitoApi />}
            {<InfoCustom mensaje={"Esta entidad ya existe en el listado"} />}
            <Formik
                initialValues={{
                    idEntidad: idEntidad ? idEntidad : '',
                }}
                enableReinitialize
                validate={(valores) => {

                    setFormIntialValuesInteresado(valores);

                    let errores = {}

                    if (idEntidad == '') {
                        errores.idEntidad = 'Debe seleccionar una entidad'
                    }

                    return errores
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

                                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/EntidadesInteresadoLista`}><small>Lista entidades permitidas</small></Link></li>
                                        <li className="breadcrumb-item"> <small>Crear entidad permitida</small></li>
                                    </ol>
                                </nav>
                            </div>
                      


                        <div className="block block-rounded block-bordered">

                            <div className="block-content block-content-full">
                                <div className="row">

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor='idEntidad'>Seleccionar Entidad <span className="text-danger">*</span></label>

                                            <Autocomplete suggestions={listaEntidad} parentCallback={handleCallback} />

                                            <ErrorMessage name="idEntidad" component={() => (<span className="text-danger">{errors.idEntidad}</span>)} />
                                        </div>

                                    </div>


                                </div>

                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary"> Registrar</button>
                                <Link to={'/EntidadesInteresadoLista/'} title='Regresar'>
                                                <button type="button" className="btn btn-rounded btn-outline-primary"> Cancelar</button>
                                            </Link>
                            </div>

                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )

}

export default EntidadesInteresadoForm;