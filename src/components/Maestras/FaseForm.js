import React from 'react';
import GenericForm from './GenericForm';
import GetFaseModel from './Models/FaseModel';

export default function FaseForm() {

    const itemSelectResolve = (serviceName, value) => {
        return { value: value.id, label: value.attributes.nombre }
    }

    return (<GenericForm
        formName='fase'
        service='mas-fase'
        ddlServices={['mas-etapa']}
        ddlServicesFunction={itemSelectResolve}
        model={GetFaseModel}
        successRedirect='/Fase'
    />
    );



};