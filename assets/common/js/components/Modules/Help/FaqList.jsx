import React, { useState } from "react";
import PropTypes from 'prop-types';

export function FaqList ({ role, categories, questions }) {

    const [category, setCategory] = useState(null);
    const [question, setQuestion] = useState(null);

    return <div className="help-content">
        <div className="help-line-1">
            <div className="col-1">
                <div className="help-categories">
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
                        {questions.map((elem, index) => {
                            if(elem.category.id === category){
                                return <div className={"question" + (elem.id === question ? " active" : "")} key={index}
                                            onClick={() => setQuestion(elem.id === question ? null : elem.id)}>
                                    <div className="question-header">
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
    </div>
}

FaqList.propTypes = {
    role: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
}
