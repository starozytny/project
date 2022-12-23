import "../../css/pages/users.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Users } from "@adminPages/Users/Users";
import { UserFormulaire } from "@adminPages/Users/UserForm";

Routing.setRoutingData(routes);

let el = document.getElementById("users_list");
if(el){
    createRoot(el).render(<Users {...el.dataset} />)
}

el = document.getElementById("users_update");
if(el){
    createRoot(el).render(<UserFormulaire context="update" element={JSON.parse(el.dataset.obj)} />)
}

el = document.getElementById("users_create");
if(el){
    createRoot(el).render(<UserFormulaire context="create" element={null} />)
}
