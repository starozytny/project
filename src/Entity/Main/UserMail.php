<?php

namespace App\Entity\Main;

use App\Entity\DataEntity;
use App\Repository\Main\UserMailRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserMailRepository::class)]
class UserMail extends DataEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_form'])]
    private ?string $hote = null;

    #[ORM\Column]
    #[Groups(['user_form'])]
    private ?int $port = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user_form'])]
    private ?string $username = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHote(): ?string
    {
        return $this->hote;
    }

    public function setHote(string $hote): static
    {
        $this->hote = $hote;

        return $this;
    }

    public function getPort(): ?int
    {
        return $this->port;
    }

    public function setPort(int $port): static
    {
        $this->port = $port;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->crypt("decrypt", $this->password);
    }

    public function setPassword(string $password): static
    {
        $this->password = $this->crypt("encrypt", $password);

        return $this;
    }
}
