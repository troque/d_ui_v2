import React, { Component, Fragment, useEffect, useState } from "react";
import { Field } from 'formik';
const fetch = require("node-fetch");

class Autocomplete extends Component {

    constructor(props) {

        super(props);

        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: "",
            idEntidad: "",
            nombreEntidad: "",
            direccion: "",
            paginaweb: "",
            correo: "",
            telefono: "",
            codigopostal: "",
            cargoInformacionPersoneria: false,
            informacionPersoneria: []
        };
    }

    onLoad = (dataPersoneria) => {

        let informacionPersoneria = this.state.cargoInformacionPersoneria;

        if (dataPersoneria && dataPersoneria.length > 0) {

            this.setState({
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: this.state.userInput != "" ? dataPersoneria["nombre"] : "",
                idEntidad: this.state.idEntidad != "" ? dataPersoneria["id"] : "",
                nombreEntidad: this.state.nombreEntidad != "" ? dataPersoneria["nombreEntidad"] : "",
                direccion: this.state.direccion != "" ? dataPersoneria["direccion"] : "",
                paginaweb: this.state.paginaweb != "" ? dataPersoneria["paginaweb"] : "",
                correo: this.state.correo != "" ? dataPersoneria["correo"] : "",
                telefono: this.state.telefono != "" ? dataPersoneria["telefono"] : "",
                codigopostal: this.state.codigopostal != "" ? dataPersoneria["codigopostal"] : "",
                nombre_sector: this.state.nombre_sector != "" ? dataPersoneria["nombre_sector"] : "",
                nombre_secretaria: this.state.nombre_secretaria != "" ? dataPersoneria["nombre_secretaria"] : "",
            });

            this.onTrigger("", dataPersoneria["id"]);
        }

        return () => {
            this.setState({

            });
        }

    }

    onTrigger = (event, id) => {
        this.props.parentCallback(id);
        event.preventDefault();
    }

    onChange = e => {
        try {

            const { suggestions } = this.props;

            const userInput = e.currentTarget.value;

            const filteredSuggestions = suggestions.data.filter(
                suggestion =>
                    (suggestion["id"] + " " + suggestion["nombre"]).toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );

            this.setState({
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: true,
                userInput: e.currentTarget.value,
                idEntidad: "",
                nombreEntidad: "",
                direccion: "",
                paginaweb: "",
                correo: "",
                telefono: "",
                codigopostal: "",
            });

            if (e.currentTarget.value == "") {
                this.onTrigger(e, "");
            }

        } catch (error) {
            console.error("Error " + error);
        }
    };

    onClick = e => {
        try {

            const { suggestions } = this.props;
            const options = suggestions.data.filter(
                suggestion =>
                    suggestion["id"] == e.currentTarget.id
            );

            this.setState({
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: options[0]["nombre"],
                idEntidad: options[0]["id"],
                nombreEntidad: options[0]["nombre"],
                direccion: options[0]["direccion"],
                paginaweb: options[0]["paginaweb"],
                correo: options[0]["correo"],
                telefono: options[0]["telefono"],
                codigopostal: options[0]["codigopostal"],
                nombre_sector: options[0]["nombre_sector"],
                nombre_secretaria: options[0]["nombre_secretaria"],
            });

            this.onTrigger(e, e.currentTarget.id);

        } catch (error) {
            console.error(error);
        }
    };

    onKeyDown = e => {

        try {
            const { activeSuggestion, filteredSuggestions } = this.state;
            if (filteredSuggestions[activeSuggestion]) {


                if (e.keyCode === 13) {
                    this.setState({
                        activeSuggestion: 0,
                        showSuggestions: false,
                        userInput: filteredSuggestions[activeSuggestion]["id"] + " " + filteredSuggestions[activeSuggestion]["nombre"],
                        idEntidad: filteredSuggestions[activeSuggestion]["id"],
                        nombreEntidad: filteredSuggestions[activeSuggestion]["nombre"],
                        direccion: filteredSuggestions[activeSuggestion]["direccion"],
                        paginaweb: filteredSuggestions[activeSuggestion]["paginaweb"],
                        correo: filteredSuggestions[activeSuggestion]["correo"],
                        telefono: filteredSuggestions[activeSuggestion]["telefono"],
                        codigopostal: filteredSuggestions[activeSuggestion]["codigopostal"],
                        nombre_sector: filteredSuggestions[activeSuggestion]["nombre_sector"],
                        nombre_secretaria: filteredSuggestions[activeSuggestion]["nombre_secretaria"]
                    });

                    this.onTrigger(e, filteredSuggestions[activeSuggestion]["id"]);
                } else if (e.keyCode === 38) {
                    if (activeSuggestion === 0) {
                        return;
                    }
                    this.setState({ activeSuggestion: activeSuggestion - 1 });
                }
                // User pressed the down arrow, increment the index
                else if (e.keyCode === 40) {
                    if (activeSuggestion - 1 === filteredSuggestions.length) {
                        return;
                    }
                    this.setState({ activeSuggestion: activeSuggestion + 1 });
                }


            }


        } catch (error) {
            console.error(error);
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;

        let suggestionsListComponent;

        const { dataPersoneria } = this.state;

        // {
        //     dataPersoneria.length > 0 ?
        //         onLoad(dataPersoneria) :
        //         null
        // };

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }
                            return (
                                <li className={className} id={suggestion["id"]} key={suggestion["id"]} onClick={onClick}>
                                    <strong>{suggestion["id"]} - {suggestion["nombre"]}</strong> <br />{suggestion["direccion"]} - {suggestion["paginaweb"]} - {suggestion["correo"]} - {suggestion["telefono"]} - {suggestion["codigopostal"]} - {suggestion["nombre_sector"]} - {suggestion["nombre_secretaria"]}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                suggestionsListComponent = (
                    <div className="no-suggestions">
                        <em>Sin resultados.</em>
                    </div>

                );

                this.props.parentCallback("");
            }
        }

        return (
            <Fragment>
                <input
                    type="text"
                    id="idEntidad" name="idEntidad"
                    className="form-control"
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onLoadedData={this.onLoad(dataPersoneria)}
                    value={userInput}
                    autoComplete="off"
                />
                {suggestionsListComponent}
                <>
                    {
                        (this.state.nombreEntidad !== '') ?
                            (
                                <div>
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='sector'>SECTOR <span className="text-danger">*</span></label>
                                                <Field value={this.state.nombre_sector} disabled type="text" id="sector" name="sector" className="form-control" />

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='secretaria'>SECRETARIA <span className="text-danger">*</span></label>
                                                <Field value={this.state.nombre_secretaria} type="text" id="secretaria" disabled name="secretaria" className="form-control" />

                                            </div>
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="form-group">
                                            <div className="block-header block-header-default">
                                                <b style={{ fontSize: '18px' }}>DATOS BÁSICOS DE LA ENTIDAD SELECCIONADA: </b>
                                            </div>

                                            <div className="block block-rounded block-bordered">

                                                <div className="block-content block-content-full">
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                                                <thead>
                                                                    <tr>
                                                                        <th colSpan="4">{this.state.idEntidad} / {this.state.nombreEntidad}</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>DIRECCIÓN</td>
                                                                        <td><Field value={this.state.direccion} disabled type="text" className="form-control" /></td>
                                                                        <td>PÁGINA WEB</td>
                                                                        <td><Field value={this.state.paginaweb} disabled type="text" className="form-control" /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>CORREO</td>
                                                                        <td><Field value={this.state.correo} disabled type="text" className="form-control" /></td>
                                                                        <td>TELÉFONO</td>
                                                                        <td><Field value={this.state.telefono} disabled type="text" className="form-control" /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>CÓDIGO POSTAL</td>
                                                                        <td colSpan="3" >
                                                                            <Field value={this.state.codigopostal} disabled type="text" className="form-control" />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                    }
                </>
            </Fragment>
        );
    }
}

export default Autocomplete;