import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios   from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Checkbox, Input } from "@commonComponents/Elements/Fields";
import { Trumb }            from "@commonComponents/Elements/Trumb";
import { Button }           from "@commonComponents/Elements/Button";

import Formulaire from "@commonFunctions/formulaire";
import Inputs     from "@commonFunctions/inputs";
import Validateur from "@commonFunctions/validateur";

const URL_CREATE_ELEMENT    = "api_agenda_events_create";
const TEXT_CREATE           = "Envoyer le mail";

export function MailFormulaire ({ element })
{
    let form = <Form
        url={Routing.generate(URL_CREATE_ELEMENT)}
    />

    return <div>{form}</div>;
}

MailFormulaire.propTypes = {
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            errors: [],
        }
    }

    componentDidMount = () => { Inputs.initDateInput(this.handleChangeDate, this.handleChange, new Date()) }

    handleChange = (e, picker) => {
        let name  = e.currentTarget.name;
        let value = e.currentTarget.value;

        this.setState({[name]: value})
    }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSwitch = (e) => {
        this.setState({ [e.currentTarget.name]: e.currentTarget.checked ? [parseInt(e.currentTarget.value)] : [0] })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url } = this.props;
        const { name } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'name', value: name},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            Formulaire.loader(true);
            let self = this;

            axios({ method: "POST", url: url, data: this.state })
                .then(function (response) {

                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { errors, name } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line">
                    <Input identifiant="name" valeur={name} {...params}>Objet</Input>
                </div>

                <div className="line-buttons">
                    <Button isSubmit={true} type="primary">{TEXT_CREATE}</Button>
                </div>
            </form>
        </>
    }
}

Form.propTypes = {
    url: PropTypes.node.isRequired,
}
