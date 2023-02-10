import React, { Component } from "react";

import axios  from "axios";
import toastr  from "toastr";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire   from "@commonFunctions/formulaire";
import Sort         from "@commonFunctions/sort";
import List         from "@commonFunctions/list";

import { Pagination, TopSorterPagination } from "@commonComponents/Elements/Pagination";
import { LoaderElements, LoaderTxt } from "@commonComponents/Elements/Loader";
import { Search }           from "@commonComponents/Elements/Search";
import { Filter }           from "@commonComponents/Elements/Filter";
import { Button }           from "@commonComponents/Elements/Button";
import { Modal }            from "@commonComponents/Elements/Modal";
import { ModalDelete }      from "@commonComponents/Shortcut/Modal";
import { MailFormulaire }   from "@commonComponents/Modules/Mail/MailForm";

import { UsersList } from "@adminPages/Users/UsersList";

const URL_GET_DATA        = "api_users_list";
const URL_DELETE_ELEMENT  = "api_users_delete";
const URL_REINIT_PASSWORD = "api_users_password_reinit";
const URL_SWITCH_BLOCKED  = "api_users_switch_blocked";

let SORTER = Sort.compareLastname;
let sorters = [
    { value: 0, label: 'Nom',           identifiant: 'sorter-nom' },
    { value: 1, label: 'Email',         identifiant: 'sorter-email' },
]
let sortersFunction = [Sort.compareLastname, Sort.compareEmail];

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "local.users.list.pagination",
            loadingData: true,
            filters: [],
            element: null
        }

        this.pagination = React.createRef();
        this.delete = React.createRef();
        this.reinit = React.createRef();
        this.mail = React.createRef();
        this.blocked = React.createRef();
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => {
        let url = this.props.urlGetData ? this.props.urlGetData : Routing.generate(URL_GET_DATA);
        List.getData(this, url, this.state.perPage, this.state.sorter, this.props.highlight);
    }

    handleUpdateData = (currentData) => { this.setState({ currentData }) }

    handleSearch = (search) => {
        const { perPage, sorter, dataImmuable, filters } = this.state;
        List.search(this, 'user', search, dataImmuable, perPage, sorter, true, filters, this.handleFilters)
    }

    handleFilters = (filters) => {
        const { dataImmuable, perPage, sorter } = this.state;
        return List.filter(this, 'highRoleCode', dataImmuable, filters, perPage, sorter);
    }

    handleModal = (identifiant, elem) => {
        let ref;

        if (identifiant === "delete"){
            ref = this.delete;
        }else if(identifiant === "reinit"){
            ref = this.reinit;
            modalReinit(this);
        }else if(identifiant === "mail"){
            ref = this.mail;
        }else if(identifiant === "blocked"){
            ref = this.blocked;
            modalBlocked(this, elem);
        }
        ref.current.handleClick();
        this.setState({ element: elem })
    }

    handleUpdateList = (element, context) => {
        const { data, dataImmuable, currentData, sorter } = this.state;
        List.updateListPagination(this, element, context, data, dataImmuable, currentData, sorter)
    }

    handlePaginationClick = (e) => { this.pagination.current.handleClick(e) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handlePerPage = (perPage) => { List.changePerPage(this, this.state.data, perPage, this.state.sorter); }

    handleSorter = (nb) => { List.changeSorter(this, this.state.data, this.state.perPage, sortersFunction, nb); }

    handleReinitPassword = () => {
        const { element } = this.state;

        let self = this;
        let instance = axios.create();
        instance.interceptors.request.use((config) => {
            self.reinit.current.handleUpdateContent(<LoaderTxt text="En cours de génération" />);
            self.reinit.current.handleUpdateFooter(null);
            self.reinit.current.handleUpdateCloseTxt("Fermer");
            return config;
        }, function(error) {
            modalReinit(self);
            return Promise.reject(error);
        });
        instance({ method: "POST", url: Routing.generate(URL_REINIT_PASSWORD, {'token': element.token}), data: {} })
            .then(function (response) {
                toastr.info("Mot de passe généré.");
                self.reinit.current.handleUpdateContent("<p>"+ response.data.message +"</p>");
                self.reinit.current.handleUpdateFooter(null);
                self.reinit.current.handleUpdateCloseTxt("Fermer");
                instance.interceptors.request.clear();
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    handleBlocked = (e) => {
        const { element } = this.state;
        let self = this;
        let instance = axios.create();
        instance.interceptors.request.use((config) => {
            self.blocked.current.handleUpdateFooter(<Button type={element.blocked ? "primary" : "danger"} icon="chart-3" isLoader={true}>
                {element.blocked ? "Débloquer" : "Bloquer"}
            </Button>);
            return config;
        }, function(error) {
            modalBlocked(self, element);
            return Promise.reject(error);
        });
        instance({ method: "PUT", url: Routing.generate(URL_SWITCH_BLOCKED, {'token': element.token}), data: {} })
            .then(function (response) {
                let elem = response.data;
                toastr.info(elem.blocked ? "Utilisateur bloqué" : "Utilisateur débloqué");
                modalBlocked(self, elem);
                self.handleUpdateList(elem, "update")
                instance.interceptors.request.clear();
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    render () {
        const { highlight } = this.props;
        const { sessionName, data, dataImmuable, currentData, element, loadingData, perPage, currentPage, filters } = this.state;

        let filtersItems = [
            {value: 0, label: "Utilisateur", id: "f-user"},
            {value: 1, label: "Développeur", id: "f-dev"},
            {value: 2, label: "Administrateur", id: "f-admin"},
        ]

        return <>
            {loadingData
                ? <LoaderElements />
                : <>
                    <div className="toolbar">
                        <div className="col-1">
                            <div className="filters">
                                <Filter filters={filters} items={filtersItems} onFilters={this.handleFilters}/>
                            </div>
                            <Search onSearch={this.handleSearch} placeholder="Rechercher pas identifiant, nom ou prénom.."/>
                        </div>
                    </div>

                    <TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage} sorters={sorters}
                                         onClick={this.handlePaginationClick}
                                         onPerPage={this.handlePerPage} onSorter={this.handleSorter} />

                    <UsersList data={currentData} highlight={parseInt(highlight)} onModal={this.handleModal} />

                    <Pagination ref={this.pagination} sessionName={sessionName} items={data} taille={data.length}
                                perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage}/>

                    <ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
                                 title="Supprimer cet utilisateur" msgSuccess="Utilisateur supprimé"
                                 onUpdateList={this.handleUpdateList} >
                        Etes-vous sûr de vouloir supprimer définitivement cet utilisateur ?
                    </ModalDelete>

                    <Modal ref={this.reinit} identifiant="reinit" maxWidth={414} title="Générer un nouveau mot de passe" content={null} footer={null}/>
                    <Modal ref={this.mail} identifiant="mail" maxWidth={768} margin={2} title="Envoyer un mail" isForm={true}
                           content={<MailFormulaire identifiant="mail" element={element} tos={dataImmuable} />} footer={null} />
                    <Modal ref={this.blocked} identifiant="blocked" maxWidth={414} title={element && element.blocked ? "Déblocage" : "Blocage de l'utilisateur"}
                           content={null} footer={null}/>
                </>
            }
        </>
    }
}

function modalReinit (self) {
    self.reinit.current.handleUpdateContent(<p>Le nouveau mot de passe est généré automatiquement et prendra la place du mot de passe actuel.</p>);
    self.reinit.current.handleUpdateFooter(<Button onClick={self.handleReinitPassword} type="primary">Confirmer la génération</Button>);
    self.reinit.current.handleUpdateCloseTxt("Annuler");
}

function modalBlocked (self, element) {
    self.blocked.current.handleUpdateContent(<p>
        Le blocage d'un utilisateur lui interdit l'accès au site par ce compte. <br/><br/>
        Le déblocage d'un utilisateur lui redonne accès au site par ce compte.
    </p>);
    self.blocked.current.handleUpdateFooter(<Button type={element.blocked ? "primary" : "danger"} onClick={self.handleBlocked}>
        {element.blocked ? "Débloquer" : "Bloquer"}
    </Button>);
    self.blocked.current.handleUpdateCloseTxt("Annuler");
}
