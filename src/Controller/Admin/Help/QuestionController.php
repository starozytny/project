<?php

namespace App\Controller\Admin\Help;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeQuestion;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/aide/faq/questions', name: 'admin_help_faq_questions_')]
class QuestionController extends AbstractController
{
    #[Route('/question/{category}/ajouter', name: 'create', options: ['expose' => true])]
    public function create(HeCategory $category, SerializerInterface $serializer): Response
    {
        $cat  = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('admin/pages/help/faq/question/create.html.twig', ['category' => $category, 'cat' => $cat]);
    }

    #[Route('/question/{category}/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(HeCategory $category, HeQuestion $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => HeQuestion::FORM]);
        $cat  = $serializer->serialize($category, 'json', ['groups' => HeCategory::LIST]);
        return $this->render('admin/pages/help/faq/question/update.html.twig', ['category' => $category, 'cat' => $cat, 'elem' => $elem, 'obj' => $obj]);
    }
}
