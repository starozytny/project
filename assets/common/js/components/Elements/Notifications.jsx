import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Sort       from "@commonFunctions/sort";

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
        const { loadData, data } = this.state;

        console.log(data);
        let items = [], nbNewNotifs = 0;
        if(data){
            data.sort(Sort.compareCreatedAtInverse)
            data.forEach(elem => {
                if(!elem.seen) nbNewNotifs++;

                items.push(<div>ok</div>)
            })
        }

        return <>
            {loadData
                ? <ButtonIcon icon="chart-3">Chargement</ButtonIcon>
                : <div className="notifications-container">
                    {nbNewNotifs > 0 && <div className="notifications-total">{nbNewNotifs}</div>}
                    <ButtonIcon icon="notification">
                        Notifications
                    </ButtonIcon>
                    <div className="notifications-items">
                        <div className="notif-card">
                            <div className="notif-header">
                                <span>Notifications</span>
                                <span className="icon-cancel" />
                            </div>
                            <div className="notif-body">
                                {items.length !== 0 ? items : <div>Aucune notification</div>}
                            </div>
                            <div className="notif-actions">
                                <a>Marquer comme lu</a>
                                <a>Supprimer toutes les notifications</a>
                                <a>Voir toutes les notifications</a>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    }
}
