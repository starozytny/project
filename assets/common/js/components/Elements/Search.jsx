import React, { Component } from "react";

export class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value }) }

    render () {
        const { placeholder } = this.props;
        const { search } = this.state;

        return <div className="search-bar">
            <input type="search" name="search" id="search" value={search}
                   onChange={this.handleChange} placeholder={placeholder} />
            <label htmlFor="search" className="search-icon"><span className="icon-search"></span></label>
        </div>
    }
}
