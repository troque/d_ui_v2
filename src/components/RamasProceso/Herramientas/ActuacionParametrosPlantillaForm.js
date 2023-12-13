import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import GenericApi from '../../Api/Services/GenericApi';
import ParametrosMasApi from "../../Api/Services/ParametrosMasApi";
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import '../../Utils/Constants';
import { getUser } from '../../Utils/Common';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from 'moment';

function ActuacionParametrosPlantillaForm(props) {
    const location = useLocation()
    const { from } = location.state
    let radicado = from.radicado;
    let procesoDisciplinarioId = from.procesoDisciplinarioId;
    let id_etapa = from.idEtapa;
    const fechaRegistro = from.fechaRegistro;
    const fechaIngreso = from.fechaIngreso;
    const dependencia = getUser().nombre_dependencia ? getUser().nombre_dependencia.nombre : "";
    const registradoPor = from.registradoPor;
    const vigencia = from.vigencia;
    const generadoPor = getUser().nombre_completo ? getUser().nombre_completo : "";

    const [modalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getListaParametros, setListaParametros] = useState();
    const [getListaCamposPorParametroTemporal, setListaCamposPorParametroTemporal] = useState({ data: [] });
    const [getListaCamposPorCamposTemporal, setListaCamposPorCamposTemporal] = useState({ data: [] });
    //const [getListaCamposPorParametroDefinitiva, setListaCamposPorParametroDefinitiva] = useState({ data: [] });
    const [getAntecedentesLista, setAntecedentesLista] = useState({ data: [], links: [], meta: [] });
    const [getInteresadosLista, setInteresadosLista] = useState({ data: [], links: [], meta: [] });
    const [getEntidadesInvestigadoLista, setEntidadesInvestigadoLista] = useState({ data: [], links: [], meta: [] });
    const [getCargosInvestigadoLista, setCargosInvestigadoLista] = useState({ data: [], links: [], meta: [] });
    const [getEntidadInvestigadoLista, setEntidadInvestigadoLista] = useState({ data: [], links: [], meta: [] });
    const [getParametrosCampos, setParametrosCampos] = useState();
    const [getListaParametrosBaseDatos, setListaParametrosBaseDatos] = useState({ data: [] });
    const [getPrueba, setPrueba] = useState(true);
    const [getExistenDatosResultados, setExistenDatosResultados] = useState(true);

    const [getCamposAdicionales, setCamposAdicionales] = useState([]);
    const [getMaxDate, setMaxDate] = useState();
    const [value, setValue] = useState(moment().format('YYYY-MM-DD'));
    const [getIsLoading, setIsLoading] = useState(true);

    let numeroLlamados = 0;
    let numeroTotalLlamados = 3;
    const [getTablaParametrosData, setTablaParametrosData] = useState([{grupo: "", datos: [], titulo: []}]);

    // Metodo encargado de cargar la informacion general del formulario
    useEffect(() => {

        // Se setea el maximo de fecha
        setMaxDate(new Date().toISOString().split("T")[0]);

        // Se inicializa la funcion asyncrona
        async function fetchData() {

            // Metodo encargado de cargar los parametros de la plantilla
            cargarTablaParametrosActuaciones();
        }

        // Se llama el metodo
        fetchData();
    }, [props.id_mas_actuacion]);

    // Metodo encargado de cargar los parametros generales de la plantilla de la BD
    const cargarTablaParametrosActuaciones = () => {

        // Se inicializa el array
        var array = [];

        // Se inicializa la API
        GenericApi.getGeneric('parametro-campos').then(

            // Se inicializa la variable de respuesta
            datos => {

                validacionSpinner()
                setCamposAdicionales([])

                // Se valida que no haya error
                if (!datos.error) {

                    // Se recorre el array para insertar los valores necesarios
                    for (let index = 0; index < datos.data.length; index++) {

                        // Se captura los datos por posicion
                        const element = datos.data[index].attributes;
                        const title = element.nombre_campo;
                        const estado = element.estado == "1" ? true : false;
                        const type = element.type;
                        const value = validarValueParametros(type, estado);

                        // Se añade el dato al array general
                        array.push({ title: title, value: value, type: type, check: estado });
                    }

                    // Se setea la respuesta en la constante
                    setListaParametrosBaseDatos(array);

                    // Se generan la lista de parametros del documento
                    cargarParametros(array);
                }
            }
        )
    }

    // Metodo encargado de retorna el valor por el elemento
    const validarValueParametros = (element, estado) => {

        // Se inicializa la variable
        let valor;

        // Se valida por el elemento
        if ((element == "Sinproc" || element == "Número de radicado"
            || element == "Radicación" || element == "Radicado") && estado) {
            valor = radicado;
        } else if (element == "Usuario" && estado) {
            valor = registradoPor;
        } else if ((element == "Dependencia Origen" || element == "Dependencia") && estado) {
            valor = dependencia;
        } else if (element == "Vigencia" && estado) {
            valor = vigencia;
        } else if (element == "Fecha de Registro" && estado) {
            valor = fechaRegistro;
        } else if (element == "Fecha de Ingreso" && estado) {
            valor = fechaIngreso;
        } else if (element == "Generado" && estado) {
            valor = generadoPor;
        } else if ((element == "Número de auto (generado despues de aprobación)" || element == "Auto") && estado) {
            valor = "${numero_de_auto}";
        }

        // Se retorna el valor
        return valor;
    }

    const handleChangeInteresados = (e, parametro, id_campo) => {

        const { value, checked } = e.target;

        let valorId = getInteresadosLista.map((item) => {
            if (value == item.id) {
                item.checked = checked;
            }
            return item;
        });

        setInteresadosLista(valorId);
        let val = getInteresadosLista.map((p) => {
            if (p.checked == true) {

                var primerApellido = p.attributes.primer_apellido != null ? p.attributes.primer_apellido : "";
                var segundoApellido = p.attributes.segundo_apellido != null ? p.attributes.segundo_apellido : "";
                var primerNombre = p.attributes.primer_nombre != null ? p.attributes.primer_nombre : "";
                var segundoNombre = p.attributes.segundo_nombre != null ? p.attributes.segundo_nombre : "";
                var sujetoProcesalNombre = p.attributes.sujeto_procesal_nombre != "" ? p.attributes.sujeto_procesal_nombre : "";
                var nombreCompleto = sujetoProcesalNombre + " " + primerApellido + " " + segundoApellido + " " + primerNombre + " " + segundoNombre;
                var nombre = nombreCompleto;

                return nombre;
            }
        }).filter(x => x != undefined);
        selectChangeListaCampos(parametro, id_campo, val.toString());
    }

    function checkeoAutomaticoInteresados(parametro, id_campo) {
        setInteresadosLista(getInteresadosLista);

        var primerApellido = getInteresadosLista[0].attributes.primer_apellido != null ? getInteresadosLista[0].attributes.primer_apellido : "";
        var segundoApellido = getInteresadosLista[0].attributes.segundo_apellido != null ? getInteresadosLista[0].attributes.segundo_apellido : "";
        var primerNombre = getInteresadosLista[0].attributes.primer_nombre != null ? getInteresadosLista[0].attributes.primer_nombre : "";
        var segundoNombre = getInteresadosLista[0].attributes.segundo_nombre != null ? getInteresadosLista[0].attributes.segundo_nombre : "";
        var sujetoProcesalNombre = getInteresadosLista[0].attributes.sujeto_procesal_nombre != null ? getInteresadosLista[0].attributes.sujeto_procesal_nombre : "";
        var nombreCompleto = sujetoProcesalNombre + " " + primerApellido + " " + segundoApellido + " " + primerNombre + " " + segundoNombre;
        var nombre = nombreCompleto;

        // var nombre = `${getInteresadosLista[0].attributes.sujeto_procesal_nombre} ${getInteresadosLista[0].attributes.primer_apellido} ${getInteresadosLista[0].attributes.segundo_apellido} ${getInteresadosLista[0].attributes.primer_nombre} ${getInteresadosLista[0].attributes.segundo_nombre}`;
        selectChangeListaCampos(parametro, id_campo, nombre);
    }

    function checkeoAutomaticoAntecedentes(parametro, id_campo) {
        setAntecedentesLista(getAntecedentesLista);
        var nombre = `${getAntecedentesLista[0].attributes.descripcion}`;
        selectChangeListaCampos(parametro, id_campo, nombre);
    }

    function checkeoAutomaticoInvestigadosNombre(parametro, id_campo) {
        setEntidadInvestigadoLista(getEntidadesInvestigadoLista);
        var nombre = `${getEntidadesInvestigadoLista[0].attributes.nombre_investigado}`;
        if (nombre == "null") {
            nombre = "NO_APLICA";
        }
        selectChangeListaCampos(parametro, id_campo, nombre);
    }

    function checkeoAutomaticoInvestigadosCargo(parametro, id_campo) {
        setCargosInvestigadoLista(getCargosInvestigadoLista);
        var nombre = `${getCargosInvestigadoLista[0].attributes.cargo}`;
        if (nombre == "null") {
            nombre = "NO_APLICA";
        }
        selectChangeListaCampos(parametro, id_campo, nombre);
    }

    function checkeoAutomaticoInvestigadosEntidad(parametro, id_campo) {
        setEntidadesInvestigadoLista(getEntidadInvestigadoLista);
        var nombre = `${getEntidadInvestigadoLista[0].attributes.nombre_entidad}`;
        if (nombre == "null") {
            nombre = "NO_APLICA";
        }
        selectChangeListaCampos(parametro, id_campo, nombre);
    }

    function checkeoAutomaticoFechaAntecedentes(parametro, id_campo) {
        setAntecedentesLista(getAntecedentesLista);
        var nombre = `${getAntecedentesLista[0].attributes.fecha_creado}`;
        if (nombre == "null") {
            nombre = "NO_APLICA";
        }
        selectChangeListaCampos(parametro, id_campo, nombre);
    }

    const handleChangeAntecedentes = (e, parametro, id_campo) => {
        const { value, checked } = e.target;

        let valorId = getAntecedentesLista.map((item) => {
            if (value == item.id) {
                item.checked = checked;
            }
            return item;
        });

        setAntecedentesLista(valorId);
        let val = getAntecedentesLista.map((p) => {
            if (p.checked == true) {
                var nombre = `${p.attributes.descripcion}`;
                return nombre;
            }
        }).filter(x => x != undefined);
        selectChangeListaCampos(parametro, id_campo, val.toString());

    }

    const handleChangeFechaAntecedentes = (e, parametro, id_campo) => {
        const { value, checked } = e.target;

        let valorId = getAntecedentesLista.map((item) => {
            if (value == item.id) {
                item.checked = checked;
            }
            return item;
        });

        setAntecedentesLista(valorId);
        let val = getAntecedentesLista.map((p) => {
            if (p.checked == true) {
                var nombre = `${p.attributes.fecha_creado}`;
                return nombre;
            }
        }).filter(x => x != undefined);
        selectChangeListaCampos(parametro, id_campo, val.toString());

    }

    const handleChangeInvestigados = (e, parametro, id_campo) => {
        const { value, checked } = e.target;

        let valorId = getEntidadesInvestigadoLista.map((item) => {
            if (value == item.attributes.nombre_investigado) {
                item.checked = checked;
            }
            return item;
        });

        setEntidadesInvestigadoLista(valorId);
        let val = getEntidadesInvestigadoLista.map((p) => {
            if (p.checked == true) {
                var value = `${p.attributes.nombre_investigado}`;
                var nombre = `${p.attributes.nombre_investigado}`;

                return nombre;
            }
        }).filter(x => x != undefined);
        selectChangeListaCampos(parametro, id_campo, val.toString());

    }

    const handleChangeCargosInvestigados = (e, parametro, id_campo) => {
        const { value, checked } = e.target;

        let valorId = getCargosInvestigadoLista.map((item) => {
            if (value == item.attributes.cargo) {
                item.checked = checked;
            }
            return item;
        });

        setCargosInvestigadoLista(valorId);
        let val = getCargosInvestigadoLista.map((p) => {
            if (p.checked == true) {
                var value = `${p.attributes.cargo}`;
                var nombre = `${p.attributes.cargo}`;

                return nombre;
            }
        }).filter(x => x != undefined);
        selectChangeListaCampos(parametro, id_campo, val.toString());

    }

    const handleChangeEntidadesInvestigados = (e, parametro, id_campo) => {
        const { value, checked } = e.target;

        let valorId = getEntidadInvestigadoLista.map((item) => {
            if (value == item.attributes.nombre_entidad) {
                item.checked = checked;
            }
            return item;
        });

        setCargosInvestigadoLista(valorId);
        let val = getEntidadInvestigadoLista.map((p) => {
            if (p.checked == true) {
                var value = `${p.attributes.nombre_entidad}`;
                var nombre = `${p.attributes.nombre_entidad}`;

                return nombre;
            }
        }).filter(x => x != undefined);
        selectChangeListaCampos(parametro, id_campo, val.toString());

    }

      const onChangeValue = (value, dato, parametro, grupo, principal, pos) => {

        const nuevosResultados = JSON.parse(JSON.stringify(getListaParametros));

        if (value) {
            nuevosResultados.resultados[parametro][pos].seleccionar = true;
        } 
        else {
            nuevosResultados.resultados[parametro][pos].seleccionar = false;
        }

        if(principal){
            const inputs = document.querySelectorAll('input[name="'+grupo+'"]');
            // Deshabilitar los inputs seleccionados
            inputs.forEach(input => {
                input.disabled = !value;
                let datosEnvio = input.id.split('$$$');
                nuevosResultados.resultados[datosEnvio[1]][datosEnvio[2]].seleccionar = false;
            });
        }

        setListaParametros(nuevosResultados);
        
        modificarListaCampos(value, (dato ? dato : 'SIN DATOS'), parametro, pos)
        removerInpuntsLista()
        establecerTabla(nuevosResultados, [])
    }

    const modificarListaCampos = (value, dato, parametro, pos) => {
        let index = getListaCamposPorParametroTemporal.data.findIndex(data => data.param === parametro)
        if(index > -1){
            if(getListaCamposPorParametroTemporal.data[index].value){
                let listaSplit = getListaCamposPorParametroTemporal.data[index].value.replace(/\s/g, '').split('$$$')
                let listaSplitIndex = getListaCamposPorParametroTemporal.data[index].orden.toString().split('$$$')
                let listaSplitConEspacios = getListaCamposPorParametroTemporal.data[index].value.split('$$$')
                let auxDato = dato.replace(/\s/g, '')
                if(value){
                    getListaCamposPorParametroTemporal.data[index].value += "$$$" + dato
                    getListaCamposPorParametroTemporal.data[index].orden += "$$$" + pos
                }
                else{
                    getListaCamposPorParametroTemporal.data[index].value = null
                    getListaCamposPorParametroTemporal.data[index].orden = null
                    //listaSplit.forEach((element, indexElement) => {
                    listaSplitIndex.forEach((element, indexElement) => {
                        //if(auxDato !== element){
                        if(element !== pos+""){
                            if(getListaCamposPorParametroTemporal.data[index].value === null){
                                getListaCamposPorParametroTemporal.data[index].value = listaSplitConEspacios[indexElement]
                                getListaCamposPorParametroTemporal.data[index].orden = listaSplitIndex[indexElement]
                            }
                            else{
                                getListaCamposPorParametroTemporal.data[index].value += "$$$" + listaSplitConEspacios[indexElement]
                                getListaCamposPorParametroTemporal.data[index].orden += "$$$" + listaSplitIndex[indexElement]
                            }
                        }
                    });
                }
            }
            else{
                if(value){
                    getListaCamposPorParametroTemporal.data[index].value = dato
                    getListaCamposPorParametroTemporal.data[index].orden = pos
                }
            }           
            setListaCamposPorParametroTemporal(getListaCamposPorParametroTemporal)
        }
        else{
            if(value){
                const nuevoElemento = { 
                    'param': parametro,
                    'value': dato, 
                    'orden': pos
                }
    
                // Crear una copia del estado actual y agregar el nuevo elemento
                const nuevaLista = [...getListaCamposPorParametroTemporal.data, nuevoElemento]
    
                // Actualizar el estado con la nueva lista que contiene el nuevo elemento
                setListaCamposPorParametroTemporal({ ...getListaCamposPorParametroTemporal, data: nuevaLista })
            }
        }
    } 

    const removerInpuntsLista = () => {
        if (getListaParametros && getListaParametros.params && getListaParametros.resultados) {
            let grupos = [];
            getListaParametros.params.forEach(parametro => {
                if (getListaParametros.resultados[parametro] && Array.isArray(getListaParametros.resultados[parametro])) {
                    getListaParametros.resultados[parametro].forEach(resultado => {
                        grupos.push(resultado.grupo);
                    });
                }
                grupos = [...new Set(grupos)];
            });
    
            grupos.forEach(grupo => {
                let inputs = document.querySelectorAll('input[name="' + grupo + '"]');
                inputs.forEach(input => {
                    if (input.disabled) {
                        let datosEnvio = input.id.split('$$$');
                        modificarListaCampos(false, datosEnvio[0], datosEnvio[1], datosEnvio[2]);
                    }
                });
            });
        }
    };

    const establecerTabla = (datos, grupoGeneral = []) => {

        if(grupoGeneral.length <= 0){
            datos.params.forEach(element => {
                if(Array.isArray(datos.resultados[element]) && datos.resultados[element].length > 0){
                    if(datos.resultados[element][0]['crear_tabla'] && grupoGeneral.filter(dato => dato === datos.resultados[element][0]['grupo_general']) == 0){
                        grupoGeneral.push(datos.resultados[element][0]['grupo_general'])
                    }
                }
            });
        }
        
        let filas = []
        let fila = []
        let titulo = []

        const nuevoGrupo = [];

        grupoGeneral.forEach((grupo, index) => {
            datos.params.forEach(parametro => {
                if(datos.resultados[parametro]?.[0]?.['grupo_general'] == grupo){
                    titulo.push(datos.resultados[parametro][0]['parametro'])
                    datos.resultados[parametro].forEach(resultado => {
                        fila.push(resultado)
                    })
                    filas.push(fila)
                    fila = []
                }
            });
            nuevoGrupo.push({
                grupo: grupo,
                datos: filas,
                titulo: titulo
            });
            titulo = []
            filas = []
            fila = []
        });
        setTablaParametrosData(nuevoGrupo)

    }

    const componentInputCheckBox = (recorrido) => {
        if(recorrido){
            return (recorrido.map((dato, index) => {
                return (                
                    <div key={index}>
                        <label><input id={dato.dato+"$$$"+dato.parametro+"$$$"+index} name={dato.principal ? dato.grupo+"_"+dato.principal : dato.grupo} type="checkbox" checked={dato.seleccionar} onChange={e => onChangeValue(e.target.checked, dato.dato, dato.parametro, dato.grupo, dato.principal, index)}/> { dato.dato ? dato.dato : 'SIN DATOS' }</label>
                    </div>
                )
            }))
        }
    }

    const cargarValoresDeParametro = (parametro) => {
        if(getListaParametros?.resultados?.[parametro]){
            return (<>{componentInputCheckBox(getListaParametros?.resultados?.[parametro])}</>)
        }
    }

    const selectChangeListaCampos = (parametro, id_campo, value) => {

        var newParams = getListaCamposPorParametroTemporal.data.map(item => {

            if (item.parametro == parametro) {
                item.id_campo = id_campo;
                var itemCampo = getListaParametrosBaseDatos[id_campo];

                item.valor = (itemCampo.value != null) ? itemCampo.value : value;
                item.valorTemporal = (itemCampo.value != null) ? itemCampo.value : value;
            }
            return item;
        });

        //setListaCamposPorParametroDefinitiva({ data: newParams });
    }

    // Metodo encargado de generar las columnas de los parametros de la plantilla
    const columnsCampos = [
        {
            name: 'CAMPO',
            cell: campo =>
                <div>
                    <strong>{campo.nombreCampo ? campo.nombreCampo : ""}</strong>
                </div>,
            sortable: true,
            width: "15%"
        },
        {
            name: 'ITEMS',
            width: "50%",
            cell: campo =>
                <div className='row'>
                    <div className='col'>
                        {cargarValoresCampos(campo)}
                    </div>
                </div>
        },
    ];

    // Metodo encargado de setear el valor al mismo input
    const changeTextInput = (e, arrayDatos) => {

        // Se setea temporalmente
        let elementoHtml = document.getElementById(e.target.name);
        let nombreElemento = e.target.name;

        // Se captura el valor escrito
        let valor = e.target.value;

        // El elemento existe
        if (elementoHtml) {

            // Se setea el nuevo valor
            elementoHtml.title = valor;

            // Se asigna el item dentro del array para enviarlo
            getCamposAdicionales.forEach(e => {

                // Se captura la key
                let key = e.nombreCampo;

                // Se valida que la key sea igual al elemento modificado
                if (key == nombreElemento) {

                    // Se añade el item
                    e.items = [valor];
                }
            })
        }

        // Se setea en el from cada que vez que finaliza la acción
        from.getCamposAdicionales = getCamposAdicionales;
    }

    // Metodo encargado de cambiar el valor de la fecha
    const changeDateInput = (e) => {

        // Se formatea
        const newDate = moment(e.target.value).format('DD/MM/YYYY');

        // Se captura el nombre del elemento
        let nombreElemento = e.target.name;

        // Se setea los valores
        setValue(newDate);

        // Se asigna el item dentro del array para enviarlo
        getCamposAdicionales.forEach(e => {

            // Se captura la key
            let key = e.nombreCampo;

            // Se valida que la key sea igual al elemento modificado
            if (key == nombreElemento) {

                // Se añade el item
                e.items = [newDate];
            }
        })

        // Se setea en el from cada que vez que finaliza la acción
        from.getCamposAdicionales = getCamposAdicionales;
    };

    // Metodo encargado de cambiar el valor del input
    const changeCheckInput = (e, value) => {

        // Se captura el elemento html
        let nombreElemento = value;

        // Se captura el elemento del check true o false
        let checkeado = e.target.checked;

        // Se captura el valor chequeado html
        let valorCheck = e.target.value;

        // Se valida cuando esta chequeado
        if (checkeado == true) {

            // Se asigna el item dentro del array para enviarlo
            getCamposAdicionales.forEach(e => {

                // Se captura la key
                let key = e.nombreCampo;

                // Se valida que la key sea igual al elemento modificado
                if (key == nombreElemento) {

                    // Se valida la primera vez
                    if (!e.itemsSeleccionado) {

                        // Se añade el item
                        e.itemsSeleccionado = [valorCheck];
                    } else {

                        // Se añade el item al array
                        e.itemsSeleccionado.push(valorCheck);
                    }
                }
            })
        } else if (checkeado == false) {

            // Se asigna el item dentro del array para quitarlo
            getCamposAdicionales.forEach(e => {

                // Se captura la key
                let key = e.nombreCampo;
                let items = e.itemsSeleccionado ? e.itemsSeleccionado : [];

                // Continua el proceso para quitarlo del array
                if (items.length > 0 && (key == nombreElemento)) {

                    // Se busca la posicion del elemento
                    var index = items.indexOf(valorCheck);

                    // Se quita el elemento
                    items.splice(index, 1);
                }
            })
        }

        // Se setea en el from cada que vez que finaliza la acción
        from.getCamposAdicionales = getCamposAdicionales;
    }

    // Metodo encargado de cargar los valores de los campos
    const cargarValoresCampos = (campo) => {

        // Se inicializa la variable de campos
        const campoParametro = campo;

        // Se capturan la informacion del campo
        const tipoCampo = campoParametro.tipoCampo;
        const nombreCampo = campoParametro.nombreCampo;
        const itemCampo = tipoCampo == 2 ? campoParametro.items : "";

        // Se valida cuando el tipo campo es un listado
        if (tipoCampo == 2) {

            // Se retorna el mapeo
            return (

                // Se recorre el elemento
                itemCampo.map((item, i) => {

                    // Se retorna el HTML
                    return (
                        <div className="col-md-12 mt-1 ml-2 mb-1" key={item}>
                            <input type="checkbox"
                                className="form-check-input"
                                id={item}
                                name={item}
                                value={item}
                                onChange={(e) => changeCheckInput(e, nombreCampo)}
                                defaultChecked={item.checked} /> {item}
                        </div>
                    )
                })
            )
        } else if (tipoCampo == 1) {

            // Se retorna el html del tipo fecha 
            return (
                <div className="custom-control custom-switch custom-control-lg mt-2 mb-2">
                    <input type="date"
                        className="form-control"
                        id={nombreCampo}
                        name={nombreCampo}
                        onChange={changeDateInput}
                        max={getMaxDate}
                    />
                </div>
            )
        } else if (tipoCampo == 0) {

            // Se retorna el html del tipo texto
            return (
                <div className="custom-control custom-switch custom-control-lg mt-2 mb-2">
                    <input type="text"
                        className="form-control"
                        id={nombreCampo}
                        name={nombreCampo}
                        placeholder={nombreCampo}
                        onChange={e => changeTextInput(e, campo)} />
                </div>
            )
        }
    }

    // Metodo encargado de retorna los items separados
    const validarItems = (item) => {

        // Se valida que exista y tenga un elemento
        if (item && item.length == 0) {

            // Se retorna el primer elemento
            return item;
        } else if (item && item.length > 0) {

            // Se retorna por comas
            return item.join(", ");
        }
    }

    // Metodo encargado de validar el tipo del campo
    const validarTipoCampo = (tipo) => {

        // Se inicializa la variable
        let nombreRetornado;

        // Se valida el tipo
        if (tipo == 0) {

            // Se redeclara la variable
            nombreRetornado = "Texto";
        } else if (tipo == 1) {

            // Se redeclara la variable
            nombreRetornado = "Fecha";
        } else if (tipo == 2) {

            // Se redeclara la variable
            nombreRetornado = "Lista";
        }

        // Se retorna el valor
        return nombreRetornado;
    }

    // Metodo encargado de cargar los parametros de la base de datos
    const cargarParametros = (listaParametrosBaseDatos) => {

        // Se setean los valores en null y vacios para que no salga el limitante de las hooks
        setListaParametros(null);
        setAntecedentesLista({ data: [] });
        setInteresadosLista({ data: [] });
        setEntidadesInvestigadoLista({ data: [] });
        setCargosInvestigadoLista({ data: [] });
        setEntidadInvestigadoLista({ data: [] });
        setListaCamposPorParametroTemporal({ data: [] });
        setListaParametros({ data: [] });

        // Se inicializa el array
        const data = {
            "data": {
                "type": 'mas_actuaciones',
                "attributes": {
                    "id": props.id_mas_actuacion,
                    "id_proceso_disciplinario": from.procesoDisciplinarioId
                }
            }
        }

        // Se inicializa la API
        GenericApi.getByDataGeneric('mas_actuaciones/parametros-plantilla/' + props.id_mas_actuacion + '/' + from.procesoDisciplinarioId, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                validacionSpinner()

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setean los valores a la lista general de parametros
                    setListaParametros(datos);
                    
                    let existenDatos = false;
                    let grupoGeneral = []
                    datos.params.forEach(element => {
                        if(Array.isArray(datos.resultados[element]) && datos.resultados[element].length > 0){
                            existenDatos = true;
                            if(datos.resultados[element][0]['crear_tabla'] && grupoGeneral.filter(dato => dato === datos.resultados[element][0]['grupo_general']) == 0){
                                grupoGeneral.push(datos.resultados[element][0]['grupo_general'])
                            }
                        }
                    });
                    
                    establecerTabla(datos, grupoGeneral)                    
                    setExistenDatosResultados(existenDatos)

                    if (existenDatos && datos && datos.params && datos.resultados) {
                        const nuevoElemento = [];
                      
                        datos.params.forEach(parametro => {
                          if (datos.resultados[parametro] && Array.isArray(datos.resultados[parametro])) {
                            datos.resultados[parametro].forEach((element, posicion) => {
                                //if (datos.resultados[parametro].length === 1 || (element && element.principal)) {
                                    let index = nuevoElemento.findIndex(data => data.param === parametro);
                                    if (index > -1) {
                                    nuevoElemento[index].value += "$$$" + (element.dato ? element.dato : 'SIN DATOS');
                                    nuevoElemento[index].orden += "$$$" + posicion;
                                    } else {
                                    nuevoElemento.push({ 
                                        'param': parametro,
                                        'value': element.dato ? element.dato : 'SIN DATOS', 
                                        'orden': posicion
                                    });
                                    }
                                //}
                            });
                          }
                        });
                        setListaCamposPorParametroTemporal({ ...getListaCamposPorParametroTemporal, data: nuevoElemento });
                      }


                    window.showSpinner(false)
                }
            }
        )

        // Se inicializa la API
        GenericApi.getGeneric('mas_actuaciones/' + props.id_mas_actuacion).then(

            // Se inicializa la variable de respuesta
            datos => {
                
                validacionSpinner()

                // Se valida que no haya error
                if (!datos.error) {

                    // Se valida que hayan campos adicionales
                    if (datos.data.attributes.campos.length > 0) {

                        // Se setean los valores a la lista
                        setCamposAdicionales(datos.data.attributes.campos);

                        // Se setean los campos en el from
                        from.campos = datos.data.attributes.campos;
                    } else if (from.campos) {

                        // Se setean los campos en el from
                        delete from.campos;
                    }
                }
            }
        )

        // Se quita el cargando
        window.showSpinner(false);
    }

    const descargarArchivo = () => {

        try {
            window.showSpinner(true)

            const data = {
                "data": {
                    "type": "mas_actuaciones",
                    "attributes": {
                        "params": getListaCamposPorParametroTemporal.data,
                    }
                }
            }

            GenericApi.getByDataGeneric('mas_actuaciones/plantilla-diligenciada/' + props.id_mas_actuacion, data).then(
                datos => {
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, datos.file_name, global.Constants.TIPO_DOCUMENTO_PERMITIDO_ACTUACIONES.DOCX);
                        window.showSpinner(false);
                    }
                    else {
                        setModalState({ title: "SINPROC No " + radicado + " :: ", message: datos.error.toString(), show: true, redirect: null, from: { from }, alert: global.Constants.TIPO_ALERTA.ERROR });
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    };

    function downloadBase64File(contentType, base64Data, fileName, extension) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const validacionSpinner = () => {
        numeroLlamados++
        if(numeroLlamados >= numeroTotalLlamados){
            setIsLoading(false)
        }
    }
 
    const cargarInfoParametrosFila = () => {
        return (
            getListaParametros.params.map((parametro, i) => {
                if(i == 0){
                    return(
                        <tr key={i}>
                            <th>
                                { "${"+ parametro + "}" }
                            </th>
                            <td>
                                { getListaParametros.numero_de_auto }
                            </td>
                        </tr>
                    )
                }
                else if(getListaParametros?.resultados[parametro]?.[0]?.crear_tabla === false){
                    return(
                        <tr key={i}>
                            <th>
                                { "${"+ parametro + "}" }
                            </th>
                            <td>
                                {
                                    getListaParametros?.resultados[parametro].map((dato, index) => {
                                        return (
                                            <label><input id={dato.dato+"$$$"+dato.parametro+"$$$"+index} name={dato.principal ? dato.grupo+"_"+dato.principal : dato.grupo} type="checkbox" checked={dato.seleccionar} onChange={e => onChangeValue(e.target.checked, dato.dato, dato.parametro, dato.grupo, dato.principal, index)}/> { dato.dato ? dato.dato : 'SIN DATOS' }</label>
                                        )
                                    })                                
                                }
                            </td>
                        </tr>
                    )
                }
            })
        )
    }

    const cargarInfoParametrosTabla = () => {
        return (
            getTablaParametrosData.map((parametros, indexGeneral) => (
                <tr>
                    <td colSpan={2}>
                        <table className='table table-bordered table-striped table-vcenter js-dataTable-full'>
                            <thead>
                                <tr>
                                    {
                                        parametros.titulo.map((titulo, indexTitulo) => (
                                            <th key={indexTitulo}><b>{ "${" + titulo + "}" }</b></th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                    {
                                        parametros.datos?.length > 0
                                        ?
                                            (
                                                parametros.datos?.[0].map((datos, indexDatos) => (
                                                    <tr>
                                                        {
                                                            parametros.datos.map((dato, indexDato) => (
                                                                <td key={indexDato}>
                                                                    {
                                                                        <label>
                                                                            <input
                                                                                id={dato[indexDatos].dato + "$$$" + dato[indexDatos].parametro + "$$$" + dato[indexDatos].index}
                                                                                name={dato[indexDatos].principal ? dato[indexDatos].grupo + "_" + dato[indexDatos].principal : dato[indexDatos].grupo}
                                                                                type="checkbox"
                                                                                checked={dato[indexDatos].seleccionar}
                                                                                onChange={(e) =>
                                                                                    onChangeValue(
                                                                                        e.target.checked,
                                                                                        dato[indexDatos].dato,
                                                                                        dato[indexDatos].parametro,
                                                                                        dato[indexDatos].grupo,
                                                                                        dato[indexDatos].principal,
                                                                                        dato[indexDatos].index
                                                                                    )
                                                                                }
                                                                            />{" "}
                                                                            { dato[indexDatos].dato ? dato[indexDatos].dato : 'SIN DATOS' }
                                                                        </label>
                                                                    }
                                                                </td>
                                                            ))
                                                        }
                                                    </tr>
                                                ))
                                            )
                                        :
                                            null
                                    }
                            </tbody>
                        </table>
                    </td>
                </tr>
            ))
        )
        // return (
        //     {
        //         getTablaParametrosData.map((parametros, index) => (
        //             <tr>
        //                 <td colSpan={2}>
        //                     <div>
        //                         <table width={'100%'}>
        //                             <thead>
        //                                 <tr>
        //                                     {
        //                                         getTablaParametrosColumna?.map((column, columnIndex) => (
        //                                             <th key={columnIndex}>{column}</th>
        //                                         ))
        //                                     }
        //                                 </tr>
        //                             </thead>
        //                             <tbody>
        //                                 {
        //                                     getTablaParametrosData[0].map((_, rowIndex) => (
        //                                         <tr key={rowIndex}>
        //                                             {getTablaParametrosData.map((columna, index) => (
        //                                             <td key={index}>
        //                                                 {
        //                                                     <label>
        //                                                         <input
        //                                                             id={columna[rowIndex].dato + "$$$" + columna[rowIndex].parametro + "$$$" + columna[rowIndex].index}
        //                                                             name={columna[rowIndex].principal ? columna[rowIndex].grupo + "_" + columna[rowIndex].principal : columna[rowIndex].grupo}
        //                                                             type="checkbox"
        //                                                             checked={columna[rowIndex].seleccionar}
        //                                                             onChange={(e) =>
        //                                                                 onChangeValue(
        //                                                                 e.target.checked,
        //                                                                 columna[rowIndex].dato,
        //                                                                 columna[rowIndex].parametro,
        //                                                                 columna[rowIndex].grupo,
        //                                                                 columna[rowIndex].principal,
        //                                                                 columna[rowIndex].index
        //                                                                 )
        //                                                             }
        //                                                         />{" "}
        //                                                         {columna[rowIndex].dato ? columna[rowIndex].dato : 'SIN DATOS'}
        //                                                     </label>
        //                                                 }
        //                                             </td>
        //                                             ))}
        //                                         </tr>
        //                                     ))
        //                                 }
        //                             </tbody>
        //                         </table>
        //                     </div>
        //                 </td>
        //             </tr>
        //         )
        //     }
        // )
    }

    return (
        <>
            <Spinner />
            <ModalGen data={modalState} />
            {
                getIsLoading
                ?
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">CARGANDO...</span>
                        </div>
                    </div>
                :
                    <>
                        {
                            getListaParametros != null 
                            ?
                                <>

                                    {
                                        getExistenDatosResultados == false
                                        ?
                                            <>
                                                <div className='col-md-12 mt-4'>
                                                    <div className="block-content alert-warning text-center">
                                                        <label>LA PLANTILLA NO CUENTA CON PARAMETROS</label>
                                                    </div>
                                                </div>
                                                <br></br>
                                            </>
                                        :
                                            <>
                                                <div className='col-md-12'>
                                                    <label>PARÁMETROS DE LA PLANTILLA</label>
                                                </div>
                                                <div className='col-md-12 mt-2 mb-2'>
                                                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                        <thead>
                                                            <tr>
                                                                <th><b>PARÁMETRO</b></th>
                                                                <th><b>VALOR</b></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            { getListaParametros?.resultados ? cargarInfoParametrosFila() : null }
                                                            { getListaParametros?.resultados ? cargarInfoParametrosTabla() : null }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {
                                                    getCamposAdicionales && getCamposAdicionales.length > 0 ?
                                                    <>
                                                        <div className='col-md-12' style={{ marginTop: '50px' }}>
                                                            <label>CAMPOS ADICIONALES</label>
                                                        </div>
                                                        <div className='col-md-12 mt-2 mb-2'>
                                                            <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full text-uppercase"
                                                                columns={columnsCampos}
                                                                data={getCamposAdicionales}
                                                                noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                                                                striped
                                                            />
                                                        </div>
                                                    </>
                                                    : null
                                                }
                                                <div className='col-md-12 mt-4 mb-2'>
                                                    <label className='mr-2' htmlFor="documento_ruta">DESCARGAR DOCUMENTO PRE-DILIGENCIADO CON LOS VALORES SELECCIONADOS</label>
                                                    <button type="button" title='Descargar documento diligenciado' onClick={() => descargarArchivo()} className="btn btn-rounded btn-primary"> <i className="fas fa-file-word"></i></button>
                                                </div>
                                            </>
                                    }
                                </>
                            :
                                <div className='col-md-12 mt-4'>
                                    <label>CARGANDO PARÁMETROS DE LA PLANTILLA...</label>
                                </div>
                        }
                    </>
            }
        </>
    );

    
}

export default ActuacionParametrosPlantillaForm;