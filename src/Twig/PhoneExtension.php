<?php


namespace App\Twig;


use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class PhoneExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('phone', [$this, 'formatPhone'])
        ];
    }

    public function formatPhone($arg1): string
    {
        $arg1 = str_replace('.', '', $arg1);
        $arg1 = str_replace(' ', '', $arg1);
        $arg1 = preg_replace("/[a-zA-Z:()]/", "", $arg1);
        if(strlen($arg1) < 10){
            return "";
        }
        $arg1 = substr($arg1,0,10);
        $a = substr($arg1,0,2);
        $b = substr($arg1,2,2);
        $c = substr($arg1,4,2);
        $d = substr($arg1,6,2);
        $e = substr($arg1,8,2);

        return $a . ' ' . $b . ' ' . $c . ' ' . $d . ' ' . $e;
    }
}
