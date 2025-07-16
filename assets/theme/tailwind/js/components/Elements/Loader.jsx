import React from "react";

export function LoaderElements ({ text = "Chargement des données" }) {
	return <div className="bg-white rounded-md shadow">
		<div className="py-6 px-4 text-center">
			<span className="icon-chart-3 inline-block animate-spin"></span>
			<span className="ml-2">{text}...</span>
		</div>
	</div>
}

export function LoaderTxt ({ text = "Chargement des données" }) {
	return <div>
		<span className="icon-chart-3 inline-block animate-spin"></span>
		<span className="ml-2">{text}...</span>
	</div>
}

export function LoadingInput ({ children }) {
	return <div>
		<label className="block text-sm font-medium leading-6 text-gray-800">
			{children}
		</label>
		<div className="h-9 block bg-white w-full rounded-md border-0 py-2 px-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300">
			<span className="icon-chart-3 inline-block translate-y-0.5"></span>
		</div>
	</div>
}
