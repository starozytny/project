import React from "react";
import PropTypes from 'prop-types';

export function Alert(props){
    const { type, title, withIcon = true, icon=null, content=null, children } = props;

    let iconRender, alert;
    switch (type){
        case "danger":
            alert = "danger";
            iconRender = icon ? icon : "warning";
            break;
        case "warning":
            alert = "warning";
            iconRender = icon ? icon : "warning";
            break;
        case "info":
            alert = "primary";
            iconRender = icon ? icon : "exclamation";
            break;
        default:
            alert = "default";
            iconRender = icon ? icon : "question";
            break;
    }

    return <div className={`alert alert-${alert}`}>
        {withIcon && <span className={`icon-${iconRender}`} />}
        {content}
        {children && <p>
            {title && <span className="title">{title}</span>}
            {children}
        </p>}
    </div>
}

Alert.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    withIcon: PropTypes.bool,
    iconCustom: PropTypes.bool,
    content: PropTypes.element,
    children: PropTypes.element,
}
