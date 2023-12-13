import React from 'react';
import GenericForm from './GenericForm';
import { DiasNoLaborablesModel } from './Models/DiasNoLaborablesModel';

export default function DiasNoLaborablesForm() {

    return (<GenericForm
        formName='días no laborables'
        service='dias-no-laborales'
        model={DiasNoLaborablesModel}
        successRedirect='/DiasNoLaborables'
    />
    );
};