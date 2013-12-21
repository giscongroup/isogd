<?php
/**
 * User: Julia Suhinina
 * Date: 09.10.13
 * Time: 11:09
 * Description:
 */

header('Content-Type: application/json; charset=utf-8');
session_start();


if (isset($_SESSION['session_id'])) {

    include 'isogd.fn.tabledata.php';
    $result = array();

    $moList = getdata('MO', 'ID, NameMO', "WHERE (MO.TipMO = 'Муниципальный район' OR MO.TipMO = 'Городской округ') AND ID <>" . $_SESSION['session_id'] . ";");
    $admList = getdata('passmo', 'ID, NameMO', "WHERE manager=1;");

    if (gettype($moList) != "string") {
        $result = $moList;
    }
    if (gettype($admList) != "string") {
        $result = $admList;
    }
    if (gettype($admList) != "string" && gettype($moList) != "string") {
        $result = array_merge($moList, $admList);
    }

    echo json_encode($result);
}
?>