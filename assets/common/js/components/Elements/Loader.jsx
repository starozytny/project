import React from "react";

export function LoaderElements({ text = "Chargement des données" }) {
    return <div className="loader-content">
        <div className="loader-simple">
            <p>{text} <span>.</span><span>.</span><span>.</span></p>
        </div>
    </div>
}

export function LoaderTxt({ text = "Chargement des données" }) {
    return <div className="loader-txt">
        <div className="loader-simple">
            <div className="alert alert-grey">{text} <span>.</span><span>.</span><span>.</span></div>
        </div>
    </div>
}
export function LoadIcon() {
    return <div className="loader-icon">
        <span className="icon-chart-3"></span>
    </div>
}
