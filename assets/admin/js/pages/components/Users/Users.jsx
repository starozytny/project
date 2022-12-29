import React, { Component } from "react";

import axios  from "axios";
import toastr  from "toastr";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire   from "@commonFunctions/formulaire";
import Sort         from "@commonFunctions/sort";
import List         from "@commonFunctions/list";

import { Pagination, TopSorterPagination } from "@commonComponents/Elements/Pagination";
import { Search }           from "@commonComponents/Elements/Search";
import { Filter }           from "@commonComponents/Elements/Filter";
import { LoaderElements }   from "@commonComponents/Elements/Loader";
import { ModalDelete }      from "@commonComponents/Shortcut/Modal";
import { Button }           from "@commonComponents/Elements/Button";
import { Modal }            from "@commonComponents/Elements/Modal";

import { UsersList } from "@adminPages/Users/UsersList";

const URL_GET_DATA        = "api_users_list";
const URL_DELETE_ELEMENT  = "api_users_delete";
const URL_REINIT_PASSWORD = "api_users_password_reinit";

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

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilters = this.handleFilters.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);
        this.handleReinitPassword = this.handleReinitPassword.bind(this);
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => { List.getData(this, URL_GET_DATA, this.state.perPage, this.state.sorter); }

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
        }else{
            ref = this.reinit;
            modalReinit(this);
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
        axios({ method: "POST", url: Routing.generate(URL_REINIT_PASSWORD, {'token': element.token}), data: {} })
            .then(function (response) {
                toastr.info("Mot de passe généré.");
                self.reinit.current.handleUpdateContent("<p>"+ response.data.message +"</p>");
                self.reinit.current.handleUpdateFooter(null);
                self.reinit.current.handleUpdateCloseTxt("Fermer");
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    render () {
        const { sessionName, data, currentData, element, loadingData, perPage, currentPage, filters } = this.state;

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

                    <UsersList data={currentData} onModal={this.handleModal} />

                    <Pagination ref={this.pagination} sessionName={sessionName} items={data} taille={data.length}
                                perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage}/>

                    <ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
                                 title="Supprimer un utilisateur" msgSuccess="Utilisateur supprimé"
                                 onUpdateList={this.handleUpdateList} >
                        Etes-vous sûr de vouloir supprimer définitivement cet utilisateur ?
                    </ModalDelete>

                    <Modal ref={this.reinit} identifiant="reinit" maxWidth={414} title="Générer un nouveau mot de passe"
                           content={<p>Le nouveau mot de passe est généré automatiquement et prendra la place du mot de passe actuel.</p>}
                           footer={<Button onClick={this.handleReinitPassword} type="primary">Confirmer la génération</Button>}
                   />
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
