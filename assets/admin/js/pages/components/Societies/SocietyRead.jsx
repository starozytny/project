import React from 'react';
import PropTypes from "prop-types";

export function SocietyRead ({ elem, settings }) {
    return <div className="page-profil-0">
        <div className="page-profil-header">
            <div className="profil-header-avatar">
                <img src={elem.logoFile} alt="logo"/>
            </div>
            <div className="profil-header-infos">
                <div className="name">{elem.name}</div>
                <div className="sub">CODE: {elem.code}</div>
            </div>
        </div>

        <div className="page-profil-body">
            <div className="col-1">
                <div className="profil-card">
                    <div className="title">Détails</div>
                    <div className="content-infos content-infos-details">
                        <div className="item">
                            <span className="icon-shield" />
                            <div>
                                {!settings.multipleDatabase || elem.isActivated
                                    ? <div className="badge badge-soc-1">Activée</div>
                                    : <div className="badge badge-soc-0">Inactive</div>
                                }
                            </div>
                        </div>
                        <div className="item">
                            <span className="icon-settings" />
                            <div>{elem.manager}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

SocietyRead.propTypes = {
    elem: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
}
