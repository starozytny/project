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
    return <Form
        url={Routing.generate(URL_CREATE_ELEMENT)}
    />;
}

MailFormulaire.propTypes = {
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            to: [],
            cc: [],
            cci: [],
            name: "",
            message: {value: "", html: ""},
            errors: [],
        }
    }

    componentDidMount = () => { Inputs.initDateInput(this.handleChangeDate, this.handleChange, new Date()) }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url } = this.props;
        const { to, name, message } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "array",  id: 'to',      value: to},
            {type: "text",   id: 'name',    value: name},
            {type: "text",   id: 'message', value: message},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            // Formulaire.loader(true);
            // let self = this;
            //
            // axios({ method: "POST", url: url, data: this.state })
            //     .then(function (response) {
            //
            //     })
            //     .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            // ;
        }
    }

    render () {
        const { errors, to, cc, cci, name, message } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                    {/*<div className="line">*/}
                    {/*    <Input identifiant="to" valeur={to} {...params}>À</Input>*/}
                    {/*</div>*/}
                    <div className="line">
                        <Input identifiant="name" valeur={name} {...params}>Objet</Input>
                    </div>
                    <div className="line">
                        <Trumb identifiant="message" valeur={message.value} errors={errors} onChange={this.handleChangeTrumb}>
                            Message
                        </Trumb>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <Button onClick={this.handleSubmit} type="primary">{TEXT_CREATE}</Button>
                <div className="close-modal"><Button type="reverse">Annuler</Button></div>
            </div>
        </>
    }
}

Form.propTypes = {
    url: PropTypes.node.isRequired,
}
