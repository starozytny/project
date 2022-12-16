import React from "react";
import PropTypes from 'prop-types';

export function ButtonIcon(props){
    const { icon, children, text, onClick, outline=false,
        type="default", isSubmit=false, element="button", target="_self", tooltipWidth=null } = props;

    let divStyle = tooltipWidth ? { width: tooltipWidth + "px" } : null;

    if(element === "button"){
        return <button className={`btn-icon btn-icon-${outline ? "outline-" : ""}${type}`} type={isSubmit ? "submit" : "button"} onClick={onClick}>
            <span className={`icon-${icon}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </button>
    }else{
        return <a className={`btn-icon btn-icon-${outline ? "outline-" : ""}${type}`} target={target} href={onClick}>
            <span className={`icon-${icon}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </a>
    }
}

ButtonIcon.propTypes = {
    icon: PropTypes.string.isRequired,
    type: PropTypes.string,
    isSubmit: PropTypes.bool,
    children: PropTypes.node,
    text: PropTypes.node,
    onClick: PropTypes.func,
    element: PropTypes.string,
    target: PropTypes.string,
    tooltipWidth: PropTypes.number,
}
