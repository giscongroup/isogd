<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 18.12.14
 * Time: 11:48
 */

header('Content-Type: application/json; charset=utf-8');
session_start();
try {
    include 'isogd.db.param.php';
    include 'isogd.fn.tabledata.php';
    $tableArray = array('isogd', 'MO', 'isogdweek', 'passMO', 'General_Information');
    $db = new PDO($dbString, $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION);
    $db->exec("set names latin1");

   $tablename = $_GET['tablename'];

   // $cur = $db->query("SELECT * FROM isogd INTO OUTFILE 'C:/test/test.csv' FIELDS TERMINATED BY ';';");
    //$cur = $db->query("SELECT *  FROM isogd;");
    if ($_SESSION['session_adm'] == 1) {
        $cur = getdata('isogd', 'isogd.Code, MO.NameMO, isogd.QuantityFactsGrantingData1, isogd.QuantityFactsGrantingData2, isogd.QuantityFactsGrantingData3, isogd.QuantityFactsGrantingData4,
    isogd.VolumeMeans, isogd.denials, isogd.unpaidRequests', 'JOIN MO on isogd.ID = MO.ID');

        $header = "Код;Муниципальное образование;Количество фактов предоставления сведений без взимания" .
            " платы;Количество фактов предоставления сведений с взиманием платы;" .
            "Количество фактов предоставления копии одного документа без взимания " .
            "платы;Количество фактов предоставления копии одного документа с взиманием " .
            "платы;Объем средств, полученных бюджетом за предоставление сведений ИСОГД в " .
            "текущем году, тыс. руб.;Количество фактов отказа;Неоплаченные заявки;";
        $data = '';
        foreach ($cur as $r) {
            $line = '';
            foreach ($r as $key => $val) {

                if ((!isset($val)) || ($val == "")) {
                    $val = ";";
                } else {
                    $val = str_replace('"', '""', $val);
                    $val = '"' . $val . '"' . ";";
                }
                $line .= $val;
            }
            $data .= trim($line) . "\n";
        }

        $data = str_replace("\r", "", $data);

        if ($data == "") {
            $data = "\n(0) Records Found!\n";
        }
    }else {

        $year = date("Y");

        $cur = getdata('isogdweek', 'isogdweek.Code, isogdweek.week, isogdweek.QuantityFactsGrantingData1, isogdweek.QuantityFactsGrantingData2, isogdweek.QuantityFactsGrantingData3, isogdweek.QuantityFactsGrantingData4,
    isogdweek.VolumeMeans, isogdweek.denials, isogdweek.unpaidRequests', "WHERE week like '" . $year . "-%' AND ID = " . $_SESSION['session_id'] . " ORDER BY week DESC;");

        $header = "Код;Дата;Количество фактов предоставления сведений без взимания" .
            " платы;Количество фактов предоставления сведений с взиманием платы;" .
            "Количество фактов предоставления копии одного документа без взимания " .
            "платы;Количество фактов предоставления копии одного документа с взиманием " .
            "платы;Объем средств, полученных бюджетом за предоставление сведений ИСОГД в " .
            "текущем году, тыс. руб.;Количество фактов отказа;Неоплаченные заявки;";
        $data = '';
        foreach ($cur as $r) {
            $line = '';
            foreach ($r as $key => $val) {

                if ((!isset($val)) || ($val == "")) {
                    $val = ";";
                } else {
                    $val = str_replace('"', '""', $val);
                    $val = '"' . $val . '"' . ";";
                }
                $line .= $val;
            }
            $data .= trim($line) . "\n";
        }

        $data = str_replace("\r", "", $data);

        if ($data == "") {
            $data = "\n(0) Records Found!\n";
        }
    }
    $csv = iconv("UTF-8", "Windows-1251", $header."\n".$data);
    //header('Content-Encoding: UTF-8');
    header('Content-Encoding: Windows-1251');
    // header("Content-type: application/octet-stream; charset=UTF-8");
    header("Content-type: application/octet-stream; charset=Windows-1251");
    header("Content-Disposition: attachment; filename=isogd.csv");
    header("Pragma: no-cache");
    header("Expires: 0");
    //$header = iconv("UTF-8", "Windows-1252", $header);
    print $csv;//iconv("UTF-8", "Windows-1251", $header);//;//"$header\n$data";//$csv;
}

 catch (Exception $e) {
    echo 'Выброшено исключение: ', $e->getMessage(), "\n";
}