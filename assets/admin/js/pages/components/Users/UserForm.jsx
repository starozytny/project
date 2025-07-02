import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Checkbox, Input, InputFile, SelectCombobox } from "@tailwindComponents/Elements/Fields";

const URL_SELECT_SOCIETIES = "intern_api_selection_societies";
const URL_INDEX_ELEMENTS = "admin_users_index";
const URL_CREATE_ELEMENT = "intern_api_users_create";
const URL_UPDATE_ELEMENT = "intern_api_users_update";

let itemsSocieties = [];

export function UserFormulaire ({ context, element }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { 'id': element.id });
	}

	return  <Form
        context={context}
        url={url}
        society={element ? Formulaire.setValue(element.society.id) : ""}
        username={element ? Formulaire.setValue(element.username) : ""}
        firstname={element ? Formulaire.setValue(element.firstname) : ""}
        lastname={element ? Formulaire.setValue(element.lastname) : ""}
        email={element ? Formulaire.setValue(element.email) : ""}
        avatarFile={element ? Formulaire.setValue(element.avatarFile) : null}
        roles={element ? Formulaire.setValue(element.roles, []) : []}
    />
}

UserFormulaire.propTypes = {
	context: PropTypes.string.isRequired,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			society: props.society,
			username: props.username,
			firstname: props.firstname,
			lastname: props.lastname,
			email: props.email,
			roles: props.roles,
			password: '',
			errors: [],
			loadData: true,
		}

		this.file = React.createRef();
	}

	componentDidMount = () => {

		let self = this;
		axios({ method: "GET", url: Routing.generate(URL_SELECT_SOCIETIES), data: {} })
			.then(function (response) {
				let data = response.data;

				data.forEach(elem => {
					itemsSocieties.push({ value: elem.value, label: elem.label })
				})

				self.setState({ loadData: false })
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	handleChange = (e) => {
		const { roles } = this.state

		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if (name === "roles") {
			value = Formulaire.updateValueCheckbox(e, roles, value);
		}

		this.setState({ [name]: value })
	}

	handleSelect = (name, value) => {
		this.setState({ [name]: value });
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url } = this.props;
		const { username, firstname, lastname, email, roles, society, } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'username', value: username },
			{ type: "text", id: 'firstname', value: firstname },
			{ type: "text", id: 'lastname', value: lastname },
			{ type: "email", id: 'email', value: email },
			{ type: "array", id: 'roles', value: roles },
			{ type: "text", id: 'society', value: society }
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);

			let formData = new FormData();
			formData.append("data", JSON.stringify(this.state));

			let file = this.file.current;
			if (file.state.files.length > 0) {
				formData.append("avatar", file.state.files[0]);
			}

			axios({ method: "POST", url: url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { h: response.data.id });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context, avatarFile } = this.props;
		const { errors, loadData, username, firstname, lastname, email, password, roles, society } = this.state;

		let rolesItems = [
			{ value: 'ROLE_ADMIN', identifiant: 'admin', label: 'Admin' },
			{ value: 'ROLE_USER', identifiant: 'user', label: 'Utilisateur' },
		]

		let params = { errors: errors }
		let params0 = { ...params, ...{ onChange: this.handleChange } }
		let params1 = { ...params, ...{ onSelect: this.handleSelect } }

		return <form onSubmit={this.handleSubmit}>
			<div className="flex flex-col gap-4 xl:gap-6">
				<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
					<div>
						<div className="font-medium text-lg">Identification</div>
						<div className="text-gray-600 text-sm">
							Le nom d'utilisateur est automatiquement formaté, les espaces et les accents sont supprimés ou remplacés.
							{context === "create" ? <span><br /><br />Attention, le nom d'utilisateur ne pourra plus être modifié.</span> : ""}
						</div>
					</div>
					<div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div className="flex gap-4">
							<div className="w-full">
								<Input valeur={username} identifiant="username" {...params0}>Nom utilisateur</Input>
							</div>
							<div className="w-full">
								<Input valeur={email} identifiant="email" {...params0} type="email">Adresse e-mail</Input>
							</div>
						</div>
					</div>
				</div>

				<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
					<div>
						<div className="font-medium text-lg">Profil utilisateur</div>
						<div className="text-gray-600 text-sm">
							Personnalisation du profil.
						</div>
					</div>
					<div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<div className="flex gap-4">
							<div className="w-full">
								<Input identifiant="firstname" valeur={firstname} {...params0}>Prénom</Input>
							</div>
							<div className="w-full">
								<Input identifiant="lastname" valeur={lastname} {...params0}>Nom</Input>
							</div>
						</div>

						<div>
							<Checkbox identifiant="roles" valeur={roles} items={rolesItems} {...params0} classItems="flex gap-4">
								Rôles
							</Checkbox>
						</div>

						<div>
							{loadData
								? <>
									<label>Société</label>
									<LoaderElements text="Récupération des sociétés..." />
								</>
								: <SelectCombobox identifiant="society" valeur={society} items={itemsSocieties}
												  {...params1} toSort={true} placeholder="Sélectionner une société..">
									Société
								</SelectCombobox>
							}
						</div>

						<div>
							<InputFile ref={this.file} type="simple" identifiant="avatar" valeur={avatarFile} {...params0}>
								Avatar <span className="text-sm text-gray-600">(facultatif)</span>
							</InputFile>
						</div>
					</div>
				</div>

				<div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
					<div>
						<div className="font-medium text-lg">Mot de passe</div>
						<div className="text-gray-600 text-sm">
							{context === "create"
								? <div>
									Laisser le champs vide génère un mot de passe aléatoire. L'utilisateur pourra utilise la
									fonction <u>Mot de passe oublié ?</u> pour modifier son mot de passe.
								</div>
								: <div>
									Laisser les champs vides pour ne pas modifier le mot de passe.
								</div>
							}
						</div>
					</div>
					<div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
						<Input identifiant="password" valeur={password} {...params0} type="password" autocomplete="new-password">
							Mot de passe
						</Input>
					</div>
				</div>
			</div>

			<div className="mt-4 flex justify-end gap-2">
				<Button type="blue" isSubmit={true}>
					{context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
				</Button>
			</div>
		</form>
	}
}

Form.propTypes = {
	context: PropTypes.string.isRequired,
	url: PropTypes.node.isRequired,
	username: PropTypes.string.isRequired,
	firstname: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	avatarFile: PropTypes.node,
	roles: PropTypes.array.isRequired,
}
