import '../css/app.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Notifications } from "@commonComponents/Elements/Notifications";
import { Theme } from "@commonComponents/Modules/Theme/Theme";

Routing.setRoutingData(routes);

let notifs = document.getElementById("notifs_list");
if(notifs){
    createRoot(notifs).render(<Notifications />)
}

let theme = document.getElementById("theme_switcher");
if(theme){
    createRoot(theme).render(<Theme {...theme.dataset} />)
}

menu();

function menu() {
    let btn = document.querySelector('.nav-mobile');
    if(btn){
        btn.addEventListener('click', function () {
            let content = document.querySelector('.nav-content');
            if(content.classList.contains('active')){
                content.classList.remove('active');
            }else{
                content.classList.add('active');
            }
        })
    }
}
