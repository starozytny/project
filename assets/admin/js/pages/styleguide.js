import "../../css/pages/styleguide.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Styleguide } from "@adminPages/Styleguide/Styleguide";

Routing.setRoutingData(routes);

let el = document.getElementById("styleguide_list");
if(el){
    createRoot(el).render(<Styleguide />)
}
