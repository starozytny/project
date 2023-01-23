<?php

namespace App\Controller\Api;

use App\Entity\Main\Settings;
use App\Entity\Main\Society;
use App\Repository\Main\SocietyRepository;
use App\Service\ApiResponse;
use App\Service\CommandService;
use App\Service\Data\DataMain;
use App\Service\FileUploader;
use App\Service\MultipleDatabase\MultipleDatabase;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/societies', name: 'api_societies_')]
#[IsGranted('ROLE_ADMIN')]
class SocietyController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    public function list(SocietyRepository $repository, ApiResponse $apiResponse,
                         SettingsService $settingsService, SerializerInterface $serializer): Response
    {
        $societies = $repository->findAll();
        $settings  = $settingsService->getSettings();

        $settings = $serializer->serialize($settings, 'json', ['groups' => Settings::IS_MULTIPLE_DB]);
        $objs     = $serializer->serialize($societies,'json', ['groups' => Society::LIST]);

        return $apiResponse->apiJsonResponseCustom([
            'donnees' => $objs, 'settings' => $settings
        ]);
    }

    public function submitForm($type, SocietyRepository $repository, Society $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataMain $dataEntity, FileUploader $fileUploader,
                               SettingsService $settingsService, MultipleDatabase $multipleDatabase): JsonResponse
    {
        $data = json_decode($request->get('data'));
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $settings = $settingsService->getSettings();

        $existe = $repository->findOneBy(['code' => (int) $data->code]);
        if($existe && $existe->getId() != $obj->getId()){
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'code',
                'message' => 'Ce code est déjà utilisé.'
            ]]);
        }

        $oldCode = $obj->getCode();

        $obj = $dataEntity->setDataSociety($obj, $data, $settings);

        if($type === "update"){
            foreach($obj->getUsers() as $user){
                $user->setManager($obj->getManager());
            }
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $file = $request->files->get('logo');
        if ($file) {
            $fileName = $fileUploader->replaceFile($file, Society::FOLDER, $obj->getLogo());
            $obj->setLogo($fileName);
        }

        if($settings->isMultipleDatabase()){
            if($type == "create"){
                $multipleDatabase->createManager($settings, $obj->getCode(), false);
                $obj->setIsGenerated(true);
            }else{
                $multipleDatabase->updateManager($settings, $oldCode, $obj->getCode());
                $obj->setIsActivated(false);
            }
        }

        $repository->save($obj, true);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, SocietyRepository $repository, FileUploader $fileUploader,
                           SettingsService $settingsService, MultipleDatabase $multipleDatabase): Response
    {
        return $this->submitForm("create", $repository, new Society(), $request, $apiResponse, $validator, $dataEntity, $fileUploader, $settingsService, $multipleDatabase);
    }

    #[Route('/update/{id}', name: 'update', options: ['expose' => true], methods: 'POST')]
    public function update(Request $request, Society $obj, ApiResponse $apiResponse, ValidatorService $validator,
                           DataMain $dataEntity, SocietyRepository $repository, FileUploader $fileUploader,
                           SettingsService $settingsService, MultipleDatabase $multipleDatabase): Response
    {
        return $this->submitForm("update", $repository, $obj, $request, $apiResponse, $validator, $dataEntity, $fileUploader, $settingsService, $multipleDatabase);
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(Society $obj, SocietyRepository $repository, ApiResponse $apiResponse, FileUploader $fileUploader): Response
    {
        $repository->remove($obj, true);

        $fileUploader->deleteFile($obj->getLogo(), Society::FOLDER);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    /**
     * @throws Exception
     */
    #[Route('/generate/{id}', name: 'generate', options: ['expose' => true], methods: 'PUT')]
    public function generate(Society $obj, SocietyRepository $repository, ApiResponse $apiResponse,
                             MultipleDatabase $multipleDatabase, SettingsService $settingsService): Response
    {
        if(!$obj->isIsGenerated()){
            $multipleDatabase->createManager($settingsService->getSettings(), $obj->getCode(), true);

            $obj->setIsGenerated(true);
            $repository->save($obj, true);
        }

        return $apiResponse->apiJsonResponse($obj, Society::LIST);
    }

    /**
     * @throws Exception
     */
    #[Route('/activate/{id}', name: 'activate', options: ['expose' => true], methods: 'PUT')]
    public function activate(Society $obj, ManagerRegistry $registry, ApiResponse $apiResponse,
                             KernelInterface $kernel, CommandService $commandService): Response
    {
        $emDefault = $registry->getManager("default");
        $emSociety = $registry->getManager($obj->getManager());

        $commandService->runCommand($kernel, 'do:sc:up', ['--force' => true, '--em' => $obj->getManager()]);

        if(!$obj->isIsActivated()){
            $obj->setIsActivated(true);

            $emSociety->flush();
            $emDefault->flush();
        }

        return $apiResponse->apiJsonResponse($obj, Society::LIST);
    }


}
