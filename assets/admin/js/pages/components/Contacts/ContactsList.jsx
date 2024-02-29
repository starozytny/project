import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { ContactsItem } from "@adminPages/Contacts/ContactsItem";

export function ContactsList ({ data, onDelete }) {
	return <div className="list">
		<div className="list-table">
			<div className="items items-contact">
				<div className="item item-header">
					<div className="item-content">
						<div className="item-infos">
							<div className="col-1">Nom/Prénom</div>
							<div className="col-2">Message</div>
							<div className="col-3">Lecture</div>
							<div className="col-4 actions" />
						</div>
					</div>
				</div>

				{data.length > 0
					? data.map((elem) => {
						return <ContactsItem key={elem.id} elem={elem} onDelete={onDelete} />;
					})
					: <Alert type="gray">Aucune donnée enregistrée.</Alert>
				}
			</div>
		</div>
	</div>
}

ContactsList.propTypes = {
	data: PropTypes.array.isRequired,
	onDelete: PropTypes.func.isRequired,
}
