import React, { Component } from 'react';

import axios            from "axios";
import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire       from "@commonFunctions/formulaire";
import Validateur       from "@commonFunctions/validateur";

import { Input, InputFile } from "@commonComponents/Elements/Fields";
import { Button }       from "@commonComponents/Elements/Button";
import { Alert }        from "@commonComponents/Elements/Alert";

const URL_UPDATE_ELEMENT = "api_settings_update";

function getBase64(file, self) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        self.setState({logoMail: reader.result })
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export class SettingsFormulaire extends Component {
    constructor(props) {
        super(props);

        let element = props.element;

        this.state = {
            errors: [],
            success: false,
            websiteName: element ? element.websiteName : "",
            emailGlobal: element ? element.emailGlobal : "",
            emailContact: element ? element.emailContact : "",
            emailRgpd: element ? element.emailRgpd : "",
            logoMail: element ? element.logoMail : "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleGetFile  = this.handleGetFile .bind(this);
        this.handleRemoveFile  = this.handleRemoveFile .bind(this);
        this.handleSubmit   = this.handleSubmit  .bind(this);
    }

    handleChange = (e) => { this.setState({[ e.currentTarget.name]: e.currentTarget.value})  }
    handleGetFile = (e) => { getBase64(e.file, this) }
    handleRemoveFile = (e) => { this.setState({ logoMail: this.props.data ? this.props.data.logoMail : "" }) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { websiteName, emailGlobal, emailContact, emailRgpd, logoMail } = this.state;

        this.setState({ errors: [], success: false });

        // validate global
        let validate = Validateur.validateur([
            {type: "text",  id: 'websiteName',  value: websiteName},
            {type: "email", id: 'emailGlobal',  value: emailGlobal},
            {type: "email", id: 'emailContact', value: emailContact},
            {type: "email", id: 'emailRgpd',    value: emailRgpd},
            {type: "text",  id: 'logoMail',     value: logoMail},
        ])

        // check validate success
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;
            axios({ method: "POST", url: Routing.generate(URL_UPDATE_ELEMENT), data: self.state })
                .then(function (response) {
                    self.setState({ success: "Paramètres mis à jours", errors: [] });
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
                .then(() => { Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { errors, success, websiteName, emailGlobal, emailContact, emailRgpd, logoMail } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <div className="formulaire">
                <form onSubmit={this.handleSubmit}>

                    {success !== false && <Alert type="info">{success}</Alert>}

                    <div className="line-container">
                        <div className="line">
                            <div className="line-col-1">
                                <div className="title">Informations du site</div>
                            </div>

                            <div className="line-col-2">
                                <div className="line line-2">
                                    <Input valeur={websiteName} identifiant="websiteName" {...params}>Nom du site</Input>
                                    <Input valeur={emailGlobal} identifiant="emailGlobal" {...params} type="email">E-mail expéditeur global</Input>
                                </div>

                                <div className="line line-2">
                                    <Input valeur={emailContact} identifiant="emailContact" {...params} type="email">E-mail expéditeur contact</Input>
                                    <Input valeur={emailRgpd} identifiant="emailRgpd" {...params} type="email">E-mail expéditeur RGPD</Input>
                                </div>

                                <div className="line">
                                    <InputFile ref={this.file} type="simple" identifiant="logoMail" valeur={logoMail}
                                               placeholder="Glissez et déposer votre avatar ou" {...params}>
                                        Logo
                                    </InputFile>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="line-buttons">
                        <Button isSubmit={true} type="primary">Mettre à jour les informations</Button>
                    </div>
                </form>
            </div>
        </>
    }
}
