import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../Utils/Constants';
import DocumentoSiriusApi from '../../Api/Services/DocumentoSiriusApi';

function ModalListaVersionesGestorRespuesta(props) {

    const location = useLocation();
    const { from } = location.state;

    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let vigencia = from.vigencia;
    
    const [errorApi, setErrorApi] = useState('');

    const handleClicArchivo = (documento_sirius) => {
        try {
            window.showSpinner(true);
            let nombre_documento = documento_sirius.nombre_archivo;
            let extension = documento_sirius.extension;
            let es_compulsa = false;

            const data = {
                "data": {
                    "type": "documeto_sirius",
                    "attributes": {
                        "radicado": radicado,
                        "vigencia": vigencia,
                        "id_documento_sirius": documento_sirius.uuid,
                        "extension": extension,
                        "es_compulsa": es_compulsa
                    }
                }    
            }

            DocumentoSiriusApi.getDocumento(data).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, nombre_documento, extension);
                    }
                    else {
                        setErrorApi(datos.error.toString())
                        window.showModal(1)
                    }
                    window.showSpinner(false);
                }
            )
        } catch (error) {
            console.error(error);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    return (
        <>
            <div className="modal fade" id="modal-block-popout-versiones-gestor-respuesta" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-popout" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title"> {props?.nombreProceso} :: LISTA DE VERSIONES DE CONCEPTO DE DOCUMENTO</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">
                                <table className='table table-bordered table-striped table-vcenter js-dataTable-full'>
                                    <thead>
                                        <tr>
                                            <th>
                                                NO
                                            </th>
                                            <th>
                                                VERSIÓN
                                            </th>
                                            <th>
                                                CREADO POR
                                            </th>
                                            <th>
                                                FECHA
                                            </th>
                                            <th>
                                                CONCEPTO
                                            </th>
                                            <th>
                                                OBSERVACIONES
                                            </th>
                                            <th>
                                                DOCUMENTOS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            props.object?.data.map((respuesta, i) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td>
                                                                { i + 1 }
                                                            </td>
                                                            <td>
                                                                { respuesta.attributes.version.toUpperCase() }
                                                            </td>
                                                            <td>
                                                                { respuesta.attributes.usuario.toUpperCase() }
                                                            </td>
                                                            <td>
                                                                { respuesta.attributes.fecha }
                                                            </td>
                                                            <td>
                                                                {
                                                                    props.object?.data.length > 1
                                                                    ?
                                                                    (
                                                                        i == (props.object?.data.length - 1)
                                                                        ?
                                                                            ' PENDIENTE DE APROBACIÓN'
                                                                        :
                                                                            (
                                                                                respuesta.attributes.nuevo_documento == "0"
                                                                                ? 
                                                                                    (
                                                                                        respuesta.attributes.aprobado == "0" ? ' RECHAZADO' : ' APROBADO'                                                                    
                                                                                    )
                                                                                :
                                                                                    ' PENDIENTE DE APROBACIÓN'
                                                                            )
                                                                    )
                                                                    :
                                                                    (
                                                                        respuesta.attributes.proceso_finalizado == true
                                                                        ?
                                                                        ' APROBADO'
                                                                        : 
                                                                        ' PENDIENTE DE APROBACIÓN'
                                                                    )
                                                                    
                                                                }
                                                            </td>
                                                            <td>
                                                                { respuesta.attributes.descripcion.toUpperCase() }
                                                            </td>
                                                            <td style={{ padding: '0px' }}>
                                                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                    <tbody>
                                                                        {
                                                                            respuesta.attributes.documento_sirius.map((documento, i) => {
                                                                                // Se retorna cada columna con su información
                                                                                return (
                                                                                    <tr key={documento.uuid}>
                                                                                        <td>{ i + 1 }</td>                         
                                                                                        <td className='text-center'>
                                                                                            <button type='button' title={documento.nombre_archivo.toUpperCase()} className='btn btn-primary' onClick={() => handleClicArchivo(documento)}><i className="fas fa-download"></i></button>
                                                                                        </td>                         
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">{ 'ACEPTAR' }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalListaVersionesGestorRespuesta;
