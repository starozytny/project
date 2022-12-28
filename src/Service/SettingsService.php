<?php


namespace App\Service;


use App\Entity\Main\Settings;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class SettingsService
{
    private ObjectManager $em;

    public function __construct(ManagerRegistry $registry)
    {
        $this->em = $registry->getManager();
    }

    public function getSettings(){
        $set = $this->em->getRepository(Settings::class)->findAll();
        if(count($set) == 0){
            throw new BadRequestException('[Erreur] Les paramètres ne sont pas à jour.');
        }

        return $set[0];
    }

    public function getWebsiteName(): ?string
    {
        $setting = $this->getSettings();

        return $setting->getWebsiteName();
    }

    public function getEmailExpediteurGlobal(): ?string
    {
        $setting = $this->getSettings();

        return $setting->getEmailGlobal();
    }

    public function getEmailContact(): ?string
    {
        $setting = $this->getSettings();

        return $setting->getEmailContact();
    }

    public function getEmailRgpd(): ?string
    {
        $setting = $this->getSettings();

        return $setting->getEmailRgpd();
    }
}
