import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

const URL_CREATE_ELEMENT = "api_users_create";
const URL_UPDATE_GROUP   = "api_users_update";

export function UserFormulaire ({ context, element })
{
    // let url = Routing.generate(URL_CREATE_ELEMENT);
    //
    // if(context === "update"){
    //     url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    // }

    let form = <Form
        context={context}
        url={"null"}
        username={element ? element.username : ""}
        firstname={element ? element.firstname : ""}
        lastname={element ? element.lastname : ""}
        email={element ? element.email : ""}
        avatar={element ? element.avatarFile : null}
        roles={element ? element.roles : []}
    />

    return <div className="formulaire">{form}</div>;
}

UserFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    element: PropTypes.object.isRequired,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.username,
            firstname: props.firstname,
            lastname: props.lastname,
            email: props.email,
            roles: props.roles,
            avatar: props.avatar,
            password: '',
            passwordConfirm: '',
            errors: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render () {
        const { context } = this.props;
        const { errors, username, firstname, lastname, email, password, passwordConfirm, roles, avatar } = this.state;

        let rolesItems = [
            { value: 'ROLE_ADMIN',      label: 'Admin',          identifiant: 'admin' },
            { value: 'ROLE_USER',       label: 'Utilisateur',    identifiant: 'utilisateur' },
        ]

        return <>
            <form onSubmit={this.handleSubmit}>
                ok
            </form>
        </>
    }
}

Form.propTypes = {
    context: PropTypes.string.isRequired,
    url: PropTypes.node.isRequired,
    username: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    roles: PropTypes.array.isRequired,
}
