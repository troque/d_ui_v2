import React from 'react';
import GenericForm from './GenericForm';
import { TipoSujetoProcesalModel } from './Models/TipoSujetoProcesalModel';

export default function TipoSujetoProcesalForm() {

    return (<GenericForm
        formName='TIPO DE SUJETO PROCESAL'
        service='tipo-sujeto-procesal'
        model={TipoSujetoProcesalModel}
        successRedirect='/TipoSujetoProcesal'
    />
    );
};