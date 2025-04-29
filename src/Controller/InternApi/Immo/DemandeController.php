<?php

namespace App\Controller\InternApi\Immo;

use App\Entity\Immo\ImDemande;
use App\Repository\Immo\ImDemandeRepository;
use App\Service\Api\ApiLotys;
use App\Service\Api\ApiResponse;
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
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[Route('/intern/api/immo/demandes', name: 'intern_api_immo_demandes_')]
class DemandeController extends AbstractController
{
    #[Route('/list', name: 'list', options: ['expose' => true], methods: 'GET')]
    #[IsGranted('ROLE_ADMIN')]
    public function list(ImDemandeRepository $repository, ApiResponse $apiResponse): Response
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), ImDemande::LIST);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/create', name: 'create', options: ['expose' => true], methods: 'POST')]
    public function create(Request $request, ApiResponse $apiResponse, ValidatorService $validator,
                           DataImmo $dataEntity, DataMain $dataMain, ImDemandeRepository $repository,
                           MailerService $mailerService, SettingsService $settingsService, ApiLotys $apiLotys): Response
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

        $lotysId = "dev";
        if($this->getParameter('app_env') == "prod"){
            $urlBien = $this->generateUrl('app_ad', [
                'typeA' => $obj->getTypeAd(),
                'typeB' => $obj->getTypeBien(),
                'zipcode' => $obj->getZipcode(),
                'city' => $obj->getCity(),
                'ref' => $obj->getReference(),
                'slug' => $obj->getSlug()
            ], UrlGeneratorInterface::ABSOLUTE_URL);
            $lotysId = $apiLotys->createDemande($obj, $data, $urlBien);

            if($lotysId === false){
                return $apiResponse->apiJsonResponseBadRequest('Une erreur est survenue. Veuillez contacter le support.');
            }
        }

        if(!$mailerService->sendMail(
            [$data->toEmail],
            "Demande d'informations pour le bien : " . $data->libelle,
            "Demande d'informations pour un bien",
            'app/email/immo/demande.html.twig',
            [
                'dm' => $obj,
                'settings' => $settingsService->getSettings(),
                'urlManage' => $apiLotys->getUrlLotys() . 'espace-membre/immobilier/demandes?h=' . $lotysId
            ],
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
