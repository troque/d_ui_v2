import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../Utils/Constants';
import { logDOM } from '@testing-library/react';
import ModalItemsEditar from './ModalItemsEditar';

function ModalItems(props) {

    // Se inicializan las constantes
    const navigate = useNavigate();
    const [show, setShow] = useState(props.data.show);
    const [getInformacion, setInformacion] = useState([]);
    const [getValidarInformacion, setValidarInformacion] = useState(false);
    const [getPermitirEditar, setPermitirEditar] = useState(props.data.permitirEditar);
    const [getModalStateEditar, setModalStateEditar] = useState({ title: "", message: "", show: false, data: {} });

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

        // Se captura el array de los items
        let arrayInformacionData = props.data.data;

        // Se setea en true
        setPermitirEditar(props.data.permitirEditar);

        // Se valida que haya informacion
        if (arrayInformacionData && arrayInformacionData.length > 0) {

            // Se setea en true
            setValidarInformacion(true);
        }

        // Se setea el array general
        setInformacion(arrayInformacionData);

    }, [props.data.show])

    // Metodo encargado de listar los items en la tabla
    const listaItems = () => {

        // Se valida que exista informacion
        if (getInformacion) {

            // Se retorna
            return (

                // Se mapea la informacion
                getInformacion.map((item, i) => {

                    // Se valida cuando es un elemento normal
                    if (item.tipoCampo != 2) {

                        // Se retorna la informacion
                        return (
                            <tr key={item.items + i} >
                                <td>
                                    <p
                                        id={"valorItem" + item.items}
                                        name={"valorItem" + item.items}
                                        style={{ border: 'none' }}
                                    >
                                        <b style={{ fontWeight: 'bold', marginBottom: '0px' }}>{item.nombreCampo} </b>
                                    </p>
                                </td>
                                <td>
                                    <p
                                        id={"valorItem" + item.items}
                                        name={"valorItem" + item.items}
                                        style={{ border: 'none', marginBottom: '0px' }}
                                    >
                                        {item.items}
                                    </p>
                                </td>
                            </tr>
                        )
                    } else {

                        // Se retorna la informacion
                        return (
                            <tr key={item.items + i} >
                                <td>
                                    <p
                                        id={"valorItem" + item.items}
                                        name={"valorItem" + item.items}
                                        style={{ border: 'none' }}
                                    >
                                        <b style={{ fontWeight: 'bold', marginBottom: '0px' }}> {item.nombreCampo.trim()} </b>
                                    </p>
                                </td>
                                <td>
                                    <p
                                        id={"valorItem" + item.items}
                                        name={"valorItem" + item.items}
                                        style={{ border: 'none', marginBottom: '0px' }}
                                    >
                                        {item.itemsSeleccionado.join(", ")}
                                    </p>
                                </td>
                            </tr>
                        )
                    }
                })
            )
        }
    }

    // Metodo encargado de editar los items
    const editarItems = () => {

        // Se setea la propiedad en false
        props.data.show = false;

        // Se setea los valores
        setModalStateEditar({ title: "EDITAR :: CAMPOS ADICIONALES", show: true, data: getInformacion, uuidActuacion: props.data.uuidActuacion });
    }

    return (
        <>
            {<ModalItemsEditar data={getModalStateEditar} />}
            <Modal show={show}>
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
                            {getValidarInformacion ?
                                <div className="block-content">
                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full table-responsive-md text-uppercase">
                                        <thead>
                                            <th colSpan="2" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                LISTADO DE ITEMS
                                            </th>
                                        </thead>
                                        <tbody>
                                            {listaItems()}
                                        </tbody>
                                    </table>
                                </div>
                                : null}
                        </div>
                    </Modal.Body>
                    {getPermitirEditar ?
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button className='btn btn-rounded btn-primary' variant="primary" onClick={editarItems}>
                                EDITAR ITEMS
                            </Button>
                        </div>
                        : null}
                </div>
            </Modal>
        </>
    );
}

export default ModalItems;