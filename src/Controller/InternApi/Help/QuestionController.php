<?php

namespace App\Controller\InternApi\Help;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeQuestion;
use App\Repository\Main\Help\HeCategoryRepository;
use App\Repository\Main\Help\HeQuestionRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/intern/api/help/faq/questions', name: 'intern_api_help_faq_questions_')]
class QuestionController extends AbstractController
{
    public function submitForm($type, HeQuestionRepository $repository, HeQuestion $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity, HeCategoryRepository $categoryRepository): JsonResponse
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $category = $categoryRepository->find($data->category);
        if(!$category){
            return $apiResponse->apiJsonResponseBadRequest("Catégorie introuvable.");
        }

        $obj = $dataEntity->setDataHeQuestion($obj, $data);
        $obj->setCategory($category);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, HeQuestionRepository $repository, HeCategoryRepository $categoryRepository): Response
    {
        return $this->submitForm("create", $repository, new HeQuestion(), $request, $apiResponse, $validator, $dataEntity, $categoryRepository);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'PUT')]
    public function update(Request $request, HeQuestion $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, HeQuestionRepository $repository, HeCategoryRepository $categoryRepository): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity, $categoryRepository);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(HeQuestion $obj, HeQuestionRepository $repository, ApiResponse $apiResponse): Response
    {
        $category = $obj->getCategory();
        $repository->remove($obj, true);

        return $apiResponse->apiJsonResponse($category, HeCategory::LIST);
    }
}
