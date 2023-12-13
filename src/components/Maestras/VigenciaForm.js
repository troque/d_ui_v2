import React from 'react';
import GenericForm from './GenericForm';
import { VigenciaModel } from './Models/VigenciaModel';

export default function VigenciaForm() {

    return (<GenericForm
        formName='vigencia'
        service='vigencia'
        model={VigenciaModel}
        successRedirect='/Vigencia'
    />
    );
};