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
export const TipoDocumentoModel = createSchema('TipoDocumentoModel', {
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
        TipoDocumentoModel: {
            nombre: 'NOMBRE *',
            estado: {
                _field: 'ESTADO *',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        },
    },
})

