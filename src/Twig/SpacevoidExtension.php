<?php


namespace App\Twig;


use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class SpacevoidExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('spacevoid', [$this, 'spaceVoid'])
        ];
    }

    public function spaceVoid($arg1): string
    {
        if($arg1 == "" || $arg1 == null){
            return "&nbsp;";
        }

        return $arg1;
    }
}
