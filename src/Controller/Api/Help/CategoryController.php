<?php

namespace App\Controller\Api\Help;

use App\Entity\Main\Help\HeCategory;
use App\Repository\Main\Help\HeCategoryRepository;
use App\Repository\Main\Help\HeQuestionRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/help/faq/categories', name: 'api_help_faq_categories_')]
class CategoryController extends AbstractController
{
    public function submitForm($type, HeCategoryRepository $repository, HeCategory $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity): JsonResponse
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataHeCategory($obj, $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, HeCategory::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, HeCategoryRepository $repository): Response
    {
        return $this->submitForm("create", $repository, new HeCategory(), $request, $apiResponse, $validator, $dataEntity);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, HeCategory $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, HeCategoryRepository $repository): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(HeCategory $obj, HeCategoryRepository $repository, HeQuestionRepository $questionRepository, ApiResponse $apiResponse): Response
    {
        $questions = $obj->getQuestions();
        foreach($questions as $question){
            $questionRepository->remove($question);
        }

        $repository->remove($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
