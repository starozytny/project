import "../../css/pages/demandes.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Demandes } from "@adminPages/Immo/Demandes/Demandes";

let el = document.getElementById("demandes_list");
if(el){
    createRoot(el).render(<Demandes />)
}
