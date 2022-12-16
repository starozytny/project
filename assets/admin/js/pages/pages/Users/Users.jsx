import React, { Component } from "react";
import PropTypes from 'prop-types';

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            objs: JSON.parse(props.objs)
        }

    }

    render () {
        return <div>ok</div>
    }
}

Users.propTypes = {
    objs: PropTypes.string.isRequired
}
