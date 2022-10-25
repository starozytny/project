<?php

namespace App\Command;

use App\Entity\User;
use App\Services\DatabaseService;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
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
        $this->databaseService->resetTable($io, "default", [
            User::class,
        ]);
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
            $new = (new User())
                ->setUsername($user['username'])
                ->setRoles($user['roles'])
                ->setPassword($password)
            ;

            $this->em->persist($new);
            $io->text('USER : ' . $user['username'] . ' créé' );
        }

        $this->em->flush();

        return Command::SUCCESS;
    }
}
