import React from "react";
import PropTypes from 'prop-types';

export function Button(props){
    const { icon, type="default", isSubmit=false, outline=false, children, onClick, element="button", target="_self",
        isLoader=false, loaderWithText=false } = props;

    let loaderClasse = isLoader ? " btn-loader-" + (loaderWithText ? "with-text" : "without-text") : ""

    if(element === "button"){
        return <button className={`btn${loaderClasse} btn-${outline ? "outline-" : ""}${type}`}
                       type={isSubmit ? "submit" : "button"} onClick={onClick}>
            {icon && <span className={`icon-${icon}`} />}
            {children && <span>{children}</span>}
        </button>
    }else{
        return <a className={`btn${loaderClasse} btn-${outline ? "outline-" : ""}${type}`}
                  target={target} href={onClick}>
            {icon && <span className={`icon-${icon}`} />}
            {children && <span>{children}</span>}
        </a>
    }
}

export function TxtButton(props){
    const { icon, type="default", isSubmit=false, children, onClick, element="button", target="_self",
        isLoader=false, loaderWithText=false } = props;

    let loaderClasse = isLoader ? " btn-loader-" + (loaderWithText ? "with-text" : "without-text") : ""

    if(element === "button"){
        return <button className={`txt-button${loaderClasse} txt-button-${type}`}
                       type={isSubmit ? "submit" : "button"} onClick={onClick}>
            {icon && <span className={`icon-${icon}`} />}
            {children && <span>{children}</span>}
        </button>
    }else{
        return <a className={`txt-button${loaderClasse} txt-button-${type}`}
                  target={target} href={onClick}>
            {icon && <span className={`icon-${icon}`} />}
            {children && <span>{children}</span>}
        </a>
    }
}

export function ButtonIcon(props){
    const { icon, children, text, onClick, outline=false,
        type="default", isSubmit=false, element="button", target="_self", download=false, tooltipWidth=null, isLoader=false } = props;

    let divStyle = tooltipWidth ? { width: tooltipWidth + "px" } : null;
    let loaderClasse = isLoader ? " btn-loader-without-text" : ""

    if(element === "button"){
        return <button className={`btn-icon${loaderClasse} btn-icon-${outline ? "outline-" : ""}${type}`} type={isSubmit ? "submit" : "button"} onClick={onClick}>
            <span className={`icon-${icon}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </button>
    }else{
        return <a className={`btn-icon${loaderClasse} btn-icon-${outline ? "outline-" : ""}${type}`} target={target} download={download} href={onClick}>
            <span className={`icon-${icon}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </a>
    }
}

export function ButtonIconDropdown(props){
    const { items, children } = props;

    return <div className="dropdown">
        <div className="dropdown-btn">
            <ButtonIcon {...props}>{children}</ButtonIcon>
        </div>
        <div className="dropdown-items">
            {items.map((item, index) => {
                if(item && item.data){
                    return <div className="item" key={index}>
                        {item.data}
                    </div>
                }
            })}
        </div>
    </div>
}


Button.propTypes = {
    icon: PropTypes.string,
    type: PropTypes.string,
    isSubmit: PropTypes.bool,
    outline: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
    element: PropTypes.string,
    target: PropTypes.string,
    isLoader: PropTypes.bool,
    loaderWithText: PropTypes.bool
}

TxtButton.propTypes = {
    icon: PropTypes.string,
    type: PropTypes.string,
    isSubmit: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
    element: PropTypes.string,
    target: PropTypes.string,
    isLoader: PropTypes.bool,
    loaderWithText: PropTypes.bool
}

ButtonIcon.propTypes = {
    icon: PropTypes.string.isRequired,
    type: PropTypes.string,
    isSubmit: PropTypes.bool,
    outline: PropTypes.bool,
    children: PropTypes.node,
    text: PropTypes.node,
    onClick:  PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
    element: PropTypes.string,
    target: PropTypes.string,
    tooltipWidth: PropTypes.number,
    isLoader: PropTypes.bool,
}


ButtonIconDropdown.propTypes = {
    icon: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    type: PropTypes.string,
    isSubmit: PropTypes.bool,
    outline: PropTypes.bool,
    children: PropTypes.node,
    text: PropTypes.node,
    onClick:  PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
    ]),
    element: PropTypes.string,
    target: PropTypes.string,
    tooltipWidth: PropTypes.number,
}
