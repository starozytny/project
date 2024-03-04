import React, { Component } from 'react';

import axios from "axios";
import toastr from "toastr";
import { uid } from 'uid'
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Validateur from "@commonFunctions/validateur";
import Formulaire from "@commonFunctions/formulaire";
import Sanitaze from "@commonFunctions/sanitaze";

import { Input, InputFile, Radiobox, SelectCustom, SelectMultipleCustom } from "@tailwindComponents/Elements/Fields";
import { Alert } from "@tailwindComponents/Elements/Alert";
import { Button } from "@tailwindComponents/Elements/Button";
import { Trumb } from "@tailwindComponents/Elements/Trumb";
import { CloseModalBtn } from "@tailwindComponents/Elements/Modal";

const URL_CREATE_ELEMENT = "intern_api_mails_create";
const URL_PREVIEW_ELEMENT = "intern_api_mails_preview";
const URL_DRAFT_ELEMENT = "intern_api_mails_draft";

let i = 0;

export function MailFormulaire ({
									type = "create", users, element, from, to, cc, bcc, theme, onUpdateList,
									styleForm, identifiant,
									subject = "", message = "", typeDefaultFrom = "website",
									havePreview = false, haveDraft = true,
									urlRedirect = null, refModal = null, extraInfos = [],
									mBiens = [], bienMail = "", displayBiens = false
								}) {

	let nTos = [];
	if (users) {
		users.forEach((elem, index) => {
			let val = elem.email;
			if (val) nTos.push({ value: val, label: val, inputName: val, identifiant: "to-mail-" + index });
		})
	}

	let form = <Form
		styleForm={styleForm}
		identifiant={identifiant}
		context={type}
		url={Routing.generate(URL_CREATE_ELEMENT)}
		tos={nTos}

		from={from ? from : (element ? Formulaire.setValue(element.expeditor, null) : null)}
		to={to ? to : (element ? Formulaire.setValue(element.destinators, []) : [])}
		cc={cc ? cc : (element ? Formulaire.setValue(element.cc, []) : [])}
		bcc={bcc ? bcc : (element ? Formulaire.setValue(element.bcc, []) : [])}
		theme={theme ? theme : (element ? Formulaire.setValue(element.theme, 2) : 2)}
		subject={element ? Formulaire.setValue(element.subject, subject) : subject}
		title={element ? Formulaire.setValue(element.title, "") : ""}
		message={element ? Formulaire.setValue(element.message, message) : message}
		isDraft={!!element}
		id={element ? Formulaire.setValue(element.id, null) : null}

		typeDefaultFrom={typeDefaultFrom}

		havePreview={havePreview}
		haveDraft={haveDraft}

		urlRedirect={urlRedirect}
		refModal={refModal}

		extraInfos={extraInfos}

		bienMail={bienMail}
		mBiens={mBiens}
		displayBiens={displayBiens}

		onUpdateList={onUpdateList}
	/>

	if(styleForm === 1){
		return <div className="p-4">{form}</div>;
	}else if(styleForm === 2){
		return form;
	}

	return <div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200">
		{form}
	</div>;
}

export class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			from: props.from,
			to: props.to,
			cc: props.cc,
			bcc: props.bcc,
			theme: props.theme,
			subject: props.subject,
			title: props.title,
			message: { value: props.message, html: props.message },
			errors: [],
			success: false,
			showCc: !!props.cc.length,
			showBcc: !!props.bcc.length,
			isDraft: props.isDraft,
			id: props.id,
			typeDefaultFrom: props.typeDefaultFrom,
			extraInfos: props.extraInfos,
			bienMail: props.bienMail,
			bienName: "",
			displayBiens: props.displayBiens
		}

		this.inputFiles = React.createRef();
		this.to = React.createRef();
		this.cc = React.createRef();
		this.bcc = React.createRef();
		this.selectBien = React.createRef();
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleChangeTrumb = (e) => {
		const { message } = this.state;
		let text = e.currentTarget.innerHTML;

		this.setState({ message: { value: message.value, html: text } })
	}

	handleSelect = (name, value) => {
		if (value !== "") {
			this.setState({ errors: [] });

			let validate = Validateur.validateur([{ type: "email", id: "" + [name], value: value }])
			if (!validate.code) {
				Formulaire.showErrors(this, validate);
			} else {
				this.setState({ [name]: [...this.state[name], ...[{ uid: uid(), value: value }]] });
			}
		}
		this[name].current.handleClose(null, "");
	}

	handleDeselect = (name, uidValue) => {
		let nData = [];
		this.state[name].forEach(val => {
			if (val.uid !== uidValue) nData.push(val);
		})

		this.setState({ [name]: nData });
	}

	handleChangeSelect = (name, value, displayValue) => {
		this.setState({ [name]: value });
		this.selectBien.current.handleClose(null, displayValue);
	}

	handlePreview = (e) => {
		const { theme, message } = this.state;

		e.preventDefault();

		let preview = document.getElementById("preview");

		if (parseInt(theme) === 0) {
			preview.innerHTML = "<div>" +
				message.html +
				"</div>"
		} else {
			Formulaire.loader(true);
			let self = this;

			let formData = new FormData();
			formData.append("data", JSON.stringify(this.state));

			axios({ method: "POST", url: Routing.generate(URL_PREVIEW_ELEMENT), data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
				.then(function (response) {
					preview.innerHTML = response.data
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

	handleDraft = (e) => {
		e.preventDefault();

		const { urlRedirect, refModal } = this.props;
		const { from, subject } = this.state;

		this.setState({ errors: [], success: false })

		let paramsToValidate = [
			{ type: "email", id: 'from', value: from },
			{ type: "text", id: 'subject', value: subject },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let formData = new FormData();
			formData.append("data", JSON.stringify(this.state));

			Formulaire.loader(true);
			let self = this;
			axios({ method: "POST", url: Routing.generate(URL_DRAFT_ELEMENT), data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
				.then(function (response) {
					toastr.info("Brouillon enregistré.");

					if (refModal) {
						Formulaire.loader(false);
						refModal.current.handleClose();
					} else {
						self.setState({
							isDraft: true,
							id: response.data.id
						})
						if (self.props.onUpdateList) {
							self.props.onUpdateList(response.data, "draft")
						}

						if (urlRedirect) {
							location.href = urlRedirect;
						}else{
							Formulaire.loader(false);
						}
					}
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { url, urlRedirect, refModal } = this.props;
		const { from, to, cc, bcc, subject, title, message, theme } = this.state;

		this.setState({ errors: [], success: false })

		let paramsToValidate = [
			{ type: "email", id: 'from', value: from },
			{ type: "text", id: 'subject', value: subject },
			{ type: "text", id: 'message', value: message },
			{ type: "text", id: 'theme', value: theme }
		];

		if (parseInt(theme) === 1) {
			paramsToValidate = [...paramsToValidate,
				...[{ type: "text", id: 'title', value: title }]
			];
		}

		let validate = Validateur.validateur(paramsToValidate)

		if (to.length === 0 && cc.length === 0 && bcc.length === 0) {
			validate.code = false;
			validate.errors.push({
				name: "to", message: "Au moins 1 destinataire doit être renseigné dans A ou CC ou CCI."
			})
		}

		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			Formulaire.loader(true);
			let self = this;

			let formData = new FormData();
			formData.append("data", JSON.stringify(this.state));


			let inputFiles = this.inputFiles.current;
			let files = inputFiles ? inputFiles.state.files : [];

			files.forEach((f, index) => {
				formData.append("file" + index, f)
			})

			axios({ method: "POST", url: url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
				.then(function (response) {
					toastr.info("Message envoyé !");

					if (refModal) {
						Formulaire.loader(false);
						refModal.current.handleClose();

						if (self.props.onUpdateList) {
							self.props.onUpdateList(response.data, "update")
						}
					} else {
						self.setState({ success: "Message envoyé !", errors: [] });
						setTimeout(function () {
							if (urlRedirect) {
								location.href = urlRedirect;
							} else {
								location.reload();
							}
						}, 3000)
					}
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { styleForm, identifiant, tos, havePreview, haveDraft, mBiens } = this.props;
		const {
			errors, success, from, to, cc, bcc, showCc, showBcc, subject, title, message, theme,
			bienMail, bienName, displayBiens
		} = this.state;

		let themeItems = [
			{ value: 0, identifiant: "th-none",  label: "Aucun thème" },
			{ value: 2, identifiant: "th-lotys", label: "Lotys agence" },
		]

		let selectBiens = [], nBienName = bienName;
		if (displayBiens) {
			mBiens.forEach(el => {
				let bienDisplay = <div className="ag-select-bien">
					<div><img src={el.mainPhotoFile} alt="" /></div>
					<div>
						<div>{el.reference}</div>
						<div className="sub">{el.localisation.address === el.localisation.city ? el.libelle : el.localisation.address}, {el.localisation.zipcode} {el.localisation.city}</div>
						<div className="sub">{Sanitaze.toFormatCurrency(el.financial.price)}</div>
					</div>
				</div>

				let bienInputName = el.reference + " - " + Sanitaze.toFormatCurrency(el.financial.price);
				let bienLabel = el.reference;
				if (bienMail === el.id) {
					nBienName = bienLabel;
				}

				selectBiens.push({ value: el.id, label: bienLabel, display: bienDisplay, inputName: bienInputName, identifiant: "bien-sel-" + el.id })
			})
		}

		let params0 = { errors: errors, onChange: this.handleChange }
		let params1 = { errors: errors, onClick: this.handleSelect, onDeClick: this.handleDeselect }

		return <>
			<div className={styleForm === 2 ? "px-4 pb-4 pt-5 sm:px-6 sm:pb-4" : ""}>
				<form onSubmit={this.handleSubmit}>
					<div className="flex flex-col gap-4">
						{success !== false && <div>
							<Alert type="blue">{success}</Alert>
						</div>}

						{havePreview
							? <div>
								<Radiobox items={themeItems} identifiant="theme" valeur={theme} {...params0} classItems="flex gap-4">
									Thème
								</Radiobox>
							</div>
							: null
						}

						<div className="flex gap-2">
							<legend className="block text-sm font-medium leading-6 text-gray-900">De :</legend>
							<div className="font-medium">{from ? from : <span className='text-red-500'>Expéditeur invalide.</span>}</div>
						</div>

						<div className="flex items-start gap-2">
							<div className="flex gap-2 w-full">
								<SelectMultipleCustom ref={this.to} identifiant="to" inputValue="" inputValues={to}
													  items={tos} {...params1}>À</SelectMultipleCustom>
							</div>

							{(!showCc || !showBcc) && <div className="flex items-center gap-2">
								{!showCc && <div className="cursor-pointer text-blue-700 hover:text-blue-600"
												 onClick={() => this.setState({ showCc: true })}>
									Cc
								</div>}
								{!showBcc && <div className="cursor-pointer text-blue-700 hover:text-blue-600"
												  onClick={() => this.setState({ showBcc: true })}>
									Cci
								</div>}
							</div>}
						</div>

						{showCc && <div className="flex gap-2">
							<SelectMultipleCustom ref={this.cc} identifiant="cc" inputValue="" inputValues={cc}
												  items={tos} {...params1}>Cc</SelectMultipleCustom>
						</div>}

						{showBcc && <div className="flex gap-2">
							<SelectMultipleCustom ref={this.bcc} identifiant="bcc" inputValue="" inputValues={bcc}
												  items={tos} {...params1}>Cci</SelectMultipleCustom>
						</div>}

						<div className="flex gap-4">
							<div className="w-full">
								<Input identifiant="subject" valeur={subject} {...params0}>Objet</Input>
							</div>
							{parseInt(theme) === 1 || parseInt(theme) === 2 && <div className="w-full">
								<Input identifiant="title" valeur={title} {...params0}>
									Titre du message <span className="text-gray-600">{parseInt(theme) === 2 ? "(facultatif)" : "(obligatoire)"}</span>
								</Input>
							</div>}
						</div>

						{displayBiens
							? <div>
								<SelectCustom ref={this.selectBien} identifiant="bienMail" inputValue={nBienName}
											  items={selectBiens} errors={errors} onClick={this.handleChangeSelect}>
									Bien
								</SelectCustom>
							</div>
							: null
						}

						<div>
							<Trumb identifiant={"message-" + (i++)} valeur={message.value} errors={errors} onChange={this.handleChangeTrumb}>Message</Trumb>
						</div>

						<div>
							<InputFile ref={this.inputFiles} type="multiple" identifiant="files" {...params0} format="*" accept="*" max={5}>
								Documents <span className="text-sm text-gray-600">(facultatif)</span>
							</InputFile>
						</div>

						{haveDraft && <div>
							<Alert type="gray" icon="question">En brouillon, les documents ne sont pas sauvegardés.</Alert>
						</div>}
					</div>

					{styleForm !== 2
						? <div className="mt-6 flex justify-end gap-2">
							{havePreview
								? <Button type="default" isSubmit={false} onClick={this.handlePreview}>Prévisualisation</Button>
								: null
							}
							{haveDraft
								? <Button type="yellow" isSubmit={false} onClick={this.handleDraft}>Enregistrer en brouillon</Button>
								: null
							}
							<Button type="blue" isSubmit={true} onClick={this.handleSubmit}>Envoyer</Button>
						</div>
						: null
					}
				</form>
			</div>

			{styleForm === 2
				? <div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6 border-t">
					<CloseModalBtn identifiant={identifiant} />
					<Button type="blue" isSubmit={true} onClick={this.handleSubmit}>Envoyer</Button>
				</div>
				: null
			}
		</>
	}
}
