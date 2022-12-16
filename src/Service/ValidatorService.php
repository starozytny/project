<?php


namespace App\Service;


use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidatorService
{
    private ValidatorInterface $validator;

    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    public function validate($object): bool|array
    {
        $errors = $this->validator->validate($object);

        if (count($errors) > 0) {

            $errs = [];
            foreach ($errors as $error) {
                $errs[] = [
                    'name' => $error->getPropertyPath(),
                    'message' => $error->getMessage()
                ];
            }

            return $errs;
        }

        return true;
    }
}
