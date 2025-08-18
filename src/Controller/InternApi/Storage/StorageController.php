<?php

namespace App\Controller\InternApi\Storage;

use App\Service\Api\ApiResponse;
use App\Service\StorageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/storage', name: 'intern_api_storage_')]
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

    #[Route('/download/{deep}/{dir}/{filename}', name: 'download', options: ['expose' => true], methods: 'GET')]
    public function download(Request $request, $deep, $dir, $filename, ApiResponse $apiResponse): BinaryFileResponse|Response
    {
        $finder = new Finder();

        $deepFolder = "";
        if($deep >= 1){
            for($i = 1; $i <= $deep ; $i++){
                $deepFolder .= "*/";
            }
        }

        $finder->files()->in($this->getParameter('private_directory') . $deepFolder . ($dir == "racine" ? "" : $dir));
        if(!$finder->hasResults()){
            return $apiResponse->apiJsonResponseBadRequest("Le fichier n'existe pas.");
        }

        $filePath = null;
        foreach ($finder as $item) {
            if($item->getRelativePathname() == $filename){
                $filePath = $item->getLinkTarget();
            }
        }

        if(!file_exists($filePath)){
            return $apiResponse->apiJsonResponseBadRequest("Le fichier n'existe pas.");
        }

        $type = $request->query->get('file');
        if($type){
            return $this->file($filePath);
        }

        return $apiResponse->apiJsonResponseCustom(['url' => $this->generateUrl('intern_api_storage_download', [
            'deep' => $deep, 'dir' => $dir, 'filename' => $filename, 'file' => 1
        ])]);
    }
}
