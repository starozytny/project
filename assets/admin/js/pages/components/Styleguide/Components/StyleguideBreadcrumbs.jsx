import React from "react";

export function StyleguideBreadcrumbs ()
{
   return <div className="styleguide-content-col">
       <section className="styleguide-section">
           <div className="styleguide-section-title">Breadcrumbs</div>
           <div className="styleguide-section-content">
               <div className="breadcrumb">
                   <div className="breadcrumb-items">
                       <a href="#" className="breadcrumb-item">
                           <span className="icon-home"></span>
                           <span>Accueil</span>
                       </a>
                       <span className="breadcrumb-separator"></span>
                       <a href="#" className="breadcrumb-item active">
                           <span className="icon-book-1"></span>
                           <span>Styleguide</span>
                       </a>
                   </div>
               </div>
           </div>
       </section>
   </div>
}
