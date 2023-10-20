import React from 'react';

import parse from 'html-react-parser';
import Sanitaze from '@commonFunctions/sanitaze';

import { Button } from "@commonComponents/Elements/Button";

export function Mails ({ data }) {
    console.log(data)
    return <div className="boite-mail">
        <div className="col-1">
            <div className="mail-add">
                <Button icon="email-edit" type="primary">Nouveau message</Button>
            </div>
            <div className="mail-menu">
                <div className="items">
                    <div className="item true">
                        <div className="name">
                            <span className="icon-email"></span>
                            <span>Test menu link 1</span>
                        </div>

                        <div className="total">
                            <span>15</span>
                        </div>
                    </div>
                    <div className="item">
                        <div className="name">
                            <span className="icon-email"></span>
                            <span>Test menu link 2</span>
                        </div>

                        <div className="total">
                            <span>15</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-2">
            <div className="mail-list">
                <div className="title">
                    <span className="icon-email"></span>
                    <span>Test menu link 1</span>
                </div>
                <div className="actions">
                    <div>
                        <span>Sélectionner des message</span>
                    </div>
                </div>

                <div className="items">
                    {data.map(elem => {
                        return <div className="item" key={elem.id}>
                            <div className="expeditor">
                                <div className="avatar-letter">
                                    <span>AA</span>
                                </div>
                                <div className="content">
                                    <div className="name">{elem.expeditor}</div>
                                    <div className="subject">{elem.subject}</div>
                                </div>
                            </div>
                            <div className="createdAt">
                                <div>{Sanitaze.toDateFormat(elem.createdAt)}</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>

        <div className="col-3" id="read">
            <div className="mail-item">

            </div>
        </div>
    </div>
}
