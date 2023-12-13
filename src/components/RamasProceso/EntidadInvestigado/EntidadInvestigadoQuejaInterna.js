import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Spinner from '../../Utils/Spinner';
import { Navigate } from "react-router-dom";
import Autocomplete from "../../Autocomplete/Autocomplete";
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import '../../Utils/Constants';

import GenericApi from '../../Api/Services/GenericApi';
import ModalAceptarActualizar from '../../Utils/Modals/ModalAceptarActualizar';


function EntidadInvestigadoQuejaInterna() {

    const [countTextArea, setCountTextArea] = useState(0);
    const [getMaximoTextArea, setMaximoTextArea] = useState(0);
    const [getMinimoTextArea, setMinimoTextArea] = useState(0);

    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [observaciones, setObservaciones] = useState('');
    const [getValidar, setValidar] = useState(null);
    const [getValidarRegistrar, setValidarRegistrar] = useState(false);
    const [getPlanta, setPlanta] = useState('');
    const [getContratista, setContratista] = useState('');

    const [listaTipoRespuesta, setListaTipoRespuesta] = useState({ data: {} });
    const [selectedTipoRespuesta, setSelectedTipoRespuesta] = useState("");
    const [respuestaTipoRespuesta, setRespuestaTipoRespuesta] = useState(false);

    const [getListaTipoFuncionario, setListaTipoFuncionario] = useState({ data: {} });
    const [selectedTipoFuncionario, setSelectedTipoFuncionario] = useState("");
    const [respuestaTipoFuncionario, setRespuestaTipoFuncionario] = useState(false);


    const [getListaTipoDocumento, setListaTipoDocumento] = useState({ data: {} });
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState("");
    const [selectedTipoDocumentoC, setSelectedTipoDocumentoC] = useState("");
    const [respuestaTipoDocumento, setRespuestaTipoDocumento] = useState(false);

    const [getListaDependencia, setListaDependencia] = useState({ data: {} });
    const [selectedDependencia, setSelectedDependencia] = useState("");
    const [selectedDependenciaC, setSelectedDependenciaC] = useState("");
    const [respuestaDependencia, setRespuestaDependencia] = useState(false);

    const [getListaFuncionariosRegistrados, setListaFuncionariosRegistrados] = useState({ data: [], links: [], meta: [] });
    const [selectedFuncionariosRegistrados, setSelectedFuncionariosRegistrados] = useState("");
    const [respuestaFuncionariosRegistrados, setRespuestaFuncionariosRegistrados] = useState(false);

    const [getSeach, setSeach] = useState('');
    const paganationPerPages = global.Constants.DATA_TABLE.PAGINATION_PER_PAGE;
    const [perPage, setPerPage] = useState(global.Constants.DATA_TABLE.PAGINATION_PER_PAGE);
    const [pageActual, setPageActual] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const location = useLocation()
    const { from, disable } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;

    const [getNombreProceso, setNombreProceso] = useState('');


    const columns = [

        {
            name: 'SE IDENTIFICA EL INVESTIGADO',
            cell: investigado => <div>
                {investigado.attributes.se_identifica_investigado}<br />
            </div>,

            selector: investigado => investigado.attributes.se_identifica_investigado,
            sortable: true,
            width: "15%"
        },

        {
            name: 'FUNCIONARIO',
            cell: investigado => <div>
                <strong>Nombre: </strong>{investigado.attributes.nombre_completo}<br />
                <strong>Documento: </strong>{investigado.attributes.documento}<br />
            </div>,

            selector: investigado => investigado.attributes.nombre_completo,
            sortable: true,
            width: "15%"
        },


        {
            name: 'NÚMERO DE CONTRATO',
            cell: investigado => <div>
                {investigado.attributes.numero_contrato}<br />
            </div>,

            selector: investigado => investigado.attributes.numero_contrato,
            sortable: true,
            width: "15%"
        },

        {
            name: 'DEPENDENCIA',
            cell: investigado => <div>
                {investigado.attributes.nombre_dependencia}<br />
            </div>,

            selector: investigado => investigado.attributes.nombre_dependencia,
            sortable: true,
            width: "15%"
        },

        {
            name: 'OBSERVACIONES',
            cell: investigado => <div>
                {investigado.attributes.observaciones}<br />
            </div>,

            selector: investigado => investigado.attributes.nombre_dependencia,
            sortable: true,
            width: "30%"
        },


    ];


    useEffect(() => {

        async function fetchData() {

            window.showSpinner(true);
            cargarValoresQuejaInterna(from.datosQuejaInterna.attributes);

        }

        fetchData();
    }, []);



    function containsSpecialChars(str) {

        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {
            if (str.includes(specialChar)) {
                return true;
            }

            return false;
        });

        return result;
    }

    const cargarValoresQuejaInterna = (data) => {

        // Se validan que hayan valores almacenados previamente
        if (data.investigado == "0") {
            var validarElemento = document.getElementById('no');

            if (validarElemento) {
                validarElemento.checked = true;
            }
            setValidar(false);
            setObservaciones(data.comentario_identifica_investigado);

        } else if (data.investigado == "1") {
            var validarElemento = document.getElementById('si');

            if (validarElemento) {
                validarElemento.checked = true;
            }
            setValidar(true);
            setPlanta(data.planta);
            setContratista(data.contratista);
        }

        obtenerParametros();

    }

    const obtenerParametros = () => {
        try {

            const data = {
                "data": {
                    "type": 'mas_parametro',
                    "attributes": {
                        "nombre": "minimo_caracteres_textarea|maximo_caracteres_textarea"
                    }
                }
            }


            GenericApi.getByDataGeneric('parametro/parametro-nombre', data).then(
                //buscamos el parametro
                datos => {

                    if (!datos.error) {

                        if (datos["data"].length > 0) {

                            datos["data"].filter(data => data["attributes"]["nombre"].includes('minimo_caracteres_textarea')).map(filteredName => (
                                setMinimoTextArea(filteredName["attributes"]["valor"])
                            ))
                            datos["data"].filter(data => data["attributes"]["nombre"].includes('maximo_caracteres_textarea')).map(filteredName => (
                                setMaximoTextArea(filteredName["attributes"]["valor"])
                            ))
                        }
                        listaRespuestas();
                    } else {
                        setModalState({ title: getNombreProceso + " :: Entidad del investigado Queja Interna", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            // console.log(error);
        }
    }

    const listaRespuestas = () => {

        GenericApi.getGeneric("tipo-respuesta").then(

            datos => {
                if (!datos.error) {
                    setListaTipoRespuesta(datos);
                    setRespuestaTipoRespuesta(true);
                    listaTiposFuncionarios();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: Entidad del investigado Queja Interna", show: true, redirect: '/EntidadInvestigadoQuejaInterna', from: { from } });
                }
            }
        )
    }

    const listaTiposFuncionarios = () => {

        GenericApi.getGeneric("tipo-funcionario").then(
            datos => {
                if (!datos.error) {
                    setListaTipoFuncionario(datos);
                    setRespuestaTipoFuncionario(true);
                    listaTipoDocumento();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: Entidad del investigado Queja Interna", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoQuejaInterna', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const listaTipoDocumento = () => {

        GenericApi.getGeneric("tipo-documento").then(
            datos => {
                if (!datos.error) {
                    setListaTipoDocumento(datos);
                    setRespuestaTipoDocumento(true);
                    listaDependencias()
                }
                else {
                    setModalState({ title: getNombreProceso + " :: Entidad del investigado Queja Interna", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoQuejaInterna', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    const listaDependencias = () => {

        GenericApi.getGeneric("mas-dependencia-origen").then(

            datos => {
                if (!datos.error) {
                    setListaDependencia(datos);
                    setRespuestaDependencia(true);
                    listaFuncionariosRegistrados();
                }
                else {
                    setModalState({ title: getNombreProceso + " :: Entidad del investigado Queja Interna", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoQuejaInterna', from: { from } });
                }
            }
        )
    }


    const listaFuncionariosRegistrados = () => {

        GenericApi.getGeneric("get-entidad-investigado-qi/" + procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setListaFuncionariosRegistrados(datos);
                    setRespuestaFuncionariosRegistrados(true);
                }
                else {
                    setModalState({ title: getNombreProceso + " :: Entidad del investigado Queja Interna", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoQuejaInterna', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                nombreProceso();
            }
        )
    }


    const nombreProceso = () => {

        GenericApi.getByIdGeneric("nombre-proceso", procesoDisciplinarioId).then(
            datos => {
                if (!datos.error) {
                    setNombreProceso(datos.data.attributes.nombre)
                }
                window.showSpinner(false);
            }
        )
    }

    const selectTipoRespuesta = () => {
        return (
            listaTipoRespuesta.data.map((tipo_respuesta, i) => {
                return (
                    <>
                        <option key={tipo_respuesta.id} value={tipo_respuesta.id}>{tipo_respuesta.attributes.nombre}</option>
                    </>
                )
            })
        )
    }

    const selectTipoFuncionario = () => {
        return (
            getListaTipoFuncionario.data.map((tipo_funcionario, i) => {
                return (
                    <>
                        <option key={tipo_funcionario.id} value={tipo_funcionario.id}>{tipo_funcionario.attributes.nombre}</option>
                    </>
                )
            })
        )
    }

    const selectTipoDocumento = () => {
        return (
            getListaTipoDocumento.data.map((tipo_funcionario, i) => {
                return (
                    <>
                        <option key={tipo_funcionario.id} value={tipo_funcionario.id}>{tipo_funcionario.attributes.nombre}</option>
                    </>
                )
            })
        )
    }


    const selectTipoDependencia = () => {
        return (
            getListaDependencia.data.map((dependencia, i) => {
                return (
                    <>
                        <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                    </>
                )
            })
        )
    }

    let selectChangeTipoRespuesta = (e) => {
        setSelectedTipoRespuesta(e);
    }


    let selectChangeTipoFuncionario = (e) => {
        setSelectedTipoFuncionario(e);
    }

    const handlePageChange = page => {
        setPageActual(page);
    }

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setPageActual(page);
    }

    // Metodo encargado de enviar los datos
    const enviarDatos = (datos) => {

        // Se quita el modal de la informacion
        window.hideModalEntidadInvestigadoQuejaInterna();

        // Se inicializa el cargando
        window.showSpinner(true);

        // Se inicializa la variable
        let data;

        // Se valida cuando es tipo Planta
        if (datos.tipo_respuesta === 1) {

            // Se reedeclara la variable
            data = {
                "data": {
                    "type": "entidad_funcionario_queja_interna",
                    "attributes": {
                        "id_tipo_funcionario": datos.ingresoTipoFuncionario,
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "se_identifica_investigado": true,
                        "id_tipo_documento": datos.ingresoTipoDocumentoPlanta,
                        "numero_documento": datos.inputNumeroDocumentoPlanta,
                        "primer_nombre": datos.inputPrimerNombre,
                        "segundo_nombre": datos.inputSegundoNombre,
                        "primer_apellido": datos.inputPrimerApellido,
                        "segundo_apellido": datos.inputSegundoApellido,
                        "dependencia": datos.ingresoTipoFuncionario == 1 ? datos.inputDependenciaPlanta : datos.inputDependenciaContratista,
                        "razon_social": datos.inputRazonSocial,
                        "numero_contrato": datos.inputNumeroContrato,
                    }
                }
            }
        }

        // Se valida cuando es tipo Contratista
        else if (datos.tipo_respuesta === 2) {

            // Se reedeclara la variable
            data = {
                "data": {
                    "type": "entidad_funcionario_queja_interna",
                    "attributes": {
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "se_identifica_investigado": false,
                        "observaciones": datos.observaciones,
                    }
                }
            }
        }

        // Se consume la API
        GenericApi.addGeneric("entidad-investigado-qi", data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se deshabilita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se ejecuta la modal de exito
                    setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO ", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/EntidadInvestigadoQuejaInterna', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se ejecuta la modal de error
                    setModalState({ title: getNombreProceso + " :: ENTIDAD DEL INVESTIGADO ", message: datos.error.toString(), show: true, redirect: '/EntidadInvestigadoQuejaInterna', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const handleClick = (event) => {
        window.location.reload();
    };


    const componenteTipoRespuesta = (tipo_respuesta) => {

        // CONFIRMACION TIPO DE CLASIFICADO = SI
        if (tipo_respuesta === 1) {
            return (
                <>
                    <Formik

                        initialValues={{
                            tipo_respuesta: 1,
                            ingresoTipoFuncionario: selectedTipoFuncionario,
                            ingresoTipoDocumentoPlanta: '',
                            inputNumeroDocumentoPlanta: '',
                            inputPrimerNombre: '',
                            inputSegundoNombre: '',
                            inputPrimerApellido: '',
                            inputSegundoApellido: '',
                            inputDependenciaPlanta: '',
                            inputTipoDocumentoContratista: '',
                            inputNumeroDocumentoContratista: '',
                            inputRazonSocial: '',
                            inputNumeroContrato: '',
                            inputDependenciaContratista: '',
                        }}
                        enableReinitialize

                        validate={(valores) => {
                            let errores = {}

                            if (!valores.ingresoTipoFuncionario) {
                                errores.ingresoTipoFuncionario = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }

                            if (valores.ingresoTipoFuncionario == 1) {

                                if (!valores.ingresoTipoDocumentoPlanta) {
                                    errores.ingresoTipoDocumentoPlanta = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputNumeroDocumentoPlanta) {
                                    errores.inputNumeroDocumentoPlanta = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputPrimerNombre) {
                                    errores.inputPrimerNombre = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputPrimerApellido) {
                                    errores.inputPrimerApellido = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputDependenciaPlanta) {
                                    errores.inputDependenciaPlanta = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputDependenciaPlanta) {
                                    errores.inputDependenciaPlanta = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }
                            }

                            if (valores.ingresoTipoFuncionario == 2) {

                                if (!valores.ingresoTipoDocumentoContratista) {
                                    errores.ingresoTipoDocumentoContratista = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputNumeroDocumentoContratista) {
                                    errores.inputNumeroDocumentoContratista = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputRazonSocial) {
                                    errores.inputRazonSocial = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                if (!valores.inputDependenciaContratista) {
                                    errores.inputDependenciaContratista = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }
                            }
                            return errores
                        }}
                        onSubmit={(valores, { resetForm }) => {
                            enviarDatos(valores);
                        }}>
                        {({ errors }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="ingresoTipoFuncionario">TIPO DE FUNCIONARIO<span className="text-danger">*</span></label>
                                            <Field as="select" className="form-control" id="ingresoTipoFuncionario" name="ingresoTipoFuncionario"
                                                value={selectedTipoFuncionario} onChange={e => selectChangeTipoFuncionario(e.target.value)}>
                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                {respuestaTipoFuncionario ? selectTipoFuncionario() : null}
                                            </Field>
                                            <ErrorMessage name="ingresoTipoFuncionario" component={() => (<span className="text-danger">{errors.ingresoTipoFuncionario}</span>)} />
                                        </div>
                                    </div>
                                </div>
                                {selectedTipoFuncionario == 1 ?
                                    <>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="ingresoTipoDocumentoPlanta">TIPO DE DOCUMENTO<span className="text-danger">*</span></label>
                                                    <Field as="select" className="form-control" id="ingresoTipoDocumentoPlanta" name="ingresoTipoDocumentoPlanta">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {respuestaTipoDocumento ? selectTipoDocumento() : null}
                                                    </Field>
                                                    <ErrorMessage name="ingresoTipoDocumentoPlanta" component={() => (<span className="text-danger">{errors.ingresoTipoDocumentoPlanta}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputNumeroDocumentoPlanta">NÚMERO DE DOCUMENTO<span className="text-danger">*</span></label>
                                                    <Field as="input" className="form-control" id="inputNumeroDocumentoPlanta" name="inputNumeroDocumentoPlanta" placeholder="" autocomplete="off"></Field>
                                                    <ErrorMessage name="inputNumeroDocumentoPlanta" component={() => (<span className="text-danger">{errors.inputNumeroDocumentoPlanta}</span>)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputPrimerNombre">PRIMER NOMBRE<span className="text-danger">*</span></label>
                                                    <Field as="input" className="form-control" id="inputPrimerNombre" name="inputPrimerNombre" placeholder="" autocomplete="off"/>
                                                    <ErrorMessage name="inputPrimerNombre" component={() => (<span className="text-danger">{errors.inputPrimerNombre}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputSegundoNombre">SEGUNDO NOMBRE</label>
                                                    <Field as="input" className="form-control" id="inputSegundoNombre" name="inputSegundoNombre" placeholder="" autocomplete="off"/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputPrimerApellido">PRIMER APELLIDO<span className="text-danger">*</span></label>
                                                    <Field as="input" className="form-control" id="inputPrimerApellido" name="inputPrimerApellido" placeholder="" autocomplete="off"/>
                                                    <ErrorMessage name="inputPrimerApellido" component={() => (<span className="text-danger">{errors.inputPrimerApellido}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputSegundoApellido">SEGUNDO APELLIDO</label>
                                                    <Field as="input" className="form-control" id="inputSegundoApellido" name="inputSegundoApellido" placeholder="" autocomplete="off"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="inputDependenciaPlanta">DEPENDENCIA <span className="text-danger">*</span></label>
                                                    <Field as="select" className="form-control" id="inputDependenciaPlanta" name="inputDependenciaPlanta">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {respuestaDependencia ? selectTipoDependencia() : null}
                                                    </Field>
                                                    <ErrorMessage name="inputDependenciaPlanta" component={() => (<span className="text-danger">{errors.inputDependenciaPlanta}</span>)} />
                                                </div>
                                            </div>
                                        </div>
                                    </> : null
                                }
                                {selectedTipoFuncionario == 2 ?
                                    <>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputTipoDocumentoContratista">TIPO DE DOCUMENTO<span className="text-danger">*</span></label>
                                                    <Field as="select" className="form-control" id="ingresoTipoDocumentoContratista" name="ingresoTipoDocumentoContratista">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {respuestaTipoDocumento ? selectTipoDocumento() : null}
                                                    </Field>
                                                    <ErrorMessage name="ingresoTipoDocumentoContratista" component={() => (<span className="text-danger">{errors.ingresoTipoDocumentoContratista}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputNumeroDocumentoContratista">NÚMERO DE DOCUMENTO<span className="text-danger">*</span></label>
                                                    <Field as="input" className="form-control" id="inputNumeroDocumentoContratista" name="inputNumeroDocumentoContratista" placeholder="" autocomplete="off"/>
                                                    <ErrorMessage name="inputNumeroDocumentoContratista" component={() => (<span className="text-danger">{errors.inputNumeroDocumentoContratista}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputRazonSocial">RAZÓN SOCIAL<span className="text-danger">*</span></label>
                                                    <Field as="input" className="form-control" id="inputRazonSocial" name="inputRazonSocial" placeholder="" autocomplete="off"/>
                                                    <ErrorMessage name="inputRazonSocial" component={() => (<span className="text-danger">{errors.inputRazonSocial}</span>)} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="inputNumeroContrato">NÚMERO DE CONTRATO</label>
                                                    <Field as="input" className="form-control" id="inputNumeroContrato" name="inputNumeroContrato" placeholder="" autocomplete="off"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="inputDependenciaContratista">DEPENDENCIA<span className="text-danger">*</span></label>
                                                    <Field as="select" className="form-control" id="inputDependenciaContratista" name="inputDependenciaContratista">
                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                        {respuestaDependencia ? selectTipoDependencia() : null}
                                                    </Field>
                                                    <ErrorMessage name="inputDependenciaContratista" component={() => (<span className="text-danger">{errors.inputDependenciaContratista}</span>)} />
                                                </div>
                                            </div>
                                        </div>
                                    </> : null
                                }
                                <div className="block-content block-content-full text-right">
                                    <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                    <Link to={`/RamasProceso/`} state={{ from: from }}>
                                        <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                    </Link>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </>
            );
        }

        /// CONFIRMACION TIPO DE CLASIFICADO = NO
        else if (tipo_respuesta === 2) {
            return (
                <Formik
                    initialValues={{
                        observaciones: '',
                        tipo_respuesta: 2
                    }}
                    enableReinitialize

                    validate={(valores) => {
                        let errores = {}

                        if (!valores.observaciones) {
                            errores.observaciones = '{global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO}'
                        }
                        else if (valores.observaciones.length < getMinimoTextArea) {
                            errores.observaciones = 'DEBE INGRESAR MÍNIMO ' + getMinimoTextArea + ' CARÁCTERES'
                        }
                        else if (valores.observaciones.length > getMaximoTextArea) {
                            errores.observaciones = 'DEBE INGRESAR MÁXIMO' + getMaximoTextArea + ' CARÁCTERES'
                        }

                        if (valores.observaciones) {
                            if (containsSpecialChars(valores.observaciones))
                                errores.observaciones = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS
                        }

                        return errores
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        enviarDatos(valores);
                    }}>
                    {({ errors }) => (
                        <Form>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>OBSERVACIONES</label>  <span className="text-danger">*</span>
                                        <Field as="textarea" className="form-control" id="observaciones" name="observaciones" rows="4"
                                            placeholder="ESCRIBA EN ESTE ESPACIO LAS OBSERVACIONES"></Field>
                                        <div className="text-right">
                                            <span className="text-primary">{countTextArea} / {getMaximoTextArea}</span>
                                        </div>
                                        <ErrorMessage name="observaciones" component={() => (<span className="text-danger">{errors.observaciones}</span>)} />
                                    </div>
                                </div>
                            </div>
                            <div className="block-content block-content-full text-right">
                                <button type="submit" className="btn btn-rounded btn-primary" onClick={event => handleClick(event)}>{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                <Link to={`/RamasProceso/`} state={{ from: from }}>
                                    <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            );
        }
    };

    // Componente principal
    return (
        <>
            {<Spinner />}
            {<ModalAceptarActualizar data={getModalState} />}
            <div className="content">
                <div className="w2d_block let">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb breadcrumb-alt push">
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis Pendientes</small></Link></li>
                            <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from, disable: disable }}><small>Ramas del proceso</small></Link></li>
                            <li className="breadcrumb-item"> <small>Entidad del investigado queja interna</small></li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="block block-themed">
                            <div className="block-header">
                                <h3 className="block-title">{getNombreProceso.toUpperCase()}:: ENTIDAD DEL INVESTIGADO</h3>
                            </div>
                            <div className="block-content">
                                <div className="form-group">
                                    <div className='text-right'>
                                        <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus" data-toggle="modal" data-target="#modalFuncionario"></i> </button>
                                        <Link to={`/EntidadInvestigadoLista/`} title='Regresar a lista de Entidades Investigado' state={{ from: from }}>
                                            <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 push">
                                <div className="alert alert-info" role="alert">
                                    <div className="row">
                                        <div className="col-lg-3"><span className="txt-blue-primary"><strong>ENTIDAD: </strong> <span className='txt-black-primary'>{from.datosQuejaInterna.attributes.nombre_entidad}</span></span></div>
                                        <div className="col-lg-3"><span className="txt-blue-primary"><strong>SECTOR: </strong> <span className='txt-black-primary'> Órgano de control</span></span></div>
                                        <div className="col-lg-3"><span className="txt-blue-primary"><strong>DIRECCIÓN: </strong> <span className='txt-black-primary'> {from.datosQuejaInterna.direccion}</span></span></div>
                                        <div className="col-lg-3"><span className="txt-blue-primary"><strong>CORREO: </strong> <span className='txt-black-primary'> {from.datosQuejaInterna.correo}</span></span></div>
                                        <hr />
                                        <div className="col-lg-3"><span className="txt-blue-primary"><strong>TELÉFONO: </strong> <span className='txt-black-primary'> {from.datosQuejaInterna.telefono}</span></span></div>
                                        <div className="col-lg-9"><span className="txt-blue-primary"><strong>PÁGINA WEB: </strong> <span className='txt-black-primary'> {from.datosQuejaInterna.paginaWeb}</span></span></div>
                                        <hr />
                                        <div className="col-lg-12"><span className="txt-blue-primary"><strong>ÚTIMA ACTUALIZACIÓN: </strong> <span className='txt-black-primary'> {from.datosQuejaInterna.attributes.created_at}</span></span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal" id="modalFuncionario" tabindex="-1" role="dialog" aria-labelledby="modal-block-large" aria-hidden="true">
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="block block-themed block-transparent mb-0">
                                            <div className="block-header bg-primary-dark">
                                                <h3 className="block-title">PRESUNTO INVESTIGADO</h3>
                                                <div className="block-options">
                                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                                        <i className="fa fa-fw fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="block-content">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label htmlFor="ingresoPresuntoInvestigado">¿IDENTIFICA AL PRESUNTO INVESTIGADO? <span className="text-danger">*</span></label>
                                                            <select className="form-control" id="ingresoPresuntoInvestigado" name="ingresoPresuntoInvestigado"
                                                                value={selectedTipoRespuesta} onChange={e => selectChangeTipoRespuesta(e.target.value)}>
                                                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                {respuestaTipoRespuesta ? selectTipoRespuesta() : null}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/*SI APLICA RECLASIFIFCACION*/}
                                                {selectedTipoRespuesta === '1' ? componenteTipoRespuesta(1) : ''}

                                                {/*NO APLICA RECLASIFIFCACION*/}
                                                {selectedTipoRespuesta === '2' ? componenteTipoRespuesta(2) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {respuestaFuncionariosRegistrados ?
                                <>
                                    <h4 className="text-center">FUNCIONARIOS REGISTRADOS</h4>
                                    <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                                        columns={columns}
                                        data={getListaFuncionariosRegistrados.data.filter((suggestion) => {
                                            if (getSeach === "") {
                                                return suggestion;
                                            } else if (
                                                ((suggestion.attributes.primer_nombre))
                                            ) {
                                                return suggestion;
                                            }
                                        })}
                                        perPage={perPage}
                                        page={pageActual}
                                        pagination
                                        noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                        paginationTotalRows={getListaFuncionariosRegistrados.data.length}
                                        onChangePage={handlePageChange}
                                        onChangeRowsPerPage={handlePerRowsChange}
                                        defaultSortFieldId="Nombre"
                                        striped
                                        paginationComponentOptions={{ rowsPerPageText: global.Constants.DATA_TABLE.FILTRO_POR_PAGINA }}
                                        defaultSortAsc={false} />
                                </> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}
export default EntidadInvestigadoQuejaInterna;
