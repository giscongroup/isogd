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
    include 'isogd.fn.tabledata.php';
    if ($_SESSION['session_adm'] == 1) {
        $result = array();
        $today = date("Y-m") . '-' . $year = date("d") + 1;

        $year = date("Y");
        $month = date("m");

        $lastmonth = $month - 1;


        if ($lastmonth < 10)
            $lastmonth = '0' . $lastmonth;
        if ($month < 10)
            $month = '0' . $month;

        $updatesCount = getdata('isogdarch', 'count(Code) as count', "WHERE CreateDate BETWEEN '" . $year . "-" . $month . "-00' AND '" . $today . "';");
        $sumByYear = getdata('isogd', 'sum(VolumeMeans) as sum');
        $previousWeek = getdata('isogdweek', 'week', "WHERE week < '" . $year . "-" . $month . "-00" . "' ORDER BY week DESC LIMIT 1;");
        $sumByLastMonth = getdata('isogdweek', 'sum(VolumeMeans) as sum', "WHERE week LIKE '" . $previousWeek[0]['week'] . "';");
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

        if ($month == 1) {
            $result['sumByMonth'] = $result['sumByYear'];
        }

        $result['sumByLastMonth'] = $sumByLastMonth;

        echo json_encode($result);
    } else {
        $result = array();
        $today = date("Y-m") . '-' . $year = date("d") + 1;
        $year = date("Y");
        $month = date("m");

        $lastmonth = $month - 1;

        if ($lastmonth < 10)
            $lastmonth = '0' . $lastmonth;
        if ($month < 10)
            $month = '0' . $month;

        $lastUpdate = getdata('isogdarch', 'CreateDate', "WHERE ID = " . $_SESSION['session_id'] . " ORDER BY CreateDate DESC LIMIT 1;");
        $updatesCount = getdata('isogdarch', 'count(Code) as count', "WHERE CreateDate BETWEEN '" . $year . "-" . $month . "-00' AND '" . $today . "' AND ID = " . $_SESSION['session_id'] . ";");
        $sumByLastMonth = getdata('isogdweek', 'VolumeMeans', "WHERE week < '" . $year . "-" . $month . "-00" . "' AND ID = " . $_SESSION['session_id'] . " ORDER BY week DESC LIMIT 1;");
        $sumByThisMonth = getdata('isogdweek', 'VolumeMeans', "WHERE ID = " . $_SESSION['session_id'] . " ORDER BY week DESC LIMIT 1;");
        $sumByYear = getdata('isogdweek', 'VolumeMeans', "WHERE ID = " . $_SESSION['session_id'] . " ORDER BY week DESC LIMIT 1;");


        if (gettype($lastUpdate) != "string") {
            $result['lastupdate'] = $lastUpdate[0]['CreateDate'];
        }
        if (gettype($updatesCount) != "string") {
            $result['numberOfRecord'] = $updatesCount[0]['count'];
        }
        if (gettype($sumByLastMonth) != "string" and gettype($sumByThisMonth) != "string") {
            $result['sumByMonth'] = $sumByThisMonth[0]['VolumeMeans'] - $sumByLastMonth[0]['VolumeMeans'];
        }
        if (gettype($sumByYear) != "string") {
            $result['sumByYear'] = $sumByYear[0]['VolumeMeans'];
        }

        if ($month == 1) {
            $result['sumByMonth'] = $result['sumByYear'];
        }

        echo json_encode($result);
    }
}
?>