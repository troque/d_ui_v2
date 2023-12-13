import React from 'react';
import GenericForm from './GenericForm';
import { DepartamentoModel } from './Models/DepartamentoModel';

export default function DepartamentoForm() {

    return (<GenericForm
        formName='departamento'
        service='departamento'
        model={DepartamentoModel}
        successRedirect='/Departamento'
    />
    );
};