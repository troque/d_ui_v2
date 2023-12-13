import { getUser } from '../../../components/Utils/Common';
import { hasAccess } from '../../../components/Utils/Common';

/**
 * Metodo encargado de validar si el usuario es 
 */
function validarUserUrl(pathName) {

    // Se captura el usuario actual
    const userActual = getUser();

    // Se valida si el usuario tiene permisos para acceder a la url
    if (!hasAccess('Administrador')) {

        // Se retorna si es valido o no
        return false;
    } else {
        // Se retorna si es valido o no
        return true;
    }
}

export default { validarUserUrl }
