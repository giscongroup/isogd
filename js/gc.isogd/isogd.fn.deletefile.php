<?php
/**
 * User: Julia Suhinina
 * Date: 14.08.13
 * Time: 12:19
 * Description:
 */
session_start();

if (isset($_SESSION['session_id'])) {

    if ($_SESSION['session_adm'] == 1 or $_SESSION['session_id'] == $_GET['ID']) {
//        $db = new PDO('sqlite:db/isogd.db');
        include 'isogd.db.param.php';
        $db = new PDO($dbString, $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION);
        $sql = "UPDATE files SET deleteDate = '" . date("Y-m-d\TG:i:s\Z") . "' WHERE Code = " . $_GET['code'];
        echo $sql;
        $db->exec($sql);
        echo "Complet!";
    }
}
