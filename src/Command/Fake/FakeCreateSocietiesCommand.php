<?php

namespace App\Command\Fake;

use App\Entity\Main\Society;
use App\Service\Data\DataMain;
use App\Service\DatabaseService;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'fake:create:societies',
    description: 'Create fake societies',
)]
class FakeCreateSocietiesCommand extends Command
{
    private ObjectManager $em;
    private DataMain $dataMain;

    public function __construct(DatabaseService $databaseService, DataMain $dataMain)
    {
        parent::__construct();

        $this->em = $databaseService->getDefaultManager();
        $this->dataMain = $dataMain;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $logilink = $this->em->getRepository(Society::class)->findOneBy(['code' => 999]);
        $societies = $this->em->getRepository(Society::class)->findAll();
        foreach($societies as $society){
            $users = $society->getUsers();
            foreach($users as $user){
                $user->setSociety($logilink);
            }

            if($society->getCode() != 999){
                $this->em->remove($society);
            }
        }
        $this->em->flush();

        $io->title('Création de 200 societes lambdas');
        $fake = Factory::create();
        for($i=1; $i<=200 ; $i++) {
            $code = $i;
            if($code < 10){
                $code = "00" . $code;
            }elseif($code < 100){
                $code = "0" . $code;
            }

            $obj =  [
                'name' => $fake->company,
                'code' => $code,
                'manager' => 'default'
            ];

            $obj = $this->dataMain->setDataSociety(new Society(), json_decode(json_encode($obj)));

            $this->em->persist($obj);
        }
        $io->text('SOCIETY : Société fake créées' );
        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
