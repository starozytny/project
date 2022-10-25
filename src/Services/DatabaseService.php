<?php

namespace App\Services;

use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Style\SymfonyStyle;

class DatabaseService
{
    private ManagerRegistry $registry;

    public function __construct(ManagerRegistry $registry)
    {
        $this->registry = $registry;
    }

    public function getDefaultManager(): ObjectManager
    {
        return $this->registry->getManager();
    }

    public function resetTable(SymfonyStyle $io, $manager, $list): void
    {
        $em = $this->registry->getManager($manager);

        foreach ($list as $item) {
            $objs = $em->getRepository($item)->findAll();
            foreach($objs as $obj){
                $em->remove($obj);
            }

            $em->flush();
        }
        $io->text('Reset [OK]');
    }
}
