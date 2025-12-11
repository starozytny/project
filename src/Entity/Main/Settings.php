<?php

namespace App\Entity\Main;

use App\Repository\Main\SettingsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SettingsRepository::class)]
class Settings
{
    const FORM = ["settings_form"];
    const IS_MULTIPLE_DB = ["settings_multiple_db"];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $code = 0;

    #[ORM\Column(length: 255)]
    #[Groups(['settings_form'])]
    private ?string $websiteName = null;

    #[ORM\Column(length: 255)]
    private ?string $urlHomepage = null;

    #[ORM\Column(length: 255)]
    #[Groups(['settings_form'])]
    private ?string $emailGlobal = null;

    #[ORM\Column(length: 255)]
    #[Groups(['settings_form'])]
    private ?string $emailContact = null;

    #[ORM\Column(length: 255)]
    #[Groups(['settings_form'])]
    private ?string $emailRgpd = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['settings_form'])]
    private ?string $logoMail = null;

    #[ORM\Column]
    #[Groups(['settings_form', 'settings_multiple_db'])]
    private ?bool $multipleDatabase = false;

    public function __construct()
    {
        $this->multipleDatabase = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?int
    {
        return $this->code;
    }

    public function setCode(int $code): static
    {
        $this->code = $code;

        return $this;
    }

    public function getWebsiteName(): ?string
    {
        return $this->websiteName;
    }

    public function setWebsiteName(string $websiteName): self
    {
        $this->websiteName = $websiteName;

        return $this;
    }

    public function getUrlHomepage(): ?string
    {
        return $this->urlHomepage;
    }

    public function setUrlHomepage(string $urlHomepage): self
    {
        $this->urlHomepage = $urlHomepage;

        return $this;
    }

    public function getEmailGlobal(): ?string
    {
        return $this->emailGlobal;
    }

    public function setEmailGlobal(string $emailGlobal): self
    {
        $this->emailGlobal = $emailGlobal;

        return $this;
    }

    public function getEmailContact(): ?string
    {
        return $this->emailContact;
    }

    public function setEmailContact(string $emailContact): self
    {
        $this->emailContact = $emailContact;

        return $this;
    }

    public function getEmailRgpd(): ?string
    {
        return $this->emailRgpd;
    }

    public function setEmailRgpd(string $emailRgpd): self
    {
        $this->emailRgpd = $emailRgpd;

        return $this;
    }

    public function getLogoMail(): ?string
    {
        return $this->logoMail;
    }

    public function setLogoMail(string $logoMail): self
    {
        $this->logoMail = $logoMail;

        return $this;
    }

    public function isMultipleDatabase(): ?bool
    {
        return $this->multipleDatabase;
    }

    public function setMultipleDatabase(bool $multipleDatabase): self
    {
        $this->multipleDatabase = $multipleDatabase;

        return $this;
    }
}
