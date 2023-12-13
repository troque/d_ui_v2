import React from 'react';
import GenericForm from './GenericForm';
import { OrigenRadicadoModel } from './Models/OrigenRadicadoModel';

export default function OrigenRadicadoForm() {

    return (<GenericForm
        formName='Origen Radicado'
        service='mas-origen-radicado'
        model={OrigenRadicadoModel}
        successRedirect='/OrigenRadicado'
    />
    );
};