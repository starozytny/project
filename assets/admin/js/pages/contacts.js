import "../../css/pages/contacts.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Changelogs } from "@adminPages/Changelogs/Changelogs";

Routing.setRoutingData(routes);

let el = document.getElementById("contacts_list");
if(el){
    createRoot(el).render(<Changelogs />)
}
