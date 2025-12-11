import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import axios from "axios";

import Sanitaze from "@commonFunctions/sanitaze";
import Formulaire from "@commonFunctions/formulaire";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon, ButtonIconA } from "@tailwindComponents/Elements/Button";
import { Switcher } from "@tailwindComponents/Elements/Fields";

const URL_UPDATE_PAGE = "admin_changelogs_update";
const URL_UPDATE_PUBLISH = "intern_api_changelogs_switch_publish";

export function ChangelogsItem ({ elem, highlight, onModal }) {
	const refItem = useRef(null);

	let nHighlight = useHighlight(highlight, elem.id, refItem);

	const [loadSwitch, setLoadSwitch] = useState(false);
	const [isPublished, setIsPublished] = useState([elem.isPublished ? 1 : 0]);

	let handleSwitch = (e) => {
		let self = this;
		let checked = e.currentTarget.checked;
		let value = e.currentTarget.value;

		if (!loadSwitch) {
			setLoadSwitch(true);
			setIsPublished(checked ? [parseInt(value)] : []);
			axios({ method: "PUT", url: Routing.generate(URL_UPDATE_PUBLISH, { id: elem.id }), data: {} })
				.then(function (response) {
					setLoadSwitch(false);
					setIsPublished([response.data.isPublished ? 1 : 0]);
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
			;
		}
	}

	let urlUpdate = Routing.generate(URL_UPDATE_PAGE, { 'id': elem.id });
	let publishedItems = [{ value: 1, identifiant: "oui-" + elem.id }]

	let icons = ["icon-question", "icon-warning", "icon-error"];
	let texts = ["text-blue-700", "text-yellow-500", "text-red-600"];

	return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1">
					<div>
						<div className="flex items-center gap-2">
							<span className={`${icons[elem.type]} ${texts[elem.type]} !font-semibold`}></span>
							<span className="font-medium">{elem.name}</span>
						</div>
						<div className="text-gray-600 text-sm">
							{elem.updatedAt
								? "Modifié : " + Sanitaze.toDateFormat(elem.updatedAt)
								: Sanitaze.toDateFormat(elem.createdAt)
							}
						</div>
					</div>
				</div>
				<div className="col-2 text-gray-600">
					<div dangerouslySetInnerHTML={{ __html: elem.content }} />
				</div>
				<div className="col-3">
					<Switcher items={publishedItems} identifiant="isPublished" valeur={isPublished}
							  errors={[]} onChange={handleSwitch} />
				</div>
				<div className="col-4 actions">
					<ButtonIconA type="default" icon="pencil" onClick={urlUpdate}>Modifier</ButtonIconA>
					<ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
				</div>
			</div>
		</div>
	</div>
}

ChangelogsItem.propTypes = {
	elem: PropTypes.object.isRequired,
	onModal: PropTypes.func.isRequired,
}
