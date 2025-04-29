<?php


namespace App\Service\Data;


use App\Service\ApiResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class DataService
{
    public function __construct(private readonly EntityManagerInterface $em, private readonly ApiResponse $apiResponse)
    {
    }

    public function seenToTrue($obj, $groups): JsonResponse
    {
        $obj->setSeen(true);

        $this->em->flush();
        return $this->apiResponse->apiJsonResponse($obj, $groups);
    }

    public function delete($obj, $isSeen = false, $messageError = "Vous n'avez pas lu ce message."): JsonResponse
    {
        if($isSeen){
            if (!$obj->getIsSeen()) {
                return $this->apiResponse->apiJsonResponseBadRequest($messageError);
            }
        }

        $this->em->remove($obj);
        $this->em->flush();
        return $this->apiResponse->apiJsonResponseSuccessful("Suppression réussie !");
    }

    public function deleteSelected($classe, $ids, $isSeen = false): JsonResponse
    {
        $objs = $this->em->getRepository($classe)->findBy(['id' => $ids]);

        if ($objs) {
            foreach ($objs as $obj) {
                if($isSeen){
                    if (!$obj->getIsSeen()) {
                        return $this->apiResponse->apiJsonResponseBadRequest('Vous n\'avez pas lu ce message.');
                    }
                }

                $this->em->remove($obj);
            }
        }

        $this->em->flush();
        return $this->apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
