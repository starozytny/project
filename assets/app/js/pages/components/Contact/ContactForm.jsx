import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, TextArea } from "@commonComponents/Elements/Fields";
import { Button } from "@commonComponents/Elements/Button";

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";
import { Alert } from "@tailwindComponents/Elements/Alert";

const URL_CREATE_ELEMENT = "intern_api_contacts_create";
const TEXT_CREATE = "Envoyer la demande";

export function ContactFormulaire () {
	let form = <Form
		url={Routing.generate(URL_CREATE_ELEMENT)}
	/>

	return <div className="formulaire">{form}</div>;
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			name: "",
			email: "",
			message: "",
			critere: "",
			errors: [],
			messageAxios: null,
		}
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url } = this.props;
		const { name, email, message, critere } = this.state;

		if (critere !== "") {
			toastr.error("Veuillez rafraichir la page.")
		} else {
			this.setState({ errors: [], messageAxios: null });

			let paramsToValidate = [
				{ type: "text", id: 'name', value: name },
				{ type: "email", id: 'email', value: email },
				{ type: "text", id: 'message', value: message },
			];

			let validate = Validateur.validateur(paramsToValidate)
			if (!validate.code) {
				Formulaire.showErrors(this, validate);
			} else {
				Formulaire.loader(true);
				let self = this;

				axios({ method: "POST", url: url, data: this.state })
					.then(function (response) {
						self.setState({ name: "", email: "", message: "", messageAxios: { status: "blue", msg: "Message envoyé." } })
					})
					.catch(function (error) {
						Formulaire.displayErrors(self, error);
					})
					.then(function () {
						Formulaire.loader(false);
					})
				;
			}
		}
	}

	render () {
		const { errors, messageAxios, name, email, message, critere } = this.state;

		let params = { errors: errors, onChange: this.handleChange }

		return <>
			<form onSubmit={this.handleSubmit}>

				{messageAxios && <div className="line"><Alert type={messageAxios.status}>{messageAxios.msg}</Alert></div>}

				<div className="line line-2">
					<Input identifiant="name" valeur={name} {...params}>Nom/Prénom</Input>
					<Input identifiant="email" valeur={email} type="email" {...params}>Adresse e-mail</Input>
				</div>
				<div className="line-critere">
					<Input type="hidden" identifiant="critere" valeur={critere} {...params}>Critère</Input>
				</div>
				<div className="line line-fat-box">
					<TextArea identifiant="message" valeur={message} {...params}>Message</TextArea>
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
