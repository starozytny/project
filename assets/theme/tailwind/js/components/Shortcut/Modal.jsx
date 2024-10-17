import React, { Component } from "react";
import PropTypes from "prop-types";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Toastr from "@tailwindFunctions/toastr";
import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { Modal } from "@tailwindComponents/Elements/Modal";

export class ModalDelete extends Component {
	handleDelete = () => {
		const { refModal, element, routeName, msgSuccess, onUpdateList } = this.props;

		let self = this;
		axios({ method: "DELETE", url: Routing.generate(routeName, { 'id': element.id }), data: {} })
			.then(function (response) {
				Toastr.toast('info', msgSuccess);
				onUpdateList(element, "delete");
				refModal.current.handleClose();
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	render () {
		const { refModal, title, children, identifiant = "delete", maxWidth = 414 } = this.props;

		return <Modal ref={refModal} identifiant={identifiant} maxWidth={maxWidth} title={title}
					  content={<p>{children}</p>}
					  footer={<Button type="red" onClick={this.handleDelete}>Confirmer la suppression</Button>}
		/>
	}
}

export class ModalDeletes extends Component {
	handleDelete = () => {
		const { elements, routeName, msgSuccess } = this.props;

		let ids = [];
		elements.forEach(el => {
			ids.push(el.id);
		})

		let self = this;
		Formulaire.loader(true);
		axios({ method: "DELETE", url: Routing.generate(routeName), data: ids })
			.then(function (response) {
				Toastr.toast('info', msgSuccess);
				location.reload();
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
				Formulaire.loader(true);
			})
		;
	}

	render () {
		const { refModal, title, identifiant = "deletes", maxWidth = 414 } = this.props;

		return <Modal ref={refModal} identifiant={identifiant} maxWidth={maxWidth} title={title}
					  content={<p>Etes-vous sûr de vouloir supprimer définitivement les éléments sélectionnés ?</p>}
					  footer={<Button type="red" onClick={this.handleDelete}>Confirmer la suppression</Button>}
		/>
	}
}

ModalDelete.propTypes = {
	refModal: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	routeName: PropTypes.string.isRequired,
	msgSuccess: PropTypes.string.isRequired,
	element: PropTypes.object,
	onUpdateList: PropTypes.func.isRequired,
	identifiant: PropTypes.string,
	maxWidth: PropTypes.number,
}
