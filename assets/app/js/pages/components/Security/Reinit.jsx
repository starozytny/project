import React, { Component } from 'react';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Validateur from "@commonFunctions/validateur";
import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { Alert } from "@tailwindComponents/Elements/Alert";
import { Password } from "@tailwindComponents/Modules/User/Password";

const URL_UPDATE_PASSWORD = 'intern_api_users_password_update'

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

		this.setState({ errors: [], success: false })

		let validate = Validateur.validateur([
			{ type: "password", id: 'password', value: password, idCheck: 'password2', valueCheck: password2 }
		])

		if (!validate.code) {
			this.setState({ errors: validate.errors });
		} else {
			Formulaire.loader(true);
			let self = this;
			axios({ method: "POST", url: Routing.generate(URL_UPDATE_PASSWORD, { 'token': token }), data: self.state })
				.then(function (response) {
					self.setState({ password: "", password2: "", success: response.data.message, errors: [] });
					setTimeout(function () {
						window.location.href = Routing.generate("app_login");
					}, 5000)
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

	render () {
		const { errors, success, password, password2 } = this.state;

		let params = { errors: errors, onChange: this.handleChange }

		return <form onSubmit={this.handleSubmit}>

			{success !== false && <Alert type="blue">{success}</Alert>}

			{success === false && <>
				<Password password={password} password2={password2} params={params} />

				<div className="mt-4 flex justify-end">
					<Button type="blue" isSubmit={true}>Modifier son mot de passe</Button>
				</div>
			</>}
		</form>
	}
}
