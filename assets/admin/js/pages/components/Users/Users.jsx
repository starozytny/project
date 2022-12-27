import React, { Component } from "react";
import PropTypes from 'prop-types';

import axios      from "axios";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { UsersList } from "./UsersList";
import { Search }    from "@commonComponents/Elements/Search";

import { Pagination } from "@commonComponents/Elements/Pagination";
import { LoaderElements } from "@commonComponents/Elements/Loader";

const URL_GET_DATA = "api_users_list";

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            currentData: [],
            perPage: 20,
            sessionName: "local.users.list.pagination",
            loadingData: true
        }

        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => {
        let self = this;
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
            .then(function (response) {
                let data = response.data;
                let currentData = data.slice(0, self.state.perPage);
                self.setState({ data: data, currentData: currentData, loadingData: false })
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    handleUpdateData = (currentData) => { this.setState({ currentData }) }

    handleSearch = (search) => {}

    render () {
        const { sessionName, data, currentData, loadingData, perPage } = this.state;

        return <>
            <div className="toolbar">
                <div className="col-1">
                    <div className="filters">
                        <div className="filter"><span className="icon-filter" /></div>
                    </div>
                    <Search onSearch={this.handleSearch} placeholder="Rechercher pas identifiant, nom ou prénom.."/>
                </div>
            </div>
            {loadingData
                ? <LoaderElements />
                : <>
                    <UsersList data={currentData} />
                    <Pagination sessionName={sessionName} havePagination={true} items={data} taille={data.length}
                                perPage={perPage} onUpdate={this.handleUpdateData} />
                </>
            }
        </>
    }
}

Users.propTypes = {
    objs: PropTypes.string.isRequired
}
