import React, { useState } from "react";

import { Button } from "@commonComponents/Elements/Button";

import { StyleguideList } from "@adminPages/Styleguide/StyleguideList";

import { StyleguideAlerts } from "@adminPages/Styleguide/Components/StyleguideAlerts";
import { StyleguideColors } from "@adminPages/Styleguide/Generals/StyleguideColors";

export function Styleguide () {
    const [context, setContext] = useState("gene-colors");

    let content;
    switch (context){
        case "gene-colors":
            content = <StyleguideColors />
            break;
        case "comp-alerts":
            content = <StyleguideAlerts />
            break;
        default:
            content = <StyleguideList onChangeContext={setContext} />
            break;
    }

    return <>
        {context !== "list" && <div className="page-toolbar">
            <Button icon="left-arrow" outline={true} type="default" onClick={() => setContext("list")}>Retour</Button>
        </div>}
        <div className="styleguide">{content}</div>
    </>
}
