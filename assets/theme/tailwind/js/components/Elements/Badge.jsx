import React from 'react';
import PropTypes from 'prop-types';

export function Badge ({ type, children, onClick }) {
	const typeVariants = {
		red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
		yellow: 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
		green: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
		blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10',
		indigo: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
		gray: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
	}

	return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${typeVariants[type]}`} onClick={onClick}>
		{children}
	</span>
}

Badge.propTypes = {
	type: PropTypes.string,
}
