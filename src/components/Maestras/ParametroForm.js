import React, { useState } from 'react';
import GenericForm from './GenericForm';
import { ParametroModel } from './Models/ParametroModel';
import { useParams } from 'react-router-dom';
import ModalGen from '../Utils/Modals/ModalGeneric';
import GenericApi from '../Api/Services/GenericApi';

export default function ParametroForm() {
    const { id } = useParams();
    const [modalState, setModalState] = useState({ title: "", message: "", show: false });

    const submit = (data) => {
        window.showSpinner(true);
        var requestData = {
            "data": {
                "type": 'parametro',
                "attributes": data,
            }
        }
        // console.log(JSON.stringify(requestData));
        GenericApi.updateGeneric('parametro', id, requestData).then(
            datos => {
                window.showSpinner(false);
                if (!datos.error)
                    setModalState({ title: "Registro actualizado", message: "Registro actualizado con exito", show: true, redirect: '/Parametro', alert: global.Constants.TIPO_ALERTA.EXITO });
                else
                    setModalState({ title: "Error", message: (datos.error)?datos.error.toString():"Error actualizando el registro", show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            }
        );
    }

    return (<>
        <ModalGen data={modalState} />
        <GenericForm
            formName='parametro del sistema'
            service='parametro'
            model={ParametroModel}
            successRedirect='/Parametro'
            onSubmit={submit}
        />
    </>
    );
};