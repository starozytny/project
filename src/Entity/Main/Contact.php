<?php

namespace App\Entity\Main;

use App\Entity\DataEntity;
use App\Repository\Main\ContactRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
class Contact extends DataEntity
{
    const LIST = ['contact_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['contact_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['contact_list'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['contact_list'])]
    private ?string $email = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['contact_list'])]
    private ?string $message = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['contact_list'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column]
    #[Groups(['contact_list'])]
    private ?bool $seen = false;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function isSeen(): ?bool
    {
        return $this->seen;
    }

    public function setSeen(bool $seen): self
    {
        $this->seen = $seen;

        return $this;
    }
}
