<?php

namespace App\Command\MultipleDatabase;

use App\Entity\Main\Society;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\ExceptionInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'admin:database:update',
    description: 'Update databases when multiple databases',
)]
class AdminDatabaseUpdateCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();

        $this->em = $entityManager;
    }

    protected function configure(): void
    {
        $this
            ->addOption('test', "t", InputOption::VALUE_NONE, 'For test')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $isTest = $input->getOption('test');

        $societies = $this->em->getRepository(Society::class)->findBy(['isActivated' => true]);
        foreach($societies as $society){
            if(!$isTest || $society->getCode() == 999){
                $command = $this->getApplication()->find('doctrine:schema:update');

                $arguments = [
                    '--em' => $society->getManager(),
                    '--force' => true,
                    '--complete' => true,
                ];

                if ($isTest) {
                    $arguments['--env'] = 'test';
                }

                $input = new ArrayInput($arguments);
                $bufferedOutput = new BufferedOutput();

                try {
                    $returnCode = $command->run($input, $bufferedOutput);

                    if ($returnCode === 0) {
                        $io->text($bufferedOutput->fetch());
                    } else {
                        $io->text($bufferedOutput->fetch());
                    }
                } catch (\Exception $e) {
                    $io->error('Erreur mise à jour schéma : ' . $e->getMessage());
                } catch (ExceptionInterface $e) {
                    $io->error("Erreur: {$e->getMessage()}");
                }
            }
        }

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
