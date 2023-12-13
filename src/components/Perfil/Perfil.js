
import React, { useEffect, useState } from "react";
import Spinner from '../Utils/Spinner';
import { Link } from "react-router-dom";
import { getUser } from '../../components/Utils/Common';
import GenericApi from '../Api/Services/GenericApi';

function Perfil() {

    // Constantes de la clase
    const getExistenDatosUsuario = getUser() != null ? true : false;
    const [getDatosJefeDependencia, setDatosJefeDependencia] = useState([]);
    const [getJefeDependencia, setJefeDependencia] = useState(false);
    const [getExisteFirmaMecanica, setExisteFirmaMecanica] = useState(false);
    const [getFirmaMecanica, setFirmasMecanica] = useState("");

    // Se obtiene el reparto habilitado
    const repartoHabilitado = getUser().reparto_habilitado == 1 ? "ACTIVO" : "INACTIVO";
    const idUsuarioLogeado = getUser() != null ? getUser().id : getUser().id;

    useEffect(() => {
        async function fetchData() {

            // Se usa el cargando
            window.showSpinner(true);

            // Se llama el metodo
            obtenerDatosUsuario();
        }
        fetchData();
    }, []);

    // Metodo encargado de obtener los datos del usuario
    const obtenerDatosUsuario = () => {

        // Se quita el cargando
        window.showSpinner(false);

        // Se captura el id del usuario jefe
        const datosDependencia = getUser() != null ? getUser().nombre_dependencia : null;
        const idUsuarioJefe = datosDependencia.id_usuario_jefe ? datosDependencia.id_usuario_jefe : null;

        // Se inicializa la data
        const data = {
            "data": {
                "type": "usuario",
                "attributes": {
                    "": ""
                }
            }
        }

        // Se valida que el valor del jefe sea diferente de null para buscar el jefe de la dependencia
        if (idUsuarioJefe != null) {

            // Se consume la API
            GenericApi.getByDataGeneric("usuario/get-jefe-de-mi-dependencia", data).then(

                // Se inicializa la variable de respuesta
                datos => {

                    // Se valida que no haya error
                    if (!datos.error) {

                        // Se redeclara la variable en true
                        setJefeDependencia(true);
                        setDatosJefeDependencia(datos.data.attributes);
                    } else {

                        // Se redeclara la variable en false
                        setJefeDependencia(false);
                    }
                }
            )
        }

        // Se obtiene la data de la firma mecanica
        GenericApi.getGeneric("usuario/" + idUsuarioLogeado).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    //console.log(datos.data.attributes.firma_mecanica.length)

                    // Se valida que exista firma mecanica
                    //if (datos.data.attributes.firma_mecanica.length > 0) {
                    if (datos.data.attributes.firma_mecanica) {

                        // Se redeclara la variable en true
                        setExisteFirmaMecanica(true);
                    } else {

                        // Se redeclara la variable en false
                        setExisteFirmaMecanica(false);
                    }
                } else {

                    // Se redeclara la variable en false
                    setExisteFirmaMecanica(false);
                }
            }
        )
    }


    // Se retorna el HTML
    return (
        <>
            {<Spinner />}
            <div className="row">
                <div className="col-md-12">
                    <div className="block block-themed">
                        <div className="block-header">
                            <h3 className="block-title">PERFIL USUARIO</h3>
                        </div>
                        <div className="block-content">

                        <div class="container">

                        <div className="row">

                            <div class="col-md-4">
                                <div class="block block-rounded text-center">
                                    <div class="block-content block-content-full bg-image">
                                        <img src="/assets/images/img_user.png" alt="Logo" className="img-fluid" />
                                    </div>
                                    <div class="block-content block-content-full block-content-sm bg-body-light">
                                        <div class="font-w600"> {getUser().nombre.toUpperCase() +" " + getUser().apellido.toUpperCase()}
                                    </div>
                                        <div class="font-size-sm text-muted">{getUser().email.toUpperCase()}</div>
                                    </div>
                                    
                                </div>
                            </div>

                            <div className="col-md-6">
                                <table class="table table-vcenter">  
                                    <tr>
                                        <td><strong>DEPENDENCIA A LA QUE PERTENECE: </strong></td>
                                        <td>{getUser().nombre_dependencia.nombre.toUpperCase()}</td>                                  
                                    </tr>
                                    <tr>
                                        <td><strong>JEFE DE LA DEPENDENCIA: </strong></td>
                                        <td>{getDatosJefeDependencia.nombre + " " + getDatosJefeDependencia.apellido}</td>                                  
                                    </tr>
                                    <tr>
                                        <td><strong>¿HABILITADO PARA REPARTO?: </strong></td>
                                        <td>{repartoHabilitado.toUpperCase()}</td>                                  
                                    </tr>
                                    <tr>
                                        <td><strong>ROLES: </strong></td>
                                        <td>{getUser().rolesSeparados.toUpperCase()}</td>                                  
                                    </tr>
                                </table>
                            </div>
                         </div> 
                         </div>  

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Perfil;