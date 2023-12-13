import axios from 'axios'
import { getBearerToken } from '../../Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}


async function addUsuario(data) {
    const url = baseUrl + "usuario";
    headers['Authorization'] = getBearerToken();

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}

async function updateUsuario(data, id) {
    const url = baseUrl + "usuario/" + id;
    headers['Authorization'] = getBearerToken();

    return await axios.put(url, data, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}


export default { addUsuario, updateUsuario }
