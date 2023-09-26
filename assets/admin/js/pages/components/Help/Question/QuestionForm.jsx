import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios   from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, InputView } from "@commonComponents/Elements/Fields";
import { Trumb }  from "@commonComponents/Elements/Trumb";
import { Button } from "@commonComponents/Elements/Button";

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

const URL_INDEX_ELEMENTS    = "admin_help_faq_index";
const URL_CREATE_ELEMENT    = "intern_api_help_faq_questions_create";
const URL_UPDATE_GROUP      = "intern_api_help_faq_questions_update";
const TEXT_CREATE           = "Ajouter la question";
const TEXT_UPDATE           = "Enregistrer les modifications";

export function QuestionFormulaire ({ context, element, category })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    }

    let form = <Form
        context={context}
        url={url}
        category={category}
        name={element ? Formulaire.setValue(element.name) : ""}
        content={element ? Formulaire.setValue(element.content) : ""}
    />

    return <div className="formulaire">{form}</div>;
}

QuestionFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    category: PropTypes.object.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        let content = props.content ? props.content : ""

        this.state = {
            category: props.category.id,
            name: props.name,
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
        const { name, content, category } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'name',     value: name},
            {type: "text",  id: 'category',  value: category},
            {type: "text",  id: 'content',  value: content.html},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            Formulaire.loader(true);
            let self = this;

            axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
                .then(function (response) {
                    location.href = Routing.generate(URL_INDEX_ELEMENTS, {'cat': category});
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context, category } = this.props;
        const { errors, name, content } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Question</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line">
                                <InputView valeur={category.name} errors={errors}>Catégorie</InputView>
                            </div>
                            <div className="line">
                                <Input identifiant="name" valeur={name} {...params}>Intitulé</Input>
                            </div>
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
    content: PropTypes.string.isRequired,
    category: PropTypes.object.isRequired,
}
