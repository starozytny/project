import React, { Component } from "react";
import PropTypes from "prop-types";

export class Modal extends Component {
    constructor(props) {
        super(props);
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

    render () {
        const { identifiant, title, content, footer, maxWidth } = this.props;

        let divStyle = maxWidth ? { maxWidth: maxWidth + "px" } : null;

        return <div id={identifiant} className="modal">
            <div className="modal-content" style={divStyle}>
                <div className="modal-header">
                    <div className="title">{title ? title : ""}</div>
                    <div className="close-modal"><span className="icon-cancel" /></div>
                </div>
                <div className="modal-body">
                    {content}
                </div>
                {footer && <div className="modal-footer">
                    {footer}
                </div>}
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
}
