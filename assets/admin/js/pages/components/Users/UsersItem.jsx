import React from "react";
import PropTypes from 'prop-types';

export function UsersItem ({ elem }) {
    return <div className="item">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">{elem.lastname} {elem.firstname}</div>
                <div className="col-2">{elem.username}</div>
                <div className="col-3 actions" />
            </div>
        </div>
    </div>
}

UsersItem.propTypes = {
    elem: PropTypes.object.isRequired
}
