import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

//const baseUrl = 'http://127.0.0.1:8000/api/v1/'
const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function addClasificacionRadicado(data){

    const url = baseUrl + "clasificacion-radicado";
   
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


async function getAllClasificacionRadicadoByIdProDisciplinario(data, procesoDisciplinarioId){

    const url = baseUrl + "clasificacion-radicado/get-clasificacion-radicado/" + procesoDisciplinarioId;

    console.log(url);

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

async function getClasificacionRadicado(clasificacionRadicadoId){

    const url = baseUrl + "clasificacion-radicado/" + clasificacionRadicadoId;
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

export default { addClasificacionRadicado, getAllClasificacionRadicadoByIdProDisciplinario, getClasificacionRadicado }
