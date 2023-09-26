import React, { useState } from "react";
import PropTypes from 'prop-types';
import Routing   from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import axios from "axios";

import Formulaire from "@commonFunctions/formulaire";
import Sanitaze   from "@commonFunctions/sanitaze";

import { ButtonIcon } from "@commonComponents/Elements/Button";

const URL_UPDATE_SEEN = "intern_api_contacts_switch_seen";

export function ContactsItem ({ elem, onDelete })
{
    const [loadSwitch, setLoadSwitch]   = useState(false);
    const [seen, setSeen] = useState(elem.seen);

    let handleSwitch = (e) => {
        let self = this;

        if(!loadSwitch){
            setLoadSwitch(true);
            setSeen(!seen);
            axios({ method: "PUT", url: Routing.generate(URL_UPDATE_SEEN, {'id': elem.id}), data: {} })
                .then(function (response){
                    setLoadSwitch(false);
                    setSeen(response.data.seen);
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
            ;
        }
    }

    return <div className="item">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="infos">
                        <div className="name">
                            <span>{elem.name}</span>
                        </div>
                        <div className="sub">{Sanitaze.toFormatCalendar(elem.createdAt)}</div>
                    </div>
                </div>
                <div className="col-2">
                    <div dangerouslySetInnerHTML={{ __html: elem.message }} />
                </div>
                <div className="col-3">
                    <ButtonIcon outline={true} icon={"vision" + (seen ? "" : "-not")} tooltipWidth={50} onClick={handleSwitch}>
                        {seen ? "Lu" : "Non lu"}
                    </ButtonIcon>
                </div>
                <div className="col-4 actions">
                    <ButtonIcon outline={true} icon="trash" onClick={() => onDelete("delete", elem)}>Supprimer</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

ContactsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
}
