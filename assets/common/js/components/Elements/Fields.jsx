import React, { useState } from "react";

/***************************************
 * INPUT Classique
 ***************************************/
export function Input (props)
{
    const { type="text", identifiant, valeur, onChange, children, placeholder="", autocomplete="on", password=false } = props;

    const [showValue, setShowValue] = useState(false);

    let nType = type, classes = "", nPlaceholder = placeholder, nAutocomplete = autocomplete;
    if(showValue){
        nType = "text";
    }else if (type === "js-date"){
        nType = "text";
        classes = "js-datepicker";
        nPlaceholder = "JJ/MM/AAAA";
        nAutocomplete = "off-date" + identifiant;
    }

    let content = <>
        <input type={nType} name={identifiant} id={identifiant} value={valeur}
               placeholder={nPlaceholder} onChange={onChange} autoComplete={nAutocomplete} className={classes} />
        {password && <div className="input-show" onClick={() => setShowValue(!showValue)}>
            <span className={showValue ? "icon-vision-not" : "icon-vision"}></span>
        </div>}
    </>

    return <Structure {...props} content={content} label={children} />
}

/***************************************
 * TEXTAREA Classique
 ***************************************/
export function TextArea (props) {
    const { identifiant, valeur, onChange, children, placeholder="", autocomplete="on", height="80px" } = props;
    let content = <>
            <textarea name={identifiant} id={identifiant} value={valeur} style={{height: height}}
                      placeholder={placeholder} onChange={onChange} autoComplete={autocomplete} />
    </>

    return (<Structure {...props} content={content} label={children} />)
}

/***************************************
 * STRUCTURE
 ***************************************/
export function Structure({ identifiant, content, errors, label, classForm="", noErrors=false }){
    let error;
    if(!noErrors && errors && errors.length !== 0){
        errors.map(err => {
            if(err.name === identifiant){
                error = err.message
            }
        })
    }
    return <div className={classForm + 'form-group' + (error ? " form-group-error" : "")}>
        <label htmlFor={identifiant}>{label}</label>
        {content}
        {!noErrors && <div className="error">
            {error ? <><span className='icon-error'/>{error}</> : null}
        </div>}
    </div>
}
