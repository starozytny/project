import React, { Component } from 'react';

import axios            from "axios";
import toastr           from "toastr";
import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire       from "@commonFunctions/formulaire";
import Validateur       from "@commonFunctions/validateur";

import { Input, InputFile } from "@commonComponents/Elements/Fields";
import { Button }       from "@commonComponents/Elements/Button";

const URL_UPDATE_ELEMENT = "api_settings_update";

export class SettingsFormulaire extends Component {
    constructor(props) {
        super(props);

        let element = props.element;

        this.state = {
            errors: [],
            websiteName: element ? element.websiteName : "",
            emailGlobal: element ? element.emailGlobal : "",
            emailContact: element ? element.emailContact : "",
            emailRgpd: element ? element.emailRgpd : "",
            logoMail: element ? element.logoMail : "",
        }

        this.file = React.createRef();
    }

    handleChange = (e) => { this.setState({[ e.currentTarget.name]: e.currentTarget.value})  }

    handleSubmit = (e) => {
        e.preventDefault();

        const { websiteName, emailGlobal, emailContact, emailRgpd, logoMail } = this.state;

        this.setState({ errors: [] });

        // validate global
        let validate = Validateur.validateur([
            {type: "text",  id: 'websiteName',  value: websiteName},
            {type: "email", id: 'emailGlobal',  value: emailGlobal},
            {type: "email", id: 'emailContact', value: emailContact},
            {type: "email", id: 'emailRgpd',    value: emailRgpd},
            {type: "text",  id: 'logoMail',     value: logoMail},
        ])

        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else{
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            let file = this.file.current;
            if(file.state.files.length > 0){
                formData.append("logo", file.state.files[0]);
            }

            axios({ method: "POST", url: Routing.generate(URL_UPDATE_ELEMENT), data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    toastr.info("Paramètres mis à jours");
                    setTimeout(() => { location.reload() }, 2000)
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { errors, websiteName, emailGlobal, emailContact, emailRgpd, logoMail } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <div className="formulaire">
                <form onSubmit={this.handleSubmit}>

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
                                               placeholder="Glissez et déposer votre logo ou" {...params}>
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
