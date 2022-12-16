import "../../css/pages/users.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Users } from "./pages/Users/Users";

let el = document.getElementById("users_list");
if(el){
    createRoot(el).render(<Users {...el.dataset} />)
}
