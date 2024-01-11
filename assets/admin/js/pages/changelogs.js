import "../../css/pages/changelogs.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Changelogs } from "@adminPages/Changelogs/Changelogs";
import { ChangelogFormulaire } from "@adminPages/Changelogs/ChangelogForm";

let el = document.getElementById("changelogs_list");
if(el){
    createRoot(el).render(<Changelogs {...el.dataset} />)
}

el = document.getElementById("changelogs_update");
if(el){
    createRoot(el).render(<ChangelogFormulaire context="update" element={JSON.parse(el.dataset.obj)} />)
}

el = document.getElementById("changelogs_create");
if(el){
    createRoot(el).render(<ChangelogFormulaire context="create" element={null} />)
}
