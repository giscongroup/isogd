<?php
/**
 * User: Julia Suhinina
 * Date: 07.10.13
 * Time: 16:37
 * Description:
 */
header('Content-Type: application/json; charset=utf-8');
session_start();


if (isset($_SESSION['session_id'])) {

    include 'isogd.fn.tabledata.php';
    $result = array();

    $isogdWeek = getdata('isogdweek', '*', "WHERE ID = " . $_SESSION['session_id'] . " and week like '" . $_GET['year'] . "-%' ORDER BY week");

    if (gettype($isogdWeek) != "string") {
        $result = $isogdWeek;
    }
    echo json_encode($result);
}
?>