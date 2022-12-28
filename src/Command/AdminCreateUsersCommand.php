<?php

namespace App\Command;

use App\Entity\Main\Society;
use App\Entity\Main\User;
use App\Service\Data\DataMain;
use App\Service\DatabaseService;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'admin:create:users',
    description: 'Create users',
)]
class AdminCreateUsersCommand extends Command
{
    private DatabaseService $databaseService;
    private ObjectManager $em;
    private DataMain $dataMain;

    public function __construct(DatabaseService $databaseService, DataMain $dataMain)
    {
        parent::__construct();

        $this->databaseService = $databaseService;
        $this->em = $databaseService->getDefaultManager();
        $this->dataMain = $dataMain;
    }

    protected function configure(): void
    {
        $this
            ->addOption('fake', "f", InputOption::VALUE_NONE, 'Option shit values')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, "default", [
            User::class,
            Society::class,
        ]);

        $io->title('Création de la société Logilink');
        $society = [ "name" => "Logilink", "code" => "999", "manager" => "default" ];

        $society = $this->dataMain->setDataSociety(new Society(), json_decode(json_encode($society)));

        $this->em->persist($society);

        $io->text('Société : Logilink créé' );

        $users = [
            [
                'username' => 'shanbo',
                'firstname' => 'Dev', 'lastname' => 'Shanbora',
                'email' => 'chanbora.chhun@outlook.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN', 'ROLE_DEVELOPER']
            ],
            [
                'username' => 'staro',
                'firstname' => 'Admin', 'lastname' => 'Starozytny',
                'email' => 'starozytny@hotmail.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN']
            ],
            [
                'username' => 'shanks',
                'firstname' => 'User', 'lastname' => 'Shanks',
                'email' => 'shanks@hotmail.fr',
                'roles' => ['ROLE_USER']
            ],
        ];

        $password = password_hash("azerty", PASSWORD_ARGON2I);

        $io->title('Création des utilisateurs');
        foreach ($users as $user) {
            $obj = $this->dataMain->setDataUser(new User(), json_decode(json_encode($user)));
            $obj = ($obj)
                ->setPassword($password)
                ->setManager("default")
                ->setSociety($society)
                ->setManager($society->getManager())
            ;

            $this->em->persist($obj);

            $io->text('USER : ' . $user['username'] . ' créé' );
        }

        if ($input->getOption('fake')) {
            $io->title('Création de 200 utilisateurs lambdas');

            $fake = Factory::create();
            for($i=0; $i<200 ; $i++) {
                $user =  [
                    'username' => $i . $fake->userName,
                    'firstname' => $fake->firstName, 'lastname' => $fake->lastName,
                    'email' => $fake->email,
                    'roles' => ['ROLE_USER']
                ];

                $obj = $this->dataMain->setDataUser(new User(), json_decode(json_encode($user)));
                $obj = ($obj)
                    ->setPassword($password)
                    ->setManager("default")
                    ->setSociety($society)
                    ->setManager($society->getManager())
                ;

                $this->em->persist($obj);
            }
            $io->text('USER : Utilisateurs fake créés' );
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
