import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Autoform } from 'react-hook-form-auto';
//import styles from 'rhfa-emergency-styles';
import styles from './Models/Styles';
import 'rhfa-emergency-styles/dist/styles.css';
import Spinner from '../Utils/Spinner';
import ModalGen from '../Utils/Modals/ModalGeneric';
import GenericApi from '../Api/Services/GenericApi';


export default function GenericForm(props) {
    const {
        formName,
        service,
        ddlServices = [],
        ddlServicesFunction = null,
        model,
        onSubmit = null,
        successRedirect = ''
    } = props

    //const navigate = useNavigate();
    const { id } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [modelSchema, setModelSchema] = useState({});
    const [initialValues, setInitialValues] = useState({});
    const [modalState, setModalState] = useState({ title: "", message: "", show: false });
    let submitButtonText = id == undefined ? global.Constants.BOTON_NOMBRE.REGISTRAR : global.Constants.BOTON_NOMBRE.ACTUALIZAR;
    let formRef;

    useEffect(() => {
        window.showSpinner(true);

        async function initialData() {

            if (id != undefined) {
                return GenericApi.getByIdGeneric(service, id).then(
                    datos => {
                        setInitialValues(datos.data.attributes);
                        return !datos.error ? datos.data.attributes : {};
                    }
                )
            }
            else
                return {};
        }

        (async function () {
            var data = await initialData();
            var ddlData = {};
            for (var i = 0; i < ddlServices.length; i++) {
                var element = ddlServices[i];
                var ddlServiceData = await GenericApi.getAllGeneric(element).then(
                    datos => {
                        var ddlList = [];
                        if (!datos.error) {
                            datos.data.forEach(value => {
                                let item = typeof ddlServicesFunction == 'function' ? ddlServicesFunction(element, value) : { value: value.id, label: value.attributes.nombre };
                                ddlList.push(item);
                            });
                        }
                        return ddlList;
                    }
                );
                //console.log('END execution with result =', ddlServiceData);
                ddlData[element] = ddlServiceData;
            }

            loadForm(data, ddlData);
            window.showSpinner(false);
        })();
    }, []);

    const loadForm = (data, ddlData) => {
        //console.log("model type: " + typeof model);
        let modelDef = typeof model == 'function' ? model(ddlData) : model;
        setModelSchema(modelDef);
        setShowForm(true);

        //asigna valores iniciales al formulario
        //console.log("asigna valores iniciales al formulario>>>>")
        if (formRef != undefined) {
            Object.entries(data).forEach(([key, value]) => {
                //console.log(key + ": " + value);
                formRef.setValue(key, value);
            });
        }
    }

    const errors = (error) => {
        // console.log('errors');
        // console.log(error);
    }

    const submit = (data) => {

        if (typeof onSubmit == 'function') {

            onSubmit(data);
            return;
        }

        window.showSpinner(true);
        var requestData = {
            "data": {
                "type": service,
                "attributes": data,
            }
        }
        // console.log(JSON.stringify(requestData));
        if (id == undefined) {

            GenericApi.addGeneric(service, requestData).then(
                datos => {
                    window.showSpinner(false);
                    if (!datos.error)
                        setModalState({ title: "ADMINISTRACIÓN :: "+formName.toUpperCase(), message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: successRedirect, alert: global.Constants.TIPO_ALERTA.EXITO });
                    else
                        setModalState({ title: "ADMINISTRACIÓN :: "+formName.toUpperCase(), message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            );
        }
        else {
            GenericApi.updateGeneric(service, id, requestData).then(
                datos => {
                    window.showSpinner(false);

                    if (!datos.error)
                        setModalState({ title: "ADMINISTRACIÓN :: "+formName.toUpperCase(), message: global.Constants.MENSAJES_MODAL.EXITOSO, show: true, redirect: successRedirect, alert: global.Constants.TIPO_ALERTA.EXITO });
                    else
                        setModalState({ title: "ADMINISTRACIÓN :: "+formName.toUpperCase(), message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            );
        }
    }

    return (<div>
        <Spinner />
        <ModalGen data={modalState} />

        <div className="w2d_block let">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb breadcrumb-alt push">
                    <li className="breadcrumb-item"> <Link underline="hover" className="text-dark" to={successRedirect}><small>Lista de {formName}</small></Link></li>
                    <li className="breadcrumb-item"> <small>{submitButtonText.toLowerCase()} {formName}</small></li>
                </ol>
            </nav>
        </div>

        <div className="col-md-12">
            <div className="block block-themed">
                <div className="block-header">
                    <h3 className="block-title">ADMINISTRACIÓN :: {formName.toUpperCase()}</h3>
                </div>

                <div className="block-content">
                    <div className='text-right '>
                        <Link to={successRedirect}>
                            <button type="button" className="btn btn-success"><i className="fas fa-backward"></i> </button>
                        </Link>
                    </div>
                    {showForm ?
                        <Autoform
                            schema={modelSchema}
                            initialValues={initialValues}
                            styles={styles}
                            submitButton={true}
                            submitButtonText={submitButtonText}
                            config={{ arrayMode: 'table', horizontal: false }}
                            onSubmit={submit}
                            onErrors={errors}
                            ref={e => formRef = e}
                        >
                        </Autoform>
                        : null}
                </div>
            </div>
        </div>
    </div>
    );
};