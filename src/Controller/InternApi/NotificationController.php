<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Notification;
use App\Repository\Main\NotificationRepository;
use App\Service\Api\ApiResponse;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/notifications', name: 'intern_api_notifications_')]
class NotificationController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true], methods: ['GET'])]
    public function index(NotificationRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $objs = $repository->findAll();
        return $apiResponse->apiJsonResponse($objs, Notification::LIST);
    }

    #[Route('/{id}/is-seen', name: 'seen', options: ['expose' => true], methods: ['POST'])]
    public function isSeen(ManagerRegistry $registry, Notification $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $registry->getManager();

        $obj->setIsSeen(true);

        $em->flush();
        return $apiResponse->apiJsonResponse($obj, Notification::LIST);
    }

    #[Route('/all/seen', name: 'seen_all', options: ['expose' => true], methods: ['POST'])]
    public function allSeen(ManagerRegistry $registry, NotificationRepository $notificationRepository, ApiResponse $apiResponse): JsonResponse
    {
        $em = $registry->getManager();
        $objs = $notificationRepository->findBy(['isSeen' => false]);

        foreach($objs as $obj){
            $obj->setIsSeen(true);
        }

        $objs = $notificationRepository->findAll();

        $em->flush();
        return $apiResponse->apiJsonResponse($objs, Notification::LIST);
    }

    #[Route('/{id}', name: 'delete', options: ['expose' => true], methods: ['DELETE'])]
    public function delete(ManagerRegistry $registry, Notification $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $registry->getManager();

        if (!$obj->isSeen()) {
            return $apiResponse->apiJsonResponseBadRequest("Vous n'avez pas lu ce message.");
        }

        $em->remove($obj);
        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Suppression réussie !");
    }

    #[Route('/', name: 'delete_all', options: ['expose' => true], methods: ['DELETE'])]
    public function deleteAll(ManagerRegistry $registry, ApiResponse $apiResponse): JsonResponse
    {
        $em = $registry->getManager();
        $objs = $em->getRepository(Notification::class)->findAll();

        if ($objs) {
            foreach ($objs as $obj) {
                if (!$obj->isSeen()) {
                    return $apiResponse->apiJsonResponseBadRequest('Vous n\'avez pas lu ce message.');
                }

                $em->remove($obj);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Suppression réussie !");
    }
}
