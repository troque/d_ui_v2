function InfoExitoApi() {

    return (
        <>
            <div className="modal fade" id="modal-block-popout-exito" tabIndex="-1" role="dialog" aria-labelledby="modal-block-popout" aria-hidden="true">
                <div className="modal-dialog modal-dialog-popout" role="document">
                    <div className="modal-content">
                        <div className="block block-themed block-transparent mb-0">
                            <div className="block-header bg-primary-dark">
                                <h3 className="block-title">INFORMACIÓN ACTUALIZADA</h3>
                                <div className="block-options">
                                    <button type="button" className="btn-block-option" data-dismiss="modal" aria-label="Close">
                                        <i className="fa fa-fw fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="block-content">
                                <p>LA INFORMACIÓN FUE ACTUALIZADA</p>
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

export default InfoExitoApi;
