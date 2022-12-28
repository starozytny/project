import "../../css/pages/settings.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { SettingsFormulaire } from "@adminPages/Settings/SettingsForm";

Routing.setRoutingData(routes);

let el = document.getElementById("settings_update");
if(el){
    createRoot(el).render(<SettingsFormulaire element={JSON.parse(el.dataset.obj)} />)
}
