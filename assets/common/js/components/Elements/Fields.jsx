import React, { Component } from "react";
import PropTypes from 'prop-types';

/***************************************
 * INPUT Classique
 ***************************************/
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

/***************************************
 * CHECKBOX Classique
 ***************************************/
export function Checkbox (props) {
    const { items, identifiant, valeur, onChange, children, isSwitcher = false } = props;

    let classeItems = isSwitcher ? "switcher-items" : "checkbox-items";

    let itemsInputs = items.map((elem, index) => {
        // get checker value
        let isChecked = false
        valeur.map(el => {
            if (el === elem.value){ isChecked = true }
        })

        let classeItem = isSwitcher ? "switcher-item" : "checkbox-item";

        return <div className={classeItem + " " + (isChecked ? 'checked' : '')} key={index}>
            <label htmlFor={elem.identifiant}>
                <span>{elem.label}</span>
                <input type="checkbox" name={identifiant} id={elem.identifiant} value={elem.value}
                       checked={isChecked ? 'checked' : ''} onChange={onChange}/>
            </label>
            {isChecked && <div className="item-selected"><span className="icon-check-1" /></div>}
        </div>
    })

    let content = <div className={classeItems}>{itemsInputs}</div>
    return (<Structure {...props} content={content} label={children} classForm="form-group-checkbox " />)
}

Checkbox.propTypes = {
    items: PropTypes.array.isRequired,
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    isSwitcher: PropTypes.bool,
}

/***************************************
 * STRUCTURE
 ***************************************/
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
}

Structure.propTypes = {
    identifiant: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    label: PropTypes.node.isRequired,
    classForm: PropTypes.string
}

