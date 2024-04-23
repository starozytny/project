import '../css/app.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { createRoot } from "react-dom/client";

import Menu from "@tailwindFunctions/menu";
import Toastr from "@tailwindFunctions/toastr";

import { ContactFormulaire } from "@appFolder/pages/components/Contact/ContactForm";
import { Cookies } from "@tailwindComponents/Modules/Cookies/Cookies";

Routing.setRoutingData(routes);

Menu.menuListener();
Toastr.flashes();
inputPassword();

let el = document.getElementById("contacts_create");
if(el){
    createRoot(el).render(<ContactFormulaire />)
}

let ck = document.getElementById("cookies");
if(ck){
    createRoot(ck).render(<Cookies {...ck.dataset} />)
}

function inputPassword () {
    let inputShow = document.querySelector('.input-show');
    if(inputShow){
        let see = false;
        let input = document.querySelector('#password');
        let icon = document.querySelector('.input-show > span');
        inputShow.addEventListener('click', function (e){
            if(see){
                see = false;
                input.type = "password";
                icon.classList.remove("icon-vision-not");
                icon.classList.add("icon-vision");
            }else{
                see = true;
                input.type = "text";
                icon.classList.add("icon-vision-not");
                icon.classList.remove("icon-vision");
            }
        })
    }
}
