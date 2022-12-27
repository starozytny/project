<?php

namespace App\Controller\Api;

use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Repository\Main\UserRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
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
        return $apiResponse->apiJsonResponse($objs, User::LIST);
    }

    public function submitForm($type, ObjectManager $em, User $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity, UserRepository $repository,
                               UserPasswordHasherInterface $passwordHasher, FileUploader $fileUploader): JsonResponse
    {
        $data = json_decode($request->get('data'));
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $society = $em->getRepository(Society::class)->find($data->society);
        if(!$society) throw new NotFoundHttpException("Society not found.");

        $obj = $dataEntity->setDataUser($obj, $data);
        if($type === "create"){
            $obj->setPassword($passwordHasher->hashPassword($obj, $data->password ?: uniqid()));
        }else{
            if($data->password != ""){
                $obj->setPassword($passwordHasher->hashPassword($obj, $data->password));
            }
        }

        $obj->setSociety($society);
        $obj->setManager($society->getManager());

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $file = $request->files->get('avatar');
        if ($file) {
            $fileName = $fileUploader->replaceFile($file, User::FOLDER, $obj->getAvatar());
            $obj->setAvatar($fileName);
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'POST')]
    #[IsGranted('ROLE_USER')]
    public function update(Request $request, User $obj, ManagerRegistry $doctrine, ApiResponse $apiResponse,
                           ValidatorService $validator, DataMain$dataEntity, UserRepository $repository,
                           UserPasswordHasherInterface $passwordHasher, FileUploader $fileUploader): Response
    {
        $em = $doctrine->getManager();
        return $this->submitForm("update", $em, $obj, $request, $apiResponse, $validator, $dataEntity,
            $repository, $passwordHasher, $fileUploader);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request, ManagerRegistry $doctrine, ApiResponse $apiResponse,
                           ValidatorService $validator, DataMain$dataEntity, UserRepository $repository,
                           UserPasswordHasherInterface $passwordHasher, FileUploader $fileUploader): Response
    {
        $em = $doctrine->getManager();
        return $this->submitForm("create", $em, new User(), $request, $apiResponse, $validator, $dataEntity,
            $repository, $passwordHasher, $fileUploader);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(User $obj, UserRepository $repository, ApiResponse $apiResponse, FileUploader $fileUploader): Response
    {
        if ($obj->getHighRoleCode() === User::CODE_ROLE_DEVELOPER) {
            return $apiResponse->apiJsonResponseForbidden();
        }

        if ($obj === $this->getUser()) {
            return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
        }

        $repository->remove($obj, true);

        $fileUploader->deleteFile($obj->getAvatar(), User::FOLDER);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
