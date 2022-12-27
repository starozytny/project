import React, { Component } from "react";

import axios      from "axios";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire       from "@commonFunctions/formulaire";
import Sort             from "@commonFunctions/sort";
import SearchFunction   from "@commonFunctions/search";
import FilterFunction   from "@commonFunctions/filter";

import { UsersList } from "./UsersList";

import { Search }           from "@commonComponents/Elements/Search";
import { Filter }           from "@commonComponents/Elements/Filter";
import { Pagination }       from "@commonComponents/Elements/Pagination";
import { LoaderElements }   from "@commonComponents/Elements/Loader";
import {Modal} from "@commonComponents/Elements/Modal";
import {Button} from "@commonComponents/Elements/Button";

const URL_GET_DATA = "api_users_list";

let SORTER = Sort.compareLastname;

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            sessionName: "local.users.list.pagination",
            loadingData: true,
            filters: [],
            element: null
        }

        this.delete = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFilters = this.handleFilters.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => {
        let self = this;
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
            .then(function (response) {
                let data = response.data; data.sort(SORTER);
                let currentData = data.slice(0, self.state.perPage);
                self.setState({ data: data, dataImmuable: data, currentData: currentData, loadingData: false })
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    handleUpdateData = (currentData) => { this.setState({ currentData }) }

    handleSearch = (search) => {
        const { perPage, filters } = this.state;

        let dataImmuable = this.handleFilters(filters);
        if(search !== ""){
            let newData = SearchFunction.search("user", dataImmuable, search);
            if(SORTER){
                newData.sort(SORTER);
            }
            this.setState({ data: newData, currentData: newData.slice(0, perPage) });
        }
    }

    handleFilters = (filters) => {
        const { dataImmuable, perPage } = this.state;

        let newData = FilterFunction.filter("highRoleCode", dataImmuable, filters);
        if(SORTER){
            newData.sort(SORTER);
        }

        this.setState({ data: newData, currentData: newData.slice(0, perPage), filters: filters });
        return newData;
    }

    handleDelete = (elem) => {
        this.delete.current.handleClick();
        this.setState({ element: elem })
    }

    handleDeleteUser = () => {
        const { element } = this.state;
        console.log("in")
    }

    render () {
        const { sessionName, data, currentData, loadingData, perPage, filters } = this.state;

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
                    <UsersList data={currentData} onDelete={this.handleDelete} />
                    <Pagination sessionName={sessionName} items={data} taille={data.length}
                                perPage={perPage} onUpdate={this.handleUpdateData} />

                    <Modal ref={this.delete} identifiant="delete" maxWidth={414} title="Supprimer un utilisateur"
                           content={<p>Etes-vous sûr de vouloir supprimer définitivement cet utilisateur ?</p>}
                           footer={<>
                               <Button onClick={this.handleDeleteUser} type="primary">Confirmer la suppression</Button>
                               <div className="close-modal">
                                   <Button type="cancel">Annuler</Button>
                               </div>
                           </>}
                    />
                </>
            }
        </>
    }
}
