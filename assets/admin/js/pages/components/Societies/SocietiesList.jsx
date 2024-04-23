import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { SocietiesItem } from "@adminPages/Societies/SocietiesItem";

export function SocietiesList ({ data, highlight, settings, onModal }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-societies">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Société</div>
                            <div className="col-2">Manager</div>
                            <div className="col-3">Activation</div>
                            <div className="col-4 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <SocietiesItem key={elem.id} elem={elem} highlight={highlight} settings={settings} onModal={onModal} />;
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

SocietiesList.propTypes = {
    data: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired,
    onModal: PropTypes.func.isRequired,
    highlight: PropTypes.number,
}
