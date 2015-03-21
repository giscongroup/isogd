<?php
/**
 * Created by JetBrains PhpStorm.
 * User: julia
 * Date: 08.08.13
 * Time: 10:48
 * To change this template use File | Settings | File Templates.
 */
include 'isogd.fn.tabledata.php';
$data = getdata('isogd');
if (gettype($data) != "string") {
    $max = count($data);
    $green = 0;
    $red = 0;
    $yellow = 0;
    $result = array();
    for ($x = 0; $x < $max; $x++) {

        $sumGrantingData = 0;
        $sumGrantingData = intval($data[$x]['QuantityFactsGrantingData1']) + intval($data[$x]['QuantityFactsGrantingData2']) + intval($data[$x]['QuantityFactsGrantingData3']) + intval($data[$x]['QuantityFactsGrantingData4']);

//'#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'

        if (intval($data[$x]['VolumeMeans']) > 0) {
            $color = 'green';
            $green = $green + 1;
        }
        if ($sumGrantingData > 0 && intval($data[$x]['VolumeMeans']) === 0) {
            $color = 'yellow';
            $yellow = $yellow + 1;
        }
        if ($sumGrantingData == 0 && intval($data[$x]['VolumeMeans']) === 0) {
            $color = 'red';
            $red = $red + 1;
        }
        $result[$data[$x]['ID']] = $color;
    };
    $result['green'] = $green;
    $result['yellow'] = $yellow;
    $result['red'] = $red;
    echo json_encode($result);
} else {
    echo 'error';
}