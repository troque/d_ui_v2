import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../Utils/Constants';

function ModalGen(props) {
    
    const navigate = useNavigate();
    const [show, setShow] = useState(props.data.show);


    const handleClose = () => {
        if (props.data.redirect != undefined)
            navigate(props.data.redirect, { state: props.data.from });
        props.data.show = false;
        setShow(false);
    };

    useEffect(() => {
        setShow(props.data.show);
    }, [props.data.show])


    const getAlerta = (id_alerta) => {
        if(id_alerta == global.Constants.TIPO_ALERTA.EXITO)
            return "fas fa-check-circle fa-3x txt-green"
        else if(id_alerta == global.Constants.TIPO_ALERTA.ERROR)
            return "fas fa-exclamation-circle fa-3x txt-red"
        else if(id_alerta == global.Constants.TIPO_ALERTA.ADVERTENCIA)
            return "fas fa-exclamation-triangle fa-3x txt-yellow"
    };



    return ( 
        <>
            <Modal show={show} onHide={handleClose}>
                <div className="block block-themed block-transparent mb-0">
                    <Modal.Header className="block-header bg-primary-dark">
                        <Modal.Title className='block-title'> {props.data.title.toUpperCase()}</Modal.Title>
                        <Button variant="primary" onClick={handleClose} className='btn-block-option'>
                            <i className="fa fa-fw fa-times"></i>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row text-uppercase'>
                            <div className='col-2'><i className={getAlerta(props.data.alert)}></i></div>
                            <div className='col-10'>{Array.isArray(props.data.message) ? 
                            (
                                props.data.message.map((dato, index) => (
                                    <React.Fragment key={index}>
                                        <div key={index}>{dato}</div>
                                    </React.Fragment>
                                  ))
                            ) : props.data.message}</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn btn-rounded btn-primary' variant="primary" onClick={handleClose}>
                            {global.Constants.BOTON_NOMBRE.ACEPTAR}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}

export default ModalGen;