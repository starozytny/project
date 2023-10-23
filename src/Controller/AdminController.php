<?php

namespace App\Controller;

use App\Entity\Main\Mail;
use App\Entity\Main\Settings;
use App\Repository\Main\ChangelogRepository;
use App\Repository\Main\ContactRepository;
use App\Repository\Main\MailRepository;
use App\Repository\Main\SettingsRepository;
use App\Repository\Main\SocietyRepository;
use App\Repository\Main\UserRepository;
use App\Service\ApiResponse;
use App\Service\MultipleDatabase\MultipleDatabase;
use App\Service\SanitizeData;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
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

    #[Route('/settings/setting/modifier', name: 'settings_update', options: ['expose' => true], methods: ['GET', 'POST'])]
    public function settings(Request $request, SettingsRepository $repository, SerializerInterface $serializer,
                             ApiResponse $apiResponse, SanitizeData $sanitizeData, SocietyRepository $societyRepository,
                             MultipleDatabase $multipleDatabase, ValidatorService $validator): Response
    {
        $settings = $repository->findAll();
        $settings = $settings ? $settings[0] : [];

        if($request->isMethod('POST')){
            $data = json_decode($request->get('data'));
            $file = $request->files->get('logo');
            if($data === null){
                return $apiResponse->apiJsonResponseBadRequest("Il manque des données");
            }

            $logo = $settings->getLogoMail();
            if($file){
                $extension = pathinfo(parse_url($file, PHP_URL_PATH), PATHINFO_EXTENSION);
                $img = file_get_contents($file);
                $base64 = base64_encode($img);

                $logo = "data:image/" . $extension . ';base64,' . $base64;
            }

            $isMultipleDatabase = (int) $data->multipleDatabase[0];
            $prefix = $isMultipleDatabase ? $sanitizeData->trimData($data->prefixDatabase) : "";
            $prefix = $prefix ? strtolower($prefix) : "";

            $settings = ($settings)
                ->setWebsiteName($sanitizeData->trimData($data->websiteName))
                ->setEmailGlobal($sanitizeData->trimData($data->emailGlobal))
                ->setEmailContact($sanitizeData->trimData($data->emailContact))
                ->setEmailRgpd($sanitizeData->trimData($data->emailRgpd))
                ->setLogoMail($logo)
                ->setUrlHomepage($this->generateUrl('app_homepage', [], UrlGeneratorInterface::ABSOLUTE_URL))
                ->setMultipleDatabase($isMultipleDatabase)
                ->setPrefixDatabase($prefix)
            ;

            if($isMultipleDatabase){
                foreach($societyRepository->findAll() as $society){
                    $manager = $prefix . $society->getCode();
                    $multipleDatabase->updateManager($settings, $society->getCode(), $society->getCode());

                    $society->setManager($manager);
                    $society->setIsActivated(false);

                    foreach($society->getUsers() as $user){
                        $user->setManager($manager);
                    }
                }
            }

            $noErrors = $validator->validate($settings);
            if ($noErrors !== true) {
                return $apiResponse->apiJsonResponseValidationFailed($noErrors);
            }

            $repository->save($settings, true);
            return $apiResponse->apiJsonResponseSuccessful("Paramètres mis à jours");
        }

        return $this->render('admin/pages/settings/update.html.twig', [
            'obj' => $serializer->serialize($settings, 'json', ['groups' => Settings::FORM]),
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

    #[Route('/mails', name: 'mails_index')]
    public function mails(Request $request, MailRepository $repository, SerializerInterface $serializer,
                          PaginatorInterface $paginator, SettingsService $settingsService): Response
    {
        $mails = $repository->findBy([], ['createdAt' => 'DESC']);

        $pagination = $paginator->paginate($mails, $request->query->getInt('page', 1), 10);

        $data = $serializer->serialize($pagination->getItems(), 'json', ['groups' => Mail::LIST]);

        return $this->render('admin/pages/mails/index.html.twig', [
            'data' => $data,
            'pagination' => $pagination,
            'from' => $settingsService->getEmailExpediteurGlobal(),
            'fromName' => $settingsService->getWebsiteName()
        ]);
    }
}
