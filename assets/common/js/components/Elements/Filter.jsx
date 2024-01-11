import React, { Component } from 'react';
import PropTypes from "prop-types";

export class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: props.filters,
        }
    }

    handleChange = (e) => {
        const { filters } = this.state;

        let value = parseInt(e.currentTarget.value);
        let newFilters = (e.currentTarget.checked) ? [...filters, ...[value]] : filters.filter(v => v !== value);

        this.setState({ filters: newFilters });
        this.props.onFilters(newFilters);
    }

    render () {
        const { items, title, icon } = this.props;
        const { filters } = this.state;

        return <div className="filter">
            <div className="dropdown">
                <div className={`dropdown-btn ${filters.length !== 0 ? "active" : ""}`}>
                    <span className={"icon-" + (icon ? icon : "filter")} />
                    <span className="tooltip">{title ? title : "Filtre"}</span>
                </div>
                <div className="dropdown-items">
                    {items.map((el, index) => {
                        let checked = false;
                        filters.forEach(filter => {
                            if(el.value === filter) checked = true;
                        })

                        return <div className="item" key={index}>
                            <input type="checkbox" name="filters"
                                   id={el.id} value={el.value} defaultChecked={checked} onChange={this.handleChange} />
                            <label htmlFor={el.id}>{el.label}</label>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}

Filter.propTypes = {
    filters: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onFilters: PropTypes.func.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
}
