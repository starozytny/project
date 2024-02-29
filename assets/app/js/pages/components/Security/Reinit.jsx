import React, { Component } from 'react';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Alert } from "@tailwindComponents/Elements/Alert";
import { Button } from "@commonComponents/Elements/Button";
import { Password } from "@commonComponents/Modules/User/Password";

const URL_PASSWORD_UPDATE = "intern_api_users_password_update";

export class Reinit extends Component {
	constructor (props) {
		super(props);

		this.state = {
			password: "",
			password2: "",
			errors: [],
			success: false
		}
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value });
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { token } = this.props;
		const { password, password2 } = this.state;

		this.setState({ errors: [], success: false });

		// validate global
		let validate = Validateur.validateur([
			{ type: "password", id: 'password', value: password, idCheck: 'password2', valueCheck: password2 }
		])

		// check validate success
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			Formulaire.loader(true);
			let self = this;
			axios({ method: "POST", url: Routing.generate(URL_PASSWORD_UPDATE, { 'token': token }), data: self.state })
				.then(function (response) {
					self.setState({ success: response.data.message });
					setTimeout(function () {
						window.location.href = Routing.generate("app_login");
					}, 2500)
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { errors, success, password, password2 } = this.state;

		let params = { errors: errors, onChange: this.handleChange }

		return <>
			<div className="title-page">
				<h1>Réinitialiser son mot de passe</h1>
			</div>

			<div className="content">
				<div className="form">
					<form onSubmit={this.handleSubmit}>

						{success !== false && <Alert type="blue">{success}</Alert>}

						{success === false && <>
							<Password template="col" password={password} password2={password2} params={params} />

							<div className="line-buttons">
								<Button isSubmit={true} type="primary">Modifier son mot de passe</Button>
							</div>
						</>}
					</form>
				</div>
			</div>
		</>
	}
}
