import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { LoaderElements } from "@commonComponents/Elements/Loader";

import { FaqList } from "@commonComponents/Modules/Help/FaqList";

const URL_GET_DATA = "api_help_faq_list";

export class Faq extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingData: true,
        }
    }

    componentDidMount = () => {
        let self = this;
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
            .then(function (response) {
                let data = response.data;

                let categories = JSON.parse(data.categories);
                let questions = JSON.parse(data.questions);

                self.setState({ categories: categories, questions: questions, loadingData: false })
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    render () {
        const { category } = this.props;
        const { loadingData, categories, questions } = this.state;

        return loadingData
            ? <LoaderElements />
            : <FaqList role="admin" categories={categories} questions={questions}
                       defaultCategory={category ? parseInt(category): null} />
    }
}
