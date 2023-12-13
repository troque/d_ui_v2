
function obtenerRequeridos(tipoSujetoPorcesal) {

    switch (tipoSujetoPorcesal) {
        case '1':
            return this.asignarQuejoso();
        case '2':
            return this.asignarQuejosoAcosoLaboral();
        case '3':
            return this.asignarQuejosoDisciplinado();
        case '4':
            return this.asignarQuejosoApoderado();
        case '5':
            return this.asignarQuejosoDefensonOficio();
        case '6':
            return this.asignarQuejosoMinisterioPublico();
        case '7':
            return this.asignarQuejosoVictimasGraves();
        /*case '8':
            return this.asignarEntidad();*/
        default:
            return this.asignarValoresPorDefecto();
    }



}

function asignarQuejoso() {
    let data = {
        "tipoDocumento": false,
        "numeroDocumento": false,
        "primerNombre": false,
        "segundoNombre": false,
        "primerApellido": false,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": false,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true
    }

    return data;
}

function asignarQuejosoAcosoLaboral() {
    let data = {
        "tipoDocumento": false,
        "numeroDocumento": false,
        "primerNombre": true,
        "segundoNombre": false,
        "primerApellido": true,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": false,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true,
    }
    return data;
}

function asignarQuejosoDisciplinado() {
    let data = {
        "tipoDocumento": true,
        "numeroDocumento": true,
        "primerNombre": true,
        "segundoNombre": false,
        "primerApellido": true,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": true,
        "cargo": true,
        "entidadSujetoProcesal": true,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": false,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true,
    }
    return data;
}

function asignarQuejosoApoderado() {
    let data = {
        "tipoDocumento": true,
        "numeroDocumento": true,
        "primerNombre": true,
        "segundoNombre": false,
        "primerApellido": true,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": true,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": true,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true,
    }
    return data;
}

function asignarQuejosoDefensonOficio() {
    let data = {
        "tipoDocumento": true,
        "numeroDocumento": true,
        "primerNombre": true,
        "segundoNombre": false,
        "primerApellido": true,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": true,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true,

    }
    return data;
}

function asignarQuejosoMinisterioPublico() {
    let data = {
        "tipoDocumento": false,
        "numeroDocumento": false,
        "primerNombre": true,
        "segundoNombre": false,
        "primerApellido": true,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": true,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true,
    }
    return data;
}

function asignarQuejosoVictimasGraves() {

    let data = {
        "tipoDocumento": false,
        "numeroDocumento": false,
        "primerNombre": true,
        "segundoNombre": false,
        "primerApellido": true,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": true,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true,
    }
    return data;
}

function asignarEntidad() {

    let data = {
        "tipoDocumento": true,
        "numeroDocumento": true,
        "primerNombre": true,
        "segundoNombre": false,
        "primerApellido": true,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": true,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true,
    }
    return data;
}

function asignarValoresPorDefecto() {

    let data = {
        "tipoDocumento": false,
        "numeroDocumento": false,
        "primerNombre": false,
        "segundoNombre": false,
        "primerApellido": false,
        "segundoApellido": false,
        "dependencia": false,
        "nivelJerarquico": false,
        "cargo": false,
        "entidadSujetoProcesal": false,
        "tarjetaProfesional": false,
        "departamento": false,
        "ciudad": false,
        "direccionCorrespondencia": false,
        "localidad": false,
        "correo": false,
        "telefonoCelular": false,
        "telefonoFijo": false,
        "sexo": false,
        "genero": false,
        "orientacionSexual": false,
        "folio": true
    }
    return data;
}


export default {
    obtenerRequeridos, asignarQuejosoVictimasGraves, asignarQuejosoMinisterioPublico, asignarQuejosoDefensonOficio,
    asignarQuejosoApoderado, asignarQuejosoDisciplinado, asignarQuejosoAcosoLaboral, asignarQuejoso, asignarEntidad, asignarValoresPorDefecto
}