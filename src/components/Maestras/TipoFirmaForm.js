import React from 'react';
import GenericForm from './GenericForm';
import { TipoFirmaModel } from './Models/TipoFirmaModel';


export default function TipoFirmaForm() {
    
    return (<GenericForm
        formName='Tipo de firma'
        service='mas-tipo-firma'
        model={TipoFirmaModel}
        successRedirect='/Tipofirma'
    />
    );
    
    
};

