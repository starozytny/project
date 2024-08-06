import React, { Component } from "react";

import axios from "axios";
import Routing from "@publicFolder/bundles/fosjsrouting/js/router.min";

import Toastr from "@tailwindFunctions/toastr";
import Inputs from "@commonFunctions/inputs";
import Validateur from "@commonFunctions/validateur";
import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { Alert } from "@tailwindComponents/Elements/Alert";
import { Input, TextArea } from "@tailwindComponents/Elements/Fields";

const URL_CREATE_ELEMENT = "intern_api_immo_demandes_create";

export class DemandeFormulaire extends Component {
	constructor (props) {
		super(props);

		this.state = {
			toEmail: props.toEmail,
			bienId: props.bienId,
			slug: props.slug,
			price: props.price,
			libelle: props.libelle,
			zipcode: props.zipcode,
			city: props.city,
			typeAd: props.typeAd,
			typeBien: props.typeBien,
			reference: props.reference,
			errors: [],
			success: null,
			critere: "",
			name: "",
			email: "",
			phone: "",
			message: ""
		}
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if(name === "phone"){
			value = Inputs.textNumericInput(value, this.state[name])
		}

		this.setState({ [name]: value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { critere, name, email, message } = this.state;

		this.setState({ errors: [], success: false })

		if (critere !== "") {
			Toastr.toast('error', "Veuillez rafraichir la page.");
		} else {

			let validate = Validateur.validateur([
				{ type: "text", id: 'name', value: name },
				{ type: "text", id: 'email', value: email },
				{ type: "text", id: 'message', value: message },
			])

			if (!validate.code) {
				this.setState({ errors: validate.errors });
				Toastr.toast('warning', "Veuillez vérifier que tous les champs obligatoires soient renseignés.");
			} else {
				Formulaire.loader(true);
				let self = this;
				axios.post(Routing.generate(URL_CREATE_ELEMENT), self.state)
					.then(function (response) {
						let data = response.data;
						self.setState({
							name: "",
							email: "",
							phone: "",
							message: "",
							errors: [],
							success: data.message
						})
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
	}

	render () {
		const { errors, success, critere, name, email, phone, message } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

		return <form onSubmit={this.handleSubmit}>
			<div className="flex flex-col gap-4">
				{success && <div><Alert type="blue" icon="check1">{success}</Alert></div>}

				<div className="w-full">
					<Input identifiant="name" valeur={name} {...params0}>Nom / Raison sociale</Input>
				</div>

				<div className="flex gap-4">
					<div className="w-full">
						<Input identifiant="email" valeur={email} {...params0} type="email">Adresse e-mail</Input>
					</div>
					<div className="w-full">
						<Input identifiant="phone" valeur={phone} {...params0}>Téléphone</Input>
					</div>
				</div>
				<div>
					<TextArea identifiant="message" valeur={message} {...params0}>Message</TextArea>
				</div>
				<div className="critere">
					<Input identifiant="critere" valeur={critere} {...params0}>Critère</Input>
				</div>
			</div>
			<div className="mt-4">
				<Alert type="gray" icon="question">
					<div className="text-sm">
						Les données à caractère personnel collectées dans ce formulaire sont enregistrées dans un fichier
						informatisé permettant la gestion des demandes de contact des annonces. <br />
						En validant ce formulaire, vous consentez à nous transmettre vos données pour traiter votre demande
						et vous recontacter si besoin.
						<br />
						<br />
						Nous vous informons de l'existence du service Bloctel qui permet de vous opposer à tout démarchage téléphonique (<a className="text-blue-700 underline" href="https://www.bloctel.gouv.fr/">https://www.bloctel.gouv.fr/</a>)
						<br />
						<br />
						Plus d'informations sur le traitement de vos données dans
						notre <a target="_blank" href={Routing.generate('app_politique')} className="text-blue-700 underline">politique de confidentialité</a>.
					</div>
				</Alert>
			</div>
			<div className="mt-4">
				<Button type="blue" isSubmit={true} width="w-full" pa="p-4">Nous contacter</Button>
			</div>
		</form>
	}
}
