import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios   from 'axios';
import toastr  from 'toastr';
import { uid } from 'uid'
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, SelectMultipleCustom } from "@commonComponents/Elements/Fields";
import { Trumb }            from "@commonComponents/Elements/Trumb";
import { Button }           from "@commonComponents/Elements/Button";
import { Alert }            from "@commonComponents/Elements/Alert";

import Formulaire from "@commonFunctions/formulaire";
import Inputs     from "@commonFunctions/inputs";
import Validateur from "@commonFunctions/validateur";

const URL_CREATE_ELEMENT    = "api_mails_send";
const TEXT_CREATE           = "Envoyer le message";

export function MailFormulaire ({ element, tos })
{
    let nTos = [];
    if(tos){
        tos.forEach((elem, index) => {
            let val = elem.email;
            if(val) nTos.push({ value: val, label: val, inputName: val, identifiant: "to-mail-" + index });
        })
    }
    return <Form
        url={Routing.generate(URL_CREATE_ELEMENT)}
        tos={nTos}
        to={element ? [{uid: uid(), value: element.email}] : []}

        key={element ? element.id : 0}
    />;
}

MailFormulaire.propTypes = {
    items: PropTypes.array,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            to: props.to,
            cc: [],
            cci: [],
            name: "",
            message: {value: "", html: ""},
            errors: [],
            success: null,
            openCc: false,
            openCci: false
        }

        this.select0 = React.createRef();
        this.select1 = React.createRef();
        this.select2 = React.createRef();
    }

    componentDidMount = () => { Inputs.initDateInput(this.handleChangeDate, this.handleChange, new Date()) }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleChangeTrumb = (e) => {
        let name = e.currentTarget.id;
        let text = e.currentTarget.innerHTML;

        this.setState({[name]: {value: [name].value, html: text}})
    }

    handleSelect = (name, value) => {
        if(value !== ""){
            this.setState({ errors: [] });

            let validate = Validateur.validateur( [{type: "email",  id: ""+[name], value: value}])
            if(!validate.code) {
                Formulaire.showErrors(this, validate);
            }else{
                this.setState({ [name]: [...this.state[name], ...[{uid: uid(), value: value}]] });
            }
        }
        let ref;
        if(name === "to") ref = this.select0;
        else if(name === "cc") ref = this.select1;
        else if(name === "cci") ref = this.select2;
        ref.current.handleClose(null, "");
    }

    handleDeselect = (name, uidValue) => {
        let nData = [];
        this.state[name].forEach(val => {
            if(val.uid !== uidValue) nData.push(val);
        })

        this.setState({ [name]: nData });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { url } = this.props;
        const { to, name, message } = this.state;

        this.setState({ errors: [], success: null });

        let paramsToValidate = [
            {type: "array",  id: 'to',      value: to},
            {type: "text",   id: 'name',    value: name},
            {type: "text",   id: 'message', value: message.html},
        ];

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            Formulaire.loader(true);
            let self = this;

            axios({ method: "POST", url: url, data: this.state })
                .then(function (response) {
                    toastr.info("Message envoyé.");
                    self.setState({ success: "Message envoyé.", name: "", message: {value: "", html: ""} });
                })
                .catch(function (error) { console.log(error); Formulaire.displayErrors(self, error);  })
                .then(function () { Formulaire.loader(false);  })
            ;
        }
    }

    render () {
        const { tos } = this.props;
        const { errors, success, to, cc, cci, name, message, openCc, openCci } = this.state;

        let params = { errors: errors, onChange: this.handleChange }
        let params1 = { errors: errors, onClick: this.handleSelect, onDeClick: this.handleDeselect }

        return <>
            <div className="modal-body">
                <form onSubmit={this.handleSubmit}>
                    {success && <div className="line"><div className="form-group"><Alert type="info">{success}</Alert></div></div>}

                    <div className="line line-send-mail-ccs">
                        <SelectMultipleCustom ref={this.select0} identifiant="to" inputValue="" inputValues={to}
                                              items={tos} {...params1}>À</SelectMultipleCustom>
                        {(!openCc || ! openCci) && <div className="ccs">
                            {!openCc && <div onClick={() => this.setState({ openCc: true })}>Cc</div>}
                            {!openCci && <div onClick={() => this.setState({ openCci: true })}>Cci</div>}
                        </div>}
                    </div>
                    {openCc && <div className="line">
                        <SelectMultipleCustom ref={this.select1} identifiant="cc" inputValue="" inputValues={cc}
                                              items={tos} {...params1}>Cc</SelectMultipleCustom>
                    </div>}
                    {openCci && <div className="line">
                        <SelectMultipleCustom ref={this.select2} identifiant="cci" inputValue="" inputValues={cci}
                                              items={tos} {...params1}>Cci</SelectMultipleCustom>
                    </div>}

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
    tos: PropTypes.array.isRequired,
    to: PropTypes.array.isRequired,
}
