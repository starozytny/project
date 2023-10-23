<?php

namespace App\Controller\InternApi;

use App\Entity\Enum\Mail\StatusType;
use App\Entity\Main\Mail;
use App\Repository\Main\MailRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataMain;
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
    public function send(Request $request, ApiResponse $apiResponse, SanitizeData $sanitizeData,
                         MailerService $mailerService, FileUploader $fileUploader, DataMain $dataMain,
                         MailRepository $repository): Response
    {
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $files = []; $filesName = [];
        if($request->files){
            foreach($request->files as $file){
                $filename = $fileUploader->upload($file, Mail::FOLDER_FILES, false);
                $files[] = $fileUploader->getPrivateDirectory() . Mail::FOLDER_FILES .'/' . $filename;
                $filesName[] = $file;
            }
        }

        $to  = []; foreach($data->to as $item) $to[] = $item->value;
        $cc  = []; foreach($data->cc as $item) $cc[] = $item->value;
        $bcc = []; foreach($data->bcc as $item) $bcc[] = $item->value;

        if(count($to) > 0){
            $subject = $sanitizeData->trimData($data->subject);
            if(!$mailerService->sendMail(
                $to,
                $subject,
                $subject,
                'app/email/template/random_classique.html.twig',
                ['subject' => $subject, 'message' => $data->message->html],
                $cc, $bcc, null, $files, $data->from, $data->fromName ?: $data->from
            )) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'to',
                    'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
                ]]);
            }
        }else{
            return $apiResponse->apiJsonResponseBadRequest("Destinataire invalide.");
        }

        $obj = $dataMain->setDataMail(new Mail(), $data);
        $obj = ($obj)
            ->setFiles($filesName)
            ->setUser($this->getUser())
        ;

        $repository->save($obj, true);

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
