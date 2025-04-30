<?php

namespace App\Controller\InternApi\Immo;

use App\Repository\Main\SocietyRepository;
use App\Service\Api\ApiResponse;
use App\Service\Immo\ImmoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;

#[Route('/intern/api/immo', name: 'inter_api_immo_')]
class ImmoController extends AbstractController
{
    /**
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/biens/list/{type}', name: 'biens_list', options: ['expose' => true], methods: 'GET')]
    public function list($type, SocietyRepository $repository, ApiResponse $apiResponse, ImmoService $immoService): Response
    {
        $data = [];
        $society = $repository->findOneBy(['code' => $this->getParameter('lotys_code_society')]);
        if($type == "locations"){
            $file = $immoService->getSocietyImmoFileLocations($society);
        }else{
            $file = $immoService->getSocietyImmoFileVentes($society);
        }
        if(file_exists($file)){
            $items = json_decode(file_get_contents($file));
            $data = [...$data, ...$items];
        }

        return $apiResponse->apiJsonResponseCustom($data);
    }
}
