<?php

namespace App\Service\Immo;

use App\Entity\Main\Society;

class ImmoService
{
    private string $privateDirectory;

    public function __construct($privateDirectory)
    {
        $this->privateDirectory = $privateDirectory;
    }

    public function getSocietyImmoFileFolder(Society $society): string
    {
        return $this->privateDirectory . Society::FOLDER_IMMO . '/' . $society->getCode() . '/';
    }

    public function getSocietyImmoFileLocations(Society $society): string
    {
        return $this->privateDirectory . Society::FOLDER_IMMO . '/' . $society->getCode() . '/locations.json';
    }

    public function getSocietyImmoFileVentes(Society $society): string
    {
        return $this->privateDirectory . Society::FOLDER_IMMO . '/' . $society->getCode() . '/ventes.json';
    }
}
