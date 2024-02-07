<?php

namespace App\Controller\Admin;

use App\Entity\Main\Changelog;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/changelogs', name: 'admin_changelogs_')]
class ChangelogController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/changelogs/index.html.twig', ['highlight' => $request->query->get('h')]);
    }

    #[Route('/changelog/ajouter', name: 'create', options: ['expose' => true])]
    public function create(): Response
    {
        return $this->render('admin/pages/changelogs/create.html.twig');
    }

    #[Route('/changelog/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(Changelog $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => Changelog::FORM]);
        return $this->render('admin/pages/changelogs/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }
}
