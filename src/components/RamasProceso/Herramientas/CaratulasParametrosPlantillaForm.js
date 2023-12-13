import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import GenericApi from '../../Api/Services/GenericApi';
import Spinner from '../../Utils/Spinner';
import ModalGen from '../../Utils/Modals/ModalGeneric';
import '../../Utils/Constants';
import { getUser } from '../../Utils/Common';

function CaratulasParametrosPlantillaForm(props) {

    const location = useLocation()
    const { from } = location.state;
    const caratulaId = props.caratulaId;
    const radicado = from.radicado;
    const procesoDisciplinarioId = from.procesoDisciplinarioId;
    const id_etapa = from.idEtapa;
    const fechaRegistro = from.fechaRegistro;
    const fechaIngreso = from.fechaIngreso;
    const dependencia = getUser().nombre_dependencia ? getUser().nombre_dependencia.nombre : "";
    const registradoPor = from.registradoPor;
    const vigencia = from.vigencia;
    const generadoPor = getUser().nombre_completo ? getUser().nombre_completo : "";

    const [modalState, setModalState] = useState({ title: "", message: "", show: false });
    const [getListaParametros, setListaParametros] = useState({ params: [] });
    const [getListaCamposPorParametroTemporal, setListaCamposPorParametroTemporal] = useState({ data: [] });
    const [getListaParametrosBaseDatos, setListaParametrosBaseDatos] = useState({ data: [] });
    //const [getListaCamposPorParametroDefinitiva, setListaCamposPorParametroDefinitiva] = useState({ data: [] });
    const [getAntecedentesLista, setAntecedentesLista] = useState({ data: [], links: [], meta: [] });
    const [getInteresadosLista, setInteresadosLista] = useState({ data: [], links: [], meta: [] });
    const [getEntidadesInvestigadoLista, setEntidadesInvestigadoLista] = useState({ data: [], links: [], meta: [] });
    const [getCargosInvestigadoLista, setCargosInvestigadoLista] = useState({ data: [], links: [], meta: [] });
    const [getEntidadInvestigadoLista, setEntidadInvestigadoLista] = useState({ data: [], links: [], meta: [] });
    const [getParametrosCampos, setParametrosCampos] = useState();

    // const campos = [
    //     { title: "N° Proceso", value: radicado, type: "N° Proceso", check: false },
    //     { title: "Sinproc", value: radicado, type: "Sinproc", check: false },
    //     { title: 'Antecedentes', value: null, type: "Antecedentes", check: false },
    //     { title: 'Usuario', value: registradoPor, type: "Usuario", check: false },
    //     { title: 'Dependencia', value: dependencia, check: false },
    //     { title: 'Vigencia', value: vigencia, type: "Vigencia", check: false },
    //     { title: 'Fecha Registro', value: fechaRegistro, type: "Fecha Registro", check: false },
    //     { title: 'Fecha Ingreso', value: fechaIngreso, type: "Fecha Ingreso", check: false },
    //     { title: "Generado", value: generadoPor, type: "Generado", check: false },
    // ];

    useEffect(() => {
        async function fetchData() {
            cargarTablaParametrosCaratula();
        }
        fetchData();
    }, [props.id_mas_actuacion]);

    const selectCampos = (parametro) => {

        return (
            getListaParametrosBaseDatos.map((item, i) => {

                var itemFilter = getListaCamposPorParametroTemporal.data.filter(x => x.parametro == parametro);

                if (itemFilter != undefined && itemFilter.length > 0 && itemFilter[0].id_campo === i) {
                    return (
                        <option selected key={i} value={i}>{item.title}</option>
                    )
                } else {
                    return (
                        <option key={i} value={i}>{item.title}</option>
                    )
                }
            })
        )
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
                var nombre = `${p.attributes.sujeto_procesal_nombre} ${p.attributes.primer_apellido} ${p.attributes.segundo_apellido} ${p.attributes.primer_nombre} ${p.attributes.segundo_nombre}`;
                return nombre;
            }
        }).filter(x => x != undefined);
        selectChangeListaCampos(parametro, id_campo, val.toString());
    }

    function checkeoAutomaticoInteresados(parametro, id_campo) {
        setInteresadosLista(getInteresadosLista);
        var nombre = `${getInteresadosLista[0].attributes.sujeto_procesal_nombre} ${getInteresadosLista[0].attributes.primer_apellido} ${getInteresadosLista[0].attributes.segundo_apellido} ${getInteresadosLista[0].attributes.primer_nombre} ${getInteresadosLista[0].attributes.segundo_nombre}`;
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

    const selectAntecedentes = (parametro, id_campo) => {
        if (Array.isArray(getAntecedentesLista)) {

            // Se valida que sea un array la lista y que su longitud sea igual a 1
            if (getAntecedentesLista && getAntecedentesLista.length == 1) {
                checkeoAutomaticoAntecedentes(parametro, id_campo);
                return (
                    <div className="col-md-12" key={'keyCheck' + getAntecedentesLista[0].id} >
                        <input type="checkbox"
                            className="form-check-input"
                            id={'check' + getAntecedentesLista[0].id}
                            name={'check' + getAntecedentesLista[0].id}
                            value={getAntecedentesLista[0].id}
                            //onChange={(e) => handleChangeInteresados(0, parametro, id_campo)}
                            defaultChecked={true}
                            disabled /> {getAntecedentesLista[0].attributes.descripcion}
                    </div >
                )
            } else if (getAntecedentesLista.length > 1) {
                return (
                    getAntecedentesLista.map((item, i) => {
                        return (
                            <div className="col-md-12" key={'keyCheck' + item.id}>
                                <input type="checkbox"
                                    className="form-check-input"
                                    id={'check' + item.id}
                                    name={'check' + item.id}
                                    value={item.id}
                                    onChange={(e) => handleChangeAntecedentes(e, parametro, id_campo)}
                                    defaultChecked={item.checked} /> {item.attributes.descripcion}
                            </div>
                            // <option key={item.attributes.descripcion} value={item.attributes.descripcion}>{item.attributes.descripcion}</option>
                        )
                    })
                )
            }
        }
    }

    const selectInteresados = (parametro, id_campo) => {
        if (Array.isArray(getInteresadosLista)) {

            // Se valida que sea un array la lista y que su longitud sea igual a 1
            if (getInteresadosLista && getInteresadosLista.length == 1) {
                checkeoAutomaticoInteresados(parametro, id_campo);
                var nombre = `${getInteresadosLista[0].attributes.sujeto_procesal_nombre} ${getInteresadosLista[0].attributes.primer_apellido} ${getInteresadosLista[0].attributes.segundo_apellido} ${getInteresadosLista[0].attributes.primer_nombre} ${getInteresadosLista[0].attributes.segundo_nombre}`;
                return (
                    <div className="col-md-12" key={'keyCheck' + getInteresadosLista[0].id} >
                        <input type="checkbox"
                            className="form-check-input"
                            id={'check' + getInteresadosLista[0].id}
                            name={'check' + getInteresadosLista[0].id}
                            value={getInteresadosLista[0].id}
                            //onChange={(e) => handleChangeInteresados(0, parametro, id_campo)}
                            defaultChecked={true}
                            disabled /> {nombre}
                    </div >
                )
            } else if (getInteresadosLista.length > 1) {
                return (
                    getInteresadosLista.map((item, i) => {
                        var nombre = `${item.attributes.sujeto_procesal_nombre} ${item.attributes.primer_apellido} ${item.attributes.segundo_apellido} ${item.attributes.primer_nombre} ${item.attributes.segundo_nombre}`;
                        return (
                            <div className="col-md-12" key={'keyCheck' + nombre}>
                                <input type="checkbox"
                                    className="form-check-input"
                                    id={'check' + nombre}
                                    name={'check' + nombre}
                                    value={item.id}
                                    onChange={(e) => handleChangeInteresados(e, parametro, id_campo)}
                                    defaultChecked={item.checked} /> {nombre}
                            </div>
                            // <option key={nombre} value={nombre}>{nombre}</option>
                        )
                    })
                )
            }
        }
    }

    const selectInvestigados = (parametro, id_campo) => {
        if (Array.isArray(getEntidadesInvestigadoLista)) {

            // Se valida que sea un array la lista y que su longitud sea igual a 1
            if (getEntidadesInvestigadoLista && getEntidadesInvestigadoLista.length == 1) {
                checkeoAutomaticoInvestigadosNombre(parametro, id_campo);
                let nombre = `${getEntidadesInvestigadoLista[0].attributes.nombre_investigado}`;
                if (nombre == "null") {
                    nombre = "NO_APLICA";
                }
                return (
                    <div className="col-md-12" key={'keyCheck' + getEntidadesInvestigadoLista[0].id} >
                        <input type="checkbox"
                            className="form-check-input"
                            id={'check' + getEntidadesInvestigadoLista[0].id}
                            name={'check' + getEntidadesInvestigadoLista[0].id}
                            value={getEntidadesInvestigadoLista[0].id}
                            //onChange={(e) => handleChangeInteresados(0, parametro, id_campo)}
                            defaultChecked={true}
                            disabled /> {nombre}
                    </div >
                )
            } else if (getEntidadesInvestigadoLista.length > 1) {

                return (
                    getEntidadesInvestigadoLista.map((item, i) => {
                        var value = `${item.attributes.nombre_investigado}`;
                        var nombre = `${item.attributes.nombre_investigado}`;

                        if (nombre != "null") {
                            return (
                                <div className="col-md-12" key={nombre}>
                                    <input type="checkbox"
                                        className="form-check-input"
                                        id={nombre}
                                        name={nombre}
                                        value={nombre}
                                        onChange={(e) => handleChangeInvestigados(e, parametro, id_campo)}
                                        defaultChecked={item.checked} /> {nombre}
                                </div>
                                //<option key={value} value={value}>{nombre}</option>
                            )
                        }
                    })
                )
            }
        }
    }

    const selectCargosInvestigados = (parametro, id_campo) => {
        if (Array.isArray(getCargosInvestigadoLista)) {

            // Se valida que sea un array la lista y que su longitud sea igual a 1
            if (getCargosInvestigadoLista && getCargosInvestigadoLista.length == 1) {
                checkeoAutomaticoInvestigadosCargo(parametro, id_campo);
                var nombre = `${getCargosInvestigadoLista[0].attributes.cargo}`;
                if (nombre == "null") {
                    nombre = "NO_APLICA";
                }
                return (
                    <div className="col-md-12" key={'keyCheck' + getCargosInvestigadoLista[0].id} >
                        <input type="checkbox"
                            className="form-check-input"
                            id={'check' + getCargosInvestigadoLista[0].id}
                            name={'check' + getCargosInvestigadoLista[0].id}
                            value={getCargosInvestigadoLista[0].id}
                            //onChange={(e) => handleChangeInteresados(0, parametro, id_campo)}
                            defaultChecked={true}
                            disabled /> {nombre}
                    </div >
                )
            } else if (getCargosInvestigadoLista.length > 1) {

                return (
                    getCargosInvestigadoLista.map((item, i) => {
                        var value = `${item.attributes.cargo}`;
                        var nombre = `${item.attributes.cargo}`;

                        if (nombre != "null") {
                            return (
                                <div className="col-md-12" key={nombre}>
                                    <input type="checkbox"
                                        className="form-check-input"
                                        id={nombre}
                                        name={nombre}
                                        value={nombre}
                                        onChange={(e) => handleChangeCargosInvestigados(e, parametro, id_campo)}
                                        defaultChecked={item.checked} /> {nombre}
                                </div>
                                // <option key={value} value={value}>{nombre}</option>
                            )
                        }
                    })
                )
            }
        }
    }

    const selectEntidadesInvestigados = (parametro, id_campo) => {
        if (Array.isArray(getEntidadInvestigadoLista)) {

            // Se valida que sea un array la lista y que su longitud sea igual a 1
            if (getEntidadInvestigadoLista && getEntidadInvestigadoLista.length == 1) {
                checkeoAutomaticoInvestigadosEntidad(parametro, id_campo);
                var nombre = `${getEntidadInvestigadoLista[0].attributes.nombre_entidad}`;
                if (nombre == "null") {
                    nombre = "NO_APLICA";
                }
                return (
                    <div className="col-md-12" key={'keyCheck' + getEntidadInvestigadoLista[0].id} >
                        <input type="checkbox"
                            className="form-check-input"
                            id={'check' + getEntidadInvestigadoLista[0].id}
                            name={'check' + getEntidadInvestigadoLista[0].id}
                            value={getEntidadInvestigadoLista[0].id}
                            //onChange={(e) => handleChangeInteresados(0, parametro, id_campo)}
                            defaultChecked={true}
                            disabled /> {nombre}
                    </div >
                )
            } else if (getEntidadInvestigadoLista.length > 1) {

                return (
                    getEntidadInvestigadoLista.map((item, i) => {
                        var value = `${item.attributes.nombre_entidad}`;
                        var nombre = `${item.attributes.nombre_entidad}`;

                        if (nombre != "null") {
                            return (
                                <div className="col-md-12" key={nombre}>
                                    <input type="checkbox"
                                        className="form-check-input"
                                        id={nombre}
                                        name={nombre}
                                        value={nombre}
                                        onChange={(e) => handleChangeEntidadesInvestigados(e, parametro, id_campo)}
                                        defaultChecked={item.checked} /> {nombre}
                                </div>
                                //<option key={value} value={value}>{nombre}</option>
                            )
                        }
                    })
                )
            }
        }
    }

    const cargarValoresDeParametro = (parametro) => {

        const arrayOtherElements = [
            "Dependencia Origen",
            "Delegada",
            "Radicado",
            "Radicación",
            "Auto"
        ];

        var campoParametro = getListaCamposPorParametroTemporal.data.filter(item => {
            return item.parametro == parametro;
        });

        var tempCampo = campoParametro[0];

        if (tempCampo != undefined && getListaParametrosBaseDatos[tempCampo.id_campo] != undefined) {
            var itemCampo = getListaParametrosBaseDatos[tempCampo.id_campo];

            // Tiene un valor por defecto
            if (itemCampo.value != null) {

                // Se asigna el valor a la lista temporal
                var newParamsItem = getListaCamposPorParametroTemporal.data.map(item => {
                    if (item.parametro == parametro) {
                        item.id_campo = tempCampo.id_campo;
                        var itemCampoId = getListaParametrosBaseDatos[tempCampo.id_campo];
                        item.valor = (itemCampoId.value != null) ? itemCampoId.value : "";
                        item.valorTemporal = (itemCampoId.value != null) ? itemCampoId.value : "";
                    }
                    return item;
                });

                // Se deshabilita cuando es sinproc o dependencia
                var validarElemento = document.getElementById('id' + itemCampo.title);
                if (validarElemento && !validarElemento.hasAttribute("disabled")) {
                    validarElemento.setAttribute("disabled", "true");
                }

                return (
                    <>{itemCampo.value}</>
                )
            } else if (itemCampo.type == "Antecedentes") {

                var validarElemento = document.getElementById('id' + tempCampo.parametro);
                if (validarElemento && !validarElemento.hasAttribute("disabled")) {
                    validarElemento.setAttribute("disabled", "true");
                }

                return (
                    <div className="custom-control custom-switch custom-control-lg mb-2">
                        {selectAntecedentes(parametro, tempCampo.id_campo)}
                    </div>
                )
            } else {
                var validarElemento = document.getElementById('id' + itemCampo.title);
                if (validarElemento && !validarElemento.hasAttribute("disabled")) {
                    validarElemento.setAttribute("disabled", "true");
                }

                return (
                    <label>Campo Inactivo</label>
                )
            }
        }

        // let idLabelParametro = 'idValorSeleccionado' + tempCampo.parametro;

        return (<label> El campo debe estar dentro de la lista parametrizable para asignarle un valor</label >)

    }

    const cargarCheckParametro = (parametro) => {

        return (
            <div className="col-md-12" key={'keyCheck' + parametro + '1'} >
                <input type="checkbox"
                    className="form-check-input"
                    id={'check' + parametro + '1'}
                    name={'check' + parametro + '1'}
                    value={parametro + '1'}
                    onChange={(e) => handleChangeStatus(e, parametro)}
                />
            </div >
        )
    }

    const handleChangeStatus = (e, parametro) => {

        // Se captura el elemento enviado por parametros
        var itemFilter = getListaCamposPorParametroTemporal.data.filter(x => x.parametro == parametro);

        // Se valida si esta checkeado
        if (e.target.checked) {

            // Se devuelve el valor a vacio
            var newParams = getListaCamposPorParametroTemporal.data.map(item => {

                // Se valida que el item recorrido sea igual al parametro checkeado
                if (item.parametro == parametro) {

                    // Se captura el id del campo
                    item.id_campo = itemFilter[0].id_campo;
                    var itemCampo = getListaParametrosBaseDatos[itemFilter[0].id_campo];

                    // Se redefine el valor del item a vacio
                    item.valor = "";
                    item.valorTemporal = (itemCampo.value != null) ? itemCampo.value : itemFilter[0].value;
                }

                // Se retorna el item
                return item;
            });


        } else {

            // Se devuelve el valor a vacio
            var newParams = getListaCamposPorParametroTemporal.data.map(item => {

                // Se valida que el item recorrido sea igual al parametro checkeado
                if (item.parametro == parametro) {

                    // Se captura el id del campo
                    item.id_campo = itemFilter[0].id_campo;
                    var itemCampo = getListaParametrosBaseDatos[itemFilter[0].id_campo];

                    // Se redefine el valor del item a su valor original
                    item.valor = item.valorTemporal;
                    item.valorTemporal = (itemCampo.value != null) ? itemCampo.value : itemFilter[0].value;
                }

                // Se retorna el item
                return item;
            });
        }
    }

    const selectChangeListaCampos = (parametro, id_campo, value) => {

        // console.log("selectChangeListaCampos >> " + parametro + " " + id_campo + " " + value);

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

    const columns = [
        {
            name: 'PARÁMETROS',
            cell: parametro => <div><strong>{parametro}</strong></div>,
            sortable: true,
            width: "20%",
        },
        {
            name: 'NOMBRE DEL CAMPO',
            cell: parametro =>
                <select className="form-control" id={`id${parametro}`} name={`name${parametro}`}
                    onChange={e => selectChangeListaCampos(parametro, e.target.value, "")}>
                    <option value="">Por favor seleccione</option>
                    {selectCampos(parametro)}
                </select>,
            sortable: false,
            width: "25%",
        },
        {
            name: 'VALOR DEL CAMPO SELECCIONADO',
            width: "50%",
            cell: parametro =>
                <div className='row'>
                    <div className='col'>
                        {cargarValoresDeParametro(parametro)}
                    </div>
                </div>,
        },
        // {
        //     name: 'Activar/Inactivar',
        //     width: "10%",
        //     cell: parametro =>
        //         <div className='row'>
        //             <div className='col'>
        //                 {cargarCheckParametro(parametro)}
        //             </div>
        //         </div>
        // }
    ];

    // Metodo encargado de cargar los parametros generales de la plantilla de la BD
    const cargarTablaParametrosCaratula = () => {

        // Se inicializa el array
        var array = [];

        // Se inicializa la API
        GenericApi.getGeneric('parametro_campos_caratula').then(

            // Se inicializa la variable de respuesta
            datos => {

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
        if (element == "Sinproc" && estado) {
            valor = radicado;
        } else if (element == "Usuario" && estado) {
            valor = registradoPor;
        } else if (element == "Dependencia" && estado) {
            valor = dependencia;
        } else if (element == "Vigencia" && estado) {
            valor = vigencia;
        } else if (element == "Fecha Registro" && estado) {
            valor = fechaRegistro;
        } else if (element == "Fecha Ingreso" && estado) {
            valor = fechaIngreso;
        } else if (element == "Generado" && estado) {
            valor = generadoPor;
        }

        // Se retorna el valor
        return valor;
    }

    // Metodo encargado de cargar la lista de parametros de la plantilla
    const cargarParametros = (listaParametrosBaseDatos) => {

        // Se setea el array en null
        setListaParametros(null);

        // Se inicializa la data
        const data = {
            "data": {
                "type": 'caratulas',
                "attributes": {
                    "id": caratulaId
                }
            }
        }

        // Se inicializa la API que carga la lisata de parametros de la plantilla
        GenericApi.getByDataGeneric('caratulas/parametros-plantilla/' + caratulaId, data).then(

            // Se inicializa la variable de respuesta
            datos => {

                // Se valida que no haya error
                if (!datos.error) {

                    // Se setea la lista
                    setListaParametros(datos);

                    // Se recorre el array de datos
                    var parametrosCampos = datos.params.map((item, i) => {

                        // Se ejecuta una busqueda del elemento
                        var indexCampo = listaParametrosBaseDatos.findIndex(
                            x =>
                                x.title == item);

                        if (indexCampo >= 0) {
                            return { parametro: item, id_campo: indexCampo, valor: "" };
                        } else {
                            return { parametro: item, id_campo: "", valor: "" };
                        }
                    });

                    setListaCamposPorParametroTemporal({ data: parametrosCampos });

                    // Se cargan los antecedentes, interesados y entidades del investigado
                    cargarEntidadesInvestigado();
                    cargarAntecedentes();
                    cargarInteresados();
                }
            }
        )
    }

    const cargarAntecedentes = () => {
        const data = {
            "data": {
                "type": 'antecedente',
                "attributes": {
                    "antecedentes": "antecedentes",
                    "descripcion": "descripcion",
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "fecha_registro": Date.now(),
                    "id_dependencia": -1,
                    "estado": "1",
                    'per_page': 100,
                    'current_page': 1
                }
            }
        }
        GenericApi.getByDataGeneric('antecedentes/get-antecedentes/' + procesoDisciplinarioId, data).then(
            datos => {
                if (!datos.error) {

                    var parametrosCampos = datos.data.map((item) => {
                        item.checked = false;
                        return item;
                    });

                    setAntecedentesLista(parametrosCampos);
                }
            }
        )
    }

    const cargarInteresados = () => {
        const data = {
            "data": {
                "type": "interesado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "tipo_documento": "1",
                    "numero_documento": "1",
                    "primer_nombre": "1",
                    "segundo_nombre": "1",
                    "primer_apellido": "1",
                    "segundo_apellido": "1",
                    "estado": "1",
                    'per_page': 100,
                    'current_page': 1
                }
            }
        }

        GenericApi.getByDataGeneric('datos-interesado/datos-interesado/' + procesoDisciplinarioId, data).then(
            datos => {
                if (!datos.error) {
                    var parametrosCampos = datos.data.map((item) => {
                        item.checked = false;
                        return item;
                    });
                    setInteresadosLista(parametrosCampos);
                } else {
                    setModalState({ title: "Datos del interesado", message: datos.error.toString(), show: true, redirect: null, from: { from } });
                }
            }
        )
    }

    const cargarEntidadesInvestigado = () => {
        const data = {
            "data": {
                "type": "entidad_investigado",
                "attributes": {
                    "id_proceso_disciplinario": procesoDisciplinarioId,
                    "id_etapa": "1",
                    "requiere_registro": true,
                    "estado": "1",
                    'per_page': 100,
                    'current_page': 1
                }
            }
        }

        GenericApi.getByDataGeneric("entidad-investigado/get-entidad-investigado/" + procesoDisciplinarioId, data).then(
            datos => {
                if (!datos.error) {
                    var parametrosCampos = datos.data.map((item) => {

                        var nombreInvestigado = item.attributes.nombre_investigado;
                        var cargoInvestigado = item.attributes.cargo;
                        var entidadInvestigado = item.attributes.nombre_entidad;

                        if (nombreInvestigado == null) {
                            item.attributes.nombre_investigado = "NO_APLICA";
                        }

                        if (cargoInvestigado == null) {
                            item.attributes.cargo = "NO_APLICA";
                        }

                        if (entidadInvestigado == null) {
                            item.attributes.nombre_entidad = "NO_APLICA";
                        }

                        item.checked = false;
                        return item;
                    });
                    setEntidadesInvestigadoLista(parametrosCampos);
                    setCargosInvestigadoLista(parametrosCampos);
                    setEntidadInvestigadoLista(parametrosCampos);
                }
                else {
                    setModalState({ title: "Entidades del investigado", message: datos.error.toString(), show: true, redirect: null, from: { from } });
                }

            }
        )
    }

    const descargarArchivo = () => {
        try {
            window.showSpinner(true);

            var params = getListaCamposPorParametroTemporal.data.map(item => {
                return {
                    "param": item.parametro,
                    "value": item.valor
                };
            });
            // console.log("######params#####");
            // console.log(params);

            const data = {
                "data": {
                    "type": "caratulas",
                    "attributes": {
                        "params": params,
                    }
                }
            }
            GenericApi.getByDataGeneric('caratulas/plantilla-diligenciada/' + caratulaId, data).then(
                datos => {
                    window.showSpinner(false);
                    if (!datos.error) {
                        downloadBase64File(datos.content_type, datos.base_64, datos.file_name, "pdf");
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

    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    return (
        <>
            <Spinner />
            <ModalGen data={modalState} />
            {getListaParametros != null ?
                <>
                    <div className='col-md-12'>
                        <label>PARÁMETROS DE LA PLANTILLA</label>
                    </div>
                    <div className='col-md-12 mt-2 mb-2'>
                        <DataTable className="table table-bordered table-striped table-vcenter js-dataTable-full"
                            columns={columns}
                            data={getListaParametros.params}
                            noDataComponent={global.Constants.DATA_TABLE.SIN_DATOS_TABLE}
                            striped
                        />
                    </div>

                    <div className='col-md-12 mt-4 mb-2 text-center'>
                        <button type="button" onClick={() => descargarArchivo()} className="btn btn-rounded btn-primary" title='Descargar'><i className="fas fa-file-pdf"></i> Descargar carátula</button>
                    </div>
                </>
                :
                <div className='col-md-12'>
                    <label>Cargando parametros de la plantilla...</label>
                </div>}
        </>
    );
}

export default CaratulasParametrosPlantillaForm;