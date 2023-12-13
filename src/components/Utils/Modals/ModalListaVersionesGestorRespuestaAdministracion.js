import React, { useEffect, useState } from 'react';
import GenericApi from '../../Api/Services/GenericApi';

function ModalListaVersionesGestorRespuestaAdministracion(props) {

    const componenteListaHistorica = () => {

        const lista = [];
        const listaOrdenada = [];

        if (props.lista) {

            Object.entries(props.lista).forEach(([key, value]) => {
                listaOrdenada.push(value)
            });

            listaOrdenada.reverse().forEach(dato => {

                dato.sort(function (a, b) {
                    if (a.orden > b.orden) {
                        return 1;
                    }
                    if (a.orden < b.orden) {
                        return -1;
                    }
                    return 0;
                });

                lista.push(
                    <>
                        <h4 key={lista.length + "h4"}>Fecha registro: {dato[0].fecha_registro}</h4>
                        <table className='table table-bordered table-striped table-vcenter js-dataTable-full' key={lista.length + "table"}>
                            <thead>
                                <tr>
                                    <th>
                                        Orden
                                    </th>
                                    <th width='15%'>
                                        Rol
                                    </th>
                                    <th>
                                        Funcionalidad
                                    </th>
                                    <th>
                                        Grupo
                                    </th>
                                    <th>
                                        Creado por
                                    </th>
                                    <th>
                                        Único Usuario
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dato.map((funcionalidad, i) => {
                                        return <tr key={i}>
                                            <td>
                                                {funcionalidad.orden}
                                            </td>
                                            <td>
                                                {funcionalidad.nombre ? funcionalidad.nombre : global.Constants.USUARIO_GESTOR_RESPUESTA}
                                            </td>
                                            <td>
                                                {
                                                    !funcionalidad.nombre
                                                        ?
                                                        'Aprueba o Rechaza el proceso y Recibe proceso aprobado'
                                                        :
                                                        (
                                                            i == dato.length - 1
                                                                ?
                                                                'Recibe proceso aprobado'
                                                                :
                                                                (
                                                                    i == 0
                                                                        ?
                                                                        'Sube el documento en caso de ser rechazado'
                                                                        :
                                                                        'Aprueba o Rechaza el proceso'
                                                                )
                                                        )
                                                }
                                            </td>
                                            <td>
                                                {funcionalidad.grupo}
                                            </td>
                                            <td>
                                                {funcionalidad.creado_por}
                                            </td>
                                            <td>
                                                {funcionalidad.id == '0' ? 'Si' : (i == dato.length - 1 ? 'No' : (funcionalidad.unico_rol = '0' ? 'No' : 'Si'))}
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        <br></br>
                    </>
                )

            });
            return lista;
        }
    }

    return (
        <>
            <div className="modal fade" id="modal-block-popout-versiones-gestor-respuesta-administracion" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-popout" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">HISTORICO DE LISTA DE {props.nombre}</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content text-uppercase">
                                {componenteListaHistorica()}
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">{'Cerrar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalListaVersionesGestorRespuestaAdministracion;
