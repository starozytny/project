import React, { Component } from "react";
import PropTypes from "prop-types";

import ReactPaginate from 'react-paginate';

import { Select } from "@commonComponents/Elements/Fields";

function updateData(self, selectedPage, offset, items, perPage)
{
    self.setState({ currentPage: selectedPage, offset: offset })
    self.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
    if(self.props.onChangeCurrentPage){
        self.props.onChangeCurrentPage(selectedPage)
    }
}

export class Pagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            perPage: props.perPage !== undefined ? props.perPage : 20,
            currentPage: props.currentPage ? props.currentPage : 0,
        }
    }

    handleClick = (e) => {
        const { items } = this.props;
        const { perPage } = this.state;

        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        if(items !== null){
            updateData(this, selectedPage, offset, items, perPage);
        }
    }

    handlePageOne = (nPerPage) => {
        const { items } = this.props;
        const { perPage } = this.state;

        updateData(this, 0, 0, items, nPerPage ? nPerPage : perPage);
    }

    handlePerPage = (perPage) => {
        this.setState({ perPage });
        this.handlePageOne(perPage);
    }

    render () {
        const { taille } = this.props;
        const { perPage, currentPage } = this.state;

        let pageCount = Math.ceil(taille / perPage);

        let content = <div className="flex justify-end">
            <PaginationView pageCount={pageCount} currentPage={currentPage} onClick={this.handleClick}/>
        </div>

        return <>{content}</>
    }
}

Pagination.propTypes = {
    items: PropTypes.array.isRequired,
    taille: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
    perPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    onChangeCurrentPage: PropTypes.func,
}

export class TopSorterPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sorter: props.nbSorter ? props.nbSorter : "",
            perPage: props.perPage,
            errors: []
        }
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = parseInt(e.currentTarget.value);

        if(name === "perPage"){
            this.props.onPerPage(value)
        }

        if(name === "sorter"){
            this.props.onSorter(value);
        }

        this.setState({ [name]: value })
    }

    render () {
        const { taille, currentPage, onClick, sorters } = this.props;
        const { errors, sorter, perPage } = this.state;

        let items = [
            { value: 5,  label: '5',  identifiant: 'perpage-5' },
            { value: 10, label: '10', identifiant: 'perpage-10' },
            { value: 15, label: '15', identifiant: 'perpage-15' },
            { value: 20, label: '20', identifiant: 'perpage-20' },
            { value: 25, label: '25', identifiant: 'perpage-25' },
            { value: 30, label: '30', identifiant: 'perpage-30' },
            { value: 35, label: '35', identifiant: 'perpage-35' },
            { value: 40, label: '40', identifiant: 'perpage-40' },
            { value: 45, label: '45', identifiant: 'perpage-45' },
            { value: 50, label: '50', identifiant: 'perpage-50' },
        ]

        let pageCount = Math.ceil(taille / perPage);

        let params = { errors: errors, onChange: this.handleChange }

        return <>
            <div className="flex flex-col justify-end gap-2 text-sm sm:flex-row sm:items-center">
                <div className="flex justify-between gap-2 sm:justify-between sm:w-full">
                    <div className="flex flex-row items-center gap-1">
                        {sorters && sorters.length > 1 &&
                            <Select items={sorters} identifiant="sorter" valeur={sorter} noEmpty={true} noErrors={true} {...params}>
                                Trier par
                            </Select>
                        }
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <Select identifiant="perPage" valeur={perPage} items={items} noEmpty={true} noErrors={true} {...params}>
                            {taille} Résultat{taille > 1 ? "s" : ""} par page de
                        </Select>
                    </div>
                </div>

                {pageCount > 1 && <div className="flex justify-end">
                    {onClick && <PaginationView pageCount={pageCount} currentPage={currentPage} onClick={onClick}/>}
                </div>}

            </div>
        </>
    }
}

TopSorterPagination.propTypes = {
    taille: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    sorters: PropTypes.array,
    onPerPage: PropTypes.func,
    onSorter: PropTypes.func,
}

function PaginationView ({ pageCount, currentPage, onClick }) {
    if(pageCount > 1){
        return <ReactPaginate
            previousLabel={<span className="icon-left-arrow" />}
            nextLabel={<span className="icon-right-arrow" />}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={onClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            forcePage={parseInt(currentPage)}
        />
    }else{
        return null;
    }
}

