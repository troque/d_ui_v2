import React from 'react';
import GenericForm from './GenericForm';
import { TipoExpedienteModel } from './Models/TipoExpedienteModel';

export default function TipoExpedienteForm() {

    return (<GenericForm
        formName='Tipo Expediente'
        service='mas-tipo-expediente'
        model={TipoExpedienteModel}
        successRedirect='/TipoExpediente'
    />
    );
};