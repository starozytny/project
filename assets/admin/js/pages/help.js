import "../../css/pages/help.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Faq } from "@adminPages/Help/Faq";
import { CategoryFormulaire } from "@adminPages/Help/Category/CategoryForm";
import { QuestionFormulaire } from "@adminPages/Help/Question/QuestionForm";

let el = document.getElementById("help_faq_list");
if(el){
    createRoot(el).render(<Faq {...el.dataset}/>)
}

el = document.getElementById("help_faq_category_update");
if(el){
    createRoot(el).render(<CategoryFormulaire context="update" element={JSON.parse(el.dataset.obj)} />)
}

el = document.getElementById("help_faq_category_create");
if(el){
    createRoot(el).render(<CategoryFormulaire context="create" element={null} />)
}


el = document.getElementById("help_faq_question_update");
if(el){
    createRoot(el).render(<QuestionFormulaire context="update" element={JSON.parse(el.dataset.obj)} category={JSON.parse(el.dataset.category)} />)
}

el = document.getElementById("help_faq_question_create");
if(el){
    createRoot(el).render(<QuestionFormulaire context="create" element={null} category={JSON.parse(el.dataset.category)} />)
}
