<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/admin/contacts', name: 'admin_contacts_')]
class ContactController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(): Response
    {
        return $this->render('admin/pages/contacts/index.html.twig');
    }
}
