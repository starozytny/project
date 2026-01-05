<?php

namespace App\Entity\Main;

use App\Entity\DataEntity;
use App\Repository\Main\ChangelogRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ChangelogRepository::class)]
class Changelog extends DataEntity
{
    const FOLDER_EDITOR = "images/editor/changelogs";

    const LIST = ['changelog_list'];
    const FORM = ['changelog_form'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?int $type = null;

    #[ORM\Column]
    #[Groups(['changelog_list'])]
    private ?bool $isPublished = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['changelog_list', 'changelog_form'])]
    private ?string $content = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['changelog_list'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['changelog_list'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->isPublished = false;
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

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function isIsPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): self
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
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
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
