<?php


namespace App\Service;


use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader
{
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


}
