import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'

export const TipoExpedienteModel = createSchema('TipoExpedienteModel', {
    nombre: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 255,
    },
    estado: {
        type: 'select',
        required: true,
        options: [
            { value: '1', label: 'Activo' },
            { value: '0', label: 'Inactivo' }
        ],
    },
    termino: {
        type: 'string',
        required: true,
        minLength: 5,
        maxLength: 255,
    }

})

setLanguageByName('es')
addTranslations({
    models: {
        TipoExpedienteModel: {
            nombre: 'NOMBRE *',
            estado: {
                _field: 'ESTADO *',
                _default: "Seleccione",
            },
            termino: 'TÉRMINO',
        },
    },
})

