import React, { Component } from "react";
import PropTypes from 'prop-types';

import axios      from "axios";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Sort       from "@commonFunctions/sort";
import SearchFunction from "@commonFunctions/search";

import { UsersList } from "./UsersList";
import { Search }    from "@commonComponents/Elements/Search";

import { Pagination } from "@commonComponents/Elements/Pagination";
import { LoaderElements } from "@commonComponents/Elements/Loader";

const URL_GET_DATA = "api_users_list";

let SORTER = Sort.compareLastname;

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            sessionName: "local.users.list.pagination",
            loadingData: true,
        }

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
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
        const { dataImmuable, perPage } = this.state;

        if(search !== ""){
            let newData = SearchFunction.search("user", dataImmuable, search);
            if(SORTER){
                newData.sort(SORTER)
            }
            this.setState({ data: newData, currentData: newData.slice(0, perPage) });
        }
    }

    render () {
        const { sessionName, data, currentData, loadingData, perPage } = this.state;

        return <>
            {loadingData
                ? <LoaderElements />
                : <>
                    <div className="toolbar">
                        <div className="col-1">
                            <div className="filters">
                                <div className="filter"><span className="icon-filter" /></div>
                            </div>
                            <Search onSearch={this.handleSearch} placeholder="Rechercher pas identifiant, nom ou prénom.."/>
                        </div>
                    </div>
                    <UsersList data={currentData} />
                    <Pagination sessionName={sessionName} items={data} taille={data.length}
                                perPage={perPage} onUpdate={this.handleUpdateData} />
                </>
            }
        </>
    }
}

Users.propTypes = {
    objs: PropTypes.string.isRequired
}
