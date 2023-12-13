import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function addLogEtapa(data){

    const url = baseUrl + "log-proceso-disciplinario";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    console.log(url);
    // console.log(JSON.stringify(data));

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


async function getLogEtapaProcesoDisciplinario(data, procesoDisciplinarioId){

    const url = baseUrl + "log-proceso-disciplinario/get-log-etapa/" + procesoDisciplinarioId;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    // console.log(JSON.stringify(data));

    return await axios.post(url, data, {
        headers: headers
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error}
    });
}


export default { addLogEtapa, getLogEtapaProcesoDisciplinario}
