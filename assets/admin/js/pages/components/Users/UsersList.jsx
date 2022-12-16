import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@commonComponents/Elements/Alert";

import { UsersItem } from "@adminPages/Users/UsersItem";

export function UsersList ({ data }) {
    return <div className="list">
        {data.length > 0
            ? data.map((elem) => {
                return <UsersItem key={elem.id} elem={elem} />;
            })
            : <Alert>Aucune donnée enregistrée.</Alert>
        }
    </div>
}

UsersList.propTypes = {
    data: PropTypes.array.isRequired
}
