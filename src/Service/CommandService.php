<?php

namespace App\Service;

use Exception;
use SensioLabs\AnsiConverter\AnsiToHtmlConverter;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\KernelInterface;

class CommandService extends AbstractController
{
    /**
     * @throws Exception
     */
    public function runCommand(KernelInterface $kernel, $command, ?array $params = null): JsonResponse
    {
        $application = new Application($kernel);
        $application->setAutoExit(false);

        if($params == null){
            $input = new ArrayInput(['command' => $command]);
        }else{
            $input = new ArrayInput(array_merge(['command' => $command], $params));
        }

        // You can use NullOutput() if you don't need the output
        $output = new BufferedOutput(
            OutputInterface::VERBOSITY_NORMAL,
            true // true for decorated
        );
        $application->run($input, $output);

        // return the output, don't use if you used NullOutput()
        $converter = new AnsiToHtmlConverter();
        $content = $output->fetch();

        // return new Response(""), if you used NullOutput()
        return new JsonResponse($converter->convert($content));
    }
}
