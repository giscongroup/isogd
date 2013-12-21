<?php
/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 10:37
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
        $ID = $_GET['ID'];
        $isogdWeek = getdata('isogdweek', '*', "WHERE ID = " . $ID . " AND week BETWEEN '" . $startYear . "' and '" . $today . "' ORDER BY week");


        if (gettype($isogdWeek) != "string") {

            $monthArray = array('янв', 'февр', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек');
            $result['volumeMeans'] = array();
            $result['increment'] = array();
            $result['labels'] = array();
            $result['quantityFactsGrantingData'] = array();
            $result['quantityFactsGrantingData1Increment'] = array();
            $result['quantityFactsGrantingData2Increment'] = array();
            $result['quantityFactsGrantingData3Increment'] = array();
            $result['quantityFactsGrantingData4Increment'] = array();
            $a = 1;
            $result['pie'] = array();
            $lastData = array(
                'VolumeMeans' => 0,
                'QuantityFactsGrantingData1' => 0,
                'QuantityFactsGrantingData2' => 0,
                'QuantityFactsGrantingData3' => 0,
                'QuantityFactsGrantingData4' => 0
            );

            $result['SumQuantityFactsGrantingData'] = array(
                'QuantityFactsGrantingData1' => 0,
                'QuantityFactsGrantingData2' => 0,
                'QuantityFactsGrantingData3' => 0,
                'QuantityFactsGrantingData4' => 0
            );


            foreach ($isogdWeek as $mo) {
                $week = $mo['week'];
                $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData1'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData1'] + $mo['QuantityFactsGrantingData1'];
                $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData2'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData2'] + $mo['QuantityFactsGrantingData2'];
                $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData3'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData3'] + $mo['QuantityFactsGrantingData3'];
                $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData4'] = $result['SumQuantityFactsGrantingData']['QuantityFactsGrantingData4'] + $mo['QuantityFactsGrantingData4'];
                $result['volumeMeans'][] = array($a, $mo['VolumeMeans']);
                $result['increment'][] = array($a, $mo['VolumeMeans'] - $lastData['VolumeMeans']);

                if ($a % 2 != 0) {
                    $expWeek = explode('-', $week);
                    $result['labels'][] = array($a, $monthArray[intval($expWeek[1]) - 1]);
                } else {
                    $result['labels'][] = array($a, '');
                }

                $result['quantityFactsGrantingData'][] = array($a, $mo['QuantityFactsGrantingData1'] + $mo['QuantityFactsGrantingData2'] + $mo['QuantityFactsGrantingData3'] + $mo['QuantityFactsGrantingData4']);
                $result['quantityFactsGrantingData1Increment'][] = array($a + 0.35, $mo['QuantityFactsGrantingData1'] - $lastData['QuantityFactsGrantingData1']);
                $result['quantityFactsGrantingData2Increment'][] = array($a + 0.8, $mo['QuantityFactsGrantingData2'] - $lastData['QuantityFactsGrantingData2']);
                $result['quantityFactsGrantingData3Increment'][] = array($a + 0.35, $mo['QuantityFactsGrantingData3'] - $lastData['QuantityFactsGrantingData3']);
                $result['quantityFactsGrantingData4Increment'][] = array($a + 0.8, $mo['QuantityFactsGrantingData4'] - $lastData['QuantityFactsGrantingData4']);
                $lastData = $mo;
                $a = $a + 1;
            };


            echo json_encode($result);
        }
    }
}
?>
