<?php

namespace App\Command\Fake;

use App\Entity\Main\Changelog;
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
    name: 'fake:create:changelogs',
    description: 'Create fake changelogs',
)]
class FakeCreateChangelogsCommand extends Command
{
    private ObjectManager $em;
    private DataMain $dataMain;
    private DatabaseService $databaseService;

    public function __construct(DatabaseService $databaseService, DataMain $dataMain)
    {
        parent::__construct();

        $this->em = $databaseService->getDefaultManager();
        $this->dataMain = $dataMain;
        $this->databaseService = $databaseService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, "default", [Changelog::class]);

        $io->title('Création de 200 changelogs lambdas');
        $fake = Factory::create();
        for($i=1; $i<=200 ; $i++) {
            $obj =  [
                'name' => $fake->company,
                'type' => $fake->numberBetween(0, 2),
                'content' => ["html" => $fake->text]
            ];

            $obj = $this->dataMain->setDataChangelog(new Changelog(), json_decode(json_encode($obj)));
            $obj->setIsPublished(true);

            $this->em->persist($obj);
        }
        $io->text('CHANGELOGS : Changelog fake créées' );
        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
