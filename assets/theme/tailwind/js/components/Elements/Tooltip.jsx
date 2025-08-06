import React from "react";
import PropTypes from 'prop-types';

export function Tooltip ({ info, children, width, position }) {
	let divStyle = width ? { width: width + "px" } : null;

	let tooltipPos = position ? position : "-top-7 right-0"

	return <div className="relative tooltip-btn">
		{children}
		<span className={`tooltip bg-gray-800 text-slate-50 py-1 px-2 rounded absolute ${tooltipPos} text-xs hidden`} style={divStyle}>
			{info}
		</span>
	</div>
}

Tooltip.propTypes = {
	info: PropTypes.string.isRequired,
	width: PropTypes.number,
	position: PropTypes.string
}
