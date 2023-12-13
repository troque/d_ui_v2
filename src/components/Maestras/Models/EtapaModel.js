import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'

export default function GetEtapaModel(ddlData) {

    const model = createSchema('EtapaModel', {
        nombre: {
            type: 'string',
            required: true,
            minLength: 2,
            maxLength: 255,
        },
       /* estado: {
            type: 'select',
            required: true,
            options: [
                { value: '1', label: 'Activo' },
                { value: '0', label: 'Inactivo' }
            ],
        }*/
    });
    return model;
}

setLanguageByName('es')
addTranslations({
    models: {
        EtapaModel: {
            nombre: 'NOMBRE *',
      
            estado: {
                _field: 'ESTADO',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        },
    },
})

