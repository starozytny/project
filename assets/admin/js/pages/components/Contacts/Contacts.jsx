import React, { Component } from "react";

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { ContactsList } from "@adminPages/Contacts/ContactsList";

import { Pagination, TopSorterPagination } from "@commonComponents/Elements/Pagination";
import { Search }           from "@commonComponents/Elements/Search";
import { LoaderElements }   from "@commonComponents/Elements/Loader";
import { Filter }           from "@commonComponents/Elements/Filter";
import { ModalDelete }      from "@commonComponents/Shortcut/Modal";

const URL_GET_DATA        = "api_contacts_list";
const URL_DELETE_ELEMENT  = "api_contacts_delete";

let SORTER = Sort.compareCreatedAtInverse;
let sorters = [
    { value: 0, label: 'Création',  identifiant: 'sorter-created' },
    { value: 1, label: 'Nom',       identifiant: 'sorter-nom' },
]
let sortersFunction = [Sort.compareCreatedAtInverse, Sort.compareName];

export class Contacts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            currentPage: 0,
            sorter: SORTER,
            sessionName: "local.contacts.list.pagination",
            loadingData: true,
            filters: [],
            element: null,
        }

        this.pagination = React.createRef();
        this.delete = React.createRef();
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => { List.getData(this, URL_GET_DATA, this.state.perPage, this.state.sorter); }

    handleUpdateData = (currentData) => { this.setState({ currentData }) }

    handleSearch = (search) => {
        const { perPage, sorter, dataImmuable, filters } = this.state;
        List.search(this, 'contact', search, dataImmuable, perPage, sorter, true, filters, this.handleFilters)
    }

    handleFilters = (filters) => {
        const { dataImmuable, perPage, sorter } = this.state;
        return List.filter(this, 'seen', dataImmuable, filters, perPage, sorter);
    }

    handleModal = (identifiant, elem) => {
        this.delete.current.handleClick();
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

    render () {
        const { sessionName, data, currentData, element, loadingData, perPage, currentPage, filters } = this.state;

        let filtersItems = [
            {value: 0, label: "A lire",  id: "f-to-seen"},
            {value: 1, label: "Déjà lu", id: "f-seen"},
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

                    <TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage} sorters={sorters}
                                         onClick={this.handlePaginationClick}
                                         onPerPage={this.handlePerPage} onSorter={this.handleSorter} />

                    <ContactsList data={currentData} onDelete={this.handleModal} />

                    <Pagination ref={this.pagination} sessionName={sessionName} items={data} taille={data.length}
                                perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage}/>

                    <ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
                                 title="Supprimer ce message" msgSuccess="Message supprimé"
                                 onUpdateList={this.handleUpdateList} >
                        Etes-vous sûr de vouloir supprimer définitivement ce message ?
                    </ModalDelete>
                </>
            }
        </>
    }
}
