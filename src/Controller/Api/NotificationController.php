<?php

namespace App\Controller\Api;

use App\Entity\Main\Notification;
use App\Repository\Main\NotificationRepository;
use App\Service\ApiResponse;
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

    #[Route('/switch/seen/{id}', name: 'switch_seen', options: ['expose' => true], methods: 'PUT')]
    public function switchPublish(Notification $obj, NotificationRepository $repository, ApiResponse $apiResponse): Response
    {
        $obj->setSeen(!$obj->isSeen());
        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, Notification::LIST);
    }
}
