import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function addEntidadInvestigado(data){

    const url = baseUrl + "entidad-investigado";
   
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.post(url, data, {
        headers: headers
    })
    .then(response => {
        //console.log(data);
        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error}
    });
}

async function updateEntidadInvestigado(data, id) {

    const url = baseUrl + "entidad-investigado/" + id;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.put(url, data, {
        headers: headers
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
            return { estado: false, error: error }
        });
}

async function getAllEntidadInvestigadoByIdProDisciplinario(data, procesoDisciplinarioId){

    const url = baseUrl + "entidad-investigado/get-entidad-investigado/" + procesoDisciplinarioId;
    console.log(url);
    console.log(JSON.stringify(data));
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
            return {estado: false, error: error}
        });
}

async function getAllEntidadInvestigadoFilter(data, procesoDisciplinarioId){

    const url = baseUrl + "entidad-investigado/get-entidad-investigado-filter/" + procesoDisciplinarioId;
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
            return {estado: false, error: error}
        });
}

export default { addEntidadInvestigado, getAllEntidadInvestigadoByIdProDisciplinario, getAllEntidadInvestigadoFilter, updateEntidadInvestigado}
