<?php

namespace App\Controller\InternApi;

use App\Service\ApiResponse;
use App\Service\FileUploader;
use App\Service\MailerService;
use App\Service\SanitizeData;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/intern/api/mails', name: 'intern_api_mails_')]
class MailController extends AbstractController
{
    #[Route('/mail/send', name: 'send', options: ['expose' => true], methods: 'post')]
    public function send(Request $request, ApiResponse $apiResponse,
                           SanitizeData $sanitizeData, MailerService $mailerService, FileUploader $fileUploader): Response
    {
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $files = [];
        if($request->files){
            foreach($request->files as $file){
                $filename = $fileUploader->upload($file, 'mails', false);
                $files[] = $fileUploader->getPrivateDirectory() . 'mails/' . $filename;
            }
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
                $cc, $cci, null, $files
            )) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'to',
                    'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
                ]]);
            }
        }else{
            return $apiResponse->apiJsonResponseBadRequest("Destinataire invalide.");
        }

        foreach($files as $file){
            $fileUploader->deleteFile($file, 'mails', false);
        }

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
