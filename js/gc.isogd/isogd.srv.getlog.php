<?php
/**
 * User: Julia Suhinina
 * Date: 10.09.13
 * Time: 15:13
 * Description:
 */
header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {
    include 'isogd.fn.tabledata.php';
    $result = array();
    if ($_SESSION['session_adm'] == 1) {
        $currentDate = date("Y-m-d");
        $halfYear = date("Y") . "-01-01";

        $isogdarch = getdata('isogdarch', "COUNT(Code) as sum, DATE_FORMAT(CreateDate, '%c-%e') as date", "WHERE CreateDate BETWEEN '" . $halfYear . "' and '" . $currentDate . "' GROUP BY DATE_FORMAT(CreateDate, '%c%e')");


        for ($x = 0; $x < count($isogdarch); $x++) {
            $data = '';
            $a = explode('-', $isogdarch[$x]['date']);
            if ($a[1] <= 15)
                $data = $a[0] . '-01';
            else
                $data = $a[0] . '-16';

            $result[$data] = $result[$data] + $isogdarch[$x]['sum'];
        }
        echo json_encode($result);

    }
}
