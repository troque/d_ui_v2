import { Link } from "react-router-dom";
import React, { Component, Fragment } from "react";
import { hasAccess } from '../../components/Utils/Common';
class ListaBotones extends Component {

    constructor(props) {
        super(props);

        const { getRoutes } = this.props;
        const { from } = this.props;
        const { disable } = this.props;
        const { mostrarBotonActivarInactivar } = this.props;

        let { mostrarBotonAgregar } = true;
        if (this.props.hasOwnProperty('mostrarBotonAgregar')) {
            mostrarBotonAgregar = this.props.mostrarBotonAgregar;
        } else {
            mostrarBotonAgregar = true;
        }

        let { rutaParametrizada } = "Actuación";
        if (this.props.hasOwnProperty('rutaParametrizada')) {
            rutaParametrizada = this.props.rutaParametrizada;
        } else {
            rutaParametrizada = "Comisorio";
        }

        this.state = {
            id_etapa: getRoutes.id_etapa,
            id_fase: getRoutes.id_fase,
            crear_registro: getRoutes.crear_registro,
            consultar_registros: getRoutes.consultar_registros,
            adjuntar_documento: getRoutes.adjuntar_documento,
            repositorio_documentos: getRoutes.repositorio_documentos,
            modulo: getRoutes.modulo,
            funcionalidad_crear: getRoutes.funcionalidad_crear,
            funcionalidad_consultar: getRoutes.funcionalidad_consultar,
            from: from,
            muestra_atras: getRoutes.muestra_atras,
            selected_id_etapa: getRoutes.selected_id_etapa,
            mostrarBotonAgregar: mostrarBotonAgregar,
            disable: disable,
            mostrarBotonActivarInactivar : mostrarBotonActivarInactivar,
            //muestra_inactivos: getRoutes.muestra_inactivos,
            //muestra_activos: getRoutes.muestra_activos != undefined ? getRoutes.muestra_activos : true,
            muestra_agregar: getRoutes.muestra_agregar,
            rutaParametrizada: rutaParametrizada,
        };
    }

    /**
     * Se valida que la única fase que no puede agregar un registro nuevo es clasificacion del rádicado una vez la etapa se haya cerrado.
     */
    boton_add = (id_etapa, id_fase) => {


        // console.log("VALOR DE ID_ETAPA: " + id_etapa);
        // console.log("VALOR DE ID_FASE: " + id_fase);
        // console.log("MOSTRAR AGREGAR: " + this.state.muestra_agregar);


        if (id_etapa >= global.Constants.ETAPAS.EVALUACION_PD) {
            return true;
        } else {
            if (hasAccess(this.state.modulo, this.state.funcionalidad_crear)) {

                if (id_etapa != global.Constants.ETAPAS.CAPTURA_REPARTO && id_fase == global.Constants.FASES.CLASIFICACION) {
                    return false;
                }

                else {
                    return true;
                }
            }
        }


    }


    refrescar = (estado) => {
        try {
            this.props.parentCallback(estado);
        } catch (error) {
            console.error("Error " + error);
        }
    };

    render() {

        const {
            state: {
                crear_registro,
                consultar_registros,
                adjuntar_documento,
                from,
                selected_id_etapa,
                rutaParametrizada,
                mostrarBotonAgregar
            }
        } = this;

        return (
            <Fragment>

                <div className='col-md text-right ms-auto'>

                    <>
                        {/*
                           (
                                (this.state.mostrarBotonAgregar) ? (
                                    (this.state.disable != true) ? (
                                        <Link to={this.state.crear_registro} state={{ from: from, selected_id_etapa: selected_id_etapa, tipoActuacion: "Actuación" }}>
                                            <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus"></i> </button>
                                        </Link>
                                    ) : null
                                ) : null


                            ) : null*/
                        }

                        {
                            (this.state.mostrarBotonActivarInactivar && this.state.disable != true) ? (
                                <Link to={this.state.crear_registro} state={{ from: from, selected_id_etapa: selected_id_etapa, tipoActuacion: rutaParametrizada, rutaParametrizada: rutaParametrizada }}>
                                    <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus"></i> </button>
                                </Link>
                            ) : null
                        }
                        
                        {
                            (this.state.mostrarBotonActivarInactivar ? (
                                (hasAccess(this.state.modulo, this.state.funcionalidad_consultar)) ? (
                                    <button type="button" title='Listado de activos' onClick={() => this.refrescar('1')} className="btn btn-primary"> <i className="fas fa-list"></i> </button>
                                ) : null
                            ) : null)
                        }

                        {
                            (this.state.mostrarBotonActivarInactivar ? (
                                (hasAccess(this.state.modulo, this.state.funcionalidad_consultar, this.state.muestra_inactivos)) ? (
                                    <button type="button" title='Listado de inactivos' onClick={() => this.refrescar('0')} className="btn btn-danger"> <i className="fas fa-list"></i> </button>

                                ) : null
                            ) : null)
                        }

                        {
                            (this.state.muestra_atras) ? (
                                <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from, disable: this.state.disable }}>
                                    <button type="button" className="btn btn-primary"><i className="fas fa-backward"></i> </button>
                                </Link>
                            ) : null
                        }

                    </>
                </div>
            </Fragment>
        );
    }
}

export default ListaBotones;