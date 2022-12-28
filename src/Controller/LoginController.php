<?php

namespace App\Controller;

use App\Repository\Main\UserRepository;
use App\Service\Expiration;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController
{
    #[Route('/connexion', name: 'app_login', options: ['expose' => true])]
    public function index(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            if($this->isGranted('ROLE_ADMIN')) return $this->redirectToRoute('admin_homepage');
            if($this->isGranted('ROLE_USER')) return $this->redirectToRoute('user_homepage');
        }

        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('app/pages/security/index.html.twig', [
            'controller_name' => 'LoginController',
            'last_username' => $lastUsername,
            'error' => $error
        ]);
    }

    #[Route('/connected', name: 'app_logged')]
    public function logged(): RedirectResponse
    {
        if ($this->getUser()) {
            if($this->isGranted('ROLE_ADMIN')) return $this->redirectToRoute('admin_homepage');
            if($this->isGranted('ROLE_USER')) return $this->redirectToRoute('user_homepage');
        }

        return $this->redirectToRoute('app_login');
    }

    /**
     * @throws Exception
     */
    #[Route('/logout', name: 'app_logout', methods: ['GET'])]
    public function logout()
    {
        // controller can be blank: it will never be called!
        throw new Exception('Don\'t forget to activate logout in security.yaml');
    }

    #[Route('/reinitialisation/mot-de-passe/{token}-{code}', name: 'app_password_reinit', methods: ['GET'])]
    public function reinit($token, $code, UserRepository $repository, Expiration $expiration): Response
    {
        $user = $repository->findOneBy(['token' => $token]);
        if(!$user){
            throw new NotFoundHttpException("Cet utilisateur n'existe pas.");
        }

        if((!$user->getLostAt() || !$user->getLostCode())
            || ($user->getLostCode() && $user->getLostCode() != $code)){
            return $this->render('app/pages/security/reinit.html.twig', ['error' => true]);
        }

        if($user->getLostAt()){
            if ($expiration->isExpiredByMinutes($user->getLostAt(), new \DateTime(), 30)) {
                return $this->render('app/pages/security/reinit.html.twig', ['error' => true]);
            }
        }

        return $this->render('app/pages/security/reinit.html.twig', ['token' => $token]);
    }
}
