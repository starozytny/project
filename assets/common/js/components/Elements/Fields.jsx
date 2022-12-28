import React, { Component } from "react";
import PropTypes from 'prop-types';

import toastr   from "toastr";

import Sort     from "@commonFunctions/sort";
import Search   from "@commonFunctions/search";
import Sanitaze from "@commonFunctions/sanitaze";

import { Button } from "@commonComponents/Elements/Button";

/***************************************
 * INPUT View
 ***************************************/
export function InputView (props) {
    const { valeur, children } = props;

    let content = <>
        <div className="input-view">{valeur}</div>
    </>

    return (<Structure {...props} content={content} label={children} />)
}

InputView.propTypes = {
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
}

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
 * SELECT Custom
 ***************************************/
function useArrows (e, self) {
    let cursor = self.state.cursor;
    if(e.key === "ArrowDown"){
        if(cursor < self.props.items.length - 1){
            cursor++;
        }
    }
    if(e.key === "ArrowUp"){
        if(cursor > 0){
            cursor--;
        }
    }
    self.setState({ cursor: cursor })

    let element = document.getElementById("item-" + self.props.identifiant + "-" + cursor);
    element.scrollIntoView({ block: 'end' })
}

export class SelectCustom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayValeur: props.displayValeur,
            isOpen: false,
            cursor: -1
        }

        this.input = React.createRef();

        this.handleFocus = this.handleFocus.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleUseArrows = this.handleUseArrows.bind(this);
    }

    handleUseArrows = (e) => { useArrows(e, this) }

    handleFocus = () => {
        this.setState({ isOpen: true, cursor: -1 })

        window.addEventListener("keydown", this.handleUseArrows)
    }

    handleClose = (e, value) => {
        const { identifiant, items } = this.props;
        const { cursor } = this.state;

        if(e !== null){ // from this
            let possibilities = [];
            if(cursor !== -1){
                items.forEach((item, index) => {
                    if(index === cursor){
                        possibilities.push(item);
                    }
                })
            }else{
                items.forEach(item => {
                    let rank = Search.selectSearch(this.state.displayValeur, item.label)
                    if(rank === 1) possibilities.push(item);
                })
            }

            if(possibilities.length === 1){
                let item = possibilities[0];
                this.props.onClick(identifiant, item.value, item.inputName ? item.inputName : item.label)
            }else{
                this.props.onClick(identifiant, "", "")
            }
        }else{ // from parent
            this.setState({ isOpen: false, displayValeur: value })
        }

        window.removeEventListener("keydown", this.handleUseArrows)
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
        const { init, isOpen, displayValeur, cursor } = this.state;

        items.forEach(item => {
            item.rank = Search.selectSearch(displayValeur, item.label);
        })

        items.sort(Sort.compareRankThenLabel)

        let nItems = [];
        items.forEach((item, index) => {
            let active = item.rank === 1 ? " possibility" : "";
            let positionnement = cursor === index ? " highlight" : "";

            nItems.push(<div className={"item" + active + positionnement} id={"item-" + identifiant + "-" + index} key={index}
                             onClick={() => onClick(identifiant, item.value, item.inputName ? item.inputName : item.label)}>
                <div dangerouslySetInnerHTML={{__html: item.label }} />
            </div>)
        })

        let content = <div className={"select-custom" + (isOpen ? " active" : "")} onFocus={this.handleFocus}>
            <div className="select-input">
                <input ref={this.input} type="text" name="displayValeur" id="displayValeur" value={displayValeur}
                       placeholder={placeholder} onChange={this.handleChange} onKeyDown={this.handleBlur}
                       autoComplete={"new-" + identifiant} key={init} />
            </div>
            <div className="select-choices" id={"select-choices-" + identifiant}>
                <div className="items">{nItems}</div>
            </div>
            <div className="select-overlay" onClick={(e) => this.handleClose(e, null)}></div>
        </div>

        return (<Structure {...this.props} content={content} label={children} />)
    }
}

SelectCustom.propTypes = {
    identifiant: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    displayValeur: PropTypes.node,
    placeholder: PropTypes.string,
}

/***************************************
 * SELECT Classique
 ***************************************/
export function Select(props) {
    const { identifiant, valeur, items, onChange, children, noEmpty=false } = props;

    let choices = items.map((item, index) =>
        <option key={index} value={item.value}>{item.label}</option>
    )

    let content = <select value={valeur} id={identifiant} name={identifiant} onChange={onChange}>
        {noEmpty ? null : <option value="" />}
        {choices}
    </select>
    return (<Structure {...props} content={content} label={children} />)
}

Select.propTypes = {
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node.isRequired,
    items: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    noEmpty: PropTypes.bool,
}

/***************************************
 * INPUT FILE Classique
 ***************************************/
export class InputFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
        }

        this.fileInput = React.createRef();

        this.handleFileInput = this.handleFileInput.bind(this);
    }

    handleFileInput = (e) => {
        const { type } = this.props;

        const file = e.target.files[0];
        if (file.size > 5330000) {
            toastr.error("Le fichier est trop volumineux.")
        }else {
            if(type === "simple"){
                this.setState({ files: [file] })
            }
        }
    }

    render () {
        const { identifiant, format="image", valeur, children, placeholder="", accept="image/*" } = this.props;
        const { files } = this.state;

        let content = <div className="file-uploader">
            <input type='file' ref={this.fileInput} accept={accept} name={identifiant} id={identifiant} onChange={this.handleFileInput} />

            <div className="file-uploader-container">
                <div className="infos">
                    {files.length > 0
                        ? <div className="preview-files">{files.map((file, index) => {
                            return <div className="item" key={index}>
                                {format === "image" && <div className="image">
                                    <img src={URL.createObjectURL(file)} alt={file.name}/>
                                </div>}
                                <div className="data">
                                    <div>{file.name}</div>
                                    <div className="sub">{Sanitaze.toFormatBytesToSize(file.size)}</div>
                                </div>
                            </div>
                        })}</div>
                        : placeholder
                    }
                </div>

                <div className="actions">
                    <div className="actual-files">
                        {(valeur && format === "image") && <div className="image">
                            <img src={valeur} alt="actual image"/>
                        </div>}
                    </div>
                    <Button onClick={(e) => this.fileInput.current.click()} type="warning">
                        Parcourir mes fichiers
                    </Button>
                </div>
            </div>
        </div>

        return (<Structure {...this.props} content={content} label={children} />)
    }
}

InputFile.propTypes = {
    type: PropTypes.string.isRequired,
    identifiant: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    placeholder: PropTypes.string.isRequired,
    format: PropTypes.string,
    valeur: PropTypes.string,
    accept: PropTypes.string,
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

