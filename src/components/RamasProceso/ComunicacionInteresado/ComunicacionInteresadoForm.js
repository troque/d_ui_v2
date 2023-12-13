import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import InfoErrorApi from '../../Utils/InfoErrorApi';
import InfoExitoApi from '../../Utils/InfoExitoApi';
import InfoCustom from '../../Utils/InfoCustom';

import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';
import { useLocation } from 'react-router-dom'
import DatosInteresadoApi from '../../Api/Services/DatosInteresadoApi';
import ComunicacionInteresadoApi from '../../Api/Services/ComunicacionInteresadoApi'
import Spinner from '../../Utils/Spinner';

import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';

function ComunicacionInteresadoForm() {

    const [respuestaDatosInteresado, setRespuestaDatosInteresado] = useState(false);
    const [DatosInteresadoLista, setDatosInteresadoLista] = useState({ data: [], links: [], meta: [] });
    const [errorApi, setErrorApi] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [respuestaSoporteRadicado, setRespuestaSoporteRadicado] = useState(false);
    const [soporteRadicadoLista, setSoporteRadicadoLista] = useState({ data: [], links: [], meta: [] });
    const [respuestaAsociaciones, setRespuestasociaciones] = useState(false);
    const [asociacionesLista, setAsociacionesLista] = useState({ data: [], links: [], meta: [] });
    const location = useLocation()
    const { from, disable } = location.state
    const [getListaAsociados, setListaAsociados] = useState([]);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getNombreProceso, setNombreProceso] = useState('');

    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let asociacionAraay = [];

    useEffect(() => {
        async function fetchData() {

            window.showSpinner(true);
            getComunicacionInteresado();


        }
        fetchData();
    }, []);

    const getComunicacionInteresado = () => {

        let data = {
            "data": {
                "type": "comunicacion_interesado",
                "attributes": {
                    "concatenado": '1234',
                    "id_proceso_disciplinario": procesoDisciplinarioId
                }
            }
        }

        // console.log(JSON.stringify(data));
        ComunicacionInteresadoApi.getComunicacionInteresadoByIdProceso(data, procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    
                    if (datos["data"] != "") {
                        setAsociacionesLista(datos);
                        setRespuestasociaciones(true);
                        nombreProceso();
                    }
                    else {
                        setEsNuevo(true);
                        getListados();
                    }
                }
                else {
                    setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/AntecedentesForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )
    }


    const getListados = () => {
        const data = {
            "data": {
                "type": "interesado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "tipo_documento": "1",
                    "numero_documento": "1",
                    "primer_nombre": "1",
                    "segundo_nombre": "1",
                    "primer_apellido": "1",
                    "segundo_apellido": "1",
                    "estado": '1'
                }
            }
        }
        // console.log(JSON.stringify(data));
        DatosInteresadoApi.getAllDatosInteresadoByIdProDisciplinario(data, procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setDatosInteresadoLista(datos);
                    setRespuestaDatosInteresado(true);
                    comunicacionSirius();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/ComunicacionInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
        )


    }

    function comunicacionSirius() {//VERIFICAR FUNCIONALIDAD
        const dataComunicacion = {
            "data": {
                "type": "documento_sirius",
                "attributes": {
                    "id_proceso_disciplinario": "id_proceso_disciplinario",
                    "id_etapa": "id_etapa",
                    "id_fase": "id_fase",
                    "url_archivo": "url_archivo",
                    "nombre_archivo": "nombre_archivo",
                    "estado": "1",
                    "file64": "file64",
                    "num_folios": "num_folios",
                    "num_radicado": "pendiente",
                    "extension": "doc",
                    "peso": "peso",
                    "subidos_sirius": true
                }
            }
        }

        DocumentoSiriusApi.getDocumentacionSiriusByIdProDisciplinario(dataComunicacion, procesoDisciplinarioId, null, null, '1', true).then(
            datos => {
                if (!datos.error) {
                    setSoporteRadicadoLista(datos);
                    setRespuestaSoporteRadicado(true);                 
                    nombreProceso();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: datos.error.toString(), show: true, redirect: '/ComunicacionInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    window.showSpinner(false);
                }
            }
            
        )
    }

    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre);
                }
                window.showSpinner(false);
            }
        )
    }

    const selectRadicadosSirius = () => {
        return (
            soporteRadicadoLista.data.map((soporte, i) => {
                return (
                    <option key={soporte.id} value={soporte.id}>{soporte.attributes.etapa.nombre.toUpperCase()} | {soporte.attributes.fase.nombre.toUpperCase()} | {soporte.attributes.num_radicado} | {soporte.attributes.nombre_archivo} | {soporte.attributes.sirius_track_id}</option>
                )
            })
        )
    }

    const asignarTemporal = () => {
        if (asociacionAraay.length == 0 && getListaAsociados.length > 0) {
            asociacionAraay = [];
            // console.log("entra");
            getListaAsociados.forEach(function (element, index) {
                asociacionAraay.push(element);
            });

        }

    }
    const handleChange = idInteresado => (event) => {

        try {
            asignarTemporal();
            // console.log(getListaAsociados);

            let valorRadicado = event.target.value;

            let concat = idInteresado + "|" + valorRadicado;

            if (asociacionAraay.length == 0) {

                asociacionAraay.push(concat);
                setListaAsociados(asociacionAraay);

            }
            else {
                let yaExiste = false;

                asociacionAraay.forEach(function (element, index) {


                    if (idInteresado == element.split("|")[0]) {
                        asociacionAraay[index] = idInteresado + "|" + valorRadicado;
                        yaExiste = true;
                    }

                });



                if (!yaExiste) {
                    asociacionAraay.push(concat)
                }

                setListaAsociados(asociacionAraay);
            }

            //setAsociaciones({ asociaciones: [asociaciones, listado] })
            // console.log(asociacionAraay);
        } catch (error) {
            // console.log(error);
        }


    }

    const listaDatosInteresado = () => {

        return (
            DatosInteresadoLista.data.map((datosInteresado, i) => {

                let primerApellido = datosInteresado.attributes.primer_apellido != null ? datosInteresado.attributes.primer_apellido : "";
                let segundoApellido = datosInteresado.attributes.segundo_apellido != null ? datosInteresado.attributes.segundo_apellido : "";
                let primerNombre = datosInteresado.attributes.primer_nombre != null ? datosInteresado.attributes.primer_nombre : "";
                let segundoNombre = datosInteresado.attributes.segundo_nombre != null ? datosInteresado.attributes.segundo_nombre : "";
                let nombreCompleto = primerApellido.toUpperCase() + " " + segundoApellido.toUpperCase() + " " + primerNombre.toUpperCase() + " " + segundoNombre.toUpperCase();

                return (
                    <tr key={datosInteresado.id}>

                        <td>{datosInteresado.attributes.primer_apellido ? nombreCompleto : "SIN INFORMACIÓN"}</td>
                        <td >
                            <Field name={datosInteresado.id} id={datosInteresado.id} as="select" className="form-control" onChange={handleChange(datosInteresado.id)}>
                                <option value="">Por favor seleccione</option>
                                {respuestaSoporteRadicado ? selectRadicadosSirius() : null}
                            </Field>
                        </td>
                        <td>
                            <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-primary' onClick={() => handleClicArchivo(datosInteresado.id, true)}><i className="fas fa-download"></i></button>
                        </td>

                    </tr>
                )
            })
        )
    }

    const handleClicArchivo = (id, validacion) => {

        let documento_sirius = null;

        if (validacion) {
            let id_documento = null;

            for (let cont = 0; cont < getListaAsociados.length; cont++) {
                let auxDato = getListaAsociados[cont].split('|');
                if (auxDato[0] == id) {
                    id_documento = auxDato[1];
                    cont = getListaAsociados.length + 1;
                }
            }

            if (!id_documento) {
                setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: 'DEBE SELECCIONAR UN DOCUMENTO PRIMERO', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                return;
            }

            documento_sirius = soporteRadicadoLista.data.find(datos => datos.id == id_documento);

            if (!documento_sirius) {
                setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: 'DEBE SELECCIONAR UN DOCUMENTO PRIMERO', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                return;
            }
        }
        else {
            documento_sirius = {
                id: id.documento.uuid,
                attributes: id.documento
            }
        }

        try {
            window.showSpinner(true);
            let nombre_documento = documento_sirius.attributes.nombre_archivo;
            let extension = documento_sirius.attributes.extension;
            let es_compulsa = false;

            if (documento_sirius.attributes.compulsa == '1') {
                es_compulsa = true;
            }

            const data = {
                "data": {
                    "type": "documeto_sirius",
                    "attributes": {
                        "id_documento_sirius": documento_sirius.id,
                        "extension": extension,
                        "es_compulsa": es_compulsa,
                        "radicado": from.radicado,
                        "vigencia": from.vigencia
                    }
                }
            }

            DocumentoSiriusApi.getDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        //console.log(datos.content_type);
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento, extension);
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
            window.showSpinner(false);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }


    const listaAsociaciones = () => {
        return (
            asociacionesLista.data.map((asociacion, i) => {

                return (
                    <tr key={asociacion.id}>
                        <td>{asociacion.attributes.nombre_interesado ? asociacion.attributes.nombre_interesado.toUpperCase() : "SIN INFORMACIÓN"}</td>
                        <td>{asociacion.attributes.radicado} - {asociacion.attributes.archivo}</td>
                        <td>
                            <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-primary' onClick={() => handleClicArchivo(asociacion.attributes, false)}><i className="fas fa-download"></i></button>
                        </td>
                    </tr>
                )
            })
        )
    }

    const enviarDatos = (valores) => {

        getListaAsociados.forEach(lista => {
            let auxLista = lista.split('|');
            if (getListaAsociados.filter(dato => {
                let auxDato = dato.split('|');
                if (auxDato[1] == auxLista[1]) {
                    return dato;
                }
                return null;
            }).length > 1) {
                setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: 'NO PUEDE INFORMAR A DOS INTERESADOS CON EL MISMO DOCUMENTO.', show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
            }
        });

        window.showSpinner(true);
        const data = {
            "data": {
                "type": 'comunicacion_interesado',
                "attributes": {
                    "concatenado": getListaAsociados,
                    "id_proceso_disciplinario": procesoDisciplinarioId

                }
            }
        }

        GenericApi.addGeneric("comunicacion-interesado", data).then(

            datos => {
                if (!datos.error) {
                    setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/RamasProceso/', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });

                    //window.location.reload(true);
                }
                else {
                    setModalState({ title: getNombreProceso + " :: COMUNICACIÓN DEL INTERESADO", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    asignarTemporal();
                }
                window.showSpinner(false);

            }
        )

    }



    return (
        <>
            {<ModalGen data={getModalState} />}

            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item">
                            <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                        <li className="breadcrumb-item"><small>Ramas del proceso</small></li>
                    </ol>
                </nav>
            </div>



            <div className="block block-themed">

                <div className={(disable ? ("block-header bg-dark") : "block-header")}>
                    <h3 className="block-title">{getNombreProceso} :: <strong>COMUNICACIÓN DEL INTERESADO</strong></h3>
                </div>


                <div className="block-content">


                    <div className="row">

                        <div className="col-md-12">
                            {<Spinner />}
                            {<InfoErrorApi error={errorApi} />}
                            {<InfoExitoApi />}
                            {<InfoCustom mensaje={"EL RADICADO QUE INTENTA ASOCIAR YA SE ENCUENTRA RELACIONADO EN OTRO INTERESADO"} />}
                            <Formik
                                initialValues={{
                                    completado: ''
                                }}

                                validate={(valores) => {
                                    let errores = {}

                                    if (getListaAsociados.length != DatosInteresadoLista.data.length) {
                                        errores.completado = "DEBE ASOCIAR TODOS LOS INTERESADOS";
                                    }

                                    return errores;
                                }}
                                onSubmit={(valores, { resetForm }) => {
                                    enviarDatos(valores);
                                }}
                            >


                                {({ errors }) => (
                                    <Form>

                                        <div className='text-right my-2'>

                                            <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: disable }}>
                                                <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                                            </Link>

                                        </div>

                                        {
                                            (esNuevo && disable != true && from.mismoUsuarioBuscador) ? (
                                                <div className="block block-rounded block-bordered">
                                                    <h3 className="block-title"><strong>COMUNICACIÓN DEL INTERESADO</strong></h3>
                                                    <div className="block-content block-content-full">

                                                        <div className="row">


                                                            <div className="col-sm-12">
                                                                <ErrorMessage name="completado" component={() => (<span className="text-danger">{errors.completado}</span>)} />
                                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                    <thead>

                                                                        <tr>
                                                                            <th className="text-center">INTERESADO</th>
                                                                            <th className="text-center">RADICADO PARA ASOCIAR</th>
                                                                            <th>ACCIONES</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {respuestaSoporteRadicado ? listaDatosInteresado() : null}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        }
                                        {
                                            (esNuevo && disable != true && from.mismoUsuarioBuscador) ? (
                                                <div className="block-content block-content-full text-right bg-light">
                                                    <div className='row'>

                                                        <div className='col-12'>
                                                            <button type="submit" className="btn btn-rounded btn-primary"> GUARDAR Y ASOCIAR</button>

                                                        </div>
                                                    </div>



                                                </div>
                                            ) : null
                                        }

                                        {
                                            (!esNuevo) ? (

                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                    <thead>
                                                        <tr>
                                                            <th>INTERESADO</th>
                                                            <th>RADICADO</th>
                                                            <th>ACCIONES</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {respuestaAsociaciones ? listaAsociaciones() : null}
                                                    </tbody>
                                                </table>

                                            ) : null
                                        }


                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );


}
export default ComunicacionInteresadoForm;
