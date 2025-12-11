<?php

namespace App\Service;

use App\Entity\Main\Society;
use App\Entity\Main\User;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Security\Core\User\UserInterface;

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

    public function getManagerByUser(User|UserInterface $user): ObjectManager
    {
        return $this->registry->getManager($user->getManager());
    }

    public function getManagerBySociety(Society $society): ObjectManager
    {
        return $this->registry->getManager($society->getManager());
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
