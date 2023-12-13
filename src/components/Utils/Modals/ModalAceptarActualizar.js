import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../Utils/Constants';

function ModalAceptarActualizar(props) {

    // Se setea la constante
    const [show, setShow] = useState(props.data.show);

    // Metodo encargado de cerrar el modal y recargar la pagina
    const handleClose = () => {

        // Se actualiza la pestaña
        window.location.reload();

        // Se cierra el modal
        setShow(false);
    };

    // Se cargan los elementos
    useEffect(() => {

        // Se setea el elemento de ver modal en true
        setShow(props.data.show);
    }, [props.data.show])


    // Metodo encargado de mostrar las alertas
    const getAlerta = (id_alerta) => {

        // Se valida cuando es tipo exito
        if (id_alerta == global.Constants.TIPO_ALERTA.EXITO) {
            return "fas fa-check-circle fa-3x txt-green";
        } else if (id_alerta == global.Constants.TIPO_ALERTA.ERROR) {
            return "fas fa-exclamation-circle fa-3x txt-red";
        }
    };

    return (
        <>
            <Modal show={show} style={{ paddingBottom: '0px' }}>
                <div className="block block-themed block-transparent mb-0">
                    <Modal.Header className="block-header bg-primary-dark">
                        <Modal.Title className='block-title'> {props.data.title}</Modal.Title>
                        <Button variant="primary" className='btn-block-option'>
                            <i className="fa fa-fw fa-times"></i>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                            <div className='col-2'><i className={getAlerta(props.data.alert)}></i></div>
                            <div className='col-10'>{props.data.message.toUpperCase()}</div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button className='btn btn-rounded btn-primary' variant="primary" onClick={handleClose}>
                            ACEPTAR
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}

export default ModalAceptarActualizar;