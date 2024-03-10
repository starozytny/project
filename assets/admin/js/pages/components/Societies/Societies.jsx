import React, { Component } from "react";

import axios from "axios";
import toastr from "toastr";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Formulaire from "@commonFunctions/formulaire";

import { SocietiesList } from "@adminPages/Societies/SocietiesList";

import { Search } from "@tailwindComponents/Elements/Search";
import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_societies_list";
const URL_DELETE_ELEMENT = "intern_api_societies_delete";
const URL_ACTIVATE_ELEMENT = "intern_api_societies_activate";
const URL_GENERATE_ELEMENT = "intern_api_societies_generate";

let sorters = [
	{ value: 0, label: 'Code', identifiant: 'sorter-code' },
	{ value: 1, label: 'Nom', identifiant: 'sorter-nom' },
]
let sortersFunction = [Sort.compareCode, Sort.compareName];

const SESSION_SORTER = "project.sorter.societies";
const SESSION_PERPAGE = "project.perpage.societies";

export class Societies extends Component {
	constructor (props) {
		super(props);

        let [sorter, nbSorter] = List.getSessionSorter(SESSION_SORTER, Sort.compareCode, sortersFunction)

		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: sorter,
			nbSorter: nbSorter,
			loadingData: true,
			element: null
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
		this.activate = React.createRef();
		this.generate = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { highlight } = this.props;
		const { perPage, sorter } = this.state;

		let self = this;
		axios({ method: "GET", url: Routing.generate(URL_GET_DATA), data: {} })
			.then(function (response) {
				let data = JSON.parse(response.data.donnees);
				let dataImmuable = JSON.parse(response.data.donnees);
				let settings = JSON.parse(response.data.settings);

				if (sorter) data.sort(sorter);
				if (sorter) dataImmuable.sort(sorter);

				let [currentData, currentPage] = List.setCurrentPage(highlight, data, perPage, 'id');

				self.setState({
                    data: data, dataImmuable: data, currentData: currentData,
                    currentPage: currentPage, settings: settings,
                    loadingData: false
                })
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable } = this.state;
		List.search(this, 'society', search, dataImmuable, perPage, sorter)
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
		if (identifiant === "activate") {
			modalActivationDefault(this);
		} else if (identifiant === "generate") {
			modalGenerationDefault(this);
		}

		this[identifiant].current.handleClick();
		this.setState({ element: elem })
	}

	handleActivate = () => {
		const { element } = this.state;

		let self = this;
		let instance = axios.create();
		instance.interceptors.request.use((config) => {
			self.activate.current.handleUpdateContent(<LoaderElements text="En cours d'activation" />);
			self.activate.current.handleUpdateFooter(null);
			self.activate.current.handleUpdateCloseTxt("Fermer");
			return config;
		}, function (error) {
			modalActivationDefault(self);
			return Promise.reject(error);
		});
		instance({ method: "PUT", url: Routing.generate(URL_ACTIVATE_ELEMENT, { 'id': element.id }), data: {} })
			.then(function (response) {
				toastr.info("Société activée.");
				self.activate.current.handleUpdateContent("<p>La société a été activée avec succès.</p>");
				self.activate.current.handleUpdateFooter(null);
				self.activate.current.handleUpdateCloseTxt("Fermer");
				instance.interceptors.request.clear();

				self.handleUpdateList(response.data, "update")
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	handleGenerate = () => {
		const { element } = this.state;

		let self = this;
		let instance = axios.create();
		instance.interceptors.request.use((config) => {
			self.generate.current.handleUpdateContent(<LoaderTxt text="En cours de génération" />);
			self.generate.current.handleUpdateFooter(null);
			self.generate.current.handleUpdateCloseTxt("Fermer");
			return config;
		}, function (error) {
			modalGenerationDefault(self);
			return Promise.reject(error);
		});
		instance({ method: "PUT", url: Routing.generate(URL_GENERATE_ELEMENT, { 'id': element.id }), data: {} })
			.then(function (response) {
				toastr.info("Société activée.");
				self.generate.current.handleUpdateContent("<p>La société a été générée avec succès.</p>");
				self.generate.current.handleUpdateFooter(null);
				self.generate.current.handleUpdateCloseTxt("Fermer");
				instance.interceptors.request.clear();

				self.handleUpdateList(response.data, "update")
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
		;
	}

	render () {
		const { highlight } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage, settings, nbSorter } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2">
                        <Search onSearch={this.handleSearch} placeholder="Rechercher par nom ou code.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage} sorters={sorters}
										 onClick={this.handlePaginationClick} nbSorter={nbSorter}
										 onPerPage={this.handlePerPage} onSorter={this.handleSorter} />

					<SocietiesList data={currentData} highlight={parseInt(highlight)} settings={settings} onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					<ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
								 title="Supprimer cette société" msgSuccess="Société supprimée"
								 onUpdateList={this.handleUpdateList}>
						Etes-vous sûr de vouloir supprimer définitivement cette société ?
					</ModalDelete>

					<Modal ref={this.activate} identifiant="activate" maxWidth={414} title="Activer la société"
						   content={null} footer={null}
					/>

					<Modal ref={this.generate} identifiant="generate" maxWidth={414} title="Générer la société"
						   content={null} footer={null}
					/>
				</>
			}
		</>
	}
}

function modalActivationDefault (self) {
	self.activate.current.handleUpdateContent(<p>Avant de procéder à l'activation, veuillez vérifier que la base de donnée a été créé dans le CPANEL.</p>);
	self.activate.current.handleUpdateFooter(<Button onClick={self.handleActivate} type="primary">Confirmer l'activation</Button>);
	self.activate.current.handleUpdateCloseTxt("Annuler");
}

function modalGenerationDefault (self) {
	self.generate.current.handleUpdateContent(<p>
		La génération va modifier les fichiers pour prendre en compte le système de multiple base de données.
		<br /><br />
		Ensuite, vous pourrez activer la société et l'utiliser.
	</p>);
	self.generate.current.handleUpdateFooter(<Button onClick={self.handleGenerate} type="primary">Confirmer la génération</Button>);
	self.generate.current.handleUpdateCloseTxt("Annuler");
}
