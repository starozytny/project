import React, { Component } from "react";
import PropTypes from 'prop-types';

import { UsersList } from "./UsersList";
import {Search} from "@commonComponents/Elements/Search";

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: JSON.parse(props.objs)
        }
    }

    render () {
        return <>
            <div className="toolbar">
                <div className="col-1">
                    <div className="filters">
                        <div className="filter"><span className="icon-filter" /></div>
                    </div>
                    <Search placeholder="Rechercher pas identifiant, nom ou prénom.."/>
                </div>
            </div>
            <UsersList {...this.state} />
        </>
    }
}

Users.propTypes = {
    objs: PropTypes.string.isRequired
}
