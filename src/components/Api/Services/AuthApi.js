import axios from 'axios'
import { getBearerToken } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;


let headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function login(user, password) {

    const url = baseUrl + "Auth/Login";
    const data = {
        "data": {
            "type": "login",
            "attributes": {
                "user": user,
                "password": password
            }
        }
    };

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            //console.log(error);
            return { estado: false, error: error }
        });
}


async function hasAccess(modulo, funcionalidad) {
    const url = baseUrl + "Auth/hasAccess";
    const data = {
        "data": {
            "type": "Auth",
            "attributes": {
                "modulo": modulo,
                "funcionalidad": funcionalidad
            }
        }
    };
    headers['Authorization'] = getBearerToken();

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            //console.log(response);
            return true;
        })
        .catch(error => {
            //console.log(error);
            return false;
        });
}

async function findUsers(criteria) {
    const url = baseUrl + "Auth/users/" + criteria;
    headers['Authorization'] = getBearerToken();

    return await axios.get(url, {
        headers: headers
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        //console.log(error);
        return { estado: false, error: error }
    });
}

export default { login, hasAccess, findUsers}
