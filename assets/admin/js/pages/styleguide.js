import "../../css/pages/styleguide.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Styleguide } from "@adminPages/Styleguide/Styleguide";

let el = document.getElementById("styleguide_list");
if(el){
    createRoot(el).render(<Styleguide />)
}
