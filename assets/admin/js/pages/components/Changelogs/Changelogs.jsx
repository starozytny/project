import React, { Component } from "react";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { ChangelogsList } from "@adminPages/Changelogs/ChangelogsList";

import { Search } from "@commonComponents/Elements/Search";
import { Filter } from "@commonComponents/Elements/Filter";
import { ModalDelete } from "@commonComponents/Shortcut/Modal";
import { LoaderElements } from "@commonComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@commonComponents/Elements/Pagination";

const URL_GET_DATA        = "intern_api_changelogs_list";
const URL_DELETE_ELEMENT  = "intern_api_changelogs_delete";

const SESSION_PERPAGE = "project.perpage.changelogs";
const SESSION_FILTERS = "project.filters.changelogs";

export class Changelogs extends Component {
    constructor(props) {
        super(props);

        let saveNbPerPage = sessionStorage.getItem(SESSION_PERPAGE);
        let perPage = saveNbPerPage !== null ? parseInt(saveNbPerPage) : 20;

        let saveFilters = props.highlight ? sessionStorage.getItem(SESSION_FILTERS) : null;

        this.state = {
            perPage: perPage,
            currentPage: 0,
            sorter: Sort.compareCreatedAtInverse,
            loadingData: true,
            filters: saveFilters !== null ? JSON.parse(saveFilters) : [],
            element: null,
        }

        this.pagination = React.createRef();
        this.delete = React.createRef();
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => {
        const { perPage, sorter, filters } = this.state;
        List.getData(this, Routing.generate(URL_GET_DATA), perPage, sorter, this.props.highlight, filters, this.handleFilters);
    }

    handleUpdateData = (currentData) => { this.setState({ currentData }) }

    handleSearch = (search) => {
        const { perPage, sorter, dataImmuable, filters } = this.state;
        List.search(this, 'changelog', search, dataImmuable, perPage, sorter, true, filters, this.handleFilters)
    }

    handleFilters = (filters, nData = null) => {
        const { dataImmuable, perPage, sorter } = this.state;
        return List.filter(this, 'type', nData ? nData : dataImmuable, filters, perPage, sorter, SESSION_FILTERS);
    }

    handleUpdateList = (element, context) => {
        const { data, dataImmuable, currentData, sorter } = this.state;
        List.updateListPagination(this, element, context, data, dataImmuable, currentData, sorter)
    }

    handlePaginationClick = (e) => { this.pagination.current.handleClick(e) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handlePerPage = (perPage) => { List.changePerPage(this, this.state.data, perPage, this.state.sorter, SESSION_PERPAGE); }

    handleModal = (identifiant, elem) => {
        this.delete.current.handleClick();
        this.setState({ element: elem })
    }

    render () {
        const { highlight } = this.props;
        const { data, currentData, element, loadingData, perPage, currentPage, filters } = this.state;

        let filtersItems = [
            {value: 0, label: "Information",    id: "f-info"},
            {value: 1, label: "Attention",      id: "f-atte"},
            {value: 2, label: "Danger",         id: "f-dang"},
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
                            <Search onSearch={this.handleSearch} placeholder="Rechercher pas nom.."/>
                        </div>
                    </div>

                    <TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
                                         onClick={this.handlePaginationClick}
                                         onPerPage={this.handlePerPage} />

                    <ChangelogsList data={currentData} highlight={parseInt(highlight)} onModal={this.handleModal} />

                    <Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
                                perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage}/>

                    <ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
                                 title="Supprimer ce changelog" msgSuccess="Changelog supprimé"
                                 onUpdateList={this.handleUpdateList} >
                        Etes-vous sûr de vouloir supprimer définitivement ce changelog ?
                    </ModalDelete>
                </>
            }
        </>
    }
}
