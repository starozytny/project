import React, { useRef } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon, ButtonIconA } from "@tailwindComponents/Elements/Button";
import { Badge } from "@tailwindComponents/Elements/Badge";

const URL_UPDATE_PAGE = "admin_societies_update";
const URL_READ_PAGE = "admin_societies_read";

export function SocietiesItem ({ elem, highlight, settings, onModal })
{
	const refItem = useRef(null);

	let nHighlight = useHighlight(highlight, elem.id, refItem);

	let urlUpdate = Routing.generate(URL_UPDATE_PAGE, { 'id': elem.id });
	let urlRead = Routing.generate(URL_READ_PAGE, { 'id': elem.id });

	return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1 flex flex-row gap-4">
					<a href={urlRead} className="w-32 h-24 rounded-md overflow-hidden">
						<img src={elem.logoFile} alt="logo" className="w-full h-full object-cover" />
					</a>
					<div>
						<div className="font-semibold">{elem.code} - {elem.name}</div>
					</div>
				</div>
				<div className="col-2">
					<div>{elem.manager}</div>
				</div>
				<div className="col-3">
					{!settings.multipleDatabase || elem.isActivated
						? <Badge type="blue">Activée</Badge>
						: (elem.isGenerated
                            ? <div className="cursor-pointer"><Badge type="gray" onClick={() => onModal("activate", elem)}>Cliquez pour activer</Badge></div>
                            : <div className="cursor-pointer"><Badge type="gray" onClick={() => onModal("generate", elem)}>Cliquez pour générer</Badge></div>
						)
					}
				</div>
				<div className="col-4 actions">
					<ButtonIconA type="default" icon="pencil" onClick={urlUpdate}>Modifier</ButtonIconA>
					<ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
				</div>
			</div>
		</div>
	</div>
}

SocietiesItem.propTypes = {
	elem: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	onModal: PropTypes.func.isRequired,
	highlight: PropTypes.number,
}
