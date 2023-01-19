import React from "react";
import PropTypes from 'prop-types';
import Routing   from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon } from "@commonComponents/Elements/Button";

const URL_UPDATE_PAGE = "admin_changelogs_update"

export function ChangelogsItem ({ elem, onDelete })
{
    let urlUpdate = Routing.generate(URL_UPDATE_PAGE, {'id': elem.id});

    return <div className="item">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="infos">
                        <div className="name">{elem.name}</div>
                    </div>
                </div>
                <div className="col-2">
                    <div dangerouslySetInnerHTML={{ __html: elem.content }} />
                </div>
                <div className="col-3">
                    <div className={"badge badge-" + (elem.isPublished ? 1 : 0)}>{elem.isPublished ? "Publié" : "A publier"}</div>
                </div>
                <div className="col-4 actions">
                    <ButtonIcon outline={true} icon="pencil" onClick={urlUpdate} element="a">Modifier</ButtonIcon>
                    <ButtonIcon outline={true} icon="trash" onClick={() => onDelete("delete", elem)}>Supprimer</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

ChangelogsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
}
