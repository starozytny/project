<?php

namespace App\Controller\Admin;

use App\Entity\Main\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/utilisateurs', name: 'admin_users_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(ManagerRegistry $doctrine, SerializerInterface $serializer): Response
    {
        $em = $doctrine->getManager();

        $objs = $em->getRepository(User::class)->findAll();
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::USER_READ]);

        return $this->render('admin/pages/users/index.html.twig', ['objs' => $objs]);
    }

    #[Route('/utilisateur/{id}/modifier', name: 'update', options: ['expose' => true])]
    public function update($id, ManagerRegistry $doctrine, SerializerInterface $serializer): Response
    {
        $em = $doctrine->getManager();

        $elem = $em->getRepository(User::class)->find($id);
        $obj  = $serializer->serialize($elem, 'json', ['groups' => User::USER_READ]);

        return $this->render('admin/pages/users/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }
}
