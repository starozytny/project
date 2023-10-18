<?php

namespace App\Entity;

use Exception;

class DataEntity
{
    public function initNewDateImmutable(): \DateTimeImmutable
    {
        $createdAt = new \DateTimeImmutable();
        $createdAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        return $createdAt;
    }

    public function initNewDate(): \DateTime
    {
        $createdAt = new \DateTime();
        $createdAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        return $createdAt;
    }

    /**
     * @throws Exception
     */
    public function initToken(): string
    {
        return bin2hex(random_bytes(32));
    }

    public function getFileOrDefault($file, $folder, $default = "/placeholders/placeholder.jpg")
    {
        return $file ? "/" . $folder . "/" . $file : $default;
    }
}
