import React from "react";

export function Faq () {
    return <div className="help-content">
        <div className="help-line-1">
            <div className="col-1">
                <div className="help-categories">
                    <div className="item">
                        <span className="icon-settings" />
                        <span>Catégorie 1</span>
                    </div>
                    <div className="item active">
                        <span className="icon-settings" />
                        <span>Catégorie 2</span>
                    </div>
                    <div className="item">
                        <span className="icon-settings" />
                        <span>Catégorie 3</span>
                    </div>
                </div>
            </div>
            <div className="col-2">
                <div className="questions">
                    <div className="questions-header">
                        <div className="icon">
                            <span className="icon-settings" />
                        </div>
                        <div className="title">
                            <div className="name">Services</div>
                            <div className="sub">Get help</div>
                        </div>
                    </div>
                    <div className="questions-body">
                        <div className="question">
                            <div className="question-header">
                                <div className="name">test</div>
                                <div className="chevron"><span className="icon-down-chevron"></span></div>
                            </div>
                            <div className="question-body">
                                <div>data</div>
                            </div>
                        </div>
                        <div className="question active">
                            <div className="question-header">
                                <div className="name">test</div>
                                <div className="chevron"><span className="icon-down-chevron"></span></div>
                            </div>
                            <div className="question-body">
                                <div>data</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
