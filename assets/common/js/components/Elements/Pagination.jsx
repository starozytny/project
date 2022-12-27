import React, { Component } from "react";
import PropTypes from "prop-types";

import ReactPaginate from 'react-paginate';

function updateData(self, selectedPage, offset, items, perPage)
{
    self.setState({ currentPage: selectedPage, offset: offset })
    self.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
}

export class Pagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            perPage: props.perPage !== undefined ? props.perPage : 20,
            currentPage: props.currentPage ? props.currentPage : 0,
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        const { perPage, items, sessionName } = this.props;

        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        if(items !== null){
            updateData(this, selectedPage, offset, items, perPage);
            sessionStorage.setItem(sessionName, selectedPage);
        }
    }

    render () {
        const { taille } = this.props;
        const { perPage, currentPage } = this.state;

        let pageCount = Math.ceil(taille / perPage);

        let content = <>
            <PaginationView pageCount={pageCount} currentPage={currentPage} onClick={this.handleClick}/>
        </>

        return <>
            {content}
        </>
    }
}

Pagination.propTypes = {
    sessionName: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    taille: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
    perPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
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
