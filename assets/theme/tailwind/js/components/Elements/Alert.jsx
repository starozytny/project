import React from "react";
import PropTypes from 'prop-types';

export function Alert ({ type, icon, title, children }) {
	const typeVariants = {
		blue: 'bg-blue-50 text-blue-700 border border-blue-400',
		red: 'bg-red-50 text-red-700 border border-red-500',
		gray: 'bg-gray-50 text-gray-700 border',
	}

	return <div className={`flex flex-row gap-4 ${typeVariants[type]} rounded-md p-6 xl:p-4`}>
		{icon
			? <div><span className={`icon-${icon} inline-block translate-y-0.5`}></span></div>
			: null
		}
		<div>
			{title
				? <div className="font-semibold mb-2 xl:mb-0">{title}</div>
				: null
			}
			<div className="leading-6">{children}</div>
		</div>
	</div>
}

Alert.propTypes = {
	type: PropTypes.string.isRequired,
	icon: PropTypes.string,
	title: PropTypes.string,
	color: PropTypes.string,
	ring: PropTypes.bool,
}
