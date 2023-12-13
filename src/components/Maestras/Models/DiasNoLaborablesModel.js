import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'

export const DiasNoLaborablesModel = createSchema('DiasNoLaborablesModel', {
    fecha: {
        type: 'string',
        required: true,
        minLength: 10,
        maxLength: 10,
        helperText: 'Fecha no laborable en la entidad',
        //addInputProps: { class: 'calendar' }
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
        DiasNoLaborablesModel: {
            fecha: 'Fecha',
            estado: {
                _field: 'Estado',
                _default: "Seleccione",
            },
        },
    },
})

