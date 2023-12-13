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

            if(filteredSuggestions.length <= 0){
                filteredSuggestions.push({
                    "type": "entidad",
                    "id": "0",
                    "nombre": userInput,
                    "direccion": null,
                    "nombre_secretaria": null,
                    "nombre_sector": null,
                    "paginaweb": null,
                    "correo": null,
                    "telefono": null,
                    "codigopostal": null
                })
            }

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

            if(options.length > 0){
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
    
                this.onTrigger(e, options[0]["nombre"]);
            }
            else{
                this.setState({
                    activeSuggestion: 0,
                    filteredSuggestions: [],
                    showSuggestions: false,
                    userInput: this.state.filteredSuggestions[0]["nombre"],
                    idEntidad: this.state.filteredSuggestions[0]["id"],
                    nombreEntidad: this.state.filteredSuggestions[0]["nombre"],
                    direccion: this.state.filteredSuggestions[0]["direccion"],
                    paginaweb: this.state.filteredSuggestions[0]["paginaweb"],
                    correo: this.state.filteredSuggestions[0]["correo"],
                    telefono: this.state.filteredSuggestions[0]["telefono"],
                    codigopostal: this.state.filteredSuggestions[0]["codigopostal"],
                    nombre_sector: this.state.filteredSuggestions[0]["nombre_sector"],
                    nombre_secretaria: this.state.filteredSuggestions[0]["nombre_secretaria"],
                });
    
                this.onTrigger(e, this.state.filteredSuggestions[0]["nombre"]);
            }


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
                                suggestion["id"] == '0'
                                ?
                                    <li className={className} id={suggestion["id"]} key={suggestion["id"]} onClick={onClick}>
                                        <strong>{suggestion["nombre"]}</strong>
                                    </li>
                                :
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
                </>
            </Fragment>
        );
    }
}

export default Autocomplete;