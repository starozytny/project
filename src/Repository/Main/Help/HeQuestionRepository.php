<?php

namespace App\Repository\Main\Help;

use App\Entity\Main\Help\HeQuestion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<HeQuestion>
 *
 * @method HeQuestion|null find($id, $lockMode = null, $lockVersion = null)
 * @method HeQuestion|null findOneBy(array $criteria, array $orderBy = null)
 * @method HeQuestion[]    findAll()
 * @method HeQuestion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HeQuestionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, HeQuestion::class);
    }

    public function save(HeQuestion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(HeQuestion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return HeQuestion[] Returns an array of HeQuestion objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('h')
//            ->andWhere('h.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('h.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?HeQuestion
//    {
//        return $this->createQueryBuilder('h')
//            ->andWhere('h.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
