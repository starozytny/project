import React from "react";
import PropTypes from "prop-types";

import { Input } from "@commonComponents/Elements/Fields";

export function Password ({ template, context, password, password2, params }) {
    return template === "inline"
        ? <div className="line">
            <div className="line-col-1">
                <div className="title">Mot de passe</div>
                <div className="subtitle">
                    <p>Règles de création pour le mot de passe :</p>
                    <Rules password={password} password2={password2} />
                    {context
                        ? (context === "create"
                                ? <b>Laisser les champs vides pour générer un mot de passe aléatoire.</b>
                                : <u>Laisser les champs vides pour ne pas modifier le mot de passe.</u>
                        )
                        : null
                    }
                </div>
            </div>
            <div className="line-col-2">
                <div className="line line-2">
                    <Input identifiant="password"  valeur={password}  {...params}
                           password={true} type="password" autocomplete="new-password">
                        Mot de passe
                    </Input>
                    <Input identifiant="password2" valeur={password2} {...params}
                           password={true} type="password" autocomplete="new-password">
                        Confirmer le mot de passe
                    </Input>
                </div>
            </div>
        </div>
    : <>
        <div className="line">
            <div className="form-group">
                <div className="password-rules">
                    <p>Règles de création pour le mot de passe :</p>
                    <Rules password={password} password2={password2} />
                </div>
            </div>
        </div>
        <div className="line">
            <Input identifiant="password"  valeur={password}  {...params}
                   password={true} type="password" autocomplete="new-password">
                Mot de passe
            </Input>
        </div>
        <div className="line">
            <Input identifiant="password2" valeur={password2} {...params}
                   password={true} type="password" autocomplete="new-password">
                Confirmer le mot de passe
            </Input>
        </div>
    </>
}

Password.propTypes = {
    template: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    password2: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    context: PropTypes.string,
}

function Rules ({ password, password2 }) {
    let valide0 = "", valide1 = "", valide2 = "", valide3 = "", valide4 = "";
    if(password !== ""){
        if((/[a-z]+/).test(password)) valide0 = "valid";
        if((/[A-Z]+/).test(password)) valide1 = "valid";
        if((/[0-9]+/).test(password)) valide2 = "valid";
        if(password.length >= 10) valide3 = "valid";
        if(password === password2) valide4 = "valid";
    }

    return <ul className="password-rules">
        <li className={valide3}>Au moins 10 caractères</li>
        <li className={valide0}>Au moins 1 minuscule</li>
        <li className={valide1}>Au moins 1 majuscule</li>
        <li className={valide2}>Au moins 1 chiffre</li>
        <li className={valide4}>Mots de passe identiques</li>
    </ul>
}
