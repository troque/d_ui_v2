import React from 'react';
import GenericForm from './GenericForm';
import { TipoDocumentoModel } from './Models/TipoDocumentoModel';

export default function TipoDocumentoForm() {

    return (<GenericForm
        formName='Tipo de Documento'
        service='tipo-documento'
        model={TipoDocumentoModel}
        successRedirect='/TipoDocumento'
    />
    );
};