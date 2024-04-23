import React, { Component } from 'react';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { Password } from "@tailwindComponents/Modules/User/Password";
import { Alert } from "@tailwindComponents/Elements/Alert";

const URL_PASSWORD_UPDATE = "intern_api_users_password_update";

export class UserPassword extends Component {
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

		let validate = Validateur.validateur([
			{ type: "password", id: 'password', value: password, idCheck: 'password2', valueCheck: password2 }
		])

		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			Formulaire.loader(true);
			let self = this;
			axios({ method: "POST", url: Routing.generate(URL_PASSWORD_UPDATE, { 'token': token }), data: this.state })
				.then(function (response) {
					self.setState({ success: "Mot de passe modifié." })
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
		const { context } = this.props;
		const { errors, success, password, password2 } = this.state;

		let params = { errors: errors, onChange: this.handleChange }

		return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4">
                <div>
                    <Password template="inline" context={context} password={password} password2={password2} params={params} />
                </div>
                {success && <div><Alert type="blue">{success}</Alert></div>}
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <Button type="blue" isSubmit={true}>Modifier son mot de passe</Button>
            </div>
        </form>
    }
}
