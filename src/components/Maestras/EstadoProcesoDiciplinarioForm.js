import React from 'react';
import GenericForm from './GenericForm';
import { EstadoProcesoDiciplinarioModel } from './Models/EstadoProcesoDiciplinarioModel';

export default function EstadoProcesoDiciplinarioForm() {

    return (<GenericForm
        formName='EstadoProcesoDiciplinario'
        service='mas-estado-proceso-disciplinario'
        model={EstadoProcesoDiciplinarioModel}
        successRedirect='/EstadoProcesoDiciplinario'
    />
    );
};