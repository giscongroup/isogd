<?php

header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {
    include 'isogd.fn.tabledata.php';
    $result = array();

    $currentWeek = date("W");
    if ($currentWeek % 2 <> 0) {
        $currentWeek = $currentWeek + 1;
    }

    $today = date("Y-m-d");
    $startYear = date("Y") . "-01-01";

    $year = date("Y");
    $month = date("m");
    $day = date("d") + 1;

    $lastmonth = $month - 1;

    if ($month < 10)
        $month = '0' . $month;

    if ($day < 10)
        $day = '0' . $day;

    if ($lastmonth < 10)
        $lastmonth = '0' . $lastmonth;

    if ($day <= 15) {
        $startMonth = date("Y-m") . "-01";

        $startMonthPY = ($year - 1) . "-" . $lastmonth . "-16";
        $endMonthPY = ($year - 1) . "-" . $lastmonth . "-31";

    } else {
        $startMonth = date("Y-m") . "-16";
        $startMonthPY = ($year - 1) . "-" . $lastmonth . "-01";
        $endMonthPY = ($year - 1) . "-" . $lastmonth . "-16";
    }

    $today = $year . '-' . $month . '-' . $day;

    if ($_SESSION['session_adm'] == 1) {

        $isogd = getdata('isogd', 'isogd.*, MO.NameMO', 'JOIN MO on isogd.ID = MO.ID');
        $isogdarch = getdata('isogdarch', '*', "WHERE CreateDate BETWEEN '" . $year . "-" . $month . "-01' AND '" . $today . "' ORDER BY CreateDate LIMIT 15;");

        $isogdByCurrentPeriod = getdata('isogdarch', '*', "WHERE CreateDate BETWEEN '" . $startMonth . "' AND '" . $today . "';");

        $isogdWeek = getdata('isogdweek', '*', "WHERE week BETWEEN '" . $startYear . "' and '" . $today . "' ORDER BY week");

        $isogdPreviousYear = getdata('isogdweek', '*', "WHERE week BETWEEN '" . ($year - 1) . "-12-15' and '" . ($year - 1) . "-12-31'");
        $isogdPreviousYearSamePeriod = getdata('isogdweek', '*', "WHERE week BETWEEN '" . $startMonthPY . "' and '" . $endMonthPY . "'");

        if (gettype($isogd) != "string") {
            $result ['lastdata'] = $isogd;
        }
        if (gettype($isogdarch) != "string") {
            $result ['alldata'] = $isogdarch;
        }

        if (gettype($isogdWeek) != "string") {
            $result ['isogdWeek'] = $isogdWeek;
        }
        if (gettype($isogdByCurrentPeriod) != "string") {
            $result ['isogdLog'] = $isogdByCurrentPeriod;
        }
        if (gettype($isogdPreviousYear) != "string") {
            $result ['isogdPreviousYear'] = $isogdPreviousYear;
        }
        if (gettype($isogdPreviousYearSamePeriod) != "string") {
            $result ['isogdPreviousYearSamePeriod'] = $isogdPreviousYearSamePeriod;
        }
        echo json_encode($result);
    } else {

        $isogd = getdata('isogd', 'isogd.*, MO.NameMO', 'JOIN MO on isogd.ID = MO.ID WHERE isogd.ID = ' . $_SESSION['session_id']);
        $isogdarch = getdata('isogdarch', '*', 'WHERE ID = ' . $_SESSION['session_id'] . " AND (CreateDate BETWEEN '" . $year . "-" . $lastmonth . "-01' AND '" . $today . "');");
        $isogdWeek = getdata('isogdweek', '*', "WHERE ID = " . $_SESSION['session_id'] . " and week BETWEEN '" . $startYear . "' and '" . $currentWeek . "' ORDER BY week");

        $isogdByCurrentPeriod = getdata('isogdarch', '*', "WHERE CreateDate BETWEEN '" . date("Y-m") . "-00" . "' AND '" . $today . "' and ID = " . $_SESSION['session_id'] . ";");

        if (gettype($isogd) != "string") {
            $result ['lastdata'] = $isogd;
        }
        if (gettype($isogdarch) != "string") {
            $result ['alldata'] = $isogdarch;
        }
        if (gettype($isogdWeek) != "string") {
            $result ['isogdWeek'] = $isogdWeek;
        }
        if (gettype($isogdByCurrentPeriod) != "string") {
            $result ['isogdLog'] = $isogdByCurrentPeriod;
        }
        echo json_encode($result);
    }
}
?>