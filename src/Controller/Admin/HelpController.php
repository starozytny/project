<?php

namespace App\Controller\Admin;

use App\Entity\Main\Help\HeCategory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/aide/faq', name: 'admin_help_faq_')]
class HelpController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/help/faq/index.html.twig', ['category' => $request->query->get('cat')]);
    }
}
