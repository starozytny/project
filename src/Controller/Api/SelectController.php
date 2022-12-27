<?php

namespace App\Controller\Api;

use App\Entity\Main\Society;
use App\Repository\Main\SocietyRepository;
use App\Service\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/selections', name: 'api_selection_')]
class SelectController extends AbstractController
{
    #[Route('/societies', name: 'societies', options: ['expose' => true], methods: 'GET')]
    public function societies(SocietyRepository $repository, ApiResponse $apiResponse): Response
    {
        $objs = $repository->findAll();
        return $apiResponse->apiJsonResponse($objs, Society::SELECT);
    }
}
