import React, {Component, useState} from "react";
import PropTypes from 'prop-types';

import toastr   from "toastr";

import Sort     from "@commonFunctions/sort";
import Search   from "@commonFunctions/search";
import Sanitaze from "@commonFunctions/sanitaze";

import {Button, ButtonIcon} from "@commonComponents/Elements/Button";

/***************************************
 * INPUT View
 ***************************************/
export function InputView (props) {
    const { valeur, children } = props;

    let content = <>
        <div className="input-view">{valeur}</div>
    </>

    return (<Structure {...props} identifiant="" content={content} label={children} />)
}

InputView.propTypes = {
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
}

/***************************************
 * INPUT Classique
 ***************************************/
export function Input (props)
{
    const { type="text", identifiant, valeur, onChange, children, placeholder="", autocomplete="on", password=false } = props;

    const [showValue, setShowValue] = useState(false);

    let nType = type, classes = "", nPlaceholder = placeholder, nAutocomplete = autocomplete;
    if(showValue){
        nType = "text";
    }else if (type === "js-date"){
        nType = "text";
        classes = "js-datepicker";
        nPlaceholder = "JJ/MM/AAAA";
        nAutocomplete = "off-date" + identifiant;
    }

    let content = <>
        <input type={nType} name={identifiant} id={identifiant} value={valeur}
               placeholder={nPlaceholder} onChange={onChange} autoComplete={nAutocomplete} className={classes} />
        {password && <div className="input-show" onClick={() => setShowValue(!showValue)}>
            <span className={showValue ? "icon-vision-not" : "icon-vision"}></span>
        </div>}
    </>

    return <Structure {...props} content={content} label={children} />
}

Input.propTypes = {
    type: PropTypes.string,
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
    autocomplete: PropTypes.string,
    placeholder: PropTypes.string,
    password: PropTypes.bool,
}

/***************************************
 * INPUT CITY
 ***************************************/
export function InputCity (props)
{
    const { identifiant, valeur, onChange, children, placeholder="", autocomplete="on", cities, openCities, onSelectCity } = props;

    let content = <>
        <input type="text" name={identifiant} id={identifiant} value={valeur}
               placeholder={placeholder} onChange={onChange} autoComplete={autocomplete} />
        {cities && <div className={'cities' + (openCities === identifiant ? " active" : "")}>
            <div className="items">
                {cities.map((ci, index) => {
                    return <div className="item" key={index} onClick={() => onSelectCity(identifiant, ci.city)}>
                        {ci.city}
                    </div>
                })}
            </div>
        </div>}
    </>

    return <Structure {...props} content={content} label={children} classForm="form-group-cities " />
}

InputCity.propTypes = {
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    cities: PropTypes.array.isRequired,
    openCities: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectCity: PropTypes.func.isRequired,
    children: PropTypes.node,
    autocomplete: PropTypes.string,
    placeholder: PropTypes.string,
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
                <span dangerouslySetInnerHTML={{__html: elem.label ? elem.label : ""}} />
                <input type="checkbox" name={identifiant} id={elem.identifiant} value={elem.value}
                       checked={isChecked ? 'checked' : ''} onChange={onChange}/>
            </label>
            {(isChecked && !isSwitcher) && <div className="item-selected"><span className="icon-check-1" /></div>}
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
    children: PropTypes.node,
    isSwitcher: PropTypes.bool,
}

/***************************************
 * RADIOBOX Classique
 ***************************************/
export function Radiobox (props) {
    const { items, identifiant, valeur, onChange, children, convertValToInt = true } = props;

    let itemsInputs = items.map((elem, index) => {
        let isChecked = false

        let vl = convertValToInt ? parseInt(valeur) : valeur;
        if (vl === elem.value){ isChecked = true }

        return <div className={"radiobox-item " + (isChecked ? 'checked' : '')} key={index}>
            <label htmlFor={elem.identifiant}>
                <span dangerouslySetInnerHTML={{__html: elem.label ? elem.label : ""}} />
                <input type="radio" name={identifiant} id={elem.identifiant} value={elem.value}
                       checked={isChecked ? 'checked' : ''} onChange={onChange}/>
            </label>
            {isChecked && <div className="item-selected"><span className="icon-check-1" /></div>}
        </div>
    })

    let content = <div className="radiobox-items">{itemsInputs}</div>
    return (<Structure {...props} content={content} label={children} classForm="form-group-radiobox " />)
}

Radiobox.propTypes = {
    items: PropTypes.array.isRequired,
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
    convertValToInt: PropTypes.bool,
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
    if(element){
        element.scrollIntoView({ block: 'end' })
    }
}

export class SelectCustom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: props.inputValue,
            isOpen: false,
            cursor: -1
        }

        this.input = React.createRef();
    }

    handleUseArrows = (e) => { useArrows(e, this) }

    handleFocus = () => {
        this.setState({ isOpen: true, cursor: -1 })
        window.addEventListener("keydown", this.handleUseArrows)
    }

    handleClose = (e, value) => {
        const { identifiant, items } = this.props;
        const { cursor, inputValue } = this.state;

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
                    let rank = Search.selectSearch(inputValue, item.label)
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
            this.setState({ isOpen: false, inputValue: value })
        }

        window.removeEventListener("keydown", this.handleUseArrows)
    }

    handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value }) }

    handleBlur = (e) => {
        if(e.key === "Tab") this.handleClose(e, "");
        if(e.key === "Enter") {
            e.preventDefault();
            this.handleClose(e, "");
            this.input.current.blur();
        }
    }

    render () {
        const { identifiant, items, onClick, children, placeholder="" } = this.props;
        const { init, isOpen, inputValue, cursor } = this.state;

        items.forEach(item => {
            item.rank = Search.selectSearch(inputValue, item.label);
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
                <input ref={this.input} type="text" name="inputValue" id="inputValue" value={inputValue}
                       placeholder={placeholder} onChange={this.handleChange} onKeyDown={this.handleBlur}
                       autoComplete={"new-" + identifiant} key={init} />
            </div>
            <div className="select-choices" id={"select-choices-" + identifiant}>
                <div className="items">{nItems}</div>
            </div>
            <div className="select-overlay" onClick={(e) => this.handleClose(e, "")}></div>
        </div>

        return (<Structure {...this.props} content={content} label={children} />)
    }
}

SelectCustom.propTypes = {
    identifiant: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node,
    inputValue: PropTypes.node,
    placeholder: PropTypes.string,
}


/***************************************
 * SELECT MULTIPLE Custom
 ***************************************/
export class SelectMultipleCustom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: props.inputValue,
            isOpen: false,
            cursor: -1
        }

        this.input = React.createRef();
    }

    handleUseArrows = (e) => { useArrows(e, this) }

    handleFocus = () => {
        this.setState({ isOpen: true, cursor: -1 })
        window.addEventListener("keydown", this.handleUseArrows)
    }

    handleClose = (e, value) => {
        const { identifiant, items } = this.props;
        const { cursor, inputValue } = this.state;

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
                    let rank = Search.selectSearch(inputValue, item.label)
                    if(rank === 1) possibilities.push(item);
                })
            }

            if(possibilities.length === 1){
                let item = possibilities[0];
                this.props.onClick(identifiant, item.value)
            }else{
                this.props.onClick(identifiant, "")
            }
        }else{ // from parent
            this.setState({ isOpen: false, inputValue: value ? value : "" })
        }

        window.removeEventListener("keydown", this.handleUseArrows)
    }

    handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value }) }

    handleBlur = (e) => {
        const { identifiant } = this.props;

        let value = e.currentTarget.value;
        if(e.key === "Tab") this.props.onClick(identifiant, value)
        if(e.key === "Enter") {
            e.preventDefault();
            this.props.onClick(identifiant, value)
            this.input.current.focus();
        }
    }

    render () {
        const { identifiant, items, onClick, onDeClick, children, placeholder="", inputValues } = this.props;
        const { init, isOpen, inputValue, cursor } = this.state;

        items.forEach(item => {
            item.rank = Search.selectSearch(inputValue, item.label);
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

        let content = <div className={"select-custom select-multiple-custom" + (isOpen ? " active" : "")} onFocus={this.handleFocus}>
            <div className="select-input">
                {inputValues.length > 0 && <div className="select-input-values active">
                    {inputValues.length > 0 && inputValues.map((val, index) => {
                        return <div className="input-values-item" onClick={() => onDeClick(identifiant, val.uid)} key={index}>
                            <span>{val.value}</span> <span className="icon-close" />
                        </div>
                    })}
                </div>}
                <input ref={this.input} type="text" name="inputValue" id="inputValue" value={inputValue}
                       placeholder={placeholder} onChange={this.handleChange} onKeyDown={this.handleBlur}
                       autoComplete={"new-" + identifiant} key={init} />
            </div>
            <div className="select-choices" id={"select-choices-" + identifiant}>
                <div className="items">{nItems}</div>
            </div>
            <div className="select-overlay" onClick={(e) => this.handleClose(e, "")}></div>
        </div>

        return (<Structure {...this.props} content={content} label={children} />)
    }
}

SelectMultipleCustom.propTypes = {
    identifiant: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    onDeClick: PropTypes.func.isRequired,
    inputValues: PropTypes.array.isRequired,
    children: PropTypes.node,
    inputValue: PropTypes.node,
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
    children: PropTypes.node,
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
    }

    handleFileInput = (e) => {
        const { type, max = 1 } = this.props;
        const { files } = this.state;

        const file = e.target.files[0];
        if(file){
            if(type === "simple"){
                if (file.size > 5330000) {
                    toastr.error("Le fichier est trop volumineux.")
                }else{
                    this.setState({ files: [file] })
                }
            }else{
                let nFiles = [];
                Object.entries(e.target.files).forEach(([key, file]) => {
                    if (file.size > 5330000){
                        toastr.error("Le fichier est trop volumineux.")
                    }else if(files.length + nFiles.length >= max){
                        toastr.error("Le nombre maximal de fichiers envoyés a été atteint.")
                    }else{
                        nFiles.push(file);
                    }
                });
                this.setState({ files: [...files, ...nFiles] })

            }
        }
    }

    handleFileRemove = (file) => {
        let nFiles = [];
        this.state.files.forEach(f => {
            if(f.name !== file.name) nFiles.push(f);
        })

        this.setState({ files: nFiles })
    }

    render () {
        const { type, identifiant, format="image", valeur, children, placeholder="", accept="image/*" } = this.props;
        const { files } = this.state;

        let content = <div className="file-uploader">
            <input type='file' ref={this.fileInput} name={identifiant} id={identifiant} onChange={this.handleFileInput}
                   accept={accept} multiple={type !== "simple"} />

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
                                <div className="remove">
                                    <ButtonIcon icon="trash" onClick={() => this.handleFileRemove(file)}>Supprimer</ButtonIcon>
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
    placeholder: PropTypes.string.isRequired,
    max: PropTypes.number,
    children: PropTypes.node,
    format: PropTypes.string,
    valeur: PropTypes.string,
    accept: PropTypes.string,
}

/***************************************
 * TEXTAREA Classique
 ***************************************/
export function TextArea (props) {
    const { identifiant, valeur, onChange, children, placeholder="", autocomplete="on", height="80px" } = props;
    let content = <>
            <textarea name={identifiant} id={identifiant} value={valeur} style={{height: height}}
                      placeholder={placeholder} onChange={onChange} autoComplete={autocomplete} />
    </>

    return (<Structure {...props} content={content} label={children} />)
}

TextArea.propTypes = {
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node.isRequired,
    errors: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
    autocomplete: PropTypes.string,
    placeholder: PropTypes.string,
    height: PropTypes.string,
}
//
// /***************************************
//  * Time Classique
//  ***************************************/
// export function TextArea (props) {
//     const { identifiant, valeur, onChange, children, placeholder="", autocomplete="on", height="80px" } = props;
//     let content = <>
//             <textarea name={identifiant} id={identifiant} value={valeur} style={{height: height}}
//                       placeholder={placeholder} onChange={onChange} autoComplete={autocomplete} />
//     </>
//
//     return (<Structure {...props} content={content} label={children} />)
// }
//
// TextArea.propTypes = {
//     identifiant: PropTypes.string.isRequired,
//     valeur: PropTypes.node.isRequired,
//     errors: PropTypes.array.isRequired,
//     onChange: PropTypes.func.isRequired,
//     children: PropTypes.node,
//     autocomplete: PropTypes.string,
//     placeholder: PropTypes.string,
//     height: PropTypes.string,
// }

/***************************************
 * STRUCTURE
 ***************************************/
export function Structure({ identifiant, content, errors, label, classForm="", noErrors=false }){
    let error;
    if(!noErrors && errors && errors.length !== 0){
        errors.map(err => {
            if(err.name === identifiant){
                error = err.message
            }
        })
    }
    return <div className={classForm + 'form-group' + (error ? " form-group-error" : "")}>
        <label htmlFor={identifiant}>{label}</label>
        {content}
        {!noErrors && <div className="error">
            {error ? <><span className='icon-error'/>{error}</> : null}
        </div>}
    </div>
}

Structure.propTypes = {
    identifiant: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    label: PropTypes.node,
    classForm: PropTypes.string
}

