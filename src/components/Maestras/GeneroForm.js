import React from 'react';
import GenericForm from './GenericForm';
import { GeneroModel } from './Models/GeneroModel';

export default function GeneroForm() {

    return (<GenericForm
        formName='Género'
        service='genero'
        model={GeneroModel}
        successRedirect='/Genero'
    />
    );
};