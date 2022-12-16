<?php

namespace App\Service\Data;

use App\Entity\Main\User;
use App\Service\SanitizeData;

class DataMain
{
    public function __construct(
        private readonly SanitizeData $sanitizeData
    ) {}

    public function setData(User $obj, $data): User
    {
        if (isset($data->roles)) $obj->setRoles($data->roles);

        return ($obj)
            ->setUsername($this->sanitizeData->fullSanitize($data->username))
            ->setFirstname($this->sanitizeData->sanitizeString($data->firstname))
            ->setLastname($this->sanitizeData->sanitizeString($data->lastname))
            ->setEmail($data->email)
            ->setManager($data->default)
        ;
    }
}
