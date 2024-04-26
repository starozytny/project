<?php

namespace App\Controller\InternApi\Immo;

use App\Entity\Immo\ImDemande;
use App\Repository\Immo\ImDemandeRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataImmo;
use App\Service\Data\DataMain;
use App\Service\MailerService;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/intern/api/immo/demandes', name: 'intern_api_immo_demandes_')]
class DemandeController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    #[IsGranted('ROLE_ADMIN')]
    public function list(ImDemandeRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), ImDemande::LIST);
    }

    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, DataMain $dataMain, ImDemandeRepository $repository,
                           MailerService $mailerService, SettingsService $settingsService): Response
    {
        $data = json_decode($request->getContent());
        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataDemande(new ImDemande(), $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $repository->save($obj, true);

        if(!$mailerService->sendMail(
            [$data->toEmail],
            "Demande d'informations pour le bien : " . $data->libelle,
            "Demande d'informations pour un bien",
            'app/email/immo/demande.html.twig',
            ['dm' => $obj, 'settings' => $settingsService->getSettings()],
            [], [], $obj->getEmail()
        )) {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'to',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        $url = $this->generateUrl('admin_immo_demandes_index', [], UrlGeneratorInterface::ABSOLUTE_URL);

        $dataMain->createDataNotification("Demande d'informations", "chat-2", null, $url);
        return $apiResponse->apiJsonResponseSuccessful("Demande envoyée.");
    }

    #[Route('/delete/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(ImDemande $obj, ImDemandeRepository $repository, ApiResponse $apiResponse): Response
    {
        $repository->remove($obj, true);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/switch/seen/{id}', name: 'switch_seen', options: ['expose' => true], methods: 'PUT')]
    public function switchPublish(ImDemande $obj, ImDemandeRepository $repository, ApiResponse $apiResponse): Response
    {
        $obj->setSeen(!$obj->isSeen());
        $repository->save($obj, true);
        return $apiResponse->apiJsonResponse($obj, ImDemande::LIST);
    }
}
