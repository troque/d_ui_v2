import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'
import '../../Utils/Constants';

const handleChange = (value, { setValue }) => {
    if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLetters.test(value)) {
        setValue('nombre', value)
    } else {
        setValue('nombre', value.substring(0, value.length - 1))
    }
}

export const ParametroCamposModel = createSchema('ParametroCamposModel', {
    nombre_campo: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 255,
        onChange: (handleChange)
    },
    type: {
        type: 'string',
        maxLength: 255,
    },
    value: {
        type: 'string',
        maxLength: 255,
    },
    estado: {
        type: 'select',
        required: true,
        options: [
            { value: '1', label: 'Activo' },
            { value: '0', label: 'Inactivo' },
        ],
    },
})

setLanguageByName('es')
addTranslations({
    models: {
        ParametroCamposModel: {
            nombre_campo: 'Parámetro plantilla',
            type: 'Tipo campo',
            value: 'Valor seleccionado',
            estado: {
                _field: 'Estado',
                _default: "Seleccione",
            },
        }
    },
})