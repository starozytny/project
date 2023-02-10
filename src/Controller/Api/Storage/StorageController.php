<?php

namespace App\Controller\Api\Storage;

use App\Service\ApiResponse;
use App\Service\StorageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/storage', name: 'api_storage_')]
#[IsGranted('ROLE_ADMIN')]
class StorageController extends AbstractController
{
    #[Route('/directory', name: 'directory', options: ['expose' => true], methods: 'POST')]
    public function directory(Request $request, ApiResponse $apiResponse, StorageService $storageService): Response
    {
        $data = json_decode($request->getContent());
        [$directories, $files] = $storageService->getDirectories($data->path);

        return $apiResponse->apiJsonResponseCustom([
            'directories' => json_encode($directories),
            'files' => json_encode($files),
        ]);
    }
}
