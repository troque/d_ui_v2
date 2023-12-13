import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../Utils/Constants';

function ModalInfo(props) {

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
        if (id_alerta == global.Constants.TIPO_ALERTA.EXITO)
            return "fas fa-check-circle fa-3x txt-green"
        else if (id_alerta == global.Constants.TIPO_ALERTA.ERROR)
            return "fas fa-exclamation-circle fa-3x txt-red"
    };



    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <div className="block block-themed block-transparent mb-0">
                    <Modal.Header className="block-header bg-primary-dark">
                        <Modal.Title className='block-title'> {props.data.title}</Modal.Title>
                        <Button variant="primary" onClick={handleClose} className='btn-block-option'>
                            <i className="fa fa-fw fa-times"></i>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                            <div className='col-12' style={{ textAlign: 'justify' }}>
                                {props.data.message}
                            </div>
                        </div>
                    </Modal.Body>
                    {props.data.button ?
                        <Modal.Body style={{ display: "flex", justifyContent: 'center' }}>
                            <Button className='btn btn-rounded btn-primary' variant="primary" onClick={handleClose}>
                                ACEPTAR
                            </Button>
                        </Modal.Body>
                        : null}
                </div>
            </Modal>
        </>
    );
}

export default ModalInfo;