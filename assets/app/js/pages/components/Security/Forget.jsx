import React, { Component } from 'react';
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Input } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";
import { Alert } from "@tailwindComponents/Elements/Alert";

import Validateur from "@commonFunctions/validateur";
import Formulaire from "@commonFunctions/formulaire";

const URL_PASSWORD_FORGET = "intern_api_users_password_forget";

export class Forget extends Component {
	constructor (props) {
		super(props);

		this.state = {
			fUsername: "",
			errors: [],
			success: false
		}

		this.modal = React.createRef();
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value });
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { fUsername } = this.state;

		this.setState({ errors: [], success: false })

		let validate = Validateur.validateur([{ type: "text", id: 'fUsername', value: fUsername }])
		if (!validate.code) {
			this.setState({ errors: validate.errors });
		} else {
			Formulaire.loader(true);
			let self = this;
			axios({ method: "POST", url: Routing.generate(URL_PASSWORD_FORGET), data: self.state })
				.then(function (response) {
					self.setState({ success: response.data.message, fUsername: '' });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
				.then(() => {
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { errors, success, fUsername } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange }

		return <>
            <span className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500" onClick={() => this.modal.current.handleClick()}>
				Mot de passe oublié ?
			</span>
			{createPortal(<Modal ref={this.modal} identifiant='forget-modal' maxWidth={568} title="Mot de passe oublié"
								 content={<div className="form">
									 <p className="form-infos">
										 Une fois la demande réalisée, un mail est envoyé à l'adresse associé au compte.
										 Ce mail contient un lien vous permettant de réinitialiser votre mot de passe. <br /> <br />
										 <i>Pensez à vérifier vos spams/courriers indésirables.</i>
									 </p>
									 <form onSubmit={(e) => e.preventDefault()} method="post" className="mt-2">
										 {success !== false && <Alert type="blue">{success}</Alert>}

										 {success === false && <div>
											 <Input valeur={fUsername} identifiant="fUsername" {...params0}>Nom utilisateur</Input>
										 </div>}
									 </form>
								 </div>}
								 showClose={false}
								 footer={<>
									 <div className="close-modal"><Button type="default">{success === false ? "Annuler" : "Fermer"}</Button></div>
									 {success === false && <>
										 <Button type="blue" onClick={this.handleSubmit}>Envoyer un lien de réinitialisation</Button>
									 </>}
								 </>}
			/>, document.body)}
		</>
	}
}
