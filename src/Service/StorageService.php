<?php

namespace App\Service;

use DateTime;
use Exception;
use SplFileInfo;
use Symfony\Component\Finder\Finder;

class StorageService
{
    private string $privateDirectory;

    public function __construct($privateDirectory)
    {
        $this->privateDirectory = $privateDirectory;
    }

    public function getDirectories($in): array
    {
        $finderDirs = new Finder();
        $finderFils = new Finder();

        $finderDirs->directories()->in($this->privateDirectory . $in)->depth('== 0');
        $directories = $this->getData($finderDirs, $in);

        $finderFils->files()->in($this->privateDirectory . $in)->depth('== 0');
        $files = $this->getData($finderFils, $in);

        return [$directories, $files];
    }

    /**
     * @throws Exception
     */
    private function setData($in, SplFileInfo $file): array
    {
        $dateAt = new DateTime();
        $dateAt->setTimestamp($file->getATime());

        return [
            'path' => $in . "/" . $file->getRelativePathname(),
            'name' => $file->getRelativePathname(),
            'dateAt' => $dateAt,
            'size' => $file->getSize(),
            'icon' => $file->getType() == "dir" ? "folder" : $this->getIcon($file->getExtension())
        ];
    }

    /**
     * @throws Exception
     */
    private function getData(Finder $finder, $in): array
    {
        $data = [];
        if($finder->hasResults()){
            foreach ($finder as $file) {
                $data[] = $this->setData($in, $file);
            }
        }

        return $data;
    }

    private function getIcon($extension): string
    {
        return match ($extension) {
            "jpg", "png", "svg", "gif", "jpeg" => "image",
            "json" => "document",
            default => "file"
        };
    }
}
