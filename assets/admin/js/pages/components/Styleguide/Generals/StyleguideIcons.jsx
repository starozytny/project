import React, { useState, useEffect } from "react";
import toastr from "toastr";
import {ButtonIcon} from "@commonComponents/Elements/Button";
import {LoaderElements} from "@commonComponents/Elements/Loader";

export function StyleguideIcons ()
{

    const [icons, setIcons] = useState([])
    const [copy, setCopy] = useState(null);

    if(icons.length === 0){
        fetch(window.location.origin + '/selection.json')
            .then((response) => response.json())
            .then((json) => {
                let data = [];
                json.icons.forEach(icon => { data.push(icon.properties.name); })
                setIcons(data);
            });
    }

    useEffect(() => {
        if(copy){
            toastr.info(copy, "Copié dans le presse papier")
            navigator.clipboard.writeText(copy+"").then(r => setCopy(null));
        }
    });

    return <div className="styleguide-content-col">
        <section className="styleguide-section">
            <div className="styleguide-section-title">Icons</div>
            <div className="styleguide-section-content">
                <div className="styleguide-icons">
                    {icons.length === 0
                        ? <LoaderElements />
                        : icons.map((elem, index) => {
                            return <ButtonIcon icon={elem} outline={true} key={index} tooltipWidth={120}
                                               onClick={() => setCopy(`icon-${elem}`)}>
                                {elem}
                            </ButtonIcon>
                        })
                    }
                </div>
            </div>
        </section>
    </div>
}
