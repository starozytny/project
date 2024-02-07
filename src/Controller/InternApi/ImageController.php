<?php

namespace App\Controller\InternApi;

use App\Repository\Main\ImageRepository;
use App\Service\ApiResponse;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/images', name: 'intern_api_images_')]
class ImageController extends AbstractController
{
    #[Route('/{type}/images', name: 'upload', options: ['expose' => true], methods: 'POST')]
    public function upload(Request $request, $type, ApiResponse $apiResponse,
                           FileUploader $fileUploader, ImageRepository $repository): Response
    {
        $accepted_origins = array("https://127.0.0.1:8000", "https://nompaw.fr");

        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // same-origin requests won't set an origin. If the origin is set, it must be valid.
            if (in_array($_SERVER['HTTP_ORIGIN'], $accepted_origins)) {
                header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
            } else {
                header("HTTP/1.1 403 Origin Denied");
                return $apiResponse->apiJsonResponseBadRequest("[0] Erreur");
            }
        }

        // Don't attempt to process the upload on an OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header("Access-Control-Allow-Methods: POST, OPTIONS");
            return $apiResponse->apiJsonResponseBadRequest("[1] Erreur");
        }

        reset ($_FILES);
        $temp = current($_FILES);
        if (is_uploaded_file($temp['tmp_name'])) {
            // Sanitize input
            if (preg_match("/([^\w\s\d\-_~,;:\[\]\(\).])|([\.]{2,})/", $temp['name'])) {
                header("HTTP/1.1 400 Invalid file name.");
                return $apiResponse->apiJsonResponseBadRequest("[2] Erreur");
            }

            // Verify extension
            if (!in_array(strtolower(pathinfo($temp['name'], PATHINFO_EXTENSION)), array("gif", "jpg", "png"))) {
                header("HTTP/1.1 400 Invalid extension.");
                return $apiResponse->apiJsonResponseBadRequest("[3] Erreur");
            }

            return $fileUploader->uploadTinyMCE($request, $repository, (int) $type, $request->query->get('id'));
        }

        return $apiResponse->apiJsonResponseBadRequest("[4] Erreur");
    }
}
