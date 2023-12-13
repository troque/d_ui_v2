import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

//const baseUrl = 'http://127.0.0.1:8000/api/v1/'
const baseUrl = process.env.REACT_APP_API_URL;
const baseUrlRegistraduria = process.env.REACT_APP_API_REGISTRADURIA_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
} 

async function getRegistraduria(data,numeroDocumento){

    const url = baseUrl + "registraduria/search-documento/"+numeroDocumento;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;
    return await axios.post(url,data, {
        headers: headers
    })
    .then(response => {
        //console.log(JSON.stringify(response));
        //console.log(response.data);
        //console.log(response.data["return"]["datosCedulas"]["datos"])
        return response.data;
    })
    .catch(error => {
        //console.log(error);
        return {estado: false, error: error}
    });
}

async function getsinproc(data, numeroDocumento){

    const url = baseUrl + "proceso-diciplinario/validar-documento-sinproc/" + numeroDocumento;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;
    return await axios.post(url,data,  {
        headers: headers
    })
    .then(response => {
        //console.log(response.data);
        //console.log(response.data["return"]["datosCedulas"]["datos"])
        return response.data;
    })
    .catch(error => {
        //console.log(error);
        return {estado: false, error: error}
    });
}

export default { getRegistraduria, getsinproc}
