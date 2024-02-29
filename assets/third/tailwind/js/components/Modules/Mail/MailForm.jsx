import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import toastr from 'toastr';
import { uid } from 'uid'
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Input, InputFile, InputView, SelectMultipleCustom } from "@commonComponents/Elements/Fields";
import { Button } from "@commonComponents/Elements/Button";
import { Alert } from "@commonComponents/Elements/Alert";
import { TinyMCE } from "@commonComponents/Elements/TinyMCE";

import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";
import ModalFunctions from '@commonFunctions/modal';

const URL_CREATE_ELEMENT = "intern_api_mails_mail_send";
const TEXT_CREATE = "Envoyer le message";

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
		to={element ? [{ uid: uid(), value: element.email }] : []}
		from={from}
		fromName={fromName}

		onUpdateList={onUpdateList}

		initListener={!!element}
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
			success: null,
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
		if (this.props.initListener) {
			let [body, modal, modalOverlay, modalContent, btns] = ModalFunctions.getElements(this.props.identifiant);

			btns.forEach(btn => {
				btn.addEventListener('click', () => {
					ModalFunctions.closeM(body, modal, modalOverlay, modalContent);
				})
			})
		}
	}

	handleCloseModal = () => {
		let [body, modal, modalOverlay, modalContent, btns] = ModalFunctions.getElements(this.props.identifiant);
		ModalFunctions.closeM(body, modal, modalOverlay, modalContent);
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
				this.setState({ [name]: [...this.state[name], ...[{ uid: uid(), value: value }]] });
			}
		}
		let ref;
		if (name === "to") ref = this.select0;
		else if (name === "cc") ref = this.select1;
		else if (name === "bcc") ref = this.select2;
		ref.current.handleClose(null, "");
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
		const { loadSendData, to, subject, message } = this.state;

		this.setState({ errors: [], success: null });

		let paramsToValidate = [
			{ type: "array", id: 'to', value: to },
			{ type: "text", id: 'subject', value: subject },
			{ type: "text", id: 'message', value: message.html },
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
						toastr.info("Message envoyé.");
						self.setState({
							success: "Message envoyé.",
							subject: "",
							message: { value: "", html: "" },
							resetTextArea: true
						});

						if (self.props.onUpdateList) {
							self.props.onUpdateList(response.data, 'create')
						}
					})
					.catch(function (error) {
						console.log(error);
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
		const { tos } = this.props;
		const { errors, success, loadSendData, from, fromName, to, cc, bcc, subject, message, resetTextArea, openCc, openBcc, files } = this.state;

		let params = { errors: errors, onChange: this.handleChange }
		let params1 = { errors: errors, onClick: this.handleSelect, onDeClick: this.handleDeselect }

		return <>
			<div className="modal-body">
				<form onSubmit={this.handleSubmit}>
					<div className="line">
						<InputView valeur={(fromName + ' <' + from + '>').trim()} errors={errors}>De</InputView>
					</div>
					<div className="line line-send-mail-ccs">
						<SelectMultipleCustom ref={this.select0} identifiant="to" inputValue="" inputValues={to}
											  items={tos} {...params1}>À</SelectMultipleCustom>
						{(!openCc || !openBcc) && <div className="ccs">
							{!openCc && <div onClick={() => this.setState({ openCc: true })}>Cc</div>}
							{!openBcc && <div onClick={() => this.setState({ openBcc: true })}>Cci</div>}
						</div>}
					</div>
					{openCc && <div className="line">
						<SelectMultipleCustom ref={this.select1} identifiant="cc" inputValue="" inputValues={cc}
											  items={tos} {...params1}>Cc</SelectMultipleCustom>
					</div>}
					{openBcc && <div className="line">
						<SelectMultipleCustom ref={this.select2} identifiant="bcc" inputValue="" inputValues={bcc}
											  items={tos} {...params1}>Cci</SelectMultipleCustom>
					</div>}

					<div className="line">
						<Input identifiant="subject" valeur={subject} {...params}>Objet</Input>
					</div>

					<div className="line">
						<TinyMCE type={99} identifiant='message' valeur={message.value}
								 errors={errors} onUpdateData={this.handleChangeTinyMCE} key={resetTextArea}>
							Message
						</TinyMCE>
					</div>

					<div className="line">
						<InputFile ref={this.file} type="multi" identifiant="files" valeur={files} accept="/*" max={5}
								   placeholder="Glissez et déposer une pièce jointe ou" {...params}>
							Pièces jointes (5 fichiers maximums)
						</InputFile>
					</div>
				</form>
			</div>
			<div className="modal-footer">
				{success && <Alert type="flue">{success}</Alert>}
				{!loadSendData
					? <Button onClick={this.handleSubmit} type="primary">{TEXT_CREATE}</Button>
					: <Button onClick={this.handleSubmit} type="primary" icon="chart-3" isLoader={true}>{TEXT_CREATE}</Button>
				}
				<div className="close-modal"><Button type="reverse" onClick={this.handleCloseModal}>Annuler</Button></div>
			</div>
		</>
	}
}

Form.propTypes = {
	url: PropTypes.node.isRequired,
	tos: PropTypes.array.isRequired,
	to: PropTypes.array.isRequired,
}
