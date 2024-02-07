<?php

namespace App\Controller\Admin;

use App\Entity\Main\User;
use App\Repository\Main\UserRepository;
use App\Service\ApiResponse;
use App\Service\Export;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/admin/utilisateurs', name: 'admin_users_')]
class UserController extends AbstractController
{
    #[Route('/', name: 'index', options: ['expose' => true])]
    public function index(Request $request): Response
    {
        return $this->render('admin/pages/users/index.html.twig', ['highlight' => $request->query->get('h')]);
    }

    #[Route('/utilisateur/ajouter', name: 'create', options: ['expose' => true])]
    public function create(): Response
    {
        return $this->render('admin/pages/users/create.html.twig');
    }

    #[Route('/utilisateur/modifier/{id}', name: 'update', options: ['expose' => true])]
    public function update(User $elem, SerializerInterface $serializer): Response
    {
        $obj = $serializer->serialize($elem, 'json', ['groups' => User::FORM]);
        return $this->render('admin/pages/users/update.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/utilisateur/consulter/{id}', name: 'read', options: ['expose' => true])]
    public function read(User $elem, SerializerInterface $serializer): Response
    {
        $obj = $serializer->serialize($elem, 'json', ['groups' => User::LIST]);
        return $this->render('admin/pages/users/read.html.twig', ['elem' => $elem, 'obj' => $obj]);
    }

    #[Route('/utilisateur/supprimer/{id}', name: 'delete', options: ['expose' => true], methods: 'DELETE')]
    public function delete(User $obj, UserRepository $repository, ApiResponse $apiResponse, FileUploader $fileUploader): Response
    {
        if ($obj->getHighRoleCode() === User::CODE_ROLE_DEVELOPER) {
            return $apiResponse->apiJsonResponseForbidden();
        }

        if ($obj === $this->getUser()) {
            return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
        }

        $repository->remove($obj, true);

        $fileUploader->deleteFile($obj->getAvatar(), User::FOLDER);
        return $apiResponse->apiJsonResponseSuccessful("ok");
    }

    #[Route('/utilisateur/mot-de-passe/{id}', name: 'password', options: ['expose' => true])]
    public function password(User $elem): Response
    {
        return $this->render('admin/pages/users/password.html.twig', ['elem' => $elem]);
    }

    #[Route('/export/{format}', name: 'export', options: ['expose' => true], methods: 'get')]
    public function export(Request $request, Export $export, $format, UserRepository $repository, ApiResponse $apiResponse): BinaryFileResponse|JsonResponse
    {
        $nameFile = 'utilisateurs';
        $nameFolder = 'export/';

        if($format == 'excel'){
            $fileName = $nameFile . '.xlsx';
            $header = [['ID', 'Nom/Prenom', 'Identifiant', 'Role', 'Email', 'Date de creation']];
        }else{
            $fileName = $nameFile . '.csv';
            $header = [['id', 'name', 'username', 'role', 'email', 'createAt']];

            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="'.$fileName.'"');
        }

        $type = $request->query->get('file');
        if($type){
            return $this->file($this->getParameter('private_directory'). $nameFolder . $fileName);
        }

        $objs = $repository->findBy([], ['lastname' => 'ASC']);
        $data = [];

        foreach ($objs as $obj) {
            $tmp = [
                $obj->getId(),
                $obj->getLastname() . " " . $obj->getFirstname(),
                $obj->getUsername(),
                $obj->getHighRole(),
                $obj->getEmail(),
                date_format($obj->getCreatedAt(), 'd/m/Y'),
            ];
            if(!in_array($tmp, $data)){
                $data[] = $tmp;
            }
        }

        $export->createFile($format, 'Liste des ' . $nameFile, $fileName , $header, $data, 6, $nameFolder);
        return $apiResponse->apiJsonResponseCustom(['url' => $this->generateUrl('admin_users_export', ['format' => $format, 'file' => 1])]);
    }
}
