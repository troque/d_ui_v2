import { Link } from "react-router-dom";
import React, { Component, Fragment } from "react";
import { hasAccess } from '../../components/Utils/Common';
class ListaBotones extends Component {

    constructor(props) {
        super(props);
        const { getRoutes } = this.props;
        const { from } = this.props;
        let mismoUsuarioBuscador = true;

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
            from: from,
            muestra_atras: getRoutes.muestra_atras,
            selected_id_etapa: getRoutes.selected_id_etapa,
            rutaParametrizada: rutaParametrizada,
            ocultar_agregar: getRoutes.ocultar_agregar === true ? true : false,
        };

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
                from,
                selected_id_etapa,
                rutaParametrizada,
                ocultar_agregar,
            }
        } = this;
        
        if (!from) {
            this.mismoUsuarioBuscador = true;
        }
        else{
            this.mismoUsuarioBuscador = from.mismoUsuarioBuscador 
        }

        return (
            <Fragment>

                <div className='col-md text-right ms-auto'>
                

                    <>
                        {console.log("VALOR DE MODULO "+this.state.modulo)}
                        {
                            (this.state.modulo !== undefined && hasAccess(this.state.modulo, 'Crear')) && this.mismoUsuarioBuscador
                            ?
                                (
                                    !!from?.idEtapa &&
                                    (
                                        (from?.idEtapa == global.Constants.ETAPAS.EVALUACION_PD)               || 
                                        (from?.idEtapa == global.Constants.ETAPAS.INVESTIGACION_PRELIMINAR)    || 
                                        (from?.idEtapa == global.Constants.ETAPAS.INVESTIGACION_DISCIPLINARIA) || 
                                        (from?.idEtapa == global.Constants.ETAPAS.CAUSA_JUZGAMIENTO)           || 
                                        (from?.idEtapa == global.Constants.ETAPAS.PROCESO_VERBAL)              || 
                                        (from?.idEtapa == global.Constants.ETAPAS.SEGUNDA_INSTANCIA)
                                    ) &&
                                    !!selected_id_etapa 
                                )
                                ?
                                    selected_id_etapa == from?.idEtapa && ocultar_agregar === false
                                    ?                                    
                                        <Link to={this.state.crear_registro} state={{ from: from, selected_id_etapa: selected_id_etapa, tipoActuacion: rutaParametrizada, rutaParametrizada: rutaParametrizada }}>
                                            <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus"></i> </button>
                                        </Link>
                                    : 
                                        null
                                :
                                (
                                    ocultar_agregar === false
                                    ?
                                        <Link to={this.state.crear_registro} state={{ from: from, selected_id_etapa: selected_id_etapa, tipoActuacion: rutaParametrizada, rutaParametrizada: rutaParametrizada }}>
                                            <button type="button" title='Agregar nuevo registro' className="btn btn-primary"> <i className="fas fa-plus"></i> </button>
                                        </Link>
                                    :
                                        null
                                )
                            :
                            console.log("NINGUNO ")
                        }
                        {
                            (hasAccess(this.state.modulo, 'Inactivar')) ? (
                                <button type="button" title='Listado de activos' onClick={() => this.refrescar('1')} className="btn btn-primary"> <i className="fas fa-list"></i> </button>
                            ) : null
                           
                        }

                        {
                         
                            (hasAccess(this.state.modulo, 'Inactivar')) ? (
                                <button type="button" title='Listado de inactivos' onClick={() => this.refrescar('0')} className="btn btn-danger"> <i className="fas fa-list"></i> </button>

                            ) : null
                        }

                        {
                            (this.state.muestra_atras) ? (
                                <Link to={'/RamasProceso/'} title='Regresar a ramas del proceso' state={{ from: from}}>
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