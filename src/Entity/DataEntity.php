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

    /**
     * encrypt or decrypt
     *
     * @param $action
     * @param $data
     * @return false|string|void
     */
    public function crypt($action, $data)
    {
        $data = trim($data);
        $data = preg_replace('/\s+/', '', $data);

        $method = 'aes-256-cbc';
        $passBank = "shanboHelpsdff89*ù^@rt.569!4*+(=)";
        $passBank = substr(hash('sha256', $passBank, true), 0, 32);
        $iv = chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0);

        if ($action == 'encrypt') {
            return base64_encode(openssl_encrypt($data, $method, $passBank, OPENSSL_RAW_DATA, $iv));
        } elseif ($action == 'decrypt') {
            return openssl_decrypt(base64_decode($data), $method, $passBank, OPENSSL_RAW_DATA, $iv);
        }
    }
}
