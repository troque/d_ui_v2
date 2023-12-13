import axios from 'axios'
import { getBearerToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

//const baseUrl = 'http://127.0.0.1:8000/api/v1/'
const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function getAllDepartamentos(){

    const url = baseUrl + "departamento";
    headers['Authorization'] = getBearerToken();
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

async function getAllDepartamentosPaginacion(url){
    headers['Authorization'] = getBearerToken();
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

async function getDepartamento(departamentoId){

    const url = baseUrl + "departamento/" + departamentoId;
    headers['Authorization'] = getBearerToken();
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

async function addDepartamento(data){

    const url = baseUrl + "departamento";
    headers['Authorization'] = getBearerToken();
    return await axios.post(url, data, {
        headers: headers
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        return {estado: false, error: error}
    });
}

async function updateDepartamento(DepartamentoId, data){

    const url = baseUrl + "departamento/" + DepartamentoId;
    headers['Authorization'] = getBearerToken();
    return await axios.put(url, data, {
        headers: headers
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        return {estado: false, error: error}
    });
}

export default { getAllDepartamentos, getAllDepartamentosPaginacion, getDepartamento, addDepartamento, updateDepartamento }
