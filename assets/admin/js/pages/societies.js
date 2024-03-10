import "../../css/pages/societies.scss"

import React from "react";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';
import { createRoot } from "react-dom/client";
import { Societies } from "@adminPages/Societies/Societies";
import { SocietyFormulaire } from "@adminPages/Societies/SocietyForm";
import { Users } from "@adminPages/Users/Users";

const URL_GET_USERS = "intern_api_users_society";

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


el = document.getElementById("societies_users");
if(el){
    createRoot(el).render(<Users urlGetData={Routing.generate(URL_GET_USERS, {'society': el.dataset.id})} />)
}
