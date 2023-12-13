import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function getAllAntecedente(data, procesoDisciplinarioId){

    const url = baseUrl + "antecedentes/get-antecedentes/" + procesoDisciplinarioId;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.post(url, data, {
        headers: headers
    })
    .then(response => 
        {
            // console.log(response.data);

        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error}
    });
}

async function getPrimerYUltimoAntecedente(data, procesoDisciplinarioId){

    const url = baseUrl + "antecedentes/get-primer-ultima-antecedentes/" + procesoDisciplinarioId;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.get(url, {
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

async function getAllAntecedentes(){

    const url = baseUrl + "antecedentes";
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
        return {estado: false, error: error}
    });
}

async function addAntecedente(data){

    const url = baseUrl + "antecedentes";
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
        return {estado: false, error: error}
    });
}

/**
 * 
 * @param {*} data 
 * @returns 
 */
 async function updateAntecedente(data, id){

    const url = baseUrl + "antecedentes/"+ id;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;


    return await axios.put(url, data, {
        headers: headers
    })
    .then(response => {
        // console.log(data);
        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error}
    });
}

async function getAntecedenteById(id){

    const url = baseUrl + "antecedentes/" + id;
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
        return {estado: false, error: error}
    });
}


export default { getAllAntecedente, getAllAntecedentes, addAntecedente, updateAntecedente, getAntecedenteById, getPrimerYUltimoAntecedente }
