import "../../css/pages/help.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Faq } from "@adminPages/Help/Faq";

Routing.setRoutingData(routes);

let el = document.getElementById("help_faq");
if(el){
    createRoot(el).render(<Faq />)
}
