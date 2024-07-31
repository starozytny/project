<?php


namespace App\Service;


class ApiConnect
{
    public function __construct(private readonly string $urlLotys)
    {
    }

    public function getUrlLotys(): string
    {
        return $this->urlLotys;
    }
}
