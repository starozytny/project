<?php

namespace App\Entity\Main\Agenda;

use App\Entity\DataEntity;
use App\Repository\Main\Agenda\AgEventRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AgEventRepository::class)]
class AgEvent extends DataEntity
{
    const LIST = ["agenda_list"];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['agenda_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['agenda_list'])]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $type = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['agenda_list'])]
    private ?\DateTimeInterface $startAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['agenda_list'])]
    private ?\DateTimeInterface $endAt = null;

    #[ORM\Column]
    #[Groups(['agenda_list'])]
    private ?bool $allDay = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['agenda_list'])]
    private ?string $localisation = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['agenda_list'])]
    private ?string $content = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = $this->initNewDateImmutable();
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

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getStartAt(): ?\DateTimeInterface
    {
        return $this->startAt;
    }

    public function setStartAt(\DateTimeInterface $startAt): self
    {
        $this->startAt = $startAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeInterface
    {
        return $this->endAt;
    }

    public function setEndAt(?\DateTimeInterface $endAt): self
    {
        $this->endAt = $endAt;

        return $this;
    }

    public function isAllDay(): ?bool
    {
        return $this->allDay;
    }

    public function setAllDay(bool $allDay): self
    {
        $this->allDay = $allDay;

        return $this;
    }

    public function getLocalisation(): ?string
    {
        return $this->localisation;
    }

    public function setLocalisation(?string $localisation): self
    {
        $this->localisation = $localisation;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
