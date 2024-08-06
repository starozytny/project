import React from "react";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sanitaze from "@commonFunctions/sanitaze";

import { Badge } from "@tailwindComponents/Elements/Badge";

const URL_READ_PAGE = "app_ad";

export function AdsItem ({ elem }) {

    let typeA = elem.isLocation ? "locations" : "ventes";
    let typeB = elem.typeBienString.toLowerCase();

    let handleReadPage = () => { location.href = Routing.generate(URL_READ_PAGE, {
        typeA: typeA,
        typeB: typeB.replaceAll('/', '-'),
        zipcode: elem.localisation.zipcode,
        city: elem.localisation.city,
        ref: elem.reference,
        slug: elem.slug,
    }) }

    return <div className="group cursor-pointer bg-white px-4 py-6 shadow rounded w-full sm:w-[calc(100%-3rem)] transition-colors hover:bg-color0"
                onClick={handleReadPage}
    >
        <div className="relative bg-white transform sm:-translate-x-8 rounded max-h-64 overflow-hidden shadow">
            <div className="absolute top-2 left-2 bg-color0/5 text-color1/80 h-6 w-6 rounded-full flex items-center justify-center text-sm">
                {elem.photos.length}
            </div>
            {elem.mainPhotoFile !== "" && elem.mainPhotoFile !== "/placeholders/placeholder.jpg"
                ? <img src={elem.mainPhotoFile} alt="photo bien" className="h-full w-full max-h-64 object-contain rounded" />
                : <img src="/build/app/images/colombe.svg" alt="photo bien" className="h-full w-full max-h-64 object-contain rounded" />
            }
        </div>
        <div className="mt-4">
            <div className="flex flex-wrap gap-2">
                <Badge type={elem.isLocation ? "yellow" : "green"}>{elem.isLocation ? "Location" : "Vente"}</Badge>
                <Badge type="gray">{elem.typeBienString}</Badge>
            </div>
            <div className="mt-2">
                <h2 className="font-medium">{elem.libelle}</h2>
                <div>{elem.localisation.zipcode} {elem.localisation.city}</div>
                <div className="text-base font-bold text-color1 mt-2 transition-colors group-hover:text-slate-50">
                    {Sanitaze.toFormatCurrency(elem.financial.publishHt ? elem.financial.priceHt : elem.financial.price)} {elem.isLocation ? (elem.financial.publishHt ? "" : "CC") + " / mois" : ""}
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-color0 text-sm transition-colors group-hover:text-gray-900">
                    {elem.area.habitable
                        ? <div>{elem.area.habitable}m²</div>
                        : null
                    }
                    {elem.number.piece
                        ? <div>{elem.number.piece}p</div>
                        : null
                    }
                    {elem.feature.isMeuble !== 99
                        ? (elem.feature.isMeuble === 1 ? "Meublé" : "Non meublé")
                        : null
                    }
                </div>
            </div>
        </div>
    </div>
}
