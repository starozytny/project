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
        return $this->privateDirectory . $society->getImmoFileFolder();
    }

    public function getSocietyImmoFileLocations(Society $society): string
    {
        return $this->privateDirectory . $society->getImmoFileLocations();
    }

    public function getSocietyImmoFileVentes(Society $society): string
    {
        return $this->privateDirectory . $society->getImmoFileVentes();
    }
}
