import "../../css/pages/mails.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Mails } from "@adminPages/Mails/Mails";

let el = document.getElementById("mails");
if(el){
    createRoot(el).render(<Mails {...el.dataset} />)
}
