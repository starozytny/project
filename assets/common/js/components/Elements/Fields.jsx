import React, { Component } from "react";
import PropTypes from 'prop-types';

import Sort     from "@commonFunctions/sort";
import Search   from "@commonFunctions/search";
import Sanitaze from "@commonFunctions/sanitaze";

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
        const { type="text", identifiant, valeur, onChange, children, placeholder="", autocomplete="on", password=false } = this.props;
        const { showValue } = this.state;

        let content = <>
            <input type={showValue ? "text" : type} name={identifiant} id={identifiant} value={valeur}
                   placeholder={placeholder} onChange={onChange} autoComplete={autocomplete} />
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
    autocomplete: PropTypes.string,
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
 * SELECT Classique
 ***************************************/
export class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayValeur: props.displayValeur,
            isOpen: false
        }

        this.input = React.createRef();

        this.handleFocus = this.handleFocus.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleFocus = () => { this.setState({ isOpen: true }) }

    handleClose = (e, value) => {
        const { identifiant, items } = this.props;

        if(e !== null){ // from this
            let possibilities = [];
            items.forEach(item => {
                let rank = Search.selectSearch(this.state.displayValeur, item.label)
                if(rank === 1) possibilities.push(item);
            })

            if(possibilities.length === 1){
                let item = possibilities[0];
                this.props.onClick(identifiant, item.value, item.inputName)
            }else{
                this.props.onClick(identifiant, "", "")
            }

        }else{ // from parent
            this.setState({ isOpen: false, displayValeur: value })
        }
    }

    handleChange = (e) => {
        this.setState({ [e.currentTarget.name]: e.currentTarget.value })
    }

    handleBlur = (e) => {
        if(e.key === "Tab") this.handleClose(e, null);
        if(e.key === "Enter") {
            e.preventDefault();
            this.handleClose(e, null);
            this.input.current.blur();
        }
    }

    render () {
        const { identifiant, items, onClick, children, placeholder=""} = this.props;
        const { init, isOpen, displayValeur } = this.state;

        items.forEach(item => {
            item.rank = Search.selectSearch(displayValeur, item.label);
        })

        items.sort(Sort.compareRankThenLabel)

        let nItems = [];
        items.forEach((item, index) => {
            let active = item.rank === 1 ? " possibility" : "";

            nItems.push(<div className={"item" + (active)} key={index}
                             onClick={() => onClick(identifiant, item.value, item.inputName)}>
                <div dangerouslySetInnerHTML={{__html: item.label }} />
            </div>)
        })

        let content = <div className={"select-custom" + (isOpen ? " active" : "")} onFocus={this.handleFocus}>
            <div className="select-input">
                <input ref={this.input} type="text" name="displayValeur" id="displayValeur" value={displayValeur}
                       placeholder={placeholder} onChange={this.handleChange} onKeyDown={this.handleBlur}
                       autoComplete={"new-" + identifiant} key={init} />
            </div>
            <div className="select-choices">
                <div className="items">{nItems}</div>
            </div>
            <div className="select-overlay" onClick={(e) => this.handleClose(e, null)}></div>
        </div>

        return (<Structure {...this.props} content={content} label={children} />)
    }
}

Select.propTypes = {
    identifiant: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    displayValeur: PropTypes.node,
    placeholder: PropTypes.string,
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

