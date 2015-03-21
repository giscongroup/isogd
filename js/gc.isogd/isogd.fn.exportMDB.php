<?php
/**
 * Created by PhpStorm.
 * User: Julia Sukhinina
 * Date: 25.12.13
 * Time: 23:56
 */
header('Content-Type: application/json; charset=utf-8');
session_start();
try {
    include 'isogd.db.param.php';
    $tableArray = array('isogd', 'MO', 'isogdweek', 'passMO', 'General_Information');
    $db = new PDO($dbString, $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION);
    $db->exec("set names latin1");

    $date = date('U');

    $srcfile = 'js\gc.isogd\db\default.mdb';
    $dstfile = 'js\gc.isogd\db\isogd_' . $date . ".mdb";

    copy($srcfile, $dstfile);

    $mdb = odbc_connect("DRIVER={Microsoft Access Driver (*.mdb)}; DBQ=" . $dstfile . ";", "", "");
    if (!$mdb) {
        echo "No Connect - нет связи" . "\n\r";
        echo odbc_error();
        exit;
    }

   // odbc_exec($mdb, "SET NAMES 'CP1251';");
   // odbc_exec($mdb, "SET client_encoding = 'CP1251';");

    foreach ($tableArray as $table) {
        $cur = $db->query("DESCRIBE " . $table . "");
        $tableConf = "](";
        $len = $cur->rowCount();
        $a = 0;
        $cur = $db->query("DESCRIBE " . $table . "");
        foreach ($cur as $r) {
            $a++;
            if ($r['Field'] != 'Code') {
                if ($r["Type"] === 'int(11)')
                    $r["Type"] = 'INTEGER';
                $tableConf = $tableConf . '[' . $r["Field"] . '] ' . $r["Type"];
            } else {
                $tableConf = $tableConf . '[' . $r["Field"] . '] ' . ' COUNTER';
            }
            if ($a < $len) {
                $tableConf = $tableConf . ', ';
            }
        }
        $tableConf = $tableConf . ');';
       // $res = odbc_exec($mdb, "DROP TABLE " . $table);
        $res = odbc_exec($mdb, "CREATE TABLE [" . $table . $tableConf);
        $cur = $db->query("SELECT * FROM " . $table);
        foreach ($cur as $r) {
            $fields = "";
            $values = "";
            $sep = "";
            $sql = '';
            foreach ($r as $key => $val) {
                if (is_null($val) != true && $val !== "" && is_integer($key) == false) {
                    $fields = $fields . $sep . $key;
                    $val = iconv('utf-8', 'CP1251', $val);
                    $values = $values . $sep . "'" . $val . "'";
                    $sep = ", ";
                }
            }
            $sql = "INSERT INTO " . $table . "(" . $fields . ") values (" . $values . ");";
            $res = odbc_exec($mdb, $sql);
        }
    }
    echo 'http://isogd.arhikub.ru/js/gc.isogd/db/isogd_' . $date . ".mdb";
} catch (Exception $e) {
    //echo 'Выброшено исключение: ', $e->getMessage(), "\n";
}