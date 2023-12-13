
export default global.Constants = {
    ESTADOS: {
        ACTIVO: '1',
        INACTIVO: '0'
    },

    //MIS PENDIENTES
    RANGOS: {
        TODOS: '-1'
    },

    SEMAFORIZACION_FASES: {
        GREEN: 'far fa-dot-circle txt-green',
        RED: 'far fa-dot-circle txt-red',
        ORANGE: 'far fa-dot-circle txt-orange'
    },

    BOTONES_CARPETAS: {
        PRIMARY: 'btn btn-sm btn-primary mr-1 mb-3',
        SUCCESS: 'btn btn-sm btn-success mr-1 mb-3',
    },

    COLOR_FASE: {
        COMPLETA: '#8BCD50',
    },

    //PARA LOS TEXT_AREA
    TEXT_AREA: {
        //CARACTERES_ESPECIALES: `/[!@#$%^&*(),.?":{}|<>~]/`,
        //CARACTERES_ESPECIALES: `^[]{}'|<>~`,
        CARACTERES_ESPECIALES: '',
        //CARACTERES_ESPECIALES: `\`!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?~`,
        CANTIDAD_MINIMA_DESCRIPCION: 100, //Cantidad mínima que se muestra en las descripciones
        //CARACTERES_ESPECIALES_TILDES: `/^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.\s]+$/`
        CARACTERES_ESPECIALES_TILDES: ''
    },

    //CARACTERES ESECIALES
    CARACTERES_ESPECIALES: {
        formatOnlyNumbers: /^[0-9]+$/,
        formatOnlyLetters: /^[A-Za-z\s]+$/,
        // formatOnlyLettersWhitAccent: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*$/, 
        formatOnlyLettersWhitAccent: /^[\s\S]*$/,
        //formatOnlyLettersWhitAccentGuion: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-]*$/,
        formatOnlyLettersWhitAccentGuion: /^[\s\S]*$/,
        formatOnlyLettersOrnUmbers: /^[0-9a-zA-Z\s]+$/,
        formatWithOutSpecials: /^[A-Za-z0-9#-\s]+$/,
        formatDateDMYWithGuiones: /^(0[1-9]|[1-2]\d|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/,
        formatDateYMDWithGuiones: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/,
    },

    //ETAPAS
    ETAPAS: {
        NINGUNA: 0, // SE ASIGNO PARA LA PARTE ADMISNITRATIVA - QUE CIERTAS FUNCIUONALIDADES SE MOSTRARAN INDIFERNTES A LA ETAPA EN LA QUE ESTÁ
        CAPTURA_REPARTO: 1,
        EVALUACION: 2,
        EVALUACION_PD: 3,
        INVESTIGACION_PRELIMINAR: 4,
        INVESTIGACION_DISCIPLINARIA: 5,
        CAUSA_JUZGAMIENTO: 6,
        PROCESO_VERBAL: 7,
        SEGUNDA_INSTANCIA: 8,
        INICIO_PROCESO_DISCIPLINARIO: 9,
    },

    //FASES
    FASES: {
        LISTA_PARA_CIERRE_CAPTURA_REPARTO: -1,
        LISTA_PARA_CIERRE_EVALUACION: -2,
        ANTECEDENTES: 1,
        INTERESADO: 2,
        CLASIFICACION: 3,
        ENTIDAD_INVESTIGADO: 4,
        SOPORTE_RADICADO: 5,
        VALIDAR_CLASIFICACION: 10,
        EVALUACION: 11,
        REMISION_QUEJA: 6,
        GESTOR_RESPUESTA: 9,
        COMUNICACION_INTERESADO: 12,
        DOCUMENTO_CIERRE: 8,
        CIERRE_TOTAL: 13,
        CIERRE_CAPTURA_REPARTO: 14,
        CIERRE_EVALUACION: 15,
        ACTUACIONES_EVALUACION_PD: 16,
        REQUERIMIENTO_JUZGADO: 17,
        INFORME_CIERRE: 18,
        REGISTRO_SEGUIMIENTO: 19,
        IMPEDIMENTOS_COMISORIOS: 20,
    },

    TIPO_INGRESO: {
        SIRIUS: 1,
        DESGLOSE: 2,
        SINPROC: 3,
        PODER_PREFERENTE: 4
    },

    //TABLAS
    DATA_TABLE: {
        SIN_DATOS_TABLE: 'Sin datos',
        FILTRO_POR_PAGINA: 'Filas por página',
        PAGINATION_PER_PAGE: 10
    },

    TIPO_QUEJA: {
        EXTERNA: 1,
        INTERNA: 2
    },

    TIPOS_EXPEDIENTES: {
        DERECHO_PETICION: '1',
        PODER_REFERENTE: '2',
        QUEJA: '3',
        TUTELA: '4',
        PROCESO_DISCIPLINARIO: '5'
    },

    DERECHOS_PETICION: {
        COPIAS: '1',
        GENERAL: '2',
        ALERTA: '3'
    },

    TERMINOS_RESPUESTA: {
        DIAS: '1',
        HORAS: '2'
    },

    TIPO_DOCUMENTO: {
        NO_INFORMA: '4'
    },

    ACCESO_DEPENDENCIA: {
        REMITIR_PROCESO: '1',
        CREACION_PROCESO: '2',
        REMISION_QUEJA_INCORPORACION: '3',
        CREAR_INTERESADO: '4',
        CREAR_USUARIO: '5',
        MODIFICAR_USUARIO: '6',
        REMISION_QUEJA_COMISORIO_EJE: '7',
        REMISION_QUEJA_REMISORIO_INTERNO: '8',
        QUEJA_INTERNA: '9'
    },

    SUJETO_PROCESAL: {
        INTERESADO: '1',
        INTERESADO_ACOSO_LABORAL: '2',
        DISCIPLINADO: '3',
        APODERADO: '4',
        DEFENSOR_OFICIO: '5',
        MINISTERIO_PUBLICO: '6',
        VICTIMAS_GRAVES: '7'
    },

    ENTIDAD: {
        PUBLICA: '1',
        PRIVADA: '2'
    },

    TIPO_INTERESADO: {
        PERSONA_NATURAL: '1',
        ENTIDAD: '2'
    },

    //INTERESADO
    ENTIDADES: {
        PERSONARIA: '67'
    },

    TAMANO_CAMPOS: {
        CELULAR: 10
    },

    TIPO_ALERTA: {
        EXITO: 1,
        ERROR: 2,
        ADVERTENCIA: 3,
    },

    TIPO_RESPUESTA: {
        SI: '1',
        NO: '2'
    },

    //ESTADOS_EVALUACION
    ESTADOS_EVALUACION: {
        REGISTRADO: '1',
        APROBADO_POR_JEFE: '2',
        RECHAZADO_POR_JEFE: '3',
    },

    COLOR: {
        RESALTAR: '#8BCD50'
    },


    TIPO_CLASIFICACION: {
        CLASIFICACION: '1',
        VALIDAR_CLASIFICACION: '2',
        RECLASIFICACION: '3'
    },

    CIUDAD: {
        BOGOTA: 149
    },

    TIPOS_EVALUACION: {
        COMISORIO_EJE: '1',
        DEVOLUCION_ENTIDAD: '2',
        INCORPORACION: '3',
        REMISORIO_EXTERNO: '4',
        REMISORIO_INTERNO: '5',
        SIN_EVALUACION: '6'
    },

    USUARIO_GESTOR_RESPUESTA: '(USUARIO ACTUAL DEL EXPEDIENTE)',

    TIPOS_FIRMA_MECANICA: {
        PRINCIPAL: 1,
        FIRMO: 2,
        ELABORO: 3,
    },

    ESTADO_FIRMA_MECANICA: {
        PENDIENTE_FIRMA: 1,
        FIRMADO: 2,
        ELIMINADO: 3,
    },


    TIPO_REPARTO: {
        REPARTO_ALEATORIO: 1,
        ASIGNADO_ASI_MISMO: 2,
        ASIGNACION_DIRIGIDA: 3,
    },


    MENSAJE_ERROR: {
        CAMPO_OBLIGATORIO: 'CAMPO OBLIGATORIO',
        ERROR_FORMATO_SIRIUS: 'NO CUMPLE CON EL FORMATO DE UN CÓDIGO SIRIUS',
        ERROR_FORMATO_SINPROC: 'NO CUMPLE CON EL FORMATO DE UN CÓDIGO SINPROC. DEBE SER NÚMERICO Y DE MÁXIMO 7 CARÁCTERES.',
        ERROR_FORMATO_CARACTERES: 'NÚMERO MÍNIMO DE CARÁCTERES: ',
        ERROR_FORMATO_CARACTERES_INVALIDOS: 'EL CAMPO TIENE CARÁCTERES INVÁLIDOS',
        ERROR_FORMATO_FECHA_INGRESO_DESGLOSE: 'LA FECHA DEBE SER ANTERIOR A LA DEL AUTO DESGLOSE',
        ERROR_FORMATO_FECHA_AUTO_DESGLOSE: 'LA FECHA DEBE SER POSTERIOR A LA FECHA DE INGRESO DEL DESGLOSE',
        // MENSAJE DE ERROR DE LOS DOCUMENTOS
        ERROR_PESO_DOCUMENTO: 'EL PESO DE LOS DOCUMENTOS EXCENDEN LOS 15MB PERMITIDOS',
        ERROR_NOMBRE_DOCUMENTO: 'YA EXISTE UN DOCUMENTO CON ESTE NOMBRE',
        ERROR_FORMATO_DOCUMENTO: 'EL FORMATO DEL DOCUMENTO NO ES CORRECTO'
    },

    MENSAJE_INFORMATIVO: {
        SELECCIONE_UNA_OPCION: 'Seleccione una opción'
    },

    BOTON_NOMBRE: {
        ACEPTAR: 'ACEPTAR',
        REGISTRAR: 'REGISTRAR',
        CANCELAR: 'CANCELAR',
        ACTUALIZAR: 'ACTUALIZAR',
        CONSULTAR: 'CONSULTAR',
        BUSCAR: 'BUSCAR',
        AGREGAR: 'AGREGAR',
        CERRAR: 'CERRAR',
        HABILITAR: 'HABILITAR'
    },


    MENSAJES_MODAL: {
        EXITOSO: 'OPERACIÓN REALIZADA EXITOSAMENTE.',
    },

    TIPO_DOCUMENTO_PERMITIDO_ACTUACIONES: {
        DOCX: "docx",
        PDF: "pdf"
    },

    ESTADOS_ACTUACION: {
        APROBADA: "Aprobada",
        RECHAZADA: "Rechazada",
        PENDIENTE_APROBACION: "Pendiente aprobación",
        SOLICITUD_INACTIVACION: "Solicitud inactivación",
        APROBADA_PDF_DEFINITIVO: "Aprobada y pdf definitivo",
        ACTUALIZACION_DOCUMENTO: "Actualización del Documento",
        SOLICITUD_INACTIVACION_ACEPTADA: "Solicitud inactivación aceptada",
        SOLICITUD_INACTIVACION_RECHAZADA: "Solicitud inactivación rechazada",
        DOCUMENTO_FIRMADO: "Documento firmado",
        ACTUACION_INACTIVADA: "Actuación inactivada",
        REMITIDA: "Remitida",
        CAMBIO_ETAPA: "Cambio de etapa",
        CAMBIO_LISTA_ACTUACIONES_INACTIVAR: "Cambio de lista de actuaciones a inactivar",
        SOLICITUD_ACTIVACION: "Solicitud activación",
        SOLICITUD_ACTIVACION_ACEPTADA: "Solicitud activación aceptada",
        SOLICITUD_ACTIVACION_RECHAZADA: "Solicitud activación rechazada",
    },

    ESTADO_ACTUACION: {
        APROBADA: 1,
        RECHAZADA: 2,
        PENDIENTE_APROBACION: 3,
        SOLICITUD_INACTIVACION: 4,
        APROBADA_PDF_DEFINITIVO: 5,
        ACTUALIZACION_DOCUMENTO: 6,
        SOLICITUD_INACTIVACION_ACEPTADA: 7,
        SOLICITUD_INACTIVACION_RECHAZADA: 8,
        DOCUMENTO_FIRMADO: 9,
        ACTUACION_INACTIVADA: 10,
        CAMBIO_ETAPA: 11,
        CAMBIO_LISTA_ACTUACIONES_INACTIVAR: 12,
        SOLICITUD_ACTIVACION: 13,
        SOLICITUD_ACTIVACION_ACEPTADA: 14,
        SOLICITUD_ACTIVACION_RECHAZADA: 15,
        REMITIDA: 0,
    },

    TIPO_ARCHIVO_ACTUACIONES: {
        DOCUMENTO_INICIAL: 1,
        DOCUMENTO_DEFINITIVO: 2
    },

    VISIBILIDAD: {
        VISIBLE_TODOS: 1,
        VISIBLE_DEPENDENCIA: 2,
        VISIBLE_PARA_MI_Y_JEFE: 3,
        OCULTO_TODOS: 4
    },

    SEMAFORO_EVENTOS: {
        EVENTO_ANTECEDENTE: 1,
        EVENTO_APROBACION_ACTUACION: 2,
        EVENTO_APROBACION_ACTUACION_FECHA: 3,
        EVENTO_SECRETARIA_COMUN: 4,
        EVENTO_DEPENDENCIA: 5,
        EVENTO_INTERESADO_DEPENDENCIA: 6,
    },
    
    MENSAJE_TIPO_INFORMATIVO_PARA_APROBAR: {
        ETAPA: 'etapa',
        FIRMA: 'firma',
        ANULACION: 'anulacion',
    },

    MENSAJE_INFORMATIVO_PARA_APROBAR: {
        ETAPA: 'PARA APROBAR, SE DEBE SELECCIONAR CUAL ES LA ETAPA QUE SEGUIRÁ UNA VEZ SE REALICE LA APROBACIÓN.',
        FIRMA: 'SE REQUIERE LA FIRMA MECÁNICA DE TODOS LOS USUARIOS SELECCIONADOS PARA APROBAR.',
        ANULACION: 'SE REQUIERE SELECCIONAR AL MENOS UNA ACTUACIÓN A ANULAR PARA PODER APROBARLO.',
    },
};