import axios from 'axios'
import { getToken, getBearerToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function getAllTiposOrigenRadicado() {

    const url = baseUrl + "mas-origen-radicado";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.get(url, {
        headers: headers
    })
        .then(response => {
            //console.log(response)
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error.message }
        });
}

async function getAllTiposProceso() {

    const url = baseUrl + "mas-tipo-proceso";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    console.log(url);

    return await axios.get(url, {
        headers: headers
    })
        .then(response => {
            //console.log(response)
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error.message }
        });
}


async function getAllTiposDependenciaOrigen() {

    const url = baseUrl + "mas-dependencia-origen";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.get(url, {
        headers: headers
    })
        .then(response => {
            //console.log(response)
            return response.data;
        })
        .catch(error => {
            // console.log(error);
            return { estado: false, error: error.message }
        });
}

/**
 * Trae los tipos de expediente solicitados en la calsificación del radicado de la etapa Captura y reparto de las ramas del proceso.
 * @returns 
 */
async function getAllTiposExpediente() {

    const url = baseUrl + "mas-tipo-expediente";
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
            return { estado: false, error: error }
        });
}


/**
 * Trae los tipos de expediente solicitados en la calsificación del radicado de la etapa Captura y reparto de las ramas del proceso.
 * @returns 
 */
async function getAllTiposDerechoPeticion() {

    const url = baseUrl + "mas-tipo-derecho-peticion";
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
            return { estado: false, error: error }
        });
}


async function getAllTerminosRespuesta() {

    const url = baseUrl + "mas-termino-respuesta";
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
            return { estado: false, error: error }
        });
}


async function getAllTiposQueja() {

    const url = baseUrl + "mas-tipo-queja";
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
            return { estado: false, error: error }
        });
}

async function getAllTiposDocumento() {

    const url = baseUrl + "tipo-documento";
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
            return { estado: false, error: error }
        });
}

async function getAllTiposEntidad() {

    const url = baseUrl + "tipo-entidad";
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
            return { estado: false, error: error }
        });
}

async function getAllTipoSujetoProcesal() {

    const url = baseUrl + "tipo-sujeto-procesal";
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
            return { estado: false, error: error }
        });
}

async function getAllLocalidad() {

    const url = baseUrl + "mas-localidad";
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
            return { estado: false, error: error }
        });
}

async function getAllSexo() {

    const url = baseUrl + "sexo";
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
            return { estado: false, error: error }
        });
}

async function getAllGenero() {

    const url = baseUrl + "genero";
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
            return { estado: false, error: error }
        });
}


async function getAllCiudadByDepartamento(data) {

    const url = baseUrl + "ciudad/ciudad-por-departamento";
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
            return { estado: false, error: error }
        });
}

async function getAllOrientacionSexual() {

    const url = baseUrl + "orientacion-sexual";
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
            return { estado: false, error: error }
        });
}

async function getAllDiasNoLaborales() {

    const url = baseUrl + "dias-no-laborales?estado=1";
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
            return { estado: false, error: error }
        });
}

async function getAllVigencias() {

    const url = baseUrl + "vigencia?estado=1";
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
            return { estado: false, error: error }
        });
}

async function getAllTipoInteresado() {

    const url = baseUrl + "tipo-interesado";
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
            return { estado: false, error: error }
        });
}

async function getAllEntidades() {

    const url = baseUrl + "entidades";
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
            return { estado: false, error: error }
        });
}


async function getAllRoles(){

    const url = baseUrl + "roles";
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

async function getAllTipoRespuesta(){

    const url = baseUrl + "tipo-respuesta";
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
            return { estado: false, error: error }
        });
}

async function getAllEntidadesPermitidasInteresado() {

    const url = baseUrl + "mas-entidad-permitida";
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
            return { estado: false, error: error }
        });
}

async function getParametroPorNombre(data) {

    const url = baseUrl + "parametro/parametro-nombre";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;
    //console.log(data);
    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            //console.log(response.data);
            return response.data;
        })
        .catch(error => {
            //console.log(error);
            return { estado: false, error: error }
        });
}

async function getDependenciaOrigeByFase(fase){
    
    const url = baseUrl + "mas-dependencia-origen/dependencia-fase/" + fase;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.get(url, {
        headers: headers
    })
    .then(response => {
        //console.log(response)
        return response.data;
    })
    .catch(error => {
        console.log(error);
        return {estado: false, error: error.message}
    });
}

async function getFaseById(id_fase){
    
    const url = baseUrl + "mas-fase/" + id_fase;
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    return await axios.get(url, {
        headers: headers
    })
    .then(response => {
        //console.log(response)
        return response.data;
    })
    .catch(error => {
        // console.log(error);
        return {estado: false, error: error.message}
    });
}

async function getFormatos() {

    const url = baseUrl + "mas-formato";
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
            return { estado: false, error: error }
        });
}

async function addFuncionariosGestorRespuesta(data) {

    const url = baseUrl + "mas-orden-funcionario";
    const token = getToken();
    headers['Authorization'] = `Bearer ${token}`;

    console.log(url);

    return await axios.post(url, data, {
        headers: headers
    })
        .then(response => {
            //console.log(response.data);
            return response.data;
        })
        .catch(error => {
            //console.log(error);
            return { estado: false, error: error }
        });
}

async function getAllTiposConducta() {

    const url = baseUrl + "mas-tipo-conducta";
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
            return { estado: false, error: error }
        });
}

async function getAllResultadoEvaluacion() {

    const url = baseUrl + "mas-resultado-evaluacion";
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
            return { estado: false, error: error }
        });
}

export default {
    getAllTiposOrigenRadicado, getAllTiposProceso, getAllTiposDependenciaOrigen,
    getAllTiposExpediente, getAllTiposDerechoPeticion, getAllTerminosRespuesta, getAllTiposQueja, getAllTiposDocumento,
    getAllCiudadByDepartamento, getAllTiposEntidad, getAllTipoSujetoProcesal, getAllLocalidad, getAllSexo, getAllGenero,
    getAllOrientacionSexual, getAllDiasNoLaborales, getAllVigencias, getAllTipoInteresado, getAllTipoRespuesta, getAllEntidades,
    getAllEntidadesPermitidasInteresado, getParametroPorNombre, getDependenciaOrigeByFase, getFaseById, getFormatos, 
    getAllTiposConducta, getAllResultadoEvaluacion, addFuncionariosGestorRespuesta
}