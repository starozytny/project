<?php

namespace App\Controller\Api;

use App\Entity\Main\Notification;
use App\Repository\Main\NotificationRepository;
use App\Service\ApiResponse;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/notifs', name: 'api_notifs_')]
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

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/switch/all/seen', name: 'switch_all_seen', options: ['expose' => true], methods: 'PUT')]
    public function switchAllSeen(NotificationRepository $repository, ManagerRegistry $registry, ApiResponse $apiResponse): Response
    {
        $em = $registry->getManager();
        $objs = $repository->findBy(['seen' => false]);

        foreach($objs as $obj){
            $obj->setSeen(!$obj->isSeen());
        }
        $em->flush();

        return $apiResponse->apiJsonResponse($objs, Notification::LIST);
    }
}
