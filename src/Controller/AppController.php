<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    #[Route('/', name: 'app_homepage')]
    public function index(): Response
    {
        return $this->render('app/pages/index.html.twig', [ 'controller_name' => 'AppController' ]);
    }

    #[Route('/contact', name: 'app_contact')]
    public function create(): Response
    {
        return $this->render('app/pages/contact/create.html.twig');
    }
}
