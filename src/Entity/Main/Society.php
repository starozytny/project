<?php

namespace App\Entity\Main;

use App\Entity\DataEntity;
use App\Repository\Main\SocietyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SocietyRepository::class)]
#[UniqueEntity("code", "Ce code est déjà utilisé.")]
class Society extends DataEntity
{
    const FOLDER_IMMO = "immo/data";
    const FOLDER = "logos";

    const SELECT = ['society_select'];
    const LIST   = ['society_list'];
    const FORM   = ['society_form'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['society_list', 'society_form', 'society_select', 'user_form'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['society_list', 'society_form', 'user_list', 'society_select'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['society_list'])]
    private ?string $manager = "default";

    #[ORM\Column(length: 255)]
    #[Groups(['society_list'])]
    private ?string $dirname = "default";

    #[ORM\Column(length: 20)]
    #[Groups(['society_list', 'society_form', 'user_list', 'society_select'])]
    private ?string $code = null;

    #[ORM\Column]
    #[Groups(['society_list'])]
    private ?bool $isActivated = false;

    #[ORM\Column]
    #[Groups(['society_list'])]
    private ?bool $isGenerated = false;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $logo = null;

    #[ORM\OneToMany(mappedBy: 'society', targetEntity: User::class)]
    private Collection $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
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

    public function getManager(): ?string
    {
        return $this->manager;
    }

    public function setManager(string $manager): self
    {
        $this->manager = $manager;

        return $this;
    }

    public function getDirname(): ?string
    {
        return $this->dirname;
    }

    public function setDirname(string $dirname): self
    {
        $this->dirname = $dirname;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function isIsActivated(): ?bool
    {
        return $this->isActivated;
    }

    public function setIsActivated(bool $isActivated): self
    {
        $this->isActivated = $isActivated;

        return $this;
    }

    public function isIsGenerated(): ?bool
    {
        return $this->isGenerated;
    }

    public function setIsGenerated(bool $isGenerated): self
    {
        $this->isGenerated = $isGenerated;

        return $this;
    }

    #[Groups(['society_list', 'society_form'])]
    public function getLogoFile(): string
    {
        return $this->getFileOrDefault($this->logo, self::FOLDER);
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setSociety($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getSociety() === $this) {
                $user->setSociety(null);
            }
        }

        return $this;
    }

    public function getImmoFileFolder(): string
    {
        return self::FOLDER_IMMO . '/' . $this->code . '/';
    }

    public function getImmoFileLocations(): string
    {
        return self::FOLDER_IMMO . '/' . $this->code . '/locations.json';
    }

    public function getImmoFileVentes(): string
    {
        return self::FOLDER_IMMO . '/' . $this->code . '/ventes.json';
    }
}
