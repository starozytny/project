<?php

namespace App\Controller\Admin;

use App\Entity\Main\Agenda\AgEvent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/agenda', name: 'admin_agenda_')]
class AgendaController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(): Response
    {
        return $this->render('admin/pages/agenda/index.html.twig');
    }

    #[Route('/evenement/ajouter', name: 'create', options: ['expose' => true])]
    public function create(): Response
    {
        return $this->render('admin/pages/agenda/create.html.twig');
    }

    #[Route('/evenement/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(AgEvent $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => AgEvent::FORM]);
        return $this->render('admin/pages/agenda/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }
}
