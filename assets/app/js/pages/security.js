import "../../css/pages/security.scss"

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";
import { Forget } from '@appFolder/pages/components/Security/Forget';
import { Reinit } from "@appFolder/pages/components/Security/Reinit";

Routing.setRoutingData(routes);

let el = document.getElementById("forget");
if(el){
    createRoot(el).render(<Forget />)
}

el = document.getElementById("reinit");
if(el){
    createRoot(el).render(<Reinit {...el.dataset} />)
}

let btnSeePassword = document.querySelector('.btn-see-password');
if(btnSeePassword){
    let seePassword = false;
    let inputSeePassword = document.querySelector('#password');
    btnSeePassword.addEventListener('click', function (e){
        if(seePassword){
            seePassword = false;
            inputSeePassword.type = "password";
            btnSeePassword.classList.remove("active");
        }else{
            seePassword = true;
            inputSeePassword.type = "text";
            btnSeePassword.classList.add("active");
        }
    })
}
