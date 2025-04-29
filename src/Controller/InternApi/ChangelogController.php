<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Changelog;
use App\Repository\Main\ChangelogRepository;
use App\Service\Api\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/changelogs', name: 'intern_api_changelogs_')]
#[IsGranted('ROLE_ADMIN')]
class ChangelogController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(ChangelogRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), Changelog::LIST);
    }

    public function submitForm($type, ChangelogRepository $repository, Changelog $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity): JsonResponse
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataChangelog($obj, $data);

        if($type === "update"){
            $obj->setUpdatedAt(new \DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, Changelog::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, ChangelogRepository $repository): Response
    {
        return $this->submitForm("create", $repository, new Changelog(), $request, $apiResponse, $validator, $dataEntity);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, Changelog $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, ChangelogRepository $repository): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(Changelog $obj, ChangelogRepository $repository, ApiResponse $apiResponse): Response
    {
        $repository->remove($obj, true);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/switch/published/{id}', name: 'switch_publish', options: ['expose' => true], methods: 'PUT')]
    public function switchPublish(Changelog $obj, ChangelogRepository $repository, ApiResponse $apiResponse): Response
    {
        $obj->setIsPublished(!$obj->isIsPublished());
        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, Changelog::LIST);
    }
}
