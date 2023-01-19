import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@commonComponents/Elements/Alert";

import { UsersItem } from "@adminPages/Users/UsersItem";

export function UsersList ({ data, onModal }) {
    return <div className="list">
        <div className="list-table">
            <div className="items items-users">
                <div className="item item-header">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Utilisateur</div>
                            <div className="col-2">Identifiant</div>
                            <div className="col-3">Rôle</div>
                            <div className="col-4 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <UsersItem key={elem.id} elem={elem} onModal={onModal} />;
                    })
                    : <Alert>Aucune donnée enregistrée.</Alert>
                }
            </div>
        </div>
    </div>
}

UsersList.propTypes = {
    data: PropTypes.array.isRequired,
    onModal: PropTypes.func.isRequired,
}
