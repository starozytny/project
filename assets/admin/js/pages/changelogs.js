import "../../css/pages/changelogs.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Changelogs } from "@adminPages/Changelogs/Changelogs";
import { ChangelogFormulaire } from "@adminPages/Changelogs/ChangelogForm";

Routing.setRoutingData(routes);

let el = document.getElementById("changelogs_list");
if(el){
    createRoot(el).render(<Changelogs />)
}

el = document.getElementById("changelogs_update");
if(el){
    createRoot(el).render(<ChangelogFormulaire context="update" element={JSON.parse(el.dataset.obj)} />)
}

el = document.getElementById("changelogs_create");
if(el){
    createRoot(el).render(<ChangelogFormulaire context="create" element={null} />)
}
