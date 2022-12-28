<?php

namespace App\Controller\Api;

use App\Entity\Main\Society;
use App\Repository\Main\SocietyRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/societies', name: 'api_societies_')]
#[IsGranted('ROLE_ADMIN')]
class SocietyController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(SocietyRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), Society::LIST);
    }

    public function submitForm($type, SocietyRepository $repository, Society $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        $data = json_decode($request->get('data'));
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataSociety($obj, $data);

//        if($type === "update"){
//            $users = $obj->getUsers();
//            foreach($obj->getUsers() as $user){
//                $user->setManager()
//            }
//        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $file = $request->files->get('logo');
        if ($file) {
            $fileName = $fileUploader->replaceFile($file, Society::FOLDER, $obj->getLogo());
            $obj->setLogo($fileName);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, SocietyRepository $repository, FileUploader $fileUploader): Response
    {
        return $this->submitForm("create", $repository, new Society(), $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'POST')]
    public function update(Request $request, Society $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, SocietyRepository $repository, FileUploader $fileUploader): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(Society $obj, SocietyRepository $repository, ApiResponse $apiResponse, FileUploader $fileUploader): Response
    {
        $repository->remove($obj, true);

        $fileUploader->deleteFile($obj->getLogo(), Society::FOLDER);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
