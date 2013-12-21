<?php
/**
 * Created by JetBrains PhpStorm.
 * User: user
 * Date: 06.08.13
 * Time: 14:23
 * To change this template use File | Settings | File Templates.
 */

$TABLE_NAME = "isogd";
header('Content-Type: application/json; charset=utf-8');
try {
//    $db = new PDO('sqlite:isogd.db');
//    $db->setAttribute(PDO::ATTR_ERRMODE,
//        PDO::ERRMODE_EXCEPTION);
//
//    $db->exec("DROP TABLE IF EXISTS " . $TABLE_NAME);
//
//    $db->exec("CREATE TABLE IF NOT EXISTS " . $TABLE_NAME . "
// (
//Code INTEGER PRIMARY KEY NOT NULL,
//ID INTEGER,
//QuantityFactsGrantingData1 INTEGER DEFAULT 0,
//QuantityFactsGrantingData2 INTEGER DEFAULT 0,
//QuantityFactsGrantingData3 INTEGER DEFAULT 0,
//QuantityFactsGrantingData4 INTEGER DEFAULT 0,
//VolumeMeans INTEGER DEFAULT 0,
//week TEXT
//);");

    $db = new PDO("mysql:host=gs.sktisiz.ru;dbname=isogd", 'user', 'Riacddb2RF');
    $db->setAttribute(PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION);

//    QuantityFactsGrantingData1 INTEGER DEFAULT 0,

    $x = odbc_connect("DSN=isogd;", "", "");
    $res = odbc_exec($x, "select * from " . $TABLE_NAME);

    $resultArray = array();
    $row = odbc_fetch_array($res);
    $test = "";

    $db->query("DELETE FROM isogd;");

    $types = array();

    $cur = $db->query("DESCRIBE " . $TABLE_NAME . "");
    foreach ($cur as $r) {
        $types[$r["Field"]] = $r["Type"];

    }

    while ($row) {
        $fields = "";
        $values = "";
        $sep = "";
        foreach ($row as $key => $val) {
            if ($key == "Код") {
                $key = "Code";
            }
            if (is_null($val) != true && $val !== "") {

                $fields = $fields . $sep . $key;
//                print_r($types[$key]);
//                if ($types[$key] == "mediumtext") {
                    $values = $values . $sep . "'" . $val . "'";
//                } else {

//                    $values = $values . $sep . $val;
//                }
                $sep = ", ";
            }
        }

        $test = "INSERT INTO " . $TABLE_NAME . "(" . $fields . ") values (" . $values . ");";
        echo $test;
        echo "<br/>";

        $db->exec($test);

        $row = odbc_fetch_array($res);
    }


    echo 'Completed!';
} catch (Exception $e) {
    echo 'Выброшено исключение: ', $e->getMessage(), "\n";
}