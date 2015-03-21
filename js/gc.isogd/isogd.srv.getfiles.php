<?php
/**
 * User: Julia Suhinina
 * Date: 14.08.13
 * Time: 10:26
 * Description:
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {

    include 'isogd.fn.tabledata.php';
    $result = array();
    if ($_SESSION['session_adm'] == 1) {
        $result = getdata('files');
        echo json_encode($result);
    } else {
        $result = getdata('files', '*', 'WHERE ID = ' . $_SESSION['session_id'].' AND deleteDate IS NULL');
        echo json_encode($result);
    }
}

?>