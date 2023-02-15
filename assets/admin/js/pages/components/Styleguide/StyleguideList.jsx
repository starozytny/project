import React from "react";
import PropTypes from "prop-types";

export function StyleguideList ({ onChangeContext })
{
    let data = [
        {
            name: "Alerts", textLink: "Voir les alerts", context: "comp-alerts",
            content: "Consulter les différentes formes d'alerts."
        }
    ]

    return <div className="styleguide-content-col">
        <section className="styleguide-section">
            <div className="styleguide-section-title">Components</div>
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
    </div>
}

StyleguideList.propTypes = {
    onChangeContext: PropTypes.func.isRequired
}
