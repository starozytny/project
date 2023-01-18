<?php

namespace App\Controller\Admin;

use App\Entity\Main\Society;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/societes', name: 'admin_societies_')]
class SocietyController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(): Response
    {
        return $this->render('admin/pages/societies/index.html.twig');
    }

    #[Route('/societe/ajouter', name: 'create', options: ['expose' => true])]
    public function create(): Response
    {
        return $this->render('admin/pages/societies/create.html.twig');
    }

    #[Route('/societe/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(Society $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => Society::FORM]);
        return $this->render('admin/pages/societies/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }
}
