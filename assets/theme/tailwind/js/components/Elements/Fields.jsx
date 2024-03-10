import React, { Component, useState, useEffect } from "react";
import PropTypes from 'prop-types';

import toastr from "toastr";
import Cleave from "cleave.js/react";

import Sort from "@commonFunctions/sort";
import Search from "@commonFunctions/search";
import Sanitaze from "@commonFunctions/sanitaze";

/***************************************
 * INPUT View
 ***************************************/
export function InputView (props) {
	const { identifiant, valeur, errors, children } = props;

	let error = getError(errors, identifiant);

	let styleInput = "block bg-gray-100 w-full rounded-md border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
			{children}
		</label>
		<div className="relative rounded-md shadow-sm">
			<input type="text" name={identifiant} id={identifiant} value={valeur} disabled={true}
				   className={styleInput + " " + (error ? "ring-red-400" : "ring-gray-300")} />
		</div>
		<ErrorContent error={error} />
	</>
}

InputView.propTypes = {
	identifiant: PropTypes.string,
	valeur: PropTypes.node.isRequired,
	errors: PropTypes.array,
	children: PropTypes.node.isRequired,
}

/***************************************
 * INPUT Classique
 ***************************************/
export function Input ({
						   type = "text", identifiant, valeur, errors, onChange, children, placeholder = "", autocomplete = "on", disabled = false,
						   onBlur = null, min = "", max = "", step = 1,
						   options = { numeral: true, numeralDecimalScale: 10, numeralThousandsGroupStyle: 'thousand', delimiter: ' ' },
						   prefix
					   }) {
	const [showValue, setShowValue] = useState(false);

	let nType = type, dateClasses = "", nPlaceholder = placeholder, nAutocomplete = autocomplete;
	if (showValue) {
		nType = "text";
	} else if (type === "js-date") {
		nType = "text";
		dateClasses = "js-datepicker";
		nPlaceholder = "JJ/MM/AAAA";
		nAutocomplete = "off-date" + identifiant;
	}

	let error = getError(errors, identifiant);

	let styleInput = "block rounded-md shadow-sm border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";
	if(prefix){
		styleInput += " pl-9"
	}

	let content;
	if (type === "number") {
		content = <input type={nType} name={identifiant} id={identifiant} value={valeur}
						 placeholder={placeholder} onChange={onChange} autoComplete={nAutocomplete}
						 disabled={disabled} onBlur={onBlur}
						 className={styleInput + " w-full " + (error ? "ring-red-400" : "ring-gray-300")}
						 min={min} max={max} step={step}
						 onWheel={(e) => e.currentTarget.blur()}
						 onKeyDown={(e) => ["e", "E"].includes(e.key) && e.preventDefault()}/>
	}else if(type === "cleave"){
		let nOptions = type === "cleave-zipcode" ? {blocks: [5], numericOnly: true} : options;
		content = <Cleave name={identifiant} id={identifiant} value={valeur}
						  placeholder={placeholder} onChange={onChange} onBlur={onBlur}
						  options={nOptions}
						  className={styleInput + " w-full " + (error ? "ring-red-400" : "ring-gray-300")} />
	}else {
		content = <input type={nType} name={identifiant} id={identifiant} value={valeur}
						 placeholder={nPlaceholder} onChange={onChange} autoComplete={nAutocomplete}
						 disabled={disabled}
						 className={styleInput
							 + " " + dateClasses
							 + " " + (error ? "ring-red-400" : "ring-gray-300")
							 + " " + (type === "color" ? "bg-white h-8.5 w-16" : "w-full")} />
	}

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
			{children}
		</label>
		<div className="relative rounded-md">
			{prefix
				? <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<span className="text-gray-500 sm:text-sm">
						{prefix}
					</span>
				</div>
				: null
			}
			{content}
			{type === "password"
				? <div className="absolute inset-y-0 right-0 px-2 cursor-pointer flex items-center" onClick={() => setShowValue(!showValue)}>
					<span className={showValue ? "icon-vision-not" : "icon-vision"}></span>
				</div>
				: null
			}
		</div>
		<ErrorContent error={error} />
	</>
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
	min: PropTypes.number,
	max: PropTypes.number,
}

/***************************************
 * INPUT CITY
 ***************************************/
export function InputCity (props) {
	const { identifiant, valeur, errors, onChange, children, placeholder = "", autocomplete = "on", cities, openCities, onSelectCity } = props;

	const [isOpen, setIsOpen] = useState(openCities === identifiant);

	useEffect(() => {
		setIsOpen(openCities === identifiant)
	}, [props.openCities]);


	let error = getError(errors, identifiant);

	let styleInput = "block rounded-md shadow-sm border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
			{children}
		</label>
		<div className="relative rounded-md">
			<div className={`fixed top-0 left-0 w-full h-full inset-0 bg-gray-500 bg-opacity-75 transition-opacity ease-out duration-300 ${isOpen ? "opacity-100 z-10" : "opacity-0 -z-10"}`}
				 onClick={() => setIsOpen(false)}></div>
			<input type="text" name={identifiant} id={identifiant} value={valeur}
				   placeholder={placeholder} onChange={onChange} autoComplete={autocomplete}
				   className={styleInput + " w-full " + (error ? "ring-red-400" : "ring-gray-300")}
			/>
			{cities && <div className={`relative ${isOpen ? "z-10" : ""}`}>
				<div className={isOpen ? "absolute block top-0 left-0 z-10" : "hidden"}>
					<div className="w-64 max-h-64 overflow-y-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-2">
							{cities.map((ci, index) => {
								return <div className="w-full flex px-2 py-1.5 cursor-pointer hover:bg-gray-100"
											key={index} onClick={() => onSelectCity(identifiant, ci.city)}>
									{ci.city}
								</div>
							})}
						</div>
					</div>
				</div>
			</div>}
		</div>
		<ErrorContent error={error} />
	</>
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
 * SWITCHER
 ***************************************/
export function Switcher ({ items, identifiant, valeur, errors, onChange, children }) {
    let error = getError(errors, identifiant);

	let switcherInput = items.map((elem, index) => {

        let isChecked = false
        valeur.map(el => {
            if (el === elem.value) {
                isChecked = true
            }
        })

        return <label htmlFor={elem.identifiant} className="cursor-pointer flex items-center text-gray-900 group/item"
                      key={index}
        >
            <div className={`${isChecked ? "bg-blue-700" : "bg-gray-200"} flex w-12 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}>
                <div className={`${isChecked ? "translate-x-6.5" : "translate-x-0"} inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out`}>
                    <span className="icon-check1 text-slate-50 text-xs"></span>
                </div>
            </div>
            <input type="checkbox" name={identifiant} className="hidden"
                   id={elem.identifiant} value={elem.value} defaultChecked={isChecked} onChange={onChange} />
        </label>
    })

    return <>
        {children
            ? <label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
                {children}
            </label>
            : null
        }
        {switcherInput}
        <ErrorContent error={error} />
    </>
}

Switcher.propTypes = {
    items: PropTypes.array.isRequired,
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.array.isRequired,
    errors: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
}

/***************************************
 * CHECKBOX Classique
 ***************************************/
export function Checkbox ({ items, identifiant, valeur, errors, onChange, children, withIcon, classItems = "", styleType = "" }) {
	let error = getError(errors, identifiant);

    let checkboxInput = items.map((elem, index) => {
        let isChecked = false

        valeur.map(el => {
			if (el === elem.value) {
				isChecked = true
			}
		})

		let styleLabel = "block text-sm font-medium leading-6 text-gray-900";
		if(styleType === "fat"){
			styleLabel = "block text-sm font-medium leading-6 cursor-pointer px-3 py-2 rounded-md ring-1 ring-inset "
				+ (isChecked ? "bg-blue-700 ring-blue-700 text-slate-50" : "bg-white hover:bg-gray-50 ring-gray-300 text-gray-900")
		}

		return <div	className="flex items-center gap-x-2" key={index}>
			<input type="checkbox" id={elem.identifiant} name={identifiant} value={elem.value} onChange={onChange} defaultChecked={isChecked}
				   className={styleType === "fat" ? "hidden" : "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"} />
			<label htmlFor={elem.identifiant}
				   className={`${styleLabel}`}
			>
				{withIcon ? <span className={`icon-${elem.icon} inline-block mr-1`}></span> : null}
				<span>{elem.label}</span>
			</label>
		</div>
	})

	return <>
		{children
			? <legend className="block text-sm font-medium leading-6 text-gray-900">
				{children}
			</legend>
			: null
		}
		<div className={classItems}>
			{checkboxInput}
		</div>
		<ErrorContent error={error} />
	</>
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
export function Radiobox ({ items, identifiant, valeur, errors, onChange, children, convertValToInt = true, classItems = "", styleType = "" }) {
	let error = getError(errors, identifiant);

	let radioInput = items.map((elem, index) => {
		let isChecked = false

		let vl = convertValToInt ? parseInt(valeur) : valeur;
		if (vl === elem.value) {
			isChecked = true
		}

		let styleLabel = "block text-sm font-medium leading-6 text-gray-900";
		if(styleType === "fat"){
			styleLabel = "block text-sm font-medium leading-6 cursor-pointer px-3 py-2 rounded-full ring-1 ring-inset "
				+ (isChecked ? "bg-blue-700 ring-blue-700 text-slate-50" : "bg-white hover:bg-gray-50 ring-gray-300 text-gray-900")
		}

		return <div	className="flex items-center gap-2" key={index}>
			<input type="radio" id={elem.identifiant} name={identifiant} value={elem.value} onChange={onChange} defaultChecked={isChecked}
				   className={styleType === "fat" ? "hidden" : "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"} />
			<label htmlFor={elem.identifiant}
				   className={`${styleLabel}`}
			>
				{elem.label}
			</label>
		</div>
	})

	return <>
		{children
			? <legend className="block text-sm font-medium leading-6 text-gray-900">
				{children}
			</legend>
			: null
		}
		<div className={classItems}>
			{radioInput}
		</div>
		<ErrorContent error={error} />
	</>
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
	if (e.key === "ArrowDown") {
		if (cursor < self.props.items.length - 1) {
			cursor++;
		}
	}
	if (e.key === "ArrowUp") {
		if (cursor > 0) {
			cursor--;
		}
	}
	self.setState({ cursor: cursor })

	let element = document.getElementById("item-" + self.props.identifiant + "-" + cursor);
	if (element) {
		element.scrollIntoView({ block: 'end' })
	}
}

export class SelectCustom extends Component {
	constructor (props) {
		super(props);

		this.state = {
			inputValue: props.inputValue,
			isOpen: false,
			cursor: -1
		}

		this.input = React.createRef();
	}

	handleUseArrows = (e) => {
		useArrows(e, this)
	}

	handleFocus = () => {
		this.setState({ isOpen: true, cursor: -1 })
		window.addEventListener("keydown", this.handleUseArrows)
	}

	handleClose = (e, value) => {
		const { identifiant, items } = this.props;
		const { cursor, inputValue } = this.state;

		if (e !== null) { // from this
			let possibilities = [];
			if (cursor !== -1) {
				items.forEach((item, index) => {
					if (index === cursor) {
						possibilities.push(item);
					}
				})
			} else {
				items.forEach(item => {
					let rank = Search.selectSearch(inputValue, item.label)
					if (rank === 1) possibilities.push(item);
				})
			}

			if (possibilities.length === 1) {
				let item = possibilities[0];
				this.props.onClick(identifiant, item.value, item.inputName ? item.inputName : item.label)
			} else {
				this.props.onClick(identifiant, "", "")
			}
		} else { // from parent
			this.setState({ isOpen: false, inputValue: value })
		}

		window.removeEventListener("keydown", this.handleUseArrows)
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleBlur = (e) => {
		if (e.key === "Tab") this.handleClose(e, "");
		if (e.key === "Enter") {
			e.preventDefault();
			this.handleClose(e, "");
			this.input.current.blur();
		}
	}

	render () {
		const { identifiant, items, errors, onClick, children, placeholder = "" } = this.props;
		const { init, isOpen, inputValue, cursor } = this.state;

		let error = getError(errors, identifiant);

		items.forEach(item => {
			item.rank = Search.selectSearch(inputValue, item.label);
		})

		items.sort(Sort.compareRankThenLabel)

		let nItems = [];
		items.forEach((item, index) => {
			let positionnement = cursor === index ? "text-blue-700" : "text-gray-900";

			nItems.push(<div className={`w-full flex px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${positionnement}`} key={index}
							 onClick={() => onClick(identifiant, item.value, item.displayName ? item.displayName : item.label)}>
				<div dangerouslySetInnerHTML={{ __html: item.label }} />
			</div>)
		})

		let styleInput = "block w-full rounded-md border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";

		return <>
			<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
				{children}
			</label>
			<div className="rounded-md shadow-sm w-full">
				<div className={`fixed top-0 left-0 w-full h-full inset-0 bg-gray-500 bg-opacity-75 transition-opacity ease-out duration-300 ${isOpen ? "opacity-100 z-10" : "opacity-0 -z-10"}`}
					 onClick={this.handleClose}></div>
				<div className={`relative ${isOpen ? "z-10" : ""}`} onFocus={this.handleFocus}>
					<div className="w-full">
						<input ref={this.input} type="text" name="inputValue" id="inputValue" value={inputValue}
							   placeholder={placeholder} onChange={this.handleChange} onKeyDown={this.handleBlur}
							   className={styleInput + " " + (error ? "ring-red-400" : "ring-gray-300")}
							   autoComplete={"new-" + identifiant} key={init} />
					</div>
					<div className={isOpen ? "absolute block top-10 left-0 z-10" : "hidden"}>
						<div className="w-64 max-h-64 overflow-y-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<div className="py-2">
								{nItems}
							</div>
						</div>
					</div>
				</div>

			</div>
			<ErrorContent error={error} />
		</>
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
	constructor (props) {
		super(props);

		this.state = {
			inputValue: props.inputValue,
			isOpen: false,
			cursor: -1
		}

		this.input = React.createRef();
	}

	handleUseArrows = (e) => {
		useArrows(e, this)
	}

	handleFocus = () => {
		this.setState({ isOpen: true, cursor: -1 })
		window.addEventListener("keydown", this.handleUseArrows)
	}

	handleClose = (e, value) => {
		const { identifiant, items } = this.props;
		const { cursor, inputValue } = this.state;

		if (e !== null) { // from this
			let possibilities = [];
			if (cursor !== -1) {
				items.forEach((item, index) => {
					if (index === cursor) {
						possibilities.push(item);
					}
				})
			} else {
				items.forEach(item => {
					let rank = Search.selectSearch(inputValue, item.label)
					if (rank === 1) possibilities.push(item);
				})
			}

			if (possibilities.length === 1) {
				let item = possibilities[0];
				this.props.onClick(identifiant, item.value)
			} else {
				this.props.onClick(identifiant, "")
			}
		} else { // from parent
			this.setState({ isOpen: false, inputValue: value ? value : "" })
		}

		window.removeEventListener("keydown", this.handleUseArrows)
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

	handleBlur = (e) => {
		const { identifiant } = this.props;

		let value = e.currentTarget.value;
		if (e.key === "Tab") this.props.onClick(identifiant, value)
		if (e.key === "Enter") {
			e.preventDefault();
			this.props.onClick(identifiant, value)
			this.input.current.focus();
		}
	}

	render () {
		const { identifiant, items, errors, onClick, onDeClick, children, placeholder = "", inputValues, idVal = "uid" } = this.props;
		const { init, isOpen, inputValue, cursor } = this.state;

		let error = getError(errors, identifiant);

		items.forEach(item => {
			item.rank = Search.selectSearch(inputValue, item.label);
		})

		items.sort(Sort.compareRankThenLabel)

		let nItems = [];
		items.forEach((item, index) => {
			let positionnement = cursor === index ? "text-blue-700" : "text-gray-900";

			let find = false;
			inputValues.forEach(v => {
				if(v[idVal] === item.value){
					find = true;
				}
			})

			if(!find){
				nItems.push(<div className={`w-full flex px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${positionnement}`} key={index}
								 onClick={() => onClick(identifiant, item.value, item.displayName ? item.displayName : item.label)}>
					<div dangerouslySetInnerHTML={{ __html: item.label }} />
				</div>)
			}
		})

		let styleInput = "flex gap-2 w-full bg-white rounded-md border-0 py-2 pl-3 pr-4 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";

		return <>
			<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
				{children}
			</label>
			<div className="rounded-md shadow-sm w-full">
				<div className={`fixed top-0 left-0 w-full h-full inset-0 bg-gray-500 bg-opacity-75 transition-opacity ease-out duration-300 ${isOpen ? "opacity-100 z-30" : "opacity-0 -z-10"}`}
					 onClick={this.handleClose}></div>
				<div className={`relative ${isOpen ? "z-30" : ""}`} onFocus={this.handleFocus}>
					<div className={styleInput + " " + (error ? "ring-red-400" : "ring-gray-300")}>
						{inputValues.length > 0 && <div className="flex flex-wrap gap-2 max-w-[80%] bg-slate-50 rounded-md">
							{inputValues.length > 0 && inputValues.map((val, index) => {
								return <div className="cursor-pointer flex gap-1 bg-blue-100 rounded-md py-1 px-2 text-sm hover:bg-blue-50 transition-colors"
											onClick={() => onDeClick(identifiant, val[idVal])} key={index}>
									<span>{val.value}</span>
									<span className="icon-close inline-block translate-y-0.5 ml-2" />
								</div>
							})}
						</div>}
						<input ref={this.input} type="text" name="inputValue" id="inputValue" value={inputValue}
							   placeholder={placeholder} onChange={this.handleChange} onKeyDown={this.handleBlur}
							   className="w-full border-0 py-0 pl-0 text-sm text-gray-900 focus:ring-0"
							   autoComplete={"new-" + identifiant} key={init} />
					</div>
					<div className={isOpen ? "absolute block top-10 left-0 z-10" : "hidden -z-10"}>
						<div className="w-64 max-h-64 overflow-y-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
							<div className="py-2">
								{nItems}
							</div>
						</div>
					</div>
				</div>

			</div>
			<ErrorContent error={error} />
		</>
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
export function Select (props) {
	const { identifiant, valeur, items, errors, onChange, children, noEmpty = false } = props;

	let error = getError(errors, identifiant)

	let styleSelect = "py-2 pl-2 w-full rounded-md shadow-sm border-0 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";
	let styleOption = "text-base"

	let choices = items.map((item, index) =>
		<option key={index} value={item.value} className={styleOption}>
			{item.label}
		</option>
	)

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
			{children}
		</label>
		<div className="relative rounded-md">
			<select value={valeur} id={identifiant} name={identifiant} onChange={onChange}
					className={styleSelect + " " + (error ? "ring-red-400" : "ring-gray-300")}
			>
				{noEmpty ? null : <option value="" />}
				{choices}
			</select>
		</div>
		<ErrorContent error={error} />
	</>
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
	constructor (props) {
		super(props);

		this.state = {
			files: [],
		}

		this.fileInput = React.createRef();
	}

	handleFileInput = (e) => {
		const { type, max = 1, maxSize = 5330000 } = this.props;
		const { files } = this.state;

		const file = e.target.files[0];
		if (file) {
			if (type === "simple") {
				if (file.size > 5330000) {
					toastr.error("Le fichier est trop volumineux.")
				} else {
					this.setState({ files: [file] })
				}
			} else {
				let nFiles = [];
				Object.entries(e.target.files).forEach(([key, file]) => {
					if (file.size > maxSize) {
						toastr.error("Le fichier est trop volumineux.")
					} else if (files.length + nFiles.length >= max) {
						toastr.error("Le nombre maximal de fichiers envoyés a été atteint.")
					} else {
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
			if (f.name !== file.name) nFiles.push(f);
		})

		this.setState({ files: nFiles })
	}

	render () {
		const { type, identifiant, format = "image", valeur, errors, children, accept = "image/*" } = this.props;
		const { files } = this.state;

		let error = getError(errors, identifiant);

		return <>
			<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
				{children}
			</label>
			<div className="flex items-start gap-x-3">
				<div className="hidden">
					<input type='file' ref={this.fileInput} name={identifiant} id={identifiant} onChange={this.handleFileInput}
						   accept={accept} multiple={type !== "simple"} />
				</div>

				<button type="button" onClick={(e) => this.fileInput.current.click()}
						className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					<span className={`${error ? "text-red-500" : ""}`}>Choisir un fichier</span>
				</button>

				{files.length > 0
					? <div className="flex flex-wrap gap-4">
						{files.map((file, index) => {
							return <div className="flex gap-2" key={index}>
								{format === "image" && <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200">
									<img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-contain" />
								</div>}
								<div>
									<div className="leading-5">
										<div className="font-medium">{file.name}</div>
										<div className="text-gray-600">{Sanitaze.toFormatBytesToSize(file.size)}</div>
									</div>
									<div className="cursor-pointer text-red-600 hover:text-red-700" onClick={() => this.handleFileRemove(file)}>Supprimer</div>
								</div>
							</div>
						})}
					</div>
					: (valeur && format === "image")
						? <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200">
							<img src={valeur} alt="actual image" className="w-full h-full object-contain" />
						</div>
						: <span className="text-sm">Aucun fichier sélectionné.</span>
				}
			</div>
			<ErrorContent error={error} />
		</>
	}
}

InputFile.propTypes = {
	type: PropTypes.string.isRequired,
	identifiant: PropTypes.string.isRequired,
	errors: PropTypes.array.isRequired,
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
	const { identifiant, valeur, errors, onChange, children, placeholder = "", autocomplete = "on", height = "80px" } = props;

	let error = getError(errors, identifiant);

	let styleInput = "block rounded-md shadow-sm border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
			{children}
		</label>
		<div className="relative rounded-md">
			<textarea name={identifiant} id={identifiant} value={valeur} style={{ height: height }}
					  className={styleInput + " w-full " + (error ? "ring-red-400" : "ring-gray-300")}
					  placeholder={placeholder} onChange={onChange} autoComplete={autocomplete} />
		</div>
		<ErrorContent error={error} />
	</>
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

function getError (errors, identifiant) {
	let error;
	if (errors && errors.length !== 0) {
		errors.map(err => {
			if (err.name === identifiant) {
				error = err.message
			}
		})
	}

	return error;
}

export function ErrorContent ({ error }) {
	return (error
			? <div className="text-red-500 mt-1 text-sm">
				<span className="icon-error inline-block translate-y-0.5" />
				<span className="ml-1">{error}</span>
			</div>
			: null
	)
}
