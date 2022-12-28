<?php


namespace App\Service;


use Symfony\Bridge\Twig\Mime\TemplatedEmail;
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

    public function sendMail($to, $subject, $text, $html, $params, $from=null, $fromName=null, $replyTo=null, $cc1=null, $cc2=null): bool|string
    {
        $from = ($from == null) ? $this->settingsService->getEmailExpediteurGlobal() : $from;
        $fromName = ($fromName == null) ? $this->settingsService->getWebsiteName() : $fromName;

        $email = (new TemplatedEmail())
            ->from(new Address($from, $fromName))
            ->to(new Address($to))
            ->subject($subject)
            ->text($text)
            ->htmlTemplate($html)
            ->context($params)
        ;

        if($replyTo) $email->replyTo($replyTo);

        if($cc1 && $cc2){
            $email->cc($cc1, $cc2);
        }else if($cc1){
            $email->cc($cc1);
        }else if($cc2){
            $email->cc($cc2);
        }

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }
}
