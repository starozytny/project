import React, { Component } from "react";

import axios      from "axios";
import toastr     from "toastr";
import Routing    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire       from "@commonFunctions/formulaire";
import Sort             from "@commonFunctions/sort";
import SearchFunction   from "@commonFunctions/search";
import List             from "@commonFunctions/list";

import { SocietiesList } from "./SocietiesList";

import { Pagination, TopSorterPagination } from "@commonComponents/Elements/Pagination";
import { Search }           from "@commonComponents/Elements/Search";
import { LoaderElements }   from "@commonComponents/Elements/Loader";
import { ModalDelete } from "@commonComponents/Shortcut/Modal";

const URL_GET_DATA       = "api_societies_list";
const URL_DELETE_ELEMENT = "api_societies_delete";

let SORTER = Sort.compareCode;
let sorters = [
    { value: 0, label: 'Code',  identifiant: 'sorter-code' },
    { value: 1, label: 'Nom',   identifiant: 'sorter-nom' },
]
let sortersFunction = [Sort.compareCode, Sort.compareName];

export class Societies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "local.societies.list.pagination",
            loadingData: true,
            element: null
        }

        this.pagination = React.createRef();
        this.delete = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateData = this.handleUpdateData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleDeleteElement = this.handleDeleteElement.bind(this);
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => {
        const { perPage, sorter } = this.state;

        let self = this;
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
            .then(function (response) {
                let data = response.data; data.sort(sorter);
                let currentData = data.slice(0, perPage);
                self.setState({ data: data, dataImmuable: data, currentData: currentData, loadingData: false })
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    handleUpdateData = (currentData) => { this.setState({ currentData }) }

    handleSearch = (search) => {
        const { perPage, sorter, dataImmuable } = this.state;

        if(search !== ""){
            let newData = SearchFunction.search("society", dataImmuable, search);
            if(sorter) newData.sort(sorter);
            this.setState({ data: newData, currentData: newData.slice(0, perPage) });
        }
    }

    handleModal = (identifiant, elem) => {
        let ref;
        if(identifiant === "delete") ref = this.delete;
        ref.current.handleClick();
        this.setState({ element: elem })
    }

    handleDeleteElement = () => {
        const { element } = this.state;

        let self = this;
        axios({ method: "DELETE", url: Routing.generate(URL_DELETE_ELEMENT, {'id': element.id}), data: {} })
            .then(function (response) {
                toastr.info("Utilisateur supprimé !");
                self.delete.current.handleClose();
                self.handleUpdateList(element, "delete");
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    handleUpdateList = (element, context) => {
        const { data, dataImmuable, currentData, sorter } = this.state;
        List.updateListPagination(this, element, context, data, dataImmuable, currentData, sorter)
    }

    handlePaginationClick = (e) => { this.pagination.current.handleClick(e) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handlePerPage = (perPage) => {
        const { data, sorter } = this.state;

        this.pagination.current.handlePerPage(perPage);
        List.updatePerPage(this, data, perPage, sorter)
    }

    handleSorter = (nb) => {
        const { data, perPage } = this.state;

        let sorter = sortersFunction[nb];
        List.updatePerPage(this, data, perPage, sorter)
    }

    render () {
        const { sessionName, data, currentData, loadingData, perPage, currentPage } = this.state;

        return <>
            {loadingData
                ? <LoaderElements />
                : <>
                    <div className="toolbar">
                        <div className="col-1">
                            <Search onSearch={this.handleSearch} placeholder="Rechercher pas nom ou code.."/>
                        </div>
                    </div>
                    <TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage} sorters={sorters}
                                         onClick={this.handlePaginationClick}
                                         onPerPage={this.handlePerPage} onSorter={this.handleSorter} />
                    <SocietiesList data={currentData} onDelete={this.handleModal} />
                    <Pagination ref={this.pagination} sessionName={sessionName} items={data} taille={data.length}
                                perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage}/>

                    <ModalDelete refModal={this.delete} onClick={this.handleDeleteElement} title="Supprimer une société">
                        Etes-vous sûr de vouloir supprimer définitivement cette société ?
                    </ModalDelete>
                </>
            }
        </>
    }
}
