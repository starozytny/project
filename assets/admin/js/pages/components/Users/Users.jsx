import React, { Component } from "react";

import axios from "axios";
import toastr from "toastr";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Search } from "@tailwindComponents/Elements/Search";
import { Filter } from "@tailwindComponents/Elements/Filter";
import { Button, ButtonIcon } from "@tailwindComponents/Elements/Button";
import { Modal } from "@tailwindComponents/Elements/Modal";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { MailFormulaire } from "@commonComponents/Modules/Mail/MailForm";

import { UsersList } from "@adminPages/Users/UsersList";

const URL_GET_DATA = "intern_api_users_list";
const URL_DELETE_ELEMENT = "admin_users_delete";
const URL_REINIT_PASSWORD = "intern_api_users_password_reinit";
const URL_SWITCH_BLOCKED = "intern_api_users_switch_blocked";

let sorters = [
	{ value: 0, identifiant: 'sorter-nom', label: 'Nom' },
	{ value: 1, identifiant: 'sorter-ema', label: 'Email' },
]
let sortersFunction = [Sort.compareLastname, Sort.compareEmail];

const SESSION_SORTER = "project.sorter.users";
const SESSION_PERPAGE = "project.perpage.users";
const SESSION_FILTERS = "project.filters.users";

export class Users extends Component {
	constructor (props) {
		super(props);

        let [sorter, nbSorter] = List.getSessionSorter(SESSION_SORTER, Sort.compareCode, sortersFunction)

		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: sorter,
			nbSorter: nbSorter,
			loadingData: true,
            filters: List.getSessionFilters(SESSION_FILTERS, [], props.highlight),
			element: null
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
		this.reinit = React.createRef();
		this.mail = React.createRef();
		this.blocked = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { perPage, sorter, filters } = this.state;

		let url = this.props.urlGetData ? this.props.urlGetData : Routing.generate(URL_GET_DATA);
		List.getData(this, url, perPage, sorter, this.props.highlight, filters, this.handleFilters);
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable, filters } = this.state;
		List.search(this, 'user', search, dataImmuable, perPage, sorter, true, filters, this.handleFilters)
	}

	handleFilters = (filters, nData = null) => {
		const { dataImmuable, perPage, sorter } = this.state;
		return List.filter(this, 'highRoleCode', nData ? nData : dataImmuable, filters, perPage, sorter, SESSION_FILTERS);
	}

	handleUpdateList = (element, context) => {
		const { data, dataImmuable, currentData, sorter } = this.state;
		List.updateListPagination(this, element, context, data, dataImmuable, currentData, sorter)
	}

	handlePaginationClick = (e) => {
		this.pagination.current.handleClick(e)
	}

	handleChangeCurrentPage = (currentPage) => {
		this.setState({ currentPage });
	}

	handlePerPage = (perPage) => {
		List.changePerPage(this, this.state.data, perPage, this.state.sorter, SESSION_PERPAGE);
	}

	handleSorter = (nb) => {
		List.changeSorter(this, this.state.data, this.state.perPage, sortersFunction, nb, SESSION_SORTER);
	}

	handleModal = (identifiant, elem) => {
		if (identifiant === "reinit") {
			modalReinit(this);
		} else if (identifiant === "blocked") {
			modalBlocked(this, elem);
		}

		this[identifiant].current.handleClick();
		this.setState({ element: elem })
	}

	handleReinitPassword = () => {
		const { element } = this.state;

		let self = this;
		let instance = axios.create();
		instance.interceptors.request.use((config) => {
			self.reinit.current.handleUpdateContent(<LoaderElements text="En cours de génération" />);
			self.reinit.current.handleUpdateFooter(null);
			self.reinit.current.handleUpdateCloseTxt("Fermer");
			return config;
		}, function (error) {
			modalReinit(self);
			return Promise.reject(error);
		});
		instance({ method: "POST", url: Routing.generate(URL_REINIT_PASSWORD, { 'token': element.token }), data: {} })
			.then(function (response) {
				toastr.info("Mot de passe généré.");
				self.reinit.current.handleUpdateContent("<p>" + response.data.message + "</p>");
				self.reinit.current.handleUpdateFooter(null);
				self.reinit.current.handleUpdateCloseTxt("Fermer");
				instance.interceptors.request.clear();
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	handleBlocked = (e) => {
		const { element } = this.state;
		let self = this;
		let instance = axios.create();
		instance.interceptors.request.use((config) => {
			self.blocked.current.handleUpdateFooter(<ButtonIcon type={element.blocked ? "blue" : "red"} icon="chart-3" />);
			return config;
		}, function (error) {
			modalBlocked(self, element);
			return Promise.reject(error);
		});
		instance({ method: "PUT", url: Routing.generate(URL_SWITCH_BLOCKED, { 'token': element.token }), data: {} })
			.then(function (response) {
				let elem = response.data;
				toastr.info(elem.blocked ? "Utilisateur bloqué" : "Utilisateur débloqué");
				modalBlocked(self, elem);
				self.handleUpdateList(elem, "update")
				instance.interceptors.request.clear();
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	render () {
		const { highlight } = this.props;
		const { data, dataImmuable, currentData, element, loadingData, perPage, currentPage, filters, nbSorter } = this.state;

		let filtersItems = [
			{ value: 0, label: "Utilisateur", id: "f-user" },
			{ value: 1, label: "Développeur", id: "f-dev" },
			{ value: 2, label: "Administrateur", id: "f-admin" },
		]

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-row">
						<Filter haveSearch={true} filters={filters} items={filtersItems} onFilters={this.handleFilters} />
						<Search haveFilter={true} onSearch={this.handleSearch} placeholder="Rechercher pas identifiant, nom ou prénom.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage} sorters={sorters}
										 onClick={this.handlePaginationClick} nbSorter={nbSorter}
										 onPerPage={this.handlePerPage} onSorter={this.handleSorter} />

					<UsersList data={currentData} highlight={parseInt(highlight)} onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					<ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
								 title="Supprimer cet utilisateur" msgSuccess="Utilisateur supprimé"
								 onUpdateList={this.handleUpdateList}>
						Etes-vous sûr de vouloir supprimer définitivement cet utilisateur ?
					</ModalDelete>

					<Modal ref={this.reinit} identifiant="reinit" maxWidth={414}
						   title={element ? "Générer un nouveau mot de passe pour " + element.lastname : ""}
						   content={null} footer={null} />
					<Modal ref={this.mail} identifiant="mail" maxWidth={768} margin={2} title="Envoyer un mail" isForm={true}
						   content={<MailFormulaire identifiant="mail" element={element} tos={dataImmuable} />} footer={null} />
					<Modal ref={this.blocked} identifiant="blocked" maxWidth={414}
						   title={element ? (element.blocked ? "Déblocage" : "Blocage") + " de " + element.lastname : ""}
						   content={null} footer={null} />
				</>
			}
		</>
	}
}

function modalReinit (self) {
	self.reinit.current.handleUpdateContent(<p>Le nouveau mot de passe est généré automatiquement et prendra la place du mot de passe actuel.</p>);
	self.reinit.current.handleUpdateFooter(<Button type="red" onClick={self.handleReinitPassword}>Confirmer la génération</Button>);
	self.reinit.current.handleUpdateCloseTxt("Annuler");
}

function modalBlocked (self, element) {
	self.blocked.current.handleUpdateContent(<p>
		Le blocage d'un utilisateur lui interdit l'accès au site par ce compte. <br /><br />
		Le déblocage d'un utilisateur lui redonne accès au site par ce compte.
	</p>);
	self.blocked.current.handleUpdateFooter(<Button type={element.blocked ? "blue" : "red"} onClick={self.handleBlocked}>
		{element.blocked ? "Débloquer" : "Bloquer"}
	</Button>);
	self.blocked.current.handleUpdateCloseTxt("Annuler");
}
