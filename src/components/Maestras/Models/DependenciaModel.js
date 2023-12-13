import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'
import { getUser } from '../../Utils/Common';

export default function GetDependenciaModel(ddlData) {

    const iduserdependencia = getUser().id_dependencia;

    const model = createSchema('DependenciaModel', {
        nombre: {
            type: 'string',
            required: true,
            maxLength: '255',
        },
        id_usuario_jefe: {
            type: 'select',
            options: ddlData['usuario/get-todos-usuarios-dependencia/' + iduserdependencia],
        },
        estado: {
            type: 'select',
            required: true,
            options: [
                { value: '1', label: 'ACTIVO' },
                { value: '0', label: 'INACTIVO' }
            ],
        },
        prefijo: {
            type: 'string',
            maxLength: 255,
        },
    });

    return model;
}


setLanguageByName('es')
addTranslations({
    models: {
        DependenciaModel: {
            nombre: 'NOMBRE *',
            id_usuario_jefe: {
                _field: 'USUARIO JEFE *',
                _default: "Seleccione",
            },
            estado: {
                _field: 'ESTADO *',
                _default: "Seleccione",
            },
            prefijo: 'PREFIJO',
        },
    },
})

