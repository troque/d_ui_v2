import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../Utils/Constants';
import ModalGen from './ModalGeneric';
import { useLocation } from 'react-router-dom';

function ModalItemsAgregar(props) {

    // Se inicializan las constantes
    const [show, setShow] = useState(props.data.show);
    const [getAgregar, setAgregar] = useState(props.data.agregar);
    const [getNombreLista, setNombreLista] = useState("");
    const [getNombreItemAgregado, setNombreItemAgregado] = useState("");
    const [getItemsListado, setItemsListado] = useState([]);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });

    const location = useLocation();
    const { from, getData } = location.state;

    // Metodo encargado de generar el modal
    useEffect(() => {

        // Se setea el valor para mostrar el modal
        setShow(props.data.show);

        // Se setea el nombre de la lista
        setNombreLista(props.data.message);

        // Se setea en caso que se vaya a agregar por primera vez
        setAgregar(props.data.agregar);

        // Se setea la lista en vacia
        setItemsListado([]);

    }, [props.data.show]);

    // Metodo encargado de cerrar el modal
    const handleClose = () => {

        // Se setea la propiedad en false
        props.data.show = false;

        // Se quita el modal
        setShow(false);
    };

    // Metodo encargado de agregar los campos al listado general
    const agregarItem = () => {

        // Se valida que haya un caracter
        if (!getNombreItemAgregado) {

            // Se setea el mensaje
            setModalState({ title: "Agregar Item :: Nombre", message: 'El item se encuentra vacio', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se valida que haya escrito el nombre del campo
        if (getNombreItemAgregado && getNombreItemAgregado.length < 3) {

            // Se setea el mensaje
            setModalState({ title: "Agregar Item :: Nombre", message: 'El item debe tener minimo 3 caracteres', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se valida que no contenga caractereces especiales
        if (containsSpecialChars(getNombreItemAgregado)) {

            // Se setea el mensaje
            setModalState({ title: "Agregar Item :: Nombre", message: 'Tiene caracteres invalidos', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se inicializa la variable
        let encontroRepetido = 0;

        // Se valida que no haya otro item repetido en la lista
        getItemsListado && getItemsListado.length > 0 && getItemsListado.forEach(e => {

            // Se captura los valores
            let nombreItem = e.items.forEach(i => {

                // Se valida que haya otro item repetido
                if (i == getNombreItemAgregado) {

                    // Se aumenta el valor en 1
                    encontroRepetido++;
                }
            });
        });

        // Se valida que no se haya encontrado repetido
        if (encontroRepetido > 0) {

            // Se setea el mensaje
            setModalState({ title: "Agregar item", message: 'El nombre del item ya se encuentra en la lista, por favor escriba otro diferente', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se setean los valores
        setNombreItemAgregado("");

        // Se valida que sea la primera vez del push
        if (getItemsListado && getItemsListado.length == 0) {

            // Se añade los elementos
            getItemsListado.push({ nombreCampo: getNombreLista, tipoCampo: 2, items: [getNombreItemAgregado] });
        } else if (getItemsListado && getItemsListado.length > 0) {

            // Se añade los elementos
            getItemsListado[0].items.push(getNombreItemAgregado);
        }
    }

    // Metodo encargado de guardar los valores de la lista
    const guardar = () => {

        // Se valida que no se haya encontrado repetido
        if (getItemsListado && getItemsListado.length == 0) {

            // Se setea el mensaje
            setModalState({ title: "Guardar item", message: 'Debe agregar al menos 1 item...', show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
            return false;
        }

        // Se cierra los modales
        handleClose();

        // Se valida que sea undefined es la primera vez que guarda el array
        if (getData == undefined) {

            // Se inicializa la ruta del redirect
            var redirect;

            // Se valida que haya from
            if (from != undefined && from.id) {

                // Se redeclara la variable
                redirect = '/ActuacionesAdministracion/' + from.id;
            } else if (from == undefined) {

                // Se redeclara la variable
                redirect = '/ActuacionesAdministracion/Add';
            }

            // Se setean los valores
            setModalState({
                title: "Agregar campo :: Agregado con éxito",
                message: 'Campos agregados con éxito',
                redirect: redirect,
                from: { from: from, getData: getItemsListado },
                show: true,
                alert: global.Constants.TIPO_ALERTA.EXITO
            });

        } else if (getData != undefined) {

            // Se añade
            getData.push(getItemsListado[0]);

            // Se inicializa la ruta del redirect
            var redirect;

            // Se valida que haya from
            if (from != undefined && from.id) {

                // Se redeclara la variable
                redirect = '/ActuacionesAdministracion/' + from.id;
            } else if (from == undefined) {

                // Se redeclara la variable
                redirect = '/ActuacionesAdministracion/Add';
            }

            // Se setean los valores
            setModalState({
                title: "Agregar campo :: Agregado con éxito",
                message: 'Campos agregados con éxito',
                redirect: redirect,
                from: { from: from, getData: getData },
                show: true,
                alert: global.Constants.TIPO_ALERTA.EXITO
            });
        }
    }

    // Metodo encargado de listar los items en la tabla
    const listaItems = () => {

        // Se valida que exista informacion
        if (getItemsListado) {

            // Se retorna
            return (

                // Se mapea la informacion
                getItemsListado.map((item, i) => {

                    // Se retorna la informacion
                    return (
                        <tr key={item.items + i} >
                            <div className="form-group" style={{ marginTop: '10px' }}>
                                <div className='col-md-12' style={{ display: 'flex' }}>
                                    <input
                                        as="input"
                                        type="text"
                                        className="form-control"
                                        style={{ marginRight: "15px" }}
                                        id={"valorItem" + item.items}
                                        name={"valorItem" + item.items}
                                        value={validarItems(item.items)}
                                        autocomplete="off"
                                        disabled
                                    />
                                    <button onClick={() => eliminarCampo(item)} type="button" className="btn btn btn-primary" title='Eliminar'>
                                        <i className="fa fa-fw fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </tr>
                    )
                })
            )
        }
    }

    // Metodo encargado de retorna los items separados
    const validarItems = (item) => {

        // Se valida que exista y tenga un elemento
        if (item && item.length == 0) {

            // Se retorna el primer elemento
            return item;
        } else if (item && item.length > 0) {

            // Se retorna por comas
            return item.join(", ");
        }
    }

    // Metodo encargado de eliminar el campo seleccionado
    const eliminarCampo = (campos) => {

        // Se busca el index del elemento dentro del array
        let index = getItemsListado.indexOf(campos);

        // Se valida que el elemento exista
        if (index > -1) {

            // Se elimina el elemento dentro del array
            getItemsListado.splice(index, 1);
        }

        // Se setea el mensaje
        setModalState({ title: "Item :: Eliminado con éxito", message: 'Item eliminado con éxito', show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
    }

    // Metodo encargado de validar los caracteres invalidos
    function containsSpecialChars(str) {

        // Se valida que no contenga alguno invalido
        const result = global.Constants.TEXT_AREA.CARACTERES_ESPECIALES.split('').some(specialChar => {

            // Se incluye el string
            if (str.includes(specialChar)) {

                // Se retorna true
                return true;
            }

            // Se retorna false
            return false;
        });

        // Se retorna el valor
        return result;
    }

    // Metodo encargado de validar que haya al menos un elemento en la lista
    const validarItemsListado = () => {

        // Se llama el metodo a cerrar
        handleClose();
    }

    // Metodo encargado de setear el valor del nombre del campo
    const changeNombreItemAgregado = (e) => {

        // Se setea el valor del campo
        setNombreItemAgregado(e.target.value);
    }

    return (
        <>
            {<ModalGen data={getModalState} />}
            <Modal show={show}>
                <div className="block block-themed block-transparent mb-0">
                    <Modal.Header className="block-header bg-primary-dark">
                        <Modal.Title className='block-title'> {props.data.title}</Modal.Title>
                        <Button variant="primary" onClick={validarItemsListado} className='btn-block-option'>
                            <i className="fa fa-fw fa-times"></i>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="nombreLista">NOMBRE LISTA</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombreLista"
                                        name="nombreLista"
                                        value={getNombreLista}
                                        disabled />
                                </div>
                            </div>

                            <div className="col-md-8">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control mt-4"
                                        id="nombreItem"
                                        name="nombreItem"
                                        value={getNombreItemAgregado}
                                        placeholder="Item..."
                                        onChange={changeNombreItemAgregado} />
                                </div>
                            </div>

                            <div className="col-md-4" style={{ marginTop: '-3px' }}>
                                <div className="form-group" style={{ marginTop: '27px', cursor: 'pointer' }}>
                                    <a onClick={() => agregarItem()} className="btn btn-rounded btn-primary" >
                                        AGREGAR ITEM
                                    </a>
                                </div>
                            </div>

                            {/* Se valida que exista informacion de los items */}
                            {getItemsListado && getItemsListado.length ?
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
                        <Button className='btn btn-rounded btn-primary' variant="primary" onClick={guardar}>
                            GUARDAR
                        </Button>
                    </Modal.Footer>
                </div >
            </Modal >
        </>
    );
}

export default ModalItemsAgregar;