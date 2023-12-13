import AuthApi from '../Api/Services/AuthApi';

// return the user data from the session storage
export const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    else return null;
}

// return the token from the session storage
export const getToken = () => {
    return localStorage.getItem('token') || null;
}

export const getBearerToken = () => {
    const token = getToken();
    return `Bearer ${token}`;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token, user, functionalities) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('functionalities', JSON.stringify(functionalities));
    localStorage.setItem('roles', JSON.stringify(user.roles));
    localStorage.setItem('rolesSeparados', JSON.stringify(user.rolesSeparados));
}

//valida acceso de usuario a modulo y funcionalida
// export const hasAccess = async (modulo, funcionalidad) => {
//     return await AuthApi.hasAccess(modulo, funcionalidad);
//  }

export const hasAccess = (modulo, funcionalidad) => {

    try {

        var userRoles = JSON.parse(localStorage.getItem('roles'));

        if (userRoles != undefined && userRoles.split(",").includes('Administrador')) return true;
      
        var arrayFunc = JSON.parse(JSON.parse(localStorage.getItem('functionalities') || null));
        const found = arrayFunc.find(element => element.modulo == modulo && element.funcionalidad == funcionalidad);

        return found != undefined;
    }
    catch (ex) {
        // console.log(ex);
        return false;
    }
}


export const getRol = () => {
    const rolesStr = sessionStorage.getItem('roles');
    if (rolesStr) return JSON.parse(rolesStr);
    else return null;
}


export const handleError = (error) => {
    if (error.response.status == 401) { //Unauthorized
        removeUserSession();
        window.location.href = "/Login";
    }
    return;
}

export const quitarAcentos = (cadena) => {
    if (cadena != "" && cadena != null) {
        const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
        return cadena.split('').map(letra => acentos[letra] || letra).join('').toString();
    }
    else {
        return cadena;
    }
}