<?php

namespace App\Controller\Api\Immo;

use App\Repository\Main\SocietyRepository;
use App\Service\FileUploader;
use App\Service\Immo\ImmoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;

#[Route('/api/immo/lotys', name: 'api_immo_')]
class ImmoController extends AbstractController
{
    /**
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/import/{codeSociety}', name: 'import', methods: 'POST')]
    public function import(Request      $request, $codeSociety, SocietyRepository $repository, ImmoService $immoService,
                           FileUploader $fileUploader): Response
    {
        $society = $repository->findOneBy(['code' => $codeSociety]);

        if (!$society) {
            return $this->json('Accès interdit.', 401);
        }

        $data = json_decode($request->getContent());

        if (!$data) {
            return $this->json('Mauvaise réponse de Lotys.', 400);
        }

        $directoryPhotos = FileUploader::FOLDER_IMMO_ADS . $society->getDirname() . '/';
        $directoryLogos = FileUploader::FOLDER_IMMO_LOGOS . $society->getDirname() . '/';
        if(!is_dir($directoryPhotos)){
            mkdir($directoryPhotos, 0777, true);
        }
        if(!is_dir($directoryLogos)){
            mkdir($directoryLogos, 0777, true);
        }

        if ($this->getParameter('app_env') == "prod") {
            // download photos and logos
            [$tmp, $photosAlive, $logosAlive] = $this->downloadFiles($fileUploader, $data, $directoryPhotos, $directoryLogos);

            // remove old photos and logos
            $this->removeOldFiles($photosAlive, $directoryPhotos);
            $this->removeOldFiles($logosAlive, $directoryLogos);
        }else{
            $tmp = $data;
        }

        $ventes = [];
        $locations = [];
        foreach ($tmp as $item) {
            if ($item->isLocation) {
                $locations[] = $item;
            } else {
                $ventes[] = $item;
            }
        }

        $folder = $immoService->getSocietyImmoFileFolder($society);
        if (!file_exists($folder)) {
            mkdir($folder, 0755, true);
        }

        file_put_contents($immoService->getSocietyImmoFileLocations($society), json_encode($locations));
        file_put_contents($immoService->getSocietyImmoFileVentes($society), json_encode($ventes));

        return $this->json('Données mise à jour.');
    }

    private function downloadFiles(FileUploader $fileUploader, $data, $directoryPhotos, $directoryLogos): array
    {
        $baseUrl = "https://lotys.fr";

        $tmp = [];
        $photosAlive = [];
        $logosAlive = [];
        foreach ($data as $item) {
            $tmpPhotos = [];
            $mainPhotoFile = $item->mainPhotoFile;
            foreach ($item->photos as $photo) {
                $url = $baseUrl . $photo->photoFile;

                $filename = $fileUploader->getFilenameFromUrl($url);
                if (!file_exists($directoryPhotos . $filename)) {
                    $filename = $fileUploader->downloadImgFromURL($url, $directoryPhotos);
                }
                $photosAlive[] = $filename;

                $photo->photoFile = "/" . $directoryPhotos . $filename;
                $tmpPhotos[] = $photo;

                if ($photo->rank == 1) {
                    $mainPhotoFile = $photo->photoFile;
                }
            }
            $item->mainPhotoFile = $mainPhotoFile;
            $item->photos = $tmpPhotos;

            $urlLogo = $baseUrl . $item->agency->logoFile;
            $logoFilename = $fileUploader->getFilenameFromUrl($urlLogo);
            if (!file_exists($directoryLogos . $logoFilename)) {
                $logoFilename = $fileUploader->downloadImgFromURL($urlLogo, $directoryLogos);
            }
            $logosAlive[] = $logoFilename;

            $item->agency->logoFile = "/" . $directoryLogos . $logoFilename;

            $tmp[] = $item;
        }

        return [$tmp, $photosAlive, $logosAlive];
    }

    private function removeOldFiles(array $items, string $directory): void
    {
        foreach (scandir($directory) as $entry) {
            if ($entry != "." && $entry != "..") {
                $find = null;
                foreach ($items as $item) {
                    if ($entry == $item) {
                        $find = $entry;
                    }
                }

                if (!$find) {
                    $file = $directory . $entry;
                    if (file_exists($file)) {
                        unlink($file);
                    }
                }
            }
        }
    }
}
