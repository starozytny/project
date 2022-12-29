<?php


namespace App\Service;


use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Writer\Exception;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\RouterInterface;

class Export
{
    protected string $privateDirectory;
    protected RouterInterface $router;


    public function __construct($privateDirectory, RouterInterface $router)
    {
        $this->privateDirectory = $privateDirectory;

        $this->router = $router;

        $this->createFolderIfNotExist($privateDirectory);
    }

    public function createFile($format, $title, $filename, $header, $data, $max, $folder="", $delimiter=";"): JsonResponse
    {
        $spreadsheet = new Spreadsheet();

        $privateDirectory = $this->getPrivateDirectory();
        $this->createFolderIfNotExist($privateDirectory);
        if($folder != ""){
            $privateDirectory = $this->getPrivateDirectory() . '/' . $folder;
            $this->createFolderIfNotExist($privateDirectory);
        }

        $file = $privateDirectory . $filename;
        if (file_exists($file)) {
            unlink($file);
        }

        try {
            $sheet = $spreadsheet->getActiveSheet();
        } catch (\Exception $e) {
            return new JsonResponse(array(
                'code' => 0,
                'message' => 'Try catch active sheet : ' . $e
            ));
        }

        $sheet->setTitle($title);
        $sheet->setShowGridlines(false);

        // Fill excel header
        if($header) {
            $this->fill($header, $max, $sheet, 1);
            $this->fill($data, $max, $sheet, 2);
        }else{
            $this->fill($data, $max, $sheet, 1);
        }


        // Create your Office 2007 Excel (XLSX Format)
        if($format == 'excel'){
            $writer = new Xlsx($spreadsheet);
        }else{
            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Csv($spreadsheet);
//            $writer->setUseBOM(true);
            $writer->setDelimiter($delimiter);
            $writer->setEnclosure('');
            $writer->setLineEnding("\r\n");
        }

        // Create the file
        try {
            $writer->save($file);
        } catch (Exception $e) {
            return new JsonResponse(array(
                'code' => 0,
                'message' => 'Try catch save : ' . $e
            ));
        }

        // Return a text response to the browser saying that the excel was succesfully created
        return new JsonResponse(array(
            'code' => 1,
            'message' => 'Fichier généré.'
        ));
    }

    protected function fill($data, $max, $sheet, $begin): void
    {
        $lettersDefault = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        $letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        foreach($lettersDefault as $l){
            for($i = 0 ; $i <= 25 ; $i++){
                $letters[] = $l . $lettersDefault[$i];
            }
        }

        // DATA
        $styleArray = [
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ];

        $i = 0;
        foreach ($letters as $letter) {
            if($i < $max){
                $j = $begin;
                foreach ($data as $item) {
                    $sheet->setCellValueExplicit($letter . $j, $item[$i], DataType::TYPE_STRING);
                    $sheet->getStyle($letter . $j)->applyFromArray($styleArray);
                    $j++;
                }
                $i++;
            }
        }

        // STYLE HEADER
        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                ],
            ],
        ];

        $i = 0;
        $j = 1;
        foreach ($letters as $letter) {
            if($i < $max){
                $sheet->getColumnDimension($letter)->setAutoSize(true);
                $sheet->getRowDimension($j)->setRowHeight(25);
                $sheet->getStyle($letter . $j)->applyFromArray($styleArray);
                $sheet->getStyle($letter . $j)
                    ->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID);
                $sheet->getStyle($letter . $j)
                    ->getFill()->getStartColor()->setARGB('FF11ACE4');
            }
            $i++;
        }

        $this->styleMainCell($data, $sheet);

        if(count($data) >= 1){
            $sheet->removeRow(count($data) + 1,1);
        }
    }

    protected function styleMainCell($data, $sheet): void
    {
        //STYLE A COL
        for($i=2 ; $i<count($data)+2; $i++){
            $sheet->getRowDimension($i)->setRowHeight(25);
            $sheet->getStyle('A' . $i)
                ->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID);
            $sheet->getStyle('A' . $i)
                ->getFill()->getStartColor()->setARGB('FFBFFFFF');
        }
    }

    protected function createFolderIfNotExist($folder): void
    {
        if (!file_exists($folder)) {
            mkdir($folder, 0755, true);
        }
    }

    /**
     * @return mixed
     */
    public function getPrivateDirectory(): mixed
    {
        return $this->privateDirectory;
    }
}
