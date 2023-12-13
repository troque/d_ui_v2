import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'

export const FormatosModel = createSchema('FormatosModel', {
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
})

setLanguageByName('es')
addTranslations({
    models: {
        FormatosModel: {
            nombre: 'NOMBRE *',
            estado: {
                _field: 'ESTADO *',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        },
    },
})

