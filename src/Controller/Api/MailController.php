<?php

namespace App\Controller\Api;

use App\Service\ApiResponse;
use App\Service\MailerService;
use App\Service\SanitizeData;
use App\Service\SettingsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/mails', name: 'api_mails_')]
class MailController extends AbstractController
{
    #[Route('/mail/send', name: 'send', options: ['expose' => true], methods: 'post')]
    public function forget(Request $request, ApiResponse $apiResponse,
                           SanitizeData $sanitizeData, MailerService $mailerService, SettingsService $settingsService): Response
    {
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }


//        if(!$mailerService->sendMail(
//            $user->getEmail(),
//            "Mot de passe oublié pour le site " . $settingsService->getWebsiteName(),
//            "Lien de réinitialisation de mot de passe.",
//            'app/email/security/forget.html.twig',
//            ['url' => $url, 'user' => $user, 'settings' => $settingsService->getSettings()]))
//        {
//            return $apiResponse->apiJsonResponseValidationFailed([[
//                'name' => 'fUsername',
//                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
//            ]]);
//        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
