import React from 'react';
import GenericForm from './GenericForm';
import { FormatosModel } from './Models/FormatosModel';

export default function FormatoForm() {

    return (<GenericForm
        formName='Formato'
        service='mas-formato'
        model={FormatosModel}
        successRedirect='/Formatos'
    />
    );
};