import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import Routing   from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import axios from "axios";

import Formulaire from "@commonFunctions/formulaire";
import Sanitaze from "@commonFunctions/sanitaze";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon } from "@commonComponents/Elements/Button";
import { Checkbox }   from "@commonComponents/Elements/Fields";

const URL_UPDATE_PAGE    = "admin_changelogs_update";
const URL_UPDATE_PUBLISH = "intern_api_changelogs_switch_publish";

export function ChangelogsItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    const [loadSwitch, setLoadSwitch]   = useState(false);
    const [isPublished, setIsPublished] = useState([elem.isPublished ? 1 : 0]);

    let handleSwitch = (e) => {
        let self = this;
        let checked = e.currentTarget.checked;
        let value   = e.currentTarget.value;

        if(!loadSwitch){
            setLoadSwitch(true);
            setIsPublished(checked ? [parseInt(value)] : []);
            axios({ method: "PUT", url: Routing.generate(URL_UPDATE_PUBLISH, {'id': elem.id}), data: {} })
                .then(function (response){
                    setLoadSwitch(false);
                    setIsPublished([response.data.isPublished ? 1 : 0]);
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
            ;
        }
    }

    let urlUpdate = Routing.generate(URL_UPDATE_PAGE, {'id': elem.id});
    let publishedItems = [{ value: 1, label: "Oui", identifiant: "oui-" + elem.id }]

    let icons = ["icon-question", "icon-warning", "icon-error"];
    let texts = ["txt-primary", "txt-warning", "txt-danger"];

    return <div className={`item${setHighlightClass(nHighlight)}`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="infos">
                        <div className="name">
                            <span className={icons[elem.type] + " " + texts[elem.type]}></span>
                            <span>{elem.name}</span>
                        </div>
                        <div className="sub">
                            {elem.updatedAt
                                ? "Modifié : " + Sanitaze.toDateFormat(elem.updatedAt)
                                : Sanitaze.toDateFormat(elem.createdAt)
                            }
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div dangerouslySetInnerHTML={{ __html: elem.content }} />
                </div>
                <div className="col-3">
                    <Checkbox items={publishedItems} identifiant="isPublished" valeur={isPublished}
                              errors={[]} onChange={handleSwitch} isSwitcher={true} />
                </div>
                <div className="col-4 actions">
                    <ButtonIcon outline={true} icon="pencil" onClick={urlUpdate} element="a">Modifier</ButtonIcon>
                    <ButtonIcon outline={true} icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

ChangelogsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    onModal: PropTypes.func.isRequired,
}
