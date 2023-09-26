import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Sanitaze   from "@commonFunctions/sanitaze";
import Sort       from "@commonFunctions/sort";

import { ButtonIcon }   from "@commonComponents/Elements/Button";
import { LoadIcon }     from "@commonComponents/Elements/Loader";

const URL_GET_DATA          = "intern_api_notifications_list";
const URL_SWITCH_ALL_SEEN   = "intern_api_notifications_switch_all_seen";
const URL_DELETE_ALL        = "intern_api_notifications_delete_all";
const URL_DELETE_ELEMENT    = "intern_api_notifications_delete";

export class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            loadData: true,
            reloadData: false
        }

        this.wrapperRef = React.createRef();

        this.handleClickOutside = this.handleClickOutside.bind(this);
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

    componentWillUnmount() { document.removeEventListener('mousedown', this.handleClickOutside); }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ open: false })
        }
    }

    handleOpen = () => {
        if(this.state.open){
            document.removeEventListener('mousedown', this.handleClickOutside);
        }else{
            document.addEventListener('mousedown', this.handleClickOutside);
        }
        this.setState({ open: !this.state.open })
    }

    handleSetAllSeen = () => { callAxios(this, "PUT", Routing.generate(URL_SWITCH_ALL_SEEN)) }

    handleDeleteAll = () => { callAxios(this, "DELETE", Routing.generate(URL_DELETE_ALL)) }

    handleDelete    = (id) => { callAxios(this, "DELETE", Routing.generate(URL_DELETE_ELEMENT, {'id': id})) }

    render () {
        const { open, loadData, reloadData, data } = this.state;

        let items = [], nbNewNotifs = 0;
        if(data){
            data.sort(Sort.compareCreatedAtInverse)
            data.forEach(elem => {
                if(!elem.seen) nbNewNotifs++;

                items.push(<div className="notif-item" key={elem.id}>
                    <div className="icon"><span className={"icon-" + elem.icon}></span></div>
                    <div className="infos">
                        <a className="name">
                            {!elem.seen && <span className="new"></span>}
                            <span>{elem.name}</span>
                        </a>
                        <div className="sub">{Sanitaze.toFormatCalendar(elem.createdAt)}</div>
                    </div>
                    <div className="actions">
                        <ButtonIcon icon="trash" onClick={() => this.handleDelete(elem.id)}>Supprimer</ButtonIcon>
                    </div>
                </div>)
            })
        }

        return <>
            {loadData
                ? <ButtonIcon icon="chart-3">Chargement</ButtonIcon>
                : <div ref={this.wrapperRef} className={"notifications-container" + (open ? " active" : "")}>
                    {nbNewNotifs > 0 && <div className="notifications-total">{nbNewNotifs}</div>}
                    <ButtonIcon outline={true} icon="notification" onClick={this.handleOpen}>
                        Notifications
                    </ButtonIcon>
                    <div className="notifications-items">
                        <div className="notif-card">
                            <div className="notif-header">
                                <span>Notifications</span>
                                <span className="icon-cancel" onClick={this.handleOpen} />
                            </div>
                            <div className="notif-body">
                                {reloadData
                                    ? <LoadIcon></LoadIcon>
                                    : items.length !== 0 ? items : <div className="notif-item">Aucune notification</div>
                                }
                            </div>
                            <div className="notif-actions">
                                <a onClick={this.handleSetAllSeen}>Marquer comme lu</a>
                                <a onClick={this.handleDeleteAll}>Supprimer toutes les notifications</a>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    }
}

function callAxios (self, method, url) {
    self.setState({ reloadData: true })
    axios({ method: method, url: url, data: {} })
        .then(function (response){
            self.setState({ data: response.data, reloadData: false })
        })
        .catch(function (error) { Formulaire.displayErrors(self, error); })
    ;
}
