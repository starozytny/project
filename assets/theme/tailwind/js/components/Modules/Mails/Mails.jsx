import React, { Component } from "react";

import axios from "axios";
import toastr from "toastr";
import parse from "html-react-parser";
import Swal from "sweetalert2";
import SwalOptions from "@commonFunctions/swalOptions";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment/moment";
import "moment/locale/fr";

import Sort from "@commonFunctions/sort";
import Sanitaze from "@commonFunctions/sanitaze";
import Formulaire from "@commonFunctions/formulaire";

import { Alert } from "@tailwindComponents/Elements/Alert";
import { Badge } from "@tailwindComponents/Elements/Badge";
import { Button, ButtonIcon } from "@tailwindComponents/Elements/Button";
import { MailFormulaire } from "@tailwindComponents/Modules/Mails/MailForm";


const SORTER = Sort.compareCreatedAtInverse;

const URL_TRASH_ELEMENT = "intern_api_mails_trash";
const URL_RESTORE_ELEMENT = "intern_api_mails_restore";
const URL_DELETE_ELEMENT = "intern_api_mails_delete";
const URL_TRASH_GROUP = "intern_api_mails_trash_group";
const URL_RESTORE_GROUP = "intern_api_mails_restore_group";
const URL_DELETE_GROUP = "intern_api_mails_delete_group";

const STATUS_INBOX = 0;
const STATUS_DRAFT = 1;
const STATUS_SENT = 2;
const STATUS_TRASH = 3;
const STATUS_ARCHIVED = 4;

function updateStatus (self, method, url, element, context, messageSuccess) {
	axios({ method: method, url: Routing.generate(url, { 'id': element.id }), data: {} })
		.then(function (response) {
			toastr.info(messageSuccess);
			self.handleUpdateList(context !== "delete" ? response.data : element, context, element.status);
		})
		.catch(function (error) {
			Formulaire.displayErrors(self, error);
		})
	;
}

function updateStatusGroup (self, method, url, selects) {
	Formulaire.loader(true);
	axios({ method: method, url: Routing.generate(url), data: selects })
		.then(function (response) {
			location.reload();
		})
		.catch(function (error) {
			Formulaire.loader(false);
			Formulaire.displayErrors(self, error);
		})
	;
}

export class Mails extends Component {
	constructor (props) {
		super(props);

		this.state = {
			context: "sent",
			element: props.sent ? JSON.parse(props.sent)[0] : null,
			users: props.users ? JSON.parse(props.users) : [],
			sent: props.sent ? JSON.parse(props.sent) : [],
			trash: props.trash ? JSON.parse(props.trash) : [],
			draft: props.draft ? JSON.parse(props.draft) : [],
			selection: false,
			selects: []
		}
	}

	handleChangeContext = (context, element = null) => {
		this.setState({ context: context, element: element, handleDelete: [], selection: false })
	}

	handleUpdateList = (element, context, status = null) => {
		const { sent, trash, draft } = this.state;

		let nSent = sent;
		let nDraft = draft;
		let nTrash = trash;

		switch (context) {
			case "draft":
				let tmp = [], find = false;
				nDraft.forEach(el => {
					if (el.id === element.id) {
						el = element;
						find = true;
					}
					tmp.push(el);
				})

				if (!find) {
					tmp.push(element)
				}
				nDraft = tmp;
				break;
			case "delete":
				nTrash = trash.filter(el => el.id !== element.id);
				break;
			case "restore":
				switch (element.statusOrigin) {
					case STATUS_SENT:
						nSent.push(element);
						break;
					case STATUS_DRAFT:
						nDraft.push(element);
						break;
					default:
						break;
				}
				nTrash = trash.filter(el => el.id !== element.id);
				break;
			case "trash":
				switch (status) {
					case STATUS_SENT:
						nSent = sent.filter(el => el.id !== element.id);
						break;
					case STATUS_DRAFT:
						nDraft = draft.filter(el => el.id !== element.id);
						break;
					default:
						break;
				}
				nTrash.push(element);
				break;
			default:
				break;
		}

		nSent.sort(SORTER)
		nTrash.sort(SORTER)
		nDraft.sort(SORTER)
		this.setState({ sent: nSent, trash: nTrash, draft: nDraft })
	}

	handleSelectMail = (element) => {
		this.setState({ element })
	}

	handleTrash = (element, isMultiple = false) => {
		const { selects } = this.state;

		if (!isMultiple) {
			updateStatus(this, "PUT", URL_TRASH_ELEMENT, element, "trash", "Message mis à la corbeille.")
		} else {
			updateStatusGroup(this, "PUT", URL_TRASH_GROUP, selects)
		}
	}

	handleRestore = (element, isMultiple = false) => {
		const { selects } = this.state;

		if (!isMultiple) {
			updateStatus(this, "PUT", URL_RESTORE_ELEMENT, element, "restore", "Message restauré.")
		} else {
			updateStatusGroup(this, "PUT", URL_RESTORE_GROUP, selects)
		}
	}

	handleDelete = (element, isMultiple = false) => {
		const { selects } = this.state;

		Swal.fire(SwalOptions.options("Etes-vous sur de vouloir supprimer " + (!isMultiple ? "ce message" : "ces messages") + " ?", "Suppression définitive."))
			.then((result) => {
				if (result.isConfirmed) {
					if (!isMultiple) {
						updateStatus(this, "DELETE", URL_DELETE_ELEMENT, element, "delete", "Message supprimé définitivement.")
					} else {
						updateStatusGroup(this, "DELETE", URL_DELETE_GROUP, selects)
					}
				}
			})
		;
	}

	handleSelection = () => {
		this.setState({ selection: !this.state.selection, selects: [], element: null })
	}

	handleSelect = (element) => {
		const { selects } = this.state;

		let nSelects = selects;
		if (selects.includes(element.id)) {
			nSelects = selects.filter(el => el !== element.id);
		} else {
			nSelects.push(element.id)
		}

		this.setState({ selects: nSelects })
	}

	render () {
		const { userEmail, displayBiens, biens } = this.props;
		const { context, users, sent, trash, draft, element, selection, selects } = this.state;

		let menu = [
			{ context: 'sent', icon: "email-tracking", label: "Envoyés", total: sent.length, data: sent },
			{ context: 'draft', icon: "pencil", label: "Brouillon", total: draft.length, data: draft },
			{ context: 'trash', icon: "trash", label: "Corbeille", total: trash.length, data: trash },
		];

		let data = [];
		let menuActive = null;
		let menuItems = menu.map((item, index) => {
			let active = false;
			if (item.context === context) {
				menuActive = item;
				active = true;
				data = item.data;
			}

			return <div className={`cursor-pointer flex justify-between font-medium ${active ? "text-blue-700" : "text-gray-700 hover:text-gray-900"}`}
						key={index} onClick={() => this.handleChangeContext(item.context)}>
				<div className="flex items-center gap-2">
					<span className={`icon-${item.icon}`} />
					<span className="">{item.label}</span>
				</div>
				<div className={`flex items-center justify-center rounded text-xs px-1 min-w-8 h-5 ${active ? "bg-blue-200" : "bg-gray-100"}`}>
					{item.total}
				</div>
			</div>
		})

		return <div className="min-h-screen bg-white rounded-md shadow grid gap-4 xl:grid-cols-4 xl:gap-0 2xl:grid-cols-6">
			<div className="p-4 pb-0 xl:border-r">
                <div className="font-semibold mb-2 sm:mb-6 text-sm leading-5">Cette boite ne récupère pas les réponses.</div>
                <Button type="blue" iconLeft="email-edit" width="w-full"
                        onClick={() => this.handleChangeContext("create")}>
                    Nouveau message
                </Button>
				<div className="flex flex-col gap-2 mt-4 sm:gap-4 sm:mt-6">
                    {menuItems}
				</div>
			</div>
			{context !== "create"
                ? <>
                    <div className="border-t xl:border-t-0 xl:border-r xl:w-full 2xl:col-span-2">
                        <div className="p-4 flex items-center gap-2 text-lg font-semibold bg-slate-50">
                            <span className={`icon-${menuActive.icon}`} />
                            <span>{menuActive.label}</span>
                        </div>
                        <div className="px-4 border-y py-2">
                            <div className="cursor-pointer text-gray-700 hover:text-gray-900" onClick={this.handleSelection}>
                                <span>{selection ? "Annuler la sélection" : "Sélectionner des messages"}</span>
                            </div>
                        </div>
                        <div className="max-h-screen overflow-y-auto py-2 flex flex-col">
                            {data.length !== 0
                                ? data.map(elem => {
                                    return <ItemsMail key={elem.id} elem={elem} element={element} selection={selection} selects={selects}
                                                      onSelectMail={this.handleSelectMail} onSelect={this.handleSelect} />
                                })
                                : <div>
                                    <Alert type="gray">Aucun résultat.</Alert>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="p-4 border-t xl:col-span-2 xl:border-t-0 2xl:col-span-3" id="read">
                        {element
                            ? <ItemMail elem={element}
                                        onTrash={this.handleTrash}
                                        onRestore={this.handleRestore}
                                        onDelete={this.handleDelete}
                                        onChangeContext={this.handleChangeContext}
                            />
                            : (data.length !== 0
                                    ? (selection
                                            ? <div className="flex gap-2">
                                                {context === 'trash' ? <>
                                                    <Button type="default" iconLeft="refresh1"
                                                            onClick={() => this.handleRestore(null, true)}>
                                                        Restaurer les messages sélectionnés
                                                    </Button>
                                                    <Button type="default" iconLeft="trash"
                                                            onClick={() => this.handleDelete(null, true)}>
                                                        Supprimer les messages sélectionnés
                                                    </Button>
                                                </> : <>
                                                    <Button type="default" iconLeft="trash"
                                                            onClick={() => this.handleTrash(null, true)}>
                                                        Mettre à la corbeille les messages sélectionnés
                                                    </Button>
                                                </>}
                                            </div>
                                            : <Alert type="blue" icon="question" title="Voir le message d'un email">
                                                Clique sur un message pour voir son contenu.
                                            </Alert>
                                    )
                                    : <Alert type="gray">Aucune donnée enregistrée.</Alert>
                            )
                        }
                    </div>
                </>
                : <>
					<div className="border-t xl:col-span-3 xl:border-t-0 2xl:col-span-5 flex flex-col gap-4 w-full">
						<div className="p-4 flex items-center gap-2 text-lg font-semibold bg-slate-50">
							<span className="icon-email-edit" />
							<span>Nouveau message</span>
						</div>

						<MailFormulaire typeDefaultFrom="agency" from={userEmail} users={users} element={element}
										onUpdateList={this.handleUpdateList} havePreview={true} styleForm={1}
										mBiens={displayBiens === "1" ? JSON.parse(biens) : []} displayBiens={displayBiens}
						/>

						<div>
							<div className="p-4 flex items-center gap-2 text-lg font-semibold bg-slate-50">
								<span className="icon-vision" />
								<span>Prévisualisation</span>
							</div>

							<div id="preview" />
						</div>
					</div>
				</>
			}
		</div>
	}
}

function ItemsMail ({ elem, element, selection, selects, onSelectMail, onSelect }) {

	let selectActive = false;
	selects.forEach(select => {
		if (select === elem.id) {
			selectActive = true;
		}
	})

	let avatar = elem.expeditor.substring(0, 1).toUpperCase();
	switch (elem.statusOrigin) {
		case STATUS_DRAFT:
			avatar = <span className="icon-pencil" />
			break;
		case STATUS_SENT:
			avatar = <span className="icon-email-tracking" />
			break;
		default:
			break;
	}

	let today = new Date();
	let createdAt = moment(elem.createdAt).toDate();

	let createdAtLT;
	if (createdAt.getFullYear() < today.getFullYear()) {
		createdAtLT = createdAt.getFullYear();
	} else if (createdAt.getMonth() < today.getMonth()) {
		createdAtLT = Sanitaze.toFormatMDate(elem.createdAt, 'MMM');
	} else {
		createdAtLT = Sanitaze.toFormatMDate(elem.createdAt, 'LT');
	}

    let bgAvatar = elem.status === 2
        ? "bg-blue-200 text-blue-700"
        : (elem.status === 3
            ? "bg-red-100 text-red-500"
            : "bg-gray-200 text-gray-900"
        );

    return <div className={"cursor-pointer px-4 py-2 flex justify-between xl:flex-col gap-1 " + (element && element.id === elem.id ? "bg-blue-50" : "hover:bg-gray-100")}
                key={elem.id} onClick={selection ? () => onSelect(elem) : () => onSelectMail(elem)}
    >
		<div className="flex gap-2">
            {selection
                ? <div className={`flex items-center justify-center w-8 h-8 min-w-8 rounded-full bg-slate-50 border ${selectActive ? "border-blue-700" : ""}`}>
                    <span className={`icon-check1 ${selectActive ? "opacity-1 text-blue-600" : "opacity-0"}`}></span>
                </div>
                : <div className={`flex items-center justify-center w-8 h-8 min-w-8 rounded-full ${bgAvatar}`}>
                    <span>{avatar}</span>
                </div>
            }
            <div className="text-ellipsis overflow-hidden">
				<div className="text-sm font-medium">
                    {elem.expeditor}
                </div>
				<div className="text-sm">{elem.subject}</div>
			</div>
		</div>
		<div className="text-xs text-gray-600 xl:text-right">
			<div>{createdAtLT}</div>
		</div>
	</div>
}

function ItemMail ({ elem, onTrash, onRestore, onDelete, onChangeContext }) {
	return <div>
        <div className="flex justify-between gap-2">
            <div className="text-gray-600 text-sm">
                {Sanitaze.toFormatMDate(elem.createdAt)}
            </div>
            <div className="flex gap-2">
                {elem.status !== STATUS_TRASH
                    ? <ButtonIcon type="default" icon="trash" onClick={() => onTrash(elem)}>Corbeille</ButtonIcon>
                    : <ButtonIcon type="default" icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                }
                {elem.status === STATUS_TRASH && <ButtonIcon type="default" icon="refresh1" onClick={() => onRestore(elem)}>Restaurer</ButtonIcon>}
                {elem.status === STATUS_DRAFT && <ButtonIcon type="default" icon="pencil" onClick={() => onChangeContext("create", elem)}>Continuer</ButtonIcon>}
            </div>
        </div>

        <div className="flex gap-4">
            <div className="flex items-center justify-center w-10 h-10 min-w-10 rounded-full bg-blue-100">
                <span>{elem.expeditor.substring(0, 1).toUpperCase()}</span>
			</div>
			<div>
				<div className="flex items-center gap-2">
					<div className="text-gray-600 text-sm">De : </div>
					<div className="font-medium">{elem.expeditor}</div>
				</div>
				<Destinators prefix="A" data={elem.destinators} />
				{elem.cc.length !== 0 ? <Destinators prefix="Cc" data={elem.cc} /> : null}
				{elem.bcc.length !== 0 ? <Destinators prefix="Cci" data={elem.bcc} /> : null}
			</div>
		</div>

		<div>
			<div className="text-right">
                <Badge type="yellow">Thème utilisé : {elem.themeString}</Badge>
			</div>
			<div className="border-y py-2 my-4">{elem.subject}</div>
			<div className="mail-message">{elem.message ? parse(elem.message) : ""}</div>
			{elem.files.length > 0
				? <div className="pt-4 mt-4 border-t flex flex-col gap-2">
					{elem.files.map((file, index) => {
						return <a className="flex items-center gap-2" key={index}
								  download={file} target="_blank"
								  href={Routing.generate('user_utilities_mails_attachement', { 'filename': file })}
						>
							<span className="icon-file inline-block" />
							<span className="inline-block font-medium text-gray-700 hover:text-gray-900">Pièce jointe {index + 1}</span>
						</a>
					})}
				</div>
				: null
			}

		</div>

	</div>
}

function Destinators ({ prefix, data }) {
	return <div className="flex items-s gap-2">
		<div className="text-gray-600 text-sm min-w-6">{prefix} :</div>
		<div className="flex flex-wrap gap-2">
			{data.map((dest, index) => {
				return <span className="bg-blue-50 text-sm py-1 px-2" key={index}>{dest.value}</span>
			})}
		</div>
	</div>
}
