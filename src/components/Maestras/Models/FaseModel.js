import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'

export default function GetFaseModel(ddlData) {

    const model = createSchema('FaseModel', {
        nombre: {
            type: 'string',
            required: true,
            minLength: 2,
            maxLength: 255,
        },
        id_etapa: {
            type: 'select',
            options: ddlData['mas-etapa'],
            required: true,
        },      
    });
    return model;
}

setLanguageByName('es')
addTranslations({
    models: {
        FaseModel: {
            nombre: 'NOMBRE *',
            id_etapa: {
                _field: 'ETAPA *',
                _default: "Seleccione",
            },
          
        },
    },
})

