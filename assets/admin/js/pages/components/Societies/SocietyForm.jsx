import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import axios from 'axios';

import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input, InputFile } from "@tailwindComponents/Elements/Fields";
import { Button, ButtonA } from "@tailwindComponents/Elements/Button";

const URL_INDEX_ELEMENTS = "admin_societies_index";
const URL_CREATE_ELEMENT = "intern_api_societies_create";
const URL_UPDATE_GROUP = "intern_api_societies_update";
const TEXT_CREATE = "Ajouter la société";
const TEXT_UPDATE = "Enregistrer les modifications";

export function SocietyFormulaire ({ context, element }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_GROUP, { 'id': element.id });
	}

	return <Form
		context={context}
		url={url}
		code={element ? Formulaire.setValue(element.code) : ""}
		name={element ? Formulaire.setValue(element.name) : ""}
		logoFile={element ? Formulaire.setValue(element.logoFile) : null}
	/>
}

SocietyFormulaire.propTypes = {
	context: PropTypes.string.isRequired,
	element: PropTypes.object
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			code: props.code,
			name: props.name,
			errors: [],
		}

		this.file = React.createRef();
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if(name === "code"){
			value = Inputs.textNumericInput(value, this.state[name])
		}

		this.setState({ [name]: value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url } = this.props;
		const { code, name } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'code', value: code },
			{ type: "text", id: 'name', value: name },
		];

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

			axios({ method: "POST", url: url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { 'h': response.data.id });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context, logoFile } = this.props;
		const { errors, code, name } = this.state;

		let params = { errors: errors, onChange: this.handleChange }

		return <>
			<form onSubmit={this.handleSubmit}>
				<div className="flex flex-col gap-4 xl:gap-6">
					<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
						<div>
							<div className="font-medium text-lg">Identification</div>
							<div className="text-gray-600 text-sm">
								Le champ manager dépend du code de la société.
								Il sert dans l'utilisation de plusieurs base données lié au site.
							</div>
						</div>
						<div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
							<div>
								<Input identifiant="name" valeur={name} {...params}>Nom de la société</Input>
							</div>
							<div>
								<Input identifiant="code" valeur={code} {...params} placeholder="XXX">Code Société</Input>
							</div>
						</div>
					</div>
					<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
						<div>
							<div className="font-medium text-lg">Logo</div>
							<div className="text-gray-600 text-sm">
								Le logo de la société n'est pas utilisé dans le sens fonctionnel, dans le site actuel.
								Il est seulement visible dans la liste des sociétés.
							</div>
						</div>
						<div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
							<div className="line">
								<InputFile ref={this.file} type="simple" identifiant="logo" valeur={logoFile}{...params}>
									Logo <span className="text-sm text-gray-600">(facultatif)</span>
								</InputFile>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 flex justify-end gap-2">
					<ButtonA type="default" onClick={Routing.generate(URL_INDEX_ELEMENTS)}>Annuler</ButtonA>
					<Button type="blue" isSubmit={true}>
						{context === "create" ? TEXT_CREATE : TEXT_UPDATE}
					</Button>
				</div>
			</form>
		</>
	}
}
