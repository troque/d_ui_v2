import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

/*async function consultarIncorporacionExistente($id_proceso_disciplinario){
    
    const url = baseUrl + "remision-queja/" + $id_proceso_disciplinario;
    const token = getToken();    
    headers['Authorization'] = `Bearer ${token}`;
    return await axios.get(url, {
        headers: headers
    })
    .then(response => {
        console.log(response)
        return response.data;
    })
    .catch(error => {
        console.log(error);
        return {estado: false, error: error.message}
    });
}*/

async function getRemisionQueja($id_proceso_disciplinario){
    
    const url = baseUrl + "remision-queja/" + $id_proceso_disciplinario;
    const token = getToken();    
    headers['Authorization'] = `Bearer ${token}`;
    return await axios.get(url, {
        headers: headers
    })
    .then(response => {
        // console.log(response)
        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error.message}
    });
}

async function consultarValidacionExpediente(data){

    const url = baseUrl + "remision-queja/validacion-expediente";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;
    return await axios.post(url, data, {
        headers: headers
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        return {estado: false, error: error.message}
    });

}

async function addIncorporacionExpediente(data){

    const url = baseUrl + "remision-queja";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;
    return await axios.post(url, data, {
        headers: headers
    })
    .then(response => {
        // console.log(response)
        return response.data;
    })
    .catch(error => {
        //console.log(error);
        return {estado: false, error: error}
    });
}



export default { consultarValidacionExpediente, addIncorporacionExpediente, getRemisionQueja }
