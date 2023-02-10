<?php

namespace App\Controller\Admin;

use App\Entity\Main\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/utilisateurs', name: 'admin_users_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/users/index.html.twig', ['highlight' => $request->query->get('h')]);
    }

    #[Route('/utilisateur/ajouter', name: 'create', options: ['expose' => true])]
    public function create(): Response
    {
        return $this->render('admin/pages/users/create.html.twig');
    }

    #[Route('/utilisateur/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(User $elem, SerializerInterface $serializer): Response
    {
        $obj = $serializer->serialize($elem, 'json', ['groups' => User::FORM]);
        return $this->render('admin/pages/users/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/utilisateur/consulter/{id}', name: 'read', options: ['expose' => true])]
    public function read(User $elem, SerializerInterface $serializer): Response
    {
        $obj = $serializer->serialize($elem, 'json', ['groups' => User::LIST]);
        return $this->render('admin/pages/users/read.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/utilisateur/mot-de-passe/{id}', name: 'password')]
    public function password(User $elem): Response
    {
        return $this->render('admin/pages/users/password.html.twig', ['elem' => $elem]);
    }
}
