import React from 'react';
import GenericForm from './GenericForm';
import { SexoModel } from './Models/SexoModel';

export default function SexoForm() {

    return (<GenericForm
        formName='Sexo'
        service='sexo'
        model={SexoModel}
        successRedirect='/Sexo'
    />
    );
};