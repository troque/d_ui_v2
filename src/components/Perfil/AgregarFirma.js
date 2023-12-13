
import React, { useEffect, useState } from "react";
import Spinner from '../Utils/Spinner';
import { Link } from "react-router-dom";
import { getUser } from '../../components/Utils/Common';
import GenericApi from '../Api/Services/GenericApi';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import InfoErrorApi from '../Utils/InfoErrorApi';
import ModalGen from '../Utils/Modals/ModalGeneric';


function AgregarFirma() {

    // Constantes de la clase
    const [inputListfirmaMecanica, setInputListfirmaMecanica] = useState([{ folios: "", firmaMecanica: {}, filebase64: "", size: 0, id_mas_formato: null }]);
    const [getDatosUsuario, setDatosUsuario] = useState("");
    const [getNombreFirmaMecanica, setNombreFirmaMecanica] = useState("");
    const [getContrasena, setContrasena] = useState("");
    const [getContrasena2, setContrasena2] = useState("");
    const [errorApi, setErrorApi] = useState('');
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    // Metodo principal de la clase para cargar la informacion
    useEffect(() => {

        // Se construye la funcion principal
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se cargan los datos del usuario
            obtenerDatosUsuario();
        }

        // Se llama el metodo
        fetchData();
    }, []);

    // Metodo encargado de obtener los datos del usuario
    const obtenerDatosUsuario = () => {

        // Se consume la API
        GenericApi.getGeneric("usuario/" + getUser().id).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los datos
                    setDatosUsuario(datos.data);
                    setNombreFirmaMecanica(datos.data.attributes.firma_mecanica);
                }

                // Se quita el cargando
                window.showSpinner(false);
            }
        )
    }

    const handleClicfirmaMecanicaEjemplo = () => {

        // Se inicializa el titulo del modal
        const tituloModal = "Firma mecánica :: Descargar firma de ejemplo";
        const mensjeError = "Ocurrió un error";

        try {

            // Se usa el cargando
            window.showSpinner(true);

            // Se inicializa la data
            const data = {
                "data": {
                    "type": "usuario",
                    "attributes": {
                        "firma_mecanica": "",
                    }
                }
            }

            // Se consume la API
            GenericApi.getByDataGeneric('usuario/get-firma-mecanica-ejemplo', data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se llama el metodo para descargar el archivo
                        downloadBase64File(datos.content_type, datos.base_64, datos.file_name);
                    } else {

                        // Se setea el modal
                        setModalState({ title: tituloModal.toUpperCase(), message: mensjeError.toUpperCase(), show: true, redirect: '/AgregarFirma', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            )

        } catch (error) {

            // Se setea el modal
            setModalState({ title: tituloModal.toUpperCase(), message: mensjeError.toUpperCase(), show: true, redirect: '/AgregarFirma', alert: global.Constants.TIPO_ALERTA.ERROR });
        }

    }

    const handleClicfirmaMecanicaActual = () => {

        // Se inicializa el titulo del modal
        const tituloModal = "Firma mecánica :: Descargar firma actual";
        const mensjeError = "Ocurrió un error";

        try {

            // Se usa el cargando
            window.showSpinner(true);

            // Se inicializa la data
            const data = {
                "data": {
                    "type": "usuario",
                    "attributes": {
                        "firma_mecanica": "",
                    }
                }
            }

            // Se consume la API
            GenericApi.getByDataGeneric('usuario/get-firma-mecanica/' + getDatosUsuario.id, data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se llama el metodo para descargar el archivo
                        downloadBase64File(datos.content_type, datos.base_64, datos.file_name);
                    } else {

                        // Se setea el modal
                        setModalState({ title: tituloModal.toUpperCase(), message: mensjeError.toUpperCase(), show: true, redirect: '/AgregarFirma', alert: global.Constants.TIPO_ALERTA.ERROR });
                    }

                    // Se quita el cargando
                    window.showSpinner(false);
                }
            )
        } catch (error) {

            // Se setea el modal
            setModalState({ title: tituloModal.toUpperCase(), message: mensjeError.toUpperCase(), show: true, redirect: '/AgregarFirma', alert: global.Constants.TIPO_ALERTA.ERROR });
        }
    }

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const handleInputChangeImagen = (e, index) => {

        const { name, files } = e.target;
        if (files.length > 0) {
            const extension = getFileExtension(files[0].name);
            if (extension == "png" || extension == "jpg" || extension == "jpeg") {

                const list = [...inputListfirmaMecanica];
                list[index][name] = files[0];

                if (files[0]) {
                    list[index][name] = files[0];
                } else {
                    list[index][name] = '';
                    list[index].filebase64 = '';
                    list[index].size = 0;
                    list[index].ext = "";

                    setInputListfirmaMecanica(list);
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
                        setInputListfirmaMecanica(list);
                    }
                })
                obtenerPesoTotalImagen(list);
            } else {

                setErrorApi("El archivo seleccionado no tiene un formato permitido. Debe ser .png, .jpg o .jpeg.")
                window.showModal(1);
                return false;
            }
        } else {
            const list = [...inputListfirmaMecanica];
            list[index][name] = '';
            list[index].filebase64 = '';
            list[index].size = 0;
            setInputListfirmaMecanica(list);
            obtenerPesoTotalImagen(list);
        }

    }

    function obtenerPesoTotalImagen(list) {
        let peso = 0;
        list.forEach(
            (archivo, index) => {
                if (archivo.size) {
                    peso += archivo.size;
                }
            }
        )

        if (peso > 15000000) {
            setErrorApi('El peso/tamaño de la imagen supera los 15 MB permitidos para el registro.')
            window.showModal(1)
        }

    }

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    const changecontrasena = (e) => {
        setContrasena(e.target.value);
    }

    const changecontrasena2 = (e) => {
        setContrasena2(e.target.value);
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

    const enviarDatos = (valores) => {

        // Se inicializa el cargando
        window.showSpinner(true);

        // Se inicializa la data
        let data = {
            "data": {
                "type": "usuario",
                "attributes": {
                    "firma_mecanica": inputListfirmaMecanica[0].firmaMecanica.name,
                    "password_firma_mecanica": getContrasena,
                    "firma_mecanica_fileBase64": inputListfirmaMecanica[0].filebase64,
                }

            }
        }

        // Se inicializa el titulo del modal
        const tituloModal = "FIRMA MECÁNICA :: REGISTRO DE FIRMA";

        // Se consume la API
        GenericApi.updateGeneric('usuario/set-firma-mecanica', getDatosUsuario.id, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea el modal
                    setModalState({ title: tituloModal.toUpperCase(), message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: '/DocumentosFirmadosOPendientesDeFirma', alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {
                    // Se setea el modal
                    let errores = []
                    errores[0] = datos.mensaje1.toString().toUpperCase()
                    errores[1] = datos.mensaje2.toString().toUpperCase()
                    errores[2] = datos.mensaje3.toString().toUpperCase()
                    errores[3] = datos.mensaje4.toString().toUpperCase()
                    errores[4] = datos.error.toString().toUpperCase()

                    setModalState({ 
                        title: tituloModal.toUpperCase(), 
                        message: errores, 
                        show: true, 
                        alert: global.Constants.TIPO_ALERTA.ERROR 
                    });
                }
            }
        )
    }

    // console.log(inputListfirmaMecanica);
    return (
        <>
            {<Spinner />}
            {<ModalGen data={getModalState} />}
            {<InfoErrorApi error={errorApi} />}
            <Formik
                initialValues={{
                    firmaMecanica: inputListfirmaMecanica[0],
                    contrasena: getContrasena,
                    contrasena2: getContrasena2
                }}
                enableReinitialize
                validate={(valores) => {

                    let errors = {}
                    valores.constrasena = getContrasena;
                    valores.constrasena2 = getContrasena2;
                    valores.firmaMecanica = inputListfirmaMecanica[0];

                    // console.log(valores.firmaMecanica);
                    if (valores.constrasena == "") {
                        errors.constrasena = 'DEBE AGREGAR FIRMA';
                    }

                    if (valores.constrasena == "") {
                        errors.constrasena2 = 'DEBE CONFIRMAR FIRMA';
                    } else if (valores.constrasena != valores.constrasena2) {
                        errors.constrasena2 = 'LAS CONTRASEÑAS NO COINCIDEN';
                    }

                    return errors
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
                                    <li className="breadcrumb-item"><Link underline="hover" className="text-dark" to={`/Perfil`}><small>Perfil</small></Link></li>
                                    <li className="breadcrumb-item"><small>
                                        {getDatosUsuario ?
                                            getDatosUsuario.attributes.firma_mecanica ?
                                                "Actualizar "
                                                : "Agregar "
                                            : null
                                        }
                                        firma mecánica
                                    </small></li>
                                </ol>
                            </nav>
                        </div>
                        <div className="block block-rounded block-bordered">
                            <div className="block block-themed">
                                <div className="block-header">
                                    <h3 className="block-title">
                                        {getDatosUsuario ?
                                            getDatosUsuario.attributes.firma_mecanica ?
                                                "ACTUALIZAR "
                                                : "AGREGAR "
                                            : null
                                        }
                                        FIRMA MECÁNICA
                                    </h3>
                                </div>
                                <div className="block-content">
                                    <div className='text-right mb-2'>
                                        <Link to={`/Perfil/`} title='Regresar al perfil'>
                                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i></button>
                                        </Link>
                                    </div>
                                    <div className="row">
                                        {inputListfirmaMecanica.map((x, i) => {
                                            return (
                                                <div className="col-md-8" key={i}>
                                                    <div className="form-group">
                                                        <div className='row'>
                                                            <div className='col-md-12'>
                                                                <label>IMAGEN FIRMA MECÁNICA (PNG, JPG y JPEG) <span className="text-danger"> *</span></label>
                                                            </div>
                                                            <div className='col-md-12' style={{ marginLeft: '13px' }}>
                                                                <div className='row'>
                                                                    <div className="col-md-10">
                                                                        <label className="custom-file-label manual" htmlFor="example-file-input-custom2" data-toggle="manual">{x.firmaMecanica.name != null ? x.firmaMecanica.name : getNombreFirmaMecanica}</label>
                                                                        <input className="custom-file-input manual" data-toggle="custom-file-input2" type="file" accept=".jpg, .png, .jpeg" name="firmaMecanica" onChange={e => handleInputChangeImagen(e, i)} />
                                                                        <label>PESO: {formatBytes(x.firmaMecanica.size)} </label>
                                                                        <ErrorMessage name="firmaMecanica" component={() => (<span className="text-danger">{errors.archivo}</span>)} />
                                                                    </div>
                                                                    <div>
                                                                        {getDatosUsuario ?
                                                                            getDatosUsuario.attributes.firma_mecanica ?
                                                                                <button type='button' title='DESCARGAR DOCUMENTO' className='btn btn-sm btn-primary' onClick={() => handleClicfirmaMecanicaActual()}>
                                                                                    <i className='fas fa-download'></i>
                                                                                </button>
                                                                                : null
                                                                            : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className="col-md-7">
                                            <div className="form-group">
                                                <label htmlFor="constrasena">CONTRASEÑA PARA FIRMAR<span className="text-danger"> *</span></label>
                                                <Field as="input" type="password" className="form-control" id="constrasena" name="constrasena" value={getContrasena} onChange={changecontrasena} autocomplete="off"></Field>
                                                <ErrorMessage name="constrasena" component={() => (<span className="text-danger">{errors.constrasena}</span>)} />
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="form-group">
                                                <label htmlFor="constrasena2">CONFIRMAR CONTRASEÑA<span className="text-danger"> *</span></label>
                                                <Field as="input" type="password" className="form-control" id="constrasena2" name="constrasena2" value={getContrasena2} onChange={changecontrasena2} autocomplete="off"></Field>
                                                <ErrorMessage name="constrasena2" component={() => (<span className="text-danger">{errors.constrasena2}</span>)} />
                                            </div>
                                        </div>
                                        <div className="block-content text-right">
                                            <button type="submit" className="btn btn-rounded btn-primary" >
                                                {getDatosUsuario ?
                                                    getDatosUsuario.attributes.firma_mecanica ?
                                                        "ACTUALIZAR"
                                                        : "AGREGAR"
                                                    : null
                                                }
                                            </button>
                                            <button type="button" className="btn btn-rounded btn-outline-primary" onClick={() => handleClicfirmaMecanicaEjemplo()}>
                                                DESCARGAR FIRMA DE EJEMPLO
                                            </button>
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

export default AgregarFirma;