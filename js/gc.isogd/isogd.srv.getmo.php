<?php
/**
 * Created by JetBrains PhpStorm.
 * User: julia
 * Date: 12.08.13
 * Time: 8:48
 * To change this template use File | Settings | File Templates.
 */


header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {
    include 'isogd.fn.tabledata.php';
    if ($_SESSION['session_adm'] == 1) {

        $MO = getdata('MO', '*', "JOIN General_Information ON General_Information.ID = MO.ID WHERE TipMO = 'Муниципальный район' OR TipMO = 'Городской округ'");

        if (gettype($MO) != "string") {
            echo json_encode($MO);
        } else {
            echo 'error';
        }

    } else if ($_SESSION['session_adm'] == 0) {

        $MO = getdata('MO', '*', "JOIN General_Information ON General_Information.ID = MO.ID WHERE MO.ID = " . $_SESSION['session_id']);
        if (gettype($MO) != "string") {
            echo json_encode($MO);
        }
    }
}
?>