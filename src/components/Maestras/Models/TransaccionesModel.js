import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'

export default function TransaccionesModel(ddlData) {
    const handleChange = (value, { setValue }) => {
        if (global.Constants.CARACTERES_ESPECIALES.formatOnlyLetters.test(value)) {
            setValue('titulo', value);
        }
        else{
            setValue('titulo', value.substring(0, value.length -1));
        }
        
    }

    const model = createSchema('TransaccionesModel', {
        titulo: {
            type: 'string',
            required: true,
            maxLength: 255,
            onChange: (handleChange)
        },
        descripcion: {
            type: 'string',
            
            maxLength: 255
        }
    });

    return model;
}


setLanguageByName('es')
addTranslations({
    models: {
        TransaccionesModel: {
            titulo: 'Titulo',
            descripcion: 'Descripción',
        }
    },
})

