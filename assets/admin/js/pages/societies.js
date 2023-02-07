import "../../css/pages/societies.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Societies } from "@adminPages/Societies/Societies";
import { SocietyFormulaire } from "@adminPages/Societies/SocietyForm";

Routing.setRoutingData(routes);

let el = document.getElementById("societies_list");
if(el){
    createRoot(el).render(<Societies {...el.dataset} />)
}

el = document.getElementById("societies_update");
if(el){
    createRoot(el).render(<SocietyFormulaire context="update"
                                             settings={JSON.parse(el.dataset.settings)}
                                             element={JSON.parse(el.dataset.obj)} />)
}

el = document.getElementById("societies_create");
if(el){
    createRoot(el).render(<SocietyFormulaire context="create"
                                             settings={JSON.parse(el.dataset.settings)}
                                             element={null} />)
}
