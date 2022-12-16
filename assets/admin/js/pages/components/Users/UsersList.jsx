import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@commonComponents/Elements/Alert";

export function UsersList ({ data }) {
    return <div className="list">
        {data.length > 0
            ? <Alert>Aucune donnée enregistrée.</Alert>
            : <Alert>Aucune donnée enregistrée.</Alert>
        }
    </div>
}

UsersList.propTypes = {
    data: PropTypes.array.isRequired
}
