import "../../css/pages/users.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Users } from "@adminPages/Users/Users";
import { UserFormulaire } from "@adminPages/Users/UserForm";
import { UserExport } from "@adminPages/Users/UserExport";
import { UserPassword } from "@adminPages/Users/UserPassword";

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

el = document.getElementById("users_password");
if(el){
    createRoot(el).render(<UserPassword token={el.dataset.token}/>)
}

let exportData = document.getElementById("users_export");
if(exportData){
    createRoot(exportData).render(<UserExport />)
}
