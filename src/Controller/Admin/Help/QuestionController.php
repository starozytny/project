<?php

namespace App\Controller\Admin\Help;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeQuestion;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/aide/faq/questions', name: 'admin_help_faq_questions_')]
class QuestionController extends AbstractController
{
    #[Route('/question/{category}/ajouter', name: 'create', options: ['expose' => true])]
    public function create(HeCategory $category): Response
    {
        return $this->render('admin/pages/help/faq/question/create.html.twig', ['category' => $category]);
    }

    #[Route('/question/{category}/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(HeCategory $category, HeQuestion $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => HeCategory::FORM]);
        return $this->render('admin/pages/help/faq/question/update.html.twig', ['category' => $category, 'elem' => $elem, 'obj' => $obj]);
    }
}
