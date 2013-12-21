<?php
/**
 * Created by JetBrains PhpStorm.
 * User: julia
 * Date: 08.08.13
 * Time: 10:49
 * To change this template use File | Settings | File Templates.
 */

function getdata($TABLE_NAME, $FIELDS = '*', $CONDITION = '')
{
    try {
//        $db = new PDO('sqlite:db/isogd.db');
        include 'isogd.db.param.php';
        $db = new PDO($dbString, $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION);

        $db->exec("set names latin1");

        $types = array();

        $cur = $db->query("DESCRIBE " . $TABLE_NAME);

        foreach ($cur as $r) {
            $types[$r["Field"]] = $r["Type"];
        }

        $cur = $db->query("select " . $FIELDS . " from " . $TABLE_NAME . ' ' . $CONDITION . ";", PDO::FETCH_ASSOC);

        $arr = array();

        foreach ($cur as $row) {
            $dummy = array();
            foreach ($row as $k => $v) {
                if (is_null($v) != true) {
                    if ($types[$k] == "int(11)") {
                        $v = intval($v);
                    }
                    $dummy[$k] = $v;
                }

            }
            $arr[] = $dummy;
        }

        return $arr;
    } catch (Exception $e) {
        return 'Выброшено исключение: ' . $e->getMessage() . "\n";
    }
}

?>