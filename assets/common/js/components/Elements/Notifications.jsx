import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { ButtonIcon } from "@commonComponents/Elements/Button";

const URL_GET_DATA = "api_changelogs_list";

export class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadData: true,
        }
    }

    componentDidMount = () => {
        axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
            .then(function (response){

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
