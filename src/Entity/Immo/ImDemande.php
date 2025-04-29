<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImDemandeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ImDemandeRepository::class)]
class ImDemande extends DataEntity
{
    const LIST = ['demande_list'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['demande_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['demande_list'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $email = null;

    #[ORM\Column(length: 80, nullable: true)]
    #[Groups(['demande_list'])]
    private ?string $phone = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['demande_list'])]
    private ?string $message = null;

    #[ORM\Column(length: 255)]
    private ?string $toEmail = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['demande_list'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column]
    #[Groups(['demande_list'])]
    private ?bool $seen = false;

    #[ORM\Column]
    private ?int $bienId = null;

    #[ORM\Column]
    #[Groups(['demande_list'])]
    private ?float $price = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $libelle = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $zipcode = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $typeAd = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $typeBien = null;

    #[ORM\Column(length: 255)]
    #[Groups(['demande_list'])]
    private ?string $reference = null;

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

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): static
    {
        $this->firstname = $firstname;

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

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getToEmail(): ?string
    {
        return $this->toEmail;
    }

    public function setToEmail(string $toEmail): static
    {
        $this->toEmail = $toEmail;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getBienId(): ?int
    {
        return $this->bienId;
    }

    public function setBienId(int $bienId): static
    {
        $this->bienId = $bienId;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): static
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(string $zipcode): static
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getTypeAd(): ?string
    {
        return $this->typeAd;
    }

    public function setTypeAd(string $typeAd): static
    {
        $this->typeAd = $typeAd;

        return $this;
    }

    public function getTypeBien(): ?string
    {
        return $this->typeBien;
    }

    public function setTypeBien(string $typeBien): static
    {
        $this->typeBien = $typeBien;

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): static
    {
        $this->reference = $reference;

        return $this;
    }
}
