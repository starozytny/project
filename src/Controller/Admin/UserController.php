<?php

namespace App\Controller\Admin;

use App\Entity\Main\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/utilisateurs', name: 'admin_users_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('admin/pages/users/index.html.twig');
    }

    #[Route('/utilisateur/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(User $elem, SerializerInterface $serializer): Response
    {
        $obj  = $serializer->serialize($elem, 'json', ['groups' => User::FORM]);
        return $this->render('admin/pages/users/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/utilisateur/ajouter', name: 'create', options: ['expose' => true])]
    public function create(): Response
    {
        return $this->render('admin/pages/users/create.html.twig');
    }
}
