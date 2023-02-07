import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Routing   from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon } from "@commonComponents/Elements/Button";

const URL_UPDATE_PAGE = "admin_societies_update"

export function SocietiesItem ({ elem, highlight, settings, onModal })
{
    const refItem = useRef(null);

    let nHighlight = highlight === elem.id;

    useEffect(() => {
        if(nHighlight && refItem.current){
            refItem.current.scrollIntoView({block: "center"})
        }
    })

    let urlUpdate = Routing.generate(URL_UPDATE_PAGE, {'id': elem.id});

    return <div className={"item" + (nHighlight ? " highlight": "")} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 col-with-image">
                    <div className="image">
                        <img src={elem.logoFile} alt="logo"/>
                    </div>
                    <div className="infos">
                        <div className="name">{elem.code} - {elem.name}</div>
                    </div>
                </div>
                <div className="col-2">
                    <div>{elem.manager}</div>
                </div>
                <div className="col-3">
                    {!settings.multipleDatabase || elem.isActivated
                        ? <div className="badge badge-1">Activée</div>
                        : (elem.isGenerated
                            ? <div className="badge badge-btn badge-1" onClick={() => onModal("activate", elem)}>Cliquez pour activer</div>
                            : <div className="badges-col">
                                <div className="badge badge-btn badge-0" onClick={() => onModal("generate", elem)}>Cliquez pour générer</div>
                                <div className="badge badge-disabled">Cliquez pour activer</div>
                            </div>
                        )
                    }
                </div>
                <div className="col-4 actions">
                    <ButtonIcon outline={true} icon="pencil" onClick={urlUpdate} element="a">Modifier</ButtonIcon>
                    <ButtonIcon outline={true} icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

SocietiesItem.propTypes = {
    elem: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    onModal: PropTypes.func.isRequired,
    highlight: PropTypes.number,
}
