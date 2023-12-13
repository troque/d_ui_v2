import React from 'react';
import GenericForm from './GenericForm';
import { LocalidadModel } from './Models/LocalidadModel';

export default function LocalidadForm() {

    return (<GenericForm
        formName='Localidad'
        service='mas-localidad'
        model={LocalidadModel}
        successRedirect='/Localidad'
    />
    );
};