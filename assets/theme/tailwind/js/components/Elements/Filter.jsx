import React, { Component } from 'react';
import PropTypes from "prop-types";

export class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: props.filters,
            display: false
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
        const { items, title, haveSearch, haveFilter } = this.props;
        const { filters } = this.state;

        let active = filters.length > 0 ? "text-blue-700" : "text-gray-900";
        let radius = haveFilter ? "" : (haveSearch ? "rounded-l-md" : "rounded-md");

        return <div className="relative inline-block">
            <button type="button"
                    className={`
                        dropdown-btn inline-flex w-full justify-center gap-x-1.5 ${radius} bg-white px-3 py-2 
                        text-sm font-semibold ${active} shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
                    `}
                    aria-expanded="true" aria-haspopup="true"
            >
                <span>{title ? title : "Filtre"}</span>
                <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </button>

            <div className="
                    dropdown-items absolute left-0 -z-10 w-56 origin-top-right rounded-md bg-white shadow-lg
                    ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95
                " role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1"
            >
                <div className="flex flex-col gap-1 py-2" role="none">
                    {items.map((el, index) => {
                        let checked = false;
                        filters.forEach(filter => {
                            if (el.value === filter) checked = true;
                        })

                        let styleInput = "group-hover/item:ring-blue-700 relative w-5 h-5 cursor-pointer py-2 pl-2 rounded-md border-0 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500"
                        let styleCheck = "absolute top-0.5 left-0.5 w-4 h-4 opacity-0 rounded bg-blue-700 flex items-center justify-center"

                        return <div className="px-2" key={index}>
                            <label htmlFor={el.id} className="cursor-pointer flex items-center text-gray-900 group/item">
                                <div className={`${styleInput} ${checked ? "ring-blue-700" : "ring-gray-300"}`}>
                                    <div className={`${styleCheck} ${checked ? "opacity-100" : "opacity-0"}`}>
                                        <span className="icon-check1 text-slate-50 text-xs"></span>
                                    </div>
                                </div>
                                <input type="checkbox" name="filters" className="hidden"
                                       id={el.id} value={el.value} defaultChecked={checked} onChange={this.handleChange} />
                                <span className="pl-2">{el.label}</span>
                            </label>
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
    haveSearch: PropTypes.bool,
}
