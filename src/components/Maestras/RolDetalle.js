import React, { useEffect, useState } from 'react';
import 'rhfa-emergency-styles/dist/styles.css'
import Spinner from '../Utils/Spinner';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, } from "react-router-dom";
import { useParams } from "react-router";
import GenericApi from '../Api/Services/GenericApi';
import ModalGen from '../Utils/Modals/ModalGeneric';


function RolDetalle() {

    const [getNombre, setNombre] = useState('');

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });


    const [getListaFuncionalidades, setListaFuncionalidades] = useState({ data: {} });
    const [getRespuestaFuncionalidades, setRespuestaFuncionalidades] = useState(false);
    const [getFuncionalidadesAsociadas, setFuncionalidadesAsociadas] = useState([]);

    const [listaGrupoModulos, setListaGrupoModulos] = useState({ data: [], links: [], meta: [] });
    const [rtaListaGrupoModulo, setRtaListaGrupoModulo] = useState(false);
    const [getRepuestaNombre, setRepuestaNombre] = useState(true);

    let { id } = useParams();

    
    useEffect(() => {
        window.showSpinner(true);
        async function fetchData() {
            getUserById();
        }

        fetchData();
    }, []);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "nombre") {
            if (value === '' || 
            (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value) && 
            value.length <= 255)) {
                setNombre(value);
                setRepuestaNombre(true);
            }else{
                setRepuestaNombre(false);
            }
        }

    }

    const getUserById = () => {
        GenericApi.getByIdGeneric('role', id).then(
            datos => {

                if (!datos.error) {

                    if (datos["data"] != "") {
                        setNombre(datos["data"]["attributes"]["nombre"]);
                       
                        if (datos["data"]["attributes"]["ids_funcionalidades"]) {

                            datos["data"]["attributes"]["ids_funcionalidades"].split(',').map((funcId, i) => {
                                setFuncionalidadesAsociadas(oldArray => [...oldArray, funcId]);
                            });

                        }

                        getAllFuncionalidades();    


                    }
                    else {
                        setModalState({ title: "ADMINISTRACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                        window.showSpinner(false);
                    }
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);

                }
               
            }
        )
    }


    const getAllFuncionalidades = () => {

        GenericApi.getAllGeneric('modulo/get-modulos').then(
            datos => {
                if (!datos.error) {
    
                    setListaFuncionalidades(datos)
                    setRespuestaFuncionalidades(true);
                    getAllGruposModulos();
          
                }
                else{
                    setModalState({ title: "ADMINISTRACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }  
            }
        )
       
    }


    const getAllGruposModulos = () => {

        GenericApi.getGeneric('modulo/get-modulo-grupo').then(
            datos => {
                if (!datos.error) {
    
                    setListaGrupoModulos(datos);
                    setRtaListaGrupoModulo(true);
                }
                else{
                    setModalState({ title: "ADMINISTRACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });                   
                } 
               
                window.showSpinner(false);
            }
        )
       
    }

    

    const enviarDatos = () => {
        window.showSpinner(true);
        let data;

        data = {

            "data": {
                "type": "usuario",
                "attributes": {

                    "nombre": getNombre ? getNombre : "",
                    "funcionalidades": getFuncionalidadesAsociadas,

                }
            }
        }


        // console.log(JSON.stringify(data));

        GenericApi.updateGeneric('role', id, data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "ADMINISTRACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: `/Rol`, alert: global.Constants.TIPO_ALERTA.EXITO });        
                }
                else {
                    setModalState({ title: "ADMINISTRACIÓN", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }


    const validarValorCheck = (funcionalidadId) => {

        if(funcionalidadId !== undefined){

            var i;

            for (i = 0; i < getFuncionalidadesAsociadas.length; i++) {

                if(getFuncionalidadesAsociadas[i] == funcionalidadId){
                    return true;
                }                 
            } 
            return false;  
        }      
    }

    const agregarCheck = (e, funcionalidadId) => {

        if (e == true) {
            setFuncionalidadesAsociadas(oldArray => [...oldArray, funcionalidadId]);
        }
        else {

            // console.log(JSON.stringify(getFuncionalidadesAsociadas));
            var index = getFuncionalidadesAsociadas.indexOf(funcionalidadId);
            //console.log(index);
            if (index !== -1) {
                getFuncionalidadesAsociadas.splice(index, 1);
            }
        }
    }

    const listarFuncionalidades = () => {

        return (
            <>
            <div className='row'>

                <table className="table table-bordered table-vcenter">
                    <thead>
                        <tr  className="background-grey">
                            <th>
                            </th>
                            <th className='text-center'>MÓDULO</th>
                            <th className='text-center'>CONSULTAR</th>
                            <th className='text-center'>CREAR</th>
                            <th className='text-center'>ACTIVAR / INACTIVAR</th>
                            <th className='text-center'>GESTIONAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaGrupoModulos.data.map((grupo, i) => {
                            return (
                                <>
                                     <tr className="background-blue">
                                        <td colspan="2">{grupo.attributes.nombre}</td>  
                                        <td>CONSULTAR</td>
                                        <td>CREAR</td>   
                                        <td>ACTIVAR / INACTIVAR</td>
                                        <td>GESTIONAR</td>
                                    </tr>
                                    {getListaFuncionalidades.data.map((modulo,i) => {
                                        return (
                                            ( grupo.id === modulo.attributes.id_mas_grupo ?
                                                <tr>
                                                    <td>
                                                        <button type="button" class="btn btn-link" data-toggle="tooltip" data-placement="right" title={modulo.attributes.mensaje_ayuda}>
                                                            <i class="fas fa-info-circle"></i>
                                                        </button>
                                                    </td>

                                                    <td>{modulo.attributes.nombre_mostrar}</td>
                                                    <td className='text-center'>
                                                        {modulo.attributes.funcionalidades.map((funcionalidad, i) => {
                                                            return (
                                                                modulo.id === funcionalidad.id_modulo && funcionalidad.nombre === "Consultar" ?<Field type="checkbox"  checked={validarValorCheck(funcionalidad.id)} name={"check_consultar"+funcionalidad.id} id={"check_consultar"+funcionalidad.id} onClick={e => agregarCheck(e.target.checked, funcionalidad.id.toString())} />:null
                                                               
                                                                )

                                                        })}
                                                    </td>
                                                    <td className='text-center'>
                                                        {modulo.attributes.funcionalidades.map((funcionalidad, i) => {
                                                            return (
                                                                modulo.id === funcionalidad.id_modulo && funcionalidad.nombre === "Crear" ?<Field type="checkbox" checked={validarValorCheck(funcionalidad.id)}  name={"check_crear"+funcionalidad.id} id={"check_crear"+funcionalidad.id} onClick={e => agregarCheck(e.target.checked, funcionalidad.id.toString())} />:null
                                                            )

                                                        })}
                                                    </td>
                                                    <td className='text-center'>
                                                        {modulo.attributes.funcionalidades.map((funcionalidad, i) => {
                                                            return (                                                                
                                                                modulo.id === funcionalidad.id_modulo && funcionalidad.nombre === "Inactivar" ?<Field type="checkbox" checked={validarValorCheck(funcionalidad.id)}  name={"check_inactivar"+funcionalidad.id} id={"check_inactivar"+funcionalidad.id} onClick={e => agregarCheck(e.target.checked, funcionalidad.id.toString())} />:null
                                                            )

                                                        })}
                                                    </td>
                                                    <td className='text-center'>
                                                        {modulo.attributes.funcionalidades.map((funcionalidad, i) => {
                                                            return (
                                                                modulo.id === funcionalidad.id_modulo && funcionalidad.nombre === "Gestionar" ?<Field type="checkbox" checked={validarValorCheck(funcionalidad.id)}  name={"check_gestionar"+funcionalidad.id} id={"check_gestionar"+funcionalidad.id} onClick={e => agregarCheck(e.target.checked, funcionalidad.id.toString())} />:null
                                                            )

                                                        })}
                                                    </td>    
                                                    
                                                </tr>:null
                                            )
                                            
                                           
                                        )})}  
                                                                
                                </>

                            )})}
                    </tbody>
                </table>    

              
            </div>


                                    </>

        )
    }

    const componentFormularioUsuario = () => {

        return (
            <>
                <Formik
                    initialValues={{

                        nombre: '',
                        funcionalidades: ''

                    }}
                    enableReinitialize
                    validate={(valores) => {

                        let errores = {}

                        if(getRepuestaNombre == false){
                            errores.nombre = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                        }
                        if (!getNombre) {
                            errores.nombre = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        if (getFuncionalidadesAsociadas.length == 0) {

                            errores.funcionalidades = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                        }

                        return errores
                    }}
                    onSubmit={(valores, { resetForm }) => {

                        enviarDatos();
                    }}
                >
                    {({ errors }) => (
                        <Form>

                            <div className='row'>

                                <div className="col-md-12">
                                    <div className="block block-themed">
                                        <div className="block-header">
                                            <h3 className="block-title">ADMINISTRACIÓN :: DETALLE DEL ROL</h3>
                                        </div>

                                        <div className="block-content">
                                            <div className="row">

                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor='nombre'>NOMBRE<span className="text-danger">*</span></label>
                                                        <Field value={getNombre} type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre"
                                                            onChange={handleInputChange} />
                                                        <ErrorMessage name="nombre" component={() => (<span className="text-danger">{errors.nombre}</span>)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row" >

                                                <div className="col-md-12" >
                                                    <div className="form-group">
                                                        <label>LISTA DE PERMISOS</label>
                                                    </div>
                                                    <ErrorMessage name="funcionalidades" component={() => (<span className="text-danger">{errors.funcionalidades}</span>)} />
                                                    <div style={{ 'height': 'auto' }}>
                                                        {getRespuestaFuncionalidades ? listarFuncionalidades() : null}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                        <div className="block-content block-content-full text-right bg-light">
                                            <button type="submit" className="btn btn-rounded btn-primary"> {global.Constants.BOTON_NOMBRE.ACTUALIZAR}</button>
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

    return (

        <>
        
            {<Spinner />}
            {<ModalGen data={getModalState} />}

            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <small>Administración</small></li>
                        <li className="breadcrumb-item"> <small>Perfiles</small></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Rol`}><small>Lista de roles</small></Link></li>
                        <li className="breadcrumb-item"> <small> Actualizar rol</small></li>
                    </ol>
                </nav>
            </div>




            <div className="col-md-12">


                {componentFormularioUsuario()}

            </div>



        </>
    )

}
export default RolDetalle;