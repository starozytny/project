import React from "react";
import PropTypes from 'prop-types';

export function UsersItem ({ elem }) {
    return <div className="item">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 col-with-image">
                    <div className="image">
                        <img src={elem.avatarFile} alt="avatar"/>
                    </div>
                    <div className="infos">
                        <div className="name">{elem.lastname} {elem.firstname}</div>
                        <div className="sub">{elem.manager}</div>
                    </div>
                </div>
                <div className="col-2">
                    <div>{elem.username}</div>
                    <div>{elem.email}</div>
                </div>
                <div className="col-3">
                    <div className={"badge badge-" + (elem.highRoleCode)}>{elem.highRole}</div>
                </div>
                <div className="col-4 actions">
                    <button>ok</button>
                </div>
            </div>
        </div>
    </div>
}

UsersItem.propTypes = {
    elem: PropTypes.object.isRequired
}
