import React, { useRef } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import 'moment/locale/fr';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIcon, ButtonIconA, ButtonIconDropdown, DropdownItem, DropdownItemA } from "@tailwindComponents/Elements/Button";

const URL_UPDATE_PAGE   = "admin_users_update";
const URL_READ_PAGE     = "admin_users_read";
const URL_PASSWORD_PAGE = "admin_users_password";

export function UsersItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let blocked = !elem.isAdmin && (elem.isBlocked || elem.society.isBlocked);

    let urlUpdate = Routing.generate(URL_UPDATE_PAGE,   {'id': elem.id});
    let urlRead   = Routing.generate(URL_READ_PAGE,     {'id': elem.id});
    let urlPass   = Routing.generate(URL_PASSWORD_PAGE, {'id': elem.id});

    let lastLoginAt = elem.lastLoginAt ? moment(elem.lastLoginAt) : null;

    let menu = [
        { data: <DropdownItem icon="refresh" onClick={() => onModal("reinit", elem)}>
                Générer un nouveau mot de passe
        </DropdownItem> },
        { data: <DropdownItemA icon="lock-1" onClick={urlPass}>
                Modifier son mot de passe
        </DropdownItemA> },
        { data: <DropdownItem icon="email-edit" onClick={() => onModal("mail", elem)}>
                Envoyer un mail
        </DropdownItem> },
        { data: <DropdownItem icon={elem.isBlocked ? "unlock" : "disabled"} onClick={() => onModal("blocked", elem)}>
                {elem.isBlocked ? "Débloquer" : "Bloquer"}
        </DropdownItem> },
    ]

    console.log(elem);

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 flex flex-row gap-4">
                    <a href={urlRead} className="w-16 h-16 rounded-md overflow-hidden">
                        {blocked
                            ? <div className="w-full h-full bg-gray-600 flex items-center justify-center text-slate-50">
                                <span className="icon-disabled !text-xl !font-semibold"></span>
                            </div>
                            : elem.avatarFile
                                ? <img src={elem.avatarFile} alt="avatar" className="w-full h-full object-cover" />
                                : <div className="h-full w-full rounded-md bg-gray-300 flex items-center justify-center font-semibold">
                                    {elem.lastname.slice(0, 2)}
                                </div>
                        }
                    </a>
                    <div className="leading-4">
                        <div className={blocked ? "blocked" : ""}>
                            <div className={"font-medium mb-1" + (blocked ? " blocked" : "")}>
                                <span>{elem.lastname} {elem.firstname}</span>
                                {blocked ? <span className="icon-disabled" title="Bloqué" /> : null}
                            </div>
                            <div className="text-gray-600">{elem.society.code} - {elem.society.name}</div>
                            {!elem.isAdmin
                                ? <div className="text-gray-600 text-sm mt-1">{lastLoginAt ? "connecté " + lastLoginAt.fromNow() : ""}</div>
                                : null
                            }
                        </div>
                        {elem.society.isBlocked ? <span className="text-xs text-red-500 font-medium">(Société bloquée)</span> : ""}
                    </div>
                </div>
                <div className={`col-2 leading-5 ${blocked ? "blocked" : ""}`}>
                    <div>{elem.username}</div>
                    <div className="text-gray-600 text-sm">{elem.email}</div>
                </div>
                <div className={`col-3 ${blocked ? "blocked" : ""}`}>
                    <Badge type={blocked ? "red" : getBadgeType(elem.highRoleCode)}>
                        {elem.highRole} {blocked ? <span className="icon-disabled pl-1" title="Bloqué" /> : ""}
                    </Badge>
                </div>
                <div className="col-4 actions">
                    <ButtonIconA type="default" icon="pencil" onClick={urlUpdate}>Modifier</ButtonIconA>
                    <ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
                    <ButtonIconDropdown icon="more" items={menu} />
                </div>
            </div>
        </div>
    </div>
}

UsersItem.propTypes = {
    elem: PropTypes.object.isRequired,
    onModal: PropTypes.func.isRequired,
    highlight: PropTypes.number,
}

function getBadgeType (type) {
    const badges = ["gray", "indigo", "blue", "yellow"];
    return badges[type];
}
