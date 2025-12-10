<?php

namespace App\Service\MultipleDatabase;

use App\Entity\Main\Society;
use Doctrine\ORM\EntityManagerInterface;
use PDO;
use Symfony\Component\Yaml\Yaml;

class MultipleDatabase
{
    private string $configDirectory;
    private string $envFile;
    private EntityManagerInterface $em;

    public function __construct($configDirectory, $envFile, EntityManagerInterface $entityManager)
    {
        $this->configDirectory = $configDirectory;
        $this->envFile = $envFile;
        $this->em = $entityManager;
    }

    public function createManager(string $code, bool $force): bool
    {
        if (!$force) {
            $society = $this->em->getRepository(Society::class)->findOneBy(['code' => $code]);
            if($society){
                return false;
            }
        }

        //vars
        $host = $_ENV['DATABASE_HOST'];
        $username = $_ENV['DATABASE_USER'];
        $password = $_ENV['DATABASE_PASSWORD'];
        $dbVersion = $_ENV['DATABASE_VERSION'];
        $dbFolder = $_ENV['DATABASE_NAME_FOLDER'];
        $dbName = $_ENV['DATABASE_PREFIX'] . $code;
        $nameManager = $_ENV['DATABASE_NAME_MANAGER'] . $code;

        $nameEnvData = "%env(resolve:DATABASE_URL_CLIENT_".$code.")%";

        //write env file
        $env = file_get_contents($this->envFile);
        $env .= 'DATABASE_URL_CLIENT_'.$code.'="mysql://'.$username.':'.$password.'@'.$host.'/'.$dbName.'?serverVersion='.$dbVersion.'"';
        $env .= "\n";
        file_put_contents($this->envFile, $env);

        //write yaml file doctrine
        $doctrineFile = $this->configDirectory . "packages/doctrine.yaml";
        $data = Yaml::parseFile($doctrineFile);

        $data['doctrine']['dbal']['connections'][$nameManager] = [
            'url' => $nameEnvData
        ];
        $data['doctrine']['orm']['entity_managers'][$nameManager] = [
            "naming_strategy" => "doctrine.orm.naming_strategy.underscore_number_aware",
            "connection" => $nameManager,
            "report_fields_where_declared" => true,
            "mappings" => [
                ucfirst($nameManager) => [
                    "is_bundle" => false,
                    "dir" => "%kernel.project_dir%/src/Entity/" . $dbFolder,
                    "prefix" => "App\Entity\\" . $dbFolder,
                    "alias" => ucfirst($nameManager),
                ]
            ]
        ];

        $yaml = Yaml::dump($data, 9);
        file_put_contents($doctrineFile, $yaml);

        $this->createDatabaseIfNotExists($dbName);

        return true;
    }

    private function createDatabaseIfNotExists(string $dbName): void
    {
        $dsn = sprintf('mysql:host=%s', $_ENV['DATABASE_HOST']);
        $pdo = new PDO(
            $dsn,
            'root',
            $_ENV['DATABASE_ROOT_PASSWORD'] ?? 'root'
        );

        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        $pdo->exec("GRANT ALL PRIVILEGES ON `{$dbName}`.* TO 'project'@'%'");
        $pdo->exec("FLUSH PRIVILEGES");
    }

    public function updateManager(string $oldCode, string $newCode): bool
    {
        $society0 = $this->em->getRepository(Society::class)->findOneBy(['code' => $oldCode]);
        $society1 = $this->em->getRepository(Society::class)->findOneBy(['code' => $newCode]);
        if(!$society0 || $society1){
            return false;
        }

        //vars
        $nameManager = $_ENV['DATABASE_NAME_MANAGER'].$oldCode;
        $nameEnvData = "DATABASE_URL_CLIENT_".$oldCode;
        $nameManagerMaj = ucfirst($_ENV['DATABASE_NAME_MANAGER']).$oldCode;

        $nNameManager = $_ENV['DATABASE_NAME_MANAGER'].$newCode;
        $nNameEnvData = "DATABASE_URL_CLIENT_".$newCode;
        $nNameManagerMaj = ucfirst($_ENV['DATABASE_NAME_MANAGER']).$newCode;

        //write env file
        $env = file_get_contents($this->envFile);
        $env = str_replace($nameManager, $nNameManager, $env);
        $env = str_replace($nameEnvData, $nNameEnvData, $env);
        file_put_contents($this->envFile, $env);

        //write yaml file doctrine
        $doctrineFile = $this->configDirectory . "packages/doctrine.yaml";
        $doctrine = file_get_contents($doctrineFile);
        $doctrine = str_replace($nameManager, $nNameManager, $doctrine);
        $doctrine = str_replace($nameEnvData, $nNameEnvData, $doctrine);
        $doctrine = str_replace($nameManagerMaj, $nNameManagerMaj, $doctrine);
        file_put_contents($doctrineFile, $doctrine);

        return true;
    }
}
