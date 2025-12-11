import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalFunctions from '@commonFunctions/modal';

import { Button } from "@tailwindComponents/Elements/Button";

export function CloseModalBtn ({ identifiant, children = "Annuler" })
{
	const handleCloseModal = (e) => {
		e.preventDefault();

		let [body, modal, modalContent, btns] = ModalFunctions.getElements(identifiant);

		ModalFunctions.closeM(body, modal, modalContent);
	}

	return <div className="close-modal"><Button type="default" onClick={handleCloseModal}>{children}</Button></div>
}

export class Modal extends Component {
	constructor (props) {
		super(props);

		this.state = {
			contentUpdated: null,
			footer: props.footer,
			closeTxt: props.closeTxt ? props.closeTxt : "Fermer"
		}
	}

	handleClick = (e) => {
		const { identifiant, canCloseOutside = true } = this.props;

		let [body, modal, modalContent, btns] = ModalFunctions.getElements(identifiant);

		ModalFunctions.openM(body, modal, modalContent);

		if(canCloseOutside){
			window.onmousedown = (e) => {
				if (e.target === modal) {
					ModalFunctions.closeM(body, modal, modalContent);
				}
			}
		}

		btns.forEach(btn => {
			btn.addEventListener('click', () => {
				ModalFunctions.closeM(body, modal, modalContent);
			})
		})
	}

	handleClose = (e) => {
		const { identifiant } = this.props;

		let [body, modal, modalContent, btns] = ModalFunctions.getElements(identifiant);

		ModalFunctions.closeM(body, modal, modalContent);
	}

	handleUpdateContent = (content) => {
		this.setState({ contentUpdated: content })
	}
	handleUpdateFooter = (footer) => {
		this.setState({ footer })
	}
	handleUpdateCloseTxt = (closeTxt) => {
		this.setState({ closeTxt })
	}

	render () {
		const { content, identifiant, title, maxWidth, margin = 15, showClose = true, isForm = false, bgColor = "bg-white" } = this.props;
		const { contentUpdated, footer, closeTxt } = this.state;

		let divStyle = maxWidth ? {
			maxWidth: maxWidth + "px",
			margin: margin + "% auto"
		} : null;

		let nContent = contentUpdated ? contentUpdated : content;
		if (typeof nContent === "string") {
			nContent = <div dangerouslySetInnerHTML={{ __html: nContent }} />;
		}

		return <div id={identifiant} className="modal fixed top-0 left-0 w-full h-full -z-10 opacity-0 bg-gray-800/80 overflow-y-auto" role="dialog" aria-modal="true">
			<div className="modal-content relative w-screen bg-white rounded-lg text-left shadow-xl transition-all ease-out duration-300 opacity-0 sm:my-8 sm:w-full" style={divStyle}>
				<div className={`${bgColor} px-4 pt-5 sm:px-6 rounded-t-lg`}>
					<div className="text-center sm:text-left">
						<div className="flex flex-row justify-between gap-1">
							<h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{title ? title : ""}</h3>
							<div className="close-modal cursor-pointer"><span className="icon-close inline-block hover:rotate-180 transition-transform" /></div>
						</div>
					</div>
				</div>
				{isForm
					? <div className={`${bgColor} rounded-b-lg`}>{nContent}</div>
					: <>
						<div className={`${bgColor} px-4 pb-4 pt-5 sm:px-6 sm:pb-4 text-sm text-gray-900 ${(footer || showClose) ? "" : "rounded-b-lg"}`}>
							{nContent}
						</div>
						{(footer || showClose)
							? <div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6 border-t rounded-b-lg">
								{showClose && <Button type="default" onClick={this.handleClose}>{closeTxt}</Button>}
								{footer}
							</div>
							: null
						}
					</>
				}
			</div>
		</div>
	}
}

Modal.propTypes = {
	identifiant: PropTypes.string.isRequired,
	title: PropTypes.string,
	maxWidth: PropTypes.number,
	margin: PropTypes.number,
	content: PropTypes.node,
	footer: PropTypes.node,
	closeTxt: PropTypes.string,
	showClose: PropTypes.bool,
	isForm: PropTypes.bool,
}
