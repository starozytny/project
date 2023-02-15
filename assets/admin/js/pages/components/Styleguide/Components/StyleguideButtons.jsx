import React from "react";

import { Button, ButtonIcon, TxtButton } from "@commonComponents/Elements/Button";

export function StyleguideButtons ()
{
   return <div className="styleguide-content-col">
       <section className="styleguide-section">
           <div className="styleguide-section-title">Basic</div>
           <div className="styleguide-section-content">
               <div className="styleguide-buttons-line">
                   <Button>Default</Button>
                   <Button type="primary">Primary</Button>
                   <Button type="warning">Warning</Button>
                   <Button type="danger">Danger</Button>
                   <Button type="success">Success</Button>
                   <Button type="grey3">Grey3</Button>
                   <Button type="grey4">Grey4</Button>
               </div>
               <div className="styleguide-buttons-line">
                   <Button icon="star">Default</Button>
                   <Button icon="star" />
               </div>
               <div className="styleguide-buttons-line">
                   <Button icon="chart-3" isLoader={true}>Default</Button>
                   <Button icon="chart-3" isLoader={true} loaderWithText={true}>Default</Button>
                   <Button icon="chart-3" isLoader={true} />
               </div>
           </div>
       </section>
       <section className="styleguide-section">
           <div className="styleguide-section-title">Basic outline</div>
           <div className="styleguide-section-content">
               <div className="styleguide-buttons-line">
                   <Button outline={true}>Default</Button>
                   <Button outline={true} type="primary">Primary</Button>
                   <Button outline={true} type="warning">Warning</Button>
                   <Button outline={true} type="danger">Danger</Button>
                   <Button outline={true} type="success">Success</Button>
                   <Button outline={true} type="grey3">Grey3</Button>
                   <Button outline={true} type="grey4">Grey4</Button>
               </div>
               <div className="styleguide-buttons-line">
                   <Button outline={true} icon="star">Default</Button>
                   <Button outline={true} icon="star" />
               </div>
               <div className="styleguide-buttons-line">
                   <Button outline={true} icon="chart-3" isLoader={true}>Default</Button>
                   <Button outline={true} icon="chart-3" isLoader={true} loaderWithText={true}>Default</Button>
                   <Button outline={true} icon="chart-3" isLoader={true} />
               </div>
           </div>
       </section>
       <section className="styleguide-section">
           <div className="styleguide-section-title">Text</div>
           <div className="styleguide-section-content">
               <div className="styleguide-buttons-line">
                   <TxtButton >Default</TxtButton>
                   <TxtButton type="primary">Primary</TxtButton>
                   <TxtButton type="warning">Warning</TxtButton>
                   <TxtButton type="danger">Danger</TxtButton>
                   <TxtButton type="success">Success</TxtButton>
                   <TxtButton type="grey3">Grey3</TxtButton>
                   <TxtButton type="grey4">Grey4</TxtButton>
               </div>
               <div className="styleguide-buttons-line">
                   <TxtButton icon="star">Default</TxtButton>
                   <TxtButton icon="star" />
               </div>
               <div className="styleguide-buttons-line">
                   <TxtButton icon="chart-3" isLoader={true}>Default</TxtButton>
                   <TxtButton icon="chart-3" isLoader={true} loaderWithText={true}>Default</TxtButton>
                   <TxtButton icon="chart-3" isLoader={true} />
               </div>
           </div>
       </section>

       <section className="styleguide-section">
           <div className="styleguide-section-title">Icons</div>
           <div className="styleguide-section-content">
               <div className="styleguide-buttons-line">
                   <ButtonIcon icon="home">Default</ButtonIcon>
                   <ButtonIcon icon="question" type="primary">Primary</ButtonIcon>
                   <ButtonIcon icon="warning" type="warning">Warning</ButtonIcon>
                   <ButtonIcon icon="error" type="danger">Danger</ButtonIcon>
                   <ButtonIcon icon="check1" type="success">Success</ButtonIcon>
                   <ButtonIcon icon="star" type="grey3">Grey3</ButtonIcon>
                   <ButtonIcon icon="like" type="grey4">Grey4</ButtonIcon>
               </div>
               <div className="styleguide-buttons-line">
                   <ButtonIcon icon="star">Default</ButtonIcon>
                   <ButtonIcon icon="star" text="Default" />
                   <ButtonIcon icon="star" />
               </div>
               <div className="styleguide-buttons-line">
                   <ButtonIcon icon="chart-3" isLoader={true}>Default</ButtonIcon>
                   <ButtonIcon icon="chart-3" isLoader={true} />
               </div>
           </div>
       </section>

       <section className="styleguide-section">
           <div className="styleguide-section-title">Icons outline</div>
           <div className="styleguide-section-content">
               <div className="styleguide-buttons-line">
                   <ButtonIcon outline={true} icon="home">Default</ButtonIcon>
                   <ButtonIcon outline={true} icon="question" type="primary">Primary</ButtonIcon>
                   <ButtonIcon outline={true} icon="warning" type="warning">Warning</ButtonIcon>
                   <ButtonIcon outline={true} icon="error" type="danger">Danger</ButtonIcon>
                   <ButtonIcon outline={true} icon="check1" type="success">Success</ButtonIcon>
                   <ButtonIcon outline={true} icon="star" type="grey3">Grey3</ButtonIcon>
                   <ButtonIcon outline={true} icon="like" type="grey4">Grey4</ButtonIcon>
               </div>
               <div className="styleguide-buttons-line">
                   <ButtonIcon outline={true} icon="star">Default</ButtonIcon>
                   <ButtonIcon outline={true} icon="star" text="Default" />
                   <ButtonIcon outline={true} icon="star" />
               </div>
               <div className="styleguide-buttons-line">
                   <ButtonIcon outline={true} icon="chart-3" isLoader={true}>Default</ButtonIcon>
                   <ButtonIcon outline={true} icon="chart-3" isLoader={true} />
               </div>
           </div>
       </section>
   </div>
}
