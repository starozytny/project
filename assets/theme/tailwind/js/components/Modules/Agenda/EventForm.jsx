import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { TinyMCE } from "@tailwindComponents/Elements/TinyMCE";
import { Input, Switcher } from "@tailwindComponents/Elements/Fields";

const URL_INDEX_ELEMENTS = "admin_agenda_index";
const URL_CREATE_ELEMENT = "intern_api_agenda_events_create";
const URL_UPDATE_GROUP = "intern_api_agenda_events_update";
const TEXT_CREATE = "Ajouter l'évènement";
const TEXT_UPDATE = "Enregistrer les modifications";

export function EventFormulaire ({ context, element }) {
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if (context === "update") {
        url = Routing.generate(URL_UPDATE_GROUP, { 'id': element.id });
    }

    return <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
        type={element ? Formulaire.setValue(element.type) : 0}
        content={element ? Formulaire.setValue(element.content) : ""}
        localisation={element ? Formulaire.setValue(element.localisation) : ""}
        startAt={element ? Formulaire.setValueDate(element.startAt) : ""}
        endAt={element ? Formulaire.setValueDate(element.endAt) : ""}
        startTime={element ? Formulaire.setValueTime(element.startAt) : ""}
        endTime={element ? Formulaire.setValueTime(element.endAt) : ""}
        allDay={element ? Formulaire.setValue([element.allDay ? 1 : 0]) : [0]}
    />
}

EventFormulaire.propTypes = {
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
            localisation: props.localisation,
            startAt: props.startAt,
            endAt: props.endAt,
            startTime: props.startTime,
            endTime: props.endTime,
            allDay: props.allDay,
            errors: [],
        }
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if (name === "allDay") {
            value = (e.currentTarget.checked) ? [1] : [0] // parseInt because work with int this time
        }

        this.setState({ [name]: value })
    }

    handleChangeTinyMCE = (name, html) => {
        this.setState({ [name]: { value: this.state[name].value, html: html } })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url } = this.props;
        const { name, type, allDay, startAt, startTime, endAt, endTime } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            { type: "text", id: 'name', value: name },
            { type: "text", id: 'type', value: type },
            { type: "text", id: 'type', value: type },
            { type: "date", id: 'startAt', value: startAt },
        ];

        if (allDay[0] === 0) {
            paramsToValidate = [...paramsToValidate, ...[
                { type: "time", id: 'startTime', value: startTime },
                { type: "date", id: 'endAt', value: endAt },
                { type: "time", id: 'endTime', value: endTime },
            ]];
        }

        Formulaire.generiqueSendForm(this, context, paramsToValidate, url, this.state, Routing.generate(URL_INDEX_ELEMENTS));
    }

    render () {
        const { context } = this.props;
        const { errors, name, content, localisation, startAt, endAt, startTime, endTime, allDay } = this.state;

        let params = { errors: errors, onChange: this.handleChange }

        let allDayItems = [{ value: 1, label: "Oui", identifiant: "oui" }]

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="flex flex-col gap-4 xl:gap-6">
                    <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                        <div>
                            <div className="font-medium text-lg">Évènement</div>
                        </div>
                        <div className="flex gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                            <div className="w-full">
                                <Input identifiant="name" valeur={name} {...params}>Nom de l'évènement</Input>
                            </div>
                            <div className="w-full">
                                <Input identifiant="localisation" valeur={localisation} {...params}>Lieu de l'évènement</Input>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                        <div>
                            <div className="font-medium text-lg">Dates</div>
                        </div>
                        <div className="flex flex-col gap-4 bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                            <div>
                                <Switcher items={allDayItems} identifiant="allDay" valeur={allDay} {...params}>
                                    Toute la journée
                                </Switcher>
                            </div>
                            <div>
                                {parseInt(allDay[0]) === 1
                                    ? <div>
                                        <Input type="date" identifiant="startAt" valeur={startAt} {...params}>Journée du</Input>
                                    </div>
                                    : <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-full">
                                                <Input type="date" identifiant="startAt" valeur={startAt} {...params}>Début</Input>
                                            </div>
                                            <div className="w-full">
                                                <Input type="time" identifiant="startTime" valeur={startTime} {...params}>&nbsp;</Input>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-full">
                                                <Input type="date" identifiant="endAt" valeur={endAt} {...params}>Fin</Input>
                                            </div>
                                            <div className="w-full">
                                                <Input type="time" identifiant="endTime" valeur={endTime} {...params}>&nbsp;</Input>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2 xl:grid-cols-3 xl:gap-6">
                        <div>
                            <div className="font-medium text-lg">Contenu</div>
                        </div>
                        <div className="bg-white p-4 rounded-md ring-1 ring-inset ring-gray-200 xl:col-span-2">
                            <TinyMCE type={99} identifiant='content' valeur={content.value}
                                     errors={errors} onUpdateData={this.handleChangeTinyMCE}>
                                Description
                            </TinyMCE>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <Button type="blue" isSubmit={true}>{context === "create" ? TEXT_CREATE : TEXT_UPDATE}</Button>
                </div>
            </form>
        </>
    }
}

Form.propTypes = {
    context: PropTypes.string.isRequired,
    url: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    localisation: PropTypes.string.isRequired,
    startAt: PropTypes.string.isRequired,
    endAt: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    allDay: PropTypes.array.isRequired,
}
