import React, { useState } from "react";

import axios   from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { ButtonIcon } from "@commonComponents/Elements/Button";

const URL_EXPORT_ELEMENTS = "admin_users_export";

export function UserExport () {

    let [loadData, setLoadData] = useState(false)
    let [icon, setIcon] = useState("download")

    let handleDownload = (e) => {
        e.preventDefault();
        let self = this;

        if(!loadData){
            setLoadData(true);
            setIcon("chart-3");

            axios({ method: "GET", url: Routing.generate(URL_EXPORT_ELEMENTS, {'format': 'excel'}), data: {} })
                .then(function (response){
                    const link = document.createElement('a');
                    link.href = response.data.url;
                    link.setAttribute('download', 'utilisateurs.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    setLoadData(false);
                    setIcon("download");
                })
                .catch(function (error) { Formulaire.displayErrors(self, error); })
            ;
        }
    }

    return <ButtonIcon icon={icon} type="default" tooltipWidth={128} onClick={handleDownload}>
        Exporter les données
    </ButtonIcon>
}
