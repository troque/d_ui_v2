import React, { useEffect, useState, } from 'react';
import { ErrorMessage, Form, Field, Formik } from 'formik';
import { Link } from 'react-router-dom';
import Spinner from '../../Utils/Spinner';
import GenericApi from './../../Api/Services/GenericApi';
import '../../Utils/Constants';
import { getUser } from '../../Utils/Common';
import InfoErrorApi from '../../Utils/InfoErrorApi';

function TrasladoProcesos() {

    const [errorApi, setErrorApi] = useState('');
    const [formIntialValuesTraslado, setFormIntialValuesTraslado] = useState();
    const [getListaUsuarios, setListaUsuarios] = useState({ data: {} });
    const [getRespuestaUsuarios, setRespuestaUsuarios] = useState(false);

    const columns = [

    ];

    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            obtenerUsuarios()
        }
        fetchData();
    }, []);

    /**
     * LLAMADO DE FUNCIONES AL SERVIDOR
    */

    //Obtener la información de una actuacion
    const obtenerUsuarios = () => {
        GenericApi.getGeneric('usuario/get-all-usuarios-dependencia/' + getUser().id_dependencia).then(
            datos => {
                if (!datos.error) {
                    setListaUsuarios(datos)
                } else {
                    setErrorApi(datos.error.toString())
                    window.showModal(1)
                }
                window.showSpinner(false)
            }
        )
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);
        let data;
        if (formIntialValuesTraslado) {

            data = {

                "data": {
                    "type": "user",
                    "attributes": {
                        "nombre": formIntialValuesTraslado ? (formIntialValuesTraslado.nombre ? formIntialValuesTraslado.nombre : '') : '',
                        "apellido": formIntialValuesTraslado ? (formIntialValuesTraslado.apellido ? formIntialValuesTraslado.apellido : '') : '',
                        "id_dependencia": getUser().id_dependencia
                    }
                }
            }
        }


        console.log(JSON.stringify(data));

        GenericApi.getByDataGeneric('usuario/usuario-filter', data).then(
            datos => {

                console.log(JSON.stringify(datos));

                if (!datos.error) {
                    setListaUsuarios(datos);
                    setRespuestaUsuarios(true);
                }
                else {
                    setErrorApi(datos.error.toString().toUpperCase())
                    // console.log(datos.error);
                    window.showModal(1)
                }
                window.showSpinner(false);
            }
        )
    }


    const listarCoincidencias = () => {


        if (getListaUsuarios != null && typeof (getListaUsuarios) != 'undefined') {
            return (

                getListaUsuarios.data.map((usuario, i) => {
                    return (

                        <tr key={usuario.id}>
                            <td>{usuario.attributes.nombre.toUpperCase()}</td>
                            <td>{usuario.attributes.apellido.toUpperCase()}</td>
                            <td>{usuario.attributes.email.toUpperCase()}</td>
                            <td>{usuario.attributes.dependencia.nombre.toUpperCase()}</td>
                            <td>
                                <Link to={`/CasosActivos/${usuario.attributes.name}`} state={{ data: usuario }}>
                                    <button type='button' data-dismiss="modal" className='btn btn-rounded btn-primary' >VER CASOS ACTIVOS</button>
                                </Link>
                            </td>
                        </tr >
                    )
                })
            )
        }
    }

    return (
        <>
            <Spinner />
            <InfoErrorApi error={errorApi} />
            <Formik
                initialValues={{
                    selectUsuario: '',
                    nombre: '',
                    apellido: '',
                }}
                enableReinitialize
                validate={(valores) => {
                    setFormIntialValuesTraslado(valores);
                    let errores = {}

                    if (!valores.nombre && !valores.apellido) {
                        errores.nombre = 'Debe ingresar nombre o apellido'
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
                                    <li className="breadcrumb-item"> <small>Administración</small></li>
                                    <li className="breadcrumb-item"> <small>Traslado de casos</small></li>
                                </ol>
                            </nav>
                        </div>


                        <div className="block block-themed">

                            <div className="block-header">
                                <h3 className="block-title">ADMINISTRACIÓN :: TRASLADO DE PROCESOS</h3>
                            </div>

                            <div className="block-content block-content-full">
                                <div className="block-content block-content-full text-center"><div className="row">
                                    <div className="col-md-12 text-center mb-3">
                                        <label>PASO 1. SELECCIONE EL USUARIO QUE DESEA CONSULTAR:</label>
                                    </div>
                                </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            {
                                                getListaUsuarios.data.length > 0
                                                ?
                                                    <div className="row mt-2">
                                                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                            <thead>
                                                                <tr>
                                                                    <th>NOMBRE</th>
                                                                    <th>APELLIDO</th>
                                                                    <th>CORREO</th>
                                                                    <th>DEPENDENCIA</th>
                                                                    <th>ACCIONES</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody >
                                                                { listarCoincidencias() }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                : 
                                                    <label className="text-danger">NO SE ENCONTRARON USUARIOS HABILITADOS O ASIGNADOS A LA DEPENDENCIA { getUser().nombre_dependencia.nombre }</label>
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
    )

}

export default TrasladoProcesos;