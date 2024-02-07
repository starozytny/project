<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Notification;
use App\Repository\Main\NotificationRepository;
use App\Service\ApiResponse;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/intern/api/notifications', name: 'intern_api_notifications_')]
class NotificationController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(NotificationRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findBy(['user' => $this->getUser()]), Notification::LIST);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(Notification $obj, NotificationRepository $repository, ApiResponse $apiResponse): Response
    {
        $repository->remove($obj, true);

        return $apiResponse->apiJsonResponse($repository->findBy(['user' => $this->getUser()]), Notification::LIST);
    }

    #[Route('/delete-all', name: 'delete_all', options: ['expose' => true], methods: 'DELETE')]
    public function deleteAll(NotificationRepository $repository, ManagerRegistry $registry, ApiResponse $apiResponse): Response
    {
        $em = $registry->getManager();
        $objs = $repository->findBy(['user' => $this->getUser()]);

        foreach($objs as $obj){
            $repository->remove($obj);
        }
        $em->flush();

        return $apiResponse->apiJsonResponse($repository->findBy(['user' => $this->getUser()]), Notification::LIST);
    }

    #[Route('/switch/all/seen', name: 'switch_all_seen', options: ['expose' => true], methods: 'PUT')]
    public function switchAllSeen(NotificationRepository $repository, ManagerRegistry $registry, ApiResponse $apiResponse): Response
    {
        $em = $registry->getManager();
        $objs = $repository->findBy(['user' => $this->getUser(), 'seen' => false]);

        foreach($objs as $obj){
            $obj->setSeen(!$obj->isSeen());
        }
        $em->flush();

        return $apiResponse->apiJsonResponse($objs, Notification::LIST);
    }
}
