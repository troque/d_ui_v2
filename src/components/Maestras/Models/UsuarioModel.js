import { createSchema, addTranslations, setLanguageByName, tr } from 'react-hook-form-auto'

// function getRoles() {
//     return [
//         { value: '3', label: 'Abogado' },
//         { value: '1', label: 'Administrador' },
//         { value: '2', label: 'Control interno disciplinario' }
//     ];
// }

export const GetUsuarioModel = (roles, dependencias) => {
    const role = createSchema('role', {
        role: {
            type: 'select',
            options: roles,
        },
    });


    const UsuarioModel = createSchema('UsuarioModel', {
        nombre: {
            type: 'string',
            required: true,
            maxLength: 255,
        },
        apellido: {
            type: 'string',
            maxLength: 255,
        },
        email: {
            type: 'string',
            required: true,
            maxLength: 255,
        },
        id_dependencia: {
            type: 'select',
            options: dependencias,
        },
        estado: {
            type: 'select',
            required: true,
            options: [
                { value: '1', label: 'Activo' },
                { value: '0', label: 'Inactivo' }
            ],
        },
        roles: {
            type: [role],
            minChildren: 1
        }
    });

    return UsuarioModel;
}


setLanguageByName('es')
addTranslations({
    models: {
        UsuarioModel: {
            nombre: 'Nombre',
            apellido: 'Apellido',
            email: 'Email',
            id_dependencia: 'Dependencia',
            estado: 'Estado',
            roles: 'Roles'
        },
        role: {
            role: "Roles",

        }
    },
})

