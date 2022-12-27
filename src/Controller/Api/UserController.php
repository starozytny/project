<?php

namespace App\Controller\Api;

use App\Entity\Main\User;
use App\Service\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\ValidatorService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/users', name: 'api_users_')]
class UserController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function listRange(ManagerRegistry $doctrine, ApiResponse $apiResponse): Response
    {
        $em = $doctrine->getManager();
        $objs = $em->getRepository(User::class)->findAll();
        return $apiResponse->apiJsonResponse($objs, User::USER_LIST);
    }

    public function submitForm($type, ObjectManager $em, User $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity,
                               UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->get('data'));
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setData($obj, $data);
        if($type === "create"){
            $obj->setPassword($passwordHasher->hashPassword($obj, $data->password));
        }else{
            if($data->password != ""){
                $obj->setPassword($passwordHasher->hashPassword($obj, $data->password));
            }
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'POST')]
    #[IsGranted('ROLE_USER')]
    public function update(Request $request, $id, ManagerRegistry $doctrine, ApiResponse $apiResponse,
                           ValidatorService $validator, DataMain$dataEntity, UserPasswordHasherInterface $passwordHasher): Response
    {
        $em = $doctrine->getManager();
        $obj = $em->getRepository(User::class)->find($id);

        return $this->submitForm("update", $em, $obj, $request, $apiResponse, $validator, $dataEntity, $passwordHasher);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'GET')]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request, ManagerRegistry $doctrine, ApiResponse $apiResponse,
                           ValidatorService $validator, DataMain$dataEntity, UserPasswordHasherInterface $passwordHasher): Response
    {
        $em = $doctrine->getManager();
        return $this->submitForm("update", $em, new User(), $request, $apiResponse, $validator, $dataEntity, $passwordHasher);
    }
}
