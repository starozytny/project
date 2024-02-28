import React, { useRef } from "react";
import PropTypes from 'prop-types';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import 'moment/locale/fr';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon, ButtonIconA, ButtonIconDropdown } from "@commonComponents/Elements/Button";
import { Badge } from "@commonComponents/Elements/Badge";

const URL_UPDATE_PAGE   = "admin_users_update";
const URL_READ_PAGE     = "admin_users_read";
const URL_PASSWORD_PAGE = "admin_users_password";

export function UsersItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let urlUpdate = Routing.generate(URL_UPDATE_PAGE,   {'id': elem.id});
    let urlRead   = Routing.generate(URL_READ_PAGE,     {'id': elem.id});
    let urlPass   = Routing.generate(URL_PASSWORD_PAGE, {'id': elem.id});

    let lastLoginAt = elem.lastLoginAt ? moment(elem.lastLoginAt) : null;

    let menu = [
        { data: <a onClick={() => onModal("reinit", elem)}>
                <span className="icon-refresh" /> <span>Générer un nouveau mot de passe</span>
        </a> },
        { data: <a href={urlPass}>
                <span className="icon-lock-1" /> <span>Modifier son mot de passe</span>
        </a> },
        { data: <a onClick={() => onModal("mail", elem)}>
                <span className="icon-email-edit" /> <span>Envoyer un mail</span>
        </a> },
        { data: <a onClick={() => onModal("blocked", elem)}>
                <span className={"icon-" + (elem.blocked ? "unlock" : "disabled")} /> <span>{elem.blocked ? "Débloquer" : "Bloquer"}</span>
        </a> }
    ]

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 flex flex-row gap-4">
                    <a href={urlRead} className="w-16 h-16 rounded-md overflow-hidden">
                        {elem.avatarFile
                            ? <img src={elem.avatarFile} alt="avatar" className="w-full h-full object-cover" />
                            : <div className="avatar-letter">{elem.lastname.slice(0, 1) + elem.firstname.slice(0, 1)}</div>
                        }
                    </a>
                    <div className="infos">
                        <div className={"font-semibold" + (elem.blocked ? " blocked" : "")}>
                            <span>{elem.lastname} {elem.firstname}</span>
                            {elem.blocked ? <span className="icon-disabled" title="Bloqué" /> : null}
                        </div>
                        <div className="text-gray-600">{elem.society.code} - {elem.society.name}</div>
                        <div className="text-gray-600">{lastLoginAt ? "connecté " + lastLoginAt.fromNow() : ""}</div>
                    </div>
                </div>
                <div className="col-2">
                    <div>{elem.username}</div>
                    <div className="text-gray-600">{elem.email}</div>
                </div>
                <div className="col-3">
                    <Badge type="blue">{elem.highRole}</Badge>
                    {/*<div className={"badge badge-user-" + (elem.blocked ? "blocked" : elem.highRoleCode)}></div>*/}
                </div>
                <div className="col-4 actions">
                    <ButtonIconA type="default" icon="pencil" onClick={urlUpdate}>Modifier</ButtonIconA>
                    <ButtonIcon type="default" icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
                    {/*<ButtonIconDropdown outline={true} icon="more" items={menu} />*/}
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
