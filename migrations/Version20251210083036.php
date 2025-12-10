<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251210083036 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ag_event (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type INT NOT NULL, start_at DATETIME NOT NULL, end_at DATETIME DEFAULT NULL, all_day TINYINT(1) NOT NULL, localisation VARCHAR(255) DEFAULT NULL, content LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE changelog (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type INT NOT NULL, is_published TINYINT(1) NOT NULL, content LONGTEXT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE contact (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, message LONGTEXT NOT NULL, created_at DATETIME NOT NULL, seen TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type INT NOT NULL, identifiant INT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE mail (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, expeditor VARCHAR(255) NOT NULL, subject VARCHAR(255) NOT NULL, destinators JSON NOT NULL COMMENT \'(DC2Type:json)\', cc JSON NOT NULL COMMENT \'(DC2Type:json)\', bcc JSON NOT NULL COMMENT \'(DC2Type:json)\', files JSON NOT NULL COMMENT \'(DC2Type:json)\', theme INT NOT NULL, is_trash TINYINT(1) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', message LONGTEXT NOT NULL, INDEX IDX_5126AC48A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, icon VARCHAR(40) NOT NULL, created_at DATETIME NOT NULL, is_seen TINYINT(1) NOT NULL, url VARCHAR(255) DEFAULT NULL, INDEX IDX_BF5476CAA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE settings (id INT AUTO_INCREMENT NOT NULL, code INT NOT NULL, website_name VARCHAR(255) NOT NULL, url_homepage VARCHAR(255) NOT NULL, email_global VARCHAR(255) NOT NULL, email_contact VARCHAR(255) NOT NULL, email_rgpd VARCHAR(255) NOT NULL, logo_mail LONGTEXT NOT NULL, multiple_database TINYINT(1) NOT NULL, prefix_database VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE society (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, manager VARCHAR(255) NOT NULL, dirname VARCHAR(255) NOT NULL, code VARCHAR(20) NOT NULL, is_activated TINYINT(1) NOT NULL, is_generated TINYINT(1) NOT NULL, is_blocked TINYINT(1) NOT NULL, logo VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, society_id INT NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL, last_login_at DATETIME DEFAULT NULL, lost_code VARCHAR(255) DEFAULT NULL, lost_at DATETIME DEFAULT NULL, token VARCHAR(255) NOT NULL, avatar VARCHAR(255) DEFAULT NULL, manager VARCHAR(40) NOT NULL, is_blocked TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), INDEX IDX_8D93D649E6389D24 (society_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE mail ADD CONSTRAINT FK_5126AC48A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E6389D24 FOREIGN KEY (society_id) REFERENCES society (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE mail DROP FOREIGN KEY FK_5126AC48A76ED395');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CAA76ED395');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649E6389D24');
        $this->addSql('DROP TABLE ag_event');
        $this->addSql('DROP TABLE changelog');
        $this->addSql('DROP TABLE contact');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE mail');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE settings');
        $this->addSql('DROP TABLE society');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
