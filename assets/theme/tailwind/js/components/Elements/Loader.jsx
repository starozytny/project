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
