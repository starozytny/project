<?php

namespace App\Controller;

use App\Entity\Main\Settings;
use App\Repository\Main\SettingsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin', name: 'admin_')]
class AdminController extends AbstractController
{
    #[Route('/', name: 'homepage')]
    public function index(): Response
    {
        return $this->render('admin/pages/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }
    #[Route('/settings/setting/modifier', name: 'settings_update')]
    public function settings(SettingsRepository $repository, SerializerInterface $serializer): Response
    {
        return $this->render('admin/pages/settings/update.html.twig', [
            'obj' => $serializer->serialize($repository->findAll(), 'json', ['groups' => Settings::FORM]),
        ]);
    }
}
