<?php

namespace App\Entity\Main\Help;

use App\Repository\Main\Help\HeQuestionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HeQuestionRepository::class)]
class HeQuestion
{
    const LIST = ["help_quest_list"];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['help_quest_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['help_quest_list'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['help_quest_list'])]
    private ?string $content = null;

    #[ORM\ManyToOne(fetch: 'EAGER', inversedBy: 'questions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['help_quest_list'])]
    private ?HeCategory $category = null;

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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getCategory(): ?HeCategory
    {
        return $this->category;
    }

    public function setCategory(?HeCategory $category): self
    {
        $this->category = $category;

        return $this;
    }
}
