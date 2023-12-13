import React from 'react';
import GenericForm from './GenericForm';
import GetDependenciaModel from './Models/DependenciaModel';
import { getUser } from '../Utils/Common';

export default function DependenciaForm() {

    const itemSelectResolve = (serviceName, value) => {
        return { value: value.id, label: value.attributes.name.concat(' (', value.attributes.nombre || '', ' ', value.attributes.apellido || '', ')') }
    }

    const iduserdependencia = getUser().id_dependencia;

    return (<GenericForm
        formName='dependencia'
        service='mas-dependencia-origen'
        ddlServices={['usuario/get-todos-usuarios-dependencia/' + iduserdependencia]}
        ddlServicesFunction={itemSelectResolve}
        model={GetDependenciaModel}
        successRedirect='/Dependencia'
    />
    );
};