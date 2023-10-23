import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import parse from 'html-react-parser';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import Sanitaze from '@commonFunctions/sanitaze';

import { Button, ButtonIcon } from "@commonComponents/Elements/Button";
import { Modal } from "@commonComponents/Elements/Modal";

import { MailFormulaire } from "@commonComponents/Modules/Mail/MailForm";

const URL_GET_ATTACHMENT = "intern_api_mails_attachment";

export function Mails ({ totalMails, donnees, from, fromName }) {

    const formRef = useRef(null);
    const [context, setContext] = useState('sent');
    const [element, setElement] = useState(null);

    let handleFormMail = (element) => {
        formRef.current.handleClick();
        setElement(element);
    }

    let menu = [
        { context: 'sent',  icon: "email-tracking", label: "Envoyés",   total: totalMails },
        { context: 'trash', icon: "trash",          label: "Corbeille", total: 0 },
    ];

    let menuActive = null;
    let menuItems = menu.map((item, index) => {
        let active = false;
        if(item.context === context){
            menuActive = item;
            active = true;
        }

        return <div className={"item " + active} key={index} onClick={() => setContext(item.context)}>
            <div className="name">
                <span className={"icon-" + item.icon} />
                <span>{item.label}</span>
            </div>

            <div className="total">
                <span>{item.total}</span>
            </div>
        </div>
    })

    let data = JSON.parse(donnees);

    return <div className="boite-mail">
        <div className="col-1">
            <div className="mail-add">
                <Button icon="email-edit" type="primary" onClick={() => handleFormMail(null)}>Nouveau message</Button>
            </div>
            <div className="mail-menu">
                <div className="items">{menuItems}</div>
            </div>
        </div>
        <div className="col-2">
            <div className="mail-list">
                <div className="title">
                    <span className={"icon-" + menuActive.icon} />
                    <span>{menuActive.label}</span>
                </div>
                <div className="actions">
                    <div>
                        <span>Sélectionner des message</span>
                    </div>
                </div>

                <div className="items">
                    {data.length !== 0
                        ? data.map(elem => {
                            return <div className="item" key={elem.id}
                                        onClick={() => setElement(elem)}
                            >
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
                        })
                        : <div className="item">Aucun résultat.</div>
                    }
                </div>
            </div>
        </div>

        <div className="col-3" id="read">
            <div className="mail-item">
                {element
                    ? <div className="item">
                        <div className="actions">
                            <div className="col-1">
                                <div className="createdAt">{Sanitaze.toDateFormat(element.createdAt)}</div>
                            </div>
                            <div className="col-2">
                                <ButtonIcon icon="trash">Corbeille</ButtonIcon>
                            </div>
                        </div>

                        <div className="item-header">
                            <div className="avatar-letter">
                                <span>AA</span>
                            </div>
                            <div className="content">
                                <div className="name">
                                    <div><span>De</span> <span>:</span></div>
                                    <div className="items"><span>{element.expeditor}</span></div>
                                </div>
                                <Destinators prefix="A" data={element.destinators} />
                                {element.cc.length !== 0 ? <Destinators prefix="Cc" data={element.cc} /> : null}
                                {element.bcc.length !== 0 ? <Destinators prefix="Cci" data={element.bcc} /> : null}
                            </div>
                        </div>

                        <div className="item-body">
                            <div className="badges">
                                <div className="badge">Thème : {element.themeString}</div>
                            </div>
                            <div className="subject">{element.subject}</div>
                            <div className="message">{parse(element.message)}</div>
                            <div className="files">
                                {element.files.map((file, index) => {
                                    console.log(file)
                                    return <a className="file" key={index}
                                              download={file} target="_blank"
                                              href={Routing.generate(URL_GET_ATTACHMENT, {'filename': file})}
                                    >
                                        <span className="icon">
                                            <span className="icon-file" />
                                        </span>
                                        <span className="infos">
                                            <span className="name">PJ {index + 1}</span>
                                        </span>
                                    </a>
                                })}
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        </div>
        {createPortal(
            <Modal ref={formRef} identifiant="mail" maxWidth={768} margin={2} title="Envoyer un mail" isForm={true}
                   content={<MailFormulaire identifiant="mail" element={element} tos={[]} from={from} fromName={fromName} />}
                   footer={null} />,
            document.body)
        }
    </div>
}


function Destinators ({ prefix, data }) {
    return <div className="destinators">
        <div><span>{prefix}</span> <span>:</span></div>
        <div className="items">
            {data.map((dest, index) => {
                return <span key={index}>{dest}</span>
            })}
        </div>
    </div>
}
