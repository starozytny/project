import React from "react";
import PropTypes from 'prop-types';

export function Button(props){
    const { icon, type="default", isSubmit=false, outline=false, children, onClick, element="button", target="_self",
        isLoader=false, loaderWithText=false, iconPosition="before" } = props;

    let loaderClasse = isLoader ? " btn-loader-" + (loaderWithText ? "with-text" : "without-text") : "";
    let iconCustom = isLoader ? 'chart-3' : icon;

    if(element === "button"){
        return <button className={`btn${loaderClasse} btn-${outline ? "outline-" : ""}${type}`}
                       type={isSubmit ? "submit" : "button"} onClick={onClick}>
            <Content icon={iconCustom} iconPosition={iconPosition} children={children} />
        </button>
    }else{
        return <a className={`btn${loaderClasse} btn-${outline ? "outline-" : ""}${type}`}
                  target={target} href={onClick}>
            <Content icon={iconCustom} iconPosition={iconPosition} children={children} />
        </a>
    }
}

export function TxtButton(props){
    const { icon, type="default", isSubmit=false, children, onClick, element="button", target="_self",
        isLoader=false, loaderWithText=false, iconPosition="before" } = props;

    let loaderClasse = isLoader ? " btn-loader-" + (loaderWithText ? "with-text" : "without-text") : "";
    let iconCustom = isLoader ? 'chart-3' : icon;

    if(element === "button"){
        return <button className={`txt-button${loaderClasse} txt-button-${type}`}
                       type={isSubmit ? "submit" : "button"} onClick={onClick}>
            <Content icon={iconCustom} iconPosition={iconPosition} children={children} />
        </button>
    }else{
        return <a className={`txt-button${loaderClasse} txt-button-${type}`}
                  target={target} href={onClick}>
            <Content icon={iconCustom} iconPosition={iconPosition} children={children} />
        </a>
    }
}

export function ButtonIcon(props){
    const { icon, children, text, onClick, outline=false,
        type="default", isSubmit=false, element="button", target="_self", download=false, tooltipWidth=null, isLoader=false } = props;

    let divStyle = tooltipWidth ? { width: tooltipWidth + "px" } : null;
    let loaderClasse = isLoader ? " btn-loader-without-text" : "";
    let iconCustom = isLoader ? 'chart-3' : icon;

    if(element === "button"){
        return <button className={`btn-icon${loaderClasse} btn-icon-${outline ? "outline-" : ""}${type}`} type={isSubmit ? "submit" : "button"} onClick={onClick}>
            <span className={`icon-${iconCustom}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </button>
    }else{
        return <a className={`btn-icon${loaderClasse} btn-icon-${outline ? "outline-" : ""}${type}`} target={target} download={download} href={onClick}>
            <span className={`icon-${iconCustom}`} />
            {text && <span>{text}</span>}
            {children && <span className="tooltip" style={divStyle}>{children}</span>}
        </a>
    }
}

export function ButtonIconDropdown(props){
    const { items, children, customBtn=null, customTop=null, customWidth=null } = props;

    let divStyle0 = customTop ? { top: customTop + "px" } : {};
    let divStyle1 = customWidth ? { width: customWidth + "px" } : {};

    let divStyle = {...divStyle0, ...divStyle1}

    return <div className="dropdown">
        <div className="dropdown-btn">
            {customBtn
                ? customBtn
                : <ButtonIcon {...props}>{children}</ButtonIcon>
            }
        </div>
        <div className="dropdown-items" style={divStyle}>
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

function Content ({icon, iconPosition, children}) {
    return <>
        {(icon && iconPosition === "before") && <span className={`icon-${icon}`} />}
        {children && <span>{children}</span>}
        {(icon && iconPosition === "after") && <span className={`icon-${icon}`} />}
    </>
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
    loaderWithText: PropTypes.bool,
    iconPosition: PropTypes.string
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
    loaderWithText: PropTypes.bool,
    iconPosition: PropTypes.string
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
    items: PropTypes.array.isRequired,
    icon: PropTypes.string,
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
    customBtn: PropTypes.node,
}
