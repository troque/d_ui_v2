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
async function addDocumentoSirius(data) {

    const url = baseUrl + "documento-sirius";
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
            return { estado: false, error: error }
        });
}

/**
 * 
 * @param {*} data 
 * @param {*} procesoDisciplinarioId 
 * @returns 
 */
async function getDocumentacionSiriusByIdProDisciplinario(data, procesoDisciplinarioId, per_page, current_page, estado, solo_sirius) {

    const url = baseUrl + "documento-sirius/get-documentos-radicados/" + procesoDisciplinarioId + "/" + per_page + "/" + current_page + "/" + estado + "/" + solo_sirius;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    console.log(url);
    console.log(JSON.stringify(data));

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

async function getNombresDocumentacionSiriusByIdProDisciplinario(procesoDisciplinarioId) {

    const url = baseUrl + "documento-sirius/get-nombres-documentos-radicados/" + procesoDisciplinarioId;
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

async function getDocumentoById(documentoSiriusId) {

    const url = baseUrl + "documento-sirius/" + documentoSiriusId;
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

/**
 * 
 * @param {*} data 
 * @returns 
 */
async function updateEstadoDocumentoSirius(data, id) {

    const url = baseUrl + "documento-sirius/" + id;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.put(url, data, {
        headers: headers
    })
        .then(response => {
            //console.log(data);
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}


/**
 * 
 * @param {*} data 
 * @returns 
 */
async function updateAntecedentes(data, id) {

    const url = baseUrl + "documento-sirius/" + id;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.put(url, data, {
        headers: headers
    })
        .then(response => {
            //console.log(data);
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}

/**
 * 
 * @param {*} data 
 * @param {*} procesoDisciplinarioId 
 * @returns 
 */
async function getDocumento(data) {

    const url = baseUrl + "documento-sirius/get-documento";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    console.log(url);

    return await axios.post(url, data, {
        headers: headers,
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error }
        });
}

/**
 * 
 * @param {*} data 
 * @param {*} procesoDisciplinarioId 
 * @returns 
 */
async function getDocumentacionSiriusByRadicadoSirius(expediente) {

    const url = baseUrl + "documento-sirius/get-documentos-radicados-expediente/" + expediente;
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

/**
 * 
 * @param {*} data 
 * @param {*} procesoDisciplinarioId 
 * @returns 
 */
async function getDocumentacionSiriusByRadicadoSiriusPortal(expediente) {

    const url = baseUrl + "documento-sirius/get-documentos-radicados-expediente-portal/" + expediente;
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

async function getDocumentacionSiriusByEtapaAndFase(id_proceso_disciplinario, id_etapa, id_fase) {

    const url = baseUrl + "documento-sirius/get-documentos-radicados-etapa-fase/" + id_proceso_disciplinario + "/" + id_etapa + "/" + id_fase;
    console.log(url);
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
            return { estado: false, error: error }
        });
}

export default {
    addDocumentoSirius, getDocumentacionSiriusByIdProDisciplinario, updateEstadoDocumentoSirius,
    getDocumento, getDocumentacionSiriusByRadicadoSirius, getDocumentacionSiriusByEtapaAndFase,
    getDocumentoById, getDocumentacionSiriusByRadicadoSiriusPortal, getNombresDocumentacionSiriusByIdProDisciplinario
}
