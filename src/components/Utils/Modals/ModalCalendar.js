import React, { useEffect, useState } from 'react';
import moment from 'moment';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import ModalInfo from './ModalInformacion';

function ModalCalendar(props) {

    // Constantes del sistema
    const [getModalState, setModalState] = useState({ title: "", message: "", show: false, button: false });

    // Metodo encargado de crear el valor del dia habil
    const crearDia = (fechaSeleccionada) => {

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se captura la fecha actual
        const fechaActual = new Date();

        // Se valida que la fecha seleccionada no sea anterior al dia de hoy
        if (fechaActual > fechaSeleccionada) {

            // Se quita el cargando
            window.showSpinner(false);

            // Se envia el mensaje
            setModalState({ title: "Dias no laborales :: Error", message: "La fecha seleccionada no puede ser anterior o igual al día actual", show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });

            // Se retorna en false
            return false;
        }

        // Se inicializa la data
        const data = {
            "data": {
                "type": "mas_dias_no_laborales",
                "attributes": {
                    "fecha": moment(props.getFecha, 'YYYY/MM/DD').format("YYYY-MM-DD"),
                    "estado": 1,
                }
            }
        }

        // Se consume la API
        GenericApi.addGeneric('dias-no-laborales', data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se envia el mensaje
                    setModalState({ title: "ADMINSITRACIÓN :: CALENDARIO", message: "LA FECHA HA SIDO ACTIVADA CORRECTAMENTE", show: true, alert: global.Constants.TIPO_ALERTA.OK, button: true });

                    // Se redirige el valor para no volver a calcularlo y dejarlo seleccionado
                    props.parentCallback(fechaSeleccionada);
                } else {

                    // Se muestra el modal de error
                    setModalState({ title: "ADMINSITRACIÓN :: CALENDARIO", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
                }
            }
        )
    }

    // Metodo encargado de modificar el estado de la fecha y colocarla inactiva
    const modificarEstado = (fecha, estado, id) => {

        // Se utiliza el cargando
        window.showSpinner(true);

        // Se inicializa la variable
        const data = {
            "data": {
                "type": "mas_dias_no_laborales",
                "attributes": {
                    "fecha": fecha,
                    "estado": estado,
                }
            }
        }

        // Se Captura la fecha actual
        let myCurrentDate = new Date();

        // Se formatea la fecha
        let myFutureDate = new Date(fecha);

        // Se captura la fecha actual
        const fechaActual = new Date();

        // Se valida que la fecha seleccionada no sea anterior al dia de hoy
        if (fechaActual > myFutureDate) {

            // Se quita el cargando
            window.showSpinner(false);

            // Se envia el mensaje
            setModalState({ title: "ADMINSITRACIÓN :: CALENDARIO", message: "LA FECHA SELECCIONADA DEBER IGUAL AL DÍA DE HOY O POSTERIOR", show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });

            // Se retorna en false
            return false;
        }

        // Se setea la fecha actual a un dia mas
        myFutureDate.setDate(myFutureDate.getDate() + 1);

        // Se consume la API
        GenericApi.updateGeneric('dias-no-laborales', id, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se envia el mensaje
                    setModalState({ title: "ADMINSITRACIÓN :: CALENDARIO", message: "LA FECHA HA SIDO INACTIVADA CORRECTAMENTE", show: true, alert: global.Constants.TIPO_ALERTA.EXITO, button: true });

                    // Se quita el cargando
                    window.showSpinner(false);

                    // Se redirige el valor para no volver a calcularlo y dejarlo seleccionado
                    props.parentCallback(myFutureDate);
                } else {

                    // Se muestra el modal de error
                    setModalState({ title: "ADMINSITRACIÓN :: CALENDARIO", message: datos.error.toString(), show: true, alert: global.Constants.TIPO_ALERTA.ERROR, button: true });
                }
            }
        )
    }

    return (
        <>
            {<Spinner />}
            {< ModalInfo data={getModalState} />}
            <div className="modal fade" id='modal-editar-fecha' tabindex="-1" role="dialog" aria-labelledby="modal-block-normal" aria-hidden="true">
                <div className="modal-dialog modal-sm" role="document" >
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">ADMINISTRACIÓN :: CAMBIO DE ESTADO</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">
                                <strong >FECHA SELECCIONADA: </strong>{moment(props.getFecha, 'YYYY/MM/DD').format("DD/MM/YYYY")}

                            </div>
                            <div className="block-content">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group text-center">
                                            {
                                                (props.getEstado == '1') ? (
                                                    <button type="button" className="btn btn-rounded btn-outline-primary" data-dismiss="modal" onClick={() => modificarEstado(props.getFecha, 0, props.getId)}>Inactivar</button>

                                                ) : (
                                                    <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal" onClick={() => crearDia(props.getFecha)}>Activar</button>
                                                )
                                            }



                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalCalendar;
