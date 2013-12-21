<?php
/**
 * User: Julia Suhinina
 * Date: 07.10.13
 * Time: 9:07
 * Description:
 */
header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {
    include 'isogd.fn.tabledata.php';
    $result = array();
    $startYear = date("Y") . "-01-01";
    $today = date("Y-m-d");

    if ($_SESSION['session_adm'] == 1) {

        $isogdWeek = getdata('isogdweek', '*', "WHERE week BETWEEN '" . $startYear . "' and '" . $today . "' ORDER BY week");

        if (gettype($isogdWeek) != "string") {

            $sumByWeek = array();
            for ($i = 0, $max = count($isogdWeek); $i < $max; $i++) {

                $dataArray = explode('-', $isogdWeek[$i] ['week']);
                $data = $dataArray[0] . '-' . $dataArray[1];

                if ($dataArray[2] <= 15)
                    $data = $data . '-01';
                else
                    $data = $data . '-16';

                if (is_null($sumByWeek[$data]) == true) {
                    $sumByWeek[$data]['VolumeMeans'] = 0;
                    $sumByWeek[$data]['QuantityFactsGrantingData1'] = 0;
                    $sumByWeek[$data]['QuantityFactsGrantingData2'] = 0;
                    $sumByWeek[$data]['QuantityFactsGrantingData3'] = 0;
                    $sumByWeek[$data]['QuantityFactsGrantingData4'] = 0;
                }

                $sumByWeek[$data]['VolumeMeans'] = $sumByWeek[$data]['VolumeMeans'] + $isogdWeek[$i]['VolumeMeans'];
                $sumByWeek[$data]['QuantityFactsGrantingData1'] = $sumByWeek[$data]['QuantityFactsGrantingData1'] + $isogdWeek[$i]['QuantityFactsGrantingData1'];
                $sumByWeek[$data]['QuantityFactsGrantingData2'] = $sumByWeek[$data]['QuantityFactsGrantingData2'] + $isogdWeek[$i]['QuantityFactsGrantingData2'];
                $sumByWeek[$data]['QuantityFactsGrantingData3'] = $sumByWeek[$data]['QuantityFactsGrantingData3'] + $isogdWeek[$i]['QuantityFactsGrantingData3'];
                $sumByWeek[$data]['QuantityFactsGrantingData4'] = $sumByWeek[$data]['QuantityFactsGrantingData4'] + $isogdWeek[$i]['QuantityFactsGrantingData4'];

            }


            $monthArray = array(0 => 'янв', 1 => 'февр', 2 => 'март', 3 => 'апр', 4 => 'май', 5 => 'июнь', 6 => 'июль', 7 => 'авг', 8 => 'сент', 9 => 'окт', 10 => 'нояб', 11 => 'дек');
            $result['volumeMeans'] = array();
            $result['increment'] = array();
            $result['labels'] = array();
            $result['pie'] = array();
            $lastWeek = '';
            $keys = array_keys($sumByWeek);
            $a = 1;


            asort($keys);


            $result['SumQuantityFactsGrantingData'] = array();
            $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData1'] = 0;
            $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData2'] = 0;
            $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData3'] = 0;
            $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData4'] = 0;

            foreach ($keys as $week) {

                $result['volumeMeans'][] = array($a, $sumByWeek[$week]['VolumeMeans']);

                if ($a % 2 != 0) {
                    $expWeek = explode('-', $week);
                    $result['labels'][] = array($a, $monthArray[intval($expWeek[1]) - 1]);
                } else {
                    $result['labels'][] = array($a, '');
                }

                if ($lastWeek !== '') {
                    $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData1'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData1'] + $sumByWeek[$week]['QuantityFactsGrantingData1'];
                    $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData2'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData2'] + $sumByWeek[$week]['QuantityFactsGrantingData2'];
                    $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData3'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData3'] + $sumByWeek[$week]['QuantityFactsGrantingData3'];
                    $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData4'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData4'] + $sumByWeek[$week]['QuantityFactsGrantingData4'];

                    $result['increment'][] = array($a, $sumByWeek[$week]['VolumeMeans'] - $sumByWeek[$lastWeek]['VolumeMeans']);
                } else {
                    $result['increment'][] = array($a, $sumByWeek[$week]['VolumeMeans']);
                }

                $result['quantityFactsGrantingData'][] = array($a, $sumByWeek[$week]['QuantityFactsGrantingData1'] + $sumByWeek[$week]['QuantityFactsGrantingData2'] + $sumByWeek[$week]['QuantityFactsGrantingData3'] + $sumByWeek[$week]['QuantityFactsGrantingData4']);
                $result['quantityFactsGrantingData1Increment'][] = array($a + 0.35, $sumByWeek[$week]['QuantityFactsGrantingData1'] - $sumByWeek[$lastWeek]['QuantityFactsGrantingData1']);
                $result['quantityFactsGrantingData2Increment'][] = array($a + 0.8, $sumByWeek[$week]['QuantityFactsGrantingData2'] - $sumByWeek[$lastWeek]['QuantityFactsGrantingData2']);
                $result['quantityFactsGrantingData3Increment'][] = array($a + 0.35, $sumByWeek[$week]['QuantityFactsGrantingData3'] - $sumByWeek[$lastWeek]['QuantityFactsGrantingData3']);
                $result['quantityFactsGrantingData4Increment'][] = array($a + 0.8, $sumByWeek[$week]['QuantityFactsGrantingData4'] - $sumByWeek[$lastWeek]['QuantityFactsGrantingData4']);

                $lastWeek = $week;
                $a = $a + 1;
            };

        }


        $result['log'] = array();
        $log = array();


        $currentDate = date("Y-m-d");
        $halfYear = date("Y") . "-01-01";

        $isogdarch = getdata('isogdarch', "COUNT(Code) as sum, DATE_FORMAT(CreateDate, '%c-%e') as date", "WHERE CreateDate BETWEEN '" . $halfYear . "' and '" . $currentDate . "' GROUP BY DATE_FORMAT(CreateDate, '%c%e')");

        if (gettype($isogdWeek) != "string") {

            for ($x = 0; $x < count($isogdarch); $x++) {
                $data = '';
                $a = explode('-', $isogdarch[$x]['date']);
                if ($a[1] <= 15)
                    $data = $a[0] . '-01';
                else
                    $data = $a[0] . '-16';

                $log[$data] = $log[$data] + $isogdarch[$x]['sum'];
            }


            $index = 1;

            for ($i = 1, $max = date("m") + 1; $i < $max; $i++) {
                $maxa = 2;
                if ($i === $max - 1 && date("d") <= 15) {
                    $maxa = 1;
                }

                for ($a = 0; $a < $maxa; $a++) {
                    $currentDate = $i . '-';

                    if ($a == 0)
                        $currentDate = $currentDate . '01';
                    else
                        $currentDate = $currentDate . '16';


                    $sum = $log[$currentDate];
                    if (is_null($sum) == false)
                        $result['log'][] = array($index, $sum);
                    else
                        $result['log'][] = array($index, 0);
                    $index = $index + 1;
                }
            }
        }

        echo json_encode($result);

    }
}
?>