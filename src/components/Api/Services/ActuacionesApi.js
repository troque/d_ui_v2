import axios from 'axios'
import { getToken, getUser, removeUserSession, setUserSession } from '../../../components/Utils/Common';

const baseUrl = process.env.REACT_APP_API_URL;

const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
}

async function getAllActuaciones() {

    const url = baseUrl + "actuaciones";
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

export default { getAllActuaciones }
