import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';

import axios from "axios";

import Formulaire from "@commonFunctions/formulaire";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Button, ButtonIcon } from "@commonComponents/Elements/Button";
import { Modal } from "@commonComponents/Elements/Modal";
import {LoaderTxt} from "@commonComponents/Elements/Loader";

const URL_INDEX_ELEMENTS  = "admin_help_faq_index";

const URL_CREATE_CATEGORY = "admin_help_faq_categories_create";
const URL_UPDATE_CATEGORY = "admin_help_faq_categories_update";
const URL_DELETE_CATEGORY = "api_help_faq_categories_delete";

const URL_CREATE_QUESTION = "admin_help_faq_questions_create";

export function FaqList ({ role, categories, questions, defaultCategory })
{
    const [category, setCategory] = useState(defaultCategory);
    const [question, setQuestion] = useState(null);

    const refDelete = useRef(null);

    let handleModal = (identifiant, id) => {
        switch (identifiant){
            case "delete-category":
                refDelete.current.handleClick();
                refDelete.current.handleUpdateFooter(<Button type="danger"
                    onClick={() => handleDelete(refDelete, URL_DELETE_CATEGORY, id)} >
                        Confirmer la suppression
                    </Button>);
                break;
            default:break;
        }
    }

    let handleDelete = (ref, routeName, id) => {
        let self = this;
        let instance = axios.create();
        instance.interceptors.request.use((config) => {
            ref.current.handleUpdateFooter(<Button type="danger" icon="chart-3" isLoader={true}>Confirmer la suppression</Button>);return config;
        }, function(error) { return Promise.reject(error); });
        instance({ method: "DELETE", url: Routing.generate(routeName, {'id': id}), data: {} })
            .then(function (response) { location.href = Routing.generate(URL_INDEX_ELEMENTS); })
            .catch(function (error) { Formulaire.displayErrors(self, error); })
        ;
    }

    return <div className="help-content">
        <div className="help-line-1">
            <div className="col-1">
                <div className="help-categories">
                    {role === "admin" && <Button icon="add" type="primary" element="a"
                                                 onClick={Routing.generate(URL_CREATE_CATEGORY)}>
                        Ajouter une catégorie
                    </Button>}
                    {categories.map((elem, index) => {
                        return <div className={"item" + (elem.id === category ? " active" : "")} key={index}
                                    onClick={() => setCategory(elem.id)} >
                            <span className={"icon-" + elem.icon} />
                            <span>{elem.name}</span>
                        </div>
                    })}
                </div>
            </div>
            <div className="col-2">
                <div className="questions">
                    {category
                        ? (categories.map((elem, index) => {
                            if(elem.id === category){
                                return <div className="questions-header" key={index}>
                                    <div className="icon">
                                        <span className={"icon-" + elem.icon} />
                                    </div>
                                    <div className="title">
                                        <div className="name">{elem.name}</div>
                                        <div className="sub">{elem.subtitle}</div>
                                    </div>
                                    <div className="actions">
                                        <ButtonIcon icon="pencil" element="a" onClick={Routing.generate(URL_UPDATE_CATEGORY, {'id': elem.id})}>Modifier</ButtonIcon>
                                        <ButtonIcon icon="trash" onClick={() => handleModal('delete-category', elem.id)}>Supprimer</ButtonIcon>
                                    </div>
                                </div>
                            }
                        }))
                        : <div className="questions-header">
                            <div className="icon">
                                <span className="icon-question" />
                            </div>
                            <div className="title">
                                <div className="name">Sélectionnez une catégorie</div>
                                <div className="sub">Cliquez sur la catégorie souhaitée.</div>
                            </div>
                        </div>
                    }

                    <div className="questions-body">
                        {(role === "admin" && category) && <Button icon="add" type="primary" element="a"
                                                     onClick={Routing.generate(URL_CREATE_QUESTION, {'category': category})}>
                            Ajouter une question-réponse
                        </Button>}
                        {questions.map((elem, index) => {
                            if(elem.category.id === category){
                                return <div className={"question" + (elem.id === question ? " active" : "")} key={index}>
                                    <div className="question-header" onClick={() => setQuestion(elem.id === question ? null : elem.id)}>
                                        <div className="name">{elem.name}</div>
                                        <div className="chevron"><span className="icon-down-chevron"></span></div>
                                    </div>
                                    <div className="question-body">
                                        <div dangerouslySetInnerHTML={{ __html: elem.content }} />
                                    </div>
                                </div>
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>

        <Modal ref={refDelete} identifiant="delete-category" maxWidth={414} title="Supprimer la catégorie"
               content={<p>Les questions seront aussi supprimées.</p>} footer={null} />
    </div>
}

FaqList.propTypes = {
    role: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    defaultCategory: PropTypes.number,
}
