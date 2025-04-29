<?php

namespace App\Service\Data;

use App\Entity\Immo\ImDemande;
use App\Service\SanitizeData;

class DataImmo
{
    public function __construct(
        private readonly SanitizeData $sanitizeData
    ) {}

    public function setDataDemande(ImDemande $obj, $data): ImDemande
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setFirstname($this->sanitizeData->trimData($data->firstname))
            ->setEmail($this->sanitizeData->trimData($data->email))
            ->setPhone($this->sanitizeData->trimData($data->phone))
            ->setMessage($this->sanitizeData->trimData($data->message))
            ->setToEmail($this->sanitizeData->trimData($data->toEmail))
            ->setSlug($this->sanitizeData->trimData($data->slug))
            ->setBienId($this->sanitizeData->trimData($data->bienId))
            ->setPrice((float) $data->price)
            ->setLibelle($this->sanitizeData->trimData($data->libelle))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setTypeAd($this->sanitizeData->trimData($data->typeAd))
            ->setTypeBien($this->sanitizeData->trimData($data->typeBien))
            ->setReference($this->sanitizeData->trimData($data->reference))
        ;
    }
}
