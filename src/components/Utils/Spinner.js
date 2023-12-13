function Spinner() {

    // Se incializa el style del modal
    const style1 = {
        "display": "flex"
    }

    // Se inicializa el mensaje del modal
    const mensajeModal = "Cargando la información, espera un momento...";

    // Se inicializa el mensaje de cargando del modal
    const mensajeCargando = "Cargando...";

    return (
        <div className="modal" id="modal-block-spinner" tabIndex="-1" role="dialog" aria-labelledby="modal-block-spinner" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="block block-themed block-transparent mb-0">
                        <div className="block-content">
                            <div className="row">
                                <span className="sr-only">{mensajeCargando.toUpperCase()}</span>
                            </div>
                            <div className="row-w2d">
                                <h4 className="text-center">{mensajeModal.toUpperCase()}</h4>
                            </div>
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">{mensajeCargando.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

//Cargando la información, espera un momento...

export default Spinner;
