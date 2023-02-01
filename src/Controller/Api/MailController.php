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

        $to  = []; foreach($data->to as $item) $to[] = $item->value;
        $cc  = []; foreach($data->cc as $item) $cc[] = $item->value;
        $cci = []; foreach($data->cci as $item) $cci[] = $item->value;

        if(count($to) > 0){
            $subject = $sanitizeData->trimData($data->name);
            if(!$mailerService->sendMail(
                $to,
                $subject,
                $subject,
                'app/email/template/random_classique.html.twig',
                ['subject' => $subject, 'message' => $data->message->html],
                $cc, $cci
            )) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'fUsername',
                    'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
                ]]);
            }
        }else{
            return $apiResponse->apiJsonResponseBadRequest("Destinataire invalide.");
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
