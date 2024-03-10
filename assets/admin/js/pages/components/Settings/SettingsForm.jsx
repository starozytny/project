import React, { Component } from 'react';

import axios from "axios";
import toastr from "toastr";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input, InputFile, Switcher } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";

const URL_UPDATE_ELEMENT = "admin_settings_update";

export class SettingsFormulaire extends Component {
	constructor (props) {
		super(props);

		let element = props.element;

		this.state = {
			errors: [],
			websiteName: element ? Formulaire.setValue(element.websiteName) : "",
			emailGlobal: element ? Formulaire.setValue(element.emailGlobal) : "",
			emailContact: element ? Formulaire.setValue(element.emailContact) : "",
			emailRgpd: element ? Formulaire.setValue(element.emailRgpd) : "",
			logoMail: element ? Formulaire.setValue(element.logoMail) : "",
			multipleDatabase: element ? [element.multipleDatabase ? 1 : 0] : [0],
			prefixDatabase: element ? Formulaire.setValue(element.prefixDatabase) : "",
		}

		this.file = React.createRef();
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if (name === "multipleDatabase") {
			value = e.currentTarget.checked ? [parseInt(value)] : [0];
		}

		this.setState({ [name]: value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { websiteName, emailGlobal, emailContact, emailRgpd, multipleDatabase, prefixDatabase } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text",  id: 'websiteName', value: websiteName },
			{ type: "email", id: 'emailGlobal', value: emailGlobal },
			{ type: "email", id: 'emailContact', value: emailContact },
			{ type: "email", id: 'emailRgpd', value: emailRgpd },
		];

		if (multipleDatabase[0] === 1) {
			paramsToValidate = [...paramsToValidate, ...[{ type: "text", id: 'prefixDatabase', value: prefixDatabase }]];
		}

		// validate global
		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			Formulaire.loader(true);
			let self = this;

			let formData = new FormData();
			formData.append("data", JSON.stringify(this.state));

			let file = this.file.current;
			if (file.state.files.length > 0) {
				formData.append("logo", file.state.files[0]);
			}

			axios({ method: "POST", url: Routing.generate(URL_UPDATE_ELEMENT), data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
				.then(function (response) {
					toastr.info(response.data.message);
					setTimeout(() => {
						location.reload()
					}, 2000)
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { errors, websiteName, emailGlobal, emailContact, emailRgpd, logoMail, multipleDatabase, prefixDatabase } = this.state;

		let multipleItems = [{ value: 1, label: "Oui", identifiant: "oui" }];

		let params0 = { errors: errors, onChange: this.handleChange }

		return <form onSubmit={this.handleSubmit}>
			<div className="flex flex-col gap-4 xl:gap-6">
				<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
					<div>
						<div className="font-medium text-lg">Identification</div>
						<div className="text-gray-600 text-sm">
							Identification du site.
						</div>
					</div>
					<div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<Input identifiant="websiteName" valeur={websiteName} {...params0}>Nom du site</Input>
					</div>
				</div>

				<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
					<div>
						<div className="font-medium text-lg">Mails</div>
						<div className="text-gray-600 text-sm">
							Email par défaut et logo des mails.
						</div>
					</div>
					<div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div className="grid gap-4 sm:grid-cols-3">
							<div>
								<Input identifiant="emailGlobal" valeur={emailGlobal} {...params0} type="email">
									E-mail expéditeur global
								</Input>
							</div>
							<div>
								<Input identifiant="emailContact" valeur={emailContact} {...params0} type="email">
									E-mail expéditeur contact
								</Input>
							</div>
							<div>
								<Input identifiant="emailRgpd" valeur={emailRgpd} {...params0} type="email">
									E-mail expéditeur RGPD
								</Input>
							</div>
						</div>
						<div className="mt-4">
							<InputFile ref={this.file} type="simple" identifiant="logoMail" valeur={logoMail} {...params0}>
								Logo <span className="text-sm text-gray-600">(facultatif)</span>
							</InputFile>
						</div>
					</div>
				</div>

				<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
					<div>
						<div className="font-medium text-lg">Base de données</div>
						<div className="text-gray-600 text-sm">
							La configuration <i>multiple base de données</i> permet
							l'utilisation et la semi automatisation d'une base de donnée par société.
						</div>
					</div>
					<div className="flex gap-2 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div className="w-full">
							<Switcher items={multipleItems} identifiant="multipleDatabase" valeur={multipleDatabase} {...params0}>
								Multiple base de données
							</Switcher>
						</div>
						{multipleDatabase[0]
							? <div className="w-full">
								<Input valeur={prefixDatabase} identifiant="prefixDatabase" {...params0}>Prefix</Input>
							</div>
							: null
						}
					</div>
				</div>
			</div>

			<div className="mt-4 flex justify-end gap-2">
				<Button type="blue" isSubmit={true}>Mettre à jour</Button>
			</div>
		</form>
	}
}
