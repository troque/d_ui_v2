import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

/**
 * 
 * @param {*} data 
 * @param {*} procesoDisciplinarioId 
 * @returns 
 */
async function getDocumento(data) {

    const url = baseUrl + "archivo-actuaciones/get-documento";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    console.log(url);

    return await axios.post(url, data, {
        headers: headers,
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            return { estado: false, error: error }
        });
}

export default { getDocumento }
