import "../../css/pages/storage.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Storage } from "@adminPages/Storage/Storage";

Routing.setRoutingData(routes);

let el = document.getElementById("storage_list");
if(el){
    createRoot(el).render(<Storage directories={JSON.parse(el.dataset.directories)} />)
}
