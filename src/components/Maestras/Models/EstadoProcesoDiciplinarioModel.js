import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'

export const EstadoProcesoDiciplinarioModel = createSchema('EstadoProcesoDiciplinarioModel', {
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
    }
})

setLanguageByName('es')
addTranslations({
    models: {
        EstadoProcesoDiciplinarioModel: {
            nombre: 'Nombre',
            estado: {
                _field: 'Estado',
                _default: "Seleccione",
            },
        },
    },
})

