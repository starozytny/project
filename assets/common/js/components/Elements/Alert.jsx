import React, { useState, useEffect, useRef } from "react";

export function Alert(props){
    const { type, title, withIcon = true, icon=null, canClose=false, children } = props;

    const refAlert = useRef(null);
    const [close, setClose] = useState(false);

    useEffect((e) => {
        let div = refAlert.current;
        if(close && div) {
            let height = div.offsetHeight;

            div.style.opacity = 0;
            div.style.marginTop = `-${height}px`;

            setTimeout(() => { div.style.display = 'none'; }, 220)
        }
    })

    let iconRender, alert;
    switch (type){
        case "success":
            alert = "success";
            iconRender = icon ? icon : "check1";
            break;
        case "danger":
            alert = "danger";
            iconRender = icon ? icon : "exclamation";
            break;
        case "warning":
            alert = "warning";
            iconRender = icon ? icon : "warning";
            break;
        case "primary":
        case "info":
            alert = "primary";
            iconRender = icon ? icon : "question";
            break;
        default:
            alert = "grey4";
            iconRender = icon ? icon : "question";
            break;
    }

    return <div ref={refAlert} className={`alert alert-${alert}`}>
        <div className="alert-container">
            {withIcon && <span className={`icon-${iconRender}`} />}
            {children && <p>
                {title && <span className="title">{title}</span>}
                {children}
            </p>}
        </div>
        {canClose && <div className="alert-close" onClick={() => setClose(!close)}><span className="icon-close" /></div>}
    </div>
}
