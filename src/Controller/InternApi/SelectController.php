<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Society;
use App\Repository\Main\SocietyRepository;
use App\Service\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/selections', name: 'intern_api_selection_')]
class SelectController extends AbstractController
{
    #[Route('/societies', name: 'societies', options: ['expose' => true], methods: 'GET')]
    public function societies(SocietyRepository $repository, ApiResponse $apiResponse): Response
    {
        $objs = $repository->findAll();
        return $apiResponse->apiJsonResponse($objs, Society::SELECT);
    }
}
