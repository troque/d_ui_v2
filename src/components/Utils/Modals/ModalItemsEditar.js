import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../Utils/Constants';
import ModalAceptarActualizar from './ModalAceptarActualizar';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import GenericApi from '../../Api/Services/GenericApi';

function ModalItemsEditar(props) {

    // Se inicializan las constantes
    const [show, setShow] = useState(props.data.show);
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getCamposAdicionales, setCamposAdicionales] = useState([]);
    const [getMaxDate, setMaxDate] = useState();
    const [getUuidActuacion, setUuidActuacion] = useState(props.data.uuidActuacion);

    // Metodo encargado de generar el modal
    useEffect(() => {

        // Se setea el maximo de fecha
        setMaxDate(new Date().toISOString().split("T")[0]);

        // Se setea el valor para mostrar el modal
        setShow(props.data.show);

        // Se captura el array de los items
        let arrayInformacionData = props.data.data;

        // Se setea el uuid de la actuacion a modificar
        setUuidActuacion(props.data.uuidActuacion);

        // Se setea la lista
        setCamposAdicionales(arrayInformacionData);

    }, [props.data.show]);

    // Metodo encargado de cerrar el modal
    const handleClose = () => {

        // Se setea la propiedad en false
        props.data.show = false;

        // Se quita el modal
        setShow(false);
    };

    // Metodo encargado de guardar los valores de la lista
    const guardar = () => {

        // Se quita el cargando
        window.showSpinner(true);

        // Se cierra el modal
        handleClose();

        let data = {
            "data": {
                "type": "mas_actuaciones",
                "attributes": {
                    "campos_finales": getCamposAdicionales
                }
            }
        }

        // Se inicializa la API
        GenericApi.getByDataGeneric('actuaciones/update-campos-finales/' + getUuidActuacion, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se quita el cargando
                window.showSpinner(false);

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea y muestra la modal
                    setModalState({ title: "EDITAR :: CAMPOS ADICIONALES", message: "ACTUALIZADO CON ÉXITO", show: true, alert: global.Constants.TIPO_ALERTA.EXITO });
                } else {

                    // Se setea y muestra la modal
                    setModalState({ title: "EDITAR :: CAMPOS ADICIONALES", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR });
                }
            }
        )
    }

    // Metodo encargado de cargar los valores de los campos
    const cargarValoresCampos = (campo) => {

        // Se inicializa la variable de campos
        const campoParametro = campo;

        // Se capturan la informacion del campo
        const tipoCampo = campoParametro.tipoCampo;
        const nombreCampo = campoParametro.nombreCampo;
        const itemCampo = campoParametro.items;

        // Se valida cuando el tipo campo es un listado
        if (tipoCampo == 2) {

            // Se declara un array
            let array = [];
            let arrayUnicos = [];

            // Se capturan los items ya seleccionados
            const itemSeleccionados = campoParametro.itemsSeleccionado;

            // Se captura la diferencia entre los dos arreglos
            let itemDiferente = diferenciaItems(itemCampo, itemSeleccionados);

            // Se recorre el array de items seleccionados
            itemSeleccionados.forEach((e, i) => {

                // Se añade el elemento en la lista
                array.push({ nombre: e, checked: true });
            });

            // Se combinar los arrays
            let arrayFinal = array.concat(itemDiferente);

            // Se retorna el mapeo
            return (

                // Se recorre los elementos
                arrayFinal.map((x, i) => {

                    // se captura el nombre del item
                    let item = x.nombre;
                    let checked = x.checked;

                    // Se retorna el HTML
                    return (
                        <div className="col-md-12 mt-1 ml-2 mb-1" key={item}>
                            <input type="checkbox"
                                className="form-check-input"
                                id={item}
                                name={item}
                                value={item}
                                onChange={(e) => changeCheckInput(e, nombreCampo)}
                                defaultChecked={checked} /> {item}
                        </div>
                    )
                })
            )
        } else if (tipoCampo == 1) {

            // Se retorna el html del tipo fecha 
            return (
                <div className="custom-control custom-switch custom-control-lg mt-2 mb-2">
                    <input
                        type="date"
                        className="form-control"
                        id={nombreCampo}
                        name={nombreCampo}
                        onChange={changeDateInput}
                        max={getMaxDate}
                        defaultValue={returnFormatDate(itemCampo, nombreCampo)}
                    />
                </div>
            )
        } else if (tipoCampo == 0) {

            // Se retorna el html del tipo texto
            return (
                <div className="custom-control custom-switch custom-control-lg mt-2 mb-2">
                    <input type="text"
                        className="form-control"
                        id={nombreCampo}
                        name={nombreCampo}
                        placeholder={itemCampo}
                        defaultValue={itemCampo}
                        onChange={e => changeTextInput(e, campo)} />
                </div>
            )
        }
    }

    // Metodo encargado de sacar las diferencias de 2 arreglos
    const diferenciaItems = (arr1, arr2) => {

        // Se inicializa la variable
        let arreglo = [];

        // Se recorre para validar
        arr1.filter(elemento => {

            // Se valida cuando captura la diferencia
            if (arr2.indexOf(elemento) == -1) {

                arreglo.push({ nombre: elemento, checked: false })
            }
        });

        // Se retorna el arreglo
        return arreglo;
    }

    // Metodo encargado de formatear la fecha
    const returnFormatDate = (fecha, nombreCampo) => {

        // Se extrae la fecha parte por parte
        let año = fecha[0].slice(6, 10);
        let mes = fecha[0].slice(3, 5);
        let dia = fecha[0].slice(0, 2);

        // Se concadena la fecha para convertirla a string
        let newDate = año + "-" + mes + "-" + dia;

        // Se retorna
        return newDate;
    }

    // Metodo encargado de setear el valor al mismo input
    const changeTextInput = (e, arrayDatos) => {

        // Se setea temporalmente
        let elementoHtml = document.getElementById(e.target.name);
        let nombreElemento = e.target.name;

        // Se captura el valor escrito
        let valor = e.target.value;

        // El elemento existe
        if (elementoHtml) {

            // Se setea el nuevo valor
            elementoHtml.title = valor;

            // Se asigna el item dentro del array para enviarlo
            getCamposAdicionales.forEach(e => {

                // Se captura la key
                let key = e.nombreCampo;

                // Se valida que la key sea igual al elemento modificado
                if (key == nombreElemento) {

                    // Se añade el item
                    e.items = [valor];
                }
            })
        }
    }

    // Metodo encargado de cambiar el valor de la fecha
    const changeDateInput = (e) => {

        // Se formatea
        const newDate = moment(e.target.value).format('DD/MM/YYYY');

        // Se captura el nombre del elemento
        let nombreElemento = e.target.name;

        // Se asigna el item dentro del array para enviarlo
        getCamposAdicionales.forEach(e => {

            // Se captura la key
            let key = e.nombreCampo;

            // Se valida que la key sea igual al elemento modificado
            if (key == nombreElemento) {

                // Se añade el item
                e.items = [newDate];
            }
        })
    };

    // Metodo encargado de cambiar el valor del input
    const changeCheckInput = (e, value) => {

        // Se captura el elemento html
        let nombreElemento = value;

        // Se captura el elemento del check true o false
        let checkeado = e.target.checked;

        // Se captura el valor chequeado html
        let valorCheck = e.target.value;

        // Se valida cuando esta chequeado
        if (checkeado == true) {

            // Se asigna el item dentro del array para enviarlo
            getCamposAdicionales.forEach(e => {

                // Se captura la key
                let key = e.nombreCampo;

                // Se valida que la key sea igual al elemento modificado
                if (key == nombreElemento) {

                    // Se valida la primera vez
                    if (!e.itemsSeleccionado) {

                        // Se añade el item
                        e.itemsSeleccionado = [valorCheck];
                    } else {

                        // Se añade el item al array
                        e.itemsSeleccionado.push(valorCheck);
                    }
                }
            })
        } else if (checkeado == false) {

            // Se asigna el item dentro del array para quitarlo
            getCamposAdicionales.forEach(e => {

                // Se captura la key
                let key = e.nombreCampo;
                let items = e.itemsSeleccionado ? e.itemsSeleccionado : [];

                // Continua el proceso para quitarlo del array
                if (items.length > 0 && (key == nombreElemento)) {

                    // Se busca la posicion del elemento
                    var index = items.indexOf(valorCheck);

                    // Se quita el elemento
                    items.splice(index, 1);
                }
            })
        }
    }

    // Metodo encargado de generar las columnas de los parametros de la plantilla
    const columnsCampos = [
        {
            name: 'CAMPO',
            cell: campo =>
                <div>
                    <strong>{campo.nombreCampo ? campo.nombreCampo : ""}</strong>
                </div>,
        },
        {
            name: 'ITEMS',
            cell: campo =>
                <div className='row'>
                    <div className='col'>
                        {cargarValoresCampos(campo)}
                    </div>
                </div>
        },
    ];

    // Metodo encargado de validar que haya al menos un elemento en la lista
    const cerrarVentana = () => {

        // Se llama el metodo a cerrar
        handleClose();
    }

    return (
        <>
            {<ModalAceptarActualizar data={getModalState} />}
            <Modal show={show} style={{ marginLeft: '-11px', marginTop: '55px' }}>
                <Modal.Header className="block-header bg-primary-dark">
                    <Modal.Title className='block-title'> {props.data.title}</Modal.Title>
                    <Button variant="primary" onClick={cerrarVentana} className='btn-block-option'>
                        <i className="fa fa-fw fa-times"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className='col-md-12 mt-2 mb-2'>
                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                            columns={columnsCampos}
                            data={getCamposAdicionales}
                            noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                            striped
                        />
                    </div>
                </Modal.Body>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button className='btn btn-rounded btn-primary' variant="primary" onClick={guardar}>
                        GUARDAR
                    </Button>
                </div>
            </Modal >
        </>
    );
}

export default ModalItemsEditar;