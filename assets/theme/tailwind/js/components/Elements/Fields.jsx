import React, { Component, useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { cn } from "@shadcnComponents/lib/utils"

import Cleave from "cleave.js/react";

import Sort from "@commonFunctions/sort";
import Toastr from "@tailwindFunctions/toastr";
import Sanitaze from "@commonFunctions/sanitaze";

import { SelectSimple } from "@shadcnComponents/elements/Select/Select";
import { ComboboxMultiple, ComboboxSimple } from "@shadcnComponents/elements/Combobox/Combobox";

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
			<input type="text" name={identifiant} id={identifiant} value={valeur === null ? "" : valeur} disabled={true}
				   className={styleInput + " " + (error ? "ring-red-400" : "ring-gray-300")} />
		</div>
		<ErrorContent error={error} />
	</>
}

InputView.propTypes = {
	identifiant: PropTypes.string,
	errors: PropTypes.array,
	children: PropTypes.node,
}

/***************************************
 * TEXTAREA View
 ***************************************/
export function TextAreaView (props) {
	const { identifiant, valeur, errors, children, height = "80px" } = props;

	let error = getError(errors, identifiant);

	let styleInput = "block bg-gray-100 w-full rounded-md border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
			{children}
		</label>
		<div className="relative rounded-md shadow-sm">
			<textarea name={identifiant} id={identifiant} value={valeur === null ? "" : valeur} disabled={true}
					  style={{ height: height }}
					  className={styleInput + " " + (error ? "ring-red-400" : "ring-gray-300")} />
		</div>
		<ErrorContent error={error} />
	</>
}

TextAreaView.propTypes = {
	identifiant: PropTypes.string,
	errors: PropTypes.array,
	children: PropTypes.node,
}

/***************************************
 * INPUT Classique
 ***************************************/
export function Input ({
						   type = "text", identifiant, name, valeur, errors, onChange, children, placeholder = "", autocomplete = "on", disabled = false,
						   onBlur = null, min = "", max = "", step = 1,
						   options = { numeral: true, numeralDecimalScale: 10, numeralThousandsGroupStyle: 'thousand', delimiter: ' ' },
						   prefix
					   }) {
	const [showValue, setShowValue] = useState(false);

	let nName = name ? name : identifiant;

	let nType = type, dateClasses = "", nPlaceholder = placeholder, nAutocomplete = autocomplete;
	if (showValue) {
		nType = "text";
	}

	let error = getError(errors, identifiant);

	let styleInput = "block rounded-md shadow-sm border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";
	if (prefix) {
		styleInput += " pl-9"
	}

	let content;
	if (type === "number" || type === "range") {
		if(type === "range"){
			styleInput += " ring-0 shadow-none"
		}

		content = <input type={nType} name={nName} id={identifiant} value={valeur}
						 placeholder={placeholder} onChange={onChange} autoComplete={nAutocomplete}
						 disabled={disabled} onBlur={onBlur}
						 className={styleInput + " w-full " + (error ? "ring-red-400" : "ring-gray-300")}
						 min={min} max={max} step={step}
						 onWheel={(e) => e.currentTarget.blur()}
						 onKeyDown={(e) => ["e", "E"].includes(e.key) && e.preventDefault()} />
	} else if (type === "cleave" || type === "cleave-zipcode") {
		let nOptions = type === "cleave-zipcode" ? { blocks: [5], numericOnly: true } : options;
		content = <Cleave name={nName} id={identifiant} value={valeur}
						  placeholder={placeholder} onChange={onChange} onBlur={onBlur}
						  options={nOptions}
						  className={styleInput + " w-full " + (error ? "ring-red-400" : "ring-gray-300")} />
	} else if (type === "date") {
		content = <input type={nType} name={nName} id={identifiant} value={valeur}
						 placeholder={nPlaceholder} onChange={onChange} autoComplete={nAutocomplete}
						 min={min} max={max}
						 disabled={disabled}
						 className={styleInput
							 + " w-full " + dateClasses
							 + " " + (error ? "ring-red-400" : "ring-gray-300")} />
	}  else {
		content = <input type={nType} name={nName} id={identifiant} value={valeur}
						 placeholder={nPlaceholder} onChange={onChange} autoComplete={nAutocomplete}
						 disabled={disabled}
						 className={styleInput
							 + " " + (error ? "ring-red-400" : "ring-gray-300")
							 + " " + (type === "color" ? "bg-white h-8.5 w-16" : "w-full")} />
	}

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
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
	valeur: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.any,
	]).isRequired,
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

	const [city, setCity] = useState(valeur);
	const [isOpen, setIsOpen] = useState(openCities === identifiant);

	useEffect(() => {
		setIsOpen(openCities === identifiant)
	}, [props.openCities]);

	useEffect(() => {
		setCity("")
	}, [props.cities]);

	let handleChange = (identifiant, value) => {
		setCity(value);
		onSelectCity(identifiant, value);
	}

	let error = getError(errors, identifiant);

	let styleInput = "block rounded-md shadow-sm border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
			{children}
		</label>
		<div className="relative rounded-md">
			{cities && cities.length > 1
				? <SelectShadcn identifiant="city" valeur={city} items={cities}
								errors={[]} onSelect={handleChange} noEmpty={true} open={isOpen} onOpenChange={setIsOpen} />
				: <input type="text" name={identifiant} id={identifiant} value={valeur}
						 placeholder={placeholder} onChange={onChange} autoComplete={autocomplete}
						 className={styleInput + " w-full " + (error ? "ring-red-400" : "ring-gray-300")}
				/>
			}
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
				<div className={`${isChecked ? "translate-x-6.5" : "translate-x-0"} h-5 w-5 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out`}>
					<span className="icon-check1 text-slate-50 text-xs"></span>
				</div>
			</div>
			<input type="checkbox" name={identifiant} className="hidden"
				   id={elem.identifiant} value={elem.value} defaultChecked={isChecked} onChange={onChange} />
		</label>
	})

	return <>
		{children
			? <label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
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

		let styleLabel = "block text-sm font-medium leading-6 text-gray-800";
		if (styleType === "fat") {
			styleLabel = "block text-sm font-medium leading-6 cursor-pointer px-3 py-2 rounded-md ring-1 ring-inset "
				+ (isChecked ? "bg-blue-700 ring-blue-700 text-slate-50" : "bg-white hover:bg-gray-50 ring-gray-300 text-gray-900")
		}

		return <div className="flex items-center gap-x-2" key={index}>
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
			? <legend className="block text-sm font-medium leading-6 text-gray-800">
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
export function Radiobox ({
							  items, identifiant, valeur, errors, onChange, children, convertValToInt = true,
							  classItems = "", styleType = "", labelClass = ""
						  }) {
	let error = getError(errors, identifiant);

	let radioInput = items.map((elem, index) => {
		let isChecked = false

		let vl = convertValToInt ? parseInt(valeur) : valeur;
		if (vl === elem.value) {
			isChecked = true
		}

		let styleLabel = "block text-sm font-medium leading-6 " + labelClass;
		if (styleType === "fat") {
			styleLabel = "block text-sm font-medium leading-6 cursor-pointer px-3 py-2 rounded-full ring-1 ring-inset "
				+ (isChecked ? "bg-blue-700 ring-blue-700 text-slate-50" : "bg-white hover:bg-gray-50 ring-gray-300 text-gray-900")
				+ " " + labelClass
		}

		return <div className="flex items-center gap-2" key={index}>
			<input type="radio" id={elem.identifiant} name={identifiant} value={elem.value} onClick={onChange} defaultChecked={isChecked}
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
			? <legend className="block text-sm font-medium leading-6 text-gray-800">
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
export function SelectShadcn (props) {
	const { identifiant, valeur, items, errors, onSelect, children, placeholder, withGroup, noEmpty, open, onOpenChange } = props;

	let error = getError(errors, identifiant);

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
			{children}
		</label>
		<div className="relative rounded-md">
			<SelectSimple identifiant={identifiant} items={items} valeur={valeur} onSelect={onSelect}
						  placeholder={placeholder} withGroup={withGroup} noEmpty={noEmpty} open={open} onOpenChange={onOpenChange}
						  btnClassName={error ? "border-red-500" : "border-gray-300"} />
		</div>
		<ErrorContent error={error} />
	</>
}

SelectShadcn.propTypes = {
	items: PropTypes.array.isRequired,
	identifiant: PropTypes.string.isRequired,
	valeur: PropTypes.node.isRequired,
	errors: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired,
	children: PropTypes.node,
	noEmpty: PropTypes.bool,
	withGroup: PropTypes.bool,
}

export function SelectCombobox (props) {
	const { identifiant, valeur, items, errors, onSelect, children, placeholder, toSort, btnClassName, listClassName, disabled, withInput } = props;

	let error = getError(errors, identifiant);

	if(toSort){
		items.sort(Sort.compareLabel)
	}

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
			{children}
		</label>
		<div className="relative rounded-md">
			<ComboboxSimple identifiant={identifiant} items={items} valeur={valeur} onSelect={onSelect}
							placeholder={placeholder} disabled={disabled} withInput={withInput}
							btnClassName={cn(error ? "border-red-500" : "border-gray-300", btnClassName)}
							listClassName={listClassName} />
		</div>
		<ErrorContent error={error} />
	</>
}

SelectCombobox.propTypes = {
	items: PropTypes.array.isRequired,
	identifiant: PropTypes.string.isRequired,
	valeur: PropTypes.node.isRequired,
	errors: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired,
	children: PropTypes.node,
	toSort: PropTypes.bool,
}

export function SelectComboboxMultiple (props) {
	const {
		identifiant, valeur, items, errors, onSelect, onChange, children, placeholder, toSort, withInput,
		withItems = true, onlyValue = false, btnClassName } = props;

	let error = getError(errors, identifiant);

	if(toSort){
		items.sort(Sort.compareLabel)
	}

	return <>
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
			{children}
		</label>
		<div className="w-full relative rounded-md">
			<ComboboxMultiple identifiant={identifiant} items={items} valeurs={valeur} onSelect={onSelect} onChange={onChange}
							  placeholder={placeholder} withInput={withInput} withItems={withItems} onlyValue={onlyValue}
							  btnClassName={cn(error ? "border-red-500" : "border-gray-300", btnClassName)} />
		</div>
		<ErrorContent error={error} />
	</>
}

SelectComboboxMultiple.propTypes = {
	items: PropTypes.array.isRequired,
	identifiant: PropTypes.string.isRequired,
	valeur: PropTypes.node.isRequired,
	errors: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired,
	children: PropTypes.node,
	toSort: PropTypes.bool,
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
				if (file.size > maxSize) {
					Toastr.toast('error', "Le fichier est trop volumineux.");
				} else {
					this.setState({ files: [file] })
				}
			} else {
				let nFiles = [];
				Object.entries(e.target.files).forEach(([key, file]) => {
					if (file.size > maxSize) {
						Toastr.toast('error', "Le fichier est trop volumineux.");
					} else if (files.length + nFiles.length >= max) {
						Toastr.toast('error', "Le nombre maximal de fichiers envoyés a été atteint.");
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
		const { type, identifiant, format = "image", valeur, errors, onDelete, children, accept = "image/*" } = this.props;
		const { files } = this.state;

		let error = getError(errors, identifiant);

		return <>
			<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
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
					: (valeur
							? <div className="flex gap-2">
								{format === "image"
									? <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200">
										<img src={valeur} alt="actual image" className="w-full h-full object-contain" />
									</div>
									: <div>
										<div className="text-xs font-medium">{valeur}</div>
									</div>
								}
								<div>
									{onDelete
										? <div className="cursor-pointer text-sm text-red-600 hover:text-red-700" onClick={onDelete}>Supprimer</div>
										: null
									}
								</div>
							</div>
							: <span className="text-sm">Aucun fichier sélectionné.</span>
					)
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
		<label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-800">
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
