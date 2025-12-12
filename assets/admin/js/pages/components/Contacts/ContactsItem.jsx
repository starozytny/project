import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import axios from "axios";

import Formulaire from "@commonFunctions/formulaire";
import Sanitaze from "@commonFunctions/sanitaze";

import { ButtonIcon } from "@tailwindComponents/Elements/Button";
import { setHighlightClass, useHighlight } from "@commonHooks/item";

const URL_UPDATE_SEEN = "intern_api_contacts_switch_seen";

export function ContactsItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    const [loadSwitch, setLoadSwitch] = useState(false);
    const [seen, setSeen] = useState(elem.seen);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let handleSwitch = (e) => {
        let self = this;

        if(!loadSwitch){
            setLoadSwitch(true);
            setSeen(!seen);
            axios({ method: "PUT", url: Routing.generate(URL_UPDATE_SEEN, {id: elem.id}), data: {} })
                .then(function (response){
                    setLoadSwitch(false);
                    setSeen(response.data.seen);
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
            ;
        }
    }

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">
                        <span>{elem.name}</span>
                    </div>
                    <div className="text-gray-600 text-xs">{elem.email}</div>
                    <div className="text-gray-600 text-xs">{elem.phone}</div>
                </div>
                <div className="col-2">
                    <div className="text-gray-600 text-sm">{Sanitaze.toFormatCalendar(elem.createdAt)}</div>
                    <div dangerouslySetInnerHTML={{ __html: elem.message }} />
                </div>
                <div className="col-3">
                    {seen
                        ? <span className="icon-check1"></span>
                        : <ButtonIcon type="default" icon="vision" tooltipWidth={90} onClick={handleSwitch}>
                            Message lu ?
                        </ButtonIcon>
                    }
                </div>
                <div className="col-4 actions">
                    <ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

ContactsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    onModal: PropTypes.func.isRequired,
}
