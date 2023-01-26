<?php


namespace App\Twig;


use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class PlurialExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('plurial', [$this, 'formatPlurial'])
        ];
    }

    public function formatPlurial($arg1): string
    {
        if(is_int($arg1)){
            return $arg1 > 1 ? "s" : "";
        }else if(is_string($arg1)){
            $arg1 = (int) $arg1;
        }

        return $arg1 > 1 ? "s" : "";
    }
}
