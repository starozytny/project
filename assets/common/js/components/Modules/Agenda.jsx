import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import "moment/locale/fr";

import frLocale          from '@fullcalendar/core/locales/fr';
import FullCalendar      from "@fullcalendar/react";
import dayGridPlugin     from '@fullcalendar/daygrid';
import timeGridPlugin    from '@fullcalendar/timegrid';
import listPlugin        from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import Formulaire        from "@commonFunctions/formulaire";

import { LoaderElements } from "@commonComponents/Elements/Loader";

const URL_GET_DATA = "api_agenda_events_list"

export class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialView: (window.matchMedia("(min-width: 768px)").matches) ? "dayGridMonth" : "timeGridDay",
            data: [],
            loadingData: true
        }
    }

    componentDidMount = () => {
        const self = this;
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
            .then(function (response) {
                let data = response.data;
                let nData = [];
                data.forEach(elem => {
                    nData.push(createEventStructure(elem));
                })
                self.setState({ data: nData, loadingData: false })
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    render () {
        const { loadingData, initialView, data } = this.state;

        console.log(data);

        return <div>
            {loadingData
                ? <LoaderElements />
                : <div className="module-calendar" id="fullcalendar-custom">
                    <FullCalendar
                        locale={frLocale}
                        initialView={initialView}
                        plugins={[ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ]}
                        headerToolbar={{
                            left: 'timeGridDay,dayGridMonth,timeGridWeek',
                            center: 'title',
                            right: 'prev,next'
                        }}
                        allDayText={""}
                        hiddenDays={[ 0 ]}
                        slotMinTime={"08:00:00"}
                        slotMaxTime={"22:00:00"}
                        eventMinHeight={60}
                        editable={true}
                        droppable={true}
                        events={data}
                    />
                </div>
            }
        </div>
    }
}

function createEventStructure(elem) {
    let params = {
        id: elem.id,
        title: elem.name,
        start: moment(elem.startAt).format('YYYY-MM-DD HH:mm'),
        allDay: elem.allDay,
        extendedProps: {
            localisation: elem.localisation,
            content: elem.content,
        },
        classNames: "event"
    };

    if(!elem.allDay && elem.endAt){
        params = {...params, ...{endAt: moment(elem.endAt).format('YYYY-MM-DD HH:mm')}}
    }

    return params
}
