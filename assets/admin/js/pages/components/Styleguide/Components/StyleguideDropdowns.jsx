import React from "react";

import {Button, ButtonIconDropdown} from "@commonComponents/Elements/Button";

export function StyleguideDropdowns ()
{
    let menu = [
        { data: <a>Lien 1</a> },
        { data: <a>Lien 2</a> },
        { data: <a>Lien 3</a> },
    ]

   return <div className="styleguide-content-col">
       <section className="styleguide-section">
           <div className="styleguide-section-title">Basic</div>
           <div className="styleguide-section-content">
               <div className="styleguide-buttons-line">
                   <ButtonIconDropdown items={menu} icon="more" outline={true}>Actions</ButtonIconDropdown>
                   <ButtonIconDropdown items={menu}
                                       customBtn={<Button type="primary">Actions</Button>} customTop={42} customWidth={120} />
                   <ButtonIconDropdown items={menu}
                                       customBtn={<Button type="primary" iconPosition="after" icon="down-chevron">Actions</Button>} customTop={42} />
                   <ButtonIconDropdown items={menu}
                                       customBtn="Actions" />
               </div>
           </div>
       </section>
   </div>
}
