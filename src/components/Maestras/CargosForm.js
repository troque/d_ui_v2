import React from 'react';
import GenericForm from './GenericForm';
import CargosModel from './Models/CargosModel';

export default function CargosForm() {

    return (<GenericForm
        formName='nivel jerárquico'
        service='cargos'
        model={CargosModel}
        successRedirect='/Cargos'
    />
    );
};