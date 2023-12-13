import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'

export default function GetPortalConfiguracionTipoInteresadoModel(ddlData) {

    const model = createSchema('PortalConfiguracionTipoInteresadoModel', {
        id_tipo_sujeto_procesal: {
            type: 'select',
            options: ddlData['tipo-sujeto-procesal'],
            required: true,
        },
        permiso_consulta: {
            type: 'select',
            required: true,
            options: [
                { value: '1', label: 'Activo' },
                { value: '0', label: 'Inactivo' }
            ],
        }
    });
    return model;
}

setLanguageByName('es')
addTranslations({
    models: {
        PortalConfiguracionTipoInteresadoModel: {
            id_tipo_sujeto_procesal: {
                _field: 'Tipo Sujeto Procesal',
                _default: "Seleccione",
            },
            permiso_consulta: {
                _field: '¿Tiene permisos para consultar?',
                _default: "Seleccione",
            }
        },
    },
})

