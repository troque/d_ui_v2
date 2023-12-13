import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { getUser } from '../../Utils/Common';
import { useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import { useParams } from "react-router";
import Spinner from '../../Utils/Spinner';
import Center from '../../Utils/Styles/Center.js'
import moment from 'moment';

function DatoInteresadoMigracionForm() {

    const [getLista, setLista] = useState({ title: "", message: "", show: false });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
   

    let { radicado, vigencia, item } = useParams();

    const [tipoInteresado, setTipoInteresado] = useState('');
    const [tipoSujetoProcesal, setTipoSujetoProcesal] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [numeroDocumento, setNumeroDocumento] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [telefono2, setTelefono2] = useState('');
    const [profesion, setProfesion] = useState('');
    const [idOrientacionSexual, setIdOrientacionSexual] = useState('');
    const [idSexo, setIdSexo] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [direccion, setDireccion] = useState('');
    const [nombreEntidad, setNombreEntidad] = useState('');
    const [sectorEntidad, setSectorEntidad] = useState('');
    

    const [getListaTipoDocumento, setListaTipoDocumento] = useState({ data: {} });
    const [existeListaTipoDocumento, setExisteListaTipoDocumento] = useState(false);

    const [getListaSexo, setListaSexo] = useState({ data: {} });
    const [existeListaSexo, setExisteListaSexo] = useState(false);

    const [getListaOrientacionSexual, setListaOrientacionSexual] = useState({ data: {} });
    const [existeListaOrientacionSexual, setExisteListaOrientacionSexual] = useState(false);

    const [getListaTipoInteresado, setListaTipoInteresado] = useState({ data: {} });
    const [existeTipoInteresado, setExisteTipoInteresado] = useState(false);

    const [getListaSujetoProcesal, setListaSujetoProcesal] = useState({ data: {} });
    const [existeSujetoProcesal, setExisteSujetoProcesal] = useState(false);

    const [getListaDepartamentos, setListaDepartamentos] = useState({ data: {} });
    const [existeDepartamento, setExisteDepartamento] = useState(false);

    const [getListaCiudades, setListaCiudades] = useState({ data: {} });
    const [existeCiudad, setExisteCiudad] = useState(false);

    const [getListaLocalidad, setListaLocalidad] = useState({ data: {} });
    const [existeLocalidad, setExisteLocalidad] = useState(false);

    const [getListaEntidad, setListaEntidad] = useState({ data: {} });
    const [existeEntidad, setExisteEntidad] = useState(false);

    const [existeTempPD, setExisteTempPD] = useState(false);

    const [getMigrado, setMigrado] = useState(null);


    useEffect(() => {
        async function fetchData() {
            window.showSpinner(true);
            lista();
            
        }
        fetchData();
    }, []);

    const lista= () => {
        try {

            //buscamos el parametro
            GenericApi.getGeneric("migracion-interesado/"+radicado+"/"+vigencia+"/"+item).then(
                datos => {

                    if (!datos.error) {
                        setLista(datos);
                        setMigrado(datos.data[0].attributes.migrado);
                        listaTiposDocumentos();
                    } else {
                        setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                   
                }
            )
        } catch (error) {
        }
    }



    const listaTiposDocumentos = () => {
        try {

            GenericApi.getGeneric("tipo-documento").then(
                datos => {

                    if (!datos.error) {
                        setListaTipoDocumento(datos);
                        setExisteListaTipoDocumento(true);
                        sexo();
                    } 
                }
            )
        } catch (error) {
        }
    }



    const sexo = () => {
        try {

            GenericApi.getGeneric("sexo").then(
                datos => {

                    if (!datos.error) {
                        setListaSexo(datos);
                        setExisteListaSexo(true);
                        orientacionSexual();
                    } 
                }
            )
        } catch (error) {
        }
    }


    const orientacionSexual = () => {
        try {

            GenericApi.getGeneric("orientacion-sexual").then(
                datos => {

                    if (!datos.error) {
                        setListaOrientacionSexual(datos);
                        setExisteListaOrientacionSexual(true);
                        listaTipoInteresado_();
                    } 
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }


    const listaTipoInteresado_ = () => {
        try {

            GenericApi.getGeneric("tipo-interesado").then(
                datos => {

                    if (!datos.error) {
                        setListaTipoInteresado(datos);
                        setExisteTipoInteresado(true);
                        listaSujetoProcesal();
                    } 
                }
            )
        } catch (error) {
        }
    }


    const listaSujetoProcesal = () => {
        try {

            GenericApi.getGeneric("tipo-sujeto-procesal").then(
                datos => {

                    if (!datos.error) {
                        setListaSujetoProcesal(datos);
                        setExisteSujetoProcesal(true);
                        ciudades();
                    }
                }
            )
        } catch (error) {
        }
    }

    const ciudades = () => {
        try {

            GenericApi.getGeneric("ciudad").then(
                datos => {

                    if (!datos.error) {
                        setListaCiudades(datos);
                        setExisteCiudad(true);
                        localidades();
                    } 
                }
            )
        } catch (error) {
        }
    }

    const localidades = () => {
        try {

            GenericApi.getGeneric("mas-localidad").then(
                datos => {

                    if (!datos.error) {
                        setListaLocalidad(datos);
                        setExisteLocalidad(true);
                        departamentos();
                    } 
                }
            )
        } catch (error) {
        }
    }


    const departamentos = () => {
        try {

            GenericApi.getGeneric("departamento").then(
                datos => {

                    if (!datos.error) {
                        setListaDepartamentos(datos);
                        setExisteDepartamento(true);
                        entidades();
                    } 
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }


    const entidades = () => {
        try {

            GenericApi.getGeneric("tipo-entidad").then(
                datos => {

                    if (!datos.error) {
                        setListaEntidad(datos);
                        setExisteEntidad(true);
                        getInfoDatosInteresados();
                    } 
                }
            )
        } catch (error) {
        }
    }

    const getInfoDatosInteresados = () => {
        try {

            GenericApi.getGeneric("migrar-interesados/get-interesados/"+radicado+"/"+vigencia+"/"+item).then(
                datos => {

                    if (!datos.error && datos.data.length>0) {
                        setExisteTempPD(true);
                        setTipoInteresado(datos.data[0].attributes.tipo_interesado);    
                        setTipoSujetoProcesal(datos.data[0].attributes.tipo_sujeto_procesal);
                        setPrimerNombre(datos.data[0].attributes.primer_nombre);
                        setSegundoNombre(datos.data[0].attributes.segundo_nombre);   
                        setPrimerApellido(datos.data[0].attributes.primer_apellido); 
                        setSegundoApellido(datos.data[0].attributes.segundo_apellido); 
                        setTipoDocumento(datos.data[0].attributes.tipo_documento);    
                        setNumeroDocumento(datos.data[0].attributes.numero_documento); 
                        setEmail(datos.data[0].attributes.email);    
                        setTelefono(datos.data[0].attributes.telefono);    
                        setTelefono2(datos.data[0].attributes.telefono2);    
                        setProfesion(datos.data[0].attributes.cargo);    
                        setIdOrientacionSexual(datos.data[0].attributes.orientacion_sexual);   
                        setIdSexo(datos.data[0].attributes.sexo);    
                        setDireccion(datos.data[0].attributes.direccion);    
                        setDepartamento(datos.data[0].attributes.departamento);    
                        setCiudad(datos.data[0].attributes.ciudad);  
                        setLocalidad(datos.data[0].attributes.localidad);
                        setNombreEntidad(datos.data[0].attributes.entidad);  
                        setSectorEntidad(datos.data[0].attributes.sector);    
                    } 
                    
                    window.showSpinner(false);
                }
            )
        } catch (error) {
        }
    }



    

    const handleClick = (event, i) => {

        if(i===1){
            setTipoInteresado(getLista.data[0].attributes.tipoInteresado);      
        }
        
        else if(i===2){
            setTipoSujetoProcesal(getLista.data[0].attributes.tipoSujetoProcesal);      
        }

        else if(i===3){
            setPrimerNombre(getLista.data[0].attributes.primerNombre);
        }

        else if(i===4){
            setSegundoNombre(getLista.data[0].attributes.segundoNombre);      
        }

        else if(i===5){
            setPrimerApellido(getLista.data[0].attributes.primerApellido);      
        }

        else if(i===6){
            setSegundoApellido(getLista.data[0].attributes.segundoApellido);    
        }

        else if(i===7){
            setTipoDocumento(getLista.data[0].attributes.tipoDocumento);    
        }

        else if(i===8){
            setNumeroDocumento(getLista.data[0].attributes.numeroDocumento);    
        }

        else if(i===9){
            setEmail(getLista.data[0].attributes.email);    
        }

        else if(i===10){
            setTelefono(getLista.data[0].attributes.telefono);    
        }

        else if(i===11){
            setTelefono2(getLista.data[0].attributes.telefono2);    
        }

        else if(i===12){
            setProfesion(getLista.data[0].attributes.profesion);    
        }

        else if(i===13){
            setIdOrientacionSexual(getLista.data[0].attributes.idOrientacionSexual);    
        }

        else if(i===14){
            setIdSexo(getLista.data[0].attributes.idSexo);    
        }

        else if(i===15){
            setDireccion(getLista.data[0].attributes.direccion);    
        }

        else if(i===16){
            setDepartamento(getLista.data[0].attributes.idOrientacionSexual);    
        }

        else if(i===17){
            setCiudad(getLista.data[0].attributes.ciudad);    
        }

        else if(i===18){
            setLocalidad(getLista.data[0].attributes.localidad);    
        }

        else if(i===19){
            setNombreEntidad(getLista.data[0].attributes.nombreEntidad);    
        }

        else if(i===20){
            setSectorEntidad(getLista.data[0].attributes.sectorEntidad);    
        }


    };


    const handleInputChange = (event, i) => {
     
        if(i===1){
            setTipoInteresado(event.currentTarget.value);      
        }

        else if(i===2){
            setTipoSujetoProcesal(event.currentTarget.value);      
        }

        else if(i===3){
            setPrimerNombre(event.currentTarget.value);
        }

        else if(i===4){
            setSegundoNombre(event.currentTarget.value);      
        }

        else if(i===5){
            setPrimerApellido(event.currentTarget.value);      
        }

        else if(i===6){
            setSegundoApellido(event.currentTarget.value);    
        }

        else if(i===7){
            setTipoDocumento(event.currentTarget.value);    
        }

        else if(i===8){
            setNumeroDocumento(event.currentTarget.value);    
        }

        else if(i===9){
            setEmail(event.currentTarget.value);    
        }

        else if(i===10){
            setTelefono(event.currentTarget.value);    
        }

        else if(i===11){
            setTelefono2(event.currentTarget.value);    
        }

        else if(i===12){
            setProfesion(event.currentTarget.value);    
        }

        else if(i===13){
            setIdOrientacionSexual(event.currentTarget.value);    
        }

        else if(i===14){
            setIdSexo(event.currentTarget.value);    
        }

        else if(i===15){
            setDireccion(event.currentTarget.value);    
        }

        else if(i===16){
            setDepartamento(event.currentTarget.value);    
        }

        else if(i===17){
            setCiudad(event.currentTarget.value);    
        }

        else if(i===18){
            setLocalidad(event.currentTarget.value);    
        }

        else if(i===19){
            setNombreEntidad(event.currentTarget.value);    
        }

        else if(i===20){
            setSectorEntidad(event.currentTarget.value);    
        }
        return true;

    }


    const listaTipoDocumento = () => {
        return (
            getListaTipoDocumento.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaSexo = () => {
        return (
            getListaSexo.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaOrientacionSexual = () => {
        return (
            getListaOrientacionSexual.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaTipoInteresado = () => {
        return (
            getListaTipoInteresado.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaTipoSujetoProcesal = () => {
        return (
            getListaSujetoProcesal.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaCiudades = () => {
        return (
            getListaCiudades.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }

    const listaLocalidades = () => {
        return (
            getListaLocalidad.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }


    const listaDepartamentos = () => {
        return (
            getListaDepartamentos.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }


    const listaEntidades = () => {
        return (
            getListaEntidad.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }




    const infoInteresado = () => {

        if (getLista.data != null && typeof (getLista.data) != 'undefined') {
            return (

                getLista.data.map((item, i) => {
                    return (
                        <>

<                       div className="col-md-6">
                            <div className="form-group">
                                <h4>ORIGEN</h4>
                                <hr/>
                            </div>
                        </div>   

                            
                        <div className="col-md-6">                            
                            <h4>
                                <small>{existeTempPD?<i className="far fa-dot-circle txt-green"></i>:<i className="far fa-dot-circle txt-red"></i>} </small>
                                DESTINO
                            </h4>
                            <hr/>
                        </div>

                        {/* 1. TIPO INTERESADO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_interesado_origen">TIPO DE INTERESADO</label>
                                <Field value={item.attributes.tipoInteresado} as="input" type="text" autoComplete="off" className="form-control" 
                                id="tipo_interesado_origen" name="tipo_interesado_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="tipo_interesado_destino">TIPO DE INTERESADO</label>
                                <Field onChange={event => handleInputChange(event, 1)} as="select" className="form-control" 
                                    value={tipoInteresado} id="tipo_interesado_destino" name="tipo_interesado_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeTipoInteresado ? listaTipoInteresado() : null}
                                </Field>
                            </div>
                        </div>

                        {/* 2. TIPO SUJETO PROCESAL*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_sujeto_procesal_origen">TIPO DE SUJETO PROCESAL</label>
                                <Field value={item.attributes.tipoSujetoProcesal} as="input" type="text" autoComplete="off" className="form-control" 
                                id="tipo_sujeto_procesal_origen" name="tipo_sujeto_procesal_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_sujeto_procesal_destino">TIPO DE SUJETO PROCESAL</label>
                                <Field onChange={event => handleInputChange(event, 2)} as="select" className="form-control" 
                                    value={tipoSujetoProcesal} id="tipo_sujeto_procesal_destino" name="tipo_sujeto_procesal_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeSujetoProcesal ? listaTipoSujetoProcesal() : null}
                                </Field>
                            </div>
                        </div>


                        {/* 3. PRIMER NOMBRE */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="primer_nombre_origen">PRIMER NOMBRE</label>
                                <Field value={item.attributes.primerNombre} as="input" type="text" autoComplete="off" className="form-control" 
                                id="primer_nombre_origen" name="primer_nombre_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 3)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="primer_nombre_destino">PRIMER NOMBRE</label>
                                <Field value={primerNombre} as="input" type="text" autoComplete="off" className="form-control" 
                                id="primer_nombre_destino" name="primer_nombre_destino" onChange={event => handleInputChange(event, 3)}></Field>
                            </div>
                        </div>

                        {/* 4. SEGUNDO NOMBRE */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="segundo_nombre_origen">SEGUNDO NOMBRE</label>
                                <Field value={item.attributes.segundoNombre} as="input" type="text" autoComplete="off" className="form-control" 
                                id="segundo_nombre_origen" name="segundo_nombre_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 4)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="segundo_nombre_destino">SEGUNDO NOMBRE</label>
                                <Field value={segundoNombre} as="input" type="text" autoComplete="off" className="form-control" 
                                id="segundo_nombre_destino" name="segundo_nombre_destino" onChange={event => handleInputChange(event, 4)}></Field>
                            </div>
                        </div> 


                        {/* 5. PRIMER APELLIDO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="primer_apellido_origen">PRIMER APELLIDO</label>
                                <Field value={item.attributes.primerApellido} as="input" type="text" autoComplete="off" className="form-control" 
                                id="primer_apellido_origen" name="primer_apellido_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 5)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="primer_apellido_destino">PRIMER APELLIDO</label>
                                <Field value={primerApellido} as="input" type="text" autoComplete="off" className="form-control" 
                                id="primer_apellido_destino" name="primer_apellido_destino" onChange={event => handleInputChange(event, 5)}></Field>
                            </div>
                        </div>

                        {/* 6. SEGUNDO APELLIDO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="segundo_apellido_origen">SEGUNDO APELLIDO</label>
                                <Field value={item.attributes.segundoApellido} as="input" type="text" autoComplete="off" className="form-control" 
                                id="segundo_apellido_origen" name="segundo_apellido_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 6)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="segundo_apellido_destino">SEGUNDO APELLIDO</label>
                                <Field value={segundoApellido} as="input" type="text" autoComplete="off" className="form-control" 
                                id="segundo_apellido_destino" name="segundo_apellido_destino" onChange={event => handleInputChange(event, 6)}></Field>
                            </div>
                        </div>

                        {/* 7. TIPO DOCUMENTO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_documento_origen">TIPO DE DOCUMENTO</label>
                                <Field as="input" type="text" autoComplete="off" className="form-control" 
                                id="tipo_documento_origen" name="tipo_documento_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                           
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_documento_destino">TIPO DE DOCUMENTO</label>
                                <Field onChange={event => handleInputChange(event, 7)} as="select" className="form-control" 
                                    value = {tipoDocumento} id="tipo_documento_destino" name="tipo_documento_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaTipoDocumento ? listaTipoDocumento() : null}
                                </Field>
                            </div>
                        </div>

                        {/* 8. NUMERO DOCUMENTO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="numero_documento_origen">NÚMERO DE DOCUMENTO</label>
                                <Field value={item.attributes.numeroDocumento} as="input" type="text" autoComplete="off" className="form-control" 
                                id="numero_documento_origen" name="numero_documento_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 8)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="numero_documento_destino">NÚMERO DE DOCUMENTO</label>
                                <Field value={numeroDocumento} as="input" type="text" autoComplete="off" className="form-control" 
                                id="numero_documento_destino" name="numero_documento_destino" 
                                onChange={event => handleInputChange(event, 8)}></Field>
                            </div>
                        </div>

                        {/* 9. EMAIL */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="email_origen">EMAIL</label>
                                <Field value={item.attributes.email} as="input" type="text" autoComplete="off" className="form-control" 
                                id="email_origen" name="email_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 9)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="email_destino">EMAIL</label>
                                <Field value={email} as="input" type="text" autoComplete="off" className="form-control" 
                                id="email_destino" name="email_destino" 
                                onChange={event => handleInputChange(event, 9)}></Field>
                            </div>
                        </div>

                        {/* 10. TELEFONO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="telefono_origen">TELÉFONO</label>
                                <Field value={item.attributes.telefono} as="input" type="text" autoComplete="off" className="form-control" 
                                id="telefono_origen" name="telefono_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 10)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="telefono_destino">TELÉFONO</label>
                                <Field value={telefono} as="input" type="text" autoComplete="off" className="form-control" 
                                id="telefono_destino" name="telefono_destino" 
                                onChange={event => handleInputChange(event, 10)}></Field>
                            </div>
                        </div>


                        {/* 11. CELULAR*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="telefono_origen2">CELULAR</label>
                                <Field value={item.attributes.telefono2} as="input" type="text" autoComplete="off" className="form-control" 
                                id="telefono_origen2" name="telefono_origen2" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 11)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="telefono_destino2">CELULAR</label>
                                <Field value={telefono2} as="input" type="text" autoComplete="off" className="form-control" 
                                id="telefono_destino2" name="telefono_destino2" 
                                onChange={event => handleInputChange(event, 11)}></Field>
                            </div>
                        </div>

                        {/* 12. CARGO*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="profesion_origen">CARGO</label>
                                <Field value={item.attributes.profesion} as="input" type="text" autoComplete="off" className="form-control" 
                                id="profesion_origen" name="profesion_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 12)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="profesion_destino">CARGO</label>
                                <Field value={profesion} as="input" type="text" autoComplete="off" className="form-control" 
                                id="profesion_destino" name="profesion_destino" 
                                onChange={event => handleInputChange(event, 12)}></Field>
                            </div>
                        </div>


                        {/* 13. ORIENTACIÓN SEXUAL*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="orientacion_sexual_origen">ORIENTACIÓN SEXUAL</label>
                                <Field value={item.attributes.idOrientacionSexual} as="input" type="text" autoComplete="off" className="form-control" 
                                id="orientacion_sexual_origen" name="orientacion_sexual_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="orientacion_sexual_destino">ORIENTACIÓN SEXUAL</label>
                                <Field  value={idOrientacionSexual} onChange={event => handleInputChange(event, 13)} as="select" className="form-control" 
                                    id="orientacion_sexual_destino" name="orientacion_sexual_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaOrientacionSexual ? listaOrientacionSexual() : null}
                                </Field>
                            </div>
                        </div>

                        {/* 14. SEXO*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="sexo_origen">SEXO</label>
                                <Field value={item.attributes.idSexo} as="input" type="text" autoComplete="off" className="form-control" 
                                id="sexo_origen" name="sexo_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                           
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="sexo_destino">SEXO</label>
                                <Field value={idSexo} onChange={event => handleInputChange(event, 14)} as="select" className="form-control" 
                                    id="sexo_destino" name="sexo_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaSexo ? listaSexo() : null}
                                </Field>
                            </div>
                        </div>

                        {/* 15. DIRECCION*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="direccion_origen">DIRECCIÓN</label>
                                <Field value={item.attributes.direccion} as="input" type="text" autoComplete="off" className="form-control" 
                                id="direccion_origen" name="direccion_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 15)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="direccion_destino">DIRECCIÓN</label>
                                <Field value={direccion} as="input" type="text" autoComplete="off" className="form-control" 
                                id="direccion_destino" name="direccion_destino" 
                                onChange={event => handleInputChange(event, 15)}></Field>
                            </div>
                        </div>

                        {/* 16. DEPARTAMENTO*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="departamento_origen">DEPARTAMENTO</label>
                                <Field value={item.attributes.departamento} as="input" type="text" autoComplete="off" className="form-control" 
                                id="departamento_origen" name="departamento_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                           
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="departamento_destino">DEPARTAMENTO</label>
                                <Field value={departamento} onChange={event => handleInputChange(event, 16)} as="select" className="form-control" 
                                    id="departamento_destino" name="departamento_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeDepartamento ? listaDepartamentos() : null}
                                </Field>
                            </div>
                        </div>

                        {/* 17. CIUDAD*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="ciudad_origen">CIUDAD</label>
                                <Field value={item.attributes.ciudad} as="input" type="text" autoComplete="off" className="form-control" 
                                id="ciudad_origen" name="ciudad_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                           
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="ciudad_destino">CIUDAD</label>
                                <Field value={ciudad} onChange={event => handleInputChange(event, 17)} as="select" className="form-control" 
                                    id="ciudad_destino" name="ciudad_destino">
                                    <option value="">Por favor seleccione</option>
                                    {existeCiudad ? listaCiudades() : null}
                                </Field>
                            </div>
                        </div>

                        {/* 18. LOCALIDAD*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="localidad_origen">LOCALIDAD</label>
                                <Field value={item.attributes.localidad} as="input" type="text" autoComplete="off" className="form-control" 
                                id="localidad_origen" name="localidad_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="localidad_destino">LOCALIDAD</label>
                                <Field value={localidad} onChange={event => handleInputChange(event, 18)} as="select" className="form-control" 
                                    id="localidad_destino" name="localidad_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeLocalidad ? listaLocalidades() : null}
                                </Field>
                            </div>
                        </div>


                        {/* 19. NOMBRE ENTIDAD*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="entidad_origen">NOMBRE DE LA ENTIDAD</label>
                                <Field value={item.attributes.nombreEntidad} as="input" type="text" autoComplete="off" className="form-control" 
                                id="entidad_origen" name="entidad_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 19)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="entidad_destino">NOMBRE DE LA ENTIDAD</label>    
                                <Field value={nombreEntidad} as="input" type="text" autoComplete="off" className="form-control" 
                                id="entidad_destino" name="entidad_destino" 
                                onChange={event => handleInputChange(event, 19)}></Field>
                            </div>
                        </div>

                        {/* 20. SECTOR ENTIDAD*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="sector_origen">SECTOR DE LA ENTIDAD</label>
                                <Field value={item.attributes.sectorEntidad} as="input" type="text" autoComplete="off" className="form-control" 
                                id="sector_origen" name="sector_origen" disabled={true}></Field>
                            </div>
                        </div>
                    
                        <div className="col-md-2">
                            <div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 20)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>
                        </div>    
                            
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="sector_destino">SECTOR DE LA ENTIDAD</label>
                                <Field value={sectorEntidad} as="input" type="text" autoComplete="off" className="form-control" 
                                id="sector_destino" name="sector_destino" 
                                onChange={event => handleInputChange(event, 20)}></Field>
                            </div>
                        </div>

                        </>
                    )
                })
            )
        }
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);
        let data;

        data = {
            "data": {
                "type": 'migracion-datos-interesado',
                "attributes": {
                    "tipo_interesado": datos.tipo_interesado,
                    "tipo_sujeto_procesal": datos.tipo_sujeto_procesal,
                    "primer_nombre": datos.primer_nombre,
                    "segundo_nombre": datos.segundo_nombre,
                    "primer_apellido": datos.primer_apellido,
                    "segundo_apellido": datos.segundo_apellido,
                    "tipo_documento": datos.tipo_documento,
                    "numero_documento": datos.numero_documento,
                    "email": datos.email,
                    "telefono": datos.telefono,
                    "telefono2": datos.telefono2,
                    "cargo": datos.cargo,
                    "orientacion_sexual": datos.orientacion_sexual,
                    "sexo": datos.sexo,
                    "direccion": datos.direccion,
                    "departamento": datos.departamento,
                    "ciudad": datos.ciudad,
                    "localidad": datos.localidad,
                    "entidad": datos.entidad,
                    "sector": datos.sector,
                    "radicado": radicado,
                    "vigencia": vigencia,
                    "item": item,
                }
            }
        }

        GenericApi.addGeneric("migrar-interesados",data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "SINPROC No "+radicado+" :: CREAR INTERESADO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: `/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.EXITO});
                }
                else {
                    setModalState({ title: "SINPROC No "+radicado+" :: CREAR INTERESADO", message: datos.error.toString(), show: true, redirect: `/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);

            }
        )
    }

    return (
        <>
            {<Spinner />}   
            {<ModalGen data={getModalState} />}
          
            <Formik
                initialValues={{
                    tipo_interesado: tipoInteresado,
                    tipo_sujeto_procesal: tipoSujetoProcesal,
                    primer_nombre: primerNombre,
                    segundo_nombre: segundoNombre,
                    primer_apellido: primerApellido,
                    segundo_apellido: segundoApellido,
                    tipo_documento: tipoDocumento,
                    numero_documento: numeroDocumento,
                    email: email,
                    telefono: telefono,
                    telefono2: telefono2,
                    cargo: profesion,
                    orientacion_sexual: idOrientacionSexual,
                    sexo: idSexo,
                    direccion: direccion,
                    departamento: departamento,
                    ciudad: ciudad,
                    localidad: localidad,
                    entidad: nombreEntidad,
                    sector: sectorEntidad,
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

                    <div className="w2d_block">
                        <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Buscador`}><small>Buscador</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`}><small>Inicio proceso de migración</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ListarMigracionInteresados/${radicado}/${vigencia}`}><small>Lista de interesados</small></Link></li>
                            <li className="breadcrumb-item"> <small>Datos del interesado</small></li>
                        </ol>
                        </nav>
                    </div>

                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">MIGRACIÓN PROCESO No :: {radicado} - {vigencia} - ITEM No {item==-1?1:item+1} :: DATOS DEL INTERESADO</h3>
                            </div>

                            <div className="block-content">

                                <div className='text-right w2d-enter'>
                                    <Link to={`/ListarMigracionInteresados/${radicado}/${vigencia}`} title='Regresar' >
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>

                                <div className="row">

                                    {infoInteresado()}
                                    
                                </div>

                            </div>
                            {getMigrado === true?null:
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                </div>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}


export default DatoInteresadoMigracionForm;