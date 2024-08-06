<?php

namespace App\Controller;

use App\Repository\Main\SocietyRepository;
use App\Service\ApiConnect;
use App\Service\Immo\ImmoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AppController extends AbstractController
{
    #[Route('/', name: 'app_homepage')]
    public function index(): Response
    {
        return $this->render('app/pages/index.html.twig', [ 'controller_name' => 'AppController' ]);
    }

    #[Route('/contact', name: 'app_contact')]
    public function contact(): Response
    {
        return $this->render('app/pages/contact/create.html.twig');
    }

    #[Route('/legales/mentions-legales', name: 'app_mentions')]
    public function mentions(): Response
    {
        return $this->render('app/pages/legales/mentions.html.twig');
    }

    #[Route('/legales/politique-confidentialite', name: 'app_politique', options: ['expose' => true])]
    public function politique(): Response
    {
        return $this->render('app/pages/legales/politique.html.twig');
    }

    #[Route('/legales/cookies', name: 'app_cookies', options: ['expose' => true])]
    public function cookies(): Response
    {
        return $this->render('app/pages/legales/cookies.html.twig');
    }


    #[Route('/gestion-locative', name: 'app_gestion')]
    public function gestion(): Response
    {
        return $this->render('app/pages/gestion/index.html.twig');
    }

    #[Route('/transaction', name: 'app_transaction')]
    public function transaction(): Response
    {
        return $this->render('app/pages/transaction/index.html.twig');
    }

    #[Route('/biens-immobiliers/liste/annonces/{type}', name: 'app_ads')]
    public function ads($type): Response
    {
        // locations ou ventes
        return $this->render('app/pages/ads/index.html.twig', ['type' => $type]);
    }

    /**
     * @throws TransportExceptionInterface
     */
    #[Route('/biens-immobiliers/annonce/{typeA}/{typeB}-{zipcode}/{city}/{ref}-{slug}', name: 'app_ad', options: ['expose' => true])]
    public function ad($typeA, $slug, Request $request, SocietyRepository $repository, ImmoService $immoService,
                       HttpClientInterface $api_lotys, ApiConnect $apiConnect): Response
    {
        $code = "997";
        $cookieExisted = "HGPCookie";
        $cookieVisited = "hgp_visited";

        if($typeA == "locations"){
            $file = $immoService->getSocietyImmoFileLocations($repository->findOneBy(['code' => $code]));
        }else{
            $file = $immoService->getSocietyImmoFileVentes($repository->findOneBy(['code' => $code]));
        }

        if(!file_exists($file)){
            $this->addFlash('error', 'Annonce introuvable.');
            return $this->redirectToRoute('app_ads', ['type' => $typeA]);
        }

        $data = file_get_contents($file);

        $elem = null;
        foreach(json_decode($data) as $item){
            if($item->slug == $slug){
                $elem = $item;
            }
        }

        if(!$elem){
            $this->addFlash('error', 'Annonce introuvable.');
            return $this->redirectToRoute('app_ads', ['type' => $typeA]);
        }

        if($request->cookies->has($cookieExisted)){
            if($request->cookies->get($cookieExisted) == "true"){
                $isNew = $request->cookies->has($cookieVisited) ? 0 : 1;
                $api_lotys->request("POST", $apiConnect->getUrlLotys() . 'api/immo/histories/seen/' . $code . '/' . $elem->id . '/' . $isNew . '/website');

                $response = new Response();
                $response->headers->setCookie(new Cookie($cookieVisited, '1', time() + 86400));
            }
        }

        return $this->render('app/pages/ads/read.html.twig', ['elem' => $elem]);
    }
}
