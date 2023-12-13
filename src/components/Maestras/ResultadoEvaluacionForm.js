import React from 'react';
import GenericForm from './GenericForm';
import { ResultadoEvaluacionModel } from './Models/ResultadoEvaluacionModel';

export default function ResultadoEvaluacionForm() {

    return (<GenericForm
        formName='Tipo de evaluación'
        service='mas-resultado-evaluacion'
        model={ResultadoEvaluacionModel}
        successRedirect='/ResultadoEvaluacion'
    />
    );
};