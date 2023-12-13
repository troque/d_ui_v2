import React from 'react';
import GenericForm from './GenericForm';
import { TipoConductaModel } from './Models/TipoConductaModel';


export default function TipoConductaForm() {
    
    return (<GenericForm
        formName='Tipo de conducta'
        service='mas-tipo-conducta'
        model={TipoConductaModel}
        successRedirect='/TipoConducta'
    />
    );
    
    
};

