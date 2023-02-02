<?php

namespace App\Command\Donnees;

use App\Entity\Main\Help\HeCategory;
use App\Entity\Main\Help\HeQuestion;
use App\Service\Data\DataMain;
use App\Service\DatabaseService;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'donnees:init:faq',
    description: 'Init data faq',
)]
class DonneesInitFaqCommand extends Command
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

        $io->title('Initialisation des données de FAQ');
        $data =  [
            [
                'rank' => 1,
                'icon' => "settings",
                'name' => "Paramètres",
                'subtitle' => "Fonctionnement des paramètres",
                'visibility' => HeCategory::VISIBILITY_ALL
            ],
            [
                'rank' => 2,
                'icon' => "bank",
                'name' => "Société",
                'subtitle' => "Fonctionnement des sociétés",
                'visibility' => HeCategory::VISIBILITY_ALL
            ],
            [
                'rank' => 3,
                'icon' => "group",
                'name' => "Utilisateurs",
                'subtitle' => "Fonctionnement des utilisateurs",
                'visibility' => HeCategory::VISIBILITY_ALL
            ],
            [
                'rank' => 4,
                'icon' => "follow",
                'name' => "Changelogs",
                'subtitle' => "Fonctionnement des changelogs",
                'visibility' => HeCategory::VISIBILITY_ALL
            ],
        ];

        foreach($data as $obj){
            $obj = $this->dataMain->setDataHeCategory(new HeCategory(), json_decode(json_encode($obj)));

            $this->em->persist($obj);
        }
        $io->text('Categories : Initialisation terminée.' );
        $this->em->flush();

        $catParams      = $this->em->getRepository(HeCategory::class)->findOneBy(['rank' => 1]);
        $catSocieties   = $this->em->getRepository(HeCategory::class)->findOneBy(['rank' => 2]);
        $catUsers       = $this->em->getRepository(HeCategory::class)->findOneBy(['rank' => 3]);
        $catChangelogs  = $this->em->getRepository(HeCategory::class)->findOneBy(['rank' => 4]);

        $data =  [
            [
                'category' => $catParams->getId(),
                'name' => "A quoi correspond les emails ?",
                'content' => ["html" => "
                    L'email <b>global</b> est utilisé lors des envois de mails si aucun expéditeur n'est renseigné. <br>
                    L'email <b>contact</b> est utilisé en tant qu'expéditeur et destinataire des messages du formulaire de contact <br>
                    L'email <b>RGPD</b> n'est pas encore utilisé car nous n'utilisons plus le formulaire RGPD pour le moment.
                "],
            ],
            [
                'category' => $catSocieties->getId(),
                'name' => "A quoi correspond la colonne Manager ?",
                'content' => ["html" => "
                    Cette valeur est utilisée lorsque le site est en mode <b>Multiple base de données</b>. Elle permet 
                    de faire le pont entre les données et la base de donnée unique de la société.
                "],
            ],
            [
                'category' => $catUsers->getId(),
                'name' => "Comment générer un nouveau mot de passe pour un utilisateur",
                'content' => ["html" => "
                    Deux possibilités s'offrent à vous.
                    <ol>
                       <li>Utiliser le formulaire de mot de passe oublié.</li>
                       <li>Utiliser le générateur de mot de passe dans la liste des utilisateurs.</li>
                    </ol>
                "],
            ],
            [
                'category' => $catChangelogs->getId(),
                'name' => "A quoi sert les changelogs ?",
                'content' => ["html" => "
                    Ce sont des notes visibles généralement sur le dashboard pour informer tous les utilisateurs des 
                    différentes mises à jours.
                "],
            ],
        ];

        foreach($data as $obj){
            $json = json_decode(json_encode($obj));
            $obj = $this->dataMain->setDataHeQuestion(new HeQuestion(), $json);
            $category = match($json->category) {
                1 => $catParams,
                2 => $catSocieties,
                3 => $catUsers,
                4 => $catChangelogs,
            };
            $obj->setCategory($category);

            $this->em->persist($obj);
        }

        $io->text('Questions : Initialisation terminée.' );
        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
