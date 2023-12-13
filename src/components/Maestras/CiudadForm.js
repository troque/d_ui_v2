import React from 'react';
import GenericForm from './GenericForm';
import CiudadModel from './Models/CiudadModel';

export default function CiudadForm() {

    const itemSelectResolve = (serviceName, value) => {
        return { value: value.id, label: value.attributes.nombre }
    }

    return (<GenericForm
        formName='ciudad'
        service='ciudad'
        ddlServices={['departamentos-activos']}
        ddlServicesFunction={itemSelectResolve}
        model={CiudadModel}
        successRedirect='/Ciudad'
    />
    );
};