import "../../css/pages/mails.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Mails } from "@adminPages/Mails/Mails";

Routing.setRoutingData(routes);

let el = document.getElementById("mails");
if(el){
    createRoot(el).render(<Mails data={JSON.parse(el.dataset.donnees)} />)
}
