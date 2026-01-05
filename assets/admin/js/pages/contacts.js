import "../../css/pages/contacts.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Contacts } from "@adminPages/Contacts/Contacts";

let el = document.getElementById("contacts_list");
if(el){
    createRoot(el).render(<Contacts {...el.dataset} />)
}
