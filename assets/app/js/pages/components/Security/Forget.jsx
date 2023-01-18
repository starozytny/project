import React, { Component } from 'react';

import axios   from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Alert }  from "@commonComponents/Elements/Alert";
import { Input }  from "@commonComponents/Elements/Fields";
import { Button } from "@commonComponents/Elements/Button";
import { Modal }  from "@commonComponents/Elements/Modal";

const URL_FORGET_PASSWORD = "api_users_password_forget";

export class Forget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fUsername: "",
            errors: [],
            success: false
        }

        this.modal = React.createRef();
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}); }

    handleSubmit = (e) => {
        e.preventDefault();

        const { fUsername } = this.state;

        this.setState({ errors: [], success: false });

        // validate global
        let validate = Validateur.validateur([
            { type: "text", id: 'fUsername', value: fUsername }
        ])

        // check validate success
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: Routing.generate(URL_FORGET_PASSWORD), data: self.state })
                .then(function (response) {
                    self.setState( { success: response.data.message, errors: [], fUsername: '' });
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
                .then(() => { Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { errors, success, fUsername } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        let aside = <div className="form">
            <p className="form-infos">
                Une fois la demande réalisée, un mail est envoyé à l'adresse associé au compte.
                Ce mail contient un lien vous permettant de réinitialiser votre mot de passe. <br/> <br/>
                Pensez à vérifier vos spams/courriers indésirables.
            </p>
            <form onSubmit={(e) => e.preventDefault()} method="post">
                {success !== false && <Alert type="info">{success}</Alert>}

                {success === false && <div className="line">
                    <Input valeur={fUsername} identifiant="fUsername" {...params}>Nom utilisateur</Input>
                </div>}

            </form>
        </div>

        return <>
            <span className="btn-forget" onClick={() => this.modal.current.handleClick()}>Mot de passe oublié ?</span>
            <Modal ref={this.modal} identifiant='forget-modal' maxWidth={568} title="Mot de passe oublié"
                   content={aside} showClose={false}
                   footer={<>
                       {success === false && <>
                           <Button type="primary" onClick={this.handleSubmit}>Envoyer un lien de réinitialisation</Button>
                       </>}
                       <div className="close-modal"><Button type="cancel">{success === false ? "Annuler" : "Fermer"}</Button></div>
                   </>}
            />
        </>
    }
}
