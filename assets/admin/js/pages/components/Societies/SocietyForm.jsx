import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios   from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, InputFile, InputView } from "@commonComponents/Elements/Fields";
import { Button } from "@commonComponents/Elements/Button";

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

const URL_CREATE_ELEMENT    = "api_societies_create";
const URL_UPDATE_GROUP      = "api_societies_update";
const TEXT_CREATE           = "Ajouter la société";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function SocietyFormulaire ({ context, element })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    }

    let form = <Form
        context={context}
        url={url}
        code={element ? Formulaire.setValue(element.code) : ""}
        name={element ? Formulaire.setValue(element.name) : ""}
        logoFile={element ? Formulaire.setValue(element.logoFile) : null}
    />

    return <div className="formulaire">{form}</div>;
}

SocietyFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: props.code,
            name: props.name,
            errors: [],
        }

        this.file = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url } = this.props;
        const { code, name } = this.state;

        this.setState({ errors: [], success: false });

        let paramsToValidate = [
            {type: "text",  id: 'username',  value: code},
            {type: "text",  id: 'firstname', value: name},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            let file = this.file.current;
            if(file.state.files.length > 0){
                formData.append("logo", file.state.files[0]);
            }

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    let data = response.data;
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
                .then(() => { Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context, logoFile } = this.props;
        const { errors, code, name } = this.state;


        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Identification</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-2">
                                <Input identifiant="name" valeur={name} {...params}>Nom de la société</Input>
                                <Input identifiant="code" valeur={code} {...params} placeholder="XXX">Code</Input>
                            </div>
                            <div className="line">
                                <InputView valeur={code ? code : 'XXX'} errors={errors}>Manager</InputView>
                            </div>
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Profil</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line">
                                <InputFile ref={this.file} type="simple" identifiant="logo" valeur={logoFile}
                                           placeholder="Glissez et déposer votre logo ou" {...params}>
                                    Logo
                                </InputFile>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="line-buttons">
                    <Button isSubmit={true} type="primary">{context === "create" ? TEXT_CREATE : TEXT_UPDATE}</Button>
                </div>
            </form>
        </>
    }
}

Form.propTypes = {
    context: PropTypes.string.isRequired,
    url: PropTypes.node.isRequired,
    code: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    logoFile: PropTypes.node,
}
