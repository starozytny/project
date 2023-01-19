import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { ButtonIcon } from "@commonComponents/Elements/Button";

const URL_GET_DATA = "api_notifs_list";

export class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadData: true,
        }
    }

    componentDidMount = () => {
        let self = this;
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
            .then(function (response){
                self.setState({ data: response.data, loadData: false })
            })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    render () {
        const { loadData } = this.state;

        return <>
            {loadData
                ? <ButtonIcon icon="chart-3">Chargement</ButtonIcon>
                : <ButtonIcon icon="notification">
                    Notifications
                </ButtonIcon>
            }
        </>
    }
}
