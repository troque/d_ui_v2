import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'

export default function CargosModel(ddlData) {

    const model = createSchema('CargosModel', {
        nombre: {
            type: 'string',
            required: true,
            minLength: 2,
            maxLength: 255,
        },
        estado: {
            type: 'select',
            required: true,
            options: [
                { value: '1', label: 'ACTIVO' },
                { value: '0', label: 'INACTIVO' }
            ],
        }
    });
    return model;
}

setLanguageByName('es')
addTranslations({
    models: {
        CargosModel: {
            nombre: 'NOMBRE *',
            estado: {
                _field: 'ESTADO *',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        },
    },
})

