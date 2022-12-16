import React from "react";

export function Alert(props){
    const { type, title, withIcon = true, iconCustom=null, content=null, children } = props;

    let icon, alert;
    switch (type){
        case "danger":
            alert = "danger";
            icon = iconCustom ? iconCustom : "warning";
            break;
        case "warning":
            alert = "warning";
            icon = iconCustom ? iconCustom : "warning";
            break;
        case "info":
            alert = "primary";
            icon = iconCustom ? iconCustom : "exclamation";
            break;
        default:
            alert = "default";
            icon = iconCustom ? iconCustom : "question";
            break;
    }

    return <div className={`alert alert-${alert}`}>
        {withIcon && <span className={`icon-${icon}`} />}
        {content}
        {children && <p>
            {title && <span className="title">{title}</span>}
            {children}
        </p>}
    </div>
}
