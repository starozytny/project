import React, { Component } from "react";

import Sanitaze from "@commonFunctions/sanitaze";

export class Diag extends Component {
	render () {
		const { elem, style = null } = this.props;

		let content = "";
		if (elem.diag && elem.codeTypeBien !== 2 && elem.codeTypeBien !== 3) {

			content = <div className="no-diag">Le diagnostic de performance énergétique et d'indice d'émission de gaz à effet de serre n'ont pas été soumis pour le moment.</div>
			let dpeNotFound = <>
				<div className="diag-title" style={style}>Le diagnostic de performance énergétique</div>
				<div className="diag-empty">Le diagnostic de performance énergétique n'a pas été soumis pour le moment.</div>
			</>
			let gesNotFound = <>
				<div className="diag-title" style={style}>L'indice d'émission de gaz à effet de serre</div>
				<div className="diag-empty">L'indice d'émission de gaz à effet de serre n'a pas été soumis pour le moment.</div>
			</>
			let dpeVierge = <>
				<div className="diag-title" style={style}>Le diagnostic de performance énergétique</div>
				<div className="diag-empty">Le diagnostic de performance énergétique est vierge.</div>
			</>
			let gesVierge = <>
				<div className="diag-title" style={style}>L'indice d'émission de gaz à effet de serre</div>
				<div className="diag-empty">L'indice d'émission de gaz à effet de serre est vierge.</div>
			</>

			let diagnostic = elem.diag;

			let dateDiag = null;
			let diagInfos = null;
			if (diagnostic.diag !== 2 && diagnostic.diag !== 3
				&& diagnostic.gesLetter && diagnostic.gesLetter !== "NS" && diagnostic.gesLetter !== "VI"
				&& diagnostic.dpeLetter && diagnostic.dpeLetter !== "NS" && diagnostic.dpeLetter !== "VI") {
				dateDiag = diagnostic.diag !== 99 ? "Diagnostic réalisé " + (diagnostic.diag === 0 ? "avant" : "après") + " le 1er Juillet 2021" : "";

				if (diagnostic.createdAtDpe) {
					dateDiag = <div className="date-release">Diagnostic réalisé le {Sanitaze.toFormatDate(diagnostic.createdAtDpe, 'L')}</div>
				}

				diagInfos = <>
					{diagnostic.referenceDpe ? <>
						<div>Date de référence des prix de l'énergie utilisés : {Sanitaze.toFormatDate(diagnostic.referenceDpe, 'L')}</div>
					</> : ""}
					{diagnostic.minAnnual && diagnostic.minAnnual !== 0 && diagnostic.maxAnnual && diagnostic.maxAnnual !== 0 ? <>
						<div>Estimation des coûts annuels d’énergie : entre {Sanitaze.toFormatCurrency(diagnostic.minAnnual)} et {Sanitaze.toFormatCurrency(diagnostic.maxAnnual)} / an</div>
					</> : ""}
				</>
			}

			let isVirgin = diagnostic.diag === 2;
			let isNotSend = diagnostic.diag === 3;

			let noDiagDpe = false, noDiagGes = false;
			if (isVirgin || isNotSend) {
				noDiagDpe = true;
				noDiagGes = true;
			} else {
				if (diagnostic.dpeLetter === null || diagnostic.dpeLetter === "NS" || diagnostic.dpeLetter === "VI") {
					noDiagDpe = true;
				}
				if (diagnostic.gesLetter === null || diagnostic.gesLetter === "NS" || diagnostic.gesLetter === "VI") {
					noDiagGes = true;
				}
			}

			content = <>
				<div className="graphs flex flex-col gap-4">
					<div className={"graph" + (noDiagDpe ? " no-diag" : "")}>
						{diagnostic.dpeLetter && diagnostic.dpeLetter !== "NS" && diagnostic.dpeLetter !== "VI" ? <>
							<DiagDetails isDpe={true} elem={elem} style={style} isVirgin={isVirgin} isNotSend={isNotSend} />
							{diagnostic.dpeLetter === "F" || diagnostic.dpeLetter === "G" && <>
								<div className="diag-excessif">Logement à consommation énergétique excessive : classe {diagnostic.dpeLetter}</div>
							</>}
						</> : (isVirgin) ? dpeVierge : dpeNotFound}
					</div>

					<div className={"graph" + (noDiagGes ? " no-diag" : "")}>
						{diagnostic.gesLetter && diagnostic.gesLetter !== "NS" && diagnostic.gesLetter !== "VI" ? <>
							<DiagDetails isDpe={false} elem={elem} style={style} isVirgin={isVirgin} isNotSend={isNotSend} />
						</> : (isVirgin) ? gesVierge : gesNotFound}
					</div>
				</div>

				<div className="diag-infos">
					{dateDiag ? dateDiag : <div>&nbsp;</div>}
					{diagInfos ? diagInfos : <>
						<div>&nbsp;</div>
						<div>&nbsp;</div>
					</>}
				</div>
			</>
		}

		return <div className="diagnostics">
			{content}
		</div>
	}
}

export function DiagDetails ({ isDpe, elem, style, isVirgin = false, isNotSend = false }) {
	let title = isDpe ? "Diagnostic de performance énergétique" : "Indice d'émission de gaz à effet de serre";
	let title2 = isDpe ? "Le diagnostic de performance énergétique" : "L'indice d'émission de gaz à effet de serre";
	let lettersDetails = ["", "A", "B", "C", "D", "E", "F", "G"];
	let classDiag = isDpe ? "dpe" : "ges";
	let unity = isDpe ? "kWh/m²/an" : "kgCO2/m²/an";
	let borneA = isDpe ? "Logement extrêmement performant" : "Peu d'émissions de CO2";
	let borneB = isDpe ? "Logement extrêmement peu performant" : "Emission de CO2 très importantes";
	let value = isDpe ? elem.diag.dpeValue : elem.diag.gesValue;

	let content = <div>{title2} n'a pas été soumis.</div>
	if (isVirgin || isNotSend) {
		content = isVirgin ? <div>{title2} est vierge.</div> : content;
	} else {
		content = <div className={"diagnostic diagnostic-" + classDiag}>
			<div className="diag-borne">{borneA}</div>
			<div className="diag-details">
				<div className={"diag-" + classDiag}>
					{lettersDetails.map((letter, index) => {
						if (index !== 0) {
							let comparator = isDpe ? elem.diag.dpeLetter : elem.diag.gesLetter;
							if (isDpe && elem.diag.gesLetter && elem.diag.gesLetter > elem.diag.dpeLetter) {
								comparator = elem.diag.gesLetter;
							}

							let active = comparator === letter ? " active" : "";

							return <div className={"diag-line" + active} key={index}>
								<div className="number">
									<div className="value">{value && value !== "" ? value : "N.C"}</div>
									{comparator === letter ? <>
										<div className="unity">{unity}</div>
										<div className="flottant">
											{isDpe ? <>
												<div>consommation</div>
												<div>(énergie primaire)</div>
											</> : <>
												<div>émissions</div>
											</>}
										</div>
									</> : null}
								</div>
								{isDpe ? <>
									<div className="number number-2">
										<div className="value">{elem.diag.gesValue && elem.diag.gesValue !== "" ? elem.diag.gesValue : "N.C"}</div>
										{comparator === letter ? <>
											<div className="unity">kgCO2/m²/an</div>
											<div className="flottant">
												<div>émissions</div>
											</div>
										</> : null}
									</div>
								</> : null}
								<div className={"diag-letter " + classDiag + " " + classDiag + "-" + letter.toLowerCase()}>
									<div className="letter">{letter}</div>
								</div>
							</div>
						}
					})}
				</div>
			</div>
			<div className="diag-borne">{borneB}</div>
		</div>
	}

	return <>
		<div className="diag-title" style={style}>{title}</div>
		{content}
	</>;
}
