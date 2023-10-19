<?php

namespace App\Controller;

use App\Entity\Main\Settings;
use App\Entity\Main\User;
use App\Repository\Main\ChangelogRepository;
use App\Repository\Main\ContactRepository;
use App\Repository\Main\SettingsRepository;
use App\Repository\Main\SocietyRepository;
use App\Repository\Main\UserRepository;
use App\Service\ApiResponse;
use App\Service\MultipleDatabase\MultipleDatabase;
use App\Service\SanitizeData;
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
    public function mails(Request $request, PaginatorInterface $paginator): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $userMail = $user->getUserMail();

        $pagination = null;
        if($userMail){
            $serveur = '{'.$userMail->getHote().':'.$userMail->getPort().'/imap/ssl}INBOX';

            $mailbox = imap_open($serveur, $userMail->getUsername(), $userMail->getPassword());

            if ($mailbox) {
                $emailsId = imap_search($mailbox, 'SINCE "18 October 2023"');

                $emails = [];
                foreach ($emailsId as $email_id) {
                    $header = imap_fetchheader($mailbox, $email_id);
                    $body = $this->get_part($mailbox, $email_id, 'TEXT/HTML');

                    $body = imap_qprint($body);

                    // Faites quelque chose avec les en-têtes et le corps de l'e-mail
                    $emails[] = [
                        'body' => $body
                    ];
                }

                dump($emails);

                $pagination = $paginator->paginate($emails, $request->query->getInt('page', 1), 10);



                imap_close($mailbox);
            }
        }



        return $this->render('admin/pages/mails/index.html.twig', [
            'pagination' => $pagination
        ]);
    }

    function get_mime_type(&$structure) {
        $primary_mime_type = array("TEXT", "MULTIPART", "MESSAGE", "APPLICATION", "AUDIO", "IMAGE", "VIDEO", "OTHER");
        if($structure->subtype) {
            return $primary_mime_type[(int) $structure->type] . '/' . $structure->subtype;
        }
        return "TEXT/PLAIN";
    }


    function get_part($mbox, $i, $mime_type, $structure = false, $part_number = false) {
        if (!$structure) {
            $structure = imap_fetchstructure($mbox, $i);
        }
        if($structure) {
            if($mime_type == $this->get_mime_type($structure)) {
                if(!$part_number) {
                    $part_number = "1";
                }
                $text = imap_fetchbody($mbox, $i, $part_number);
                if($structure->encoding == 3) {
                    return imap_base64($text);
                } else if ($structure->encoding == 4) {
                    return imap_qprint($text);
                } else {
                    return $text;
                }
            }
            if ($structure->type == 1) { /* multipart */
                foreach($structure->parts as $index => $sub_structure){
                    $prefix = "";
                    if ($part_number) {
                        $prefix = $part_number . '.';
                    }
                    $data = $this->get_part($mbox, $i, $mime_type, $sub_structure, $prefix . (@$index + 1));
                    if ($data) {
                        return $data;
                    }
                }
            }
        }
        return false;
    }
}
