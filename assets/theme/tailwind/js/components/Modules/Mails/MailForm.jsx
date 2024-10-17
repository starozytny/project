import React, { Component } from 'react';
import PropTypes from "prop-types";

import axios from "axios";
import { uid } from 'uid'
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Toastr from "@tailwindFunctions/toastr";
import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";
import { CloseModalBtn } from "@tailwindComponents/Elements/Modal";
import { Input, InputFile, Radiobox, SelectMultipleCustom } from "@tailwindComponents/Elements/Fields";

const URL_CREATE_ELEMENT = "intern_api_mails_mail_send";

export function MailFormulaire ({ identifiant, element, tos, from, fromName, onUpdateList = null }) {
	let nTos = [];
	if (tos) {
		tos.forEach((elem, index) => {
			let val = elem.email;
			if (val) nTos.push({ value: val, label: val, inputName: val, identifiant: "to-mail-" + index });
		})
	}

	return <Form
		identifiant={identifiant}
		url={Routing.generate(URL_CREATE_ELEMENT)}
		tos={nTos}
		to={element ? [{ uid: uid(), label: element.email, value: element.email }] : []}
		from={from}
		fromName={fromName ? fromName : ""}

		onUpdateList={onUpdateList}

		key={element ? element.id : 0}
	/>;
}

MailFormulaire.propTypes = {
	identifiant: PropTypes.string.isRequired,
	items: PropTypes.array,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			from: props.from,
			fromName: props.fromName,
			to: props.to,
			cc: [],
			bcc: [],
			subject: "",
			message: { value: "", html: "" },
			theme: 0,
			errors: [],
			openCc: false,
			openBcc: false,
			loadSendData: false,
			resetTextArea: false
		}

		this.select0 = React.createRef();
		this.select1 = React.createRef();
		this.select2 = React.createRef();
		this.file = React.createRef();
	}

	componentDidMount = () => {
		Inputs.initDateInput(this.handleChangeDate, this.handleChange, new Date());
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleChangeTinyMCE = (name, html) => {
		this.setState({ [name]: { value: this.state[name].value, html: html } })
	}

	handleSelect = (name, value) => {
		if (value !== "") {
			this.setState({ errors: [] });

			let validate = Validateur.validateur([{ type: "email", id: "" + [name], value: value }])
			if (!validate.code) {
				Formulaire.showErrors(this, validate);
			} else {
				this.setState({ [name]: [...this.state[name], ...[{ uid: uid(), label: value, value: value }]] });
			}
		}
		if(this[name] && this[name].current){
			this[name].current.handleClose(null, "");
		}
	}

	handleDeselect = (name, uidValue) => {
		let nData = [];
		this.state[name].forEach(val => {
			if (val.uid !== uidValue) nData.push(val);
		})

		this.setState({ [name]: nData });
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url } = this.props;
		const { loadSendData, from, to, subject, message } = this.state;

		this.setState({ errors: [], success: null });

		let paramsToValidate = [
			{ type: "text",  id: 'from', value: from },
			{ type: "array", id: 'to', value: to },
			{ type: "text",  id: 'subject', value: subject },
			{ type: "text",  id: 'message', value: message.html },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			if (!loadSendData) {
				this.setState({ loadSendData: true });

				Formulaire.loader(true);
				let self = this;

				let formData = new FormData();
				formData.append("data", JSON.stringify(this.state));

				let file = this.file.current;
				if (file.state.files.length > 0) {
					file.state.files.forEach((f, index) => {
						formData.append("file-" + index, f);
					})
				}

				axios({ method: "POST", url: url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
					.then(function (response) {
						Toastr.toast('info', "Message envoyé.");
						self.setState({
							subject: "",
							message: { value: "", html: "" },
							resetTextArea: true
						});

						if (self.props.onUpdateList) {
							self.props.onUpdateList(response.data, 'create')
						}
					})
					.catch(function (error) {
						Formulaire.displayErrors(self, error);
					})
					.then(function () {
						Formulaire.loader(false);
						self.setState({ loadSendData: false })
					})
				;
			}

		}
	}

	render () {
		const { identifiant, tos } = this.props;
		const { errors, loadSendData, from, fromName, to, cc, bcc, theme, subject, message, resetTextArea, openCc, openBcc } = this.state;

		let themeItems = [
			{ value: 0, identifiant: "th-none", label: "Aucun thème" },
			{ value: 2, identifiant: "th-agence", label: "Agence" },
		]

		let params0 = { errors: errors, onChange: this.handleChange }
		let params1 = { errors: errors, onClick: this.handleSelect, onDeClick: this.handleDeselect }

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div>
					<div className="flex flex-col gap-4">
						<div>
							<Radiobox items={themeItems} identifiant="theme" valeur={theme} {...params0}
									  classItems="flex gap-2" styleType="fat">
								Thème
							</Radiobox>
						</div>

						<div className="flex gap-2">
							<legend className="block text-sm font-medium leading-6 text-gray-900">De :</legend>
							<div className="font-medium">{from ? (fromName + ' <' + from + '>').trim() : <span className='text-red-500'>Expéditeur invalide.</span>}</div>
						</div>

						<div className="flex items-start gap-2">
							<div className="flex gap-2 w-full">
								<SelectMultipleCustom ref={this.to} identifiant="to" inputValue="" inputValues={to}
													  placeholder="Saisir un email.."
													  items={tos} {...params1}>À</SelectMultipleCustom>
							</div>

							{(!openCc || !openBcc) && <div className="flex items-center gap-2">
								{!openCc && <div className="cursor-pointer text-blue-700 hover:text-blue-600"
												 onClick={() => this.setState({ openCc: true })}>
									Cc
								</div>}
								{!openBcc && <div className="cursor-pointer text-blue-700 hover:text-blue-600"
												  onClick={() => this.setState({ openBcc: true })}>
									Cci
								</div>}
							</div>}
						</div>

						{openCc && <div className="flex gap-2">
							<SelectMultipleCustom ref={this.cc} identifiant="cc" inputValue="" inputValues={cc}
												  placeholder="Saisir un email.."
												  items={tos} {...params1}>Cc</SelectMultipleCustom>
						</div>}

						{openBcc && <div className="flex gap-2">
							<SelectMultipleCustom ref={this.bcc} identifiant="bcc" inputValue="" inputValues={bcc}
												  placeholder="Saisir un email.."
												  items={tos} {...params1}>Cci</SelectMultipleCustom>
						</div>}

						<div>
							<Input identifiant="subject" valeur={subject} {...params0}>Objet</Input>
						</div>

						<div>
							<TinyMCE type={1} identifiant='message' valeur={message.value}
									 errors={errors} onUpdateData={this.handleChangeTinyMCE} key={resetTextArea}>
								Message
							</TinyMCE>
						</div>

						<div>
							<InputFile ref={this.file} type="multiple" identifiant="files" {...params0} format="*" accept="*" max={5}>
								Pièces jointes <span className="text-sm text-gray-600">(5 fichiers maximums)</span>
							</InputFile>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6 border-t">
				<CloseModalBtn identifiant={identifiant} />
				{!loadSendData
					? <Button type="blue" isSubmit={true} onClick={this.handleSubmit}>Envoyer</Button>
					: <Button type="blue" iconLeft="chart-3">Envoyer</Button>
				}
			</div>
		</>
	}
}
