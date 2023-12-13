import React from 'react';
import GenericForm from './GenericForm';
import { TipoProcesoModel } from './Models/TipoProcesoModel';

export default function TipoExpedienteForm() {

    return (<GenericForm
        formName='Tipo de proceso'
        service='mas-tipo-proceso'
        model={TipoProcesoModel}
        successRedirect='/TipoProceso'
    />
    );
};