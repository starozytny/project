import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import axios from "axios";
import parse from 'html-react-parser';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import List from "@commonFunctions/list";
import Sort from "@commonFunctions/sort";
import Sanitaze from '@commonFunctions/sanitaze';
import Formulaire from "@commonFunctions/formulaire";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button, ButtonIcon } from "@tailwindComponents/Elements/Button";

import { MailFormulaire } from "@tailwindComponents/Modules/Mails/MailForm";
import { Alert } from "@tailwindComponents/Elements/Alert";
import { Badge } from "@tailwindComponents/Elements/Badge";

const URL_INDEX_PAGE = "admin_mails_index";
const URL_GET_ATTACHMENT = "intern_api_mails_mail_attachment";
const URL_TRASH_ELEMENT = "intern_api_mails_mail_trash";
const URL_RESTORE_ELEMENT = "intern_api_mails_mail_restore";

const SORTER = Sort.compareCreatedAtInverse;

export function Mails ({ context, totalS, totalT, donnees, from, fromName }) {

	const formRef = useRef(null);
	const trashRef = useRef(null);
	const restoreRef = useRef(null);

	const [load, setLoad] = useState(false);
	const [element, setElement] = useState(null);
	const [data, setData] = useState(JSON.parse(donnees));
	const [totalSent, setTotalSent] = useState(parseInt(totalS));
	const [totalTrash, setTotalTrash] = useState(parseInt(totalT));
	const [selection, setSelection] = useState(false);
	const [selections, setSelections] = useState([]);

	let handleSelect = (elem) => {
		let find = selections.find((sel => sel === elem.id));

		if (!find) {
			setSelections([...selections, elem.id]);
		} else {
			setSelections(selections.filter(sel => sel !== elem.id))
		}
	}

	let handleModal = (identifiant, elem) => {
		let ref;
		switch (identifiant) {
			case 'formRef':
				ref = formRef;
				break;
			case 'trashRef':
				ref = trashRef;
				break;
			case 'restoreRef':
				ref = restoreRef;
				break;
			default:
				break;
		}
		if (ref) {
			ref.current.handleClick();
			setElement(elem);
		}
	}

	let handleUpdateList = (elem, context) => {
		setData(List.updateDataMuta(elem, context, data, SORTER));
	}

	let handleTrash = (elem) => {
		if (!load) {
			setLoad(true);
			trashRef.current.handleUpdateFooter(<Button onClick={null} isLoader={true} type="danger">Confirmer</Button>)

			axios({ method: "PUT", url: Routing.generate(URL_TRASH_ELEMENT, { 'id': elem.id }), data: {} })
				.then(function (response) {
					setTotalSent(totalSent - 1);
					setTotalTrash(totalTrash + 1);
					setData(List.updateData(response.data, 'delete', data, SORTER));
					setElement(null);
					trashRef.current.handleClose();
				})
				.catch(function (error) {
					Formulaire.displayErrors(null, error);
				})
				.then(function () {
					setLoad(false)
				})
			;
		}
	}

	let handleRestore = (elem) => {
		if (!load) {
			setLoad(true);
			restoreRef.current.handleUpdateFooter(<Button onClick={null} isLoader={true} type="primary">Confirmer</Button>)

			axios({ method: "PUT", url: Routing.generate(URL_RESTORE_ELEMENT, { 'id': elem.id }), data: {} })
				.then(function (response) {
					setTotalSent(totalSent + 1);
					setTotalTrash(totalTrash - 1);
					setData(List.updateData(response.data, 'delete', data, SORTER));
					setElement(null);
					restoreRef.current.handleClose();
				})
				.catch(function (error) {
					Formulaire.displayErrors(null, error);
				})
				.then(function () {
					setLoad(false)
				})
			;
		}
	}

	let menu = [
		{ context: 'envoyes', icon: "email-tracking", label: "Envoyés", total: totalSent },
		{ context: 'corbeille', icon: "trash", label: "Corbeille", total: totalTrash },
	];

	let menuActive = null;
	let menuItems = menu.map((item, index) => {
		let active = false;
		if (item.context === context) {
			menuActive = item;
			active = true;
		}

        return <div className={`cursor-pointer flex justify-between font-medium ${active ? "text-blue-700" : "text-gray-700 hover:text-gray-900"}`}
                    key={index} onClick={() => this.handleChangeContext(item.context)}>
            <div className="flex items-center gap-2">
                <span className={`icon-${item.icon}`} />
                <a href={Routing.generate(URL_INDEX_PAGE, { 'type': item.context })}>{item.label}</a>
            </div>
            <div className={`flex items-center justify-center rounded text-xs px-1 min-w-8 h-5 ${active ? "bg-blue-200" : "bg-gray-100"}`}>
                {item.total}
            </div>
        </div>
	})

	return <div className="min-h-screen bg-white rounded-md shadow grid gap-4 xl:grid-cols-4 xl:gap-0 2xl:grid-cols-6">
        <div className="p-4 pb-0 xl:border-r">
            <div className="font-semibold mb-2 sm:mb-6 text-sm leading-5">
                Les réponses ne sont pas récupérées dans cette boite.
            </div>
            <Button type="blue" iconLeft="email-edit" width="w-full"
                    onClick={() => handleModal('formRef', null)}>
                Nouveau message
            </Button>
            <div className="flex flex-col gap-2 mt-4 sm:gap-4 sm:mt-6">
                {menuItems}
            </div>
        </div>
        <div className="border-t xl:border-t-0 xl:border-r xl:w-full 2xl:col-span-2">
            <div className="p-4 flex items-center gap-2 text-lg font-semibold bg-slate-50">
                <span className={"icon-" + menuActive.icon} />
                <span>{menuActive.label}</span>
            </div>
            {/*<div className="px-4 border-y py-2">*/}
            {/*    <div className="cursor-pointer text-gray-700 hover:text-gray-900" onClick={this.handleSelection}>*/}
            {/*        <span>{selection ? "Annuler la sélection" : "Sélectionner des messages"}</span>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="max-h-screen overflow-y-auto py-2 flex flex-col">
                <ItemMail data={data} setElement={setElement}
                          selection={selection} selections={selections} onSelect={handleSelect} />
            </div>
        </div>

        <div className="p-4 border-t xl:col-span-2 xl:border-t-0 2xl:col-span-3" id="read">
            <div className="mail-item">
                {selection
                    ? <div>Actions sur les éléments sélectionnés</div>
                    : (element
                        ? <div className="item">
                            <div className="flex justify-between gap-2">
                                <div>
                                    <div className="text-gray-600 text-sm">{Sanitaze.toDateFormat(element.createdAt)}</div>
                                </div>
                                <div className="flex gap-2">
                                    {context === "corbeille"
                                        ? <ButtonIcon type="default" icon="refresh1" onClick={() => handleModal('restoreRef', element)}>Restaurer</ButtonIcon>
                                    : <ButtonIcon type="default" icon="trash" onClick={() => handleModal('trashRef', element)}>Corbeille</ButtonIcon>
                                }
                                </div>
                            </div>

                            <div className="item-header">
                                <div>
                                    <span className="icon-email-tracking"></span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 min-w-10 rounded-full bg-blue-100">
                                        <div className="text-gray-600 text-sm">De :</div>
                                        <div className="font-medium">{element.expeditor}</div>
                                    </div>
                                    <Destinators prefix="A" data={element.destinators} />
                                    {element.cc.length !== 0 ? <Destinators prefix="Cc" data={element.cc} /> : null}
                                    {element.bcc.length !== 0 ? <Destinators prefix="Cci" data={element.bcc} /> : null}
                                </div>
                            </div>

                            <div>
                                <div className="text-right">
                                    <Badge type="yellow">Thème : {elem.themeString}</Badge>
                                </div>
                                <div className="border-y py-2 my-4">{element.subject}</div>
                                <div>{parse(element.message)}</div>
                                {element.files.length > 0
                                    ? <div className="pt-4 mt-4 border-t flex flex-col gap-2">
                                        {element.files.map((file, index) => {
                                            return <a className="flex items-center gap-2" key={index}
                                                      download={file} target="_blank"
                                                      href={Routing.generate(URL_GET_ATTACHMENT, { 'filename': file })}
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
                    : <Alert type="gray">Aucun message sélectionné.</Alert>
                    )
                }
            </div>
        </div>

        {createPortal(
            <Modal ref={formRef} identifiant="mail" maxWidth={768} margin={2} title="Envoyer un mail" isForm={true}
                   content={<MailFormulaire identifiant="mail" element={element} tos={[]}
                                            from={from} fromName={fromName}
                                            onUpdateList={handleUpdateList} />}
                   footer={null} />,
            document.body)
        }
        {createPortal(
            <Modal ref={trashRef} identifiant="trash" maxWidth={414}
                   title="Déplacer dans la corbeille"
                   content="Déplacer le mail sélectionné dans la corbeille ?"
                   footer={<Button type="red" onClick={() => handleTrash(element)}>Confirmer</Button>}
                   key={element ? element.id : 0} />,
            document.body)
        }

        {createPortal(
            <Modal ref={restoreRef} identifiant="restore" maxWidth={414}
                   title="Restaurer un email"
                   content="Restaurer le mail sélectionné dans la boite d'envois ?"
                   footer={<Button type="blue" onClick={() => handleRestore(element)}>Confirmer</Button>}
                   key={element ? element.id : 0} />,
            document.body)
        }
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

function Item ({ data, setElement, selection, selections, onSelect }) {
	return (data.length !== 0
        ? data.map(elem => {
            return <div className={`cursor-pointer px-4 py-2 flex justify-between xl:flex-col gap-1 ${selections.includes(elem.id) ? "bg-blue-50" : "hover:bg-gray-100"}`}
                        key={elem.id} onClick={selection ? () => onSelect(elem) : () => setElement(elem)}
            >
                <div className="expeditor">
                    <div className="flex items-center justify-center w-8 h-8 min-w-8 rounded-full bg-blue-200 text-blue-700">
                        {selection
                            ? (selections.includes(elem.id)
                                    ? <span className="icon-check1"></span>
                                    : null
                            )
                            : <span className="icon-email-tracking"></span>
                        }
                    </div>
                    <div className="text-ellipsis overflow-hidden">
                        <div className="text-sm font-medium">{elem.expeditor}</div>
                        <div className="text-sm">{elem.subject}</div>
                    </div>
                </div>
                <div className="text-xs text-gray-600 xl:text-right">
                    <div>{Sanitaze.toDateFormat(elem.createdAt)}</div>
                </div>
            </div>
        })
        : null
	)
}

const ItemMail = React.memo(Item);
