<?php

namespace App\Controller\InternApi;

use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Repository\Main\UserRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataMain;
use App\Service\FileUploader;
use App\Service\MailerService;
use App\Service\SanitizeData;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/users', name: 'intern_api_users_')]
class UserController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    #[IsGranted('ROLE_ADMIN')]
    public function list(UserRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), User::LIST);
    }

    #[Route('/society/{society}', name: 'society', options: ['expose' => true], methods: 'GET')]
    public function society(Society $society, UserRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findBy(['society' => $society]), User::LIST);
    }

    public function submitForm($type, UserRepository $repository, User $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity, ObjectManager $em,
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

        if($existe = $em->getRepository(User::class)->findOneBy(['username' => $obj->getUsername()])){
            if($type == "create" || ($type == "update" && $existe->getId() != $obj->getId())){
                return $apiResponse->apiJsonResponseValidationFailed([
                    ["name" => "username", "message" => "Ce nom d'utilisateur existe déjà."]
                ]);
            }
        }

        if($existe = $em->getRepository(User::class)->findOneBy(['email' => $obj->getEmail()])){
            if($type == "create" || ($type == "update" && $existe->getId() != $obj->getId())){
                return $apiResponse->apiJsonResponseValidationFailed([
                    ["name" => "email", "message" => "Cette addresse e-mail existe déjà."]
                ]);
            }
        }

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
        return $apiResponse->apiJsonResponse($obj, User::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request, ManagerRegistry $doctrine, ApiResponse $apiResponse,
                           ValidatorService $validator, DataMain$dataEntity, UserRepository $repository,
                           UserPasswordHasherInterface $passwordHasher, FileUploader $fileUploader): Response
    {
        $em = $doctrine->getManager();
        return $this->submitForm("create", $repository, new User(), $request, $apiResponse, $validator, $dataEntity,
            $em, $passwordHasher, $fileUploader);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'POST')]
    #[IsGranted('ROLE_USER')]
    public function update(Request $request, User $obj, ManagerRegistry $doctrine, ApiResponse $apiResponse,
                           ValidatorService $validator, DataMain$dataEntity, UserRepository $repository,
                           UserPasswordHasherInterface $passwordHasher, FileUploader $fileUploader): Response
    {
        $em = $doctrine->getManager();
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity,
            $em, $passwordHasher, $fileUploader);
    }

    #[Route('/password/forget', name: 'password_forget', options: ['expose' => true], methods: 'post')]
    public function forget(Request $request, UserRepository $repository, ApiResponse $apiResponse,
                           SanitizeData $sanitizeData, MailerService $mailerService, SettingsService $settingsService): Response
    {
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $user = $repository->findOneBy(['username' => $sanitizeData->trimData($data->fUsername)]);
        if (!$user) {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'fUsername',
                'message' => "Cet utilisateur n'existe pas."
            ]]);
        }

        if ($user->getLostAt()) {
            $interval = date_diff($user->getLostAt(), new DateTime());
            if ($interval->y == 0 && $interval->m == 0 && $interval->d == 0 && $interval->h == 0 && $interval->i < 30) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'fUsername',
                    'message' => "Un lien a déjà été envoyé. Veuillez réessayer ultérieurement."
                ]]);
            }
        }

        $code = uniqid($user->getId());

        $user->setLostAt(new \DateTime());
        $user->setLostCode($code);
        $url = $this->generateUrl(
            'app_password_reinit',
            ['token' => $user->getToken(), 'code' => $code], UrlGeneratorInterface::ABSOLUTE_URL)
        ;

        if(!$mailerService->sendMail(
            [$user->getEmail()],
            "Mot de passe oublié pour le site " . $settingsService->getWebsiteName(),
            "Lien de réinitialisation de mot de passe.",
            'app/email/security/forget.html.twig',
            ['url' => $url, 'user' => $user, 'settings' => $settingsService->getSettings()]))
        {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'fUsername',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        $repository->save($user, true);
        return $apiResponse->apiJsonResponseSuccessful(sprintf("Le lien de réinitialisation de votre mot de passe a été envoyé à : %s", $user->getHiddenEmail()));
    }

    #[Route('/password/update/{token}', name: 'password_update', options: ['expose' => true], methods: 'post')]
    public function passwordUpdate(Request $request, $token, ValidatorService $validator, UserPasswordHasherInterface $passwordHasher,
                                   ApiResponse $apiResponse, UserRepository $repository): Response
    {
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $user = $repository->findOneBy(['token' => $token]);
        $user = ($user)
            ->setPassword($passwordHasher->hashPassword($user, $data->password))
            ->setLostAt(null)
            ->setLostCode(null)
        ;

        $noErrors = $validator->validate($user);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($user, true);
        return $apiResponse->apiJsonResponseSuccessful("Modification réalisée avec success ! La page va se rafraichir automatiquement dans 5 secondes.");
    }

    #[Route('/password/reinit/{token}', name: 'password_reinit', options: ['expose' => true], methods: 'post')]
    public function passwordReinit($token, ValidatorService $validator, UserPasswordHasherInterface $passwordHasher,
                                   ApiResponse $apiResponse, UserRepository $repository): Response
    {
        $user = $repository->findOneBy(['token' => $token]);
        $pass = uniqid();

        $user = ($user)
            ->setPassword($passwordHasher->hashPassword($user, $pass))
            ->setLostAt(null)
            ->setLostCode(null)
        ;

        $noErrors = $validator->validate($user);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($user, true);
        return $apiResponse->apiJsonResponseSuccessful("Veuillez noter le nouveau mot de passe : " . $pass);
    }

    #[Route('/password/switch/blocked/{token}', name: 'switch_blocked', options: ['expose' => true], methods: 'put')]
    #[IsGranted('ROLE_ADMIN')]
    public function switchBlocked($token, ApiResponse $apiResponse, UserRepository $repository): Response
    {
        $user = $repository->findOneBy(['token' => $token]);

        if($user->getHighRoleCode() === User::CODE_ROLE_DEVELOPER){
            return $apiResponse->apiJsonResponseBadRequest("Vous n'avez pas l'autorisation de bloquer cet utilisateur.");
        }

        $user->setBlocked(!$user->isBlocked());

        $repository->save($user, true);
        return $apiResponse->apiJsonResponse($user, User::LIST);
    }
}
