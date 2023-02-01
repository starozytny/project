<?php


namespace App\Service;


use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class MailerService
{
    private MailerInterface $mailer;
    private SettingsService $settingsService;

    public function __construct(MailerInterface $mailer, SettingsService $settingsService)
    {
        $this->mailer = $mailer;
        $this->settingsService = $settingsService;
    }

    public function sendMail(array $to, $subject, $text, $html, $params, $cc=[], $cci=[], $replyTo=null, $files = [], $from=null, $fromName=null): bool|string
    {
        $from = ($from == null) ? $this->settingsService->getEmailExpediteurGlobal() : $from;
        $fromName = ($fromName == null) ? $this->settingsService->getWebsiteName() : $fromName;

        $email = (new TemplatedEmail())
            ->from(new Address($from, $fromName))
            ->subject($subject)
            ->text($text)
            ->htmlTemplate($html)
            ->context($params)
        ;

        $i = 0;
        foreach($to as $item){
            if($i == 0) $email->to(new Address($item));
            else $email->addTo(new Address($item));
            $i++;
        }

        if($replyTo) $email->replyTo($replyTo);

        $i = 0;
        foreach($cc as $item){
            if($i == 0) $email->cc(new Address($item));
            else $email->addCc(new Address($item));
            $i++;
        }

        $i = 0;
        foreach($cci as $item){
            if($i == 0) $email->bcc(new Address($item));
            else $email->addBcc(new Address($item));
            $i++;
        }

        /** @var UploadedFile $file */
        foreach($files as $file){
            $email->attachFromPath($file);
        }

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }
}
