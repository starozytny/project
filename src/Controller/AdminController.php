<?php

namespace App\Controller;

use App\Entity\Main\Settings;
use App\Repository\Main\ChangelogRepository;
use App\Repository\Main\ContactRepository;
use App\Repository\Main\SettingsRepository;
use App\Repository\Main\SocietyRepository;
use App\Repository\Main\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
        return $this->render('admin/pages/storage/index.html.twig');
    }

    #[Route('/styleguide', name: 'styleguide_index')]
    public function styleguide(): Response
    {
        return $this->render('admin/pages/styleguide/index.html.twig');
    }
}
