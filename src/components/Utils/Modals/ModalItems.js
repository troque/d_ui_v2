import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../Utils/Constants';
import { logDOM } from '@testing-library/react';

function ModalItems(props) {

    // Se inicializan las constantes
    const navigate = useNavigate();
    const [show, setShow] = useState(props.data.show);
    const [getData, setData] = useState(props.data.data);
    const [getInformacion, setInformacion] = useState([]);
    const [getItem, setItem] = useState("");

    // Metodo encargado de cerrar el modal
    const handleClose = () => {

        // Se valida que sea diferente de indefinido
        if (props.data.redirect != undefined)

            // Se redirecciona a la url
            navigate(props.data.redirect, { state: props.data.from });

        // Se setea la propiedad en false
        props.data.show = false;

        // Se quita el modal
        setShow(false);
    };


    // Metodo encargado de generar el modal
    useEffect(() => {

        // Se setea el valor para mostrar el modal
        setShow(props.data.show);

        // Se setea la data
        setData(props.data.data);

        // Se captura el array de los items
        let array = props.data.data.items ? props.data.data.items.split(",") : null;

        // Se setea el array general
        setInformacion(array);

    }, [props.data.show])

    // Metodo encargado de setear el valor del item al mismo
    const changeValueItem = (propsItems) => {

        // Se captura el id del elemento
        let idElemento = propsItems.target.id;

        // Se setea el valor escrito al id 
        document.getElementById(idElemento).value = propsItems.target.value;
    }

    // Metodo encargado de listar los items en la tabla
    const listaItems = () => {

        // Se valida que exista informacion
        if (getInformacion) {

            // Se retorna
            return (

                // Se mapea la informacion
                getInformacion.map((item, i) => {

                    // Se retorna la informacion
                    return (
                        <tr key={item.trim() + i} >
                            <div className="form-group" style={{ marginTop: '10px' }}>
                                <input
                                    as="input"
                                    type="text"
                                    className="form-control"
                                    style={{ border: "none" }}
                                    id={"valorItem" + item.trim()}
                                    name={"valorItem" + item.trim()}
                                    value={item.trim()}
                                    onChange={changeValueItem}
                                    autocomplete="off"
                                />
                            </div>
                        </tr>
                    )
                })
            )
        }
    }

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
                            {/* Se valida que exista informacion de los items */}
                            {getInformacion ?
                                <div className="block-content">
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full table-responsive-md text-uppercase">
                                        <thead>
                                            <tr style={{ textAlign: 'center' }}>
                                                <th>LISTADO DE ITEMS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaItems()}
                                        </tbody>
                                    </table>
                                </div>
                                : null}
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ justifyContent: 'center' }}>
                        <Button className='btn btn-rounded btn-primary' variant="primary" onClick={handleClose}>
                            ACTUALIZAR
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
}

export default ModalItems;