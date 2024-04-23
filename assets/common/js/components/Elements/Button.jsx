import React from "react";

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

function Content ({icon, iconPosition, children}) {
    return <>
        {(icon && iconPosition === "before") && <span className={`icon-${icon}`} />}
        {children && <span>{children}</span>}
        {(icon && iconPosition === "after") && <span className={`icon-${icon}`} />}
    </>
}
