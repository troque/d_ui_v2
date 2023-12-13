import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'

export const ParametroModel = createSchema('ParametroModel', {
    modulo: {
        type: 'string',
        addInputProps: { readonly: 'readonly' }
    },  
    nombre: {
        type: 'string',
        addInputProps: { readonly: 'readonly' }
    },
    valor: {
        type: 'string',
        required: true,
        maxLength: 255,
    },
})

setLanguageByName('es')
addTranslations({
    models: {
        ParametroModel: {
            modulo: 'Modulo',
            nombre: 'Nombre parametro',
            valor: 'Valor',
        },
    },
})

