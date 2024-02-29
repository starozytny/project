import React, { Component } from "react";
import PropTypes from "prop-types";

import ModalFunctions from '@commonFunctions/modal';

import { Button } from "@commonComponents/Elements/Button";

export class Modal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contentUpdated: null,
            footer: props.footer,
            closeTxt: props.closeTxt ? props.closeTxt : "Fermer"
        }
    }

    handleClick = (e) => {
        const { identifiant } = this.props;

        let [body, modal, modalOverlay, modalContent, btns] = ModalFunctions.getElements(identifiant);

        ModalFunctions.openM(body, modal, modalOverlay, modalContent);

        window.onclick = (e) => {
            if(e.target === modal){
                ModalFunctions.closeM(body, modal, modalOverlay, modalContent);
            }
        }

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                ModalFunctions.closeM(body, modal, modalOverlay, modalContent);
            })
        })
    }

    handleClose = (e) => {
        const { identifiant } = this.props;

        let [body, modal, modalOverlay, modalContent, btns] = ModalFunctions.getElements(identifiant);

        ModalFunctions.closeM(body, modal, modalOverlay, modalContent);
    }

    handleUpdateContent = (content) => { this.setState({ contentUpdated: content }) }
    handleUpdateFooter = (footer) => { this.setState({ footer }) }
    handleUpdateCloseTxt = (closeTxt) => { this.setState({ closeTxt }) }

    render () {
        const { content, identifiant, title, maxWidth, margin=15, showClose=true, isForm=false } = this.props;
        const { contentUpdated, footer, closeTxt } = this.state;

        let divStyle = maxWidth ? {
            maxWidth: maxWidth + "px",
            margin: margin + "% auto"
        } : null;

        let nContent = contentUpdated ? contentUpdated : content;
        if(typeof nContent === "string"){
            nContent = <div dangerouslySetInnerHTML={{__html: nContent}} />;
        }

        return <div id={identifiant} className="modal relative -z-10 opacity-0" role="dialog" aria-modal="true">

            <div className="modal-overlay close-modal fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ease-out duration-300 opacity-0"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto" style={divStyle}>
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <div className="modal-content relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all ease-out duration-300 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pt-5 sm:px-6">
                            <div className="text-center sm:text-left">
                                <div className="flex flex-row justify-between gap-1">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{title ? title : ""}</h3>
                                    <div className="close-modal cursor-pointer"><span className="icon-cancel" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
                            {isForm
                                ? nContent
                                : <>
                                    <div className="text-sm text-gray-500">
                                        {nContent}
                                    </div>
                                </>
                            }
                        </div>
                        {isForm
                            ? null
                            : ((footer || showClose)
                                    ? <div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6">
                                        {showClose && <Button type="default" onClick={this.handleClose}>
                                            {closeTxt}
                                        </Button>}
                                        {footer}
                                    </div>
                                    : null
                            )}
                    </div>
                </div>
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
