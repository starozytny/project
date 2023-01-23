<?php

namespace App\Command;

use App\Entity\Main\Settings;
use App\Service\DatabaseService;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'admin:create:settings',
    description: 'Create settings',
)]
class AdminCreateSettingsCommand extends Command
{
    private DatabaseService $databaseService;
    private ObjectManager $em;

    public function __construct(DatabaseService $databaseService)
    {
        parent::__construct();

        $this->databaseService = $databaseService;
        $this->em = $databaseService->getDefaultManager();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, "default", [Settings::class]);

        $io->title('Création des paramètres du site');
        $obj = (new Settings())
            ->setWebsiteName("Site")
            ->setEmailGlobal("chanbora@logilink.fr")
            ->setEmailContact("chanbora@logilink.fr")
            ->setEmailRgpd("chanbora@logilink.fr")
            ->setLogoMail("")
            ->setUrlHomepage("")
            ->setMultipleDatabase(false)
        ;

        $this->em->persist($obj);

        $io->text('Settings : Paramètre créé' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
