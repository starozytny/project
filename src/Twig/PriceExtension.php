<?php


namespace App\Twig;


use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class PriceExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('price', [$this, 'formatPrice'])
        ];
    }

    public function formatPrice($arg1)
    {
        if($arg1 == null){
            return "";
        }
        if(is_string($arg1)){
            $arg1 = (float) $arg1;
        }

        $arg1 = number_format($arg1, 2, ",", ' ');
        $arg1 = str_replace('.00','', $arg1);

        return str_replace(',00','', $arg1);
    }
}
