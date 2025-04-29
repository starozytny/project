<?php


namespace App\Service\Api;


use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

class ApiResponse
{
    private SerializerInterface $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    public function apiJsonResponse($data, $groups = [], $code = 200): JsonResponse
    {
        $data = $this->serializer->serialize($data, "json", ['groups' => $groups]);

        $response = new JsonResponse();
        $response->setContent($data);
        $response->setStatusCode($code);

        return $response;
    }

    public function apiJsonResponseData($data, $code = 200): JsonResponse
    {
        return new JsonResponse(['data' => $data], $code);
    }

    public function apiJsonResponseCustom($data, $code = 200): JsonResponse
    {
        return new JsonResponse($data, $code);
    }

    public function apiJsonResponseSuccessful($message): JsonResponse
    {
        return new JsonResponse(['message' => $message], 200);
    }

    public function apiJsonResponseBadRequest($message): JsonResponse
    {
        return new JsonResponse(['message' => $message], 400);
    }

    public function apiJsonResponseForbidden(): JsonResponse
    {
        return new JsonResponse(['message' => 'Vous n\'êtes pas autorisé à réaliser cette action.'], 403);
    }

    public function apiJsonResponseValidationFailed($errors): JsonResponse
    {
        return new JsonResponse($errors, 400);
    }
}
