import moment from 'moment';

function ModalDatosInteresado(props) {

    const listaDetalleCambios = () => {


        if (props.getListaDetalleCambios.data != null && typeof (props.getListaDetalleCambios.data) != 'undefined') {
            return (
                props.getListaDetalleCambios.data.map((cambio, i) => {
                    return (
                        <tr key={cambio.id}>
                            <td>
                                {cambio.attributes.funcionario_registra ? cambio.attributes.funcionario_registra.nombre.toUpperCase() + ' ' + cambio.attributes.funcionario_registra.apellido.toUpperCase() : ""}
                            </td>
                            <td>
                                {cambio.attributes.dependencia_origen ? cambio.attributes.dependencia_origen.nombre.toUpperCase() : ""}
                            </td>                          
                            <td title={cambio.attributes.descripcion}>
                                {cambio.attributes.descripcion_corta.toUpperCase()}
                            </td>                               
                            <td>
                                {cambio.attributes.created_at}
                            </td>
                        </tr>
                    )
                })
            )
        }
    }

    return (
        <>
            <div className="modal fade" id="modal-block-popout-datos-interesado" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                {
                                    <h3 className="block-title">{props.proceso} :: DATOS DEL INTERESADO</h3>
                                }

                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">

                                <div className="container text-center">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-12 text-left col-w2d">
                                            <strong>TIPO DOCUMENTO:</strong> {props.datosInteresado.nombre_tipo_documento?.toUpperCase()}
                                        </div>
                                        <div className="col-md-6 col-sm-12 text-left col-w2d">
                                            <strong>NÚMERO DOCUMENTO:</strong> {props.datosInteresado.numero_documento}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>PRIMER APELLIDO:</strong> {props.datosInteresado.primer_apellido?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>SEGUNDO APELLIDO:</strong> {props.datosInteresado.segundo_apellido?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>PRIMER NOMBRE:</strong> {props.datosInteresado.primer_nombre?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>SEGUNDO NOMBRE:</strong> {props.datosInteresado.segundo_nombre?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>DEPARTAMENTO:</strong> {props.datosInteresado.nombre_departamento?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>CIUDAD:</strong> {props.datosInteresado.nombre_ciudad?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>TIPO DE INTERESADO:</strong> {props.datosInteresado.nombre_tipo_interesado?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>SUJETO PROCESAL:</strong> {props.datosInteresado.sujeto_procesal_nombre?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>ENTIDAD:</strong> {props.datosInteresado.nombre_entidad?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>TIPO DE ENTIDAD:</strong> {props.datosInteresado.nombre_tipo_entidad?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>DIRECCIÓN:</strong> {props.datosInteresado.direccion?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>GÉNERO:</strong> {props.datosInteresado.nombre_genero?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>SEXO:</strong> {props.datosInteresado.nombre_sexo?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>ORIENTACIÓN SEXUAL:</strong> {props.datosInteresado.nombre_orientacion?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>LOCALIDAD:</strong> {props.datosInteresado.nombre_localidad?.toUpperCase()}
                                        </div>
                                        <div className="col-md-3 col-sm-12 text-left col-w2d">
                                            <strong>CELULAR:</strong> {props.datosInteresado.telefono_celular}
                                        </div>
                                        <div className="col-md-4 col-sm-12 text-left col-w2d">
                                            <strong>TÉLFONO FIJO:</strong> {props.datosInteresado.telefono_fijo}
                                        </div>
                                        <div className="col-md-8 col-sm-12 text-left col-w2d">
                                            <strong>NIVEL JERÁRQUICO:</strong> {props.datosInteresado.cargo?.toUpperCase()}
                                        </div>
                                        <div className="col-md-6 col-sm-12 text-left col-w2d">
                                            { console.log("Daticos",props.datosInteresado ) }
                                            <strong>CARGO:</strong> {props.datosInteresado.cargo_descripcion?.toUpperCase()}
                                        </div>
                                        <div className="col-md-6 col-sm-12 text-left col-w2d">
                                            <strong>TARJETA PROFESIONAL:</strong> {props.datosInteresado.tarjeta_profesional}
                                        </div>
                                        <div className="col-md-6 col-sm-12 text-left col-w2d">
                                            <strong>EMAIL:</strong> {props.datosInteresado.email?.toUpperCase()}
                                        </div>
                                        <div className="col-md-6 col-sm-12 text-left col-w2d">
                                            <strong>AUTORIZA EL ENVÍO DE CORREOS: </strong> {props.datosInteresado.autorizar_envio_correo}
                                        </div>

                                    </div>
                                </div>

                                {
                                    (props.datosInteresado.observacion_estado) ? (
                                        <tr>
                                            <td><strong>OBSERVACIONES DEL CAMBIO DE ESTADO:</strong> {props.datosInteresado.observacion_estado?.toUpperCase()}</td>

                                        </tr>

                                    ) : null
                                }


                                {/* </tbody>

                                </table> */}

                            </div>

                            {
                                (props.getListaDetalleCambios.data.length > 0) ? (
                                    <div>
                                        <div className="block-content">
                                            <strong>HISTORIAL DE CAMBIOS</strong>
                                            <table className="table table-bordered table-striped table-vcenter" >
                                                <thead>
                                                    <tr>
                                                        <th>REGISTRO</th>
                                                        <th>DEPENDENCIA</th>
                                                        <th>DESCRIPCIÓN</th>
                                                        <th>FECHA</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listaDetalleCambios()}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : null
                            }

                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">{global.Constants.BOTON_NOMBRE.ACEPTAR}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalDatosInteresado;
