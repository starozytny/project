<?php

namespace App\Controller\Admin\Immo;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/immo/demandes', name: 'admin_immo_demandes_')]
class DemandeController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(): Response
    {
        return $this->render('admin/pages/immo/demandes/index.html.twig');
    }
}
