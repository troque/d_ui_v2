import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'

export default function CiudadModel(ddlData) {
    const handleChange = (value, { setValue }) => {
        if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLettersWhitAccent.test(value)) {
            setValue('nombre', value)
        }
        else{
            setValue('nombre', value.substring(0, value.length -1))
        }
        
    }

    const model = createSchema('CiudadModel', {
        nombre: {
            type: 'string',
            required: true,
            maxLength: 255,
            onChange: (handleChange)
        },
        id_departamento: {
            type: 'select',
            required: true,
            options: ddlData['departamentos-activos'],
        },
        codigo_dane: {
            type: 'number',
            required: true,
            maxLength: 255,
            //helperText: 'Código DANE del departamento'
        },
        estado: {
            type: 'select',
            required: true,
            options: [
                { value: '1', label: 'ACTIVO' },
                { value: '0', label: 'INACTIVO' }
            ],
        }
    });

    return model;
}


setLanguageByName('es')
addTranslations({
    models: {
        CiudadModel: {
            nombre: {
                _field: 'NOMBRE *',
            },
            codigo_dane: 'CÓDIGO DANE DE LA CIUDAD *',
            id_departamento: {
                _field: 'DEPARTAMENTO *',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
            estado: {
                _field: 'ESTADO *',
                _default: global.Constants.MENSAJE_INFORMATIVO.SELECCIONE_UNA_OPCION,
            },
        },
    },
})

