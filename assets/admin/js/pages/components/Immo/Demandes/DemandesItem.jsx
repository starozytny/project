import React, { useState } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import axios from "axios";

import Formulaire from "@commonFunctions/formulaire";
import Sanitaze from "@commonFunctions/sanitaze";

import { ButtonIcon } from "@tailwindComponents/Elements/Button";
import { Badge } from "@tailwindComponents/Elements/Badge";

const URL_READ_PAGE = "app_ad";
const URL_UPDATE_SEEN = "intern_api_immo_demandes_switch_seen";

export function DemandesItem ({ elem, onModal })
{
    const [loadSwitch, setLoadSwitch] = useState(false);
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

    let handleReadPage = () => { location.href = Routing.generate(URL_READ_PAGE, {
        typeA: elem.typeAd,
        typeB: elem.typeBien.replaceAll('/', '-'),
        zipcode: elem.zipcode,
        city: elem.city,
        ref: elem.reference,
        slug: elem.slug,
    }) }

    return <div className="item border-t hover:bg-slate-50">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">
                        <span>{elem.name}</span>
                    </div>
                    <div className="text-gray-600 text-xs">{elem.email}</div>
                    <div className="text-gray-600 text-xs">{Sanitaze.toFormatPhone(elem.phone)}</div>
                </div>
                <div className="col-2">
                    <div className="text-gray-600 text-sm">{Sanitaze.toFormatCalendar(elem.createdAt)}</div>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: elem.message }} />
                </div>
                <div className="col-3 text-sm">
                    <div className="cursor-pointer font-medium text-ellipsis overflow-hidden hover:underline" onClick={handleReadPage}>{elem.libelle}</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                        <Badge type={elem.typeAd === "locations" ? "yellow" : "green"}>{elem.typeAd}</Badge>
                        <Badge type="gray">{elem.typeBien}</Badge>
                    </div>
                    <div className="mt-2">
                        <div>{elem.zipcode} {elem.city}</div>
                        <div>{Sanitaze.toFormatCurrency(elem.price)} {elem.typeAd === "locations" ? "cc / m" : ""}</div>
                        <div className="mt-1 text-gray-600 text-xs">{elem.reference}</div>
                    </div>
                </div>
                <div className="col-4">
                    {seen
                        ? <span className="icon-check1"></span>
                        : <ButtonIcon type="default" icon="vision" tooltipWidth={90} onClick={handleSwitch}>
                            Message lu ?
                        </ButtonIcon>
                    }
                </div>
                <div className="col-5 actions">
                    <ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

DemandesItem.propTypes = {
    elem: PropTypes.object.isRequired,
    onModal: PropTypes.func.isRequired,
}
