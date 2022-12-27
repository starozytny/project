import React from "react";

export function LoaderElements({ text = "Chargement des données" }) {
    return <div className="loader-content">
        <div className="loader-simple">
            <p>{text} <span>.</span><span>.</span><span>.</span></p>
        </div>
    </div>
}
