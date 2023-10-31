import React, { useState, useEffect } from 'react';

export function Theme ({ consent, initTheme })
{
    const [theme, setTheme] = useState(initTheme);

    const light = "light-mode";
    const dark = "dark-mode";

    let body = document.querySelector('body');

    useEffect(() => {
        let st = localStorage.getItem(consent);
        if(st){
            if(st === light){
                body.classList.add(light)
                body.classList.remove(dark)
                setTheme(light)
            }else if(st === dark){
                body.classList.add(dark)
                body.classList.remove(light)
                setTheme(dark)
            }
        }
    }, []);


    let  handleSwitch = () => {
        if(body.classList.contains(light)){
            body.classList.add(dark)
            body.classList.remove(light)
            setTheme(dark)
            localStorage.setItem(consent, dark)
        }else{
            body.classList.add(light)
            body.classList.remove(dark)
            setTheme(light)
            localStorage.setItem(consent, light)
        }
    }

    return <div className="btn-icon btn-icon-outline-default" onClick={handleSwitch}>
        <span className={`icon-${theme ? "moon" : "light"}`}></span>
        <span className="tooltip" style={{width: '108px'}}>Thème {theme ? "sombre" : "clair"}</span>
    </div>
}
