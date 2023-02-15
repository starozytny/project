import React from "react";
import PropTypes from "prop-types";

export function StyleguideList ({ onChangeContext })
{
    let generals = [
        {
            name: "Colors", textLink: "Voir les colors", context: "gene-colors",
            content: "Consulter la palette de couleurs du dashboard."
        },
        {
            name: "Icons", textLink: "Voir les icons", context: "gene-icons",
            content: "Consulter la liste des icônes disponibles."
        }
    ]

    let components = [
        {
            name: "Breadcrumb", textLink: "Voir le breadcrumb", context: "comp-breadcrumbs",
            content: "Consulter le fonctionnement et style du fil d'Ariane."
        },
        {
            name: "Buttons", textLink: "Voir les buttons", context: "comp-buttons",
            content: "Consulter les différentes formes de buttons."
        },
        {
            name: "Dropdown", textLink: "Voir les dropdowns", context: "comp-dropdowns",
            content: "Consulter les différentes formes de dropdowns."
        },
        {
            name: "Alerts", textLink: "Voir les alerts", context: "comp-alerts",
            content: "Consulter les différentes formes d'alertes."
        }
    ]

    let formulaires = [
        {
            name: "Text", textLink: "Voir les textes", context: "form-texts",
            content: "Consulter le fonctionnement des inputs text."
        },
    ]

    return <div className="styleguide-content-col">
        <Section name="Général"     data={generals}    onChangeContext={onChangeContext} />
        <Section name="Components"  data={components}  onChangeContext={onChangeContext} />
        <Section name="Formulaires" data={formulaires} onChangeContext={onChangeContext} />
    </div>
}

function Section ({ name, data, onChangeContext }) {
    return <section className="styleguide-section">
        <div className="styleguide-section-title">{name}</div>
        <div className="styleguide-section-content-row">
            {data.map((elem, index) => {
                return <div className="card card-0" key={index}>
                    <div className="card-header">
                        <div className="card-header-name">{elem.name}</div>
                    </div>
                    <div className="card-body">{elem.content}</div>
                    <div className="card-footer actions">
                        <div className="txt-link txt-primary semibold" onClick={() => onChangeContext(elem.context)}>
                            <span>{elem.textLink}</span>
                            <span className="icon-right-arrow"></span>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </section>
}

StyleguideList.propTypes = {
    onChangeContext: PropTypes.func.isRequired
}
