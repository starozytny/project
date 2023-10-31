import React, { useState, useEffect } from 'react';

export function Theme ({ consent })
{
    const [theme, setTheme] = useState(null);

    const light = "light-mode";

    let body = document.querySelector('body');

    useEffect(() => {
        let st = localStorage.getItem(consent);
        if(st && st === light){
            body.classList.add(light)
            setTheme(light)
        }
    }, []);


    let  handleSwitch = () => {
        if(body.classList.contains(light)){
            body.classList.remove(light)
            setTheme(null)
            localStorage.removeItem(consent)
        }else{
            body.classList.add(light)
            setTheme(light)
            localStorage.setItem(consent, light)
        }
    }

    return <div className="btn-icon btn-icon-outline-default" onClick={handleSwitch}>
        <span className={`icon-${theme ? "moon" : "light"}`}></span>
        <span className="tooltip" style={{width: '108px'}}>Thème {theme ? "sombre" : "clair"}</span>
    </div>
}
