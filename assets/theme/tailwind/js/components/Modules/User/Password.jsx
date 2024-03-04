import React from "react";

import { Input } from "@tailwindComponents/Elements/Fields";

export function Password ({ password, password2, params }) {
    return <div className="grid gap-4 sm:grid-cols-3">
        <div>
            <p className="text-gray-600 text-sm mb-1">Règles de création pour le mot de passe :</p>
            <Rules password={password} password2={password2} />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
            <div>
                <Input identifiant="password" valeur={password}  {...params} type="password" autocomplete="new-password">
                    Mot de passe
                </Input>
            </div>
            <div>
                <Input identifiant="password2" valeur={password2} {...params} type="password" autocomplete="new-password">
                    Confirmer le mot de passe
                </Input>
            </div>
        </div>
    </div>
}

function Rules ({ password, password2 }) {
    let valide0 = "", valide1 = "", valide2 = "", valide3 = "", valide4 = "";
    if (password !== "") {
        if ((/[a-z]+/).test(password)) valide0 = "text-blue-700";
        if ((/[A-Z]+/).test(password)) valide1 = "text-blue-700";
        if ((/[0-9]+/).test(password)) valide2 = "text-blue-700";
        if (password.length >= 10) valide3 = "text-blue-700";
        if (password === password2) valide4 = "text-blue-700";
    }

    return <ul className="text-gray-600 text-sm">
        <li className={valide3}>Au moins 10 caractères</li>
        <li className={valide0}>Au moins 1 minuscule</li>
        <li className={valide1}>Au moins 1 majuscule</li>
        <li className={valide2}>Au moins 1 chiffre</li>
        <li className={valide4}>Mots de passe identiques</li>
    </ul>
}
