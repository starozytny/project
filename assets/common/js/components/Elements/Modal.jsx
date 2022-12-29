import React, { Component } from "react";
import PropTypes from "prop-types";

import { Button } from "@commonComponents/Elements/Button";

export class Modal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: props.content,
            footer: props.footer,
            closeTxt: props.closeTxt ? props.closeTxt : "Annuler"
        }
    }

    handleClick = (e) => {
        const { identifiant } = this.props;

        let modal = document.getElementById(identifiant);
        let btns = document.querySelectorAll(".close-modal");

        modal.style.display = "block"

        window.onclick = (e) => {
            if(e.target === modal){
                modal.style.display = "none";
            }
        }

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = "none";
            })
        })
    }

    handleClose = (e) => {
        const { identifiant } = this.props;

        let modal = document.getElementById(identifiant);
        modal.style.display = "none"
    }

    handleUpdateContent = (content) => { this.setState({ content }) }
    handleUpdateFooter = (footer) => { this.setState({ footer }) }
    handleUpdateCloseTxt = (closeTxt) => { this.setState({ closeTxt }) }

    render () {
        const { identifiant, title, maxWidth, showClose=true } = this.props;
        const { content, footer, closeTxt } = this.state;

        let divStyle = maxWidth ? { maxWidth: maxWidth + "px" } : null;

        let nContent = content;
        if(typeof content === "string"){
            nContent = <div dangerouslySetInnerHTML={{__html: content}} />;
        }

        return <div id={identifiant} className="modal">
            <div className="modal-content" style={divStyle}>
                <div className="modal-header">
                    <div className="title">{title ? title : ""}</div>
                    <div className="close-modal"><span className="icon-cancel" /></div>
                </div>
                <div className="modal-body">
                    {nContent}
                </div>
                {(footer || showClose)
                    ? <div className="modal-footer">
                        {footer}
                        {showClose && <div className="close-modal"><Button type="cancel">{closeTxt}</Button></div>}
                    </div>
                    :  null
                }
            </div>
        </div>
    }
}

Modal.propTypes = {
    identifiant: PropTypes.string.isRequired,
    title: PropTypes.string,
    maxWidth: PropTypes.number,
    content: PropTypes.node,
    footer: PropTypes.node,
    closeTxt: PropTypes.string,
}
