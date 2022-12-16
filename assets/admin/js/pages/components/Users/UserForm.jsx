import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';
import {Input} from "@commonComponents/Elements/Fields";
import {Button} from "@commonComponents/Elements/Button";

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
            password2: '',
            errors: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => { this.setState({[e.currentTarget.name]: e.currentTarget.value}) }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ errors: [
            {
                name: "firstname", message: "Erreur"
            }
        ] })
    }

    render () {
        const { context } = this.props;
        const { errors, username, firstname, lastname, email, password, password2, roles, avatar } = this.state;

        let rolesItems = [
            { value: 'ROLE_ADMIN',      label: 'Admin',          identifiant: 'admin' },
            { value: 'ROLE_USER',       label: 'Utilisateur',    identifiant: 'utilisateur' },
        ]

        let params = { errors: errors }
        let paramsInput0 = {...params, ...{ onChange: this.handleChange }}

        return <>
            <form onSubmit={this.handleSubmit}>
                <div className="line-container">
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Identifiants</div>
                            <div className="subtitle">Les deux informations peuvent être utilisées pour se connecter.</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-2">
                                <Input identifiant="username" valeur={username} {...paramsInput0}>Nom utilisateur</Input>
                                <Input identifiant="email"    valeur={email}    {...paramsInput0} type="email">Adresse e-mail</Input>
                            </div>
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Informations personnelles</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-2">
                                <Input identifiant="firstname"  valeur={firstname}  {...paramsInput0}>Prénom</Input>
                                <Input identifiant="lastname"   valeur={lastname}   {...paramsInput0}>Nom</Input>
                            </div>
                        </div>
                    </div>
                    <div className="line">
                        <div className="line-col-1">
                            <div className="title">Mot de passe</div>
                            <div className="subtitle">
                                {context === "create"
                                    ? "Laisser les champs vides pour générer un mot de passe aléatoire."
                                    : "Laisser les champs vides pour ne pas modifier le mot de passe."
                                }
                            </div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-2">
                                <Input identifiant="password"  valeur={password}  {...paramsInput0} password={true} type="password">
                                    Mot de passe
                                </Input>
                                <Input identifiant="password2" valeur={password2} {...paramsInput0} password={true} type="password">
                                    Confirmer le mot de passe
                                </Input>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="line-buttons">
                    <Button isSubmit={true}>Ajouter l'utilisateur</Button>
                </div>
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
