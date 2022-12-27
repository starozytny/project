<?php

namespace App\Entity\Main;

use App\Entity\DataEntity;
use App\Repository\Main\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User extends DataEntity implements UserInterface, PasswordAuthenticatedUserInterface
{
    const FOLDER = "avatars";

    const USER_LIST   = ['user_list'];
    const USER_FORM   = ['user_form'];

    const CODE_ROLE_USER = 0;
    const CODE_ROLE_DEVELOPER = 1;
    const CODE_ROLE_ADMIN = 2;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user_list', 'user_form'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user_list', 'user_form'])]
    private ?string $username = null;

    #[ORM\Column]
    #[Groups(['user_form'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_list', 'user_form'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_list', 'user_form'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_list', 'user_form'])]
    private ?string $firstname = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user_list'])]
    private ?\DateTime $lastLoginAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lostCode = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $lostAt = null;

    #[ORM\Column(length: 255)]
    private ?string $token = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $avatar = null;

    #[ORM\Column(length: 40)]
    #[Groups(['user_list'])]
    private ?string $manager = "default";

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Society $society = null;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->createdAt = $this->initNewDateImmutable();
        $this->token = $this->initToken();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    #[Groups(['user_list'])]
    public function getHighRole(): string
    {
        $rolesSortedByImportance = ['ROLE_DEVELOPER', 'ROLE_ADMIN', 'ROLE_USER'];
        $rolesLabel = ['Développeur', 'Administrateur', 'Utilisateur'];
        $i = 0;
        foreach ($rolesSortedByImportance as $role)
        {
            if (in_array($role, $this->roles)) return $rolesLabel[$i];
            $i++;
        }

        return "Utilisateur";
    }

    #[Groups(['user_list'])]
    public function getHighRoleCode(): int
    {
        return match ($this->getHighRole()) {
            'Développeur' => self::CODE_ROLE_DEVELOPER,
            'Administrateur' => self::CODE_ROLE_ADMIN,
            default => self::CODE_ROLE_USER,
        };
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTime $updatedAt): self
    {
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getLastLoginAt(): ?\DateTime
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTime $lastLoginAt): self
    {
        $lastLoginAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    public function getLostCode(): ?string
    {
        return $this->lostCode;
    }

    public function setLostCode(?string $lostCode): self
    {
        $this->lostCode = $lostCode;

        return $this;
    }

    public function getLostAt(): ?\DateTime
    {
        return $this->lostAt;
    }

    public function setLostAt(?\DateTime $lostAt): self
    {
        $lostAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->lostAt = $lostAt;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): self
    {
        $this->avatar = $avatar;

        return $this;
    }

    #[Groups(['user_list', 'user_form'])]
    public function getAvatarFile(): string
    {
        return $this->getFileOrDefault($this->avatar, self::FOLDER, "https://robohash.org/" . $this->username);
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

    public function getSociety(): ?Society
    {
        return $this->society;
    }

    public function setSociety(?Society $society): self
    {
        $this->society = $society;

        return $this;
    }
}
