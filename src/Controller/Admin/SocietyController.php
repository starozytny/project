<?php

namespace App\Controller\Admin;

use App\Entity\Main\Society;
use App\Service\SettingsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/societes', name: 'admin_societies_')]
class SocietyController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true], methods: ['GET'])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/societies/index.html.twig', ['highlight' => $request->query->get('h')]);
    }

    #[Route('/societe/ajouter', name: 'create', options: ['expose' => true], methods: ['GET'])]
    public function create(): Response
    {
        return $this->render('admin/pages/societies/create.html.twig');
    }

    #[Route('/societe/modifier/{id}', name: 'update', options: ['expose' => true], methods: ['GET'])]
    public function update(Society $elem, SerializerInterface $serializer): Response
    {
        $obj = $serializer->serialize($elem, 'json', ['groups' => Society::FORM]);

        return $this->render('admin/pages/societies/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/societe/consulter/{id}', name: 'read', options: ['expose' => true], methods: ['GET'])]
    public function read(Society $elem, SettingsService $settingsService): Response
    {
        $settings = $settingsService->getSettings();
        return $this->render('admin/pages/societies/read.html.twig', ['elem' => $elem, 'settings' => $settings]);
    }
}
