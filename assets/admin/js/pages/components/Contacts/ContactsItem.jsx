import React from "react";
import PropTypes from 'prop-types';

import Sanitaze   from "@commonFunctions/sanitaze";

import { ButtonIcon } from "@commonComponents/Elements/Button";

export function ContactsItem ({ elem, onDelete })
{
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
                    <span className={"icon-vision" + (elem.seen ? "" : "-not")}></span>
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
