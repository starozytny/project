<?php

namespace App\Entity\Main;

use App\Entity\DataEntity;
use App\Entity\Enum\Mail\ThemeType;
use App\Repository\Main\MailRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MailRepository::class)]
class Mail extends DataEntity
{
    const FOLDER_FILES = "emails";

    const LIST = ['mail_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['mail_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['mail_list'])]
    private ?string $expeditor = null;

    #[ORM\Column(length: 255)]
    #[Groups(['mail_list'])]
    private ?string $subject = null;

    #[ORM\Column]
    #[Groups(['mail_list'])]
    private array $destinators = [];

    #[ORM\Column]
    #[Groups(['mail_list'])]
    private array $cc = [];

    #[ORM\Column]
    #[Groups(['mail_list'])]
    private array $bcc = [];

    #[ORM\Column]
    #[Groups(['mail_list'])]
    private array $files = [];

    #[ORM\Column]
    private ?int $theme = ThemeType::None;

    #[ORM\Column]
    #[Groups(['mail_list'])]
    private ?bool $isTrash = false;

    #[ORM\Column]
    #[Groups(['mail_list'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['mail_list'])]
    private ?string $message = null;

    #[ORM\ManyToOne(inversedBy: 'mails')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups(['mail_list'])]
    public function getThemeString(): string
    {
        $values = ["simple"];

        return $values[$this->theme];
    }

    public function getExpeditor(): ?string
    {
        return $this->expeditor;
    }

    public function setExpeditor(string $expeditor): static
    {
        $this->expeditor = $expeditor;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(string $subject): static
    {
        $this->subject = $subject;

        return $this;
    }

    public function getDestinators(): array
    {
        return $this->destinators;
    }

    public function setDestinators(array $destinators): static
    {
        $this->destinators = $destinators;

        return $this;
    }

    public function getCc(): array
    {
        return $this->cc;
    }

    public function setCc(array $cc): static
    {
        $this->cc = $cc;

        return $this;
    }

    public function getBcc(): array
    {
        return $this->bcc;
    }

    public function setBcc(array $bcc): static
    {
        $this->bcc = $bcc;

        return $this;
    }

    public function getFiles(): array
    {
        return $this->files;
    }

    public function setFiles(array $files): static
    {
        $this->files = $files;

        return $this;
    }

    public function getTheme(): ?int
    {
        return $this->theme;
    }

    public function setTheme(int $theme): static
    {
        $this->theme = $theme;

        return $this;
    }

    public function isIsTrash(): ?bool
    {
        return $this->isTrash;
    }

    public function setIsTrash(bool $isTrash): static
    {
        $this->isTrash = $isTrash;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
