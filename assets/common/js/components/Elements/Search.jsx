import React, { Component } from "react";
import PropTypes from "prop-types";

export class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        let value = e.currentTarget.value;
        this.setState({ [e.currentTarget.name]: value });
        this.props.onSearch(value);
    }

    render () {
        const { placeholder } = this.props;
        const { search } = this.state;

        return <div className="search-bar">
            <input type="search" name="search" id="search" value={search}
                   onChange={this.handleChange} placeholder={placeholder} />
            <label htmlFor="search" className={"search-icon" + (search !== "" ? " active" : "")}>
                <span className="icon-search"></span>
            </label>
        </div>
    }
}

Search.propTypes = {
    placeholder: PropTypes.string.isRequired
}
