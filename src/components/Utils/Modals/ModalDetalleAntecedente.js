function ModalDetalleAntecedente(props) {

    return (
        <>
            <div className="modal fade" id="#modal-block-popout-detalle-antecedente" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">Detalle del antecedente</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                    <tbody>
                                        <tr>
                                            <td><strong>Descripción:</strong>{props.antecedente.id}</td>
                                        </tr>
                                    </tbody>

                                </table>

                            </div>
                            <div className="block-content block-content-full text-right bg-light">
                                <button type="button" className="btn btn-rounded btn-primary" data-dismiss="modal">ACEPTAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalDetalleAntecedente;
