import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { ChangelogsItem } from "@adminPages/Changelogs/ChangelogsItem";

export function ChangelogsList ({ data, highlight, onModal }) {
	return <div className="list">
		<div className="list-table">
			<div className="items items-changelogs">
				<div className="item item-header">
					<div className="item-content">
						<div className="item-infos">
							<div className="col-1">Intitulé</div>
							<div className="col-2">Description</div>
							<div className="col-3">Publication</div>
							<div className="col-4 actions" />
						</div>
					</div>
				</div>

				{data.length > 0
					? data.map((elem) => {
						return <ChangelogsItem key={elem.id} elem={elem} highlight={highlight} onModal={onModal} />;
					})
					: <Alert type="gray">Aucune donnée enregistrée.</Alert>
				}
			</div>
		</div>
	</div>
}

ChangelogsList.propTypes = {
	data: PropTypes.array.isRequired,
	onModal: PropTypes.func.isRequired,
	highlight: PropTypes.number,
}
