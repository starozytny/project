import React from "react";
import { createRoot } from "react-dom/client";
import { Forget } from '@appFolder/pages/components/Security/Forget';
import { Reinit } from "@appFolder/pages/components/Security/Reinit";

let el = document.getElementById("forget");
if(el){
    createRoot(el).render(<Forget />)
}

el = document.getElementById("reinit");
if(el){
    createRoot(el).render(<Reinit {...el.dataset} />)
}

let inputShow = document.querySelector('.input-show');
if(inputShow){
    let seePassword = false;
    let inputPassword = document.querySelector('#password');
    let iconPassword  = document.getElementById('password-icon');
    inputShow.addEventListener('click', function (e){
        if(seePassword){
            seePassword = false;
            inputPassword.type = "password";
            iconPassword.classList.remove("icon-vision-not");
            iconPassword.classList.add("icon-vision");
        }else{
            seePassword = true;
            inputPassword.type = "text";
            iconPassword.classList.add("icon-vision-not");
            iconPassword.classList.remove("icon-vision");
        }
    })
}
