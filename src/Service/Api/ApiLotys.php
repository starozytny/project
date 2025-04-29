<?php

namespace App\Service\Api;

use App\Entity\Immo\ImDemande;
use App\Entity\Main\Contact;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiLotys
{
    public function __construct(private readonly HttpClientInterface $api_lotys,
                                private readonly string $urlLotys,
                                private readonly string $username, private readonly string $password)
    {}

    public function getUrlLotys(): string
    {
        return $this->urlLotys;
    }

    /**
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     */
    private function getToken()
    {
        $response = $this->api_lotys->request("POST", 'api/login_check', [
            'json' => [
                'username' => $this->username,
                'password' => $this->password,
            ]
        ]);

        $data = json_decode($response->getContent());
        return $data->token;
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function callSeenAd(string $code, $id, bool $isNew): void
    {
        $this->api_lotys->request("POST", 'api/immo/histories/seen/' . $code . '/' . $id . '/' . $isNew . '/website');
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function createProspectByContact(Contact $obj, $type)
    {
        $token = $this->getToken();

        $response = $this->api_lotys->request("POST", 'api/immo/prospects/create/from/website/contact', [
            'auth_bearer' => $token,
            'json' => [
                'websiteId' => $obj->getId(),
                'lastname' => $obj->getName(),
                'firstname' => $obj->getFirstname(),
                'email' => $obj->getEmail(),
                'phone' => "",
                'type' => $type,
                'message' => $obj->getMessage()
            ]
        ]);

        $data = json_decode($response->getContent());
        return $data->id;
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function createDemande(ImDemande $obj, $data, $urlBien)
    {
        $token = $this->getToken();

        $response = $this->api_lotys->request("POST", 'api/immo/demandes/create/from/website', [
            'auth_bearer' => $token,
            'json' => [
                'bienId' => $obj->getBienId(),
                'reference' => $obj->getReference(),
                'codeTypeAd' => (int) $data->codeTypeAd,
                'codeTypeBien' => (int) $data->codeTypeBien,
                'price' => $obj->getPrice(),
                'libelle' => $obj->getLibelle(),
                'urlBien' => $urlBien,
                'zipcode' => $obj->getZipcode(),
                'city' => $obj->getCity(),
                'lastname' => $obj->getName(),
                'firstname' => $obj->getFirstname(),
                'email' => $obj->getEmail(),
                'phone' => $obj->getPhone(),
                'message' => $obj->getMessage(),
            ]
        ]);

        $statusCode = $response->getStatusCode();

        if($statusCode > 299){
            return false;
        }

        $data = json_decode($response->getContent());
        return $data->id;
    }
}
