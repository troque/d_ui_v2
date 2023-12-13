import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'

export const TipoFirmaModel = createSchema('TipoFirmaModel', {
    nombre: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 255,
    },
    tamano: {
        type: 'select',
        required: true,
        options: [
            { value: '0', label: 'PEQUEÑO' },
            { value: '1', label: 'MEDIANO' },
            { value: '2', label: 'GRANDE' }
        ],
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
        TipoFirmaModel: {
            nombre: 'NOMBRE',
            tamano: {
                _field: 'TAMAÑO',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
            estado: {
                _field: 'ESTADO',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        },
    },
})

