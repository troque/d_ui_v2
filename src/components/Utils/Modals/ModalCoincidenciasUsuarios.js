import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import GenericApi from '../../Api/Services/GenericApi';
import { quitarAcentos } from '../../../components/Utils/Common';

function ModalCoincidenciasUsuarios(props) {

    const [getCoincidenciasListaSearch, setCoincidenciasListaSearch] = useState([]);
    const [getCoincidenciasListaTotal, setCoincidenciasListaTotal] = useState([]);
    const [getNombre, setNombre] = useState('');

    useEffect(() => {
    })

    const inicilizarDatos = () => {
        setNombre("");
    }

    const buscarUsuario = () => {

        window.showSpinner(true)
        try {

            if (getNombre != "") {
                GenericApi.getByIdGeneric('Auth/users', getNombre).then(
                    datos => {
                        if (!datos.error) {
                            if (datos.length > 0) {
                                //console.log(datos);
                                setCoincidenciasListaSearch(datos);
                                setCoincidenciasListaTotal(datos);
                                window.showSpinner(false);
                            }
                            else {
                                window.showSpinner(false);
                            }
                        }
                        else {
                            window.showSpinner(false);
                        }
                    }

                )


            }
            else {
                inicilizarDatos();
            }

        } catch (ex) {
            console.error("Ocurrio este error " + ex);
            inicilizarDatos();
        }


    }

    const handleSearch = (event) => {

        try {
            if ((event.target.value.trim().trim() == "") || (event.target.value.trim().length == 0)) {

                setCoincidenciasListaSearch(getCoincidenciasListaTotal);
            }
            else {

                setCoincidenciasListaSearch(getCoincidenciasListaTotal.filter(
                    suggestion => ((quitarAcentos(suggestion.apellido)
                        + quitarAcentos(suggestion.displayName) + quitarAcentos(suggestion.email) +
                        quitarAcentos(suggestion.name) + quitarAcentos(suggestion.nombre)
                    ).toLowerCase().includes(event.target.value.toLowerCase()))
                ));
            }
        } catch (error) {
            console.error(error);
        }

    };

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombre") {
            if (value === '' || 
            (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value) && 
            value.length <= 255)) {
                setNombre(value);
            }
        }


    }

    const listarCoincidencias = () => {


        if (getCoincidenciasListaSearch != null && typeof (getCoincidenciasListaSearch) != 'undefined') {
            return (

                getCoincidenciasListaSearch.map((coincidencia, i) => {
                    return (
                        cuerpoTabla(coincidencia)
                    )
                })
            )
        }
        else {
            return (

                getCoincidenciasListaSearch.map((coincidencia, i) => {
                    return (
                        cuerpoTabla(coincidencia)
                    )
                })
            )
        }

    }

    const seleccionarUsuario = (e) => {
        props.parentCallback(e);
    }

    const cuerpoTabla = (coincidencia) => {
        return (

            <tr key={coincidencia.name}>
                <td className='text-uppercase'>{coincidencia.nombre}</td>
                <td className='text-uppercase'>{coincidencia.apellido}</td>
                <td>{coincidencia.identificacion}</td>
                <td>{coincidencia.email}</td>
                <td>{coincidencia.name}</td>

                <td> <button type='button' data-dismiss="modal" className='btn btn-rounded btn-primary' onClick={() => seleccionarUsuario(coincidencia)}>ASIGNAR</button></td>
            </tr>
        )
    }


    return (
        <>
            <Formik
                initialValues={{
                    informacion: '',
                }}
                enableReinitialize
                validate={(valores) => {

                    let errores = {}

                    return errores
                }}
                onSubmit={(valores, { resetForm }) => {

                    //enviarDatos(valores);
                }}
            >

                {({ errors }) => (
                    <Form>

                        <div className="modal fade" id="modal-block-popout-coincidencias-usuario" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                            <div className="modal-dialog modal-lg" role="document" >
                                <div className="modal-content" >
                                    <div className="block block-themed block-transparent mb-0">
                                        <div className="block-header bg-primary-dark">
                                            <h3 className="block-title text-uppercase">SELECCIONAR USUARIO</h3>

                                            <div className="block-options">
                                                <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                    <i className="fa fa-fw fa-times"></i>
                                                </button>
                                            </div>
                                        </div>



                                        <div className="block-content">
                                            <label  htmlFor='nombre'>ESCRIBA EL NOMBRE DEL USUARIO QUE DESEA BUSCAR EN EL DIRECTORIO ACTIVO </label>
                                            <div className="row">
                                                <div className="col-md-8">

                                                    <div className="form-group">
                                                        <Field value={getNombre} type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre"
                                                            onChange={handleInputChange} />
                                                        <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <button type="button" className="btn btn-primary" onClick={() => buscarUsuario()}>
                                                            <i className="fa fa-fw fa-search"></i> BUSCAR
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (getCoincidenciasListaSearch.length > 0) ? (
                                                    <div>

                                                        <span>SE HAN ENCONTRADO LAS SIGUIENTES COINCIDENCIAS, SELECCIONE EL USUARIO CON EL QUE DESEA CREAR EL REGISTRO.</span>

                                                        <div className="row" >
                                                            <div className="col-md-12" style={{ 'height': '300px', 'overflow': 'scroll', 'display': 'block' }}>
                                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>NOMBRE</th>
                                                                            <th>APELLIDO</th>
                                                                            <th>IDENTIFICACIÓN</th>
                                                                            <th>EMAIL</th>
                                                                            <th>USUARIO</th>
                                                                            <th>ACCIONES</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody >
                                                                        {listarCoincidencias()}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>


                                                    </div>
                                                ) : null
                                            }

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default ModalCoincidenciasUsuarios;
