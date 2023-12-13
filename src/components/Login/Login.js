import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import {Button} from 'react-bootstrap';
import AuthApi from '../Api/Services/AuthApi';
import Spinner from '../Utils/Spinner';
import { setUserSession } from '../../components/Utils/Common';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        window.showSpinner(true);
        setError(null);
        if(email == ''){
            setErrorEmail('CAMPO OBLIGATORIO');
        }
        AuthApi.login(email, password).then(datos => {
            // console.log(datos);
            window.showSpinner(false);
            if (!datos.error) {
                setUserSession(datos.token, datos.user.attributes, datos.funcionalities);
                navigate("/inicio");
            }
            else {

                setError(datos.error);
                setEmail('');
                setPassword('');
            }
        });

       
    }
    
    return (
        <div className="Login">
            <Spinner />
            <div className="row no-gutters justify-content-center bg-body-light ">
                <div className="hero-static col-sm-8 col-md-6 d-flex align-items-center p-2 px-sm-0 ">
                    <div className="block block-rounded block-transparent block-fx-pop w-100 mb-0 overflow-hidden bg-image">
                        <div className="row no-gutters">
                            <div className="col-md-8 order-md-1 bg-white">
                                <div className="block-content block-content-full px-lg-5 py-md-5 py-lg-6">
                                
                                        <div className="mb-2 text-center">
                                            <a className="link-fx font-w700 font-size-h1" asp-action="Index">
                                                <span className="text-dark">INICIO DE SESIÓN</span>
                                            </a>
                                        </div>

                                        <Form onSubmit={handleSubmit} className="js-validation-signin">
                                            <Form.Group size="lg" controlId="email" className="form-group">
                                                <Form.Label>USUARIO</Form.Label>
                                                <Form.Control
                                                    autoFocus
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="form-control form-control-alt"  
                                                />
                                            </Form.Group>
                                            <Form.Group size="lg" controlId="password" className="form-group">
                                                <Form.Label>CONTRASEÑA</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="form-control form-control-alt" Required
                                                />
                                            </Form.Group>
                                            {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
                                            <Form.Group size="lg" controlId="submintButton" className="form-group text-center">
                                            <Button block size="lg" type="submit" disabled={!validateForm()} className="btn btn-rounded btn-primary ">
                                              INICIAR SESIÓN
                                            </Button>
                                            </Form.Group>
                                        </Form>
                                                                        
                                </div>
                            </div>
                            <div className="col-md-4 order-md-0 d-flex align-items-center">
                                <div id="login-alt-container" className="m-auto">
                                    <img src="/assets/images/logo_pdb_azul.png" alt="Logo" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
