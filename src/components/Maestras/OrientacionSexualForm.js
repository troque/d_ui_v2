import React from 'react';
import GenericForm from './GenericForm';
import { OrientacionSexualModel } from './Models/OrientacionSexualModel';

export default function OrientacionSexualForm() {

    return (<GenericForm
        formName='Orientación Sexual'
        service='orientacion-sexual'
        model={OrientacionSexualModel}
        successRedirect='/OrientacionSexual'
    />
    );
};