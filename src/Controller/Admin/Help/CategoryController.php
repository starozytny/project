<?php

namespace App\Controller\Admin\Help;

use App\Entity\Main\Help\HeCategory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/aide/faq/categories', name: 'admin_help_faq_categories_')]
class CategoryController extends AbstractController
{
    #[Route('/categorie/ajouter', name: 'create', options: ['expose' => true])]
    public function create(): Response
    {
        return $this->render('admin/pages/help/faq/category/create.html.twig');
    }

    #[Route('/categorie/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(HeCategory $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => HeCategory::FORM]);
        return $this->render('admin/pages/help/faq/category/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }
}
