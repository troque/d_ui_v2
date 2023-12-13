import { useState } from "react";
import { Navigate } from "react-router";

function InfoExitoCierreEtapa(props) {

    const [isRedirect, setIsRedirect] = useState(false);

    const redirectToRoutes = () => {
        if (props?.success?.from) {
            return <Navigate to={props?.success?.destino} state={{ from: props?.success?.from }} />;
        }
        else {
            return <Navigate to={props?.success?.destino} />;
        }

    }

    const handleClicAceptar = () => {
        setIsRedirect(true);
    };

    return (
        <>
            {isRedirect ? redirectToRoutes() : null}
            <div className="modal fade" id="modal-block-popout-exito-cierre-etapa" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-dialog-popout" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">{props?.success?.titulo}</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">
                                <p>{props?.success?.cuerpo}</p>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-sm btn-primary" data-dismiss="modal" onClick={() => handleClicAceptar()}>{props?.success?.boton}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InfoExitoCierreEtapa;
