import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useRef, useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import { Link } from "react-router-dom";
import ExternosApi from '../../Api/Services/ExternosApi';
import Autocomplete from "../../Autocomplete/Autocomplete";
import AutocompletePersonaNatural from "../../Autocomplete/AutocompletePersonaNatural";
import { useLocation } from 'react-router-dom'
import CamposRequeridosInteresado from '../../Models/CamposRequeridosInteresado';
import moment from 'moment';
import validator from 'validator'
import ModalGen from '../../Utils/Modals/ModalGeneric';
import GenericApi from '../../Api/Services/GenericApi';
import '../../Utils/Constants';

function DatosInteresadoForm() {

    const [selectTipoInteresado, setSelectTipoInteresado] = useState("");
    const [selectTipoEntidad, setSelectTipoEntidad] = useState("");
    const [selectSujetoProcesal, setSelectSujetoProcesal] = useState("");
    const [formIntialValuesInteresado, setFormIntialValuesInteresado] = useState();
    const [selectedDepartamento, setSelectedDepartamento] = useState("");
    const [respuestaDepartamento, setRespuestaDepartamento] = useState(false);
    const [listaDepartamento, setListaDepartamento] = useState({ data: {} });
    const [listaCiudad, setListaCiudad] = useState({ data: {} });
    const [respuestaCiudad, setRespuestaCiudad] = useState(false);
    const [listaLocalidad, setListaLocalidad] = useState({ data: {} });
    const [respuestaLocalidad, setRespuestaLocalidad] = useState(false);
    const [listaSexo, setListaSexo] = useState({ data: {} });
    const [respuestaSexo, setRespuestaSexo] = useState(false);
    const [listaGenero, setListaGenero] = useState({ data: {} });
    const [respuestaGenero, setRespuestaGenero] = useState(false);
    const [listaOrientacionSexual, setListaOrientacionSexual] = useState({ data: {} });
    const [respuestaOrientacionSexual, setRespuestaOrientacionSexual] = useState(false);
    const [listaTipoInteresado, setListaTipoInteresado] = useState({ data: {} });
    const [respuestaTipoInteresado, setRespuestaTipoInteresado] = useState(false);
    const [getMuestraCoincidencias, setMuestraCoincidencias] = useState(false);
    const [listaTipoDocumento, setListaTipoDocumento] = useState({ data: {} });
    const [respuestaTipoDocumento, setRespuestaTipoDocumento] = useState(false);
    const [listaTipoEntidad, setListaTipoEntidad] = useState({ data: {} });
    const [respuestaTipoEntidad, setRespuestaTipoEntidad] = useState(false);
    const [listaEntidad, setListaEntidad] = useState({ data: {} });
    const [respuestaEntidad, setRespuestaEntidad] = useState(false);
    const [listaTipoSujetoProcesal, setListaTipoSujetoProcesal] = useState({ data: {} });
    const [respuestaTipoSujetoProcesal, setRespuestaTipoSujetoProcesal] = useState(false);
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [numeroDocumento, setNumeroDocumento] = useState("");
    const [direccionCorrespondencia, setDireccionCorrespondencia] = useState("");
    const [direccionCorrespondenciaJson, setDireccionCorrespondenciaJson] = useState("");
    const [correo, setCorreo] = useState("");
    const [checkCorreo, setCheckCorreo] = useState(false);
    const [telefonoCelular, setTelefonoCelular] = useState("");
    const [telefonoFijo, seTelefonoFijo] = useState("");
    const [cargo, setCargo] = useState("");
    const [folio, setFolio] = useState("");
    const [listaDependenciaOrigen, setListaDependenciaOrigen] = useState({ data: {} });
    const [respuestaDependenciaOrigen, setDependenciaOrigen] = useState(false);
    const [listaDependenciaEntidad, setListaDependenciaEntidad] = useState({ data: {} });
    const [respuestaDependenciaEntidad, setDependenciaEntidad] = useState(false);
    const [primerApellido, setPrimerApellido] = useState("");
    const [segundoApellido, setSegundoApellido] = useState("");
    const [primerNombre, setPrimerNombre] = useState("");
    const [segundoNombre, setSegundoNombre] = useState("");
    const [datosRequeridos, setDatosRequeridos] = useState({ data: {} });
    const [esAnonimo, setEsAnonimo] = useState(false);
    const [idEntidad, setIdEntidad] = useState('');
    const [getIdEntidadPersonaNatural, setIdEntidadPersonaNatural] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const [getDireccionNomenclatura, setDireccionNomenclatura] = useState({ data: {} });
    const [getSelectedDireccionNomenclatura, setSelectedDireccionNomenclatura] = useState("");
    const [getRespuestaDireccionNomenclatura, setRespuestaDireccionNomenclatura] = useState(false);

    const [getDireccionLetras, setDireccionLetras] = useState({ data: {} });
    const [getSelectedDireccionLetrasUno, setSelectedDireccionLetrasUno] = useState("");
    const [getSelectedDireccionLetrasDos, setSelectedDireccionLetrasDos] = useState("");
    const [getRespuestaDireccionLetras, setRespuestaDireccionLetras] = useState(false);

    const [getDireccionOrientacion, setDireccionOrientacion] = useState({ data: {} });
    const [getSelectedDireccionOrientacionUno, setSelectedDireccionOrientacionUno] = useState("");
    const [getSelectedDireccionOrientacionDos, setSelectedDireccionOrientacionDos] = useState("");
    const [getRespuestaDireccionOrientacion, setRespuestaDireccionOrientacion] = useState(false);

    const [getDireccionComplemento, setDireccionComplemento] = useState({ data: {} });
    const [getSelectedDireccionComplemento, setSelectedDireccionComplemento] = useState("");
    const [getRespuestaDireccionComplemento, setRespuestaDireccionComplemento] = useState(false);

    const [getDireccionBis, setDireccionBis] = useState({ data: {} });
    const [getSelectedDireccionBis, setSelectedDireccionBis] = useState("");
    const [getRespuestaDireccionBis, setRespuestaDireccionBis] = useState(false);

    const [activarCheckBox, setactivarCheckBox] = useState(false);

    const [getDireccionCompleta, setDireccionCompleta] = useState("");
    const [getNombreProceso, setNombreProceso] = useState('');

    const [getSelectedNivelesJerarquicos, setSelectedNivelesJerarquicos] = useState("");
    const [getRespuestaNivelesJerarquicos, setRespuestaNivelesJerarquicos] = useState(false);
    const [getListaNivelesJerarquicos, setListaNivelesJerarquicos] = useState({ data: {} });

    const [getNumeroViaPrincipal, setNumeroViaPrincipal] = useState("");
    const [getNumeroViaDos, setNumeroViaDos] = useState("");
    const [getPlaca, setPlaca] = useState("");
    const [getComplementoAdicional, setComplementoAdicional] = useState("");
    const [getCodigoPostal, setCodigoPostal] = useState("");

    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;

    const ref = useRef(null);

    const tituloModal = "SINPROC No " + radicado + " :: Datos del interesado";

    /*Redirects*/

    const validarLetrasNumeros = (value) => {
        if (value != '') {
            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersOrnUmbers.test(value)) {
                return true;
            }
            else {
                return false;
            }
        }
        return true;

    }

    const handleInputChange = (event) => {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "primerApellido") {
            if (value == '')
                setPrimerApellido('');

            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLetters.test(value) && value.length <= 255) {
                setPrimerApellido(value);
                return true;
            }
            else {
                return false;
            }
        }

        if (name == "segundoApellido") {
            if (value == '')
                setSegundoApellido('');

            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLetters.test(value) && value.length <= 255) {
                setSegundoApellido(value);
                return true;
            }
            else {
                return false;
            }
        }
        if (name == "primerNombre") {
            if (value == '')
                setPrimerNombre('');

            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLetters.test(value) && value.length <= 255) {
                setPrimerNombre(value);
                return true;
            }
            else {
                return false;
            }
        }
        if (name == "segundoNombre") {
            if (value == '')
                setSegundoNombre('');

            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLetters.test(value) && value.length <= 255) {
                setSegundoNombre(value);
                return true;
            }
            else {

                return false;
            }
        }

        //para nonimo
        if (name == "tipoDocumento") {
            setTipoDocumento(value);            

            if (value != '') {

                if (value == global.Constants.TIPO_DOCUMENTO.NO_INFORMA) { //si es no informa
                    setNumeroDocumento(radicado);

                }
                else {
                    setNumeroDocumento("");

                }

            }

        }
        if (name == "numeroDocumento") {
            if (value == '')
                setNumeroDocumento('');

            if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersOrnUmbers.test(value)) {
                setNumeroDocumento(value);
                return true;
            }
            else {
                return false;
            }
        }
        if (name == "direccionCorrespondencia") {

            setDireccionCorrespondencia(value);
        }
        if (name == "correo") {
            setCorreo(value);
            if (value == "") {
                setactivarCheckBox(false);
            } else {
                setactivarCheckBox(true);
            }
        }
        if (name == "autorizar_envio_correo") {
            setCheckCorreo(value);
        }
        if (name == "telefonoCelular") {
            setTelefonoCelular(value);
        }
        if (name == "telefonoFijo") {
            seTelefonoFijo(value);
        }
        if (name == "cargo") {
            setCargo(value);
        }
        if (name == "folio") {
            //console.log('entra')
            setFolio(value);
        }

    }



    // function toggleButton() {
    //     var correo = document.getElementById(correo).value;

    //     if (correo) {
    //         document.getElementById(checkCorreo).disabled = false;
    //     } else {
    //         document.getElementById(checkCorreo).disabled = true;
    //     }
    // }


    useEffect(() => {
        window.showSpinner(true);
        async function fetchData() {
            GenericApi.getGeneric("departamento").then(
                datos => {
                    if (!datos.error) {
                        setListaDepartamento(datos);
                        setRespuestaDepartamento(true);
                        getAllTipoInteresado();
                    }
                    else {
                        setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                        getAllTipoInteresado();
                    }
                }
            )
        }

        fetchData();
    }, []);

    /**
     * Trae la lista de todos los tipos de documento.
     * Ejm: Cedula de ciudadania.
     */
    const getAllTiposDocumento = () => {
        GenericApi.getGeneric("tipo-documento").then(
            datos => {
                if (!datos.error) {
                    setListaTipoDocumento(datos);
                    setRespuestaTipoDocumento(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    /**
     * Trae la lista de todos los tipos de interesado.
     * Ejm: Persona natural o entidad.
     */
    const getAllTipoInteresado = () => {
        GenericApi.getGeneric("tipo-interesado").then(
            datos => {
                if (!datos.error) {
                    setListaTipoInteresado(datos);
                    setRespuestaTipoInteresado(true);
                    nombreProceso();
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

            }
        )
    }

    /**
     * Trae la lista de todos los Niveles Jerarquicos
     */
    const getAllNivelesJerarquicos = () => {

        // Se consume la API
        GenericApi.getGeneric("cargos").then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya 
                if (!datos.error) {

                    // Se setean los valores
                    setListaNivelesJerarquicos(datos);
                    setRespuestaNivelesJerarquicos(true);
                }
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

    const selectDependenciaOrigen = () => {
        return (
            listaDependenciaOrigen.data.map((dependencia, i) => {
                return (
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                )
            })
        )
    }

    const selectDependenciaEntidad = () => {
        return (
            listaDependenciaEntidad.data.map((dependencia, i) => {
                return (
                    <option key={dependencia.id} value={dependencia.id}>{dependencia.attributes.nombre}</option>
                )
            })
        )
    }

    /**
     * Trae la lista de las entidades. Solo si se necesitan
     * Ejm: Persona natural o entidad.
     */
    const getAllTiposEntidad = () => {
        GenericApi.getGeneric("tipo-entidad").then(
            datos => {
                if (!datos.error) {
                    setListaTipoEntidad(datos);
                    setRespuestaTipoEntidad(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const getAllEntidades = () => {
        GenericApi.getGeneric("entidades").then(
            datos => {
                if (!datos.error) {
                    setListaEntidad(datos);
                    setRespuestaEntidad(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    const getAllTipoSujetoProcesal = () => {
        GenericApi.getGeneric("tipo-sujeto-procesal-activo").then(
            datos => {
                if (!datos.error) {
                    setListaTipoSujetoProcesal(datos);
                    setRespuestaTipoSujetoProcesal(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    /**
     * Trae todas las dependencias
     * En la tabla MAS_DEPENDENCIA_ACCESO el 4 corresponde a Crear interesado
     */
    const getAllTiposDependenciaOrigen = () => {
        GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.CREAR_INTERESADO).then(
            datos => {
                if (!datos.error) {
                    setListaDependenciaOrigen(datos);
                    setDependenciaOrigen(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from } });
                }
            }
        )
    }

    /**
     * Trae todas las dependencias
     * En la tabla MAS_DEPENDENCIA_ACCESO el 4 corresponde a Crear interesado
     */
    const getAllTiposDependenciaEntidad = () => {
        GenericApi.getByIdGeneric('mas-dependencia-filtrado', global.Constants.ACCESO_DEPENDENCIA.CREAR_INTERESADO).then(
            datos => {
                if (!datos.error) {
                    setListaDependenciaEntidad(datos);
                    setDependenciaEntidad(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const getAllSexo = () => {
        GenericApi.getGeneric("getSexo/1").then(
            datos => {
                if (!datos.error) {
                    setListaSexo(datos);
                    setRespuestaSexo(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const getAllGenero = () => {
        GenericApi.getGeneric("getGenero/1").then(
            datos => {
                if (!datos.error) {
                    setListaGenero(datos);
                    setRespuestaGenero(true)
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const getAllOrientacionSexual = () => {
        GenericApi.getGeneric("getOrientacionSexual/1").then(
            datos => {
                if (!datos.error) {
                    setListaOrientacionSexual(datos);
                    setRespuestaOrientacionSexual(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const getAllLocalidad = () => {
        GenericApi.getGeneric("mas-localidad").then(
            datos => {
                if (!datos.error) {
                    setListaLocalidad(datos);
                    setRespuestaLocalidad(true);
                    getAllDireccionNomenclatura();
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    const getAllDireccionNomenclatura = () => {

        GenericApi.getGeneric("direccion_nomenclatura").then(
            datos => {
                if (!datos.error) {
                    setDireccionNomenclatura(datos);
                    setRespuestaDireccionNomenclatura(true);
                    // AQUI LLAMAR LA PETICION A LAS LETRAS
                    getAllDireccionLetras();
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    let selectChangeDireccionNomenclatura = (e) => {
        setSelectedDireccionNomenclatura(e);
    }


    const selectDireccionNomenclatura = () => {
        return (
            getDireccionNomenclatura.data.map((expediente, i) => {
                return (
                    <option className="text-uppercase" key={expediente.id} value={expediente.id}>{expediente.attributes.nombre}</option>
                )
            })
        )
    }

    const getAllDireccionLetras = () => {

        GenericApi.getGeneric("direccion_letras").then(
            datos => {
                if (!datos.error) {
                    setDireccionLetras(datos);
                    setRespuestaDireccionLetras(true);
                    getAllDireccionOrientacion();
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }


    let selectChangeDireccionLetrasUno = (e) => {
        setSelectedDireccionLetrasUno(e);
    }

    let selectChangeDireccionLetrasDos = (e) => {
        setSelectedDireccionLetrasDos(e);
    }

    const selectDireccionLetras = () => {
        return (
            getDireccionLetras.data.map((expediente, i) => {
                return (
                    <option className="text-uppercase" key={expediente.id} value={expediente.id}>{expediente.attributes.nombre}</option>
                )
            })
        )
    }

    const getAllDireccionOrientacion = () => {

        GenericApi.getGeneric("direccion_orientacion").then(
            datos => {
                if (!datos.error) {
                    setDireccionOrientacion(datos);
                    setRespuestaDireccionOrientacion(true);
                    getAllDireccionComplemento();
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    let selectChangeDireccionOrientacionUno = (e) => {
        setSelectedDireccionOrientacionUno(e);
    }

    let selectChangeDireccionOrientacionDos = (e) => {
        setSelectedDireccionOrientacionDos(e);
    }

    const selectDireccionOrientacion = () => {
        return (
            getDireccionOrientacion.data.map((expediente, i) => {
                return (
                    <option className="text-uppercase" key={expediente.id} value={expediente.id}>{expediente.attributes.nombre}</option>
                )
            })
        )
    }

    const getAllDireccionComplemento = () => {

        GenericApi.getGeneric("direccion_complemento").then(
            datos => {
                if (!datos.error) {
                    setDireccionComplemento(datos);
                    setRespuestaDireccionComplemento(true);
                    getAllDireccionBis();
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    let selectChangeDireccionComplemento = (e) => {
        setSelectedDireccionComplemento(e);
    }

    const selectDireccionComplemento = () => {
        return (
            getDireccionComplemento.data.map((expediente, i) => {
                return (
                    <option className="text-uppercase" key={expediente.id} value={expediente.id}>{expediente.attributes.nombre}</option>
                )
            })
        )
    }

    const getAllDireccionBis = () => {

        GenericApi.getGeneric("direccion_bis").then(
            datos => {
                if (!datos.error) {
                    setDireccionBis(datos);
                    setRespuestaDireccionBis(true);
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    let selectChangeDireccionBis = (e) => {
        setSelectedDireccionBis(e);
    }

    const selectDireccionBis = () => {
        return (
            getDireccionBis.data.map((expediente, i) => {
                return (
                    <option className="text-uppercase" key={expediente.id} value={expediente.id}>{expediente.attributes.nombre}</option>
                )
            })
        )
    }

    const selectChangeNumeroDocumento = (e) => {
        try {

            if (e != "" && !esAnonimo) {
                window.showSpinner(true);

                const data = {
                    "data": {
                        "type": "registraduria",
                        "attributes": {
                            "cedula": "123"
                        }
                    }
                }

                GenericApi.getByDataGeneric('registraduria/search-documento/' + e, data).then(
                    datos => {

                        if (datos["return"] && !datos["tipo"] && typeof (datos["return"]) != 'undefined') { //encontro en registraturia
                            if (datos) {
                                setDataFormRegistraduria(datos);
                                window.showSpinner(false);
                            } else {
                                setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                                window.showSpinner(false);
                            }
                        }
                        else if (datos["tipo"] && datos["return"] != "" && typeof (datos["return"]) != 'undefined') { //encontro en sinproc
                            if (datos) {
                                setDataFormSinproc(datos);
                                window.showSpinner(false);
                            } else {
                                setModalState({ title: tituloModal.toUpperCase(), message: "OCURRIO UN ERROR", show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                                window.showSpinner(false);
                            }
                        }
                        else {
                            setModalState({ title: tituloModal.toUpperCase(), message: "NO SE ENCONTRÓ INFORMACIÓN DE ESTE CONTACTO", show: true, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                            inicializarDatos();
                            window.showSpinner(false);
                        }
                    }
                )
            }
            else {
                inicializarDatos();
            }

        } catch (ex) {
            inicializarDatos();
        }
    }

    const inicializarDatos = () => {
        setPrimerApellido("");
        setSegundoApellido("");
        setPrimerNombre("");
        setSegundoNombre("");
    }

    const setDataFormRegistraduria = (datos) => {

        try {
            setPrimerApellido(datos["return"]["datosCedulas"]["datos"]["primerApellido"]);
            setSegundoApellido(datos["return"]["datosCedulas"]["datos"]["segundoApellido"]);
            setPrimerNombre(datos["return"]["datosCedulas"]["datos"]["primerNombre"]);
            setSegundoNombre(datos["return"]["datosCedulas"]["datos"]["segundoNombre"]);
        } catch (error) {
            //window.showSpinner(false);
            // console.log(error)
        }

    }

    const setDataFormSinproc = (datos) => {
        try {

            let primerApellidoLocal = "";
            let segundoApellidoLocal = "";
            let primerNombreLocal = "";
            let segundoNombreLocal = "";

            if (datos["return"]["apellido"]) {

                if (datos["return"]["apellido"].includes(" ")) {
                    let apellido = datos["return"]["apellido"];
                    primerApellidoLocal = apellido.split(" ")[0];
                    let indexprimerApellido = (apellido.split(" ")[0].length) + 1;

                    segundoApellidoLocal = apellido.substring(indexprimerApellido, apellido.length)
                }
                else {
                    primerApellidoLocal = datos["return"]["apellido"];
                }

                setPrimerApellido(primerApellidoLocal);
                setSegundoApellido(segundoApellidoLocal);
            }

            if (datos["return"]["nombre"]) {

                if (datos["return"]["nombre"].includes(" ")) {

                    let apellido = datos["return"]["nombre"];
                    primerNombreLocal = apellido.split(" ")[0];
                    let indexprimerApellido = (apellido.split(" ")[0].length) + 1;
                    segundoNombreLocal = apellido.substring(indexprimerApellido, apellido.length)

                }
                else {
                    primerNombreLocal = datos["return"]["nombre"];
                }


                setPrimerNombre(primerNombreLocal);
                setSegundoNombre(segundoNombreLocal);

            }


        } catch (error) {
            //window.showSpinner(false);
            // console.log(error)
        }
    }

    const selectChangeSujetoProcesal = (e) => {
        setSelectSujetoProcesal(e);
        if (e != '') {

            let campos = CamposRequeridosInteresado.obtenerRequeridos(e);
            setDatosRequeridos(campos);

            if (e == '6' && Object.entries(listaDependenciaOrigen["data"]).length === 0) {
                getAllTiposDependenciaOrigen();
            }

            // Se valida cuando es tipo disciplinado
            if (e == '3') {

                // Se consume la api de los Niveles Jerarquicos
                getAllNivelesJerarquicos();
            }
        }
    }

    const selectChangeTipoInteresado = (e) => {
        setSelectTipoInteresado(e);
        if (e == global.Constants.TIPO_INTERESADO.ENTIDAD && Object.entries(listaTipoEntidad["data"]).length === 0) {
            getAllTiposEntidad();

            let campos = CamposRequeridosInteresado.obtenerRequeridos('8');
            setDatosRequeridos(campos);
        }

        if (e == global.Constants.TIPO_INTERESADO.PERSONA_NATURAL && Object.entries(listaTipoSujetoProcesal["data"]).length === 0) {
            getAllTipoSujetoProcesal();
        }

        if(e == 1){
            getAllEntidades()
        }

        getAllTiposDocumento();
        getAllLocalidad();
        getAllSexo();
        getAllGenero();
        getAllOrientacionSexual();
    }

    const selectChangeTipoEntidad = (e) => {
        setSelectTipoEntidad(e);
        if (e == global.Constants.ENTIDAD.PUBLICA && Object.entries(listaEntidad["data"]).length === 0) {
            getAllEntidades();
            getAllTiposDependenciaEntidad();
        }
    }

    // Metodo encargado de setear los Niveles Jerarquicos
    const selectChangeNivelesJerarquicos = (e) => {

        // Se setea el valor
        setSelectedNivelesJerarquicos(e);
    }

    let asignarAnonimo = (e) => {
        setEsAnonimo(e);

        if (e) {
            setPrimerApellido("ANÓNIMO(A)");
            setSegundoApellido("ANÓNIMO(A)");
            setPrimerNombre("ANÓNIMO(A)");
            setSegundoNombre("ANÓNIMO(A)");

            setTipoDocumento("4");
            setNumeroDocumento("2030405060");
            setDireccionCorrespondencia("ANÓNIMO(A)");
            setDireccionCorrespondenciaJson("");
            setCorreo("");
            setTelefonoCelular("0");
            seTelefonoFijo("0");
            setCargo("")
            setFolio("");
        }
        else {
            setPrimerApellido("");
            setSegundoApellido("");
            setPrimerNombre("");
            setSegundoNombre("");

            setTipoDocumento("");
            setNumeroDocumento("");
            setDireccionCorrespondencia("");
            setDireccionCorrespondenciaJson("");
            setCorreo("");
            setTelefonoCelular("");
            seTelefonoFijo("");
            setCargo("")
        }
    }

    let selectChangeDepartamento = (e) => {

        setSelectedDepartamento(e);
        if (e != "") {

            window.showSpinner(true);
            setListaCiudad({ data: [], links: [], meta: [] });
            setRespuestaCiudad(false);

            const data = {
                "data": {
                    "type": "interesado",
                    "attributes": {
                        "nombre": "1",
                        "codigo_dane": "1",
                        "id_departamento": e
                    }
                }
            }

            GenericApi.getByDataGeneric('ciudad/ciudad-por-departamento', data).then(
                datos => !datos.error ? (setListaCiudad(datos), setRespuestaCiudad(true)) : window.showModal(1)
            )

            const timer = setTimeout(() => {
                window.showSpinner(false);
            }, 2000);
            return () => clearTimeout(timer);

        }

    }

    const selectDepartamentos = () => {
        return (
            listaDepartamento.data.map((departamento, i) => {
                return (
                    <option key={departamento.id} value={departamento.id}>{departamento.attributes.nombre}</option>
                )
            })
        )

    }

    // Metodo encargado de generar la lista de Niveles Jerarquicos
    const selectNivelesJerarquicos = () => {

        // Se retorna 
        return (

            // Se recorre la lista de Niveles Jerarquicos
            getListaNivelesJerarquicos.data.map((nivel, i) => {

                // Se retorna cada 
                return (
                    <option key={nivel.nombre} value={nivel.nombre}>{nivel.attributes.nombre}</option>
                )
            })
        )

    }

    const selectCiudad = () => {
        return (

            listaCiudad.data.map((ciuudad, i) => {
                return (
                    <option key={ciuudad.id} value={ciuudad.id}>{ciuudad.attributes.nombre}</option>
                )
            })
        )
    }

    const selectLocalidad = () => {
        return (
            listaLocalidad.data.map((localidad, i) => {
                return (
                    <option key={localidad.id} value={localidad.id}>{localidad.attributes.nombre}</option>
                )
            })
        )
    }

    const selectSexo = () => {
        return (
            listaSexo.data.map((sexo, i) => {
                return (
                    <option key={sexo.id} value={sexo.id}>{sexo.attributes.nombre}</option>
                )
            })
        )
    }

    const selectOrientacionSexual = () => {
        return (
            listaOrientacionSexual.data.map((orientacion, i) => {
                return (
                    <option key={orientacion.id} value={orientacion.id}>{orientacion.attributes.nombre}</option>
                )
            })
        )
    }

    const selectTipoInteresadoLis = () => {
        return (
            listaTipoInteresado.data.map((interesado, i) => {
                return (
                    <option key={interesado.id} value={interesado.id}>{interesado.attributes.nombre}</option>
                )
            })
        )
    }

    const selectGenero = () => {
        return (
            listaGenero.data.map((genero, i) => {
                return (
                    <option key={genero.id} value={genero.id}>{genero.attributes.nombre}</option>
                )
            })
        )
    }

    const selectTipoDocumento = () => {
        return (
            listaTipoDocumento.data.map((tipodoc, i) => {
                return (
                    <option key={tipodoc.id} value={tipodoc.id}>{tipodoc.attributes.nombre}</option>
                )
            })
        )
    }

    const selectTipoEntidades = () => {
        return (
            listaTipoEntidad.data.map((tient, i) => {
                return (
                    <option key={tient.id} value={tient.id}>{tient.attributes.nombre}</option>
                )
            })
        )
    }

    const selectTipoSujetoProcesal = () => {
        return (
            listaTipoSujetoProcesal.data.map((sujeto, i) => {
                return (
                    <option key={sujeto.id} value={sujeto.id}>{sujeto.attributes.nombre}</option>
                )
            })
        )
    }

    const enviarDatos = (datos) => {
        window.showSpinner(true);
        let data;
        if (formIntialValuesInteresado) {

            data = {

                "data": {
                    "type": "interesado",
                    "attributes": {
                        "id_tipo_interesao": selectTipoInteresado,
                        "id_tipo_sujeto_procesal": selectSujetoProcesal,
                        "tipo_documento": formIntialValuesInteresado ? (formIntialValuesInteresado.tipoDocumento ? formIntialValuesInteresado.tipoDocumento : tipoDocumento) : '',
                        "numero_documento": formIntialValuesInteresado ? (formIntialValuesInteresado.numeroDocumento ? formIntialValuesInteresado.numeroDocumento : numeroDocumento) : '',
                        "primer_nombre": formIntialValuesInteresado ? (formIntialValuesInteresado.primerNombre ? formIntialValuesInteresado.primerNombre : primerNombre) : '',
                        "segundo_nombre": formIntialValuesInteresado ? (formIntialValuesInteresado.segundoNombre ? formIntialValuesInteresado.segundoNombre : (segundoNombre ? segundoNombre : "")) : '',
                        "primer_apellido": formIntialValuesInteresado ? (formIntialValuesInteresado.primerApellido ? formIntialValuesInteresado.primerApellido : primerApellido) : '',
                        "segundo_apellido": formIntialValuesInteresado ? (formIntialValuesInteresado.segundoApellido ? formIntialValuesInteresado.segundoApellido : (segundoApellido ? segundoApellido : "")) : '',
                        "id_departamento": selectedDepartamento != "" ? selectedDepartamento : '',
                        "id_ciudad": formIntialValuesInteresado ? (formIntialValuesInteresado.ciudad ? formIntialValuesInteresado.ciudad : "") : '',
                        "direccion": formIntialValuesInteresado ? (formIntialValuesInteresado.direccionCorrespondencia ? formIntialValuesInteresado.direccionCorrespondencia : direccionCorrespondencia) : '',
                        "direccion_json": formIntialValuesInteresado ? (formIntialValuesInteresado.direccionCorrespondenciaJson ? formIntialValuesInteresado.direccionCorrespondenciaJson : direccionCorrespondenciaJson) : '',
                        "id_localidad": formIntialValuesInteresado ? (formIntialValuesInteresado.localidad ? formIntialValuesInteresado.localidad : "") : '',
                        "email": formIntialValuesInteresado ? (formIntialValuesInteresado.correo ? formIntialValuesInteresado.correo : correo) : '',
                        "autorizar_envio_correo": formIntialValuesInteresado ? (formIntialValuesInteresado.checkCorreo ? true : false) : false,
                        "telefono_celular": formIntialValuesInteresado ? (formIntialValuesInteresado.telefonoCelular ? formIntialValuesInteresado.telefonoCelular : telefonoCelular) : '',
                        "telefono_fijo": formIntialValuesInteresado ? (formIntialValuesInteresado.telefonoFijo ? formIntialValuesInteresado.telefonoFijo : telefonoFijo) : '',
                        "id_sexo": formIntialValuesInteresado ? (formIntialValuesInteresado.sexo ? formIntialValuesInteresado.sexo : "") : '',
                        "id_genero": formIntialValuesInteresado ? (formIntialValuesInteresado.genero ? formIntialValuesInteresado.genero : "") : '',
                        "id_orientacion_sexual": formIntialValuesInteresado ? (formIntialValuesInteresado.orientacionSexual ? formIntialValuesInteresado.orientacionSexual : "") : '',
                        "cargo": getSelectedNivelesJerarquicos ? getSelectedNivelesJerarquicos : '',
                        "cargo_descripcion": formIntialValuesInteresado ? (formIntialValuesInteresado.cargo ? formIntialValuesInteresado.cargo : cargo) : '',
                        "tarjeta_profesional": formIntialValuesInteresado.tarjetaProfesional ? formIntialValuesInteresado.tarjetaProfesional : '',
                        "id_dependencia": formIntialValuesInteresado.dependencia ? formIntialValuesInteresado.dependencia : '',
                        "id_tipo_entidad": formIntialValuesInteresado.tipoEntidad ? formIntialValuesInteresado.tipoEntidad : selectTipoEntidad,
                        "nombre_entidad": formIntialValuesInteresado.nombreEntidad ? formIntialValuesInteresado.nombreEntidad : '',

                        "id_entidad": formIntialValuesInteresado.idEntidad ? formIntialValuesInteresado.idEntidad : (idEntidad != '' ? idEntidad : ""),
                        "id_dependencia_entidad": formIntialValuesInteresado.dependenciaEntidad ? formIntialValuesInteresado.dependenciaEntidad : "",
                        "entidad": getIdEntidadPersonaNatural,
                        "id_proceso_disciplinario": procesoDisciplinarioId,
                        "folio": formIntialValuesInteresado.folio ? formIntialValuesInteresado.folio : folio,

                    }
                }
            }
        }

        GenericApi.addGeneric("datos-interesado", data).then(

            datos => {

                if (!datos.error) {
                    setModalState({ title: tituloModal.toUpperCase(), message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/DatosInteresadoLista', from: { from }, alert: global.Constants.TIPO_ALERTA.EXITO });
                }
                else {
                    setModalState({ title: tituloModal.toUpperCase(), message: datos.error.toString(), show: true, redirect: '/DatosInteresadoForm', from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
                window.showSpinner(false);
            }
        )
    }

    const registrarDireccion = (event) => {

        const inputTipoVia = document.getElementById('inputTipoVia').value.length > 0 ? document.getElementById('inputTipoVia').value.trim() + " " : "";
        const numeroViaPrincipal = document.getElementById('numeroViaPrincipal').value.length > 0 ? document.getElementById('numeroViaPrincipal').value.trim() + " " : "";
        const inputLetraUno = document.getElementById('inputLetraUno').value.length > 0 ? document.getElementById('inputLetraUno').value.trim() + " " : "";
        const inputBis = document.getElementById('inputBis').value.length > 0 ? document.getElementById('inputBis').value.trim() + " " : "";
        const inputOrientacionUno = document.getElementById('inputOrientacionUno').value.length > 0 ? document.getElementById('inputOrientacionUno').value.trim() + " " : "";
        const inputNumeroViaDos = document.getElementById('inputNumeroViaDos').value.length > 0 ? document.getElementById('inputNumeroViaDos').value.trim() + " " : "";
        const inputLetraDos = document.getElementById('inputLetraDos').value.length > 0 ? document.getElementById('inputLetraDos').value.trim() + " " : "";
        const inputPlaca = document.getElementById('inputPlaca').value.length > 0 ? document.getElementById('inputPlaca').value.trim() + " " : "";
        const inputOrientacionDos = document.getElementById('inputOrientacionDos').value.length > 0 ? document.getElementById('inputOrientacionDos').value.trim() + " " : "";
        const inputComplemento = document.getElementById('inputComplemento').value.length > 0 ? document.getElementById('inputComplemento').value.trim() + " " : "";
        const inputComplementoAdicional = document.getElementById('inputComplementoAdicional').value.length > 0 ? document.getElementById('inputComplementoAdicional').value.trim() + " " : "";
        const inputCodigoPostal = document.getElementById('inputCodigoPostal').value.length > 0 ? document.getElementById('inputCodigoPostal').value.trim() + " " : "";

        const direccion = inputTipoVia + numeroViaPrincipal + inputLetraUno + inputBis + inputOrientacionUno + inputNumeroViaDos + inputLetraDos + inputPlaca + inputOrientacionDos + inputComplemento + inputComplementoAdicional + inputCodigoPostal;
        let direccionJson = "";

        if (inputTipoVia) {
            direccionJson = direccionJson + '"tipoVia": ' + getDireccionNomenclatura.data.find(data => data.attributes.nombre == getSelectedDireccionNomenclatura).attributes.json + ",";
        }

        if (numeroViaPrincipal) {
            direccionJson = direccionJson + '"noViaPrincipal": ' + numeroViaPrincipal + ",";
        }

        if (inputLetraUno) {
            direccionJson = direccionJson + '"prefijoCuadrante": ' + getDireccionLetras.data.find(data => data.attributes.nombre == getSelectedDireccionLetrasUno).attributes.json + ",";
        }

        if (inputBis) {
            direccionJson = direccionJson + '"bis": {"id":88,"codigo":"BIS-0","nombre":"BIS","codPadre":"BIS","estado":"A "},';
        }

        if (inputOrientacionUno) {
            direccionJson = direccionJson + '"orientacion: "' + getDireccionOrientacion.data.find(data => data.attributes.nombre == getSelectedDireccionOrientacionUno).attributes.json + ",";
        }

        if (inputNumeroViaDos) {
            direccionJson = direccionJson + '"noVia": ' + inputNumeroViaDos + ",";
        }

        if (inputLetraDos) {
            direccionJson = direccionJson + '"prefijoCuadrante_se": ' + getDireccionLetras.data.find(data => data.attributes.nombre == getSelectedDireccionLetrasDos).attributes.json + ",";
        }

        if (inputPlaca) {
            direccionJson = direccionJson + '"placa":' + inputPlaca + ",";
        }

        if (inputOrientacionDos) {
            direccionJson = direccionJson + '"orientacion_se: "' + getDireccionOrientacion.data.find(data => data.attributes.nombre == getSelectedDireccionOrientacionDos).attributes.json + ",";
        }

        if (inputComplemento) {
            direccionJson = direccionJson + '"complementoTipo": ' + getDireccionComplemento.data.find(data => data.attributes.nombre == getSelectedDireccionComplemento).attributes.json + ",";
        }

        if (inputComplementoAdicional) {
            direccionJson = direccionJson + '"complementoAdicional":' + inputNumeroViaDos + ",";
        }

        if (inputCodigoPostal) {

        }

        const aux1 = direccion.trim();
        const aux2 = aux1.replaceAll("\\s{2,}", " ");

        document.getElementById("direccionCorrespondencia").value = direccion;

        asignarDireccion();
        setDireccionCorrespondencia(direccion);
        setDireccionCorrespondenciaJson(direccionJson);
    }

    const handleCallback = (childData) => {
        try {
            setIdEntidad(childData)
        } catch (error) {

        }
    }

    const handleCallbackPersonaNatural = (childData) => {
        try {
            setIdEntidadPersonaNatural(childData)
        } catch (error) {

        }
    }

    // Metodo encargado de asignar y cerrar el modal de la direccion
    const asignarDireccion = () => {

        // Se ejecuta el metodo desde React
        window.asignarDireccion();
    }

    const changeNumeroViaPrincipal = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(e.target.value) && 
        e.target.value.length <= 4)) {
            setNumeroViaPrincipal(e.target.value);
        }
    }

    const changeNumeroViaDos = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(e.target.value) && 
        e.target.value.length <= 4)) {
            setNumeroViaDos(e.target.value);
        }
    }

    const changePlaca = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyNumbers.test(e.target.value) && 
        e.target.value.length <= 4)) {
            setPlaca(e.target.value);
        }
    }

    const changeComplementoAdicional = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccentGuion.test(e.target.value) && 
        e.target.value.length <= 15)) {
            setComplementoAdicional(e.target.value);
        }
    }

    const changeCodigoPostal = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccentGuion.test(e.target.value) && 
        e.target.value.length <= 8)) {
            setCodigoPostal(e.target.value);
        }
    }

    const componentFormularioInteresado = () => {

        return (
            <>
                <Spinner />
                <Formik
                    initialValues={{
                        tipoEntidad: formIntialValuesInteresado ? formIntialValuesInteresado.tipoEntidad : selectTipoEntidad,
                        nombreEntidad: formIntialValuesInteresado ? formIntialValuesInteresado.nombreEntidad : '',
                        idEntidad: formIntialValuesInteresado ? formIntialValuesInteresado.idEntidad : '',
                        dependenciaEntidad: formIntialValuesInteresado ? formIntialValuesInteresado.dependenciaEntidad : '',
                        entidad: formIntialValuesInteresado ? formIntialValuesInteresado.entidad : '',
                        //sector: formIntialValuesInteresado ? formIntialValuesInteresado.sector : '',
                        secretaria: formIntialValuesInteresado ? formIntialValuesInteresado.secretaria : '',
                        tipoSujetoProcesal: selectSujetoProcesal,
                        tipoDocumento: formIntialValuesInteresado ? formIntialValuesInteresado.tipoDocumento : '',
                        numeroDocumento: formIntialValuesInteresado ? formIntialValuesInteresado.numeroDocumento : '',
                        primerNombre: formIntialValuesInteresado ? formIntialValuesInteresado.primerNombre : '',
                        segundoNombre: formIntialValuesInteresado ? formIntialValuesInteresado.segundoNombre : '',
                        primerApellido: formIntialValuesInteresado ? formIntialValuesInteresado.primerApellido : '',
                        segundoApellido: formIntialValuesInteresado ? formIntialValuesInteresado.segundoApellido : '',
                        dependencia: formIntialValuesInteresado ? formIntialValuesInteresado.dependencia : '',
                        nivelJerarquico: formIntialValuesInteresado ? getSelectedNivelesJerarquicos : '',
                        cargo: formIntialValuesInteresado ? formIntialValuesInteresado.cargo : '',
                        entidadSujetoProcesal: getIdEntidadPersonaNatural ? (selectSujetoProcesal === '6' ? 'Procuraduria general de la nación' : getIdEntidadPersonaNatural) : '',
                        tarjetaProfesional: formIntialValuesInteresado ? formIntialValuesInteresado.tarjetaProfesional : '',
                        departamento: formIntialValuesInteresado ? formIntialValuesInteresado.departamento : '',
                        ciudad: formIntialValuesInteresado ? formIntialValuesInteresado.ciudad : '',
                        direccionCorrespondencia: formIntialValuesInteresado ? formIntialValuesInteresado.direccionCorrespondencia : '',
                        direccionCorrespondenciaJson: formIntialValuesInteresado ? formIntialValuesInteresado.direccionCorrespondenciaJson : '',
                        localidad: formIntialValuesInteresado ? formIntialValuesInteresado.localidad : '',
                        correo: formIntialValuesInteresado ? formIntialValuesInteresado.correo : '',
                        checkCorreo: formIntialValuesInteresado ? formIntialValuesInteresado.checkCorreo : '',
                        telefonoCelular: formIntialValuesInteresado ? formIntialValuesInteresado.telefonoCelular : '',
                        telefonoFijo: formIntialValuesInteresado ? formIntialValuesInteresado.telefonoFijo : '',
                        sexo: formIntialValuesInteresado ? formIntialValuesInteresado.sexo : '',
                        genero: formIntialValuesInteresado ? formIntialValuesInteresado.genero : '',
                        orientacionSexual: formIntialValuesInteresado ? formIntialValuesInteresado.orientacionSexual : '',
                        folio: formIntialValuesInteresado ? formIntialValuesInteresado.folio : folio,
                    }}
                    enableReinitialize
                    validate={(valores) => {
                        setFormIntialValuesInteresado(valores);
                        let errores = {}
                        if (valores.nombreEntidad && !validarLetrasNumeros(valores.nombreEntidad)) {
                            errores.nombreEntidad = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS
                        }

                        if (selectTipoInteresado === '2') {
                            if (selectTipoEntidad) {

                                if (!valores.tipoEntidad && !selectTipoEntidad) {
                                    errores.tipoEntidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }

                                //Entidad Privada y Publica
                                //si es privado 
                                //console.log(this.idEntidad);

                                if (!valores.nombreEntidad && selectTipoEntidad == global.Constants.ENTIDAD.PRIVADA) {
                                    errores.nombreEntidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }
                                //soi es público
                                if (!valores.idEntidad && idEntidad == '' && selectTipoEntidad == global.Constants.ENTIDAD.PUBLICA) {
                                    errores.idEntidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }
                                else if (idEntidad == global.Constants.ENTIDADES.PERSONARIA && !valores.dependenciaEntidad) {
                                    errores.dependenciaEntidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                                }
                            }
                            else {
                                errores.tipoEntidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                            }
                        }

                        if (!valores.tipoSujetoProcesal && !selectSujetoProcesal && !esAnonimo
                            && selectTipoInteresado == global.Constants.TIPO_INTERESADO.PERSONA_NATURAL) {
                            errores.tipoSujetoProcesal = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["tipoDocumento"] && !tipoDocumento && !esAnonimo) {
                            errores.tipoDocumento = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["numeroDocumento"] && !numeroDocumento) {
                            errores.numeroDocumento = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["primerNombre"] && !primerNombre) {
                            errores.primerNombre = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["segundoNombre"] && !segundoNombre) {
                            errores.segundoNombre = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["primerApellido"] && !primerApellido) {
                            errores.primerApellido = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["segundoApellido"] && !segundoApellido) {
                            errores.segundoApellido = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["dependencia"] && selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO) {
                            errores.dependencia = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        // Se valida el Nivel Jerarquico
                        if (datosRequeridos["nivelJerarquico"] && !getSelectedNivelesJerarquicos && (selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DISCIPLINADO
                            || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO)) {
                            errores.nivelJerarquico = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["cargo"] && !cargo && (selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DISCIPLINADO
                            || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO)) {
                            errores.cargo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        // if (datosRequeridos["entidadSujetoProcesal"] && !valores.entidadSujetoProcesal
                        //     && (selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DISCIPLINADO
                        //         || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO)) {
                        //     errores.entidadSujetoProcesal = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        // }

                        if (datosRequeridos["entidadSujetoProcesal"] && !getIdEntidadPersonaNatural
                            && (selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DISCIPLINADO
                                || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO)) {
                            errores.entidadSujetoProcesal = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["tarjetaProfesional"] && !valores.tarjetaProfesional
                            && (selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.APODERADO
                                || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DEFENSOR_OFICIO)) {
                            errores.tarjetaProfesional = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if ((datosRequeridos["departamento"] && selectedDepartamento == "" && !esAnonimo)
                            || (direccionCorrespondencia && selectedDepartamento == "" && !esAnonimo)) {
                            errores.departamento = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if ((datosRequeridos["ciudad"] && !valores.ciudad && !esAnonimo)
                            || (direccionCorrespondencia && selectedDepartamento == "" && !esAnonimo)) {
                            errores.ciudad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["direccionCorrespondencia"] && !direccionCorrespondencia) {
                            errores.direccionCorrespondencia = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["localidad"] && !esAnonimo) {
                            errores.localidad = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (correo && !esAnonimo) {
                            if (!validator.isEmail(correo)) {
                                errores.correo = 'FORMATO DE CORREO NO VÁLIDO'
                            }
                        }

                        if (datosRequeridos["correo"] && !correo && !esAnonimo) {
                            errores.correo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (telefonoCelular != 0) {
                            if (telefonoCelular.length != global.Constants.TAMANO_CAMPOS.CELULAR) {
                                errores.telefonoCelular = 'DEBE TENER 10 DIGITOS'
                            }
                        }

                        if (telefonoFijo != 0) {
                            if (telefonoFijo.length != global.Constants.TAMANO_CAMPOS.CELULAR) {
                                errores.telefonoFijo = 'DEBE TENER 10 DIGITOS'
                            }
                        }

                        if (datosRequeridos["telefonoFijo"] && !telefonoFijo) {
                            errores.telefonoFijo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["sexo"] && !esAnonimo) {
                            errores.sexo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["genero"] && !esAnonimo) {
                            errores.genero = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["orientacionSexual"] && !esAnonimo) {
                            errores.orientacionSexual = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if (datosRequeridos["folio"] && !valores.folio && !folio && !esAnonimo) {
                            errores.folio = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO
                        }

                        if ((selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.APODERADO
                            || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DEFENSOR_OFICIO || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO
                            || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.VICTIMAS_GRAVES)
                            && !correo && !direccionCorrespondencia) {
                            errores.direccionCorrespondencia = 'DEBE INGRESAR UN CORREO O UNA DIRECCIÓN';
                            errores.correo = 'DEBE INGRESAR UN CORREO O UNA DIRECCIÓN';
                        }

                        //console.log(errores);
                        return errores
                    }}
                    onSubmit={(valores, { resetForm }) => {
                        enviarDatos(valores);
                    }}
                >
                    {({ errors, values }) => (
                        <Form>
                            <div className='row'>
                                {
                                    selectTipoInteresado === '2' ?
                                        (
                                            <div className="col-md-12">
                                                <div className="block block-themed">
                                                    <div className="block-header">
                                                        <h3 className="block-title">DATOS DE LA ENTIDAD</h3>
                                                    </div>
                                                    <div className="block-content">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label htmlFor="tipoEntidad">TIPO DE ENTIDAD<span className="text-danger">*</span> </label>
                                                                    <Field as="select" className="form-control" id="tipoEntidad" name="tipoEntidad" value={selectTipoEntidad} onChange={e => selectChangeTipoEntidad(e.target.value)}>
                                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                        {respuestaTipoEntidad ? selectTipoEntidades() : null}
                                                                    </Field>
                                                                    <ErrorMessage name="tipoEntidad" component={() => (<span className="text-danger">{errors.tipoEntidad}</span>)} />
                                                                </div>
                                                            </div>
                                                            {
                                                                (selectTipoEntidad == "1") ?//si es publico 
                                                                    (
                                                                        <>
                                                                            <div className="col-md-12">
                                                                                <div className="form-group">
                                                                                    <label htmlFor='idEntidad'>ENTIDAD PÚBLICA<span className="text-danger">*</span></label>
                                                                                    <Autocomplete suggestions={listaEntidad} parentCallback={handleCallback} />
                                                                                    <ErrorMessage name="idEntidad" component={() => (<span className="text-danger">{errors.idEntidad}</span>)} />
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                (idEntidad === global.Constants.ENTIDADES.PERSONARIA) ?
                                                                                    (
                                                                                        <div className="col-md-12">
                                                                                            <div className="form-group">
                                                                                                <label htmlFor="dependenciaEntidad">DEPENDENCIA<span className="text-danger">*</span></label>
                                                                                                <Field as="select" className="form-control" id="dependenciaEntidad" name="dependenciaEntidad" placeholder="Dependencia">
                                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                                    {respuestaDependenciaEntidad ? selectDependenciaEntidad() : null}
                                                                                                </Field>
                                                                                                <ErrorMessage name="dependenciaEntidad" component={() => (<span className="text-danger">{errors.dependenciaEntidad}</span>)} />
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : null
                                                                            }
                                                                        </>
                                                                    ) : null
                                                            }
                                                            {
                                                                (selectTipoEntidad == global.Constants.ENTIDAD.PRIVADA) ?//si es privado 
                                                                    (
                                                                        <>
                                                                            <div className="col-md-12">
                                                                                <div className="form-group">
                                                                                    <label htmlFor='nombreEntidad'>NOMBRE DE LA ENTIDAD PRIVADA<span className="text-danger">*</span></label>
                                                                                    <Field type="text" id="nombreEntidad" name="nombreEntidad" className="form-control" placeholder="Nombre entidad" />
                                                                                    <ErrorMessage name="nombreEntidad" component={() => (<span className="text-danger">{errors.nombreEntidad}</span>)} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null
                                }
                                {
                                    selectTipoInteresado ?
                                        (
                                            <div className="col-md-12">
                                                <div className="block block-themed">
                                                    <div className="block-header">
                                                        <h3 className="block-title">DATOS BÁSICOS DEL PETICIONARIO/INTERESADO</h3>
                                                    </div>
                                                    <div className="block-content">
                                                        <div className='text-center'>
                                                            <div className="custom-control custom-switch custom-control-lg mb-2">
                                                                <input type="checkbox" onChange={e => asignarAnonimo(e.target.checked)} className="custom-control-input" id="example-sw-custom-lg1" name="example-sw-custom-lg1" />
                                                                <label className="custom-control-label" htmlFor="example-sw-custom-lg1">¿EL REGISTRO SE REALIZA DE FORMA ANÓNIMA?</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="block-content">
                                                        <div className="row">
                                                            {
                                                                (selectTipoInteresado === global.Constants.TIPO_INTERESADO.PERSONA_NATURAL && !esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-12">
                                                                            <div className="form-group">
                                                                                <label htmlFor="tipoSujetoProcesal">TIPO DE SUJETO PROCESAL<span className="text-danger">*</span></label>
                                                                                <Field as="select" className="form-control" id="tipoSujetoProcesal" name="tipoSujetoProcesal" value={selectSujetoProcesal} onChange={e => selectChangeSujetoProcesal(e.target.value)}>
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaTipoSujetoProcesal ? selectTipoSujetoProcesal() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="tipoSujetoProcesal" component={() => (<span className="text-danger">{errors.tipoSujetoProcesal}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="tipoDocumento">TIPO DE DOCUMENTO{(datosRequeridos["tipoDocumento"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field value={tipoDocumento} as="select" className="form-control" id="tipoDocumento" disabled={esAnonimo}
                                                                        onChange={handleInputChange} name="tipoDocumento">
                                                                        <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                        {respuestaTipoDocumento ? selectTipoDocumento() : null}
                                                                    </Field>
                                                                    <ErrorMessage name="tipoDocumento" component={() => (<span className="text-danger">{errors.tipoDocumento}</span>)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor='numeroDocumento'>NÚMERO DE DOCUMENTO{(datosRequeridos["numeroDocumento"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field patt value={numeroDocumento} autoComplete="off" disabled={(esAnonimo || tipoDocumento == '4')} type="text" id="numeroDocumento" name="numeroDocumento" onBlur={e => selectChangeNumeroDocumento(e.target.value)}
                                                                        onChange={handleInputChange} className="form-control" placeholder="Número de documento" pattern="[0-9]{0,13}" maxLength={10} />
                                                                    <ErrorMessage name="numeroDocumento" component={() => (<span className="text-danger">{errors.numeroDocumento}</span>)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor='primerNombre'>PRIMER NOMBRE{(datosRequeridos["primerNombre"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field value={primerNombre} autoComplete="off" disabled={esAnonimo} type="text" id="primerNombre" name="primerNombre" className="form-control" placeholder="Primer Nombre"
                                                                        onChange={handleInputChange} />
                                                                    <ErrorMessage name="primerNombre" component={() => (<span className="text-danger">{errors.primerNombre}</span>)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor='segundoNombre'>SEGUNDO NOMBRE{(datosRequeridos["segundoNombre"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field value={segundoNombre} autoComplete="off" disabled={esAnonimo} type="text" id="segundoNombre" name="segundoNombre" className="form-control" placeholder="Segundo Nombre"
                                                                        onChange={handleInputChange} />
                                                                    <ErrorMessage name="segundoNombre" component={() => (<span className="text-danger">{errors.segundoNombre}</span>)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor='primerApellido'>PRIMER APELLIDO{(datosRequeridos["primerApellido"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field value={primerApellido} autoComplete="off" disabled={esAnonimo} type="text" id="primerApellido" name="primerApellido" className="form-control" placeholder="Primer Apellido"
                                                                        onChange={handleInputChange} />
                                                                    <ErrorMessage name="primerApellido" component={() => (<span className="text-danger">{errors.primerApellido}</span>)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor='segundoApellido'>SEGUNDO APELLIDO{(datosRequeridos["segundoApellido"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field value={segundoApellido} autoComplete="off" disabled={esAnonimo} type="text" id="segundoApellido" name="segundoApellido" className="form-control" placeholder="Segundo Apellido"
                                                                        onChange={handleInputChange} />
                                                                    <ErrorMessage name="segundoApellido" component={() => (<span className="text-danger">{errors.segundoApellido}</span>)} />
                                                                </div>
                                                            </div>
                                                            {
                                                                selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO && !esAnonimo ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="dependencia">DEPENDENCIA ORIGEN{(datosRequeridos["dependencia"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field as="select" className="form-control" id="dependencia" name="dependencia" placeholder="Dependencia">
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaDependenciaOrigen ? selectDependenciaOrigen() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="dependencia" component={() => (<span className="text-danger">{errors.dependencia}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                ((selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DISCIPLINADO
                                                                    || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO) && !esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor='nivelJerarquico'>NIVEL JERÁRQUICO{(datosRequeridos["nivelJerarquico"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field
                                                                                    as="select"
                                                                                    className="form-control"
                                                                                    id="nivelJerarquico"
                                                                                    name="nivelJerarquico"
                                                                                    value={getSelectedNivelesJerarquicos}
                                                                                    onChange={e => selectChangeNivelesJerarquicos(e.target.value)}>
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {getRespuestaNivelesJerarquicos ? selectNivelesJerarquicos() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="nivelJerarquico" component={() => (<span className="text-danger">{errors.nivelJerarquico}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                ((selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DISCIPLINADO
                                                                    || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO) && !esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor='cargo'>CARGO{(datosRequeridos["cargo"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field value={cargo} autoComplete="off" type="text" id="cargo" name="cargo" className="form-control" placeholder="Cargo" onChange={handleInputChange} />
                                                                                <ErrorMessage name="cargo" component={() => (<span className="text-danger">{errors.cargo}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                ((selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DISCIPLINADO
                                                                    || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.MINISTERIO_PUBLICO) && !esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor='entidadSujetoProcesal'>ENTIDAD{(datosRequeridos["entidadSujetoProcesal"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <AutocompletePersonaNatural suggestions={listaEntidad} parentCallback={handleCallbackPersonaNatural} />
                                                                                <ErrorMessage name="entidadSujetoProcesal" component={() => (<span className="text-danger">{errors.entidadSujetoProcesal}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                ((selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.APODERADO
                                                                    || selectSujetoProcesal === global.Constants.SUJETO_PROCESAL.DEFENSOR_OFICIO) && !esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor='tarjetaProfesional'>TARJETA PROFESIONAL{(datosRequeridos["tarjetaProfesional"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field type="text" id="tarjetaProfesional" name="tarjetaProfesional" className="form-control" placeholder="Tarjeta profesional" />
                                                                                <ErrorMessage name="tarjetaProfesional" component={() => (<span className="text-danger">{errors.tarjetaProfesional}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            <div className="col-md-6">
                                                                <div className="row">
                                                                    <div className="col-md-10">
                                                                        <label htmlFor='direccionCorrespondencia'>DIRECCIÓN{(datosRequeridos["direccionCorrespondencia"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                        <Field value={direccionCorrespondencia} disabled={esAnonimo} type="text" id="direccionCorrespondencia" name="direccionCorrespondencia"
                                                                            onChange={handleInputChange} className="form-control" placeholder="Dirección de correspondencia" readOnly={true} />
                                                                        <ErrorMessage name="direccionCorrespondencia" component={() => (<span className="text-danger">{errors.direccionCorrespondencia}</span>)} />
                                                                    </div>
                                                                    <div className='col-md-2 col-sm-12'>
                                                                        <button type="button" className="btn btn-primary form-control" data-toggle="modal" data-target="#modal-direccion" style={{ marginTop: "27px" }}><i className="fa fa-fw fa-plus"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                (!esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="departamento">DEPARTAMENTO{(datosRequeridos["departamento"] || direccionCorrespondencia != '') ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field as="select" className="form-control" id="departamento" name="departamento"
                                                                                    value={selectedDepartamento} onChange={e => selectChangeDepartamento(e.target.value)}>
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaDepartamento ? selectDepartamentos() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="departamento" component={() => (<span className="text-danger">{errors.departamento}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                (!esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="ciudad">CIUDAD{(datosRequeridos["ciudad"] || direccionCorrespondencia != '') ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field as="select" className="form-control" id="ciudad" name="ciudad">
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaCiudad ? selectCiudad() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="ciudad" component={() => (<span className="text-danger">{errors.ciudad}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                (!esAnonimo && values.ciudad == global.Constants.CIUDAD.BOGOTA) ?
                                                                    (
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="localidad">LOCALIDAD{(datosRequeridos["localidad"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field as="select" className="form-control" id="localidad" name="localidad">
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaLocalidad ? selectLocalidad() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="localidad" component={() => (<span className="text-danger">{errors.localidad}</span>)} />
                                                                            </div>

                                                                        </div>
                                                                    ) : null
                                                            }
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    {<label htmlFor='correo'>CORREO{(datosRequeridos["correo"]) ? (<span className="text-danger">*</span>) : null}</label>}
                                                                    <Field value={correo} type="email" id="correo" name="correo" 
                                                                        onChange={handleInputChange} className="form-control" placeholder="Correo" autocomplete="off"/>
                                                                    <ErrorMessage name="correo" component={() => (<span className="text-danger mr-2">{errors.correo}</span>)} />
                                                                    {
                                                                        !esAnonimo
                                                                        ?
                                                                            <>
                                                                                {activarCheckBox ?
                                                                                    (<Field type="checkbox" name="checkCorreo" id="checkCorreo" />)
                                                                                    :
                                                                                    (<Field type="checkbox" name="checkCorreo" id="checkCorreo" disabled />)
                                                                                }
                                                                                <label className="mt-2 ml-2">AUTORIZA RECIBIR NOTIFICACIONES POR EMAIL</label>
                                                                            </>
                                                                        :
                                                                            null
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label htmlFor='telefonoCelular'>TELÉFONO CELULAR</label>
                                                                    <Field value={telefonoCelular} type="number" id="telefonoCelular" name="telefonoCelular"
                                                                        onChange={handleInputChange} className="form-control" placeholder="Teléfono celular" />
                                                                        <ErrorMessage name="telefonoCelular" component={() => (<span className="text-danger">{errors.telefonoCelular}</span>)} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label htmlFor='telefonoFijo'>TELÉFONO FIJO{(datosRequeridos["telefonoFijo"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field value={telefonoFijo} type="number" id="telefonoFijo" name="telefonoFijo"
                                                                        onChange={handleInputChange} className="form-control" placeholder="Teléfono fijo" />
                                                                    <ErrorMessage name="telefonoFijo" component={() => (<span className="text-danger">{errors.telefonoFijo}</span>)} />
                                                                </div>
                                                            </div>
                                                            {
                                                                (!esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label htmlFor="sexo">SEXO{(datosRequeridos["sexo"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field as="select" className="form-control" id="sexo" name="sexo">
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaSexo ? selectSexo() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="sexo" component={() => (<span className="text-danger">{errors.sexo}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                (!esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label htmlFor="genero">GÉNERO{(datosRequeridos["genero"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field as="select" className="form-control" id="genero" name="genero">
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaGenero ? selectGenero() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="genero" component={() => (<span className="text-danger">{errors.genero}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            {
                                                                (!esAnonimo) ?
                                                                    (
                                                                        <div className="col-md-3">
                                                                            <div className="form-group">
                                                                                <label htmlFor="orientacionSexual">ORIENTACIÓN SEXUAL{(datosRequeridos["orientacionSexual"]) ? (<span className="text-danger">*</span>) : null}</label>
                                                                                <Field as="select" className="form-control" id="orientacionSexual" name="orientacionSexual">
                                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                                    {respuestaOrientacionSexual ? selectOrientacionSexual() : null}
                                                                                </Field>
                                                                                <ErrorMessage name="orientacionSexual" component={() => (<span className="text-danger">{errors.orientacionSexual}</span>)} />
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                            }
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label htmlFor='folio'>FOLIO{(datosRequeridos["folio"] && !esAnonimo) ? (<span className="text-danger">*</span>) : null}</label>
                                                                    <Field value={folio} type="number" min="1" id="folio" name="folio" className="form-control" placeholder="Folio" onChange={handleInputChange} />
                                                                    <ErrorMessage name="folio" component={() => (<span className="text-danger">{errors.folio}</span>)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="block-content block-content-full text-right bg-light">
                                                        <button type="submit" className="btn btn-rounded btn-primary">{global.Constants.BOTON_NOMBRE.REGISTRAR}</button>
                                                        <Link to={`/DatosInteresadoLista/`} state={{ from: from }}>
                                                            <button type="button" className="btn btn-rounded btn-outline-primary">{global.Constants.BOTON_NOMBRE.CANCELAR}</button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null
                                }
                            </div>
                        </Form>
                    )}
                </Formik>

                <div className="modal" id="modal-direccion" tabindex="-1" role="dialog" aria-labelledby="modal-block-large" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="block block-themed block-transparent mb-0">
                                <div className="block-header bg-primary-dark">
                                    <h3 className="block-title">DATOS DEL INTERESADO :: DIRECCIÓN</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                            <i className="fa fa-fw fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="block-content">
                                    <Formik
                                        initialValues={{
                                            inputTipoVia: '',
                                            numeroViaPrincipal: ''
                                        }}
                                        enableReinitialize
                                        validate={(valores) => {
                                            let errores = {};

                                            return errores
                                        }}
                                        onSubmit={(valores, { resetForm }) => {
                                            registrarDireccion(valores);
                                        }}>
                                        {({ errors }) => (
                                            <Form>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputTipoVia">TIPO DE VIA<span className="text-danger">*</span></label>
                                                                <select className="form-control" id="inputTipoVia" name="inputTipoVia" required
                                                                    value={getSelectedDireccionNomenclatura} onChange={e => selectChangeDireccionNomenclatura(e.target.value)}>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    {getRespuestaDireccionNomenclatura ? selectDireccionNomenclatura() : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="numeroViaPrincipal">No. VIA PRINCIPAL <span className="text-danger">*</span></label>
                                                                <input type="number" className="form-control" id="numeroViaPrincipal" name="numeroViaPrincipal" value={getNumeroViaPrincipal} onChange={changeNumeroViaPrincipal} required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputLetraUno">PREFIJO CUADRANTE</label>
                                                                <select className="form-control" id="inputLetraUno" name="inputLetraUno"
                                                                    value={getSelectedDireccionLetrasUno} onChange={e => selectChangeDireccionLetrasUno(e.target.value)}>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    {getRespuestaDireccionLetras ? selectDireccionLetras() : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputBis">BIS</label>
                                                                <select size className="form-control" id="inputBis" name="inputBis"
                                                                    value={getSelectedDireccionBis} onChange={e => selectChangeDireccionBis(e.target.value)}>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    {getRespuestaDireccionBis ? selectDireccionBis() : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputOrientacionUno">ORIENTACIÓN</label>
                                                                <select className="form-control" id="inputOrientacionUno" name="inputOrientacionUno"
                                                                    value={getSelectedDireccionOrientacionUno} onChange={e => selectChangeDireccionOrientacionUno(e.target.value)}>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    {getRespuestaDireccionOrientacion ? selectDireccionOrientacion() : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputNumeroViaDos">No. VÍA SECUNDARIO<span className="text-danger">*</span></label>
                                                                <input type="number" className="form-control" id="inputNumeroViaDos" name="inputNumeroViaDos" placeholder="" value={getNumeroViaDos} onChange={changeNumeroViaDos} required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputLetraDos">PREFIJO CUADRANTE</label>
                                                                <select className="form-control" id="inputLetraDos" name="inputLetraDos"
                                                                    value={getSelectedDireccionLetrasDos} onChange={e => selectChangeDireccionLetrasDos(e.target.value)}>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    {getRespuestaDireccionLetras ? selectDireccionLetras() : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputPlaca">PLACA <span className="text-danger">*</span></label>
                                                                <input type="number" className="form-control" id="inputPlaca" name="inputPlaca" value={getPlaca} onChange={changePlaca} required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputOrientacionDos">ORIENTACIÓN</label>
                                                                <select className="form-control" id="inputOrientacionDos" name="inputOrientacionDos"
                                                                    value={getSelectedDireccionOrientacionDos} onChange={e => selectChangeDireccionOrientacionDos(e.target.value)}>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    {getRespuestaDireccionOrientacion ? selectDireccionOrientacion() : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputComplemento">TIPO DE COMPLEMENTO</label>
                                                                <select className="form-control" id="inputComplemento" name="inputComplemento"
                                                                    value={getSelectedDireccionComplemento} onChange={e => selectChangeDireccionComplemento(e.target.value)}>
                                                                    <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                                                    {getRespuestaDireccionComplemento ? selectDireccionComplemento() : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputComplementoAdicional">TIPO DE COMPLEMENTO ADICIONAL</label>
                                                                <input type="text" className="form-control" id="inputComplementoAdicional" name="inputComplementoAdicional" placeholder="" value={getComplementoAdicional} onChange={changeComplementoAdicional}/>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputCodigoPostal">CÓDIGO POSTAL</label>
                                                                <input type="text" className="form-control" id="inputCodigoPostal" name="inputCodigoPostal" placeholder="" value={getCodigoPostal} onChange={changeCodigoPostal}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="block-content block-content-full text-right bg-light">
                                                        <button type="submit" className="btn btn-rounded btn-primary">ASIGNAR</button>
                                                        <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal">CERRAR</button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {<ModalGen data={getModalState} />}
            <div className="w2d_block let">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-alt push">
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/MisPendientes`}><small>Mis pendientes</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/RamasProceso/`} state={{ from: from }}><small>Ramas del proceso</small></Link></li>
                        <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" aria-current="page" to={`/DatosInteresadoLista/`} state={{ from: from }}><small>Lista de datos del interesado</small></Link></li>
                        <li className="breadcrumb-item"> <small> Crear datos del interesado</small></li>
                    </ol>
                </nav>
            </div>
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title"> {getNombreProceso} :: <strong>DATOS DEL INTERESADO</strong></h3>
                </div>
                <div className="block-content">
                    <div className='text-right'>
                        <Link to={`/DatosInteresadoLista/`} title='Regresar a lista de interesado' state={{ from: from }}>
                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                        </Link>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor="ingresoProcesoDisciplinario">TIPO DE INTERESADO<span className="text-danger">*</span></label>
                            <select className="form-control" id="ingresoProcesoDisciplinario" name="ingresoProcesoDisciplinario" value={selectTipoInteresado} onChange={e => selectChangeTipoInteresado(e.target.value)}>
                                <option value="">{global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION}</option>
                                {respuestaTipoInteresado ? selectTipoInteresadoLis() : null}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {componentFormularioInteresado()}
        </>
    )

}


export default DatosInteresadoForm;