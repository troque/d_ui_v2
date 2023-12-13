import React from 'react';
import GenericForm from './GenericForm';
import { TipoDerechoPeticionModel } from './Models/TipoDerechoPeticionModel';

export default function TipoDerechoPeticionForm() {

    return (<GenericForm
        formName='Tipo Derecho Petición'
        service='mas-tipo-derecho-peticion'
        model={TipoDerechoPeticionModel}
        successRedirect='/TipoDerechoPeticion'
    />
    );
};