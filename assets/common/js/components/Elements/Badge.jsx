import React from 'react';

export function Badge ({ type, children, onCLick })
{
	const typeVariants = {
		blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10',
		gray: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
	}

	return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${typeVariants[type]}`} onClick={onCLick}>
		{children}
	</span>
}
