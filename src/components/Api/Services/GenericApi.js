import axios from 'axios'
import { getBearerToken, handleError } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function getGeneric(relativeUrl) {
    const url = baseUrl + relativeUrl;
    headers['Authorization'] = getBearerToken();

    console.log(url);

    return await axios.get(url, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            handleError(error);
            return { estado: false, error: error }
        });
}

async function getAllGeneric(serviceName) {
    const url = serviceName;
    return getGeneric(url);
}

async function getByIdGeneric(serviceName, id) {
    const url = serviceName + "/" + id;
    return getGeneric(url);
}

async function getByDataGeneric(serviceName, data) {

    const url = baseUrl + serviceName;
    headers['Authorization'] = getBearerToken();

    console.log(url);
    console.log(JSON.stringify(data));

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            handleError(error);
            return { estado: false, error: error }
        });
}

async function addGeneric(serviceName, data) {
    const url = baseUrl + serviceName;
    headers['Authorization'] = getBearerToken();

    console.log(url);
    console.log(JSON.stringify(data));

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            handleError(error);
            return { estado: false, error: error }
        });
}

async function updateGeneric(serviceName, id, data) {

    const url = baseUrl + serviceName + "/" + id;
    headers['Authorization'] = getBearerToken();

    console.log(url);
    console.log(JSON.stringify(data));

    return await axios.put(url, data, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            handleError(error);
            return { estado: false, error: error }
        });
}


export default { getGeneric, getAllGeneric, getByIdGeneric, addGeneric, updateGeneric, getByDataGeneric }
