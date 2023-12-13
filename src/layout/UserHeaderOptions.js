import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getUser, removeUserSession } from '../components/Utils/Common';

// Metodo principal
const UserHeaderOptions = () => {

    // Se inicializan las constantes
    const navigate = useNavigate();
    const [isUserAuth, setIsUserAuth] = useState(false);
    const [userName, setUserName] = useState();
    const [dependencia, setDependencia] = useState();

    // Se carga la informacion de la clase
    useEffect(() => {

        // Se inicializan las constantes
        const userName = getUser() != null ? getUser().nombre_completo : "";
        const dependencia = getUser() != null ? (getUser().nombre_dependencia ? getUser().nombre_dependencia.nombre : "") : "";
        const validUser = getUser() != null;

        // Se setean las variables
        setIsUserAuth(validUser);
        setUserName(userName);
        setDependencia(dependencia);
    });

    const handleCerrarSesion = () => {
        removeUserSession();
        navigate("/Login");
    };

    const handlePerfil = () => {
        navigate("/Perfil");
    };

    const handleDocumentoFirmados = () => {
        navigate("/DocumentosFirmadosOPendientesDeFirma");
    };

    const handleAgregarFirma = () => {
        navigate("/AgregarFirma/");
    };

    return (
        <div>
            {isUserAuth ?
                <div className="dropdown d-inline-block">
                    <button className="btn btn-dual" id="page-header-user-dropdown" >
                        <span className="d-none d-sm-inline-block" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Opciones"><strong>DEPENDENCIA:</strong> {dependencia.toUpperCase()}</span>
                    </button>
                    <button type="button" className="btn btn-dual" id="page-header-user-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fa fa-fw fa-user"></i>
                        <span className="d-none d-sm-inline-block" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Opciones">{userName.toUpperCase()}</span>
                        <i className="fa fa-fw fa-angle-down ml-1 d-none d-sm-inline-block"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right p-0" aria-labelledby="page-header-user-dropdown">
                        <div className="p-3">
                            <a className="dropdown-item" onClick={handlePerfil} >
                                <i className=""></i> PERFIL
                            </a>
                            <a className="dropdown-item" onClick={handleDocumentoFirmados} >
                                <i className=""></i> DOCUMENTOS PENDIENTES DE FIRMA
                            </a>
                            <a className="dropdown-item" onClick={handleAgregarFirma} >
                                <i className=""></i> CONFIGURAR FIRMA
                            </a>
                            <a className="dropdown-item" onClick={handleCerrarSesion} >
                                <i className=""></i> CERRAR SESIÓN
                            </a>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    )
}

export default UserHeaderOptions
