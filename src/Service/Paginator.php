<?php

namespace App\Service;

use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;

class Paginator
{
    private PaginatorInterface $paginator;

    public function __construct(PaginatorInterface $paginator)
    {
        $this->paginator = $paginator;
    }

    public function paginate(Request $request, $data, $tot = 20): PaginationInterface
    {
        return $this->paginator->paginate(
            $data,
            $request->query->getInt('page', 1),
            $tot
        );
    }
}
