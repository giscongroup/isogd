<?php
/**
 * User: Julia Suhinina
 * Date: 31.10.13
 * Time: 9:53
 * Description: 
 */
header('Content-Type: application/json; charset=utf-8');
session_start();


if (isset($_SESSION['session_id'])) {

    include 'isogd.fn.tabledata.php';
    $result = array();

    $moList = getdata('MO', 'ID, NameMO', "WHERE MO.TipMO = 'Муниципальный район' OR MO.TipMO = 'Городской округ';");
    $lastIsogd = getdata('isogd', 'ID, VolumeMeans, QuantityFactsGrantingData1, QuantityFactsGrantingData2, QuantityFactsGrantingData3, QuantityFactsGrantingData4', "");

    if (gettype($moList) != "string") {
        $result['mo'] = $moList;
    }
    if (gettype($admList) != "string") {
        $result['isogd'] = $lastIsogd;
    }

    echo json_encode($result);
}
?>