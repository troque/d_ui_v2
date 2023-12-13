import React from 'react';
import GenericForm from './GenericForm';
import { TipoQuejaModel } from './Models/TipoQuejaModel';

export default function TipoQuejaForm() {

    return (<GenericForm
        formName='Tipo Queja'
        service='mas-tipo-queja'
        model={TipoQuejaModel}
        successRedirect='/TipoQueja'
    />
    );
};