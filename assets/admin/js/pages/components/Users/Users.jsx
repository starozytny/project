import React, { Component } from "react";
import PropTypes from 'prop-types';

import { UsersList } from "./UsersList";

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: JSON.parse(props.objs)
        }
    }

    render () {
        return <UsersList {...this.state} />
    }
}

Users.propTypes = {
    objs: PropTypes.string.isRequired
}
