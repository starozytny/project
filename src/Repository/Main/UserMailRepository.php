<?php

namespace App\Repository\Main;

use App\Entity\Main\UserMail;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserMail>
 *
 * @method UserMail|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserMail|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserMail[]    findAll()
 * @method UserMail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserMailRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserMail::class);
    }

//    /**
//     * @return UserMail[] Returns an array of UserMail objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?UserMail
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
