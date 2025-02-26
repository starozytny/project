import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Sanitaze from "@commonFunctions/sanitaze";
import Formulaire from "@commonFunctions/formulaire";

import { ButtonIcon } from "@tailwindComponents/Elements/Button";

const URL_NOTIFICATIONS = "intern_api_notifications_index";
const URL_NOTIFICATIONS_SEEN = "intern_api_notifications_isSeen";
const URL_NOTIFICATIONS_SEEN_ALL = "intern_api_notifications_isSeen_all";
const URL_NOTIFICATIONS_DELETE = "intern_api_notifications_delete";

export class Notifications extends Component {
    constructor (props) {
        super(props);

        this.state = {
            open: false,
            data: null,
            loadData: true,
        }

        this.wrapperRef = React.createRef();
    }

    componentDidMount = () => {
        Formulaire.axiosGetData(this, Routing.generate(URL_NOTIFICATIONS), Sort.compareCreatedAtInverse)
    }

    componentWillUnmount () {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside (event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ open: false })
        }
    }

    handleUpdateList = (element, newContext = null) => {
        const { data } = this.state

        let nContext = (newContext !== null) ? newContext : "update";
        let newData = List.update(nContext, data, element);

        newData.sort(Sort.compareCreatedAtInverse)

        this.setState({
            data: newData,
            element: element
        })
    }

    handleOpen = () => {
        if (this.state.open) {
            document.removeEventListener('mousedown', this.handleClickOutside);
        } else {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
        this.setState({ open: !this.state.open })
    }

    handleSeen = (element) => {
        if(!element.isSeen){
            const self = this;
            axios.post(Routing.generate(URL_NOTIFICATIONS_SEEN, { id: element.id }), {})
                .then(function (response) {
                    let data = response.data;
                    self.handleUpdateList(data, 'update');
                })
                .catch(function (error) {
                    Formulaire.displayErrors(self, error)
                })
            ;
        }
    }

    handleDelete = (element) => {
        const self = this;
        axios.delete(Routing.generate(URL_NOTIFICATIONS_DELETE, { id: element.id }), {})
            .then(function (response) {
                self.handleUpdateList(element, "delete");
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
            })
        ;
    }

    handleIsSeenAll = () => {
        const self = this;
        Formulaire.loader(true)
        axios.post(Routing.generate(URL_NOTIFICATIONS_SEEN_ALL), {})
            .then(function (response) {
                let data = response.data;
                data.sort(Sort.compareCreatedAtInverse);
                self.setState({ data: data, open: false })
            })
            .catch(function (error) {
                Formulaire.displayErrors(this, error)
            })
            .then(function () {
                Formulaire.loader(false)
            })
        ;
    }

    render () {
        const { position = "top-8 -left-20 lg:left-0", customBtn = "" } = this.props;
        const { open, loadData, data } = this.state;

        let items = [], nbNewNotifs = 0;
        if (data) {
            data.sort(Sort.compareCreatedAtInverse)
            data.forEach(el => {
                if (!el.seen) nbNewNotifs++;

                items.push(<div className="w-full flex justify-between gap-1 px-2 py-1.5 cursor-pointer hover:bg-gray-100" key={el.id}>
                    <div className="w-full flex gap-1 lg:gap-2" onClick={() => this.handleSeen(el)}>
                        <div className="w-8 h-8 min-w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                            <span className={`icon-${el.icon}`} />
                        </div>
                        <div className="w-full leading-4">
                            <a className="text-sm font-medium hover:text-blue-600 transition-colors" href={el.url}>
                                {!el.seen && <span className="inline-block align-top w-1 h-1 bg-green-500 rounded-full" />} <span>{el.name}</span>
                            </a>
                            <div className="text-gray-600 text-xs">
                                {Sanitaze.toFormatCalendar(el.createdAt)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <ButtonIcon type="default" icon="trash" onClick={() => this.handleDelete(el)}>
                            Supprimer
                        </ButtonIcon>
                    </div>
                </div>)
            })
        }

        return <>
            {loadData
                ? <ButtonIcon type="menu" icon="chart-3" customBtn={customBtn} />
                : <div ref={this.wrapperRef} className="relative">
                    <ButtonIcon type="menu" icon="notification" onClick={this.handleOpen} customBtn={customBtn}>
                        Notifications
                    </ButtonIcon>
                    {nbNewNotifs > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-400"></div>}
                    <div className={`${open ? "block" : "hidden"} bg-white shadow rounded-md absolute ${position} w-64 lg:w-80 z-10`}>
                        <div className="p-2 flex justify-between">
                            <span className="font-medium text-sm">Notifications</span>
                            <span className="icon-cancel cursor-pointer" onClick={this.handleOpen} />
                        </div>
                        <div className="border-t py-2 max-h-64 overflow-y-auto">
                            {items.length !== 0
                                ? items
                                : <div className="w-full inline-block px-2 py-1.5">
                                    <div className="text-sm">Aucune notification</div>
                                </div>}
                        </div>
                        <div className="border-t py-2">
                            <div className="cursor-pointer text-sm text-center text-blue-700 hover:text-blue-600"
                                 onClick={this.handleIsSeenAll}
                            >
                                Marquer comme lu
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    }
}
