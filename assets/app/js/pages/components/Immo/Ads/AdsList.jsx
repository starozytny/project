import React from "react";

import { Alert } from "@tailwindComponents/Elements/Alert";
import { AdsItem } from "@appPages/Immo/Ads/AdsItem";

export function AdsList ({ data }) {
    return <>
        {data.length > 0
            ? <div className="flex flex-col gap-x-4 gap-y-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-y-8">
                {data.map(elem => {
                        return <AdsItem elem={elem} key={elem.id} />
                    })
                }
            </div>
            : <Alert type="gray">Aucun résultat.</Alert>}
    </>
}
