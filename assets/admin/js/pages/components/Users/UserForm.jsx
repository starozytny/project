import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios   from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Checkbox, Input, InputFile, SelectCustom } from "@commonComponents/Elements/Fields";
import { Button }         from "@commonComponents/Elements/Button";
import { LoaderElements } from "@commonComponents/Elements/Loader";

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";
import Sort       from "@commonFunctions/sort";
import {Password} from "@commonComponents/Modules/User/Password";

const URL_SELECT_SOCIETIES  = "api_selection_societies";
const URL_INDEX_ELEMENTS    = "admin_users_index";
const URL_CREATE_ELEMENT    = "api_users_create";
const URL_UPDATE_GROUP      = "api_users_update";
const TEXT_CREATE           = "Ajouter l'utilisateur";
const TEXT_UPDATE           = "Enregistrer les modifications";

let societies = [];

export function UserFormulaire ({ context, element })
{
    let url = Routing.generate(URL_CREATE_ELEMENT);

    if(context === "update"){
        url = Routing.generate(URL_UPDATE_GROUP, {'id': element.id});
    }

    let form = <Form
        context={context}
        url={url}
        society={element ? Formulaire.setValue(element.society.id) : ""}
        username={element ? Formulaire.setValue(element.username) : ""}
        firstname={element ? Formulaire.setValue(element.firstname) : ""}
        lastname={element ? Formulaire.setValue(element.lastname) : ""}
        email={element ? Formulaire.setValue(element.email) : ""}
        avatarFile={element ? Formulaire.setValue(element.avatarFile) : null}
        roles={element ? Formulaire.setValue(element.roles, []) : []}
    />

    return <div className="formulaire">{form}</div>;
}

UserFormulaire.propTypes = {
    context: PropTypes.string.isRequired,
    element: PropTypes.object,
}

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            society: props.society,
            username: props.username,
            firstname: props.firstname,
            lastname: props.lastname,
            email: props.email,
            roles: props.roles,
            password: '',
            password2: '',
            errors: [],
            loadData: true,
        }

        this.select = React.createRef();
        this.file = React.createRef();
    }

    componentDidMount = () => {
        const { society } = this.props;

        let self = this;
        axios({ method: "GET", url: Routing.generate(URL_SELECT_SOCIETIES), data: {} })
            .then(function (response) {
                let data = response.data;

                data.sort(Sort.compareCode)
                let societyName = "";
                data.forEach(elem => {
                    let label = elem.code + " - " + elem.name;
                    societyName = elem.id === society ? label : societyName;
                    societies.push({ value: elem.id, label: label, inputName: label, identifiant: "so-" + elem.id})
                })

                self.setState({ societyName: societyName, loadData: false})
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    handleChange = (e) => {
        const { roles } = this.state

        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "roles"){
            value = Formulaire.updateValueCheckbox(e, roles, value);
        }

        this.setState({[name]: value})
    }

    handleSelect = (name, value, displayValue) => {
        this.setState({ [name]: value });
        this.select.current.handleClose(null, displayValue);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { context, url } = this.props;
        const { username, firstname, lastname, password, passwordConfirm, email, roles, society } = this.state;

        this.setState({ errors: [] });

        let paramsToValidate = [
            {type: "text",  id: 'username',  value: username},
            {type: "text",  id: 'firstname', value: firstname},
            {type: "text",  id: 'lastname',  value: lastname},
            {type: "email", id: 'email',     value: email},
            {type: "array", id: 'roles',     value: roles},
            {type: "text",  id: 'society',    value: society}
        ];
        if(context === "create"){
            if(password !== ""){
                paramsToValidate = [...paramsToValidate,
                    ...[{type: "password", id: 'password', value: password, idCheck: 'passwordConfirm', valueCheck: passwordConfirm}]
                ];
            }
        }

        let validate = Validateur.validateur(paramsToValidate)
        if(!validate.code){
            Formulaire.showErrors(this, validate);
        }else {
            Formulaire.loader(true);
            let self = this;

            let formData = new FormData();
            formData.append("data", JSON.stringify(this.state));

            let file = this.file.current;
            if(file.state.files.length > 0){
                formData.append("avatar", file.state.files[0]);
            }

            axios({ method: "POST", url: url, data: formData, headers: {'Content-Type': 'multipart/form-data'} })
                .then(function (response) {
                    location.href = Routing.generate(URL_INDEX_ELEMENTS, {'h': response.data.id});
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); Formulaire.loader(false); })
            ;
        }
    }

    render () {
        const { context, avatarFile } = this.props;
        const { errors, username, firstname, lastname, email, password, password2, roles, societyName, loadData } = this.state;

        let rolesItems = [
            { value: 'ROLE_ADMIN',      label: 'Admin',          identifiant: 'admin' },
            { value: 'ROLE_USER',       label: 'Utilisateur',    identifiant: 'utilisateur' },
        ]

        let params = { errors: errors }
        let paramsInput0 = {...params, ...{ onChange: this.handleChange }}
        let paramsInput1 = {...params, ...{ onClick: this.handleSelect }}

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
                            <div className="title">Profil utilisateur</div>
                        </div>
                        <div className="line-col-2">
                            <div className="line line-fat-box">
                                <Checkbox items={rolesItems} identifiant="roles" valeur={roles} {...paramsInput0}>
                                    Rôles
                                </Checkbox>
                            </div>

                            <div className="line">
                                {loadData
                                    ? <>
                                        <label>Société</label>
                                        <LoaderElements text="Récupération des sociétés..." />
                                    </>
                                    : <SelectCustom ref={this.select} identifiant="society" inputValue={societyName}
                                              items={societies} {...paramsInput1}>
                                        Société
                                    </SelectCustom>
                                }
                            </div>

                            <div className="line">
                                <InputFile ref={this.file} type="simple" identifiant="avatar" valeur={avatarFile}
                                           placeholder="Glissez et déposer votre avatar ou" {...paramsInput0}>
                                    Avatar
                                </InputFile>
                            </div>
                        </div>
                    </div>

                    <Password context={context} password={password} password2={password2} params={params} />
                </div>

                <div className="line-buttons">
                    <Button isSubmit={true} type="primary">{context === "create" ? TEXT_CREATE : TEXT_UPDATE}</Button>
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
    avatarFile: PropTypes.node,
    roles: PropTypes.array.isRequired,
}
