import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

//const baseUrl = 'http://127.0.0.1:8000/api/v1/'
const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function addDatosInteresado(data) {

    const url = baseUrl + "datos-interesado";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

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

async function addEntidadPermitidaInteresado(data) {

    const url = baseUrl + "interesado-entidad-permitida";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

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

async function getAllDatosInteresadoByIdProDisciplinario(data, procesoDisciplinarioId) {

    const url = baseUrl + "datos-interesado/datos-interesado/" + procesoDisciplinarioId;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            //console.log(response.data);
            return response.data;
        })
        .catch(error => {
            //console.log(error);
            return { estado: false, error: error }
        });
}

async function getAllDatosInteresadoById(id) {

    const url = baseUrl + "datos-interesado/datos-interesado-id/" + id;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.get(url, {
        headers: headers
    })
        .then(response => {
            //console.log(response.data);
            return response.data;
        })
        .catch(error => {
            //console.log(error);
            return { estado: false, error: error }
        });
}

async function getAllDatosInteresadoByFilter(data, procesoDisciplinarioId) {

    const url = baseUrl + "datos-interesado/datos-interesado-filter/" + procesoDisciplinarioId;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            //console.log(response.data);
            return response.data;
        })
        .catch(error => {
            //console.log(error);
            return { estado: false, error: error }
        });
}

async function getDatosInteresado(clasificacionRadicadoId) {

    const url = baseUrl + "datos-interesado/" + clasificacionRadicadoId;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.get(url, {
        headers: headers
    })
        .then(response => {
            //console.log(response.data);
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}


async function updateDatosInteresado(data, id) {

    const url = baseUrl + "datos-interesado/" + id;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.put(url, data, {
        headers: headers
    })
        .then(response => {
            // console.log(response.data);
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}

async function getInteresadoAntecedenteTipoNumero(data) {

    const url = baseUrl + "datos-interesado/datos-interesado-tipo-numero/";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            // console.log(response.data);
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}

export default {
    addDatosInteresado, getAllDatosInteresadoByIdProDisciplinario, getDatosInteresado, getAllDatosInteresadoByFilter, addEntidadPermitidaInteresado,
    getAllDatosInteresadoById, updateDatosInteresado, getInteresadoAntecedenteTipoNumero
}
