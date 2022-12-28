import React, { Component } from 'react';

import axios            from "axios";
import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input }        from "@dashboardComponents/Tools/Fields";
import { Button }       from "@dashboardComponents/Tools/Button";
import { Alert }        from "@dashboardComponents/Tools/Alert";
import Validateur       from "@commonComponents/functions/validateur";
import Formulaire       from "@dashboardComponents/functions/Formulaire";

export class Reinit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            passwordConfirm: "",
            errors: [],
            success: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}); }

    handleSubmit = (e) => {
        e.preventDefault();

        const { token } = this.props;
        const { password, passwordConfirm } = this.state;

        this.setState({ success: false})

        // validate global
        let validate = Validateur.validateur([
            {type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}
        ])

        // check validate success
        if(!validate.code){
            this.setState({ errors: validate.errors });
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: Routing.generate("api_users_password_update", {'token': token}), data: self.state })
                .then(function (response) {
                    self.setState({  password: "", passwordConfirm: "", success: response.data.message, errors: [] });
                    setTimeout(function (){
                        window.location.href = Routing.generate("app_login");
                    }, 5000)
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error);
                })
                .then(function (){
                    Formulaire.loader(false);
                })
            ;
        }
    }

    render () {
        const { errors, success, password, passwordConfirm } = this.state;

        return <>
            <div className="title-page">
                <h1>Réinitialiser son mot de passe</h1>
            </div>

            <div className="form">
                <form onSubmit={this.handleSubmit}>

                    {success !== false && <Alert type="info">{success}</Alert>}

                    {success === false && <>
                        <div className="line line-2">
                            <div className="form-group">
                                <div className="line">
                                    <Input type="password" valeur={password} identifiant="password" errors={errors} onChange={this.handleChange}>Mot de passe</Input>
                                </div>
                                <div className="line">
                                    <Input type="password" valeur={passwordConfirm} identifiant="passwordConfirm" errors={errors} onChange={this.handleChange}>Confirmer le mot de passe</Input>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="password-rules">
                                    <p>Règles de création de mot de passe :</p>
                                    <ul>
                                        <li>Au moins 12 caractères</li>
                                        <li>Au moins 1 minuscule</li>
                                        <li>Au moins 1 majuscule</li>
                                        <li>Au moins 1 chiffre</li>
                                        <li>Au moins 1 caractère spécial</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="line line-buttons">
                            <div className="form-button">
                                <Button isSubmit={true} type="color0">Modifier son mot de passe</Button>
                            </div>
                        </div>
                    </>}
                </form>
            </div>
        </>
    }
}
