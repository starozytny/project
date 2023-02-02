<?php

namespace App\Entity\Main\Help;

use App\Repository\Main\Help\HeCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HeCategoryRepository::class)]
class HeCategory
{
    const LIST = ["help_cat_list"];

    const VISIBILITY_ALL = 0;
    const VISIBILITY_ADMIN = 1;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['help_cat_list', 'help_quest_list'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['help_cat_list'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['help_cat_list'])]
    private ?string $icon = null;

    #[ORM\Column]
    private ?int $visibility = self::VISIBILITY_ALL;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: HeQuestion::class)]
    private Collection $questions;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['help_cat_list'])]
    private ?string $subtitle = null;

    #[ORM\Column]
    private ?int $rank = null;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
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

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function getVisibility(): ?int
    {
        return $this->visibility;
    }

    public function setVisibility(int $visibility): self
    {
        $this->visibility = $visibility;

        return $this;
    }

    /**
     * @return Collection<int, HeQuestion>
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(HeQuestion $question): self
    {
        if (!$this->questions->contains($question)) {
            $this->questions->add($question);
            $question->setCategory($this);
        }

        return $this;
    }

    public function removeQuestion(HeQuestion $question): self
    {
        if ($this->questions->removeElement($question)) {
            // set the owning side to null (unless already changed)
            if ($question->getCategory() === $this) {
                $question->setCategory(null);
            }
        }

        return $this;
    }

    public function getSubtitle(): ?string
    {
        return $this->subtitle;
    }

    public function setSubtitle(?string $subtitle): self
    {
        $this->subtitle = $subtitle;

        return $this;
    }

    public function getRank(): ?int
    {
        return $this->rank;
    }

    public function setRank(int $rank): self
    {
        $this->rank = $rank;

        return $this;
    }
}
