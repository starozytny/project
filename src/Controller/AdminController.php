<?php

namespace App\Controller;

use App\Entity\Main\Settings;
use App\Repository\Main\ChangelogRepository;
use App\Repository\Main\ContactRepository;
use App\Repository\Main\SettingsRepository;
use App\Repository\Main\SocietyRepository;
use App\Repository\Main\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin', name: 'admin_')]
class AdminController extends AbstractController
{
    #[Route('/', name: 'homepage')]
    public function index(SettingsRepository $settingsRepository, SocietyRepository $societyRepository,
                          UserRepository $userRepository, ContactRepository $contactRepository,
                          ChangelogRepository $changelogRepository): Response
    {
        $settings = $settingsRepository->findAll();
        $settings = count($settings) != 0 ? $settings[0] : null;

        $users = $userRepository->findAll();
        $usersConnected = 0;
        foreach($users as $user){
            if($user->getLastLoginAt()) $usersConnected++;
        }

        $contacts = $contactRepository->findAll();
        $contactsNew = 0;
        foreach($contacts as $contact){
            if($contact->isSeen()) $contactsNew++;
        }

        $changelogs = $changelogRepository->findBy(['isPublished' => true], ['createdAt' => 'ASC'], 5);

        return $this->render('admin/pages/index.html.twig', [
            'settings' => $settings,
            'nbSocieties' => count($societyRepository->findAll()),
            'nbUsers' => count($users),
            'nbUsersConnected' => $usersConnected,
            'nbContacts' => count($contacts),
            'nbContactsNew' => $contactsNew,
            'changelogs' => $changelogs,
        ]);
    }

    #[Route('/settings/setting/modifier', name: 'settings_update')]
    public function settings(SettingsRepository $repository, SerializerInterface $serializer): Response
    {
        $settings = $repository->findAll();

        return $this->render('admin/pages/settings/update.html.twig', [
            'obj' => $serializer->serialize($settings ? $settings[0] : [], 'json', ['groups' => Settings::FORM]),
        ]);
    }

    #[Route('/stockage', name: 'storage_index')]
    public function storage(): Response
    {
        $finder = new Finder();

        $finder->directories()->in($this->getParameter('private_directory'))->depth('== 0');

        $directories = [];
        if($finder->hasResults()){
            foreach ($finder as $file) {
                $directories[] = [
                    'name' => $file->getRelativePathname(),
                    'timeAt' => $file->getATime(),
                    'size' => $file->getSize()
                ];
            }
        }

        return $this->render('admin/pages/storage/index.html.twig', [
            'directories' => json_encode($directories)
        ]);
    }
}
