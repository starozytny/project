import React, { Component } from "react";
import PropTypes from "prop-types";

export class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ""
        }
    }

    handleChange = (e) => {
        let value = e.currentTarget.value;
        this.setState({ [e.currentTarget.name]: value });
        this.props.onSearch(value);
    }

    render () {
        const { placeholder = "Recherche..." } = this.props;
        const { search } = this.state;

        return <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<span className="text-gray-500 sm:text-sm">
					<span className="icon-search"></span>
				</span>
            </div>
            <input type="search" name="search" id="search" value={search}
                   onChange={this.handleChange} placeholder={placeholder}
                   className="block w-full rounded-md border-0 py-2 pl-9 pr-20 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500"
            />
        </div>
    }
}

Search.propTypes = {
    placeholder: PropTypes.string.isRequired
}
