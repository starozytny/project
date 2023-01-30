import React from "react";
import PropTypes from 'prop-types';
import Routing   from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import 'moment/locale/fr';

import { ButtonIcon, ButtonIconDropdown } from "@commonComponents/Elements/Button";

const URL_UPDATE_PAGE = "admin_users_update"

export function UsersItem ({ elem, onModal })
{
    let urlUpdate = Routing.generate(URL_UPDATE_PAGE, {'id': elem.id});

    let lastLoginAt = elem.lastLoginAt ? moment(elem.lastLoginAt) : null;

    let menu = [
        { data: <a onClick={() => onModal("reinit", elem)}>
                <span className="icon-refresh" /> <span>Générer un nouveau mot de passe</span>
        </a> },
        { data: <a onClick={() => onModal("mail", elem)}>
                <span className="icon-email-edit" /> <span>Envoyer un mail</span>
        </a> }
    ]

    return <div className="item">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 col-with-image">
                    <div className="image">
                        {elem.avatarFile
                            ? <img src={elem.avatarFile} alt="avatar"/>
                            : <div className="avatar-letter">{elem.lastname.slice(0,1) + elem.firstname.slice(0,1)}</div>
                        }
                    </div>
                    <div className="infos">
                        <div className="name">{elem.lastname} {elem.firstname}</div>
                        <div className="sub">{elem.society.code} - {elem.society.name}</div>
                        <div className="sub">{elem.manager !== "default" ? elem.manager : ""}</div>
                        <div className="sub">{lastLoginAt ? "connecté " + lastLoginAt.fromNow() : ""}</div>
                    </div>
                </div>
                <div className="col-2">
                    <div>{elem.username}</div>
                    <div className="sub">{elem.email}</div>
                </div>
                <div className="col-3">
                    <div className={"badge badge-" + (elem.highRoleCode)}>{elem.highRole}</div>
                </div>
                <div className="col-4 actions">
                    <ButtonIcon outline={true} icon="pencil" onClick={urlUpdate} element="a">Modifier</ButtonIcon>
                    <ButtonIcon outline={true} icon="trash" onClick={() => onModal("delete", elem)}>Supprimer</ButtonIcon>
                    <ButtonIconDropdown outline={true} icon="more" items={menu} />
                </div>
            </div>
        </div>
    </div>
}

UsersItem.propTypes = {
    elem: PropTypes.object.isRequired,
    onModal: PropTypes.func.isRequired,
}
