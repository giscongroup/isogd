<?php
/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 8:57
 * Description:
 */
header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {
    if ($_SESSION['session_adm'] == 1) {
        include 'isogd.fn.tabledata.php';
        $result = array();

        $today = date("Y-m-d");

        $year = date("Y");
        $month = date("m");

        $lastmonth = $month - 1;

        if ($lastmonth < 10)
            $lastmonth = '0' . $lastmonth;

        if ($month < 10)
            $month = '0' . $month;

        $updatesCount = getdata('isogdarch', 'count(Code) as count', "WHERE CreateDate BETWEEN '" . $year . "-" . $month . "-00' AND '" . $today . "';");
        $sumByYear = getdata('isogd', 'sum(VolumeMeans) as sum');
        $sumByLastMonth = getdata('isogdweek', 'sum(VolumeMeans) as sum', "WHERE week BETWEEN '" . $year . "-" . $lastmonth . "-15' AND '" . $year . "-" . $lastmonth . "-32';");
        $updatesUserCount = getdata('isogdarch', 'count(DISTINCT ID) as count', "WHERE CreateDate BETWEEN '" . $year . "-" . $month . "-00' AND '" . $today . "';");

        if (gettype($updatesCount) != "string") {
            $result['updatesCount'] = $updatesCount[0]['count'];
        }
        if (gettype($sumByYear) != "string") {
            $result['sumByYear'] = $sumByYear[0]['sum'];
        }
        if (gettype($sumByYear) != "string" && gettype($sumByLastMonth)) {
            $result['sumByMonth'] = $sumByYear[0]['sum'] - $sumByLastMonth[0]['sum'];
        }
        if (gettype($updatesUserCount) != "string") {
            $result['updatesUserCount'] = $updatesUserCount[0]['count'];
        }

        echo json_encode($result);
    }
}
?>