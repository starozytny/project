import React, { Component } from "react";

import frLocale          from '@fullcalendar/core/locales/fr';
import FullCalendar      from "@fullcalendar/react";
import dayGridPlugin     from '@fullcalendar/daygrid';
import timeGridPlugin    from '@fullcalendar/timegrid';
import listPlugin        from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

export class Agenda extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialView: (window.matchMedia("(min-width: 768px)").matches) ? "timeGridWeek" : "timeGridDay",
        }
    }

    render () {
        const { initialView } = this.state;

        let events = [];
        return <div>

            <div className="module-calendar" id="fullcalendar-custom">
                <FullCalendar
                    locale={frLocale}
                    initialView={initialView}
                    plugins={[ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ]}
                    headerToolbar={{
                        left: 'timeGridDay,timeGridWeek',
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
                    events={events}
                />
            </div>

        </div>
    }
}
