import "../../css/pages/settings.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { SettingsFormulaire } from "@adminPages/Settings/SettingsForm";

let el = document.getElementById("settings_update");
if(el){
    createRoot(el).render(<SettingsFormulaire element={JSON.parse(el.dataset.obj)} />)
}
