<?php

namespace App\Controller\Admin;

use App\Entity\Main\User;
use App\Service\Paginator;
use Doctrine\Persistence\ManagerRegistry;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/utilisateurs', name: 'admin_users_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(Request $request, ManagerRegistry $doctrine,
                          SerializerInterface $serializer, Paginator $paginator): Response
    {
        $em = $doctrine->getManager();

        $objs = $em->getRepository(User::class)->findAll();

        $pagination = $paginator->paginate($request, $objs);
        $objs = $serializer->serialize($pagination->getItems(), 'json', ['groups' => User::USER_LIST]);

        return $this->render('admin/pages/users/index.html.twig', ['objs' => $objs, 'pagination' => $pagination]);
    }

    #[Route('/utilisateur/{id}/modifier', name: 'update', options: ['expose' => true])]
    public function update($id, ManagerRegistry $doctrine, SerializerInterface $serializer): Response
    {
        $em = $doctrine->getManager();

        $elem = $em->getRepository(User::class)->find($id);
        $obj  = $serializer->serialize($elem, 'json', ['groups' => User::USER_FORM]);

        return $this->render('admin/pages/users/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }
}
