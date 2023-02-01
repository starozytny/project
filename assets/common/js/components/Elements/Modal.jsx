import React, { Component } from "react";
import PropTypes from "prop-types";

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

        let body = document.querySelector("body");
        let modal = document.getElementById(identifiant);
        let btns = document.querySelectorAll(".close-modal");

        body.style.overflow = "hidden";
        modal.style.display = "block"

        window.onclick = (e) => {
            if(e.target === modal){
                body.style.overflow = "auto";
                modal.style.display = "none";
            }
        }

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                body.style.overflow = "auto";
                modal.style.display = "none";
            })
        })
    }

    handleClose = (e) => {
        const { identifiant } = this.props;

        let body = document.querySelector("body");
        let modal = document.getElementById(identifiant);
        body.style.overflow = "auto";
        modal.style.display = "none"
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
        if(typeof content === "string"){
            nContent = <div dangerouslySetInnerHTML={{__html: content}} />;
        }

        return <div id={identifiant} className="modal">
            <div className="modal-content" style={divStyle}>
                <div className="modal-header">
                    <div className="title">{title ? title : ""}</div>
                    <div className="close-modal"><span className="icon-cancel" /></div>
                </div>
                {isForm
                    ? nContent
                    : <>
                        <div className="modal-body">
                            {nContent}
                        </div>
                        {(footer || showClose)
                            ? <div className="modal-footer">
                                {footer}
                                {showClose && <div className="close-modal"><Button type="reverse">{closeTxt}</Button></div>}
                            </div>
                            :  null
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
