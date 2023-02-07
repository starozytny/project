import React from "react";
import PropTypes from "prop-types";

import { Input } from "@commonComponents/Elements/Fields";

export function Password ({ context, password, password2, params }) {
    return <div className="line">
        <div className="line-col-1">
            <div className="title">Mot de passe</div>
            <div className="subtitle">
                <p>Règles de création pour le mot de passe :</p>
                <ul>
                    <li>Au moins 12 caractères</li>
                    <li>Au moins 1 minuscule</li>
                    <li>Au moins 1 majuscule</li>
                    <li>Au moins 1 chiffre</li>
                    <li>Au moins 1 caractère spécial</li>
                </ul>
                {context
                    ? (context === "create"
                            ? <b>Laisser les champs vides pour générer un mot de passe aléatoire.</b>
                            : <u>"Laisser les champs vides pour ne pas modifier le mot de passe.</u>
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
}

Password.propTypes = {
    password: PropTypes.string.isRequired,
    password2: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    context: PropTypes.string,
}
