<?php


namespace App\Service;


use App\Entity\Enum\Image\ImageType;
use App\Entity\Main\Agenda\AgEvent;
use App\Entity\Main\Changelog;
use App\Entity\Main\Image;
use App\Repository\Main\ImageRepository;
use Exception;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader
{
    const FOLDER_IMMO_ADS  = "immo/photos/";
    const FOLDER_IMMO_LOGOS = "immo/logos/";

    private string $publicDirectory;
    private string $privateDirectory;
    private SluggerInterface $slugger;

    public function __construct($publicDirectory, $privateDirectory, SluggerInterface $slugger)
    {
        $this->publicDirectory = $publicDirectory;
        $this->privateDirectory = $privateDirectory;
        $this->slugger = $slugger;
    }

    public function upload(UploadedFile $file, $folder=null, $isPublic=true): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            $directory = $isPublic ? $this->getPublicDirectory() : $this->getPrivateDirectory();
            $directory = $directory . '/' . $folder;

            if($directory){
                if(!is_dir($directory)){
                    mkdir($directory, 0777, true);
                }
            }

            $file->move($directory, $fileName);
        } catch (FileException $e) {
            return false;
        }

        return $fileName;
    }

    public function deleteFile($fileName, $folderName, $isPublic = true): void
    {
        if($fileName){
            $file = $this->getDirectory($isPublic) . $folderName . '/' . $fileName;
            if(file_exists($file)){
                unlink($file);
            }
        }
    }

    public function replaceFile($file, $folderName, $oldFileName = null, $isPublic = true): ?string
    {
        if($file){
            if($oldFileName){
                $oldFile = $this->getDirectory($isPublic) . $folderName . '/' . $oldFileName;

                $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                if(file_exists($oldFile) && $fileName !== $oldFileName){
                    unlink($oldFile);
                }
            }

            return $this->upload($file, $folderName, $isPublic);
        }

        return null;
    }

    private function getDirectory($isPublic): string
    {
        $path = $this->privateDirectory;
        if($isPublic){
            $path = $this->publicDirectory;
        }

        return $path;
    }

    public function getPublicDirectory(): string
    {
        return $this->publicDirectory;
    }

    public function getPrivateDirectory(): string
    {
        return $this->privateDirectory;
    }

    public function uploadTinyMCE(Request $request, ImageRepository $repository, $type, $identifiant = null): JsonResponse
    {
        $file = $request->files->get('file');
        if($file){
            $folder = match ($type){
                ImageType::Changelog => Changelog::FOLDER,
                ImageType::AgEvent => AgEvent::FOLDER,
            };

            $fileName = $this->replaceFile($file, $folder);

            $obj = (new Image())
                ->setType($type)
                ->setName($fileName)
                ->setIdentifiant($identifiant)
            ;

            $repository->save($obj, true);

            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? "https://" : "http://";
            return new JsonResponse([
                'success' => true,
                'location' => $protocol . $request->getHttpHost() . '/' . $folder . '/' . $fileName
            ]);
        }

        return new JsonResponse(['success' => false,]);
    }

    public function getFilenameFromUrl($url): string
    {
        return substr($url, strripos($url, "/")+1 , strlen($url));
    }

    public function downloadImgFromURL($url, $destinationFolder): ?string
    {
        try{
            if(!is_dir($destinationFolder)){
                mkdir($destinationFolder, 0777, true);
            }
            $current = file_get_contents($url);
            $filename = $this->getFilenameFromUrl($url);
            $file = $destinationFolder.$filename;
            file_put_contents($file, $current);

            return $filename;
        }catch (Exception $e){
            return null;
        }
    }
}
