<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeQuestion;
use App\Repository\Main\Help\HeCategoryRepository;
use App\Repository\Main\Help\HeQuestionRepository;
use App\Service\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/intern/api/help/faq', name: 'intern_api_help_faq_')]
class HelpController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(HeCategoryRepository $categoryRepository, HeQuestionRepository $questionRepository,
                         ApiResponse $apiResponse, SerializerInterface $serializer): Response
    {
        $categories = $categoryRepository->findAll();
        $questions  = $questionRepository->findAll();

        $categories = $serializer->serialize($categories, 'json', ['groups' => HeCategory::LIST]);
        $questions  = $serializer->serialize($questions,  'json', ['groups' => HeQuestion::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'categories' => $categories,
            'questions' => $questions
        ]);
    }
}
