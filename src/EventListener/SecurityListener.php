<?php

namespace App\EventListener;


use App\Entity\Main\User;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class SecurityListener
{
    private TokenStorageInterface $tokenStorage;
    private RequestStack $requestStack;
    private RouterInterface $router;

    public function __construct(TokenStorageInterface $tokenStorage, RequestStack $requestStack, RouterInterface $router)
    {
        $this->tokenStorage = $tokenStorage;
        $this->requestStack = $requestStack;
        $this->router = $router;
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        if($this->tokenStorage->getToken() instanceof TokenInterface){

            /** @var User $user */
            $user = $this->tokenStorage->getToken()->getUser();

            $session = $this->requestStack->getSession();

//            $tokenSession = $session->get('user_session_' . $user->getId());
//
//            if($tokenSession && $user->getTokenSession() != $tokenSession){
//                $session->invalidate(1);
//                $this->tokenStorage->setToken();
//
//                $url = $this->router->generate('app_homepage');
//
//                $response = new RedirectResponse($url);
//
//                $session->getFlashBag()->add('same', 'Une seule connexion active est autorisée par compte.');
//                $event->setResponse($response);
//            }

            $society = $user->getSociety();

            if($society->isBlocked()){
                $session->invalidate(1);
                $this->tokenStorage->setToken();

                $url = $this->router->generate('app_homepage');

                $response = new RedirectResponse($url);

                $session->getFlashBag()->add('auth', 'Vous n\'êtes pas autorisé à accéder à cette ressource.');
                $event->setResponse($response);
            }
        }
    }
}
