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
import InfoErrorApi from '../../Utils/InfoErrorApi';

function ActuacionesMigracionForm() {


    const [getLista, setLista] = useState({ title: "", message: "", show: false });
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [existeTempPD, setExisteTempPD] = useState(false);
    
    const [getListaDependenciasOrigen, setListaDependenciasOrigen] = useState({ data: {} });
    const [existeListaDependenciasOrigen, setExisteListaDependenciasOrigen] = useState(false);

    let { radicado, vigencia, id, item } = useParams();


    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [autoNumero, setAutoNumero] = useState('');
    const [fecha, setFecha] = useState('');
    const [fechaTermino, setFechaTermino] = useState('');
    const [instancia, setInstancia] = useState('');
    const [decision, setDesicion] = useState('');
    const [terminoMonto, setTerminoMonto] = useState('');
    const [observacion, setObservacion] = useState('');
    const [documentoData, setDocumentoData] = useState();
    const [documentoBase64, setDocumentoBase64] = useState();
    const [dependencia, setDependencia] = useState('');

    const [getListaActuaciones, setListaActuaciones] = useState({ data: {} });
    const [existeListaActuaciones, setExisteListaActuaciones] = useState(false);

    const [getMigrado, setMigrado] = useState(null);

    const [errorApi, setErrorApi] = useState('');

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
            GenericApi.getGeneric("migracion-actuacion/"+radicado+"/"+vigencia+"/"+item).then(
                datos => {

                    if (!datos.error) {
                        setLista(datos);
                        setMigrado(datos.data[0].attributes.migrado);
                        actuaciones();
                    } 
                    
                }
            )
        } catch (error) {
        }
    }


    const actuaciones= () => {
        try {

            GenericApi.getGeneric("mas_actuaciones").then(
                datos => {

                    if (!datos.error) {
                        setListaActuaciones(datos);
                        setExisteListaActuaciones(true);
                        dependenciasOrigen();       
                        
                    } else {
                        //setModalState({ title: "Antecedentes", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const dependenciasOrigen= () => {
        try {

            GenericApi.getGeneric("mas-dependencia-origen").then(
                datos => {

                    if (!datos.error) {
                        setListaDependenciasOrigen(datos);
                        setExisteListaDependenciasOrigen(true);
                        getInfoActuaciones();
                        
                    } 
                }
            )
        } catch (error) {
        }
    }


    const getInfoActuaciones = () => {
        try {

            GenericApi.getGeneric("migrar-actuaciones/get-actuaciones/"+radicado+"/"+vigencia+"/"+item).then(
                datos => {

                    if (!datos.error && datos.data.length>0) {                        
                            setExisteTempPD(true);
                            setNombre(datos.data[0].attributes.nombre);
                            setTipo(datos.data[0].attributes.tipo);    
                            setAutoNumero(datos.data[0].attributes.autoNumero);
                            setFecha(datos.data[0].attributes.fecha);                       
                            setFechaTermino(datos.data[0].attributes.fechaTermino); 
                            setInstancia(datos.data[0].attributes.instancia);      
                            setDesicion(datos.data[0].attributes.decision);  
                            setTerminoMonto(datos.data[0].attributes.terminoMonto);    
                            setObservacion(datos.data[0].attributes.observacion);
                            setDependencia(datos.data[0].attributes.dependencia);                                
                    }
                    window.showSpinner(false);  
                        
                }
            )
        } catch (error) {
        }
    }




    const listaActuaciones = () => {
        return (
            getListaActuaciones.data.map((item, i) => {
                if(item.attributes.tipo_actuacion == tipo){
                    return (
                        <option key={item.id} value={item.id}>{item.attributes.nombre_actuacion}</option>
                    )
                }
            })
        )
    }

    const listaDependenciasOrigen = () => {
        return (
            getListaDependenciasOrigen.data.map((item, i) => {
                return (
                    <option key={item.id} value={item.id}>{item.attributes.nombre}</option>
                )
            })
        )
    }


    const handleClick = (event, i) => {

        if(i===1){
            setTipo(getLista.data[0].attributes.tipo);
        }

        else if(i===2){
            setNombre(getLista.data[0].attributes.nombre);      
        }

        else if(i===3){
            setAutoNumero(getLista.data[0].attributes.autoNumero);
        }

        else if(i===4){
            setFecha(getLista.data[0].attributes.fecha);      
        }

        else if(i===5){
            setDependencia(getLista.data[0].attributes.dependencia);      
        }
    };


    const handleInputChange = (event, i) => {
     
        if(i===1){
            setTipo(event.currentTarget.value);
        }

        else if(i===2){
            setNombre(event.currentTarget.value)
        }

        else if(i===3){
            setAutoNumero(event.currentTarget.value)
        }

        else if(i===4){
            setFecha(event.currentTarget.value)
        }

        else if(i===5){
            setDependencia(event.currentTarget.value)
        }

        else if(i==6){

            //Conversion a Base64

            const { name, files } = event.target;

            console.log(name, files);
            const extension = getFileExtension(files[0].name);

            if (extension == "pdf") {
                //setDocumentoData(event.target.file);
                Array.from(event.currentTarget.files).forEach(archivo => {
                    var reader = new FileReader();
                    reader.readAsDataURL(archivo);
                    reader.onload = function () {
                        var arrayAuxiliar = [];
                        var base64 = reader.result;
                        arrayAuxiliar = base64.split(',');
                        setDocumentoData(arrayAuxiliar[0]);
                        setDocumentoBase64(arrayAuxiliar[1]);
                    }
                })
                setErrorApi('')
            }
            else{
                setDocumentoData('');
                setDocumentoBase64('');
                setErrorApi("El archivo seleccionado no tiene un formato permitido. Debe ser .pdf")
                window.showModal(1)
            }

        }

        return true;

        //return true;
    }

    // Metodo encargado de sacar la extension del archivo
    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    const infoActuaciones = (errors) => {

        if (getLista.data != null && typeof (getLista.data) != 'undefined') {
            return (

                getLista.data.map((item, i) => {
                    return (
                        <>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <h4>ORIGEN</h4>
                                    <hr />
                                </div>
                            </div>

                            <div className="col-md-6">                            
                                <h4>
                                    <small>{existeTempPD?<i className="far fa-dot-circle txt-green"></i>:<i className="far fa-dot-circle txt-red"></i>} </small>
                                    DESTINO
                                </h4>
                                <hr/>
                            </div>


                        {/* 1. TIPO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="tipo_origen">TIPO</label>
                                <Field value={item.attributes.tipo} as="input" type="text" autoComplete="off" 
                                className="form-control" id="tipo_origen" name="tipo_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 1)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    

                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="tipo_destino">TIPO <span className="text-danger">*</span></label>
                                <Field value={tipo} onChange={event => handleInputChange(event, 1)} as="select" className="form-control" 
                                    id="tipo_destino" name="tipo_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    <option value="0">ACTUACIÓN</option>
                                    <option value="1">IMPEDIMENTO</option>
                                    <option value="2">COMISORIO</option>                                   
                                </Field>
                                <ErrorMessage name='tipo' component={() => (<span className='text-danger'>{errors.tipo}</span>)} />
                            </div>
                        </div>

                        {/* 2. NOMBRE */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="nombre_origen">NOMBRE</label>
                                <Field value={item.attributes.nombre} as="input" type="text" autoComplete="off" 
                                className="form-control" id="nombre_origen" name="nombre_origen" disabled={true}>                                   
                                </Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 2)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="nombre_destino">NOMBRE<span className="text-danger">*</span></label>
                                <Field value={nombre} onChange={event => handleInputChange(event, 2)} as="select" className="form-control" 
                                    id="nombre_destino" name="nombre_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaActuaciones ? listaActuaciones() : null}
                                </Field>
                                <ErrorMessage name='nombre' component={() => (<span className='text-danger'>{errors.nombre}</span>)} />
                            </div>
                        </div>

                        {/* 3. AUTO NUMERO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="auto_origen">NÚMERO DE AUTO</label>
                                <Field value={item.attributes.autoNumero} as="input" type="text" autoComplete="off" 
                                className="form-control" id="auto_origen" name="auto_origen" disabled={true}></Field>
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
                                <label htmlFor="auto_destino">NÚMERO DE AUTO<span className="text-danger">*</span></label>
                                <Field value={autoNumero} as="input" type="text" autoComplete="off" className="form-control" 
                                id="auto_destino" name="auto_destino" 
                                onChange={event => handleInputChange(event, 3)}></Field>
                                <ErrorMessage name='autoNumero' component={() => (<span className='text-danger'>{errors.autoNumero}</span>)} />
                            </div>
                        </div> 

                        {/* 4. FECHA */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="fecha_origen">FECHA</label>
                                <Field value={item.attributes.fecha} as="input" type="text" autoComplete="off" className="form-control" 
                                id="fecha_origen" name="fecha_origen" disabled={true} autocomplete="off"></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 4)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="fecha_destino">FECHA <span className="text-danger">*</span></label>
                                <Field value={fecha} as="input" type="date" autoComplete="off" className="form-control" 
                                id="fecha_destino" name="fecha_destino" 
                                onChange={event => handleInputChange(event, 4)}></Field>
                                <ErrorMessage name='fecha' component={() => (<span className='text-danger'>{errors.fecha}</span>)} />
                            </div>
                        </div>

                         {/* 5. DEPENDENCIA */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="dependencia_origen">DEPENDENCIA</label>
                                <Field value={item.attributes.dependencia} as="input" type="text" autoComplete="off" className="form-control" 
                                id="dependencia_origen" name="dependencia_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 5)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                                <label htmlFor="dependencia_destino">DEPENDENCIA<span className="text-danger">*</span></label>
                                <Field value={dependencia} onChange={event => handleInputChange(event, 5)} as="select" className="form-control" 
                                    id="dependencia_destino" name="dependencia_destino">
                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                    {existeListaDependenciasOrigen ? listaDependenciasOrigen() : null}
                                </Field>
                                <ErrorMessage name='dependencia' component={() => (<span className='text-danger'>{errors.dependencia}</span>)} />
                            </div>
                        </div> 

                        {/* 6. DOCUMENTO */}   
                        <div className="col-md-5">
                        </div>
                        
                        <div className="col-md-2">
                        </div>    
                            
                        <div className="col-md-5">
                           <div className="form-group">
                            <label htmlFor="input_documento">SUBIR DOCUMENTO<span className="text-danger">*</span></label>
                            <Field as="input" type="file" autoComplete="off" className="form-control" 
                                    id="input_documento" name="input_documento" 
                                    onChange={event => handleInputChange(event, 6)}></Field>
                            <ErrorMessage name='documentoBase64' component={() => (<span className='text-danger'>{errors.documentoBase64}</span>)} />
                            </div>
                        </div> 



                        {/*6. FECHA DE TERMINO*/}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="fecha_termino_origen">FECHA DE TÉRMINO</label>
                                <Field value={item.attributes.fechaTermino} as="input" type="text" autoComplete="off" className="form-control" 
                                id="fecha_termino_origen" name="fecha_termino_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 6)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    
                            
                        <div className="col-md-5">
                           {/*<div className="form-group">
                                <label htmlFor="fecha_termino_destino">Fecha de término<span className="text-danger">*</span></label>
                                <Field value={fechaTermino} as="input" type="date" autoComplete="off" className="form-control" 
                                id="fecha_termino_destino" name="fecha_termino_destino" onChange={event => handleInputChange(event, 6)}></Field>
                        </div>*/}
                        </div>

                        {/* 7. INSTANCIA */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="instancia_origen">INSTANCIA</label>
                                <Field value={item.attributes.instancia} as="input" type="text" autoComplete="off" className="form-control" 
                                id="instancia_origen" name="instancia_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 7)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    
                            
                        <div className="col-md-5">
                           {/*<div className="form-group">
                                <label htmlFor="instancia_destino">Instancia<span className="text-danger">*</span></label>
                                <Field value={instancia} as="input" type="text" autoComplete="off" className="form-control" 
                                id="instancia_destino" name="instancia_destino" onChange={event => handleInputChange(event, 7)}></Field>
                            </div>*/}
                        </div> 

                        {/* 8. DECISION */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="decision_origen">DECISIÓN</label>
                                <Field value={item.attributes.decision} as="input" type="text" autoComplete="off" className="form-control" 
                                id="decision_origen" name="decision_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 8)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/} 
                        </div>    
                            
                        <div className="col-md-5">
                           {/*<div className="form-group">
                                <label htmlFor="decision_destino">Decisión<span className="text-danger">*</span></label>
                                <Field value={decision} as="input" type="text" autoComplete="off" className="form-control" 
                                id="decision_destino" name="decision_destino" onChange={event => handleInputChange(event, 8)}></Field>
                            </div>*/}  
                        </div> 

                        {/* 9. TERMINO MONTO */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="decision_origen">TÉRMINO MONTO</label>
                                <Field value={item.attributes.terminoMonto} as="input" type="text" autoComplete="off" className="form-control" 
                                id="decision_origen" name="decision_origen" disabled={true}></Field>
                            </div>  
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 9)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    
                            
                        <div className="col-md-5">
                           {/*<div className="form-group">
                                <label htmlFor="decision_destino">Término monto<span className="text-danger">*</span></label>
                                <Field value={terminoMonto} as="input" type="text" autoComplete="off" className="form-control" 
                                id="decision_destino" name="decision_destino" onChange={event => handleInputChange(event, 9)}></Field>
                            </div>*/}
                        </div>

                        {/* 10. OBSERVACION */}   
                        <div className="col-md-5">
                            <div className="form-group">
                                <label htmlFor="observacion_origen">OBSERVACIÓN</label>
                                <Field value={item.attributes.observacion} as="input" type="text" autoComplete="off" className="form-control" 
                                id="observacion_origen" name="observacion_origen" disabled={true}></Field>
                            </div>
                        </div>
                        
                        <div className="col-md-2">
                            {/*<div className="form-group">
                                <Center>
                                    <button type="button" className="btn btn-success" onClick={event => handleClick(event, 10)}>
                                        <i className="fas fa-angle-double-right"></i></button>
                                </Center>
                            </div>*/}
                        </div>    
                            
                        <div className="col-md-5">
                           {/*<div className="form-group">
                                <label htmlFor="observacion_destino">Observación<span className="text-danger">*</span></label>
                                <Field value={observacion} as="input" type="text" autoComplete="off" className="form-control" 
                                id="observacion_destino" name="observacion_destino" onChange={event => handleInputChange(event, 10)}></Field>
                            </div>*/}
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
                "type": 'migrar-actuaciones',
                "attributes": {
                    "nombre": datos.nombre,
                    "tipo": datos.tipo,
                    "autonumero":  datos.autoNumero,
                    "fecha":  datos.fecha,
                    "fechatermino":  datos.fechaTermino,
                    "instancia":  datos.instancia,
                    "decision":  datos.decision,
                    "terminomonto":  datos.terminoMonto,
                    "observacion":  datos.observacion,
                    "radicado":  datos.radicado,
                    "vigencia":  datos.vigencia,
                    "item":  datos.item,
                    "documentoData": datos.documentoData,
                    "documentoBase64": datos.documentoBase64,
                    "dependencia": datos.dependencia
                }
            }
        }

        GenericApi.addGeneric("migrar-actuaciones",data).then(
            datos => {
                if (!datos.error) {
                    setModalState({ title: "PROCESO No "+radicado+" :: MIGRAR ACTUACIÓN", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: `/ListarMigracionActuaciones/${radicado}/${vigencia}`, alert: global.Constants.TIPO_ALERTA.EXITO});
                }
                else {
                    setModalState({ title: "PROCESO No "+radicado+" :: MIGRAR ACTUACIÓN", message: datos.error.toString(), show: true, redirect: `/CargarMigracionActuacion/${radicado}/${vigencia}/${item}`, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);

            }
        )
    }

    return (
        <>
            {<Spinner />}   
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
          
            <Formik
                initialValues={{
                    nombre: nombre,
                    tipo: tipo,
                    autoNumero: autoNumero,
                    fecha: fecha,
                    fechaTermino: fechaTermino,
                    instancia: instancia,
                    decision: decision,
                    terminoMonto: terminoMonto,
                    observacion: observacion,
                    radicado: radicado,
                    vigencia: vigencia,
                    item: item,
                    documentoData: documentoData,
                    documentoBase64: documentoBase64,
                    dependencia: dependencia,
                }}
                enableReinitialize
                validate={(valores) => {
                    let errores = {}

                    if(!valores.tipo){
                        errores.tipo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if(!valores.nombre){
                        errores.nombre = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if(!valores.autoNumero){
                        errores.autoNumero = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if(!valores.fecha){
                        errores.fecha = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if(!valores.documentoBase64){
                        errores.documentoBase64 = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                    }

                    if(!valores.dependencia){
                        errores.dependencia = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
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
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/Buscador`}><small>Buscador</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ProcesoDisciplinarioMigracion/${radicado}/${vigencia}`}><small>Inicio proceso de migración</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/ListarMigracionActuaciones/${radicado}/${vigencia}`}><small>Lista de actuaciones</small></Link></li>
                            <li className="breadcrumb-item"> <small>Actuaciones</small></li>
                        </ol>
                        </nav>
                    </div>

                      
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">PROCESO No :: {radicado} - {vigencia} - ITEM No {item+1} :: ACTUACIONES</h3>
                            </div>

                            <div className="block-content">

                                <div className='text-right w2d-enter'>
                                    <Link to={`/ListarMigracionActuaciones/`} title='Regresar a lista de Antecedentes' >
                                        <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                    </Link>
                                </div>

                                <div className="row">

                                    {infoActuaciones(errors)}
                                    
                                </div>

                            </div>
                            {getMigrado===true?null:
                                <div className="block-content block-content-full text-right bg-light">
                                    <button type="submit" className="btn btn-rounded btn-primary" disabled={errorApi != '' ? true : false}>{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                </div>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}


export default ActuacionesMigracionForm;