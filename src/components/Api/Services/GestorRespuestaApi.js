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
async function getGestorRespuestaByProcesoDisciplinario(procesoDisciplinarioId) {


    const url = baseUrl + "gestor-respuesta/get-gestor-respuesta-proceso-disciplinario/" + procesoDisciplinarioId;
    console.log(url);
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

async function addGestorRespuesta(data) {

    const url = baseUrl + "gestor-respuesta";
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
            // console.log(error);
            return { estado: false, error: error }
        });
}

async function addGestorRespuestaDocumento(data) {

    const url = baseUrl + "gestor-respuesta/subir-documento";
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
            // console.log(error);
            return { estado: false, error: error }
        });
}

export default { getGestorRespuestaByProcesoDisciplinario, addGestorRespuesta, addGestorRespuestaDocumento }
