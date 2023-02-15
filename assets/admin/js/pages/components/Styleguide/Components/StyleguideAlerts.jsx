import React from "react";

import { Alert } from "@commonComponents/Elements/Alert";

export function StyleguideAlerts ()
{
    let data = "Lorem ipsum";

   return <div className="styleguide-content-col">
       <section className="styleguide-section">
           <div className="styleguide-section-title">Basic</div>
           <div className="styleguide-section-content">
               <Alert type="info">{data}</Alert>
               <Alert type="warning">{data}</Alert>
               <Alert type="danger">{data}</Alert>
               <Alert type="success">{data}</Alert>
               <Alert type="grey4">{data}</Alert>
           </div>
       </section>

       <section className="styleguide-section">
           <div className="styleguide-section-title">Options</div>
           <div className="styleguide-section-content">
               <Alert type="info" icon="star">{data}</Alert>
               <Alert type="info" withIcon={false}>{data}</Alert>
               <Alert type="info" withIcon={false} canClose={true}>{data}</Alert>
               <Alert type="info" title="Title">{data}</Alert>
               <Alert type="info" title="Title" withIcon={false}>{data}</Alert>
           </div>
       </section>
   </div>
}
