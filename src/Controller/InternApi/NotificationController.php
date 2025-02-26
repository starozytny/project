<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Notification;
use App\Repository\Main\NotificationRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route(path: '/intern/api/notifications', name: 'intern_api_notifications_')]
class NotificationController extends AbstractController
{
    #[Route(path: '/', name: 'index', options: ['expose' => true], methods: ['GET'])]
    public function index(NotificationRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $objs = $repository->findAll();
        return $apiResponse->apiJsonResponse($objs, Notification::LIST);
    }

    #[Route(path: '/{id}/is-seen', name: 'isSeen', options: ['expose' => true], methods: ['POST'])]
    public function isSeen(Notification $obj, DataService $dataService): JsonResponse
    {
        return $dataService->isSeenToTrue($obj, Notification::LIST);
    }

    #[Route(path: '/all/seen', name: 'isSeen_all', options: ['expose' => true], methods: ['POST'])]
    public function allSeen(ManagerRegistry $registry, NotificationRepository $notificationRepository, ApiResponse $apiResponse): JsonResponse
    {
        $em = $registry->getManager();
        $objs = $notificationRepository->findBy(['seen' => false]);

        foreach($objs as $obj){
            $obj->setSeen(true);
        }

        $objs = $notificationRepository->findAll();

        $em->flush();
        return $apiResponse->apiJsonResponse($objs, Notification::LIST);
    }

    #[Route(path: '/{id}', name: 'delete', options: ['expose' => true], methods: ['DELETE'])]
    public function delete(Notification $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }

    #[Route(path: '/', name: 'delete_group', options: ['expose' => true], methods: ['DELETE'])]
    public function deleteSelected(Request $request, DataService $dataService): JsonResponse
    {
        return $dataService->deleteSelected(Notification::class, json_decode($request->getContent()));
    }
}
