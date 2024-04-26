import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { DemandesItem } from "@adminPages/Immo/Demandes/DemandesItem";

export function DemandesList ({ data, onModal }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-demandes">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Nom/Prénom</div>
                            <div className="col-2">Message</div>
                            <div className="col-3">Bien</div>
                            <div className="col-4">Lecture</div>
                            <div className="col-5 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <DemandesItem key={elem.id} elem={elem} onModal={onModal} />;
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

DemandesList.propTypes = {
    data: PropTypes.array.isRequired,
    onModal: PropTypes.func.isRequired,
}
