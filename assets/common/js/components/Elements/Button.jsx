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

export function ButtonIcon ({ type, icon, onClick, children })
{
    const colorVariants = {
        red: 'bg-red-600 text-slate-50 hover:bg-red-500',
        blue: 'bg-blue-600 text-slate-50 hover:bg-blue-500 ring-1 ring-inset ring-gray-600',
        menu: 'bg-gray-800 text-gray-900 hover:bg-gray-700 ring-1 ring-inset ring-gray-700',
        default: 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300',
    }

    const iconColorVariants = {
        red: 'text-gray-600',
        blue: 'text-gray-600',
        menu: 'text-gray-300',
        default: 'text-gray-600',
    }

    return <button onClick={onClick}
                   className={`relative inline-flex justify-center rounded-md text-lg px-2 py-2 shadow-sm ${colorVariants[type]}`}>
        <span className={`icon-${icon} ${iconColorVariants[type]}`}></span>
        <span className="tooltip bg-gray-300 py-1 px-2 rounded absolute -top-7 right-0 text-xs hidden">{children}</span>
    </button>
}

export function ButtonIconA ({ type, icon, onClick, children })
{
    const colorVariants = {
        red: 'bg-red-600 text-slate-50 hover:bg-red-500',
        blue: 'bg-blue-600 text-slate-50 hover:bg-blue-500 ring-1 ring-inset ring-gray-600',
        menu: 'bg-gray-800 text-gray-900 hover:bg-gray-700 ring-1 ring-inset ring-gray-700',
        default: 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300',
    }

    const iconColorVariants = {
        red: 'text-gray-600',
        blue: 'text-gray-600',
        menu: 'text-gray-300',
        default: 'text-gray-600',
    }

    return <a href={onClick}
              className={`relative inline-flex justify-center rounded-md text-lg px-2 py-2 shadow-sm ${colorVariants[type]}`}>
        <span className={`icon-${icon} ${iconColorVariants[type]}`}></span>
        <span className="tooltip bg-gray-300 py-1 px-2 rounded absolute -top-7 right-0 text-xs hidden">{children}</span>
    </a>
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
