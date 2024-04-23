import React, { Component } from "react";
import { createPortal } from "react-dom";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import { Modal } from "@tailwindComponents/Elements/Modal";

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays, cdomain="") {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + cdomain + ";path=/";
}

export class CookiesGlobalResponse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            response: null
        }
    }

    componentDidMount = () => {
        const { consent } = this.props;

        let cookie = getCookie(consent);
        if(cookie === "true"){
            this.setState({ response: 1 })
        }else if(cookie === "false"){
            this.setState({ response: 0 })
            let iframe = document.querySelector('.matomo-iframe-display');
            if(iframe){
                iframe.classList.add('remove')
            }
        }
    }

    handleResponse = (type) => {
        const { consent, onDisplay } = this.props;

        if(type === 0) { // refusé
            setCookie(consent, false, 30);
        }else{ //accepté
            setCookie(consent, true, 30);
        }

        if(onDisplay){
            onDisplay();
        }
        this.setState({ response: type })
    }

    render () {
        const { fixed, onOpen } = this.props;
        const { response } = this.state;

        return <div className="flex gap-2 border-t">
            {fixed && <div onClick={onOpen} className="cursor-pointer hover:underline p-4">Paramétrer</div>}
            <div onClick={() => this.handleResponse(0)}
                 className={`cursor-pointer hover:underline p-4 ${response === 0 ? "text-red-700" : ""}`}>
                Tout refuser
            </div>
            <div onClick={() => this.handleResponse(1)}
                 className={`cursor-pointer hover:underline p-4 ${response === 1 ? "text-blue-700" : ""}`}>
                Tout accepter
            </div>
        </div>
    }
}

export class Cookies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCookie: true,
        }

        this.modal = React.createRef();
    }

    componentDidMount = () => {
        const { consent } = this.props;

        let cookie = getCookie(consent);
        if(cookie !== ""){
            this.setState({ showCookie: false })
        }
    }

    handleModal = () => {
        const { consent } = this.props;

        this.modal.current.handleClick();
        setCookie(consent, "settings", 30);
    }

    handleDisplay = () => {
        this.setState({ showCookie: false })
    }

    render () {
        const { consent } = this.props;
        const { showCookie } = this.state;

        return <>
            {showCookie &&<>
                <div className="bg-white border shadow-md rounded-md max-w-96 text-sm">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="mb-4">
                            <img src={'/build/app/images/biscuit.svg'} alt="Cookie illustration" className="w-12 h-12" />
                        </div>
                        <div className="font-semibold text-base mb-1">Nos cookies</div>
                        <div className="text-gray-600 text-center">
                            Notre site internet utilise des cookies pour vous offrir la meilleure expérience utilisateur.
                            Plus d'informations dans notre <a className="text-blue-700 hover:text-blue-500 hover:underline" href={Routing.generate("app_politique")}>politique de confidentialité</a>
                        </div>
                    </div>
                    <CookiesGlobalResponse fixed={true} consent={consent} onOpen={this.handleModal} onDisplay={this.handleDisplay}/>
                </div>
            </>}

            {createPortal(
                <Modal ref={this.modal} identifiant="modal-cookie" maxWidth={1024} margin={5}
                       title="Paramétrer les cookies"
                       content={<div className="flex flex-col gap-4">
                           <div>
                               <span className="text-lg font-semibold">Cookies nécessaire</span>
                               <p>
                                   Les cookies nécessaires contribuent à rendre notre site internet utilisable.
                                   Par exemple, pour la navigation entre les pages, l'accès aux zones sécurisées,
                                   la mémorisation de votre choix d'acceptation des cookies etc.. <br />
                                   Notre site internet ne peut pas fonctionner sans ces cookies.
                               </p>
                           </div>
                           <div>
                               <span className="text-lg font-semibold">Cookies statistiques</span>
                               <p>
                                   Matomo Analytics (anciennement Piwik Analytics) est une solution de mesure d'audience qui utilise des cookies.
                                   Ce site web utilise Matomo Analytics avec une configuration conforme à la réglementation sur la
                                   protection des données personnelles et aux recommandations de la CNIL (Commission Nationale de l'Informatique et des Libertés).
                                   Cette configuration permet notamment de rendre anonyme les données des
                                   visiteurs et de limiter le délai de conservation de ces données à 13 mois maximum.
                                   <br /><br />
                                   <u>_pk_id :</u> Cookie qui stocke un identifiant unique pour “reconnaître” le visiteur. Durée de vie : 13 mois.
                                   <br />
                                   <u>_pk_ses :</u> Cookie qui stocke des informations concernant la visite. Durée de vie : 30 minutes.
                                   <br /><br />

                                   Les visiteurs ne sont pas suivis d’un site Web à un autre <br />
                                   Les « empreintes numériques » changent quotidiennement pour chaque visiteur, ce qui signifie
                                   qu’aucun visiteur ne peut être suivi pendant plusieurs jours sur le même site Web,
                                   et aucun profil d’utilisateur ne peut être généré lorsque les cookies sont désactivés. <br />
                                   Les données ne sont pas utilisées à d’autres fins que l’analyse. <br />
                                   Le centre de données se situe en Europe.
                               </p>
                               <iframe className="matomo-iframe"
                                       src="https://matomo.demodirecte.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=&fontSize=&fontFamily=Poppins"
                               />
                           </div>
                           <div>
                               <div className="text-lg font-semibold mb-2">Réponse globale</div>
                               <CookiesGlobalResponse fixed={false} consent={consent} onOpen={this.handleModal} onDisplay={this.handleDisplay} />
                           </div>
                       </div>} />
                , document.body)}
        </>
    }
}
