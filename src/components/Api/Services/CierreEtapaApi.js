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
 * @returns 
 */
async function addCierreEtapa(data, etapa){

    let url = baseUrl + "cierre-etapa";

    if(etapa){
        url = baseUrl + "cierre-etapa/evaluacion";
    }

    console.log("URLLLLLLLLLLLLLLLLLLLLLL", baseUrl);
    
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    // console.log(JSON.stringify(data));
    
    return await axios.post(url, data, {
        headers: headers
    })
    .then(response => {
        // console.log("response");
        // console.log(response.data);
        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error}
    });

}

async function getCierreEtapaByIdProcesoDisciplinario(data){

    const url = baseUrl + "cierre-etapa/get-cierre-etapa";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

   console.log("URL: "+url);
//    console.log("DATA: "+JSON.stringify(data));
 

    return await axios.post(url, data, {
        headers: headers
    })
    
    .then(response => {
        // console.log("response");
        // console.log(response.data);
        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error}
    });
}

export default { addCierreEtapa, getCierreEtapaByIdProcesoDisciplinario }
