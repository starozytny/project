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
                lightTheme()
            }else if(st === dark){
                darkTheme()
            }
        }else{
            if(theme === light){
                lightTheme()
            }else if(theme === dark){
                darkTheme()
            }
        }
    }, []);


    let  handleSwitch = () => {
        if(body.classList.contains(light)){
            darkTheme()
            localStorage.setItem(consent, dark)
        }else{
            lightTheme()
            localStorage.setItem(consent, light)
        }
    }

    function lightTheme () {
        body.classList.add(light)
        body.classList.remove(dark)
        setTheme(light)
    }

    function darkTheme () {
        body.classList.add(dark)
        body.classList.remove(light)
        setTheme(dark)
    }

    return <div className="btn-icon btn-icon-outline-default" onClick={handleSwitch}>
        <span className={`icon-${theme ? "moon" : "light"}`}></span>
        <span className="tooltip" style={{width: '108px'}}>Thème {theme ? "sombre" : "clair"}</span>
    </div>
}


