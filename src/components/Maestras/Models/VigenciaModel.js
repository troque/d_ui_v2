import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'

export const VigenciaModel = createSchema('VigenciaModel', {
    vigencia: {
        type: 'number',
        required: true,
        min: 2000,
        max: 2100,
        // type: 'string',
        // required: true,
        // minLength: 4,
        // maxLength: 4,
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
        VigenciaModel: {
            vigencia: 'VIGENCIA*',
            estado: {
                _field: 'ESTADO*',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        },
    },
})

