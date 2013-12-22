<?php
/**
 * User: Julia Suhinina
 * Date: 22.12.13
 * Time: 16:03
 * Description:
 */
session_start();
header('Content-Type: application/json; charset=utf-8');
if (isset($_SESSION['session_id']) and $_SESSION['session_adm'] == 1) {

    try {
        include 'isogd.db.param.php';
        $tableArray = array(1 => 'isogd', 2 => 'MO', 3 => 'isogdweek', 4 => 'General_Information', 5 => 'passmo');

        $db = new PDO($dbString, $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION);
        $db->exec("set names latin1");

        $mdb = odbc_connect("DSN=isogd;", "", "");
//        $res = odbc_exec($mdb, "select * from ISOGD");
//        echo odbc_fetch_row($res);
//        while (odbc_fetch_row($res)) {
//            echo odbc_result($res, "ID");;
//        }

        foreach ($tableArray as $table) {
            $cur = $db->query("DESCRIBE " . $table . ";");
            $structure = $cur->fetchAll();
            $fields = '(';
            $i = 0;
            $len = count($structure);
            foreach ($structure as $r) {
                if ($r["Field"] == 'Code') {
                    $fields = $fields . 'Code INTEGER PRIMARY KEY NOT NULL';
                } else {
                    $fields = $fields . $r["Field"] . " " . $r["Type"];
                }

                if ($i != $len - 1) {
                    $fields = $fields . ', ';
                }
                $i++;
            }
            $fields = $fields . ")";

            odbc_exec($mdb, "DROP TABLE IF EXISTS " . $table);
            odbc_exec($mdb, "CREATE TABLE IF NOT EXISTS " . $table . $fields);
            echo 'ok';
        }
//        $res = odbc_exec($x, "select * from " . $TABLE_NAME);
//        $cur = $db->query("select " . $FIELDS . " from " . $TABLE_NAME . ' ' . $CONDITION . ";", PDO::FETCH_ASSOC);
//        $arr = array();

    } catch (Exception $e) {
        echo 'Выброшено исключение: ', $e->getMessage(), "\n";
    }
}
