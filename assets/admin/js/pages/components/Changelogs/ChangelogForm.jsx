import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, Radiobox }  from "@commonComponents/Elements/Fields";
import { Trumb }            from "@commonComponents/Elements/Trumb";
import { Button }           from "@commonComponents/Elements/Button";

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

const URL_INDEX_ELEMENTS    = "admin_changelogs_index";
const URL_CREATE_ELEMENT    = "api_changelogs_create";
const URL_UPDATE_GROUP      = "api_changelogs_update";
const TEXT_CREATE           = "Ajouter le changelog";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function ChangelogFormulaire ({ context, element })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    }

    let form = <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
        type={element ? Formulaire.setValue(element.type) : 0}
        content={element ? Formulaire.setValue(element.content) : ""}
    />

    return <div className="formulaire">{form}</div>;
}

ChangelogFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        let content = props.content ? props.content : ""

        this.state = {
            name: props.name,
            type: props.type,
            content: { value: content, html: content },
            errors: [],
        }
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url } = this.props;
        const { name, type, content } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'name', value: name},
            {type: "text",  id: 'type', value: type},
            {type: "text",  id: 'content', value: content},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            let self = this;
            Formulaire.loader(true);
            axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
                .then(function (response) { location.href = Routing.generate(URL_INDEX_ELEMENTS, {'h': response.data.id}); })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context } = this.props;
        const { errors, name, type, content } = this.state;

        let typesItems = [
            { value: 0, label: 'Information',  identifiant: 'type-0' },
            { value: 1, label: 'Attention',    identifiant: 'type-1' },
            { value: 2, label: 'Danger',       identifiant: 'type-2' },
        ]

        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Titre</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line">
                                <Input identifiant="name" valeur={name} {...params}>Intitulé</Input>
                            </div>
                            <div className="line line-fat-box">
                                <Radiobox items={typesItems} identifiant="type" valeur={type} {...params}>
                                    Rôles
                                </Radiobox>
                            </div>
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Contenu</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line">
                                <Trumb identifiant="content" valeur={content.value} errors={errors} onChange={this.handleChangeTrumb}>
                                    Description
                                </Trumb>
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
    name: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
}
