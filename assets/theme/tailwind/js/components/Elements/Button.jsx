import React from "react";
import PropTypes from 'prop-types';

export function ButtonA ({ type, width, iconLeft, iconRight, onClick, children, target = "" }) {
	const colorVariants = {
		red: 'bg-red-600 text-slate-50 hover:bg-red-500',
		blue: 'bg-blue-600 text-slate-50 hover:bg-blue-500 ring-1 ring-inset ring-blue-600',
		default: 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300',
	}

	return <a href={onClick} target={target}
			  className={`inline-flex justify-center ${width} rounded-md py-2 px-4 text-sm font-semibold shadow-sm ${colorVariants[type]}`}>
		{iconLeft === "google"
			? <span className="icon-google inline-block translate-y-0.5">
                    <span className="path1"></span><span className="path2"></span><span className="path3"></span>
                    <span className="path4"></span><span className="path5"></span><span className="path6"></span>
                </span>
			: (iconLeft ? <span className={`icon-${iconLeft} inline-block translate-y-0.5`}></span> : null)
		}
		<span className={iconLeft ? "pl-2" : (iconRight ? "pr-2" : "")}>{children}</span>
		{iconRight ? <span className={`icon-${iconRight} inline-block translate-y-0.5`}></span> : null}
	</a>
}

ButtonA.propTypes = {
	type: PropTypes.string.isRequired,
	width: PropTypes.string,
	iconLeft: PropTypes.string,
	iconRight: PropTypes.string,
	onClick: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.func,
	]),
}

export function Button ({ type, width, iconLeft, iconRight, isSubmit, onClick, children, pa = "py-2 px-4" }) {
	const colorVariants = {
		yellow: 'bg-yellow-500 text-slate-50 hover:bg-yellow-400',
		red: 'bg-red-600 text-slate-50 hover:bg-red-500',
		blue: 'bg-blue-600 text-slate-50 hover:bg-blue-500 ring-1 ring-inset ring-blue-600',
		default: 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300',
	}

	return <button type={isSubmit ? "submit" : "button"} onClick={onClick}
				   className={`inline-flex justify-center ${width} rounded-md ${pa} text-sm font-semibold shadow-sm transition-colors ${colorVariants[type]}`}>
		{iconLeft ? <span className={`icon-${iconLeft} inline-block translate-y-0.5`}></span> : null}
		<span className={iconLeft ? "pl-1" : (iconRight ? "pr-1" : "")}>{children}</span>
		{iconRight ? <span className={`icon-${iconRight} inline-block translate-y-0.5`}></span> : null}
	</button>
}

Button.propTypes = {
	type: PropTypes.string.isRequired,
	width: PropTypes.string,
	iconLeft: PropTypes.string,
	iconRight: PropTypes.string,
	isSubmit: PropTypes.bool,
	pa: PropTypes.string,
	onClick: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.func,
	]),
}

export function ButtonIcon ({ type, icon, onClick, children, tooltipWidth }) {
	const colorVariants = {
		red: 'bg-red-600 text-slate-50 hover:bg-red-500',
		blue: 'bg-blue-600 text-slate-50 hover:bg-blue-500 ring-1 ring-inset ring-blue-600',
		menu: 'bg-gray-800 text-gray-900 hover:bg-gray-700 ring-1 ring-inset ring-gray-700',
		default: 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300',
	}

	const iconColorVariants = {
		red: 'text-slate-50',
		blue: 'text-slate-50',
		menu: 'text-gray-300',
		default: 'text-gray-600',
	}

	let divStyle = tooltipWidth ? { width: tooltipWidth + "px" } : null;

	return <button onClick={onClick}
				   className={`relative inline-flex justify-center rounded-md text-lg px-2 py-2 shadow-sm ${colorVariants[type]}`}>
		<span className={`icon-${icon} ${iconColorVariants[type]}`}></span>
		{children
			? <span className="tooltip bg-gray-300 py-1 px-2 rounded absolute -top-7 right-0 text-xs hidden"
					style={divStyle}>
				{children}
		</span>
			: null
		}
	</button>
}

ButtonIcon.propTypes = {
	type: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	onClick: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.func,
	]),
}

export function ButtonIconA ({ type, icon, onClick, children, target = "", tooltipWidth }) {
	const colorVariants = {
		red: 'bg-red-600 text-slate-50 hover:bg-red-500',
		green: 'bg-green-600 text-slate-50 hover:bg-green-500',
		yellow: 'bg-yellow-600 text-slate-50 hover:bg-yellow-500',
		blue: 'bg-blue-600 text-slate-50 hover:bg-blue-500 ring-1 ring-inset ring-gray-600',
		menu: 'bg-gray-800 text-gray-900 hover:bg-gray-700 ring-1 ring-inset ring-gray-700',
		default: 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300',
	}

	const iconColorVariants = {
		red: 'text-gray-600',
		green: 'text-gray-600',
		yellow: 'text-gray-600',
		blue: 'text-gray-600',
		menu: 'text-gray-300',
		default: 'text-gray-600',
	}

	let divStyle = tooltipWidth ? { width: tooltipWidth + "px" } : null;

	return <a href={onClick} target={target}
			  className={`relative inline-flex justify-center rounded-md text-lg px-2 py-2 shadow-sm ${colorVariants[type]}`}>
		<span className={`icon-${icon} ${iconColorVariants[type]}`}></span>
		<span className="tooltip bg-gray-300 py-1 px-2 rounded absolute -top-7 right-0 text-xs hidden"
			  style={divStyle}>
			{children}
		</span>
	</a>
}

ButtonIconA.propTypes = {
	type: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	onClick: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.func,
	]),
}

export function ButtonIconDropdown ({ items, icon, direction = "right-0" }) {
	return <div className="relative inline-block">
		<div className="dropdown-btn cursor-pointer">
			<div className={`relative inline-flex justify-center rounded-md text-lg px-2 py-2 shadow-sm bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300`}>
				<span className={`icon-${icon} text-gray-600`}></span>
			</div>
		</div>

		<div className={`dropdown-items absolute ${direction} -z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95`}
			 role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1"
		>
			<div className="py-2" role="none">
				{items.map((item, index) => {
					if (item && item.data) {
						return <div className="w-full" key={index}>
							{item.data}
						</div>
					}
				})}
			</div>
		</div>
	</div>
}

ButtonIconDropdown.propTypes = {
	items: PropTypes.array.isRequired,
	icon: PropTypes.string.isRequired,
	direction: PropTypes.string,
	onClick: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.func,
	]),
}


export function ButtonIconDropdownHorizontal ({ items, icon, direction = "right-0", width = "" }) {
	return <div className="relative inline-block">
		<div className="dropdown-btn cursor-pointer">
			<div className={`relative inline-flex justify-center rounded-md text-lg px-2 py-2 shadow-sm bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300`}>
				<span className={`icon-${icon} text-gray-600`}></span>
			</div>
		</div>

		<div className={`dropdown-items absolute ${direction} -z-10 w-56 ${width} origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95`}
			 role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1"
		>
			<div className="py-2 divide-y md:flex md:flex-row-reverse sm:divide-x sm:divide-x-reverse sm:divide-y-0 sm:py-0" role="none">
				{items.map((itemP, index) => {
					if (itemP && itemP.length > 0) {
						return <div className="w-full" key={index}>
							{itemP.map((item, index1) => {
								if(item && item.data){
									return <div className="w-full" key={index + "-" + index1}>
										{item.data}
									</div>
								}
							})}
						</div>
					}
				})}
			</div>
		</div>
	</div>
}

ButtonIconDropdownHorizontal.propTypes = {
	items: PropTypes.array.isRequired,
	icon: PropTypes.string.isRequired,
	direction: PropTypes.string,
	onClick: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.func,
	]),
}
