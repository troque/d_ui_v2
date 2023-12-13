import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik, replace } from 'formik';
import Spinner from '../Utils/Spinner';
import { Link, useSearchParams } from "react-router-dom";
import GenericApi from '../Api/Services/GenericApi';
import { useLocation } from 'react-router-dom';
import '../Utils/Constants';
import ModalGen from '../Utils/Modals/ModalGeneric';
import InfoErrorApi from '../Utils/InfoErrorApi';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import ModalItemsAgregar from '../Utils/Modals/ModalItemsAgregar';

export default function CaratulasAdminForm() {

    // Constante del use location
    const location = useLocation();

    // Se captura la data
    const { from } = location.state;

    // Constantes
    const [getNombrePlantilla, setNombrePlantilla] = useState("");
    const [getNombreCaratula, setNombreCaratula] = useState("");
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getCaratulaId, setCaratulaId] = useState(0);
    const [inputListArchivos, setInputListArchivos] = useState([{ folios: "", archivo: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    const [getHayArchivo, setHayArchivo] = useState(false);
    const [getPesoTotalArchivos, setPesoTotalArchivos] = useState(0);
    const [getRepuestaNombreCaratula, setRepuestaNombreCaratula] = useState(false);
    
    // Metodo principal de cargar la informacion de la clase
    useEffect(() => {

        // Metodo asyncrono
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se valida que tenga from para actualizar 
            if (from != null) {

                // Se setean los valores del from
                setNombreCaratula(from.attributes.nombre);
                setNombrePlantilla(from.attributes.nombre_plantilla);

                // Se setea el id
                setCaratulaId(from.id);

                // Se valida en true que hay archivo
                setHayArchivo(true);

                // Se quita el cargando
                window.showSpinner(false);
            }
        }

        // Se llama el metodo para cargar la informacion
        fetchData();
    }, []);

    // Metodo encargado de colocar los caracteres especiales en el buscador
    function containsSpecialChars(str) {

        // Se valida el cargador escrito
        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {

            // Se incluye el catacter
            if (str.includes(specialChar)) {

                // Se retorna true
                return true;
            }

            // Se retorna false
            return false;
        });

        // Se retorna el resultado
        return result;
    }

    // Metodo encargado de cambiar el nombre de la caratula
    const changeNombreCaratula = (e) => {
        if (e.target.value === '' || 
        (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(e.target.value) && 
        e.target.value.length <= 255)) {
            setNombreCaratula(e.target.value);
            setRepuestaNombreCaratula(true);
        }
    }

    const actualizarDatos = (valores) => {

        // Se captura el id de la caratula
        const id = from.id;

        // Se inicializa la variable
        let data = "";

        // Se valida si tiene un archivo valido cargado
        if (!getHayArchivo) {

            // Se usa el cargando
            window.showSpinner(false);

            // Se muestra el modal de error
            setErrorApi("¡Debe cargar un archivo valido!");

            // Se ejecuta el modal
            window.showModal(1);

            // Se retorna falso
            return false;
        }

        // Se inicializa la data
        data = {
            "data": {
                "type": "caratulas",
                "attributes": {
                    "nombre": getNombreCaratula,
                    "nombre_plantilla": inputListArchivos[0].archivo.name != null ? inputListArchivos[0].archivo.name : getNombrePlantilla,
                    "estado": true,
                    "file_base64": inputListArchivos[0].filebase64 ? inputListArchivos[0].filebase64 : "",
                }
            }
        }

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se consume la API
        GenericApi.updateGeneric('caratulas', id, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea el modal de exito
                    setModalState({ title: "ADMINISTRACIÓN :: CARÁTULA", message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/CaratulasAdminLista', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea el modal de error
                    setModalState({ title: "ADMINISTRACIÓN :: CARÁTULA", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }

                // Se quita el cargando
                window.showSpinner(false);
            }
        )
    }

    const handleInputChangeArchivos = (e, index) => {

        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);

            if (extension == global.Constants.TIPO_DOCUMENTO_PERMITIDO_ACTUACIONES.DOCX) {

                const list = [...inputListArchivos];
                list[index][name] = files[0];

                if (files[0]) {
                    list[index][name] = files[0];
                } else {
                    list[index][name] = '';
                    list[index].filebase64 = '';
                    list[index].size = 0;
                    list[index].ext = "";
                    setInputListArchivos(list);
                }

                // Conversion a Base64
                Array.from(e.target.files).forEach(archivo => {
                    var reader = new FileReader();
                    reader.readAsDataURL(archivo);
                    reader.onload = function () {
                        var arrayAuxiliar = [];
                        var base64 = reader.result;
                        arrayAuxiliar = base64.split(',');
                        list[index].filebase64 = arrayAuxiliar[1];
                        list[index].ext = extension;
                        setInputListArchivos(list);
                    }
                })

                // Se redeclara en true
                setHayArchivo(true);

                // Se setean los valores del archivo
                obtenerPesoTotalArchivos(list);
            } else {

                // Se redeclara en false
                setHayArchivo(false);

                // Se setea el mensaje de error
                setErrorApi("El archivo seleccionado no tiene un formato permitido");

                // Se muestra el modal
                window.showModal(1);

                // Se retorna en false
                return false;
            }
        } else {
            const list = [...inputListArchivos];
            list[index][name] = '';
            list[index].filebase64 = '';
            list[index].size = 0;
            setInputListArchivos(list);
            obtenerPesoTotalArchivos(list);
        }
    }

    const handleClicArchivo = () => {
        try {

            // Se usa el cargando
            window.showSpinner(true);

            // Se inicializa la data
            const data = {
                "data": {
                    "type": "caratula",
                    "attributes": {
                        "nombre_actuacion": "",
                        "nombre_plantilla": "",
                    }
                }
            }

            // Se consume la API
            GenericApi.getByDataGeneric('caratulas/plantilla/' + from.id, data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no hay error
                    if (!datos.error) {

                        // Se descarga el archivo
                        downloadBase64File(datos.content_type, datos.base_64, datos.file_name);
                    }

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
        }
    };

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function obtenerPesoTotalArchivos(list) {
        let peso = 0;
        list.forEach(
            (archivo, index) => {
                if (archivo.archivo.size) {
                    peso += archivo.archivo.size;
                }
            }
        )
        if (peso > 15000000) {
            setErrorApi('EL DOCUMENTO ADJUNTO SUPERA EL PESO PERMITIDO.')
            window.showModal(1)
        }
        setPesoTotalArchivos(peso);
    }

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    function formatBytes(bytes, decimals = 3) {
        if (bytes === undefined) return '0 Bytes';
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        <>
            {<Spinner />}
            {<InfoErrorApi error={errorApi} />}
            {<ModalGen data={getModalState} />}
            <Formik
                initialValues={{
                    nombreCaratula: '',
                    plantilla: '',
                    archivo: '',
                }}
                enableReinitialize
                validate={(valores) => {

                    // Se inicializa el array
                    let errores = {};

                    // Se captura el id de la caratula
                    valores.caratulaId = getCaratulaId;

                    // Se valida que tenga un nombre valido
                    if(getRepuestaNombreCaratula == false){
                        errores.nombreCaratula = global.Constants.MENSAJE_ERROR.ERROR_FORMATO_CARACTERES_INVALIDOS;
                    }
                    if (getNombreCaratula == "") {

                        // Se setea el mensaje de error
                        errores.nombreCaratula = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    // Se captura el nombre del archivo
                    let archivo = inputListArchivos[0].filebase64 != "" ? inputListArchivos[0].archivo.name : from ? from.attributes.nombre_plantilla : "";

                    // Se valida que tenga un archivo valido
                    if (archivo == "") {

                        // Se setea el mensaje de error
                        errores.archivo = global.Constants.MENSAJE_ERROR.CAMPO_OBLIGATORIO;
                    }

                    // Se retornan los errores
                    return errores;
                }}
                onSubmit={(valores, { resetForm }) => {

                    // Se valida que venga un from para actualizar
                    if (from != null) {

                        // Se llama el metodo para actualizar los datos
                        actualizarDatos(valores);
                    }
                }}
            >
                {({ errors }) => (
                    <Form>
                        <div className="block block-rounded block-bordered">
                            <div className="block block-themed">
                                <div className="col-md-12">
                                    <div className="w2d_block let">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-alt push">
                                                <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={`/CaratulasAdminLista`}><small>Lista de carátulas</small></Link></li>
                                                <li className="breadcrumb-item"> <small>Crear carátulas</small></li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                                <div className="block-header">
                                    <h3 className="block-title">ADMINISTRACIÓN :: CARÁTULA :: PLANTILLA </h3>
                                </div>
                                <div className="block-content">

                                    <div className="row text-right w2d-enter">
                                        <div className="col-md-12">
                                            <Link to={'/CaratulasAdminLista'} title='Regresar'>
                                                <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="nombreCaratula">NOMBRE<span className="text-danger">*</span></label>
                                                <Field as="input" type="text" className="form-control" id="nombreCaratula" name="nombreCaratula" value={getNombreCaratula} onChange={changeNombreCaratula} autocomplete="off"></Field>
                                                <ErrorMessage name="nombreCaratula" component={() => (<span className="text-danger">{errors.nombreCaratula}</span>)} />
                                            </div>
                                        </div>
                                        {
                                            getCaratulaId > 0 ?
                                                inputListArchivos.map((x, i) => {
                                                    return (
                                                        <div className="col-md-6" key={i}>
                                                            <div className="form-group">
                                                                <div className='row'>
                                                                    <div className='col-md-12'>
                                                                        <label>PLANTILLA (WORD)<span className="text-danger">* </span></label>
                                                                    </div>
                                                                    <div className='col-md-12' style={{ marginLeft: '13px' }}>
                                                                        <div className='row'>
                                                                            <div className='col-md-10'>
                                                                                <label className="custom-file-label" htmlFor="example-file-input-custom" data-toggle="custom-file-input">{x.archivo.name != null ? x.archivo.name : getNombrePlantilla}</label>
                                                                                <input className="custom-file-input" data-toggle="custom-file-input" type="file" accept='.docx' name="archivo" onChange={e => handleInputChangeArchivos(e, i)} />
                                                                                <ErrorMessage name="archivo" component={() => (<span className="text-danger">{errors.archivo}</span>)} />
                                                                            </div>
                                                                            {from != null ?
                                                                                <div className='col-2'>
                                                                                    <button type='button' title='Descargar documento' className='btn btn-sm btn-primary' onClick={() => handleClicArchivo()}>
                                                                                        <i className='fas fa-download'></i>
                                                                                    </button>
                                                                                </div>
                                                                                : ""}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="submit" className="btn btn-rounded btn-primary" >
                                    {from != null ? "ACTUALIZAR" : "REGISTRAR"}
                                </button>
                                <Link to={'/CaratulasAdminLista'} className="font-size-h5 font-w600" >
                                    <button type="button" className="btn btn-rounded btn-outline-primary">CANCELAR</button>
                                </Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};