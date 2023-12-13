import React from 'react';
import GenericForm from './GenericForm';
import GetEtapaModel from './Models/EtapaModel';

export default function EtapaForm() {

    const itemSelectResolve = (serviceName, value) => {
        return { value: value.id, label: value.attributes.nombre }
    }

    return (<GenericForm
        formName='etapa'
        service='mas-etapa'
        ddlServices={['mas-tipo-proceso']}
        ddlServicesFunction={itemSelectResolve}
        model={GetEtapaModel}
        successRedirect='/Etapa'
    />
    );



};