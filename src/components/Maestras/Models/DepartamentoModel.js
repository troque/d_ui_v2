import { createSchema, addTranslations, setLanguageByName } from 'react-hook-form-auto'
import '../../Utils/Constants';

const handleChange = (value, { setValue }) => {
    if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value)) {
        setValue('nombre', value)
    }
    else{
        setValue('nombre', value.substring(0, value.length -1))
    }
    
}
export const DepartamentoModel = createSchema('DepartamentoModel', {
    nombre: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 255,
        onChange: (handleChange)

    },
    codigo_dane: {
        type: 'number',
        required: true,
        maxLength: 255,
        //helperText: 'Código DANE del departamento',

    },
    estado: {
        type: 'select',
        required: true,
        options: [
            { value: '1', label: 'ACTIVO' },
            { value: '0', label: 'INACTIVO' }
        ],
    },
})



setLanguageByName('es')
addTranslations({
    models: {
        DepartamentoModel: {
            nombre: 'NOMBRE *',
            codigo_dane: 'CÓDIGO DANE DEL DEPARTAMENTO *',
            estado: {
                _field: 'ESTADO *',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        }
    },
})