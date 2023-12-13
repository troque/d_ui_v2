import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';

function AntecedentesFile() {
    
    return (
        <>
            <Formik>
                   
                <Form>

                    <div className="col-md-12">
                        <div className="alert alert-warning alert-dismissable" role="alert">
                            <h3 className="alert-heading font-size-h4 my-2">Alerta</h3>
                            <p className="mb-0"> ETAPA:   CAPTURA Y REPARTO - FASE:   SOPORTE(S) DEL RADICADO </p>
                            <p className="mb-0"> CUALQUIER DOCUMENTO QUE REQUIERA ADJUNTAR VALIDE LA SIGUIENTE INFORMACIÓN: </p>
                            <p className="mb-0">
                                NO puede superar QUINCE (15) Mb de peso/tamaño.
                                Tipo/Formato permitido:  

                                {/*getFormatosApi ? (getFormatosApi.map((suggestion) => {
                                            if (suggestion.attributes.estado == true)
                                                return suggestion.attributes.nombre;
                                        })).join(' - ') : null*/}

                            </p>
                            <p className="mb-0">
                                EL NOMBRE DEL ARCHIVO DEBE SER MÁXIMO DE 40 CARÁCTERES
                            </p>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="form-group">
                            <label htmlFor="numFolios">No. DE FOLIOS<span className="text-danger">*</span></label>
                            <Field as="input" className="form-control" type="text" id="numFolios" name="numFolios" placeholder="No. de folios" autocomplete="off"/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="fileFolio">DOCUMENTO<span className="text-danger">*</span></label>
                            <Field as="file" className="form-control" type="text" id="fileFolio" name="fileFolio" placeholder="Seleccionar archivo" />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="block-content block-content-full text-right">
                            <button type="submit" className="btn btn-rounded btn-primary"><i className="fas fa-save"></i> Registrar</button>
                        </div>
                    </div>
                                  
                </Form>
            
            </Formik> 
        </>                 
    );
}


export default AntecedentesFile;