import "../../css/pages/storage.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Storage } from "@adminPages/Storage/Storage";

let el = document.getElementById("storage_list");
if(el){
    createRoot(el).render(<Storage />)
}
