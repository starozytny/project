import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input, Radiobox } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";

const URL_INDEX_ELEMENTS = "admin_changelogs_index";
const URL_CREATE_ELEMENT = "intern_api_changelogs_create";
const URL_UPDATE_GROUP = "intern_api_changelogs_update";

export function ChangelogFormulaire ({ context, element }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_GROUP, { id: element.id });
	}

	return <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
        type={element ? Formulaire.setValue(element.type) : 0}
        content={element ? Formulaire.setValue(element.content) : ""}
    />;
}

ChangelogFormulaire.propTypes = {
	context: PropTypes.string.isRequired,
	element: PropTypes.object,
}

class Form extends Component {
	constructor (props) {
		super(props);

		let content = props.content ? props.content : ""

		this.state = {
			name: props.name,
			type: props.type,
			content: { value: content, html: content },
			errors: [],
		}
	}

	handleChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value })
	}

    handleChangeTinyMCE = (name, html) => {
        this.setState({ [name]: { value: this.state[name].value, html: html } })
    }

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url } = this.props;
		const { name, type, content } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'type', value: type },
			{ type: "text", id: 'content', value: content },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: context === "update" ? "PUT" : "POST", url: url, data: this.state })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { 'h': response.data.id });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
        const { context } = this.props;
        const { errors, name, type, content } = this.state;

        let typesItems = [
            { value: 0, identifiant: 'type-0', label: 'Information' },
            { value: 1, identifiant: 'type-1', label: 'Attention' },
            { value: 2, identifiant: 'type-2', label: 'Danger' },
        ]

        let params0 = { errors: errors, onChange: this.handleChange };
        let params1 = { errors: errors, onUpdateData: this.handleChangeTinyMCE };

        return <form onSubmit={this.handleSubmit}>
            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Identification</div>
                    </div>
                    <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <div>
                            <Input identifiant="name" valeur={name} {...params0}>Intitulé</Input>
                        </div>
                        <div>
                            <Radiobox items={typesItems} identifiant="type" valeur={type} {...params0}
                                      classItems="flex gap-2" styleType="fat">
                                Type de changelog
                            </Radiobox>
                        </div>
                    </div>
                </div>
                <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                    <div>
                        <div className="font-medium text-lg">Contenu</div>
                    </div>
                    <div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                        <TinyMCE type={0} identifiant='content' valeur={content.value}{...params1}>
                            Description
                        </TinyMCE>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button type="blue" isSubmit={true}>
                	{context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
                </Button>
            </div>
        </form>
    }
}

Form.propTypes = {
    context: PropTypes.string.isRequired,
    url: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
}
