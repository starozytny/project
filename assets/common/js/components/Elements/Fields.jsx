import React, { Component } from "react";
import PropTypes from 'prop-types';

export class Input extends Component {
    constructor(props) {
        super(props);

        this.state = { showValue: false, }

        this.handleShow = this.handleShow.bind(this);
    }

    handleShow = () => { this.setState({ showValue: !this.state.showValue }) }

    render () {
        const { type="text", identifiant, valeur, onChange, children, placeholder="", password=false } = this.props;
        const { showValue } = this.state;

        let content = <>
            <input type={showValue ? "text" : type} name={identifiant} id={identifiant} value={valeur}
                   placeholder={placeholder} onChange={onChange} />
            {password && <div className="input-show" onClick={this.handleShow}>
                <span className={showValue ? "icon-vision-not" : "icon-vision"}></span>
            </div>}
        </>

        return (<Structure {...this.props} content={content} label={children} />)
    }
}

Input.propTypes = {
    type: PropTypes.string,
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    password: PropTypes.bool,
}

function Structure({ identifiant, content, errors, label, classForm="" }){
    let error;
    if(errors && errors.length !== 0){
        errors.map(err => {
            if(err.name === identifiant){
                error = err.message
            }
        })
    }
    return <div className={classForm + 'form-group' + (error ? " form-group-error" : "")}>
        <label htmlFor={identifiant}>{label}</label>
        {content}
        <div className="error">{error ? <><span className='icon-error'/>{error}</> : null}</div>
    </div>

    // return <div className={classForm + 'form-group form-group-error'}>
    //     <label htmlFor={identifiant}>{label}</label>
    //     {content}
    //     <div className="error"><span className='icon-error'/> <span>Il y a une erreur</span></div>
    // </div>

}

Structure.propTypes = {
    identifiant: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    label: PropTypes.node.isRequired,
    classForm: PropTypes.string
}

