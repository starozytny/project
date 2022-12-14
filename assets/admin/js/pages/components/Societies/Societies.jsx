import React, { Component } from "react";

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { SocietiesList } from "./SocietiesList";

import { Pagination, TopSorterPagination } from "@commonComponents/Elements/Pagination";
import { Search }           from "@commonComponents/Elements/Search";
import { LoaderElements }   from "@commonComponents/Elements/Loader";
import { ModalDelete }      from "@commonComponents/Shortcut/Modal";

const URL_GET_DATA        = "api_societies_list";
const URL_DELETE_ELEMENT  = "api_societies_delete";

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
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);
    }

    componentDidMount = () => { this.handleGetData(); }

    handleGetData = () => { List.getData(this, URL_GET_DATA, this.state.perPage, this.state.sorter); }

    handleUpdateData = (currentData) => { this.setState({ currentData }) }

    handleSearch = (search) => {
        const { perPage, sorter, dataImmuable } = this.state;
        List.search(this, 'society', search, dataImmuable, perPage, sorter)
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
        const { sessionName, data, currentData, element, loadingData, perPage, currentPage } = this.state;

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

                    <ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
                                 title="Supprimer une soci??t??" msgSuccess="Soci??t?? supprim??e"
                                 onUpdateList={this.handleUpdateList} >
                        Etes-vous s??r de vouloir supprimer d??finitivement cette soci??t?? ?
                    </ModalDelete>
                </>
            }
        </>
    }
}
