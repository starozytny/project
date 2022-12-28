<?php

namespace App\Service\Data;

use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Service\SanitizeData;

class DataMain
{
    public function __construct(
        private readonly SanitizeData $sanitizeData
    ) {}

    public function setDataUser(User $obj, $data): User
    {
        if (isset($data->roles)) $obj->setRoles($data->roles);

        return ($obj)
            ->setUsername($this->sanitizeData->fullSanitize($data->username))
            ->setFirstname($this->sanitizeData->sanitizeString($data->firstname))
            ->setLastname($this->sanitizeData->sanitizeString($data->lastname))
            ->setEmail($data->email)
        ;
    }

    public function setDataSociety(Society $obj, $data): Society
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setCode($this->sanitizeData->trimData($data->code))
            ->setManager($this->sanitizeData->trimData($data->manager))
        ;
    }
}
