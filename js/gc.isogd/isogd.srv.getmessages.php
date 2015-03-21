<?php
/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 14:29
 * Description:
 */
header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {

    include 'isogd.fn.tabledata.php';
    $result = array();

    $result = getdata('messages', '*', 'WHERE mailfrom = ' . $_SESSION['session_id'] . ' OR mailto = ' . $_SESSION['session_id'] . ' ORDER BY createdate DESC;');
    $mo = getdata('passmo', 'ID, NameMO');

    for ($x = 0; $x < count($result); $x++) {
        for ($m = 0; $m < count($mo); $m++) {

            if ($result[$x]['mailfrom'] == $mo[$m]['ID'] && $result[$x]['mailfrom'] != $_SESSION['session_id']) {
                $result[$x]['NameMO'] = $mo[$m]['NameMO'];
                break;
            }
            if ($result[$x]['mailto'] == $mo[$m]['ID'] && $result[$x]['mailto'] != $_SESSION['session_id']) {
                $result[$x]['NameMO'] = $mo[$m]['NameMO'];
                break;
            }
        }

//        if ($result[$x]['isread'] == 0) {
            $dataMes = $result[$x]['createdate'];

            $passedTime = floor((time() - strtotime($dataMes)) / (60 * 60 * 24));
            if ($passedTime < 1) {
                $passedTime = floor((time() - strtotime($dataMes)) / (60 * 60));
                if ($passedTime < 1) {
                    $passedTime = floor((time() - strtotime($dataMes)) / (60));
                    $passedTime = $passedTime . ' мин';
                } else {
                    $passedTime = $passedTime . ' ч';
                }
            } else {
                $passedTime = $passedTime . ' д';
            }
            $result[$x]['passedTime'] = $passedTime;
//        }
    };
    echo json_encode($result);
}
?>