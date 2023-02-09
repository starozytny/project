import React, { Component } from "react";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import { Modal } from "@commonComponents/Elements/Modal";

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

class CookiesGlobalResponse extends Component {
    constructor(props) {
        super();

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

        return <div className="cookies-choices">
            {fixed && <div onClick={onOpen}>Paramétrer</div>}
            <div onClick={() => this.handleResponse(0)} className={response === 0 ? "active" : ""}>Tout refuser</div>
            <div onClick={() => this.handleResponse(1)} className={response === 1 ? "active" : ""}>Tout accepter</div>
        </div>
    }
}

export class Cookies extends Component {
    constructor(props) {
        super();

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

    handleOpen = () => {
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

        let settings = <div className="aside-cookies-choices">
            <div className="item">
                <span className="title">Cookies nécessaire</span>
                <p>
                    Les cookies nécessaires contribuent à rendre notre site internet utilisable.
                    Par exemple, pour la navigation entre les pages, l'accès aux zones sécurisées,
                    la mémorisation de votre choix d'acceptation des cookies etc.. <br/>
                    Notre site internet ne peut pas fonctionner sans ces cookies.
                </p>
            </div>
            <div className="item">
                <span className="title">Cookies statistiques</span>
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
            <div className="item cookies-global-response cookies-global-response-2">
                <span className="title">Réponse globale</span>
                <CookiesGlobalResponse fixed={false} consent={consent} onOpen={this.handleOpen} onDisplay={this.handleDisplay}/>
            </div>
        </div>

        return <>
            {showCookie &&<>
                <div className="cookies">
                    <div className="cookies-title">
                        <div className="biscuit">
                            <img src={'/build/app/images/biscuit.svg'} alt="Cookie illustration"/>
                        </div>
                        <div className="title">Nos cookies</div>
                        <div className="content">
                            Notre site internet utilise des cookies pour vous offrir la meilleure expérience utilisateur.
                            Plus d'informations dans notre <a href={Routing.generate("app_politique")}>politique de confidentialité</a>
                        </div>
                    </div>
                    <CookiesGlobalResponse fixed={true} consent={consent} onOpen={this.handleOpen} onDisplay={this.handleDisplay}/>
                </div>
            </>}
            <Modal ref={this.modal} identifiant="cookies-modal" maxWidth={768} margin={2} title="Paramétrer nos cookies"
                   content={settings} footer={null} />
        </>
    }
}
