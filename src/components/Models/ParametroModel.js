export class ParametroModel {


    constructor(radicado, 
        procesoDisciplinarioId, 
        vigencia,
        tipoEvaluacion,
        tipoEvaluacionNombre,
        cambiaColorAntecedentes, 
        cambiaColorDatosInteresado,
        cambiaColorClasificacionRadicado,
        cambiaColorEntidadInvestigado,
        cambiaColorSoporteRadicado,
        cambiaColorComunicacionInteresado,
        habilitaBotonComunicacionInteresado,
        registradoPor,
        antecedente,
        fechaRegistro,
        fechaIngreso,
        dependendencia,
        idAntecedente,
        idEtapa,
        idFase,
        cambiaColorCapturaReparto,
        idEntidadInvestigado,
        evaluacionRepartoCerrada,
        subTipoExpediente, //solo para obtener el tipo de expediente que se debe quitar en el lostado de clasificacion
        idTipoExpediente,
        idSubTipoExpediente,
        ) {
            
        this.radicado = radicado;
        this.procesoDisciplinarioId = procesoDisciplinarioId;
        this.vigencia = vigencia;
        this.cambiaColorAntecedentes = cambiaColorAntecedentes;
        this.cambiaColorDatosInteresado = cambiaColorDatosInteresado;
        this.cambiaColorClasificacionRadicado = cambiaColorClasificacionRadicado;
        this.cambiaColorEntidadInvestigado = cambiaColorEntidadInvestigado;
        this.cambiaColorSoporteRadicado = cambiaColorSoporteRadicado;
        this.cambiaColorComunicacionInteresado = cambiaColorComunicacionInteresado;
        this.habilitaBotonComunicacionInteresado = habilitaBotonComunicacionInteresado;
        this.registradoPor = registradoPor;
        this.antecedente = antecedente;
        this.fechaRegistro = fechaRegistro;
        this.fechaIngreso = fechaIngreso;
        this.dependendencia = dependendencia;
        this.idAntecedente = idAntecedente;
        this.idEtapa = idEtapa;
        this.idFase = idFase;
        this.cambiaColorCapturaReparto = cambiaColorCapturaReparto;
        this.idEntidadInvestigado = idEntidadInvestigado;
        this.evaluacionRepartoCerrada = evaluacionRepartoCerrada;
        this.subTipoExpediente = subTipoExpediente;
        this.tipoEvaluacion = tipoEvaluacion;
        this.tipoEvaluacionNombre = tipoEvaluacionNombre;
        this.idTipoExpediente = idTipoExpediente;
        this.idSubTipoExpediente = idSubTipoExpediente;
    }


}

export default ParametroModel;