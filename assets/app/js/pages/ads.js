import '../../css/pages/ads.scss';
import "leaflet/dist/leaflet.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { Ads } from "@appPages/Immo/Ads/Ads";
import { Diag } from "@appPages/Immo/Diag/Diag";
import { DemandeFormulaire } from "@appPages/Immo/Demande/DemandeForm";

let el = document.getElementById("ads_list");
if(el){
	createRoot(el).render(<Ads {...el.dataset} />)
}

let diag = document.getElementById("diagnostic_read");
if(diag){
	createRoot(diag).render(<Diag elem={JSON.parse(diag.dataset.elem)} />)
}

let dm = document.getElementById("demande_create");
if(dm){
	createRoot(dm).render(<DemandeFormulaire {...dm.dataset} />)
}
