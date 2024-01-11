import "../../css/pages/agenda.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Agenda } from "@commonComponents/Modules/Agenda/Agenda";
import { EventFormulaire } from "@commonComponents/Modules/Agenda/EventForm";

let el = document.getElementById("agenda_list");
if(el){
    createRoot(el).render(<Agenda />)
}

el = document.getElementById("agenda_update");
if(el){
    createRoot(el).render(<EventFormulaire context="update" element={JSON.parse(el.dataset.obj)} />)
}

el = document.getElementById("agenda_create");
if(el){
    createRoot(el).render(<EventFormulaire context="create" element={null} />)
}
